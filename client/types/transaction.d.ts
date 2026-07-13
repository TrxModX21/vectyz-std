export type TransactionType =
  | "TOPUP_CREDIT"
  | "SUBSCRIPTION"
  | "BUY_ASSET"
  | "WITHDRAWAL"
  | "DONATION"
  | "EARNING_DONATION"
  | "EARNING_ASSET"
  | "POOL_EARNING";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface TransactionItem {
  id: string;
  userId: string;
  targetUserId?: string | null;
  type: TransactionType;
  status: PaymentStatus;
  amount: number;
  amountCurrency?: string;
  creditAmount?: number | null;
  paymentMethod?: string | null;
  externalId?: string | null;
  snapToken?: string | null;
  stockId?: string | null;
  planId?: string | null;
  billingCycle?: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  stock?: { title: string } | null;
  plan?: { name: string } | null;
  targetUser?: { name: string } | null;
}

export interface GetTransactionsResponse {
  message: string;
  timestamp: string;
  transactions: TransactionItem[];
  totalCount: number;
  totalPages: number;
}
