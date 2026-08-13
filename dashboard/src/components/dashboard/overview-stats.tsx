"use client";

import { DollarSign, ShoppingCart, Users, Zap } from "lucide-react";
import { StatCard } from "./stat-card";
import { useOverviewStatsAnalytics } from "@/features/dashboard-analytics/queries";
import { convertCreditToIDR } from "@/lib/helpers";

const OverviewStats = () => {
  const { data, isLoading } = useOverviewStatsAnalytics();
  const statsData = data?.data;

  const stats = [
    {
      title: "Total Vectolio Revenue",
      value: statsData?.totalRevenue.toLocaleString() || "0",
      subValue: statsData
        ? `≈ Rp ${convertCreditToIDR(statsData.totalRevenue).toLocaleString("id-ID")}`
        : undefined,
      change: "+12.5%", // TODO: Add real percentage calculation when API supports it
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Total Success Transactions",
      value: statsData?.totalSuccessTransactions.toLocaleString("id-ID") || "0",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: ShoppingCart,
    },
    {
      title: "Total Vectyzen",
      value: statsData?.totalVectyzen.toLocaleString("id-ID") || "0",
      change: "+3.1%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Credit Pool This Month",
      value: statsData?.creditPool.toLocaleString("id-ID") || "0",
      subValue: statsData
        ? `≈ Rp ${convertCreditToIDR(statsData.creditPool).toLocaleString("id-ID")}`
        : undefined,
      change: "-2.4%",
      changeType: "negative" as const,
      icon: Zap,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          delay={index * 100}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default OverviewStats;
