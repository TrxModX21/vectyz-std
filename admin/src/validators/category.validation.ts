import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  status: z.boolean(),
  image: z.any().optional(), // File object or string URL
});

export type CategorySchema = z.infer<typeof categorySchema>;
