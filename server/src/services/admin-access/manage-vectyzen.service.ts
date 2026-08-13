import {
  NotFoundException,
  InternalServerException,
} from "../../utils/app-error";
import {
  BanVectyzenType,
  BulkDeleteVectyzenType,
  PromoteVectyzenType,
} from "../../validation/manage-vectyzen.validation";
import prisma from "../../lib/prisma";
import { extractPublicIdFromUrl } from "../../utils/cloudinary.utils";
import { deleteFromCloudinary } from "../../lib/cloudinary";

export const getVectyzenStatsService = async () => {
  const [totalAnon, totalVectyzen, totalActive] = await Promise.all([
    prisma.user.count({ where: { isAnonymous: true } }),
    prisma.user.count(),
    prisma.user.count({
      where: {
        isAnonymous: false,
        OR: [{ banned: false }, { banned: null }],
      },
    }),
  ]);

  return {
    totalAnon,
    totalVectyzen,
    totalActive,
  };
};

export const getVectyzenListService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filterAnon?: string;
  filterBanned?: string;
}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    filterAnon = "all",
    filterBanned = "all",
  } = query;

  const skip = (page - 1) * limit;

  const where: any = {};
  
  if (filterAnon === "true") {
    where.isAnonymous = true;
  } else if (filterAnon === "false") {
    where.isAnonymous = false;
  }

  if (filterBanned === "true") {
    where.banned = true;
  } else if (filterBanned === "false") {
    where.banned = false; // Note: In schema, it could be null. We check if false or null.
    // Assuming banned is boolean | null based on previous context.
    where.banned = { not: true }; // meaning false or null
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: any = {};
  if (sortBy === "name" || sortBy === "createdAt") {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy["createdAt"] = "desc";
  }

  const [totalItems, items] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        sessions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { createdAt: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  const formattedUsers = items.map((user) => ({
    ...user,
    lastLogin: user.sessions.length > 0 ? user.sessions[0].createdAt : null,
    sessions: undefined,
  }));

  return {
    items: formattedUsers,
    meta: {
      totalItems,
      currentPage: page,
      totalPages,
      limit,
    },
  };
};

export const promoteVectyzenService = async (
  id: string,
  payload: PromoteVectyzenType,
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundException("Vectyzen not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      isOfficial: payload.isOfficial,
    },
    select: {
      id: true,
      name: true,
      isOfficial: true,
    },
  });

  return updatedUser;
};

export const banVectyzenService = async (
  id: string,
  payload: BanVectyzenType,
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundException("Vectyzen not found");
  }

  const dataToUpdate: any = {
    banned: payload.banned,
  };

  if (payload.banned) {
    dataToUpdate.banReason = payload.banReason;
    dataToUpdate.banExpires = payload.banExpires
      ? new Date(payload.banExpires)
      : null;
  } else {
    dataToUpdate.banReason = null;
    dataToUpdate.banExpires = null;
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: dataToUpdate,
    select: {
      id: true,
      name: true,
      banned: true,
      banReason: true,
      banExpires: true,
    },
  });

  return updatedUser;
};

const deleteUserImagesFromCloudinary = async (user: any) => {
  const imagePromises = [];
  if (user.image) {
    const publicId = extractPublicIdFromUrl(user.image);
    if (publicId) imagePromises.push(deleteFromCloudinary(publicId));
  }
  if (user.banner) {
    const publicId = extractPublicIdFromUrl(user.banner);
    if (publicId) imagePromises.push(deleteFromCloudinary(publicId));
  }

  if (imagePromises.length > 0) {
    try {
      await Promise.all(imagePromises);
    } catch (err) {
      console.error("Failed to delete user images from storage", err);
      throw new InternalServerException("Failed to delete images from storage");
    }
  }
};

export const deleteVectyzenService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { image: true, banner: true },
  });

  if (!user) {
    throw new NotFoundException("Vectyzen not found");
  }

  await deleteUserImagesFromCloudinary(user);

  await prisma.user.delete({
    where: { id },
  });

  return true;
};

export const bulkDeleteVectyzenService = async (
  payload: BulkDeleteVectyzenType,
) => {
  const { ids } = payload;
  if (!ids || ids.length === 0) return true;

  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { image: true, banner: true },
  });

  const deletePromises = users.map(async (user) => {
    try {
      await deleteUserImagesFromCloudinary(user);
    } catch (err) {
      console.error("Failed to delete user image during bulk delete", err);
    }
  });

  await Promise.all(deletePromises);

  await prisma.user.deleteMany({
    where: { id: { in: ids } },
  });

  return true;
};
