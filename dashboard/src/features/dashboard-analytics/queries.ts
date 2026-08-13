import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../../types/api";
import {
  DashboardOverviewStatsData,
  DashboardRecentSalesData,
  DashboardTopAssetData,
  DashboardTopVectyzenData,
  DashboardTrafficData,
  DashboardGeoData,
} from "../../../types/dashboard-analytics";

export const useOverviewStatsAnalytics = () => {
  return useQuery<ApiResponse<DashboardOverviewStatsData>>({
    queryKey: ["dashboard", "analytics", "overview-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/analytics/dashboard/overview-stats");
      return res.data;
    },
    staleTime: 15 * 60 * 1000, // 15 menit
  });
};

export const useRecentSalesAnalytics = () => {
  return useQuery<ApiResponse<DashboardRecentSalesData[]>>({
    queryKey: ["dashboard", "analytics", "recent-sales"],
    queryFn: async () => {
      const res = await api.get("/admin/analytics/dashboard/recent-sales");
      return res.data;
    },
    staleTime: 15 * 60 * 1000, // 15 menit
  });
};

export const useTopAssetsAnalytics = (tier: "free" | "premium" | "all" = "all") => {
  return useQuery<ApiResponse<DashboardTopAssetData[]>>({
    queryKey: ["dashboard", "analytics", "top-assets", tier],
    queryFn: async () => {
      const res = await api.get(`/admin/analytics/dashboard/top-assets?tier=${tier}`);
      return res.data;
    },
    staleTime: 15 * 60 * 1000, // 15 menit
  });
};

export const useTopVectyzenAnalytics = () => {
  return useQuery<ApiResponse<DashboardTopVectyzenData[]>>({
    queryKey: ["dashboard", "analytics", "top-vectyzen"],
    queryFn: async () => {
      const res = await api.get(`/admin/analytics/dashboard/top-vectyzen`);
      return res.data;
    },
    staleTime: 15 * 60 * 1000, // 15 menit
  });
};

export const useTrafficAnalytics = (period: string) => {
  return useQuery<ApiResponse<DashboardTrafficData>>({
    queryKey: ["dashboard", "analytics", "traffic", period],
    queryFn: async () => {
      const res = await api.get(`/admin/analytics/dashboard/traffic?period=${period}`);
      return res.data;
    },
    staleTime: 60 * 60 * 1000,
  });
};

export const useGeoAnalytics = (period: string) => {
  return useQuery<ApiResponse<DashboardGeoData>>({
    queryKey: ["dashboard", "analytics", "geo", period],
    queryFn: async () => {
      const res = await api.get(`/admin/analytics/dashboard/geo?period=${period}`);
      return res.data;
    },
    staleTime: 60 * 60 * 1000,
  });
};