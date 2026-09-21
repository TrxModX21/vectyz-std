import { Prisma } from "@/generated/prisma/client";

// Tipe data untuk Blog Setting
export type BlogSettingData = Prisma.BlogSettingGetPayload<{}>;

// Tipe data untuk Kategori Blog
export type BlogCategoryData = Prisma.BlogCategoryGetPayload<{
  include: {
    _count: {
      select: { posts: true };
    };
  };
}>;
// Tipe data untuk Tag Blog
export type BlogTagData = Prisma.BlogTagGetPayload<{
  include: {
    _count: {
      select: { posts: true };
    };
  };
}>;
// Tipe data untuk Postingan Blog
export type BlogPostData = Prisma.BlogPostGetPayload<{
  include: {
    category: true;
    tags: true;
    author: {
      select: { id: true; name: true; image: true; username: true };
    };
  };
}>;
