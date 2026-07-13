import { z } from "zod";

const currency = ["USD", "IDR"] as const;

export const purchaseStockSchema = z.object({
  stockId: z.string().min(1, "Stock id is required"),
  currency: z.enum(currency),
});

export type PurchaseStockSchemaType = z.infer<typeof purchaseStockSchema>;