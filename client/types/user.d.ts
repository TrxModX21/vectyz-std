interface GetMyProfileResponse {
  message: string;
  timestamp: string;
  user: User;
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  emailVerified: boolean;
  image: string;
  role: string;
  banner: string;
  banned: boolean;
  banReason: string;
  banExpires: string;
  createdAt: string;
  updatedAt: string;
  totalFollowers: number;
  totalFollowing: number;
  creditBalance: string;
  isPremium: boolean;
  planId: string;
  subscriptionExpiresAt: string;
  billingCycle: string;
  premiumQuota: number;
  premiumQuotaResetDate: string;
  dailyFreeDownloadCount: number;
  lastDownloadDate: string;
  currentDeviceId: string;
  profile: Profile;
  isAnonymous: boolean;
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
  newsletter: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Count {
  uploadedStocks: number;
  followers: number;
  following: number;
}
