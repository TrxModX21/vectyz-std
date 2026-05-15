import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface DashboardAnalyticsResponse {
  overview: {
    credits: number;
    plan: {
      name: string;
      renewalDate: string | null;
    };
    stats: {
      earnings: {
        current: { totalCredits: number; fiat: { IDR: number; USD: number } };
        changePercent: number;
      };
      downloads: { current: number; changePercent: number };
      activeAssets: { current: number; changeValue: number };
      profileViews: { current: number; changePercent: number };
    };
  };
  charts: {
    downloads: { month: string; downloads: number }[];
    earnings: { month: string; earnings: number }[];
  };
  recentActivities: {
    id: string;
    type: "DOWNLOAD" | "SALE";
    title: string;
    description: string;
    date: string;
  }[];
}

export const useGetDashboardAnalytics = () => {
  return useQuery({
    queryKey: ["dashboardAnalytics"],
    queryFn: async () => {
      const response = await api.get<{ data: DashboardAnalyticsResponse }>("/dashboard/vectyzen-analytics");
      return response.data.data;
    },
  });
};