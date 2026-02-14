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
import FileTypeDialogForm from "./file-type-dialog-form";
import FileTypeDeleteDialog from "./delete-file-type-dialog";

const FileTypeTableAction = ({ row }: { row: Row<FileType> }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { id, name, icon, supportedFileExtension, status, collectionImage } =
    row.original;

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

      <FileTypeDialogForm
        mode="edit"
        initialData={{
          id,
          name,
          icon: icon || "",
          supportedFileExtension,
          status: status as "active" | "inactive",
          collectionImage: collectionImage || undefined,
        }}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
      />

      <FileTypeDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        fileTypeId={id}
      />
    </>
  );
};

export default FileTypeTableAction;
