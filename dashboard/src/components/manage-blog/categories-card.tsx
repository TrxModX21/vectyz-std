"use client";

import {
  useCreateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
} from "@/features/manage-blogs/mutations";
import { useBlogCategories } from "@/features/manage-blogs/queries";
import {
  Edit2,
  FolderTree,
  Loader,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { BlogCategoryData } from "../../../types/manage-blogs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import {
  CreateBlogCategorySchema,
  createBlogCategorySchema,
} from "@/validators/manage-blogs.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomDialog } from "@/components/common/dialog";
import { Input } from "@/components/form/input";
import { toast } from "@/components/uitripled/notification-center-shadcnui";

const CategoriesCard = () => {
  // State Dialog & Edit/Delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<BlogCategoryData | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<BlogCategoryData | null>(null);

  const { data: categoriesResponse, isLoading } = useBlogCategories();
  const createCategoryMutation = useCreateBlogCategoryMutation();
  const updateCategoryMutation = useUpdateBlogCategoryMutation();
  const deleteCategoryMutation = useDeleteBlogCategoryMutation();

  const categories = categoriesResponse?.data || [];

  const form = useForm<CreateBlogCategorySchema>({
    resolver: zodResolver(createBlogCategorySchema),
    defaultValues: { name: "", description: "" },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    form.reset({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: BlogCategoryData) => {
    setEditingCategory(cat);
    form.reset({ name: cat.name, description: cat.description || "" });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: CreateBlogCategorySchema) => {
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          data: values,
        });
        toast.success(`Category "${values.name}" updated successfully`);
      } else {
        await createCategoryMutation.mutateAsync(values);
        toast.success(`Category "${values.name}" created successfully`);
      }
      setIsModalOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save category");
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategoryMutation.mutateAsync(deletingCategory.id);
      toast.success(`Category "${deletingCategory.name}" deleted successfully`);
      setDeletingCategory(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete category",
      );
    }
  };

  const isSaving =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <>
      <div className="cyber-card clip-card flex flex-col p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FolderTree className="text-neon" size={20} />
            <h3 className="text-lg font-medium text-cyber-heading">
              Categories
            </h3>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-3 py-1.5 text-[12px] font-medium text-neon hover:bg-[rgba(84,234,253,0.2)] transition-colors"
          >
            <Plus size={14} />
            Add Category
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader size={24} className="animate-spin text-neon" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-cyber border border-dashed border-cyber-border p-4 text-center">
            <p className="text-[13px] text-cyber-body-subtle">
              No categories found. Click "Add Category" to create one.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-cyber border border-cyber-border bg-cyber-surface-active p-3 transition-colors hover:border-neon"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-cyber-heading text-[13px]">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-cyber-body-subtle">
                    /{cat.slug}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] text-cyber-body bg-cyber-surface px-2 py-1 rounded-full tabular-nums border border-cyber-border-subtle">
                    {cat._count?.posts || 0} posts
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-cyber-body hover:text-cyber-heading transition-colors p-1 rounded-cyber hover:bg-cyber-surface">
                        <MoreVertical size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-cyber-surface border-cyber-border min-w-32"
                    >
                      <DropdownMenuItem
                        onClick={() => handleOpenEdit(cat)}
                        className="flex items-center gap-2 text-cyber-heading hover:text-neon cursor-pointer text-xs"
                      >
                        <Edit2 size={14} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingCategory(cat)}
                        className="flex items-center gap-2 text-[#FF003C] hover:text-[#FF003C]/80 cursor-pointer text-xs"
                      >
                        <Trash2 size={14} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add / Edit Category */}
      <CustomDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingCategory ? "Edit Category" : "Add Category"}
        description={
          editingCategory
            ? "Update blog category name and description."
            : "Create a new category to group your blog posts."
        }
        confirmText={editingCategory ? "Save Changes" : "Create Category"}
        onConfirm={form.handleSubmit(onSubmit)}
        isLoading={isSaving}
      >
        <form className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Design & UI"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium uppercase tracking-wider text-cyber-heading">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of this category..."
              className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-sm text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors resize-none clip-input"
              {...form.register("description")}
            />
          </div>
        </form>
      </CustomDialog>

      {/* Dialog Konfirmasi Hapus */}
      <CustomDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title="Delete Category"
        description={`Are you sure you want to delete category "${deletingCategory?.name}"? Posts in this category will not be deleted.`}
        confirmText="Delete"
        destructive
        onConfirm={handleDelete}
        isLoading={deleteCategoryMutation.isPending}
      />
    </>
  );
};

export default CategoriesCard;
