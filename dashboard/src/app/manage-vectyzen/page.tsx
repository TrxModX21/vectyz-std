"use client";

import { Suspense } from "react";

import { StatCard } from "@/components/dashboard/stat-card";
import { WidgetGeoSessions } from "@/components/dashboard/widget-geo-sessions";
import { WidgetTraffic } from "@/components/dashboard/widget-traffic";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ShieldUser, UserCheck, UserStar, Loader2 } from "lucide-react";
import { ManageVectyzenTable } from "@/components/manage-vectyzen/manage-vectyzen-table";
import { useManageVectyzenStats } from "@/features/manage-vectyzen/queries";

const ManageVectyzenPage = () => {
  const { data: statsData, isLoading: isStatsLoading } =
    useManageVectyzenStats();

  const stats = [
    {
      title: "Total Anon Users",
      value: statsData?.data?.totalAnon?.toString() || "0",
      change: "+0.0%", // Hardcoded trend for now
      changeType: "neutral" as const,
      icon: ShieldUser,
    },
    {
      title: "Total Vectyzen",
      value: statsData?.data?.totalVectyzen?.toString() || "0",
      change: "+0.0%", // Hardcoded trend for now
      changeType: "positive" as const,
      icon: UserCheck,
    },
    {
      title: "Active Vectyzen",
      value: statsData?.data?.totalActive?.toString() || "0",
      change: "+0.0%", // Hardcoded trend for now
      changeType: "positive" as const,
      icon: UserStar,
    },
  ];

  return (
    <>
      <DashboardLayout>
        <div className="mb-8">
          <h2 className="text-2xl tracking-[2px] mb-1">Manage Vectyzen</h2>
          <p className="text-[13px] text-cyber-body">
            Welcome back, Alex. Here&apos;s you can manage users for Vectolio.
          </p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isStatsLoading ? (
            <div className="col-span-full h-32 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-neon" />
            </div>
          ) : (
            stats.map((stat, index) => (
              <StatCard key={stat.title} {...stat} delay={index * 100} />
            ))
          )}
        </div>

        <div className="mt-6 w-full">
          <Suspense fallback={<div className="p-8 text-center text-cyber-body">Loading users...</div>}>
            <ManageVectyzenTable />
          </Suspense>
        </div>

        {/* Widget Charts Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <WidgetTraffic className="col-span-1" />
          <WidgetGeoSessions className="col-span-2" />
        </div>
      </DashboardLayout>
    </>
  );
};

export default ManageVectyzenPage;
