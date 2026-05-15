import { z } from "zod";

export const getMyStocksSchema = z.object({
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
    .enum(["createdAt", "title", "totalDownloads"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
export type GetMyStocksSchema = z.infer<typeof getMyStocksSchema>;
