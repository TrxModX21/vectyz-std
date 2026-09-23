export interface BlogAuthor {
  id: string;
  name: string;
  image: string | null;
  username: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categoryId: string | null;

  // Relations
  author: BlogAuthor;
  category: BlogCategory | null;
  tags?: BlogTag[];
}

export interface BlogPostsResponse {
  message: string;
  timestamp: string;
  data: {
    items: BlogPost[];
    meta: {
      totalItems: number;
      currentPage: number;
      totalPages: number;
      limit: number;
    };
  };
}

export interface BlogPostDetailResponse {
  message: string;
  timestamp: string;
  data: BlogPost;
}

export interface BlogCategoriesResponse {
  message: string;
  timestamp: string;
  data: BlogCategory[];
}

export interface BlogSetting {
  id: string;
  defaultSeoTitle: string | null;
  defaultSeoDescription: string | null;
  defaultSocialImage: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogSettingsResponse {
  message: string;
  timestamp: string;
  data: BlogSetting | null;
}
