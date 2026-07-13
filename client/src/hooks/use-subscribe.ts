import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { SubscriptionPayload } from "../validators/subscribe.validation";

interface CreateSubscriptionArgs {
  gateway: "polar" | "midtrans";
  payload: SubscriptionPayload;
}

export const useCreateSubscriptionGateway = () => {
  return useMutation({
    mutationFn: async ({ gateway, payload }: CreateSubscriptionArgs) => {
      const { data } = await api.post(`/transactions/subscribe/gateway/${gateway}`, payload);
      return data;
    },
  });
};
