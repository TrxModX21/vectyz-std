"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import CreateFileTypeModal from "@/components/manage-filetypes/create-filetype-modal";
import ManageFiletypesTable from "@/components/manage-filetypes/manage-filetypes-table";
import PageHeader from "@/components/manage-filetypes/page-header";
import { useState, Suspense } from "react";

const ManageFiletypesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <DashboardLayout>
        <PageHeader />

        <div className="w-full">
          <Suspense fallback={<div className="p-8 text-center text-cyber-body">Loading file types...</div>}>
            <ManageFiletypesTable
              onOpenCreateModalChange={() => setIsCreateModalOpen(true)}
            />
          </Suspense>
        </div>
      </DashboardLayout>

      {/* ── Modals ── */}
      <CreateFileTypeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default ManageFiletypesPage;
