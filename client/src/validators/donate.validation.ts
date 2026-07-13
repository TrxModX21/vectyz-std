import { z } from "zod";

export const donateCreditGatewaySchema = z.object({
  creditAmount: z.coerce.number().min(15, "Minimum donation is 15 Credits"),
});

export type DonateCreditGatewayType = z.infer<typeof donateCreditGatewaySchema>;
