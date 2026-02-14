import AppTable from "@/components/data-table/app-table";
import { columns } from "./columns";
import { ReactNode } from "react";

interface StocksTableProps {
  isLoading: boolean;
  stocks: Stock[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  filtersToolbar?: ReactNode;
  onRowClick?: (stock: Stock) => void;
}

const StocksTable = ({
  isLoading,
  stocks,
  totalCount,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  filtersToolbar,
  onRowClick,
}: StocksTableProps) => {
  return (
    <div className="container mx-auto py-10">
      <AppTable
        columns={columns}
        isLoading={isLoading}
        data={stocks}
        pagination={{
          totalCount,
          pageNumber: page,
          pageSize: limit,
        }}
        filtersToolbar={filtersToolbar}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default StocksTable;
