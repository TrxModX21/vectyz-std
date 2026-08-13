"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  showPagination?: boolean;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (updater: any) => void;
  onRowClick?: (row: any) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  showPagination = true,
  rowSelection,
  onRowSelectionChange,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-cyber border border-cyber-border bg-cyber-surface shadow-sm">
        <table className="w-full text-left text-[13px] text-cyber-body">
          <thead className="bg-cyber-surface-raised border-b border-cyber-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-[12px] font-medium uppercase tracking-[1px] text-cyber-body"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 6 }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "bg-cyber-surface",
                    rowIndex < 5 ? "border-b border-cyber-border" : ""
                  )}
                >
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      <div className="h-4 w-full max-w-30 animate-pulse rounded-md bg-cyber-body/30" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    "transition-colors duration-150 bg-cyber-surface hover:bg-cyber-surface-raised",
                    onRowClick ? "cursor-pointer" : "",
                    index < table.getRowModel().rows.length - 1
                      ? "border-b border-cyber-border"
                      : ""
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-cyber-body"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {showPagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-cyber border border-cyber-border bg-cyber-surface text-cyber-body transition-colors hover:bg-cyber-surface-raised hover:text-cyber-heading disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-cyber border border-cyber-border bg-cyber-surface text-cyber-body transition-colors hover:bg-cyber-surface-raised hover:text-cyber-heading disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
