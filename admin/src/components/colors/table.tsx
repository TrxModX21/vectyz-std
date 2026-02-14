import AppTable from "@/components/data-table/app-table";
import { columns } from "./column";

const ColorsTable = ({
  isLoading,
  colors,
}: {
  isLoading: boolean;
  colors: Color[];
}) => {
  return (
    <div className="container mx-auto py-10">
      <AppTable
        columns={columns}
        isLoading={isLoading}
        data={colors}
        showPagination={false}
      />
    </div>
  );
};

export default ColorsTable;
