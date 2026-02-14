"use client";

import CategoryDialogForm from "@/components/categories/category-dialog-form";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import CategoryTable from "../../../components/categories/table";
import { useGetCategories } from "@/hooks/use-category";

const CategoryPage = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const { data, isLoading } = useGetCategories();
  const categories: Category[] = data?.categories ?? [];

  return (
    <section className="px-8">
      <Item variant="outline" className="flex-col lg:flex-row">
        <ItemContent className="w-full items-center lg:w-fit lg:items-start">
          <ItemTitle className="text-2xl font-semibold">
            All Categories
          </ItemTitle>
          <ItemDescription>All categories list in this website</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" onClick={() => setOpenCreateDialog(true)}>
            <PlusCircleIcon />
            Tambah Kategori
          </Button>
        </ItemActions>
      </Item>

      <CategoryTable isLoading={isLoading} categories={categories} />

      <CategoryDialogForm
        mode="create"
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
    </section>
  );
};

export default CategoryPage;
