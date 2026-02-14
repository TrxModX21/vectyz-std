import CategoryDialogForm from "@/components/categories/category-dialog-form";
import CategoryDeleteDialog from "@/components/categories/delete-category-dialog";
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

const CategoryTableAction = ({ row }: { row: Row<Category> }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { id, image, name, status } = row.original;

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
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CategoryDialogForm
        mode="edit"
        initialData={{
          id,
          name,
          image,
          status,
        }}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
      />

      <CategoryDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        categoryId={id}
      />
    </>
  );
};

export default CategoryTableAction;
