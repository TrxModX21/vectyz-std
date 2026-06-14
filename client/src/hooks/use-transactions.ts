import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { toast } from "sonner";

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

export const useBuyAssetDirect = () => {
  return useMutation({
    mutationFn: async (stockId: string) => {
      const { data } = await api.post("/transactions/buy-asset/gateway", {
        stockId,
      });
      return data;
    },
  });
};

export const useBuyAssetCredit = () => {
  return useMutation({
    mutationFn: async (stockId: string) => {
      const { data } = await api.post("/transactions/buy-asset/credit", {
        stockId,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Asset purchased successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to purchase asset");
    },
  });
};

export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/transactions/subscribe", payload);
      return data;
    },
  });
};

export const useCreateDonationGateway = () => {
  return useMutation({
    mutationFn: async (payload: {
      targetUserId: string;
      stockId: string;
      amount: number;
    }) => {
      const { data } = await api.post("/transactions/donate/gateway", payload);
      return data;
    },
  });
};

export const useCreateDonationCredit = () => {
  return useMutation({
    mutationFn: async (payload: {
      targetUserId: string;
      stockId: string;
      amount: number;
    }) => {
      const { data } = await api.post("/transactions/donate/credit", payload);
      return data;
    },
  });
};

export const useTopupCredit = () => {
  return useMutation({
    mutationFn: async (creditAmount: number) => {
      const { data } = await api.post("/transactions/topup", { creditAmount });
      return data;
    },
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
