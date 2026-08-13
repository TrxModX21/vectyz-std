import { useEffect, useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useManageFiletypes } from "@/features/manage-filetypes/queries";
import { FileTypeData } from "../../../types/manage-filetype";
import { getFiletypeColumns } from "./columns";
import { DataTable } from "../common/data-table";
import FiletypePagination from "./pagination";
import ManageFiletypeToolbar from "./toolbar";
import { EditFiletypeModal } from "./edit-filetype-modal";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { CustomDialog } from "@/components/common/dialog";
import {
  useDeleteFiletypeMutation,
  useBulkDeleteFiletypeMutation,
  useChangeFiletypeVisibilityMutation,
} from "@/features/manage-filetypes/mutations";

const ManageFiletypesTable = ({
  onOpenCreateModalChange,
}: {
  onOpenCreateModalChange: () => void;
}) => {
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

  const { data: filetypesResponse, isLoading } = useManageFiletypes(queryState);
  const filetypeData = filetypesResponse?.data;
  
  const deleteFiletypeMutation = useDeleteFiletypeMutation();
  const bulkDeleteFiletypeMutation = useBulkDeleteFiletypeMutation();
  const changeVisibilityMutation = useChangeFiletypeVisibilityMutation();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openSortMenu, setOpenSortMenu] = useState(false);
  const [openHideMenu, setOpenHideMenu] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(queryState.search);
  const [filetypeToDelete, setFiletypeToDelete] = useState<FileTypeData | null>(
    null,
  );
  const [filetypeToEdit, setFiletypeToEdit] = useState<FileTypeData | null>(
    null,
  );
  const [rowSelection, setRowSelection] = useState({});
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const selectedIndexes = Object.keys(rowSelection).filter(
    (key) => (rowSelection as any)[key],
  );
  const selectedFiletypes = selectedIndexes
    .map((index) => filetypeData?.items[Number(index)])
    .filter(Boolean) as FileTypeData[];
  const selectedIds = selectedFiletypes.map((c) => c.id);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleToggleVisibility = async (
    id: string,
    currentStatus: string,
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await changeVisibilityMutation.mutateAsync({ id, status: newStatus });
      toast.success(`Filetype is now ${newStatus}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to change visibility",
      );
    }
  };

  const handleDeleteFiletype = async () => {
    if (!filetypeToDelete) return;
    try {
      await deleteFiletypeMutation.mutateAsync(filetypeToDelete.id);
      toast.success(`Filetype "${filetypeToDelete.name}" deleted successfully`);
      setFiletypeToDelete(null);
      setRowSelection({});
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete filetype",
      );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDeleteFiletypeMutation.mutateAsync(selectedIds);
      toast.success(`${selectedIds.length} filetypes deleted successfully`);
      setIsBulkDeleteDialogOpen(false);
      setRowSelection({});
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete filetypes",
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

  const allColumns = getFiletypeColumns({
    changeVisibilityIsPending: changeVisibilityMutation.isPending,
    openMenuId,
    setOpenMenuId,
    handleToggleVisibility,
    setFiletypeToEdit,
    setFiletypeToDelete,
  });

  const visibleColumns = allColumns.filter(
    (col) => !hiddenColumns.includes((col as any).accessorKey || col.id),
  );

  return (
    <div className="cyber-card clip-card flex flex-col p-4 lg:p-6 w-full relative z-0">
      <ManageFiletypeToolbar
        selectedIds={selectedIds}
        setRowSelection={setRowSelection}
        setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
        isLoading={isLoading}
        totalItems={filetypeData?.meta?.totalItems || 0}
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
        data={filetypeData?.items || []}
        isLoading={isLoading}
        showPagination={false}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      {/* ── Footer Row ── */}
      <FiletypePagination
        queryState={queryState as any}
        setQueryState={setQueryState}
        meta={filetypeData?.meta}
      />

      <CustomDialog
        open={!!filetypeToDelete}
        onOpenChange={(open) => !open && setFiletypeToDelete(null)}
        title="Delete Filetype"
        description="This action cannot be undone. This will permanently delete the filetype."
        confirmText="Yes, delete it"
        onConfirm={handleDeleteFiletype}
        isLoading={deleteFiletypeMutation.isPending}
        destructive
      >
        <p>
          Are you sure you want to delete the filetype{" "}
          <strong className="text-white">{filetypeToDelete?.name}</strong>?
        </p>
      </CustomDialog>

      <CustomDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        title="Delete Selected Filetypes"
        description="This action cannot be undone. This will permanently delete all selected filetypes."
        confirmText="Yes, delete them all"
        onConfirm={handleBulkDelete}
        isLoading={bulkDeleteFiletypeMutation.isPending}
        destructive
      >
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-white">
            {selectedIds.length} filetypes
          </strong>
          ?
        </p>
      </CustomDialog>

      <EditFiletypeModal
        filetype={filetypeToEdit}
        onClose={() => setFiletypeToEdit(null)}
      />
    </div>
  );
};

export default ManageFiletypesTable;
