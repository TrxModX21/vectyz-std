import AppTable from "@/components/data-table/app-table";
import { columns } from "./column";
import { ReactNode } from "react";

interface UsersTableProps {
  isLoading: boolean;
  users: User[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  filtersToolbar?: ReactNode;
}

const UsersTable = ({
  isLoading,
  users,
  totalCount,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  filtersToolbar,
}: UsersTableProps) => {
  return (
    <div className="container mx-auto py-10">
      <AppTable
        columns={columns}
        isLoading={isLoading}
        data={users}
        pagination={{
          totalCount,
          pageNumber: page,
          pageSize: limit,
        }}
        filtersToolbar={filtersToolbar}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default UsersTable;
