import { z } from "zod";

const billingCycle = ["ONE_TIME", "YEARLY", "MONTHLY"] as const;

export const subscriptionSchema = z.object({
  planId: z.string("Plan id required"),
  billingCycle: z.enum(
    billingCycle,
    "Invalid billing cycle. Must be MONTHLY, YEARLY or ONE_TIME",
  ),
  billingAddress: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
});
export type SubscriptionType = z.infer<typeof subscriptionSchema>;
