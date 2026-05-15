import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetUserStocksList = (params: GetStocksParams) => {
  return useQuery<GetAllStockResponse>({
    queryKey: ["userStocks", params],
    queryFn: async () => {
      const res = await api.get("/user-stocks", { params });
      return res.data;
    },
    staleTime: 1000 * 60 * 60, // 60 minutes
  });
};
