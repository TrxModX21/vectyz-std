export interface GetMyDownloadHistoryResponse {
  message: string;
  timestamp: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  history: History[];
}

export interface History {
  id: string;
  userId: string;
  stockId: string;
  isUserPremium: boolean;
  userPlanId: any;
  isStockPremium: boolean;
  downloadDate: string;
  isCountedForPool: boolean;
  stock: Stock;
}

export interface Stock {
  id: string;
  title: string;
  slug: string;
  status: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user: User;
  files: File[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  image: string;
}

export interface File {
  id: string;
  url: string;
  purpose: string;
  publicId: string;
  format: string;
  bytes: number;
}

export interface GetMyDownloadHistoryParams {
  page?: number;
  limit?: number;
  search?: string;
}
