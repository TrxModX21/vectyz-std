import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface ManageCategoriesPaginationProps {
  queryState: { page: number; limit: number };
  setQueryState: (state: Partial<{ page: number; limit: number }>) => void;
  meta?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export function ManageCategoriesPagination({
  queryState,
  setQueryState,
  meta,
}: ManageCategoriesPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-cyber-border">
      <div className="flex items-center gap-3 text-[13px] text-cyber-body">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <div className="relative">
            <select
              value={queryState.limit}
              onChange={(e) =>
                setQueryState({ limit: parseInt(e.target.value), page: 1 })
              }
              className="appearance-none flex items-center gap-1 rounded-cyber border border-cyber-border px-2 py-1 pr-6 bg-cyber-surface-active hover:bg-cyber-surface-hover transition-colors focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>
        <span className="text-cyber-body-subtle tabular-nums">
          {meta
            ? `${(queryState.page - 1) * queryState.limit + 1}–${Math.min(
                queryState.page * queryState.limit,
                meta.totalItems,
              )} of ${meta.totalItems}`
            : "0-0 of 0"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-px rounded-cyber border border-cyber-border overflow-hidden bg-cyber-border">
        <button
          disabled={queryState.page <= 1}
          onClick={() => setQueryState({ page: queryState.page - 1 })}
          className="flex items-center justify-center gap-1 bg-cyber-surface px-[12px] py-[8px] text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors disabled:opacity-50 disabled:hover:bg-cyber-surface"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          disabled={!meta || queryState.page >= meta.totalPages}
          onClick={() => setQueryState({ page: queryState.page + 1 })}
          className="flex items-center justify-center gap-1 bg-cyber-surface px-[12px] py-[8px] text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors disabled:opacity-50 disabled:hover:bg-cyber-surface"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
