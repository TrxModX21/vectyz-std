import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  GetEarningsHistoryResponse,
  GetEarningsOverviewResponse,
  PayoutRequestData,
} from "../../types/earning";
import { toast } from "sonner";

export const useGetEarningsOverview = () => {
  return useQuery<GetEarningsOverviewResponse>({
    queryKey: ["earnings-overview"],
    queryFn: async () => {
      const res = await api.get("/transactions/earnings/overview");
      return res.data;
    },
  });
};

export const useGetEarningsHistory = (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return useQuery<GetEarningsHistoryResponse>({
    queryKey: ["earnings-history", params],
    queryFn: async () => {
      const res = await api.get("/transactions/earnings/history", { params });
      return res.data;
    },
  });
};

export const useRequestPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PayoutRequestData) => {
      const res = await api.post("/transactions/payouts/request", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payout requested successfully!");
      queryClient.invalidateQueries({ queryKey: ["earnings-overview"] });
      queryClient.invalidateQueries({ queryKey: ["earnings-history"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to request payout";
      toast.error(message);
    },
  });
};
