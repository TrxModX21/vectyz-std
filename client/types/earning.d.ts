export interface EarningsOverview {
  totalBalance: number;
  thisMonthEarnings: number;
  estimatedPoolShare: number;
  nextPayoutDate: string;
}

export interface GetEarningsOverviewResponse {
  message: string;
  timestamp: string;
  data: EarningsOverview;
}

export interface TransactionHistoryItem {
  id: string;
  type: string;
  amount: number;
  creditAmount: number;
  status: string;
  createdAt: string;
  user: { name: string } | null;
  targetUser: { name: string } | null;
  stock: { title: string } | null;
}

export interface GetEarningsHistoryResponse {
  message: string;
  timestamp: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  history: TransactionHistoryItem[];
}

export interface PayoutRequestData {
  amountCredit: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}
