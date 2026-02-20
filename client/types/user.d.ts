interface GetMyProfileResponse {
  message: string;
  timestamp: string;
  user: User;
}

interface User {
  id: string;
  name: string;
  email: string;
  username: any;
  emailVerified: boolean;
  image: any;
  role: string;
  banned: boolean;
  banReason: any;
  banExpires: any;
  createdAt: string;
  updatedAt: string;
  totalFollowers: number;
  totalFollowing: number;
  creditBalance: string;
  isPremium: boolean;
  planId: any;
  subscriptionExpiresAt: any;
  billingCycle: any;
  premiumQuota: number;
  premiumQuotaResetDate: string;
  dailyFreeDownloadCount: number;
  lastDownloadDate: any;
  currentDeviceId: any;
  profile: Profile;
  _count: Count;
}

interface Profile {
  id: string;
  userId: string;
  mobile: any;
  dialCode: any;
  countryCode: any;
  countryName: any;
  city: any;
  state: any;
  zip: any;
  address: any;
  kycData: any;
  createdAt: string;
  updatedAt: string;
}

interface Count {
  uploadedStocks: number;
  followers: number;
  following: number;
}
