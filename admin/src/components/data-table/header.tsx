import { Table, flexRender } from "@tanstack/react-table";
import { TableHeader, TableHead, TableRow } from "../ui/table";

const AppTableHeader = <TData,>({ table }: { table: Table<TData> }) => {
  return (
    <TableHeader className="bg-muted sticky top-0 z-10">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
};

export default AppTableHeader;
