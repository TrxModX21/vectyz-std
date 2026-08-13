import { useQuery } from "@tanstack/react-query";
import { ApiPaginatedResponse } from "../../../types/api";
import { FileTypeData } from "../../../types/manage-filetype";
import { api } from "@/lib/axios";

export const useManageFiletypes = (params: {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: string;
}) => {
  return useQuery<ApiPaginatedResponse<FileTypeData>>({
    queryKey: [
      "manage-filetypes",
      params.page,
      params.limit,
      params.search,
      params.sortBy,
      params.sortOrder,
    ],
    queryFn: async () => {
      const { page, limit, search, sortBy, sortOrder } = params;
      const res = await api.get("/admin/manage-filetypes/lists", {
        params: { page, limit, search, sortBy, sortOrder },
      });
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};
