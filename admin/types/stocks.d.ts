interface GetStocksParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  fileTypeId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  isPremium?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "price" | "totalDownloads";
  sortOrder?: "asc" | "desc";
}

interface GetStocksResponse {
  message: string;
  stocks: Stock[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  timestamp: string;
}

interface GetDetailStockResponse {
  message: string;
  stock: Stock;
  timestamp: string;
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
}

interface User {
  id: string;
  image: string;
  name: string;
  email: string;
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
  width: number;
  height: number;
}
