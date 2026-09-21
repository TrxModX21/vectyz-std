import prisma from "../../../lib/prisma";
import { AppError } from "../../../utils/app-error";
import { generateSlugFromName } from "../../../utils/helper";
import { HTTPSTATUS } from "../../../utils/http.config";
import {
  CreateBlogPostSchema,
  UpdateBlogPostSchema,
} from "../../../validation/manage-blog-validation";

export const getBlogPostsService = async (
  page = 1,
  limit = 10,
  search = "",
  status?: string,
  categoryId?: string,
) => {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Filter berdasarkan status (DRAFT / PUBLISHED)
  if (status && (status === "DRAFT" || status === "PUBLISHED")) {
    where.status = status;
  }
  // Filter berdasarkan Kategori
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const [totalItems, items] = await prisma.$transaction([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        tags: true,
        author: {
          select: { id: true, name: true, image: true, username: true },
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

export const getBlogPostByIdService = async (id: string) => {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { category: true, tags: true },
  });
  if (!post) throw new AppError("Post not found", HTTPSTATUS.NOT_FOUND);

  return post;
};

export const createBlogPostService = async (
  authorId: string,
  data: CreateBlogPostSchema,
) => {
  // Gunakan slug kustom jika ada, atau generate dari title
  const rawSlug = data.slug && data.slug.trim() !== "" ? data.slug : data.title;
  let slug = generateSlugFromName(rawSlug);

  let existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
  }

  const { categoryId, tags, ...restData } = data;
  const categoryConnect = categoryId
    ? { connect: { id: categoryId } }
    : undefined;
  const tagsConnect =
    tags && tags.length > 0
      ? { connect: tags.map((id) => ({ id })) }
      : undefined;
  const publishedAt = restData.status === "PUBLISHED" ? new Date() : null;

  return await prisma.blogPost.create({
    data: {
      ...restData,
      slug,
      publishedAt,
      author: { connect: { id: authorId } },
      ...(categoryConnect && { category: categoryConnect }),
      ...(tagsConnect && { tags: tagsConnect }),
    },
  });
};

export const updateBlogPostService = async (
  id: string,
  data: UpdateBlogPostSchema,
) => {
  const { categoryId, tags, status, ...restData } = data;
  let updateData: any = { ...restData };

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing)
    throw new AppError("Blog post not found", HTTPSTATUS.NOT_FOUND);

  // Handle Slug Update jika slug atau title dikirim
  if (restData.slug !== undefined || restData.title !== undefined) {
    const rawSlug =
      restData.slug && restData.slug.trim() !== ""
        ? restData.slug
        : restData.title;

    if (rawSlug) {
      let targetSlug = generateSlugFromName(rawSlug);
      const existing = await prisma.blogPost.findUnique({
        where: { slug: targetSlug },
      });
      if (existing && existing.id !== id) {
        targetSlug = `${targetSlug}-${Math.random().toString(36).substring(2, 7)}`;
      }
      updateData.slug = targetSlug;
    }
  }

  // Handle Published Date
  if (status) {
    updateData.status = status;
    if (status === "PUBLISHED") {
      // Hanya set publishedAt jika sebelumnya belum pernah di-publish
      const existingPost = await prisma.blogPost.findUnique({ where: { id } });
      if (!existingPost?.publishedAt) {
        updateData.publishedAt = new Date();
      }
    } else {
      updateData.publishedAt = null;
    }
  }

  // Handle Category Relation
  if (categoryId !== undefined) {
    if (categoryId === null || categoryId === "") {
      updateData.category = { disconnect: true };
    } else {
      updateData.category = { connect: { id: categoryId } };
    }
  }

  // Handle Tags Relation (Mengganti seluruh tags sebelumnya dengan yang baru)
  if (tags !== undefined) {
    updateData.tags = { set: tags.map((tagId) => ({ id: tagId })) };
  }

  return await prisma.blogPost.update({
    where: { id },
    data: updateData,
    include: { category: true, tags: true },
  });
};

export const deleteBlogPostService = async (id: string) => {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing)
    throw new AppError("Blog post not found", HTTPSTATUS.NOT_FOUND);

  return await prisma.blogPost.delete({ where: { id } });
};
