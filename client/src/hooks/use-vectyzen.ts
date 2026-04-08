import { api } from "@/lib/axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export const useGetAllVectyzen = (params?: GetUsersParams) => {
  return useQuery<GetAllVectyzenResponse>({
    queryKey: ["users", params],
    queryFn: async () => {
      const res = await api.get(`/users`, { params });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useInfiniteGetAllVectyzen = (params?: GetUsersParams) => {
  return useInfiniteQuery<GetAllVectyzenResponse>({
    queryKey: ["users", "infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(`/users`, {
        params: { ...params, page: pageParam },
      });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Assuming GetAllVectyzenResponse has totalPages and possibly currentPage
      // The API returns users along with probably totalPages, we'll try to find if there's more
      const currentPage = lastPage.page || 1;
      const totalPages = lastPage.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};
