import AppTable from "@/components/data-table/app-table";
import { columns } from "./column";

const FileTypesTable = ({
  isLoading,
  fileTypes,
}: {
  isLoading: boolean;
  fileTypes: FileType[];
}) => {
  return (
    <div className="container mx-auto py-10">
      <AppTable
        columns={columns}
        isLoading={isLoading}
        data={fileTypes}
        showPagination={false}
      />
    </div>
  );
};

export default FileTypesTable;
