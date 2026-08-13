"use client";

import { useEffect, useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { StockData } from "../../../types/manage-stocks";
import { useManageStocks } from "@/features/manage-stocks/queries";
import { useApproveStockMutation, useRejectStockMutation, useDeleteStockMutation } from "@/features/manage-stocks/mutations";
import { getStocksColumns } from "./columns";
import { DataTable } from "../common/data-table";
import ManageStocksPagination from "./manage-stocks-pagination";
import ManageStocksToolbar from "./manage-stocks-toolbar";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { CustomDialog } from "@/components/common/dialog";
import ManageStocksTabs from "./manage-stocks-tabs";
import ManageStocksDetailModal from "./manage-stocks-detail-modal";

export function ManageStocksTable() {
  const [queryState, setQueryState] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      search: parseAsString.withDefault(""),
      sortBy: parseAsString.withDefault("createdAt"),
      sortOrder: parseAsString.withDefault("desc"),
      filterStatus: parseAsString.withDefault("all"),
    },
    {
      history: "push",
    }
  );

  const { data: stocksResponse, isLoading } = useManageStocks(queryState as any);
  const data = stocksResponse?.data?.items || [];

  const counts = stocksResponse?.data?.meta?.counts || {
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    deleted: 0,
  };

  const [openSortMenu, setOpenSortMenu] = useState(false);
  const [openHideMenu, setOpenHideMenu] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(queryState.search);
  
  const [stockToApprove, setStockToApprove] = useState<StockData | null>(null);
  const [stockToReject, setStockToReject] = useState<StockData | null>(null);
  const [stockToDelete, setStockToDelete] = useState<StockData | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  
  const [stockDetail, setStockDetail] = useState<StockData | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const [rowSelection, setRowSelection] = useState({});
  const [isBulkApproveOpen, setIsBulkApproveOpen] = useState(false);
  const [isBulkRejectOpen, setIsBulkRejectOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const selectedIndexes = Object.keys(rowSelection).filter(
    (key) => (rowSelection as any)[key]
  );
  
  const selectedStocks = selectedIndexes
    .map((index) => data[Number(index)])
    .filter(Boolean) as StockData[];
  const selectedIds = selectedStocks.map((c) => c.id);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== queryState.search) {
        setQueryState({ search: searchValue, page: 1 });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue, queryState.search, setQueryState]);

  const approveStock = useApproveStockMutation();
  const rejectStock = useRejectStockMutation();

  // Mock Mutation Handlers
  const handleApproveConfirm = async () => {
    if (!stockToApprove) return;
    try {
      await approveStock.mutateAsync(stockToApprove.id);
      toast.success(`Asset "${stockToApprove.title}" approved!`);
      setStockToApprove(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve asset");
    }
  };

  const handleRejectConfirm = async () => {
    if (!stockToReject) return;
    try {
      await rejectStock.mutateAsync({ id: stockToReject.id, rejectionReason: rejectReason });
      toast.success(`Asset "${stockToReject.title}" rejected!`);
      setStockToReject(null);
      setRejectReason("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject asset");
    }
  };

  const deleteStock = useDeleteStockMutation();

  const handleDeleteConfirm = async () => {
    if (!stockToDelete) return;
    try {
      await deleteStock.mutateAsync(stockToDelete.id);
      toast.success(`Asset "${stockToDelete.title}" deleted!`);
      setStockToDelete(null);
      setRowSelection({});
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete asset");
    }
  };

  const allColumns = getStocksColumns({
    setStockToApprove,
    setStockToReject,
    setStockToDelete,
    setStockDetail,
    setDetailModalOpen,
  });

  const visibleColumns = allColumns.filter(
    (col) => !hiddenColumns.includes((col as any).accessorKey || col.id)
  );

  return (
    <div className="cyber-card clip-card flex flex-col p-4 lg:p-6 w-full relative z-0">
      
      <ManageStocksTabs
        currentTab={queryState.filterStatus}
        onTabChange={(tab) => setQueryState({ filterStatus: tab, page: 1 })}
        counts={counts}
      />

      <ManageStocksToolbar
        selectedIds={selectedIds}
        setRowSelection={setRowSelection}
        setIsBulkApproveOpen={setIsBulkApproveOpen}
        setIsBulkRejectOpen={setIsBulkRejectOpen}
        setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
        isLoading={isLoading}
        totalItems={stocksResponse?.data?.meta?.totalItems || 0}
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
        data={data}
        isLoading={isLoading}
        showPagination={false}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onRowClick={(row) => {
          setStockDetail(row.original);
          setDetailModalOpen(true);
        }}
      />

      {/* ── Footer Row ── */}
      <ManageStocksPagination
        queryState={queryState as any}
        setQueryState={setQueryState}
        meta={stocksResponse?.data?.meta}
      />

      {/* DIALOGS */}
      <ManageStocksDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        stock={stockDetail}
        onApprove={(id) => {
          setStockToApprove(stockDetail);
          setDetailModalOpen(false);
        }}
        onReject={async (id, reason) => {
          try {
            await rejectStock.mutateAsync({ id, rejectionReason: reason });
            toast.success(`Asset rejected!`);
            setDetailModalOpen(false);
          } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reject asset");
          }
        }}
        onSave={(stock) => {
          toast.success(`Metadata saved for ${stock.title}`);
          setDetailModalOpen(false);
        }}
      />

      <CustomDialog
        open={!!stockToApprove}
        onOpenChange={(open) => !open && setStockToApprove(null)}
        title="Approve Asset"
        description="This will make the asset live and available for users."
        confirmText="Yes, approve it"
        onConfirm={handleApproveConfirm}
        isLoading={approveStock.isPending}
      >
        <p>
          Approve asset <strong className="text-white">{stockToApprove?.title}</strong>?
        </p>
      </CustomDialog>

      <CustomDialog
        open={!!stockToReject}
        onOpenChange={(open) => {
          if (!open) {
            setStockToReject(null);
            setRejectReason("");
          }
        }}
        title="Reject Asset"
        description="The creator will be notified of this rejection."
        confirmText="Yes, reject it"
        onConfirm={handleRejectConfirm}
        isLoading={rejectStock.isPending}
        destructive
      >
        <div className="space-y-4">
          <p>
            Reject asset <strong className="text-white">{stockToReject?.title}</strong>?
          </p>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-cyber-body">Reason for Rejection</label>
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-sm border border-cyber-border bg-cyber-background px-3 py-2 text-[13px] focus:border-neon focus:outline-none resize-none"
              rows={3}
              placeholder="Explain why this asset is rejected..."
            />
          </div>
        </div>
      </CustomDialog>

      <CustomDialog
        open={!!stockToDelete}
        onOpenChange={(open) => !open && setStockToDelete(null)}
        title="Delete Asset"
        description="This action will hide the asset from public view."
        confirmText="Yes, delete it"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteStock.isPending}
        destructive
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete <strong className="text-white">{stockToDelete?.title}</strong>?
          </p>
          <div className="text-[13px] text-cyber-body-subtle bg-cyber-surface-active p-3 rounded-cyber border border-cyber-border-subtle">
            <strong className="text-white block mb-1">Note (Soft Delete):</strong>
            This asset will not be permanently removed from the database. It will only be hidden from the public marketplace. Users who have previously downloaded or purchased this asset will still retain access to it.
          </div>
        </div>
      </CustomDialog>

      <CustomDialog
        open={isBulkApproveOpen}
        onOpenChange={setIsBulkApproveOpen}
        title="Bulk Approve Assets"
        description="This will approve all selected pending assets."
        confirmText="Yes, approve selected"
        onConfirm={async () => {
          toast.success(`${selectedIds.length} assets approved`);
          setIsBulkApproveOpen(false);
          setRowSelection({});
        }}
        isLoading={false}
      >
        <p>
          Approve <strong className="text-white">{selectedIds.length} assets</strong>?
        </p>
      </CustomDialog>
      
      <CustomDialog
        open={isBulkRejectOpen}
        onOpenChange={setIsBulkRejectOpen}
        title="Bulk Reject Assets"
        description="This will reject all selected assets."
        confirmText="Yes, reject selected"
        onConfirm={async () => {
          toast.success(`${selectedIds.length} assets rejected`);
          setIsBulkRejectOpen(false);
          setRowSelection({});
        }}
        isLoading={false}
        destructive
      >
        <p>
          Reject <strong className="text-white">{selectedIds.length} assets</strong>?
        </p>
      </CustomDialog>
    </div>
  );
}
