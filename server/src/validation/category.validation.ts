import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string("name required").min(1).max(255),
  image: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});
export type CreateCategoryType = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;

export const updateStatusCategorySchema = z.object({
  status: z.enum(["active", "inactive"]),
});
export type UpdateStatusCategoryType = z.infer<
  typeof updateStatusCategorySchema
>;

export const bulkDeleteCategorySchema = z.object({
  ids: z
    .array(z.cuid("id must be cuid"))
    .min(1, "At least one category ID is required for bulk delete"),
});
export type BulkDeleteCategoryType = z.infer<typeof bulkDeleteCategorySchema>;
