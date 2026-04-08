import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export type SubscriptionFormInputs = z.infer<typeof subscriptionSchema>;

export const donationSchema = z.object({
  amount: z.coerce.number().min(11000, "Minimum donation is Rp 11.000"),
});

export type DonationFormInputs = z.infer<typeof donationSchema>;
