import { z } from "zod";

export const updateAvatarAndBannerSchema = z.object({
  image: z.url().optional().or(z.literal("")),
});
export type UpdateAvatarAndBannerSchema = z.infer<
  typeof updateAvatarAndBannerSchema
>;

export const updateProfileBioSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  mobile: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
});
export type UpdateProfileBioShcema = z.infer<typeof updateProfileBioSchema>;

export const updateNewsletterSchema = z.object({
  newsletter: z.boolean(),
});
export type UpdateNewsletterSchema = z.infer<typeof updateNewsletterSchema>;
