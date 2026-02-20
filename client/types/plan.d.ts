interface PlansResponse {
  message: string;
  timestamp: string;
  plans: Plan[];
  totalCount: number;
}

interface PlanDetailResponse {
  message: string;
  timestamp: string;
  plan: Plan;
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceInYear?: number;
  saveWithYear?: string;
  currency: string;
  isBestValue: boolean;
  durationDays: number;
  premiumQuota: number;
  dailyFreeLimit: number;
  isSupportYearly: boolean;
  features: string[];
  licenseType: string;
  maxDevices: number;
  downloadSpeed: string;
  createdAt: string;
  updatedAt: string;
}
