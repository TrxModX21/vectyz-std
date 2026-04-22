interface GetAllVectyzenResponse {
  message: string;
  timestamp: string;
  users: Vectyzen[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface GetVectyzenDetailResponse {
  message: string;
  timestamp: string;
  user: Vectyzen;
}

interface Vectyzen {
  id: string;
  name: string;
  email: string;
  username?: string;
  emailVerified: boolean;
  image?: string;
  banner?: string;
  role: string;
  isOfficial: boolean;
  banned: boolean;
  banReason: any;
  banExpires: any;
  isAnonymous?: boolean;
  createdAt: string;
  totalFollowers: number;
  totalFollowing: number;
  isPremium: boolean;
  profile: Profile;
  totalUploadedStocks: number;
  totalLikes: number;
  totalCollections: number;
}

interface Profile {
  mobile?: string;
  dialCode?: string;
  countryCode?: string;
  countryName?: string;
  city?: string;
  state?: string;
  zip?: string;
  address?: string;
  websites?: string;
  bio?: string;
}

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}
