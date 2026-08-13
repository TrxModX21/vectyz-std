import { useQuery } from "@tanstack/react-query";
import { ApiPaginatedResponse } from "../../../types/api";
import { StockData } from "../../../types/manage-stocks";
import { api } from "@/lib/axios";

export const useManageStocks = (params: {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: string;
  filterStatus: string;
}) => {
  return useQuery<ApiPaginatedResponse<StockData>>({
    queryKey: [
      "manage-stocks",
      params.page,
      params.limit,
      params.search,
      params.sortBy,
      params.sortOrder,
      params.filterStatus,
    ],
    queryFn: async () => {
      const { page, limit, search, sortBy, sortOrder, filterStatus } = params;
      const res = await api.get("/admin/manage-stocks/lists", {
        params: { page, limit, search, sortBy, sortOrder, filterStatus },
      });
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};