import prisma from "../../lib/prisma";
import { NotFoundException } from "../../utils/app-error";

export const getStockListService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filterStatus: string;
}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    filterStatus = "all",
  } = query;

  const skip = (page - 1) * limit;
  const baseWhere: any = {};
  if (search) {
    baseWhere.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  const where: any = { ...baseWhere };

  if (filterStatus === "DELETED") {
    where.deletedAt = { not: null };
  } else {
    // where.deletedAt = null;
    if (filterStatus !== "all") {
      where.status = filterStatus;
    }
  }

  const orderBy: any = {};
  if (
    sortBy === "name" ||
    sortBy === "createdAt" ||
    sortBy === "totalDownloads" ||
    sortBy === "totalLikes"
  ) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy["createdAt"] = "desc";
  }

  const [totalItems, items, allCount, pendingCount, approvedCount, rejectedCount, deletedCount] = await prisma.$transaction([
    prisma.stock.count({ where }),
    prisma.stock.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: {
          select: { id: true, name: true },
        },
        fileType: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        files: true,
      },
    }),
    prisma.stock.count({ where: { ...baseWhere } }), // we might want deletedAt = null if 'all' excludes deleted, but for now we follow the existing pattern
    prisma.stock.count({ where: { ...baseWhere, status: "PENDING" } }),
    prisma.stock.count({ where: { ...baseWhere, status: "APPROVED" } }),
    prisma.stock.count({ where: { ...baseWhere, status: "REJECTED" } }),
    prisma.stock.count({ where: { ...baseWhere, deletedAt: { not: null } } }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    meta: {
      totalItems,
      currentPage: page,
      totalPages,
      limit,
      counts: {
        all: allCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        deleted: deletedCount,
      }
    },
  };
};

export const saveMetadataService = async (
  id: string,
  data: {
    title: string;
    categoryId: string;
    fileTypeId: string;
    description: string;
    keywords: string[];
    isPremium: boolean;
    price: number;
  },
) => {
  const existingStock = await prisma.stock.findUnique({ where: { id } });
  if (!existingStock) {
    throw new NotFoundException("Stock not found");
  }

  const updatedStock = await prisma.stock.update({
    where: { id },
    data: {
      title: data.title,
      categoryId: data.categoryId,
      fileTypeId: data.fileTypeId,
      description: data.description,
      keywords: data.keywords,
      isPremium: data.isPremium,
      price: data.price,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
      fileType: {
        select: { id: true, name: true },
      },
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      files: true,
    },
  });

  return updatedStock;
};

export const approveStockService = async (id: string, reviewerId?: string) => {
  const existingStock = await prisma.stock.findUnique({ where: { id } });
  if (!existingStock) {
    throw new NotFoundException("Stock not found");
  }

  const updatedStock = await prisma.stock.update({
    where: { id },
    data: {
      status: "APPROVED",
      reviewerId: reviewerId || null,
      rejectionReason: null, // Clear any previous rejection reason
    },
  });

  return updatedStock;
};

export const rejectStockService = async (
  id: string,
  reviewerId?: string,
  rejectionReason?: string,
) => {
  const existingStock = await prisma.stock.findUnique({ where: { id } });
  if (!existingStock) {
    throw new NotFoundException("Stock not found");
  }

  const updatedStock = await prisma.stock.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewerId: reviewerId || null,
      rejectionReason: rejectionReason || null,
    },
  });

  return updatedStock;
};

export const deleteStockService = async (id: string) => {
  const existingStock = await prisma.stock.findUnique({ where: { id } });
  if (!existingStock) {
    throw new NotFoundException("Stock not found");
  }

  const deletedStock = await prisma.stock.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  return deletedStock;
};
