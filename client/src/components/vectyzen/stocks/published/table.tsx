import AppTable from "@/components/data-table/app-table";
import { columns } from "./columns";

interface PublishedTableProps {
  isLoading: boolean;
  stocks: UserStock[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRowClick?: (stock: UserStock) => void;
}

const PublishedTable = ({
  isLoading,
  stocks,
  totalCount,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: PublishedTableProps) => {
  return (
    <AppTable
      columns={columns}
      data={stocks}
      isLoading={isLoading}
      pagination={{
        totalCount,
        pageNumber: page,
        pageSize: limit,
      }}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowClick={onRowClick}
    />
  );
};

export default PublishedTable;
