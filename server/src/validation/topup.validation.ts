import { z } from "zod";

export const topUpGatewaySchema = z.object({
  creditAmount: z
    .number("Credit Amount Required")
    .min(15, "Minimum topup is 15 Credits"),
});
export type TopUpGatewayType = z.infer<typeof topUpGatewaySchema>;
