import { z } from "zod";

export const colorSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  color: z
    .string()
    .min(1, { message: "Color is required" })
    .regex(/^#([0-9A-F]{3}){1,2}$/i, {
      message: "Invalid color format (must be a valid HEX code, e.g. #FFFFFF)",
    }),
});

export type ColorSchema = z.infer<typeof colorSchema>;
