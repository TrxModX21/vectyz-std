import prisma from "../lib/prisma";
import { LicenseType } from "../generated/prisma/client";
import { NotFoundException } from "../utils/app-error";
import { generateStockSlug } from "../utils/helper";

export const allPlanService = async () => {
  const [plans, totalCount] = await Promise.all([
    prisma.plan.findMany({ orderBy: { price: "asc" } }),
    prisma.plan.count(),
  ]);

  return { plans, totalCount };
};

export const getPlanDetailService = async (id: string) => {
  const plan = await prisma.plan.findUnique({
    where: { id },
  });

  if (!plan) {
    throw new NotFoundException("Plan not found");
  }

  return plan;
};

export const createPlanService = async (data: {
  name: string;
  price: number;
  priceInYear?: number;
  saveWithYear?: string;
  currency?: string;
  durationDays: number;
  premiumQuota: number;
  dailyFreeLimit?: number;
  licenseType?: LicenseType;
  maxDevices?: number;
  downloadSpeed?: string;
  isBestValue?: boolean;
  features?: string[];
  isSupportYearly?: boolean;
}) => {
  const slug = generateStockSlug(data.name);

  return prisma.plan.create({
    data: {
      ...data,
      slug,
    },
  });
};

export const updatePlanService = async (
  id: string,
  data: Partial<{
    name: string;
    price: number;
    priceInYear?: number;
    saveWithYear?: string;
    currency: string;
    durationDays: number;
    premiumQuota: number;
    dailyFreeLimit: number;
    licenseType: LicenseType;
    maxDevices: number;
    downloadSpeed: string;
    isBestValue: boolean;
    features: string[];
    isSupportYearly?: boolean;
  }>,
) => {
  const plan = await prisma.plan.findUnique({
    where: { id },
  });
  if (!plan) {
    throw new NotFoundException("Plan not found");
  }

  let slug = plan.slug;
  if (data.name && data.name !== plan.name) {
    slug = generateStockSlug(data.name!);
  }

  return prisma.plan.update({
    where: { id },
    data: {
      ...data,
      slug,
    },
  });
};

export const deletePlanService = async (id: string) => {
  const plan = await prisma.plan.findUnique({
    where: { id },
  });
  if (!plan) {
    throw new NotFoundException("Plan not found");
  }

  await prisma.plan.delete({
    where: { id },
  });

  return true;
};
