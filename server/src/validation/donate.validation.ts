import { z } from "zod";

const currency = ["USD", "IDR"] as const;

export const donateCreditGatewaySchema = z.object({
  targetUserId: z.string("Target user id not valid"),
  stockId: z.cuid("Stock id not valid"),
  creditAmount: z
    .number("Credit Amount Required")
    .min(15, "Minimum topup is 15 Credits"),
  currency: z.enum(currency),
});
export type DonateCreditGatewayType = z.infer<typeof donateCreditGatewaySchema>;
