"use client";

import { useGetColors } from "@/hooks/use-color";
import ColorsTable from "@/components/colors/table";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import ColorDialogForm from "@/components/colors/color-dialog-form";
import { useState } from "react";

const ColorsPage = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { data, isLoading } = useGetColors();
  const colors: Color[] = data?.colors ?? [];

  return (
    <section className="px-8">
      <Item variant="outline" className="flex-col lg:flex-row">
        <ItemContent className="w-full items-center lg:w-fit lg:items-start">
          <ItemTitle className="text-2xl font-semibold">All Colors</ItemTitle>
          <ItemDescription>Manage your color palette here</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" onClick={() => setOpenCreateDialog(true)}>
            <PlusCircleIcon />
            Add Color
          </Button>
        </ItemActions>
      </Item>

      <ColorsTable isLoading={isLoading} colors={colors} />

      <ColorDialogForm
        mode="create"
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
    </section>
  );
};

export default ColorsPage;
