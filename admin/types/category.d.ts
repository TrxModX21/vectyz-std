interface CategoriesResponse {
  message: string;
  categories: Category[];
  totalCount: number;
  timestamp: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
