import { z } from "zod";

export const fileTypeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  icon: z.string().optional(),
  supportedFileExtension: z
    .string()
    .min(1, { message: "Supported extensions required (e.g., .svg, .eps)" }),
  status: z.enum(["active", "inactive"]),
  collectionImage: z.any().optional(),
});

export type FileTypeSchema = z.infer<typeof fileTypeSchema>;
