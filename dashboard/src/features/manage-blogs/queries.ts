import { useQuery } from "@tanstack/react-query";
import { ApiPaginatedResponse, ApiResponse } from "../../../types/api";
import {
  BlogCategoryData,
  BlogPostData,
  BlogSettingData,
  BlogTagData,
} from "../../../types/manage-blogs";
import { api } from "@/lib/axios";

export const useBlogSettings = () => {
  return useQuery<ApiResponse<BlogSettingData>>({
    queryKey: ["manage-blog-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/manage-blog/settings");
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};

// Query untuk mengambil list Kategori Blog
export const useBlogCategories = () => {
  return useQuery<ApiResponse<BlogCategoryData[]>>({
    queryKey: ["manage-blog-categories"],
    queryFn: async () => {
      const res = await api.get("/admin/manage-blog/categories");
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};

// Query untuk mengambil list Tag Blog
export const useBlogTags = () => {
  return useQuery<ApiResponse<BlogTagData[]>>({
    queryKey: ["manage-blog-tags"],
    queryFn: async () => {
      const res = await api.get("/admin/manage-blog/tags");
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};

// Query untuk mengambil list Postingan Blog dengan Pagination & Filter
export const useManageBlogPosts = (params: {
  page: number;
  limit: number;
  search: string;
  status?: string;
  categoryId?: string;
}) => {
  return useQuery<ApiPaginatedResponse<BlogPostData>>({
    queryKey: [
      "manage-blog-posts",
      params.page,
      params.limit,
      params.search,
      params.status,
      params.categoryId,
    ],
    queryFn: async () => {
      const res = await api.get("/admin/manage-blog/posts", {
        params: {
          page: params.page,
          limit: params.limit,
          search: params.search,
          status: params.status || undefined,
          categoryId: params.categoryId || undefined,
        },
      });
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};
