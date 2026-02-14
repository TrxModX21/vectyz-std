"use client";

import { useGetFileTypes } from "@/hooks/use-file-type";
import FileTypesTable from "@/components/file-types/table";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import FileTypeDialogForm from "@/components/file-types/file-type-dialog-form";

const FileTypePage = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { data, isLoading } = useGetFileTypes();
  const fileTypes = data?.fileTypes ?? [];

  return (
    <section className="px-8">
      <Item variant="outline" className="flex-col lg:flex-row">
        <ItemContent className="w-full items-center lg:w-fit lg:items-start">
          <ItemTitle className="text-2xl font-semibold">File Types</ItemTitle>
          <ItemDescription>Manage supported file types and icons</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" onClick={() => setOpenCreateDialog(true)}>
            <PlusCircleIcon />
            Add File Type
          </Button>
        </ItemActions>
      </Item>

      <FileTypesTable isLoading={isLoading} fileTypes={fileTypes} />

      <FileTypeDialogForm
        mode="create"
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
    </section>
  );
};

export default FileTypePage;
