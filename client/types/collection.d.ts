export interface GetMyCollectionResponse {
  message: string;
  timestamp: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  collections: Collection[];
}

export interface Collection {
  id: string;
  name: string;
  description: any;
  slug: string;
  isPrivate: boolean;
  isFeatured: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  items: Item[];
  _count: Count;
}

export interface User {
  id: string;
  name: string;
  image: string;
  username: string;
}

export interface Item {
  id: string;
  collectionId: string;
  stockId: string;
  createdAt: string;
  stock: Stock;
}

export interface Stock {
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
  files: File[];
}

export interface File {
  id: string;
  stockId: string;
  purpose: string;
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  createdAt: string;
}

export interface Count {
  items: number;
}
