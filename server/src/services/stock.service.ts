import prisma from "../lib/prisma";
import { config } from "../utils/app.config";
import { StockStatus } from "../generated/prisma/enums";
import {
  CreateStockSchema,
  GetAllStocksSchema,
  UpdateStockSchema,
} from "../validation/stock.validation";
import { ForbiddenException, NotFoundException } from "../utils/app-error";
import { generateStockSlug } from "../utils/helper";
import { deleteFromR2 } from "../lib/r2";
import { deleteFromCloudinary } from "../lib/cloudinary";

const selectField = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
      totalFollowers: true,
      totalFollowing: true,
      _count: {
        select: { uploadedStocks: true },
      },
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  fileType: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  files: {
    select: {
      id: true,
      url: true,
      purpose: true,
      publicId: true,
      format: true,
      bytes: true,
      width: true,
      height: true,
    },
  },
  likes: {
    take: 10,
    orderBy: {
      createdAt: "desc" as const,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  },
};

export const getAllStocks = async (input: GetAllStocksSchema) => {
  const {
    page,
    limit,
    search,
    categoryId,
    fileTypeId,
    status,
    isPremium,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = input;

  const where: any = {};

  // Search by title, slug, or keywords
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { keywords: { has: search } }, // Approximate check for keyword
    ];
  }

  if (categoryId) where.categoryId = categoryId;
  if (fileTypeId) where.fileTypeId = fileTypeId;
  if (status) where.status = status;
  if (isPremium !== undefined) where.isPremium = isPremium;

  // Price Range
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const [stocks, totalCount] = await Promise.all([
    prisma.stock.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: selectField,
    }),
    prisma.stock.count({ where }),
  ]);

  return {
    stocks,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
};

export const getPopularFreeVectorStocks = async () => {
  // 1. Get raw IDs with weighted score
  // Formula: (Views * 1) + (Likes * 3) + (Downloads * 10)
  const stocksRaw = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT s.id
      FROM stock s
      JOIN file_type ft ON s."fileTypeId" = ft.id
      WHERE s.status = 'APPROVED'
      AND s."isPremium" = false
      AND ft.slug = 'vector'
      ORDER BY (s."totalViews" * 1 + s."totalLikes" * 3 + s."totalDownloads" * 10) DESC
      LIMIT 10
    `;

  const ids = stocksRaw.map((s) => s.id);

  if (ids.length === 0) {
    return [];
  }

  // 2. Fetch full objects
  const stocks = await prisma.stock.findMany({
    where: { id: { in: ids } },
    include: selectField,
  });

  // 3. Sort back to match the raw query order
  const sortedStocks = ids
    .map((id) => stocks.find((s) => s.id === id))
    .filter((s) => s !== undefined);

  return sortedStocks;
};

export const getTrendingStocks = async (fileType?: string, limit = 10) => {
  // 1. Get raw IDs with weighted score
  // Formula: (Views * 1) + (Likes * 3) + (Downloads * 10)
  // Criteria: Created in the last 30 days, Approved, Any type/category/premium status
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  // Determine if we need to filter by fileType
  const filterByFileType = fileType && fileType !== "all";

  let stocksRaw: Array<{ id: string }>;

  if (filterByFileType) {
    stocksRaw = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT s.id
      FROM stock s
      JOIN file_type ft ON s."fileTypeId" = ft.id
      WHERE s.status = 'APPROVED'
      AND s."createdAt" >= ${oneMonthAgo}
      AND ft.slug = ${fileType}
      ORDER BY (s."totalViews" * 1 + s."totalLikes" * 3 + s."totalDownloads" * 10) DESC
      LIMIT ${limit}
    `;
  } else {
    stocksRaw = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT s.id
      FROM stock s
      WHERE s.status = 'APPROVED'
      AND s."createdAt" >= ${oneMonthAgo}
      ORDER BY (s."totalViews" * 1 + s."totalLikes" * 3 + s."totalDownloads" * 10) DESC
      LIMIT ${limit}
    `;
  }

  const ids = stocksRaw.map((s) => s.id);

  if (ids.length === 0) {
    return [];
  }

  // 2. Fetch full objects
  const stocks = await prisma.stock.findMany({
    where: { id: { in: ids } },
    include: selectField,
  });

  // 3. Sort back to match the raw query order
  const sortedStocks = ids
    .map((id) => stocks.find((s) => s.id === id))
    .filter((s) => s !== undefined);

  return sortedStocks;
};

export const getStockById = async (id: string, userId?: string) => {
  const stock = await prisma.stock.findUnique({
    where: { id },
    include: selectField,
  });

  if (!stock) {
    throw new NotFoundException("Stock not found");
  }

  let isLiked = false;
  if (userId) {
    const like = await prisma.like.findUnique({
      where: {
        userId_stockId: {
          userId,
          stockId: id,
        },
      },
    });
    isLiked = !!like;
  }

  return { ...stock, isLiked };
};

export const getRelatedStocks = async (id: string, limit = 20) => {
  // 1. Get the current stock to find its category and tags
  const currentStock = await prisma.stock.findUnique({
    where: { id },
    select: {
      categoryId: true,
      keywords: true,
    },
  });

  if (!currentStock) {
    throw new NotFoundException("Stock not found");
  }

  // 2. Find related stocks
  // Strategy:
  // - Must be APPROVED
  // - Must be same Category
  // - Exclude current stock
  // - Order by number of matching keywords (intersection)

  const relatedStocksRaw = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT s.id
      FROM stock s
      WHERE s.status = 'APPROVED'
      AND s."categoryId" = ${currentStock.categoryId}
      AND s.id != ${id}
      ORDER BY (
        SELECT COUNT(*)
        FROM unnest(s.keywords) k1
        JOIN unnest(${currentStock.keywords}::text[]) k2 ON k1 = k2
      ) DESC, s."createdAt" DESC
      LIMIT ${limit}
    `;

  const ids = relatedStocksRaw.map((s) => s.id);

  if (ids.length === 0) {
    return [];
  }

  // 3. Fetch full objects
  const stocks = await prisma.stock.findMany({
    where: { id: { in: ids } },
    include: selectField,
  });

  // 4. Sort back to match the raw query order (by relevance)
  const sortedStocks = ids
    .map((id) => stocks.find((s) => s.id === id))
    .filter((s) => s !== undefined);

  return sortedStocks;
};

