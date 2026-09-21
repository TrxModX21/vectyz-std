"use client";

import {
  useCreateBlogTagMutation,
  useDeleteBlogTagMutation,
  useUpdateBlogTagMutation,
} from "@/features/manage-blogs/mutations";
import { useBlogTags } from "@/features/manage-blogs/queries";
import { Loader, Plus, Tag, X } from "lucide-react";
import { useState } from "react";
import { BlogTagData } from "../../../types/manage-blogs";
import { useForm } from "react-hook-form";
import {
  CreateBlogTagSchema,
  createBlogTagSchema,
} from "@/validators/manage-blogs.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { CustomDialog } from "@/components/common/dialog";
import { Input } from "@/components/form/input";

const TagsCard = () => {
  // State Dialog & Edit/Delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTagData | null>(null);
  const [deletingTag, setDeletingTag] = useState<BlogTagData | null>(null);

  const { data: tagsResponse, isLoading } = useBlogTags();
  const createTagMutation = useCreateBlogTagMutation();
  const updateTagMutation = useUpdateBlogTagMutation();
  const deleteTagMutation = useDeleteBlogTagMutation();

  const tags = tagsResponse?.data || [];

  const form = useForm<CreateBlogTagSchema>({
    resolver: zodResolver(createBlogTagSchema),
    defaultValues: { name: "" },
  });

  const handleOpenCreate = () => {
    setEditingTag(null);
    form.reset({ name: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tag: BlogTagData) => {
    setEditingTag(tag);
    form.reset({ name: tag.name });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: CreateBlogTagSchema) => {
    try {
      if (editingTag) {
        await updateTagMutation.mutateAsync({
          id: editingTag.id,
          data: values,
        });
        toast.success(`Tag "${values.name}" updated successfully`);
      } else {
        await createTagMutation.mutateAsync(values);
        toast.success(`Tag "${values.name}" created successfully`);
      }
      setIsModalOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save tag");
    }
  };

  const handleDelete = async () => {
    if (!deletingTag) return;
    try {
      await deleteTagMutation.mutateAsync(deletingTag.id);
      toast.success(`Tag "${deletingTag.name}" deleted successfully`);
      setDeletingTag(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete tag");
    }
  };

  const isSaving = createTagMutation.isPending || updateTagMutation.isPending;

  return (
    <>
      <div className="cyber-card clip-card flex flex-col p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Tag className="text-[#FF3366]" size={20} />
            <h3 className="text-lg font-medium text-cyber-heading">Tags</h3>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 rounded-cyber border border-[#FF3366] bg-[rgba(255,51,102,0.1)] px-3 py-1.5 text-[12px] font-medium text-[#FF3366] hover:bg-[rgba(255,51,102,0.2)] transition-colors"
          >
            <Plus size={14} />
            Add Tag
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader size={24} className="animate-spin text-[#FF3366]" />
          </div>
        ) : tags.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-cyber border border-dashed border-cyber-border p-4 text-center">
            <p className="text-[13px] text-cyber-body-subtle">
              No tags found. Click "Add Tag" to create one.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="group flex items-center gap-2 rounded-full border border-cyber-border bg-cyber-surface-active px-3 py-1.5 transition-colors hover:border-[#FF3366]"
              >
                <button
                  type="button"
                  onClick={() => handleOpenEdit(tag)}
                  className="text-[13px] font-medium text-cyber-heading hover:text-[#FF3366] transition-colors"
                  title="Click to edit tag"
                >
                  {tag.name}
                </button>
                <span className="text-[11px] text-cyber-body-subtle tabular-nums">
                  ({tag._count?.posts || 0})
                </span>
                <button
                  type="button"
                  onClick={() => setDeletingTag(tag)}
                  className="hidden group-hover:block ml-1 text-cyber-body-subtle hover:text-[#FF3366] transition-colors"
                  title="Delete tag"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add / Edit Tag */}
      <CustomDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingTag ? "Edit Tag" : "Add Tag"}
        description={
          editingTag
            ? "Update blog tag name."
            : "Create a new tag to label your blog posts."
        }
        confirmText={editingTag ? "Save Changes" : "Create Tag"}
        onConfirm={form.handleSubmit(onSubmit)}
        isLoading={isSaving}
      >
        <form className="space-y-4">
          <Input
            label="Tag Name"
            placeholder="e.g. Vector, Design, UI/UX"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />
        </form>
      </CustomDialog>

      {/* Dialog Konfirmasi Hapus Tag */}
      <CustomDialog
        open={!!deletingTag}
        onOpenChange={(open) => !open && setDeletingTag(null)}
        title="Delete Tag"
        description={`Are you sure you want to delete tag "${deletingTag?.name}"?`}
        confirmText="Delete"
        destructive
        onConfirm={handleDelete}
        isLoading={deleteTagMutation.isPending}
      />
    </>
  );
};

export default TagsCard;
