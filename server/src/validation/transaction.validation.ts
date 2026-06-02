import { z } from "zod";

export const getEarningsHistorySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
});
export type GetEarningsHistorySchema = z.infer<typeof getEarningsHistorySchema>;

export const requestPayoutSchema = z.object({
  amountCredit: z.coerce.number().min(250),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(5, "Account number is required"),
  accountHolder: z.string().min(2, "Account holder name is required"),
});
export type RequestPayoutSchema = z.infer<typeof requestPayoutSchema>;
