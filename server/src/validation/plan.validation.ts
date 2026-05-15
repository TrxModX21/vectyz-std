import { z } from "zod";
import { LicenseType } from "../generated/prisma/client";

export const createPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  priceInYear: z.number().optional(),
  saveWithYear: z.string().optional(),
  currency: z.string().default("IDR"),
  durationDays: z
    .number()
    .int()
    .positive("Duration must be a positive integer"),
  premiumQuota: z
    .number()
    .int()
    .min(0, "Premium quota must be greater than or equal to 0"),
  dailyFreeLimit: z.number().int().default(9999),
  licenseType: z.enum(LicenseType).default(LicenseType.STANDARD),
  maxDevices: z.number().int().positive().default(1),
  downloadSpeed: z.string().default("STANDARD"),
  isBestValue: z.boolean().default(false),
  features: z.array(z.string()).default([]),
  isSupportYearly: z.boolean().default(false),
});

export const updatePlanSchema = createPlanSchema.partial();
