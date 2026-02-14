import z from "zod";

export const fetchAllCollectionSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  userId: z.string().optional(),
});
export type FetchAllCollectionSchema = z.infer<typeof fetchAllCollectionSchema>;

export const createCollectionSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  isPrivate: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});
export type CreateCollectionType = z.infer<typeof createCollectionSchema>;

export const collectionDetailSchema = z.object({
  id: z.string().min(1),
});

export const updateCollectionSchema = createCollectionSchema.partial();
export type UpdateCollectionType = z.infer<typeof updateCollectionSchema>;

export const addItemToCollectionSchema = z.object({
  stockId: z.string().min(1),
});
export type AddItemToCollectionType = z.infer<typeof addItemToCollectionSchema>;

export const removeItemFromCollectionSchema = z.object({
  id: z.string().min(1),
  stockId: z.string().min(1),
});
export type RemoveItemFromCollectionType = z.infer<typeof removeItemFromCollectionSchema>;
