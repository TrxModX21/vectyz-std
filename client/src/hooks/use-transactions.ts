import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

export const useCheckAccess = (
  stockId: string | undefined,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["checkAccess", stockId],
    queryFn: async () => {
      if (!stockId) return null;
      const res = await api.get(`/downloads/${stockId}/access`);
      return res.data;
    },
    enabled: !!stockId && enabled,
    retry: false,
  });
};

interface UseGetUserTransactionsParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}

export const useGetUserTransactions = (
  params: UseGetUserTransactionsParams,
) => {
  return useQuery({
    queryKey: ["user-transactions", params],
    queryFn: async () => {
      const res = await api.get("/transactions/me", { params });
      return res.data;
    },
  });
};

export const useGetTransactionDetail = (id: string) => {
  return useQuery({
    queryKey: ["transaction-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/transactions/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });
};
