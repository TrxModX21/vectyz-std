import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  image: z.url("Invalid image URL").optional(),
  mobile: z.string().optional(),
  dialCode: z.string().optional(),
  countryCode: z.string().optional(),
  countryName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  address: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
