import { z } from "zod";

export const createColorSchema = z.object({
  name: z.string().min(1).max(255),
  color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color code")
    .min(1),
});

export const updateColorSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color code")
    .optional(),
});

export type CreateColorType = z.infer<typeof createColorSchema>;
export type UpdateColorType = z.infer<typeof updateColorSchema>;
