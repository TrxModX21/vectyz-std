interface CategoriesResponse {
  message: string;
  timestamp: string;
  totalCount?: number;
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
