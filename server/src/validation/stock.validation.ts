import { z } from "zod";

export const getAllStocksSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  fileTypeId: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  isPremium: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z
    .enum(["createdAt", "price", "totalDownloads"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
export type GetAllStocksSchema = z.infer<typeof getAllStocksSchema>;

export const createStockSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  categoryId: z.cuid(),
  fileTypeId: z.cuid(),
  keywords: z
    .array(z.string())
    .min(1, "At least 1 keyword is required")
    .max(50, "Maximum 50 keywords allowed"),
  colors: z.array(z.string()).optional(),
  isPremium: z.boolean().default(false),
  price: z.number().nonnegative().default(0),
  currency: z.enum(["IDR", "USD"]).default("IDR"),
  files: z
    .array(
      z.object({
        purpose: z.enum(["ORIGINAL", "PREVIEW"]),
        publicId: z.string(),
        url: z.url(),
        format: z.string(),
        bytes: z.number().int().nonnegative(),
        width: z.number().int().optional(),
        height: z.number().int().optional(),
      }),
    )
    .min(1, "At least one file needed"),
});
export type CreateStockSchema = z.infer<typeof createStockSchema>;

export const updateStockSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  categoryId: z.cuid().optional(),
  fileTypeId: z.cuid().optional(),
  keywords: z.array(z.string()).min(5).optional(),
  colors: z.array(z.string()).optional(),
  isPremium: z.boolean().optional(),
  price: z.number().nonnegative().optional(),
  currency: z.enum(["IDR", "USD"]).optional(),
  files: z
    .array(
      z.object({
        purpose: z.enum(["ORIGINAL", "PREVIEW"]),
        publicId: z.string(),
        url: z.url(),
        format: z.string(),
        bytes: z.number().int().nonnegative(),
        width: z.number().int().optional(),
        height: z.number().int().optional(),
      }),
    )
    .min(1)
    .optional(),
});
export type UpdateStockSchema = z.infer<typeof updateStockSchema>;