export const createStock = async (
  input: CreateStockSchema & { userId: string },
) => {
  // 1. Currency Conversion
  let finalPrice = input.price;
  if (input.currency === "USD") {
    // Convert to IDR
    finalPrice = input.price * (config.EXCHANGE_RATE.USD || 16000);
  }

  // 2. Generate Slug if not present (simple version)
  const slug = generateStockSlug(input.title);

  // 3. Database Transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create Stock
    const stock = await tx.stock.create({
      data: {
        userId: input.userId,
        title: input.title,
        slug,
        description: input.description,
        categoryId: input.categoryId,
        fileTypeId: input.fileTypeId,
        keywords: input.keywords,
        colors: input.colors || [],
        isPremium: input.isPremium,
        price: finalPrice, // Saved as IDR
        status: StockStatus.PENDING, // Always pending on upload
        files: {
          create: input.files.map((file) => ({
            purpose: file.purpose,
            publicId: file.publicId,
            url: file.url,
            format: file.format,
            bytes: file.bytes,
            width: file.width,
            height: file.height,
          })),
        },
      },
      include: {
        files: true,
      },
    });

    return stock;
  });

  return result;
};

export const updateStock = async (
  id: string,
  userId: string,
  data: UpdateStockSchema,
) => {
  // 1. Currency Conversion if price/currency is updated
  let finalPrice = data.price;
  if (data.price !== undefined && data.currency === "USD") {
    finalPrice = data.price * (config.EXCHANGE_RATE.USD || 16000);
  } else if (
    data.price !== undefined &&
    (!data.currency || data.currency === "IDR")
  ) {
    finalPrice = data.price;
  }

  // 2. Transaction
  const result = await prisma.$transaction(async (tx) => {
    // Check ownership
    const existingStock = await tx.stock.findUnique({
      where: { id },
      select: { userId: true, title: true },
    });

    if (!existingStock) {
      throw new NotFoundException("Stock not found");
    }

    // Verify user role to allow Admins to edit any stock
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (existingStock.userId !== userId && user?.role !== "admin") {
      throw new ForbiddenException(
        "You do not have permission to perform this action",
      );
    }

    // Generate new slug only if title has changed
    let newSlug = undefined;
    if (data.title && data.title !== existingStock.title) {
      newSlug = generateStockSlug(data.title);
    }

    // Update Stock
    await tx.stock.update({
      where: { id },
      data: {
        title: data.title,
        slug: newSlug,
        description: data.description,
        categoryId: data.categoryId,
        fileTypeId: data.fileTypeId,
        keywords: data.keywords,
        colors: data.colors,
        isPremium: data.isPremium,
        price: finalPrice,
        status: StockStatus.PENDING, // Set status back to pending
      },
    });

    // Handle Files Update
    if (data.files && data.files.length > 0) {
      // 1. Identify files to remove
      // Get all current files for this stock
      const currentFiles = await tx.stockFile.findMany({
        where: { stockId: id },
      });
      const newPublicIds = new Set(data.files.map((f) => f.publicId));
      const filesToRemove = currentFiles.filter(
        (f) => !newPublicIds.has(f.publicId),
      );

      // 2. Delete from Storage (R2 / Cloudinary)
      await Promise.all(
        filesToRemove.map(async (file) => {
          try {
            if (file.purpose === "PREVIEW") {
              await deleteFromCloudinary(file.publicId);
            } else if (file.purpose === "ORIGINAL") {
              await deleteFromR2(file.publicId);
            }
          } catch (error) {
            console.error(
              `Failed to delete file from storage: ${file.publicId}`,
              error,
            );
          }
        }),
      );

      // 3. Update DB (Delete All & Recreate)
      await tx.stockFile.deleteMany({
        where: { stockId: id },
      });

      await tx.stockFile.createMany({
        data: data.files.map((file) => ({
          stockId: id,
          purpose: file.purpose,
          publicId: file.publicId,
          url: file.url,
          format: file.format,
          bytes: file.bytes,
          width: file.width,
          height: file.height,
        })),
      });
    }

    // Return the Updated Stock with all relations
    return await tx.stock.findUnique({
      where: { id },
      include: selectField,
    });
  });

  return result;
};

