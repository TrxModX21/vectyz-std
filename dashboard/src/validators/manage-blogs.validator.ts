import { z } from "zod";

export const updateBlogSettingSchema = z.object({
  defaultSeoTitle: z.string().optional().or(z.literal("")),
  defaultSeoDescription: z.string().optional().or(z.literal("")),
  // Bisa menerima File (jika upload baru) atau string URL (jika tidak diganti) atau null/undefined
  defaultSocialImage: z
    .any()
    .optional()
    .nullable()
    .refine(
      (file) => {
        if (!file || typeof file === "string") return true;
        return (
          typeof file === "object" &&
          file.size > 0 &&
          file.type?.startsWith("image/")
        );
      },
      {
        message: "Please upload a valid image",
      },
    ),
  facebookUrl: z.url("Invalid Facebook URL").optional().or(z.literal("")),
  twitterUrl: z.url("Invalid Twitter / X URL").optional().or(z.literal("")),
  instagramUrl: z.url("Invalid Instagram URL").optional().or(z.literal("")),
  linkedinUrl: z.url("Invalid LinkedIn URL").optional().or(z.literal("")),
  youtubeUrl: z.url("Invalid YouTube URL").optional().or(z.literal("")),
});
export type UpdateBlogSettingSchema = z.infer<typeof updateBlogSettingSchema>;

// --- CATEGORY VALIDATORS ---
export const createBlogCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});
export type CreateBlogCategorySchema = z.infer<typeof createBlogCategorySchema>;

export const updateBlogCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z.string().optional(),
});
export type UpdateBlogCategorySchema = z.infer<typeof updateBlogCategorySchema>;

// --- TAG VALIDATORS ---
export const createBlogTagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});
export type CreateBlogTagSchema = z.infer<typeof createBlogTagSchema>;

export const updateBlogTagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});
export type UpdateBlogTagSchema = z.infer<typeof updateBlogTagSchema>;

// --- BLOG POST VALIDATORS ---
const blogPostStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export const createBlogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional().or(z.literal("")),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().optional().or(z.literal("")),
  coverImage: z.any().optional().nullable(),
  status: z.string(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional().or(z.literal("")),
  seoDescription: z.string().optional().or(z.literal("")),
});
export type CreateBlogPostSchema = z.infer<typeof createBlogPostSchema>;

export const updateBlogPostSchema = createBlogPostSchema.partial();
export type UpdateBlogPostSchema = z.infer<typeof updateBlogPostSchema>;
