import { Prisma } from "@/generated/prisma/client";

export type DashboardOverviewStatsData = {
  totalRevenue: number;
  totalSuccessTransactions: number;
  totalVectyzen: number;
  creditPool: number;
};

export type DashboardRecentSalesData = Prisma.TransactionGetPayload<{
  include: { user: true };
}>;

export type DashboardTopAssetData = Prisma.StockGetPayload<{
  include: {
    user: {
      select: { id: true; name: true; username: true };
    };
    files: {
      select: { url: true };
    };
  };
}>;

export type DashboardTopVectyzenData = {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
  role: string;
  totalFollowers: number;
  totalDownloads: number;
  totalLikes: number;
  totalAssets: number;
};

export type DashboardTrafficData = {
  totalSessions: number;
  totalActiveUsers: number;
  rows: Array<{
    channel: string;
    device: string;
    sessions: number;
    activeUsers: number;
  }>;
};

export type DashboardGeoData = Array<{
  country: string;
  sessions: number;
}>;