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

export const useGetCategoriesFromFiletype = (ftSlug: string) => {
  return useQuery<CategoriesResponse>({
    queryKey: ["categories", ftSlug],
    queryFn: async () => {
      const res = await api.get(`/categories/${ftSlug}`);
      return res.data;
    },
  });
};
