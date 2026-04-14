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

export const useGetTrendingStocks = (params: {
  fileType?: string;
  limit?: number;
}) => {
  return useQuery<PopularFreeVectorResponse>({
    queryKey: ["trendingStocks", params.fileType, params.limit],
    queryFn: async () => {
      const paramsUrl = new URLSearchParams();
      if (params.fileType) paramsUrl.append("fileType", params.fileType);
      if (params.limit) paramsUrl.append("limit", params.limit.toString());

      const res = await api.get(`/stocks/trending?${paramsUrl.toString()}`);
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

export const useInfiniteGetStockByUser = (
  userId: string,
  params: GetStockByUserParams,
) => {
  return useInfiniteQuery<GetAllStockResponse>({
    queryKey: ["stocksByUser", "infinite", userId, params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(`/stocks/from-user/${userId}`, {
        params: { ...params, page: pageParam },
      });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.currentPage || 1;
      const totalPages = lastPage.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    // 30 menit = 1000ms * 60 * 30
    staleTime: 1000 * 60 * 30,
  });
};

export const useGetStockDetail = (slug: string) => {
  return useQuery<StockDetailResponse>({
    queryKey: ["stockDetail", slug],
    queryFn: async () => {
      const res = await api.get(`/stocks/${slug}`);
      return res.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 30,
  });
};

export const useToggleLikeStock = (stockId?: string, stockSlug?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!stockId) throw new Error("Stock ID required");
      const res = await api.post(`/stocks/${stockId}/like`);
      return res.data;
    },
    onMutate: async (user?: {
      id: string;
      name: string;
      image: string | undefined | null;
      username: string;
    }) => {
      if (!stockId || !stockSlug) return;

      await queryClient.cancelQueries({ queryKey: ["stockDetail", stockSlug] });
      await queryClient.cancelQueries({
        queryKey: ["stocksByUser", "infinite"],
      });
      await queryClient.cancelQueries({ queryKey: ["popularFreeVector"] });

      // Optimistic update for infinite grids
      queryClient.setQueriesData<any>(
        { queryKey: ["stocksByUser", "infinite"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              stocks: page.stocks?.map((st: any) => {
                if (st.id === stockId) {
                  const currentlyLiked = st.isLiked;
                  return {
                    ...st,
                    isLiked: !currentlyLiked,
                    totalLikes: currentlyLiked
                      ? st.totalLikes - 1
                      : st.totalLikes + 1,
                  };
                }
                return st;
              }),
            })),
          };
        },
      );

      queryClient.setQueriesData<any>(
        {
          predicate: (query) =>
            query.queryKey[0] === "popularFreeVector" ||
            query.queryKey[0] === "trendingStocks" ||
            query.queryKey[0] === "relatedStocks",
        },
        (oldData: any) => {
          if (!oldData || !oldData.stocks) return oldData; // Hindari jika cache kosong
          return {
            ...oldData,
            // Perhatikan bedanya: Kita langsung melooping array "stocks"
            stocks: oldData.stocks.map((st: any) => {
              if (st.id === stockId) {
                const currentlyLiked = st.isLiked;
                return {
                  ...st,
                  isLiked: !currentlyLiked,
                  totalLikes: currentlyLiked
                    ? st.totalLikes - 1
                    : st.totalLikes + 1,
                };
              }
              return st;
            }),
          };
        },
      );

      const previousStockDetail = queryClient.getQueryData<StockDetailResponse>(
        ["stockDetail", stockSlug],
      );

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

        queryClient.setQueryData<StockDetailResponse>(
          ["stockDetail", stockSlug],
          {
            ...previousStockDetail,
            stock: {
              ...previousStockDetail.stock,
              isLiked: !isLiked,
              totalLikes: isLiked
                ? previousStockDetail.stock.totalLikes - 1
                : previousStockDetail.stock.totalLikes + 1,
              likes: newLikes,
            },
          },
        );
      }

      return { previousStockDetail };
    },
    onError: (err: any, variables, context: any) => {
      if (context?.previousStockDetail) {
        queryClient.setQueryData(
          ["stockDetail", stockId],
          context.previousStockDetail,
        );
      }
      toast.error(err.response?.data?.message || "Failed to toggle like");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stockDetail", stockSlug] });
      queryClient.invalidateQueries({ queryKey: ["popularFreeVector"] });
      queryClient.invalidateQueries({ queryKey: ["trendingStocks"] });
      queryClient.invalidateQueries({ queryKey: ["relatedStocks"] });
      queryClient.invalidateQueries({ queryKey: ["stocksByUser", "infinite"] });
      queryClient.invalidateQueries({ queryKey: ["vectyzenDetail"] });
    },
  });
};
