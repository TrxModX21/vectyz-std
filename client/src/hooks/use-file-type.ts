import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface GetFileTypesOptions {
  sort?: "asc" | "desc";
  includeCategories?: boolean;
  limit?: number;
}

export const useGetFileTypes = (
  options: GetFileTypesOptions = {
    sort: "desc",
    includeCategories: false,
    limit: 10,
  }
) => {
  const { sort = "desc", includeCategories = false, limit = 10 } = options;
  return useQuery<FileTypeResponse>({
    queryKey: ["file-types", sort, includeCategories, limit],
    queryFn: async () => {
      const res = await api.get(`/file-types`, {
        params: {
          sort,
          include_categories: includeCategories,
          limit,
        },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
