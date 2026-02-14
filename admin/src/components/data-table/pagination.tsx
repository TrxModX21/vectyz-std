import { Table } from "@tanstack/react-table";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSize: number;
  totalCount: number;
  showPagination?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const TablePagination = <TData,>({
  table,
  pageSize,
  totalCount,
  showPagination = true,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) => {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = Math.ceil(totalCount / pageSize);

  const handlePageSizeChange = (size: number) => {
    table.setPageSize(size);
    onPageSizeChange?.(size);
  };

  const handlePageChange = (index: number) => {
    table.setPageIndex(index);
    onPageChange?.(index + 1);
  };

  return (
    <div className="flex items-center justify-between px-4">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      {showPagination && (
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Lines per page
            </Label>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50, 100, 500].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {pageIndex + 1} of {pageCount}
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePageChange(0)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>

            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>

            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>

            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => handlePageChange(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePagination;
