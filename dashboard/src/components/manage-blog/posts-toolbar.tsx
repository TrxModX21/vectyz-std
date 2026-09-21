"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Check,
  EyeOff,
  Filter,
  Info,
  PenTool,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useBlogCategories } from "@/features/manage-blogs/queries";
import { BlogPostData } from "../../../types/manage-blogs";

interface ManagePostsToolbarProps {
  selectedIds: string[];
  setRowSelection: (selection: {}) => void;
  setIsBulkDeleteDialogOpen: (open: boolean) => void;
  isLoading: boolean;
  totalItems: number;
  searchValue: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openHideMenu: boolean;
  setOpenHideMenu: (open: boolean) => void;
  allColumns: ColumnDef<BlogPostData>[];
  hiddenColumns: string[];
  setHiddenColumns: React.Dispatch<React.SetStateAction<string[]>>;
  openFilterMenu: boolean;
  setOpenFilterMenu: (open: boolean) => void;
  queryState: {
    page: number;
    limit: number;
    search: string;
    status: string;
    categoryId: string;
  };
  setQueryState: (
    state: Partial<{
      page: number;
      limit: number;
      search: string;
      status: string;
      categoryId: string;
    }>
  ) => void;
}

const PostsToolbar = ({
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
  openFilterMenu,
  setOpenFilterMenu,
  queryState,
  setQueryState,
}: ManagePostsToolbarProps) => {
  const { data: categoriesRes } = useBlogCategories();
  const categories = categoriesRes?.data || [];

  return (
    <>
      {/* ── Top Metadata Row ── */}
      {selectedIds.length > 0 ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 bg-neon/10 border border-neon/30 p-3 rounded-cyber animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 text-neon font-medium">
            <Check size={18} />
            <span>{selectedIds.length} posts selected</span>
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
            <span className="text-[14px] font-medium">Total posts:</span>
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
              placeholder="Search posts..."
              className="w-full rounded-full border border-cyber-border bg-cyber-surface-active px-2.5 py-2 pl-9 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}

      {/* ── Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Left Cluster */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          
          {/* Customize Fields */}
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

          {/* Filters (Status & Category) */}
          <div className="relative">
            <button
              onClick={() => setOpenFilterMenu(!openFilterMenu)}
              className="flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-transparent px-3 py-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
            >
              <Filter size={16} />
              Filters
              {(queryState.status || queryState.categoryId) && (
                <div className="h-2 w-2 rounded-full bg-neon ml-1" />
              )}
            </button>
            {openFilterMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenFilterMenu(false)}
                />
                <div className="absolute left-0 mt-2 z-20 w-56 max-h-80 overflow-y-auto rounded-cyber border border-cyber-border bg-cyber-surface p-2 shadow-lg glow-neon">
                  
                  {/* Status Filter */}
                  <div className="text-[11px] font-semibold text-cyber-body-subtle px-2 pb-1 uppercase tracking-wider">
                    Status
                  </div>
                  <button
                    onClick={() => {
                      setQueryState({ status: "", page: 1 });
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    All Status
                    {!queryState.status && <Check size={14} className="text-neon" />}
                  </button>
                  <button
                    onClick={() => {
                      setQueryState({ status: "PUBLISHED", page: 1 });
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    Published
                    {queryState.status === "PUBLISHED" && <Check size={14} className="text-neon" />}
                  </button>
                  <button
                    onClick={() => {
                      setQueryState({ status: "DRAFT", page: 1 });
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    Draft
                    {queryState.status === "DRAFT" && <Check size={14} className="text-neon" />}
                  </button>

                  <div className="my-2 border-t border-cyber-border" />

                  {/* Category Filter */}
                  <div className="text-[11px] font-semibold text-cyber-body-subtle px-2 pb-1 uppercase tracking-wider">
                    Category
                  </div>
                  <button
                    onClick={() => {
                      setQueryState({ categoryId: "", page: 1 });
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    All Categories
                    {!queryState.categoryId && <Check size={14} className="text-neon" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setQueryState({ categoryId: cat.id, page: 1 });
                      }}
                      className="flex w-full items-center justify-between gap-2 rounded-cyber p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors text-left"
                    >
                      <span className="truncate">{cat.name}</span>
                      {queryState.categoryId === cat.id && <Check size={14} className="text-neon shrink-0" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {(queryState.status || queryState.categoryId) && (
            <button
              onClick={() => setQueryState({ status: "", categoryId: "", page: 1 })}
              className="flex items-center justify-center gap-1 px-3 py-2 text-[13px] font-medium text-[#FF3366] hover:bg-[#FF3366]/10 rounded-cyber border border-[#FF3366]/20 transition-colors"
            >
              <X size={14} /> Clear Filter
            </button>
          )}

        </div>

        {/* Right Cluster */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <Link
            href="/manage-blog/posts/create"
            className="flex items-center justify-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-3 py-2 text-[13px] font-medium text-neon hover:bg-[rgba(84,234,253,0.2)] transition-colors"
          >
            <PenTool size={16} />
            Write Post
          </Link>
        </div>
      </div>
    </>
  );
};

export default PostsToolbar;
