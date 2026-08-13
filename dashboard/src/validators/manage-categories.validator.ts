import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  image: z.any().refine((val) => val && typeof val === "object" && val.size > 0, "Image is required"),
  status: z.enum(["active", "inactive"]),
});

export type CreateCategoryType = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  image: z.any().optional(), // image is optional during edit
  status: z.enum(["active", "inactive"]),
});

export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;