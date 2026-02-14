import { z } from "zod";

export const createStockSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  categoryId: z.cuid("Choose 1 category"),
  fileTypeId: z.cuid("Choose 1 file type"),
  keywords: z
    .array(z.string())
    .min(5, "At least 5 keyword is required")
    .max(50, "Maximum 50 keywords allowed"),
  colors: z.array(z.string()).optional(),
  isPremium: z.boolean(),
  price: z.number().min(0).nonnegative(),
  currency: z.enum(["IDR", "USD"]),
});

// Schema for editing stock
// We use z.any() for files because they can be File objects (client) or strings (existing URLs)
// In a real app, strict validation for File type on client side is better
export const editStockSchema = createStockSchema.extend({
  preview: z.union([z.instanceof(File), z.string()]).optional(),
  original: z.union([z.instanceof(File), z.string()]).optional(),
});

export const addStockSchema = createStockSchema.extend({
  preview: z.instanceof(File, { message: "Need 1 valid file" }),
  files: z
    .array(z.instanceof(File, { message: "Need a valid file" }), {
      message: "Fix your input, this is not valid",
    })
    .min(1, "You need at least 1 file")
    .max(3),
});

export type CreateStockSchema = z.infer<typeof createStockSchema>;
export type EditStockSchema = z.infer<typeof editStockSchema>;
export type AddStockSchema = z.infer<typeof addStockSchema>;
