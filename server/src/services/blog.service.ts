import prisma from "../lib/prisma";
import { AppError } from "../utils/app-error";
import { HTTPSTATUS } from "../utils/http.config";

export const getBlogPostsService = async (
  page = 1,
  limit = 10,
  search = "",
  categorySlug?: string,
) => {
  const skip = (page - 1) * limit;

  const where: any = {
    status: "PUBLISHED",
    // Ensure we don't show posts scheduled for the future
    publishedAt: { lte: new Date() },
  };

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  const [totalItems, items] = await prisma.$transaction([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
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

export const getBlogPostDetailService = async (slug: string) => {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    },
    include: {
      category: true,
      tags: true,
      author: {
        select: { id: true, name: true, image: true, username: true },
      },
    },
  });

  if (!post) throw new AppError("Blog post not found", HTTPSTATUS.NOT_FOUND);

  return post;
};

export const getBlogPostCategoryService = async () => {
  // Fetch active categories that have at least 1 published post
  const categories = await prisma.blogCategory.findMany({
    where: {
      posts: {
        some: {
          status: "PUBLISHED",
          publishedAt: { lte: new Date() },
        },
      },
    },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: "PUBLISHED",
              publishedAt: { lte: new Date() },
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};

export const getBlogPostSettingsService = async () => {
  const settings = await prisma.blogSetting.findUnique({
    where: { id: "global" },
  });

  return settings;
};
