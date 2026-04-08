interface GetAllVectyzenResponse {
  message: string;
  users: Vectyzen[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface Vectyzen {
  id: string;
  name: string;
  email: string;
  username?: string;
  image?: string;
  role: string;
  banned: boolean;
  isPremium: boolean;
  createdAt: string;
  emailVerified: boolean;
  totalFollowers: number;
  totalFollowing: number;
  profile: Profile;
  totalUploadedStocks: number;
}

interface Profile {
  mobile: any;
  dialCode: any;
  countryCode: any;
  countryName: any;
  city: any;
  state: any;
  zip: any;
  address: any;
}

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}