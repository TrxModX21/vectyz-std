import { z } from "zod";

export const createFileTypeSchema = z.object({
  name: z.string().min(1).max(255),
  collection_image: z.string().optional(),
  icon: z.string().optional(),
  supported_file_extension: z.string().min(1),
  status: z.enum(["active", "inactive"]).default("active"),
  image: z.string().optional(),
  video: z.string().optional(),
});
export type CreateFileTypeSchema = z.infer<typeof createFileTypeSchema>;

export const updateFileTypeSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  collection_image: z.string().nullable().optional(),
  icon: z.string().optional(),
  supported_file_extension: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  image: z.string().optional(),
  video: z.string().optional(),
});
export type UpdateFileTypeSchema = z.infer<typeof updateFileTypeSchema>;
