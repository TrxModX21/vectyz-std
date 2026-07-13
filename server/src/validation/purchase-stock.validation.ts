import { z } from "zod";

const currency = ["USD", "IDR"] as const;

export const purchaseStockSchema = z.object({
  stockId: z.cuid("Stock id not valid"),
  currency: z.enum(currency),
});
export type PurchaseStockSchemaType = z.infer<typeof purchaseStockSchema>;
