import { z } from "zod";

export const getMyDownloadHistorySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
});
export type GetMyDownloadHistorySchema = z.infer<
  typeof getMyDownloadHistorySchema
>;
