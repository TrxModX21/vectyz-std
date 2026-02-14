import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  return useQuery<CategoriesResponse>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get(`/categories`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
