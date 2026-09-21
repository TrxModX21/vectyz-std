import z from "zod";

export const updateBlogSettingSchema = z.object({
  defaultSeoTitle: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
  defaultSocialImage: z.string().optional(),
  facebookUrl: z.url("Invalid URL").optional().or(z.literal("")),
  twitterUrl: z.url("Invalid URL").optional().or(z.literal("")),
  instagramUrl: z.url("Invalid URL").optional().or(z.literal("")),
  linkedinUrl: z.url("Invalid URL").optional().or(z.literal("")),
  youtubeUrl: z.url("Invalid URL").optional().or(z.literal("")),
});
export type UpdateBlogSettingSchema = z.infer<typeof updateBlogSettingSchema>;

// --- CATEGORY VALIDATION ---
export const createBlogCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});
export type CreateBlogCategorySchema = z.infer<typeof createBlogCategorySchema>;

export const updateBlogCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});
export type UpdateBlogCategorySchema = z.infer<typeof updateBlogCategorySchema>;

// --- TAG VALIDATION ---
export const createBlogTagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});
export type CreateBlogTagSchema = z.infer<typeof createBlogTagSchema>;

export const updateBlogTagSchema = z.object({
  name: z.string().min(2).optional(),
});
export type UpdateBlogTagSchema = z.infer<typeof updateBlogTagSchema>;

// --- BLOG POST VALIDATION ---
const blogPostStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export const createBlogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional().or(z.literal("")),
  content: z.string().min(10, "Content is required"),
  excerpt: z.string().optional(),
  coverImage: z.string().optional().or(z.literal("")),
  status: blogPostStatusSchema.default("DRAFT"),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(), // Akan menerima Array ID dari Tags
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});
export type CreateBlogPostSchema = z.infer<typeof createBlogPostSchema>;

// Menggunakan partial() karena saat update, semua field bisa opsional
export const updateBlogPostSchema = createBlogPostSchema.partial();
export type UpdateBlogPostSchema = z.infer<typeof updateBlogPostSchema>;
