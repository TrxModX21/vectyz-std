import { Prisma } from "../generated/prisma/client";
import prisma from "../lib/prisma";
import { GetMyStocksSchema } from "../validation/user-stock.validation";

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
};

export const getMyStockListService = async (
  userId: string,
  input: GetMyStocksSchema,
) => {
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

  const where: Prisma.StockWhereInput = {
    userId,
    status,
  };

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
