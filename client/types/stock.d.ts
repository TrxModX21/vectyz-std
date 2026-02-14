interface PopularFreeVectorResponse {
  message: string;
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
}

interface User {
  id: string;
  name: string;
  image: any;
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
  width?: number;
  height?: number;
}
