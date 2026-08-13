"use client";

import { useEffect, useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useManageVectyzen } from "@/features/manage-vectyzen/queries";
import { Vectyzen } from "../../../types/manage-vectyzen";
import { getVectyzenColumns } from "./columns";
import { DataTable } from "../common/data-table";
import ManageVectyzenPagination from "./manage-vectyzen-pagination";
import ManageVectyzenToolbar from "./manage-vectyzen-toolbar";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { CustomDialog } from "@/components/common/dialog";
import {
  useDeleteVectyzenMutation,
  useBulkDeleteVectyzenMutation,
  useToggleOfficialMutation,
  useBanVectyzenMutation,
} from "@/features/manage-vectyzen/mutations";

export function ManageVectyzenTable() {
  const [queryState, setQueryState] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      search: parseAsString.withDefault(""),
      sortBy: parseAsString.withDefault("createdAt"),
      sortOrder: parseAsString.withDefault("desc"),
      filterAnon: parseAsString.withDefault("all"),
      filterBanned: parseAsString.withDefault("all"),
    },
    {
      history: "push",
    },
  );

  const { data: vectyzensResponse, isLoading } = useManageVectyzen(queryState);
  const vectyzenData = vectyzensResponse?.data;

  const deleteVectyzenMutation = useDeleteVectyzenMutation();
  const bulkDeleteVectyzenMutation = useBulkDeleteVectyzenMutation();
  const toggleOfficialMutation = useToggleOfficialMutation();
  const banVectyzenMutation = useBanVectyzenMutation();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openSortMenu, setOpenSortMenu] = useState(false);
  const [openHideMenu, setOpenHideMenu] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(queryState.search);
  const [vectyzenToDelete, setVectyzenToDelete] = useState<Vectyzen | null>(
    null,
  );
  const [vectyzenToBan, setVectyzenToBan] = useState<Vectyzen | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const selectedIndexes = Object.keys(rowSelection).filter(
    (key) => (rowSelection as any)[key],
  );

  const dataArray = Array.isArray(vectyzensResponse?.data)
    ? vectyzensResponse?.data
    : (vectyzensResponse as any)?.data?.items || [];

  const selectedVectyzens = selectedIndexes
    .map((index) => dataArray[Number(index)])
    .filter(Boolean) as Vectyzen[];
  const selectedIds = selectedVectyzens.map((c) => c.id);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleToggleOfficial = async (id: string, isOfficial: boolean) => {
    try {
      await toggleOfficialMutation.mutateAsync({ id, isOfficial });
      toast.success(`Vectyzen is now ${isOfficial ? "Official" : "Standard"}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to change official status",
      );
    }
  };

  const handleBanConfirm = async () => {
    if (!vectyzenToBan) return;
    try {
      await banVectyzenMutation.mutateAsync({
        id: vectyzenToBan.id,
        banned: !vectyzenToBan.banned, // toggle ban
        banReason: !vectyzenToBan.banned ? "Manual ban by admin" : null,
      });
      toast.success(
        `Vectyzen has been ${!vectyzenToBan.banned ? "banned" : "unbanned"}`,
      );
      setVectyzenToBan(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update ban status",
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!vectyzenToDelete) return;
    try {
      await deleteVectyzenMutation.mutateAsync(vectyzenToDelete.id);
      toast.success(`Vectyzen "${vectyzenToDelete.name}" deleted successfully`);
      setVectyzenToDelete(null);
      setRowSelection({});
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete vectyzen",
      );
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDeleteVectyzenMutation.mutateAsync(selectedIds);
      toast.success(`${selectedIds.length} vectyzens deleted successfully`);
      setIsBulkDeleteDialogOpen(false);
      setRowSelection({});
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete vectyzens",
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

  const allColumns = getVectyzenColumns({
    toggleOfficialIsPending: toggleOfficialMutation.isPending,
    openMenuId,
    setOpenMenuId,
    handleToggleOfficial,
    setVectyzenToBan,
    setVectyzenToDelete,
  });

  const visibleColumns = allColumns.filter(
    (col) => !hiddenColumns.includes((col as any).accessorKey || col.id),
  );

  return (
    <div className="cyber-card clip-card flex flex-col p-4 lg:p-6 w-full relative z-0">
      <ManageVectyzenToolbar
        selectedIds={selectedIds}
        setRowSelection={setRowSelection}
        setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
        isLoading={isLoading}
        totalItems={vectyzenData?.meta?.totalItems || 0}
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
      />

      {/* ── Table Container ── */}
      <DataTable
        columns={visibleColumns}
        data={dataArray}
        isLoading={isLoading}
        showPagination={false}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      {/* ── Footer Row ── */}
      <ManageVectyzenPagination
        queryState={queryState as any}
        setQueryState={setQueryState}
        meta={vectyzenData?.meta}
      />

      <CustomDialog
        open={!!vectyzenToBan}
        onOpenChange={(open) => !open && setVectyzenToBan(null)}
        title={vectyzenToBan?.banned ? "Unban Vectyzen" : "Ban Vectyzen"}
        description={
          vectyzenToBan?.banned
            ? "Are you sure you want to lift the ban on this user? They will regain access to the platform."
            : "Are you sure you want to ban this user? They will lose access to the platform."
        }
        confirmText={vectyzenToBan?.banned ? "Yes, Unban" : "Yes, Ban User"}
        onConfirm={handleBanConfirm}
        isLoading={banVectyzenMutation.isPending}
        destructive
      >
        <p>
          Are you sure you want to {vectyzenToBan?.banned ? "unban" : "ban"} the
          user <strong className="text-white">{vectyzenToBan?.name}</strong>?
        </p>
      </CustomDialog>

      <CustomDialog
        open={!!vectyzenToDelete}
        onOpenChange={(open) => !open && setVectyzenToDelete(null)}
        title="Delete Vectyzen"
        description="This action cannot be undone. All associated data and assets will be removed."
        confirmText="Yes, delete"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteVectyzenMutation.isPending}
        destructive
      >
        <p>
          Are you sure you want to permanently delete{" "}
          <strong className="text-white">{vectyzenToDelete?.name}</strong>?
        </p>
      </CustomDialog>

      <CustomDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        title="Delete Selected Vectyzens"
        description="This action cannot be undone. All associated data and assets will be removed."
        confirmText="Yes, delete them all"
        onConfirm={handleBulkDeleteConfirm}
        isLoading={bulkDeleteVectyzenMutation.isPending}
        destructive
      >
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-white">{selectedIds.length} users</strong>?
        </p>
      </CustomDialog>
    </div>
  );
}
