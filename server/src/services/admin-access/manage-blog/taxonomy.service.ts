import prisma from "../../../lib/prisma";
import { AppError } from "../../../utils/app-error";
import { generateSlugFromName } from "../../../utils/helper";
import { HTTPSTATUS } from "../../../utils/http.config";
import {
  CreateBlogCategorySchema,
  CreateBlogTagSchema,
  UpdateBlogCategorySchema,
  UpdateBlogTagSchema,
} from "../../../validation/manage-blog-validation";

// ==========================================
// CATEGORY SERVICES
// ==========================================
export const getBlogCategoriesService = async () => {
  return await prisma.blogCategory.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true } } }, // Hitung jumlah post di tiap kategori
  });
};

export const createBlogCategoryService = async (
  data: CreateBlogCategorySchema,
) => {
  let slug = generateSlugFromName(data.name);

  // Cek apakah slug sudah ada
  const existing = await prisma.blogCategory.findUnique({ where: { slug } });
  if (existing)
    throw new AppError(
      "Category with this name already exists",
      HTTPSTATUS.CONFLICT,
    );

  return await prisma.blogCategory.create({
    data: { ...data, slug },
  });
};

export const updateBlogCategoryService = async (
  id: string,
  data: UpdateBlogCategorySchema,
) => {
  const updateData: any = { ...data };

  const existing = await prisma.blogCategory.findUnique({ where: { id } });
  if (!existing)
    throw new AppError("Blog category not found", HTTPSTATUS.NOT_FOUND);

  if (data.name) {
    updateData.slug = generateSlugFromName(data.name);
    const existing = await prisma.blogCategory.findUnique({
      where: { slug: updateData.slug },
    });
    if (existing && existing.id !== id) {
      throw new AppError("Category name already exists", HTTPSTATUS.CONFLICT);
    }
  }

  return await prisma.blogCategory.update({
    where: { id },
    data: updateData,
  });
};

export const deleteBlogCategoryService = async (id: string) => {
  const existing = await prisma.blogCategory.findUnique({ where: { id } });
  if (!existing)
    throw new AppError("Blog category not found", HTTPSTATUS.NOT_FOUND);

  return await prisma.blogCategory.delete({ where: { id } });
};

// ==========================================
// TAG SERVICES
// ==========================================
export const getBlogTagsService = async () => {
  return await prisma.blogTag.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true } } },
  });
};

export const createBlogTagService = async (data: CreateBlogTagSchema) => {
  let slug = generateSlugFromName(data.name);

  const existing = await prisma.blogTag.findUnique({ where: { slug } });
  if (existing)
    throw new AppError(
      "Tag with this name already exists",
      HTTPSTATUS.CONFLICT,
    );

  return await prisma.blogTag.create({
    data: { ...data, slug },
  });
};

export const updateBlogTagService = async (
  id: string,
  data: UpdateBlogTagSchema,
) => {
  const updateData: any = { ...data };

  const existing = await prisma.blogTag.findUnique({ where: { id } });
  if (!existing) throw new AppError("Blog tag not found", HTTPSTATUS.NOT_FOUND);

  if (data.name) {
    updateData.slug = generateSlugFromName(data.name);
    const existing = await prisma.blogTag.findUnique({
      where: { slug: updateData.slug },
    });
    if (existing && existing.id !== id) {
      throw new AppError("Tag name already exists", HTTPSTATUS.CONFLICT);
    }
  }

  return await prisma.blogTag.update({
    where: { id },
    data: updateData,
  });
};

export const deleteBlogTagService = async (id: string) => {
  const existing = await prisma.blogTag.findUnique({ where: { id } });
  if (!existing) throw new AppError("Blog tag not found", HTTPSTATUS.NOT_FOUND);

  return await prisma.blogTag.delete({ where: { id } });
};
