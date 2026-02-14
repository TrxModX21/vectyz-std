import { z } from "zod";

export const createFileTypeSchema = z.object({
  name: z.string().min(1).max(255),
  icon: z.string().optional(),
  image: z.string().optional(),
  collection_image: z.string().optional(),
  video: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  supported_file_extension: z.string().min(1),
});

export const updateFileTypeSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  collection_image: z.string().optional(),
  video: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  supported_file_extension: z.string().optional(),
});

export type CreateFileTypeSchema = z.infer<typeof createFileTypeSchema>;
export type UpdateFileTypeSchema = z.infer<typeof updateFileTypeSchema>;
