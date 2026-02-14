import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetPopularFreeVector = () => {
  return useQuery<PopularFreeVectorResponse>({
    queryKey: ["popularFreeVector"],
    queryFn: async () => {
      const res = await api.get("/stocks/popular-free-vector");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetTrendingStocks = (fileType?: string, limit?: number) => {
  return useQuery<PopularFreeVectorResponse>({
    queryKey: ["trendingStocks", fileType, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (fileType) params.append("fileType", fileType);
      if (limit) params.append("limit", limit.toString());

      const res = await api.get(`/stocks/trending?${params.toString()}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/stocks", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create stock");
    },
  });
};

export const useGetRelatedStock = (id: string, limit?: number) => {
  return useQuery<PopularFreeVectorResponse>({
    queryKey: ["relatedStocks", id, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit.toString());

      const res = await api.get(`/stocks/${id}/related?${params.toString()}`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
