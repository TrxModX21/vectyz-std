"use client";

import { useState, useEffect } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useManageCategories } from "@/features/manage-categories/queries";
import {
  useChangeCategoryVisibilityMutation,
  useDeleteCategoryMutation,
  useBulkDeleteCategoryMutation,
} from "@/features/manage-categories/mutations";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { DataTable } from "@/components/common/data-table";
import { CustomDialog } from "@/components/common/dialog";
import { Category } from "../../../types/manage-categories";

import { getCategoryColumns } from "./columns";
import { ManageCategoriesToolbar } from "./manage-categories-toolbar";
import { ManageCategoriesPagination } from "./manage-categories-pagination";
import { EditCategoryModal } from "./edit-category-modal";

export function ManageCategoriesTable({
  onOpenCreateModalChange,
}: {
  onOpenCreateModalChange: () => void;
}) {
  const [queryState, setQueryState] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      search: parseAsString.withDefault(""),
      sortBy: parseAsString.withDefault("createdAt"),
      sortOrder: parseAsString.withDefault("desc"),
    },
    {
      history: "push",
    },
  );

  const { data: categoriesResponse, isLoading } =
    useManageCategories(queryState);
  const categoriesData = categoriesResponse?.data;
  const changeVisibilityMutation = useChangeCategoryVisibilityMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const bulkDeleteCategoryMutation = useBulkDeleteCategoryMutation();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openSortMenu, setOpenSortMenu] = useState(false);
  const [openHideMenu, setOpenHideMenu] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(queryState.search);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const selectedIndexes = Object.keys(rowSelection).filter(
    (key) => (rowSelection as any)[key],
  );
  const selectedCategories = selectedIndexes
    .map((index) => categoriesData?.items[Number(index)])
    .filter(Boolean) as Category[];
  const selectedIds = selectedCategories.map((c) => c.id);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleToggleVisibility = async (
    id: string,
    currentStatus: "active" | "inactive",
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await changeVisibilityMutation.mutateAsync({ id, status: newStatus });
      toast.success(`Category is now ${newStatus}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to change visibility",
      );
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
      setCategoryToDelete(null);
      setRowSelection({}); // reset just in case
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete category",
      );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDeleteCategoryMutation.mutateAsync(selectedIds);
      toast.success(`${selectedIds.length} categories deleted successfully`);
      setIsBulkDeleteDialogOpen(false);
      setRowSelection({});
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete categories",
      );
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== queryState.search) {
        setQueryState({ search: searchValue, page: 1 });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue, queryState.search, setQueryState]);

  const allColumns = getCategoryColumns({
    changeVisibilityIsPending: changeVisibilityMutation.isPending,
    openMenuId,
    setOpenMenuId,
    handleToggleVisibility,
    setCategoryToEdit,
    setCategoryToDelete,
  });

  const visibleColumns = allColumns.filter(
    (col) => !hiddenColumns.includes((col as any).accessorKey || col.id),
  );

  return (
    <div className="cyber-card clip-card flex flex-col p-4 lg:p-6 w-full relative z-0">
      <ManageCategoriesToolbar
        selectedIds={selectedIds}
        setRowSelection={setRowSelection}
        setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
        isLoading={isLoading}
        totalItems={categoriesData?.meta?.totalItems || 0}
        searchValue={searchValue}
        handleSearch={handleSearch}
        openHideMenu={openHideMenu}
        setOpenHideMenu={setOpenHideMenu}
        allColumns={allColumns}
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
        openSortMenu={openSortMenu}
        setOpenSortMenu={setOpenSortMenu}
        queryState={queryState as any}
        setQueryState={setQueryState}
        onOpenCreateModalChange={onOpenCreateModalChange}
      />

      {/* ── Table Container ── */}
      <DataTable
        columns={visibleColumns}
        data={categoriesData?.items || []}
        isLoading={isLoading}
        showPagination={false}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      {/* ── Footer Row ── */}
      <ManageCategoriesPagination
        queryState={queryState as any}
        setQueryState={setQueryState}
        meta={categoriesData?.meta}
      />

      <CustomDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        title="Delete Category"
        description="This action cannot be undone. This will permanently delete the category."
        confirmText="Yes, delete it"
        onConfirm={handleDeleteCategory}
        isLoading={deleteCategoryMutation.isPending}
        destructive
      >
        <p>
          Are you sure you want to delete the category{" "}
          <strong className="text-white">{categoryToDelete?.name}</strong>?
        </p>
      </CustomDialog>

      <CustomDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        title="Delete Selected Categories"
        description="This action cannot be undone. This will permanently delete all selected categories."
        confirmText="Yes, delete them all"
        onConfirm={handleBulkDelete}
        isLoading={bulkDeleteCategoryMutation.isPending}
        destructive
      >
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-white">
            {selectedIds.length} categories
          </strong>
          ?
        </p>
      </CustomDialog>

      <EditCategoryModal
        category={categoryToEdit}
        onClose={() => setCategoryToEdit(null)}
      />
    </div>
  );
}
