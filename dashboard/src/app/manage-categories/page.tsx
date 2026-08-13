"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ManageCategoriesTable } from "@/components/manage-categories/manage-categories-table";
import { useState, Suspense } from "react";
import { CreateCategoryModal } from "@/components/manage-categories/create-category-modal";
import PageHeader from "@/components/manage-categories/page-header";

const ManageCategoriesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <DashboardLayout>
        <PageHeader />

        <div className="w-full">
          <Suspense fallback={<div className="p-8 text-center text-cyber-body">Loading categories...</div>}>
            <ManageCategoriesTable
              onOpenCreateModalChange={() => setIsCreateModalOpen(true)}
            />
          </Suspense>
        </div>
      </DashboardLayout>

      {/* ── Modals ── */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default ManageCategoriesPage;
