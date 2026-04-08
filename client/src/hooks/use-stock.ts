import { api } from "@/lib/axios";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

export const useGetAllStocks = (params: GetStocksParams) => {
  return useInfiniteQuery<GetAllStockResponse>({
    queryKey: ["stocks", params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get("/stocks", {
        params: { ...params, page: pageParam },
      });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetStockDetail = (id: string) => {
  return useQuery<StockDetailResponse>({
    queryKey: ["stockDetail", id],
    queryFn: async () => {
      const res = await api.get(`/stocks/${id}`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
};

export const useToggleLikeStock = (stockId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!stockId) throw new Error("Stock ID required");
      const res = await api.post(`/stocks/${stockId}/like`);
      return res.data;
    },
    onMutate: async (user?: { id: string; name: string; image: string | undefined | null; username: string }) => {
      if (!stockId) return;

      await queryClient.cancelQueries({ queryKey: ["stockDetail", stockId] });

      const previousStockDetail = queryClient.getQueryData<StockDetailResponse>(["stockDetail", stockId]);

      if (previousStockDetail) {
        let newLikes = [...previousStockDetail.stock.likes];
        const isLiked = previousStockDetail.stock.isLiked;

        if (!isLiked && user) {
          // Optimistically add user to likes list
          newLikes.unshift({
            user: {
              id: user.id,
              name: user.name,
              username: user.username,
              image: user.image,
            },
          });
        } else if (isLiked && user) {
          // Optimistically remove user from likes list
          newLikes = newLikes.filter((like) => like.user.id !== user.id);
        }

        queryClient.setQueryData<StockDetailResponse>(["stockDetail", stockId], {
          ...previousStockDetail,
          stock: {
            ...previousStockDetail.stock,
            isLiked: !isLiked,
            totalLikes: isLiked
              ? previousStockDetail.stock.totalLikes - 1
              : previousStockDetail.stock.totalLikes + 1,
            likes: newLikes,
          },
        });
      }

      return { previousStockDetail };
    },
    onError: (err: any, variables, context: any) => {
      if (context?.previousStockDetail) {
        queryClient.setQueryData(["stockDetail", stockId], context.previousStockDetail);
      }
      toast.error(err.response?.data?.message || "Failed to toggle like");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stockDetail", stockId] });
    },
  });
};
