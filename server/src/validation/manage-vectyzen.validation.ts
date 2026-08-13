import { z } from "zod";

export const promoteVectyzenSchema = z.object({
  isOfficial: z.boolean(),
});
export type PromoteVectyzenType = z.infer<typeof promoteVectyzenSchema>;

export const banVectyzenSchema = z.object({
  banned: z.boolean(),
  banReason: z.string().nullable().optional(),
  banExpires: z.string().nullable().optional(), // Can be ISO string date
});
export type BanVectyzenType = z.infer<typeof banVectyzenSchema>;

export const bulkDeleteVectyzenSchema = z.object({
  ids: z
    .array(z.string().cuid("id must be cuid"))
    .min(1, "At least one vectyzen ID is required for bulk delete"),
});
export type BulkDeleteVectyzenType = z.infer<typeof bulkDeleteVectyzenSchema>;
