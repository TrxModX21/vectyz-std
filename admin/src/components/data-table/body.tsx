import { ColumnDef, Table } from "@tanstack/react-table";
import React from "react";
import { TableBody, TableCell, TableRow } from "../ui/table";
import DragableRow from "./dragable-row";

const AppTableBody = <TData, TValue>({
  table,
  columns,
  onRowClick,
}: {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
  onRowClick?: (data: TData) => void;
}) => {
  return (
    <TableBody className="**:data-[slot=table-cell]:first:w-8">
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <DragableRow
            key={row.id}
            row={row}
            onRowClick={(r) => onRowClick?.(r.original)}
          />
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
