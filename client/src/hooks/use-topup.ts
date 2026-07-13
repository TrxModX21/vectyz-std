import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useTopUpMidtransGateway = () => {
  return useMutation({
    mutationFn: async (payload: { creditAmount: number }) => {
      const { data } = await api.post(
        "/transactions/topup/gateway/midtrans",
        payload,
      );
      return data;
    },
  });
};

export const useTopUpPolarGateway = () => {
  return useMutation({
    mutationFn: async (payload: { creditAmount: number }) => {
      const { data } = await api.post(
        "/transactions/topup/gateway/polar",
        payload,
      );
      return data;
    },
  });
};
