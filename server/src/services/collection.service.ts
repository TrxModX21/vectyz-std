import prisma from "../lib/prisma";
import { generateStockSlug } from "../utils/helper";
import {
  CreateCollectionType,
  FetchAllCollectionSchema,
  UpdateCollectionType,
  AddItemToCollectionType,
} from "../validation/collection.validation";
import { FilePurpose } from "../generated/prisma/client";
import { ForbiddenException, NotFoundException } from "../utils/app-error";

const selectField = {
  user: {
    select: {
      id: true,
      name: true,
      image: true,
      username: true,
    },
  },
  items: {
    take: 4,
    orderBy: { createdAt: "desc" as const },
    include: {
      stock: {
        include: {
          files: {
            where: { purpose: FilePurpose.PREVIEW },
          },
        },
      },
    },
  },
  _count: {
    select: { items: true },
  },
};

export const fetchAllCollectionService = async (
  input: FetchAllCollectionSchema & { currentUserId?: string },
) => {
  const { limit, page, search, sortOrder, userId, currentUserId } = input;

  const where: any = {
    AND: [],
  };

  if (search) {
    where.AND.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  // LOGIKA PRIVASI:
  // 1. Jika filter userId ada (misal lihat profil orang):
  if (userId) {
    where.AND.push({ userId });
    // Kalau yang dilihat bukan diri sendiri, HANYA tampilkan yang TIDAK private
    if (userId !== currentUserId) {
      where.AND.push({ isPrivate: false });
    }
  }
  // 2. Jika tidak ada filter userId (misal halaman explore):
  else {
    // Tampilkan yang Public ATAU milik diri sendiri
    const visibilityCondition: any = { isPrivate: false };
    if (currentUserId) {
      where.AND.push({
        OR: [{ isPrivate: false }, { userId: currentUserId }],
      });
    } else {
      where.AND.push({ isPrivate: false });
    }
  }
  const [collections, totalCount] = await Promise.all([
    prisma.collection.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
      include: selectField,
    }),
    prisma.collection.count({ where }),
  ]);
  return {
    collections,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
};

export const createCollectionService = async (
  input: CreateCollectionType & { userId: string },
) => {
  const { name, description, userId, isPrivate, isFeatured } = input;
  // Cek role user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) throw new Error("User not found");
  const isAdmin = user.role === "admin";

  // Logika enforce role
  const finalIsPrivate = isAdmin ? (isPrivate ?? true) : true;
  const finalIsFeatured = isAdmin ? (isFeatured ?? false) : false;

  const slug = generateStockSlug(name);

  const newCollection = await prisma.collection.create({
    data: {
      name,
      slug,
      description,
      userId,
      isPrivate: finalIsPrivate,
      isFeatured: finalIsFeatured,
    },
    // Tidak perlu include items saat create karena pasti kosong
  });
  return newCollection;
};

export const getCollectionDetailService = async (
  collectionId: string,
  currentUserId?: string
) => {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: selectField,
  });

  if (!collection) {
    throw new NotFoundException("Collection not found");
  }

  // Privacy check
  if (collection.isPrivate && collection.userId !== currentUserId) {
    throw new ForbiddenException("You do not have permission to view this collection");
  }

  return collection;
};

export const updateCollectionService = async (
  collectionId: string,
  input: UpdateCollectionType,
  userId: string
) => {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { userId: true },
  });

  if (!collection) {
    throw new NotFoundException("Collection not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (collection.userId !== userId && user.role !== "admin") {
    throw new ForbiddenException("You do not have permission to update this collection");
  }

  const { name, description, isPrivate, isFeatured } = input;
  let slug;
  if (name) {
    slug = generateStockSlug(name);
  }

  const updateData: any = {};
  if (name) {
    updateData.name = name;
    updateData.slug = slug;
  }
  if (description !== undefined) updateData.description = description;
  if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

  if (user.role === "admin" && isFeatured !== undefined) {
    updateData.isFeatured = isFeatured;
  }

  const updatedCollection = await prisma.collection.update({
    where: { id: collectionId },
    data: updateData,
  });

  return updatedCollection;
};

export const deleteCollectionService = async (
  collectionId: string,
  userId: string
) => {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { userId: true },
  });

  if (!collection) {
    throw new NotFoundException("Collection not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (collection.userId !== userId && user.role !== "admin") {
    throw new ForbiddenException("You do not have permission to delete this collection");
  }

  await prisma.collection.delete({
    where: { id: collectionId },
  });

  return true;
};

export const addItemToCollectionService = async (
  collectionId: string,
  input: AddItemToCollectionType,
  userId: string
) => {
  const { stockId } = input;

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { userId: true },
  });

  if (!collection) {
    throw new NotFoundException("Collection not found");
  }

  // Only owner can add items
  if (collection.userId !== userId) {
    throw new ForbiddenException("You do not have permission to add items to this collection");
  }

  const stock = await prisma.stock.findUnique({
    where: { id: stockId },
  });

  if (!stock) {
    throw new NotFoundException("Stock not found");
  }

  // Check if item already exists to avoid unique constraint error
  const existingItem = await prisma.collectionItem.findUnique({
    where: {
      collectionId_stockId: {
        collectionId,
        stockId,
      },
    },
  });

  if (existingItem) {
    return existingItem;
  }

  const newItem = await prisma.collectionItem.create({
    data: {
      collectionId,
      stockId,
    },
  });

  return newItem;
};

export const removeItemFromCollectionService = async (
  collectionId: string,
  stockId: string,
  userId: string
) => {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { userId: true },
  });

  if (!collection) {
    throw new NotFoundException("Collection not found");
  }

  // Only owner can remove items
  if (collection.userId !== userId) {
    throw new ForbiddenException("You do not have permission to remove items from this collection");
  }

  const existingItem = await prisma.collectionItem.findUnique({
    where: {
      collectionId_stockId: {
        collectionId,
        stockId,
      },
    },
  });

  if (!existingItem) {
    throw new NotFoundException("Stock not found in collection");
  }

  await prisma.collectionItem.delete({
    where: {
      collectionId_stockId: {
        collectionId,
        stockId,
      },
    },
  });

  return true;
};

export const toggleCollectionStatusService = async (collectionId: string) => {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { isPrivate: true },
  });

  if (!collection) {
    throw new NotFoundException("Collection not found");
  }

  const updatedCollection = await prisma.collection.update({
    where: { id: collectionId },
    data: { isPrivate: !collection.isPrivate },
  });

  return updatedCollection;
};

export const toggleCollectionFeaturedService = async (collectionId: string) => {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { isFeatured: true },
  });

  if (!collection) {
    throw new NotFoundException("Collection not found");
  }

  const updatedCollection = await prisma.collection.update({
    where: { id: collectionId },
    data: { isFeatured: !collection.isFeatured },
  });

  return updatedCollection;
};
