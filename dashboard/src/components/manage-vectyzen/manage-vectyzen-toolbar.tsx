import { ColumnDef } from "@tanstack/react-table";
import { Check, EyeOff, Filter, Info, Search, Trash2 } from "lucide-react";
import { Vectyzen } from "../../../types/manage-vectyzen";

interface Props {
  selectedIds: string[];
  setRowSelection: (selection: {}) => void;
  setIsBulkDeleteDialogOpen: (open: boolean) => void;
  isLoading: boolean;
  totalItems: number;
  searchValue: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openHideMenu: boolean;
  setOpenHideMenu: (open: boolean) => void;
  allColumns: ColumnDef<Vectyzen>[];
  hiddenColumns: string[];
  setHiddenColumns: React.Dispatch<React.SetStateAction<string[]>>;
  openSortMenu: boolean;
  setOpenSortMenu: (open: boolean) => void;
  queryState: {
    sortBy: string;
    sortOrder: string;
    page: number;
    limit: number;
    search: string;
    filterAnon: string;
    filterBanned: string;
  };
  setQueryState: (
    state: Partial<{
      sortBy: string;
      sortOrder: string;
      page: number;
      limit: number;
      search: string;
      filterAnon: string;
      filterBanned: string;
    }>,
  ) => void;
}

