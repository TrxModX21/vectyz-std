import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { PurchaseStockSchemaType } from "@/validators/purchase-stock.validation";

export const usePurchaseStockCreditGateway = () => {
  return useMutation({
    mutationFn: async (payload: PurchaseStockSchemaType) => {
      const { data } = await api.post(
        "/transactions/purchase-stock/gateway/credit",
        payload,
      );
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

export const usePurchaseStockDirectGateway = () => {
  return useMutation({
    mutationFn: async ({
      stockId,
      gateway,
      currency,
    }: {
      stockId: string;
      gateway: "midtrans" | "polar";
      currency: "IDR" | "USD";
    }) => {
      // Memaksa IDR untuk midtrans, USD untuk polar
      const payloadCurrency = gateway === "midtrans" ? "IDR" : "USD";

      const payload: PurchaseStockSchemaType = {
        stockId,
        currency: payloadCurrency,
      };

      const { data } = await api.post(
        `/transactions/purchase-stock/gateway/${gateway}`,
        payload,
      );
      return data;
    },
  });
};