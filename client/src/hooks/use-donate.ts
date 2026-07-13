import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/axios";

export const useDonateCredit = () => {
  return useMutation({
    mutationFn: async (payload: {
      targetUserId: string;
      stockId: string;
      creditAmount: number;
      currency: "IDR" | "USD";
    }) => {
      const { data } = await api.post(
        "/transactions/donate/gateway/credit",
        payload,
      );
      return data;
    },
  });
};

export const useDonateMidtransGateway = () => {
  return useMutation({
    mutationFn: async (payload: {
      targetUserId: string;
      stockId: string;
      creditAmount: number;
    }) => {
      const { data } = await api.post("/transactions/donate/gateway/midtrans", {
        ...payload,
        currency: "IDR",
      });
      return data;
    },
  });
};

export const useDonatePolarGateway = () => {
  return useMutation({
    mutationFn: async (payload: {
      targetUserId: string;
      stockId: string;
      creditAmount: number;
    }) => {
      const { data } = await api.post("/transactions/donate/gateway/polar", {
        ...payload,
        currency: "USD",
      });
      return data;
    },
  });
};
