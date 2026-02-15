interface PopularFreeVectorResponse {
  message: string;
  timestamp: string;
  stocks: Stock[];
}

interface GetAllStockResponse {
  message: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  timestamp: string;
  stocks: Stock[];
}

interface Stock {
  id: string;
  userId: string;
  reviewerId: any;
  categoryId: string;
  fileTypeId: string;
  title: string;
  slug: string;
  description: string;
  keywords: string[];
  colors: any[];
  isPremium: boolean;
  isSubscriptionAccessible: boolean;
  price: string;
  status: string;
  rejectionReason: any;
  totalDownloads: number;
  totalViews: number;
  totalLikes: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  category: Category;
  fileType: FileType;
  files: File[];
  likes: any[];
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  image: any;
  totalFollowers: number;
  totalFollowing: number;
  _count: Count;
}

interface Count {
  uploadedStocks: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FileType {
  id: string;
  name: string;
  slug: string;
}

interface File {
  id: string;
  url: string;
  purpose: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

interface GetStocksParams {
  page?: number;
  limit?: number;
  search?: string;
  color?: string;
  categoryId?: string;
  fileTypeId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  isPremium?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "price" | "totalDownloads";
  sortOrder?: "asc" | "desc";
}
