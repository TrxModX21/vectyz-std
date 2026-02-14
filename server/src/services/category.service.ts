import prisma from "../lib/prisma";
import { ConflictException, NotFoundException } from "../utils/app-error";
import { generateSlugFromName } from "../utils/helper";
import { deleteFromCloudinary } from "../lib/cloudinary";
import { extractPublicIdFromUrl } from "../utils/cloudinary.utils";

export const allCategoryService = async () => {
  const [categories, totalCount] = await Promise.all([
    prisma.category.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.category.count(),
  ]);

  return { categories, totalCount };
};

export const createCategoryService = async (body: any) => {
  const { name, image, status } = body;
  
  // Create slug from name
  const slug = generateSlugFromName(name);

  // Check if slug exists
  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    throw new Error("Category name already exists");
  }

  const newCategory = await prisma.category.create({
    data: {
      name,
      slug,
      image,
      status,
    },
  });

  return newCategory;
};

export const updateCategoryService = async (id: string, body: any) => {
  const { name, image, status } = body;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundException("Category not found");
  }

  let slug = category.slug;

  if (name && name !== category.name) {
    slug = generateSlugFromName(name);

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory && existingCategory.id !== id) {
      throw new ConflictException("Category name already exists");
    }
  }

  // Handle Image Deletion if image changed
  if (image && image !== category.image) {
    if (category.image) {
      const publicId = extractPublicIdFromUrl(category.image);
      if (publicId) {
        // Fire and forget deletion, or await it? Await is safer to catch errors but might slow down response.
        // Usually fine to async or just await.
        await deleteFromCloudinary(publicId).catch((err) =>
          console.error("Failed to delete old image", err),
        );
      }
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      image,
      status,
    },
  });

  return updatedCategory;
};

export const updateStatusCategoryService = async (
  id: string,
  status: "active" | "inactive", // or string
) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
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
      await deleteFromCloudinary(publicId).catch((err) =>
        console.error("Failed to delete image on category delete", err),
      );
    }
  }

  await prisma.category.delete({
    where: { id },
  });

  return true;
};
