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

export const useGetTransactionDetail = (id: string) => {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const { data } = await api.get(`/transactions/${id}`);
      return data.data;
    },
    enabled: !!id,
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
    onSuccess: (data) => {
      window.location.href = data.data.redirectUrl;
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to initiate purchase",
      );
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
