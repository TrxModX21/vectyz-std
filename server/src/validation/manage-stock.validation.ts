import { z } from "zod";

export const updateStockMetadataSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  categoryId: z.string().cuid2("Choose 1 category"),
  fileTypeId: z.string().cuid2("Choose 1 file type"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  keywords: z
    .array(z.string())
    .min(5, "At least 5 keyword is required")
    .max(50, "Maximum of 50 keywords allowed"),
  isPremium: z.boolean(),
  price: z.number().min(10, "Min price is 10 Credits").nonnegative(),
});

export type UpdateStockMetadataSchema = z.infer<typeof updateStockMetadataSchema>;