const ManageVectyzenToolbar = ({
  selectedIds,
  setRowSelection,
  setIsBulkDeleteDialogOpen,
  isLoading,
  totalItems,
  searchValue,
  handleSearch,
  openHideMenu,
  setOpenHideMenu,
  allColumns,
  hiddenColumns,
  setHiddenColumns,
  openSortMenu,
  setOpenSortMenu,
  queryState,
  setQueryState,
}: Props) => {
  return (
    <>
      {/* ── Top Metadata Row ── */}
      {selectedIds.length > 0 ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 bg-neon/10 border border-neon/30 p-3 rounded-cyber animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 text-neon font-medium">
            <Check size={18} />
            <span>{selectedIds.length} vectyzens selected</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRowSelection({})}
              className="text-[13px] text-cyber-body hover:text-cyber-heading transition-colors px-2 py-1"
            >
              Clear selection
            </button>
            <button
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              className="flex items-center gap-2 rounded-cyber bg-[#FF3366] px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-[#FF3366]/90 shadow-[0_0_10px_rgba(255,51,102,0.4)] transition-all"
            >
              <Trash2 size={14} />
              Delete Selected
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-cyber-heading">
            <span className="text-[14px] font-medium">Total vectyzens:</span>
            <span className="font-bold tabular-nums">
              {isLoading ? "..." : totalItems}
            </span>
            <Info size={14} className="text-cyber-body-subtle ml-1" />
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-body-subtle"
            />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search vectyzen..."
              className="w-full rounded-full border border-cyber-border bg-cyber-surface-active px-2.5 py-2 pl-9 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}

      {/* ── Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Left Cluster */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setOpenHideMenu(!openHideMenu)}
              className="hidden lg:flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-transparent px-3 py-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
            >
              <EyeOff size={16} />
              Customize Fields
            </button>
            {openHideMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenHideMenu(false)}
                />
                <div className="absolute left-0 mt-2 z-20 w-48 rounded-cyber border border-cyber-border bg-cyber-surface p-2 shadow-lg glow-neon">
                  {allColumns
                    .filter((c) => c.id !== "select" && c.id !== "actions")
                    .map((col) => {
                      const colId = (col as any).accessorKey || col.id;
                      const isHidden = hiddenColumns.includes(colId);
                      const colName =
                        typeof col.header === "string" ? col.header : colId;
                      return (
                        <button
                          key={colId}
                          onClick={() => {
                            setHiddenColumns((prev) =>
                              isHidden
                                ? prev.filter((p) => p !== colId)
                                : [...prev, colId],
                            );
                          }}
                          className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                        >
                          <span className="capitalize">{colName}</span>
                          {!isHidden && (
                            <Check size={14} className="text-neon" />
                          )}
                        </button>
                      );
                    })}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenSortMenu(!openSortMenu)}
              className="flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-transparent px-3 py-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
            >
              <Filter size={16} />
              Sort & Filter
            </button>
            {openSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenSortMenu(false)}
                />
                <div className="absolute left-0 mt-2 z-20 w-48 rounded-cyber border border-cyber-border bg-cyber-surface p-2 shadow-lg glow-neon max-h-96 overflow-y-auto">
                  <div className="text-[11px] font-semibold text-cyber-body-subtle px-2 pb-1 uppercase tracking-wider">
                    User Type
                  </div>
                  <button
                    onClick={() => {
                      setQueryState({ filterAnon: "all", page: 1 });
                      setOpenSortMenu(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    All Users
                    {queryState.filterAnon === "all" && <Check size={14} className="text-neon" />}
                  </button>
                  <button
                    onClick={() => {
                      setQueryState({ filterAnon: "false", page: 1 });
                      setOpenSortMenu(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    Registered Only
                    {queryState.filterAnon === "false" && <Check size={14} className="text-neon" />}
                  </button>
                  <button
                    onClick={() => {
                      setQueryState({ filterAnon: "true", page: 1 });
                      setOpenSortMenu(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    Anonymous Only
                    {queryState.filterAnon === "true" && <Check size={14} className="text-neon" />}
                  </button>

                  <div className="my-2 h-px w-full bg-cyber-border-subtle" />

                  <div className="text-[11px] font-semibold text-cyber-body-subtle px-2 pb-1 uppercase tracking-wider">
                    Account Status
                  </div>
                  <button
                    onClick={() => {
                      setQueryState({ filterBanned: "all", page: 1 });
                      setOpenSortMenu(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    All Status
                    {queryState.filterBanned === "all" && <Check size={14} className="text-neon" />}
                  </button>
                  <button
                    onClick={() => {
                      setQueryState({ filterBanned: "false", page: 1 });
                      setOpenSortMenu(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    Active Users
                    {queryState.filterBanned === "false" && <Check size={14} className="text-neon" />}
                  </button>
                  <button
                    onClick={() => {
                      setQueryState({ filterBanned: "true", page: 1 });
                      setOpenSortMenu(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    Banned Users
                    {queryState.filterBanned === "true" && <Check size={14} className="text-neon" />}
                  </button>

                  <div className="my-2 h-px w-full bg-cyber-border-subtle" />

                  <div className="text-[11px] font-semibold text-cyber-body-subtle px-2 pb-1 uppercase tracking-wider">
                    Sort by
                  </div>
                  <button
                    onClick={() => {
                      setQueryState({
                        sortBy: "createdAt",
                        sortOrder: "desc",
                        page: 1,
                      });
                      setOpenSortMenu(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    Newest
                    {queryState.sortBy === "createdAt" &&
                      queryState.sortOrder === "desc" && (
                        <Check size={14} className="text-neon" />
                      )}
                  </button>
                  <button
                    onClick={() => {
                      setQueryState({
                        sortBy: "createdAt",
                        sortOrder: "asc",
                        page: 1,
                      });
                      setOpenSortMenu(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    Oldest
                    {queryState.sortBy === "createdAt" &&
                      queryState.sortOrder === "asc" && (
                        <Check size={14} className="text-neon" />
                      )}
                  </button>
                  <button
                    onClick={() => {
                      setQueryState({
                        sortBy: "name",
                        sortOrder: "asc",
                        page: 1,
                      });
                      setOpenSortMenu(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    Name (A-Z)
                    {queryState.sortBy === "name" &&
                      queryState.sortOrder === "asc" && (
                        <Check size={14} className="text-neon" />
                      )}
                  </button>
                  <button
                    onClick={() => {
                      setQueryState({
                        sortBy: "name",
                        sortOrder: "desc",
                        page: 1,
                      });
                      setOpenSortMenu(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    Name (Z-A)
                    {queryState.sortBy === "name" &&
                      queryState.sortOrder === "desc" && (
                        <Check size={14} className="text-neon" />
                      )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageVectyzenToolbar;
