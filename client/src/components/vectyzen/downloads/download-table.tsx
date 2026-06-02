import AppTable from "@/components/data-table/app-table";
import { History } from "../../../../types/download";
import { columns } from "./columns";

interface DownloadTableProps {
  isLoading: boolean;
  histories: History[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const DownloadTable = ({
  isLoading,
  histories,
  totalCount,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
}: DownloadTableProps) => {
  return (
    <AppTable
      columns={columns}
      data={histories}
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

export default DownloadTable;
