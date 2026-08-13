import { Metadata } from "next";
import { Suspense } from "react";
import { ManageStocksTable } from "@/components/manage-stocks/manage-stocks-table";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import PageHeader from "@/components/manage-stocks/page-header";

export const metadata: Metadata = {
  title: "Manage Stocks | Admin Dashboard",
  description: "Manage uploaded stock assets, approve or reject them.",
};

export default function ManageStocksPage() {
  return (
    <DashboardLayout>
      <PageHeader />
      
      <div className="w-full">
        <Suspense fallback={<div className="p-8 text-center text-cyber-body">Loading assets...</div>}>
          <ManageStocksTable />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
