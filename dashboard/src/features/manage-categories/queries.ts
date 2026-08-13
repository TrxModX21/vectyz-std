import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiPaginatedResponse } from "../../../types/api";
import { Category } from "../../../types/manage-categories";

export const useManageCategories = (params: {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: string;
}) => {
  return useQuery<ApiPaginatedResponse<Category>>({
    queryKey: [
      "manage-categories",
      params.page,
      params.limit,
      params.search,
      params.sortBy,
      params.sortOrder,
    ],
    queryFn: async () => {
      const { page, limit, search, sortBy, sortOrder } = params;
      const res = await api.get("/admin/manage-categories/lists", {
        params: { page, limit, search, sortBy, sortOrder },
      });
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};