export const updateStockStatus = async (
  id: string,
  status: StockStatus,
  rejectionReason?: string,
) => {
  const stock = await prisma.stock.update({
    where: { id },
    data: {
      status,
      rejectionReason: status === "REJECTED" ? rejectionReason : null,
    },
  });

  return stock;
};

export const deleteStock = async (id: string, userId: string) => {
  const existingStock = await prisma.stock.findUnique({ where: { id } });
  if (!existingStock) {
    throw new NotFoundException("Stock not found");
  }

  // Verify user role to allow Admins to edit any stock
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (existingStock.userId !== userId && user?.role !== "admin") {
    throw new ForbiddenException(
      "You do not have permission to perform this action",
    );
  }

  // Delete files from storage
  const files = await prisma.stockFile.findMany({
    where: { stockId: id },
  });

  await Promise.all(
    files.map(async (file) => {
      try {
        if (file.purpose === "PREVIEW") {
          await deleteFromCloudinary(file.publicId);
        } else if (file.purpose === "ORIGINAL") {
          await deleteFromR2(file.publicId);
        }
      } catch (error) {
        console.error(
          `Failed to delete file from storage: ${file.publicId}`,
          error,
        );
      }
    }),
  );

  await prisma.stock.delete({
    where: { id },
  });

  return true;
};

export const toggleLike = async (userId: string, stockId: string) => {
  const stock = await prisma.stock.findUnique({
    where: { id: stockId },
  });

  if (!stock) {
    throw new NotFoundException("Stock not found");
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_stockId: {
        userId,
        stockId,
      },
    },
  });

  if (existingLike) {
    // Unlike
    await prisma.$transaction([
      prisma.like.delete({
        where: {
          userId_stockId: {
            userId,
            stockId,
          },
        },
      }),
      prisma.stock.update({
        where: { id: stockId },
        data: {
          totalLikes: {
            decrement: 1,
          },
        },
      }),
    ]);
    return { liked: false };
  } else {
    // Like
    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId,
          stockId,
        },
      }),
      prisma.stock.update({
        where: { id: stockId },
        data: {
          totalLikes: {
            increment: 1,
          },
        },
      }),
    ]);
    return { liked: true };
  }
};

export const incrementView = async (
  stockId: string,
  ipAddress?: string,
  userId?: string,
) => {
  const stock = await prisma.stock.findUnique({
    where: { id: stockId },
  });

  if (!stock) {
    throw new NotFoundException("Stock not found");
  }

  // 1. Check for recent view (last 24 hours)
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

  const viewWhereClause: any = {
    stockId,
    createdAt: {
      gte: twentyFourHoursAgo,
    },
  };

  if (userId) {
    viewWhereClause.userId = userId;
  } else if (ipAddress) {
    viewWhereClause.ipAddress = ipAddress;
  } else {
    // If no identifier, just increment (or skip logic depends on requirement)
    // For now, let's treat it as a valid view but without duplicate check if no ID
    // But usually every request has an IP.
    return { viewed: true };
  }

  const existingView = await prisma.stockView.findFirst({
    where: viewWhereClause,
  });

  if (existingView) {
    return { viewed: false, message: "Already viewed in last 24h" };
  }

  // 2. Transaction: Log View & Increment Counter
  await prisma.$transaction([
    prisma.stockView.create({
      data: {
        stockId,
        userId,
        ipAddress,
      },
    }),
    prisma.stock.update({
      where: { id: stockId },
      data: {
        totalViews: {
          increment: 1,
        },
      },
    }),
  ]);

  return { viewed: true };
};
