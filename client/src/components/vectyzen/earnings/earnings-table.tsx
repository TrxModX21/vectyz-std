import AppTable from "@/components/data-table/app-table";
import { TransactionHistoryItem } from "../../../../types/earning";
import { columns } from "./columns";

interface EarningsTableProps {
  isLoading: boolean;
  transactions: TransactionHistoryItem[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const EarningsTable = ({
  isLoading,
  transactions,
  totalCount,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
}: EarningsTableProps) => {
  return (
    <AppTable
      columns={columns}
      data={transactions}
      isLoading={isLoading}
      pagination={{
        totalCount,
        pageNumber: page,
        pageSize: limit,
      }}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
};

export default EarningsTable;
