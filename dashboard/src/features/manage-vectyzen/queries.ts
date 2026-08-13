import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiPaginatedResponse, ApiResponse } from "../../../types/api";
import { Vectyzen, VectyzenStats } from "../../../types/manage-vectyzen";

export const useManageVectyzen = (params: {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: string;
  filterAnon: string;
  filterBanned: string;
}) => {
  return useQuery<ApiPaginatedResponse<Vectyzen>>({
    queryKey: [
      "manage-vectyzen",
      params.page,
      params.limit,
      params.search,
      params.sortBy,
      params.sortOrder,
      params.filterAnon,
      params.filterBanned,
    ],
    queryFn: async () => {
      const { page, limit, search, sortBy, sortOrder, filterAnon, filterBanned } = params;
      const res = await api.get("/admin/manage-vectyzen/list", {
        params: { page, limit, search, sortBy, sortOrder, filterAnon, filterBanned },
      });
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};

export const useManageVectyzenStats = () => {
  return useQuery<ApiResponse<VectyzenStats>>({
    queryKey: ["manage-vectyzen-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/manage-vectyzen/stats");
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};
