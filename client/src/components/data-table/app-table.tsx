import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table } from "../ui/table";
import TableSkeleton from "./table-skeleton";
import AppTableHeader from "./header";
import ColumnFilter from "./column-filter";
import AppTableBody from "./body";
import { useState } from "react";
import TablePagination from "./pagination";

interface PaginationProps {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  showPagination?: boolean;
  pagination?: PaginationProps;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRowClick?: (data: TData) => void;
}

const AppTable = <TData extends { id: string }, TValue>({
  columns,
  data,
  isLoading,
  showPagination = true,
  pagination,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: DataTableProps<TData, TValue>) => {
  const { totalCount = 0, pageNumber = 1, pageSize = 10 } = pagination || {};

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    state: {
      columnFilters,
      columnVisibility,
      pagination: { pageIndex: pageNumber - 1, pageSize },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.id.toString(),
  });

  if (isLoading) return <TableSkeleton rows={10} columns={5} />;

  return (
    <div className="w-full flex flex-col justify-start gap-6">
      <ColumnFilter table={table} />

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <AppTableHeader table={table} />

            <AppTableBody
              columns={columns}
              table={table}
              onRowClick={(r) => onRowClick?.(r.original)}
            />
          </Table>
        </div>

        <TablePagination
          table={table}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          showPagination={showPagination}
        />
      </div>
    </div>
  );
};

export default AppTable;
