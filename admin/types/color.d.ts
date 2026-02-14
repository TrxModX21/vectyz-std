interface Color {
  id: string;
  name: string;
  slug: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface ColorsResponse {
  message: string;
  colors: Color[];
  totalCount: number;
  timestamp: string;
}
