import { ColumnDef, Row, Table, flexRender } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "../ui/table";

const AppTableBody = <TData, TValue>({
  table,
  columns,
  onRowClick,
}: {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
  onRowClick?: (row: Row<any>) => void;
}) => {
  return (
    <TableBody>
      {table.getRowModel().rows.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            onClick={() => onRowClick?.(row)}
            className="cursor-pointer hover:bg-muted/50"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="text-center">
            No data yet
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default AppTableBody;
