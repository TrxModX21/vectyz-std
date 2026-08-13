"use client";

import { useRecentSalesAnalytics } from "@/features/dashboard-analytics/queries";
import { ExternalLink, Zap } from "lucide-react";
import { DataTable } from "../common/data-table";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { DashboardRecentSalesData } from "../../../types/dashboard-analytics";

const statusColors = {
  success: {
    bg: "rgba(0,230,118,0.08)",
    border: "rgba(0,230,118,0.2)",
    text: "#00E676",
  },
  warning: {
    bg: "rgba(255,214,0,0.08)",
    border: "rgba(255,214,0,0.2)",
    text: "#FFD600",
  },
  danger: {
    bg: "rgba(255,0,60,0.08)",
    border: "rgba(255,0,60,0.2)",
    text: "#FF003C",
  },
};

const getStatusConfig = (status: string) => {
  if (status === "PAID")
    return { label: "Completed", type: "success" as const };
  if (status === "PENDING")
    return { label: "Processing", type: "warning" as const };
  return { label: "Failed", type: "danger" as const };
};

const columnHelper = createColumnHelper<DashboardRecentSalesData>();

const columns: ColumnDef<DashboardRecentSalesData, any>[] = [
  columnHelper.accessor("id", {
    header: "Transaction",
    cell: (info) => (
      <span className="font-medium text-cyber-heading">
        #{info.getValue().slice(-6).toUpperCase()}
      </span>
    ),
  }),
  columnHelper.accessor(
    (row) => row.user?.name || row.user?.username || "Unknown User",
    {
      id: "customer",
      header: "Customer",
      cell: (info) => info.getValue(),
    },
  ),
  columnHelper.accessor("creditAmount", {
    header: "Amount",
    cell: (info) => {
      const credit = Number(info.getValue() || 0);
      return (
        <span className="font-medium text-cyber-heading flex gap-1">
          {credit.toLocaleString()} <Zap className="size-4 text-primary" />
        </span>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const config = getStatusConfig(info.getValue());
      const colors = statusColors[config.type];
      return (
        <span
          className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-cyber"
          style={{
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            color: colors.text,
          }}
        >
          {config.label}
        </span>
      );
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(info.getValue())),
  }),
];

export function RecentSalesActivity() {
  const { data, isLoading } = useRecentSalesAnalytics();

  return (
    <div className="cyber-card clip-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-cyber-border">
        <div>
          <h3 className="text-base font-semibold text-cyber-heading font-heading tracking-[1px]">
            Recent Sales Activity
          </h3>
          <p
            className="mt-1 text-[12px]"
            style={{ color: "var(--cyber-body)" }}
          >
            Latest transactions and orders
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wider transition-colors duration-150 text-[#54EAFD] text-shadow-none hover:[text-shadow:0_0_8px_rgba(84,234,253,0.4)]">
          View All
          <ExternalLink size={12} />
        </button>
      </div>

      {/* Table Data Wrapper */}
      <div className="border-t-0">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          showPagination={false}
        />
      </div>
    </div>
  );
}
