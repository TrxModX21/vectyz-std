import { deleteFromCloudinary } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";
import {
  InternalServerException,
  NotFoundException,
} from "../../utils/app-error";
import { extractPublicIdFromUrl } from "../../utils/cloudinary.utils";
import { generateSlugFromName } from "../../utils/helper";
import {
  CreateFileTypeSchema,
  UpdateFileTypeSchema,
} from "../../validation/file-type.validation";

export const getFiletypeListService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Build orderBy
  const orderBy: any = {};
  if (sortBy === "name" || sortBy === "createdAt") {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy["createdAt"] = "desc";
  }

  const [totalItems, items] = await prisma.$transaction([
    prisma.fileType.count({ where }),
    prisma.fileType.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        _count: {
          select: { stocks: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    meta: {
      totalItems,
      currentPage: page,
      totalPages,
      limit,
    },
  };
};

export const createFiletypeService = async (payload: CreateFileTypeSchema) => {
  let baseSlug = generateSlugFromName(payload.name);
  let finalSlug = baseSlug;

  const existingFiletype = await prisma.fileType.findUnique({
    where: { slug: baseSlug },
  });

  if (existingFiletype) {
    finalSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
  }

  const newFiletype = await prisma.fileType.create({
    data: {
      name: payload.name,
      slug: finalSlug,
      collectionImage: payload.collection_image || null,
      icon: payload.icon || null,
      supportedFileExtension: payload.supported_file_extension,
      status: payload.status,
    },
  });

  return newFiletype;
};

export const updateFiletypeService = async (
  id: string,
  payload: UpdateFileTypeSchema,
) => {
  const existingFiletype = await prisma.fileType.findUnique({
    where: { id },
  });
  if (!existingFiletype) {
    throw new NotFoundException("Filetype not found");
  }

  let newSlug = existingFiletype.slug;
  if (payload.name && payload.name !== existingFiletype.name) {
    newSlug = generateSlugFromName(payload.name);
  }

  if (
    payload.collection_image &&
    existingFiletype.collectionImage &&
    payload.collection_image !== existingFiletype.collectionImage
  ) {
    const publicId = extractPublicIdFromUrl(existingFiletype.collectionImage);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error("Failed to delete old image on category update", err);
      }
    }
  }

  const updatedFiletype = await prisma.fileType.update({
    where: { id },
    data: {
      name: payload.name !== undefined ? payload.name : undefined,
      slug: newSlug,
      collectionImage:
        payload.collection_image !== undefined
          ? payload.collection_image
          : undefined,
      icon: payload.icon !== undefined ? payload.icon : undefined,
      supportedFileExtension:
        payload.supported_file_extension !== undefined
          ? payload.supported_file_extension
          : undefined,
      status: payload.status !== undefined ? payload.status : undefined,
    },
  });

  return updatedFiletype;
};

export const changeFiletypeVisibilityService = async (
  id: string,
  status: "active" | "inactive",
) => {
  const existingFiletype = await prisma.fileType.findUnique({ where: { id } });
  if (!existingFiletype) {
    throw new NotFoundException("Filetype not found");
  }

  const updatedFiletype = await prisma.fileType.update({
    where: { id },
    data: { status },
  });

  return updatedFiletype;
};

export const deleteFiletypeService = async (id: string) => {
  const fileType = await prisma.fileType.findUnique({
    where: { id },
  });
  if (!fileType) {
    throw new NotFoundException("Filetype not found");
  }

  if (fileType.collectionImage) {
    const publicId = extractPublicIdFromUrl(fileType.collectionImage);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error("Failed to delete image on filetype delete", err);
        throw new InternalServerException(
          "Failed to delete image from storage",
        );
      }
    }
  }

  await prisma.fileType.delete({
    where: { id },
  });

  return true;
};

export const bulkDeleteFiletypeService = async (ids: string[]) => {
  if (!ids || ids.length === 0) return true;

  const filetypes = await prisma.fileType.findMany({
    where: { id: { in: ids } },
    select: { collectionImage: true },
  });

  const deletePromises = filetypes
    .filter((filetype) => filetype.collectionImage)
    .map(async (filetype) => {
      const publicId = extractPublicIdFromUrl(
        filetype.collectionImage as string,
      );
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (err) {
          console.error("Failed to delete image during bulk delete", err);
          // For bulk, we might just log it and continue to avoid stopping the whole batch
        }
      }
    });

  await Promise.all(deletePromises);

  await prisma.fileType.deleteMany({
    where: { id: { in: ids } },
  });

  return true;
};
