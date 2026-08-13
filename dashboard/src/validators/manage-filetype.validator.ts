import { z } from "zod";

export const createFileTypeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  collection_image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;

        return (
          typeof file === "object" &&
          file.size > 0 &&
          file.type?.startsWith("image/")
        );
      },
      {
        message: "Please upload a valid image",
      },
    ),
  icon: z.string("Icon required"),
  supported_file_extension: z
    .string("Extension requried")
    .min(2, "extension must be at least 2 characters"),
  status: z.enum(["active", "inactive"]),
  image: z.string().optional(),
  video: z.string().optional(),
});
export type CreateFileTypeSchema = z.infer<typeof createFileTypeSchema>;

export const updateFileTypeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  collection_image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;

        return (
          typeof file === "object" &&
          file.size > 0 &&
          file.type?.startsWith("image/")
        );
      },
      {
        message: "Please upload a valid image",
      },
    ),
  icon: z.string().min(1, "Icon required"),
  supported_file_extension: z
    .string()
    .min(2, "extension must be at least 2 characters"),
  status: z.enum(["active", "inactive"]),
  image: z.string().optional(),
  video: z.string().optional(),
});
export type UpdateFileTypeSchema = z.infer<typeof updateFileTypeSchema>;