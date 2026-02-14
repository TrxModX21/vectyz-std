import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import ColumnFilter from "./column-filter";
import TableSkeleton from "./skeleton";
import { Table } from "../ui/table";
import AppTableHeader from "./header";
import AppTableBody from "./body";
import TablePagination from "./pagination";

interface PaginationProps {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filtersToolbar?: ReactNode;
  pagination?: PaginationProps;
  isLoading?: boolean;
  showPagination?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRowClick?: (data: TData) => void;
}

const AppTable = <TData extends { id: string }, TValue>({
  columns,
  data,
  filtersToolbar,
  pagination,
  isLoading = false,
  showPagination = true,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: DataTableProps<TData, TValue>) => {
  const [tableData, setTableData] = useState<TData[]>(data);

  // Sync internal state with external data prop
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const ids = useMemo(() => {
    return tableData?.map((row) => row?.id) || [];
  }, [tableData]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { totalCount = 0, pageNumber = 1, pageSize = 10 } = pagination || {};

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: { pageIndex: pageNumber - 1, pageSize },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.id.toString(),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setTableData((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };
  return (
    <div className="w-full flex flex-col justify-start gap-6">
      <div className="flex items-center px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-2 justify-between w-full">
          {filtersToolbar && filtersToolbar}

          <ColumnFilter table={table} />
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          {isLoading ? (
            <TableSkeleton rows={10} columns={5} />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={ids}
                strategy={verticalListSortingStrategy}
              >
                <Table>
                  <AppTableHeader table={table} />

                  <AppTableBody
                    table={table}
                    columns={columns}
                    onRowClick={onRowClick}
                  />
                </Table>
              </SortableContext>
            </DndContext>
          )}
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
