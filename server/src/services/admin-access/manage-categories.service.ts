import prisma from "../../lib/prisma";
import { NotFoundException, InternalServerException } from "../../utils/app-error";
import { generateSlugFromName } from "../../utils/helper";
import { CreateCategoryType, UpdateCategoryType } from "../../validation/category.validation";
import { deleteFromCloudinary } from "../../lib/cloudinary";
import { extractPublicIdFromUrl } from "../../utils/cloudinary.utils";

export const getCategoriesListService = async (query: {
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
    prisma.category.count({ where }),
    prisma.category.findMany({
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

export const createCategoryService = async (data: CreateCategoryType) => {
  let baseSlug = generateSlugFromName(data.name);
  let finalSlug = baseSlug;

  // Cek apakah slug ada di DB
  const existingCategory = await prisma.category.findUnique({
    where: { slug: baseSlug },
  });

  if (existingCategory) {
    // Generate slug tambahan dengan random
    finalSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
  }

  // Create
  const newCategory = await prisma.category.create({
    data: {
      name: data.name,
      slug: finalSlug,
      image: data.image || null,
      icon: data.icon || null,
      status: data.status,
    },
  });

  return newCategory;
};

export const updateCategoryService = async (
  id: string,
  payload: UpdateCategoryType,
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });
  if (!existingCategory) {
    throw new NotFoundException("Category not found");
  }

  let newSlug = existingCategory.slug;
  if (payload.name && payload.name !== existingCategory.name) {
    newSlug = generateSlugFromName(payload.name);
  }

  // If a new image is provided and it's different from the old one, delete the old one
  if (
    payload.image &&
    existingCategory.image &&
    payload.image !== existingCategory.image
  ) {
    const publicId = extractPublicIdFromUrl(existingCategory.image);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error("Failed to delete old image on category update", err);
      }
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name: payload.name !== undefined ? payload.name : undefined,
      slug: newSlug,
      image: payload.image !== undefined ? payload.image : undefined,
      icon: payload.icon !== undefined ? payload.icon : undefined,
      status: payload.status !== undefined ? payload.status : undefined,
    },
  });

  return updatedCategory;
};

export const changeCategoryVisibilityService = async (
  id: string,
  status: "active" | "inactive",
) => {
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory) {
    throw new NotFoundException("Category not found");
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { status },
  });
  return updatedCategory;
};

export const deleteCategoryService = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundException("Category not found");
  }

  // Delete image from Cloudinary
  if (category.image) {
    const publicId = extractPublicIdFromUrl(category.image);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error("Failed to delete image on category delete", err);
        throw new InternalServerException("Failed to delete image from storage");
      }
    }
  }

  await prisma.category.delete({
    where: { id },
  });

  return true;
};

export const bulkDeleteCategoryService = async (ids: string[]) => {
  if (!ids || ids.length === 0) return true;

  // Get categories to delete their images
  const categories = await prisma.category.findMany({
    where: { id: { in: ids } },
    select: { image: true },
  });

  // Delete images from Cloudinary
  const deletePromises = categories
    .filter((cat) => cat.image)
    .map(async (cat) => {
      const publicId = extractPublicIdFromUrl(cat.image as string);
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

  // Bulk delete from DB
  await prisma.category.deleteMany({
    where: { id: { in: ids } },
  });

  return true;
};