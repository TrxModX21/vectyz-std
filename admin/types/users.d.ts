interface Wallet {
  currency: string;
  balance: string; // Decimal is usually returned as string or number depending on config, better safe with string or check response
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  image: string | null;
  role: string;
  banned: boolean;
  createdAt: string;
  emailVerified: boolean;
  wallets: Wallet[];
}

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetUsersResponse {
  users: User[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}
