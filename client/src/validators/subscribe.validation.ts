import { z } from "zod";

export const subscriptionFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export type SubscriptionFormInputs = z.infer<typeof subscriptionFormSchema>;

export interface SubscriptionPayload {
  planId: string;
  billingCycle: "ONE_TIME" | "YEARLY" | "MONTHLY";
  billingAddress: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}