import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  BlogCategoriesResponse,
  BlogPostDetailResponse,
  BlogPostsResponse,
  BlogSettingsResponse,
} from "../../types/blog";

export const useBlogPosts = (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  } = {},
) => {
  return useQuery<BlogPostsResponse>({
    queryKey: ["blogPosts", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.category) searchParams.append("category", params.category);

      const res = await api.get(`/blog/posts?${searchParams.toString()}`);
      return res.data;
    },
  });
};

export const useBlogPostDetail = (slug: string) => {
  return useQuery<BlogPostDetailResponse>({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      const res = await api.get(`/blog/posts/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });
};

export const useBlogCategories = () => {
  return useQuery<BlogCategoriesResponse>({
    queryKey: ["blogCategories"],
    queryFn: async () => {
      const res = await api.get(`/blog/categories`);
      return res.data;
    },
  });
};

export const useBlogSettings = () => {
  return useQuery<BlogSettingsResponse>({
    queryKey: ["blogSettings"],
    queryFn: async () => {
      const res = await api.get(`/blog/settings`);
      return res.data;
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes — settings rarely change
  });
};
