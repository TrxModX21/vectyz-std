import { useSortable } from "@dnd-kit/sortable";
import { Row, flexRender } from "@tanstack/react-table";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableRow } from "../ui/table";

const DragableRow = ({
  row,
  onRowClick,
}: {
  row: Row<any>;
  onRowClick?: (row: Row<any>) => void;
}) => {
  const { setNodeRef, transform, transition } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={() => onRowClick?.(row)}
      className="cursor-pointer hover:bg-muted/50"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default DragableRow;
