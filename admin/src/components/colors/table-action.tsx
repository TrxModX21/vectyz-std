import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import ColorDialogForm from "./color-dialog-form";
import ColorDeleteDialog from "./delete-color-dialog";

const ColorTableAction = ({ row }: { row: Row<Color> }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { id, name, color } = row.original;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ColorDialogForm
        mode="edit"
        initialData={{
          id,
          name,
          color,
        }}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
      />

      <ColorDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        colorId={id}
      />
    </>
  );
};

export default ColorTableAction;
