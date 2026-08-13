export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  _count?: {
    stocks: number;
  };
}