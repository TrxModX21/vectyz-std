import AppTable from "@/components/data-table/app-table";
import { columns } from "./column";

const CategoryTable = ({
  isLoading,
  categories,
}: {
  isLoading: boolean;
  categories: Category[];
}) => {
  return (
    <div className="container mx-auto py-10">
      <AppTable
        columns={columns}
        isLoading={isLoading}
        data={categories}
        showPagination={false}
      />
    </div>
  );
};

export default CategoryTable;
