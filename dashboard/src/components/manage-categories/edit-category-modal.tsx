"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateCategoryType,
  updateCategorySchema,
} from "@/validators/manage-categories.validator";
import { Input } from "@/components/form/input";
import { ImagePicker } from "@/components/form/image-picker";
import { uploadToCloudinary } from "@/lib/helpers";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { useUpdateCategoryMutation } from "@/features/manage-categories/mutations";
import { Category } from "../../../types/manage-categories";
import { CustomDialog } from "@/components/common/dialog";

interface EditCategoryModalProps {
  category: Category | null;
  onClose: () => void;
}

export function EditCategoryModal({
  category,
  onClose,
}: EditCategoryModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const updateCategoryMutation = useUpdateCategoryMutation();

  const form = useForm<UpdateCategoryType>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: "",
      status: "active",
    },
  });

  // Populate form when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        status: category.status,
        image: undefined, // image is optional during edit
      });
      setIsImageRemoved(false);
    }
  }, [category, form]);

  if (!category) return null;

  const onSubmit = async (values: UpdateCategoryType) => {
    try {
      setIsUploading(true);
      let imageUrl = isImageRemoved ? null : category.image;

      // Only upload if user selected a new image (File or Blob)
      if (values.image && typeof values.image === "object") {
        const toastId = toast.loading("Uploading new image... 0%");
        const uploadData = await uploadToCloudinary(
          values.image,
          (progress) => {
            toast.update(toastId, `Uploading image... ${progress}%`, "info");
          },
          "vectyz/categories",
        );
        imageUrl = uploadData.url;
      }

      // Save category
      await updateCategoryMutation.mutateAsync({
        id: category.id,
        data: {
          name: values.name,
          image: imageUrl,
          status: values.status,
        },
      });

      toast.success(`Category "${values.name}" updated successfully`);
      form.reset();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update category",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <CustomDialog
      open={!!category}
      onOpenChange={(open) => !open && onClose()}
      title="Edit Category"
      description="Update category details and metadata."
      confirmText="Save Changes"
      onConfirm={handleConfirm}
      isLoading={isUploading || updateCategoryMutation.isPending}
      maxWidth="min-w-sm max-w-2xl"
    >
      <form
        id="edit-category-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-4 gap-y-5"
      >
        {/* Image Dropzone (Full Width) */}
        <div className="col-span-1">
          <Controller
            control={form.control}
            name="image"
            render={({ field, fieldState }) => (
              <ImagePicker
                label="Cover Image"
                value={field.value}
                onChange={(file) => {
                  field.onChange(file);
                  if (file) setIsImageRemoved(false);
                }}
                onRemove={() => setIsImageRemoved(true)}
                error={fieldState.error?.message}
                // If user hasn't selected a new image and hasn't explicitly removed the old one, show the existing one as preview
                defaultPreviewUrl={
                  !field.value && !isImageRemoved
                    ? category.image || undefined
                    : undefined
                }
              />
            )}
          />
        </div>

        {/* Category Name */}
        <div className="col-span-1">
          <Input
            label="Category Name"
            placeholder="e.g. 3D Assets"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />
        </div>

        {/* Visibility */}
        <div className="col-span-1 flex flex-col gap-2 mt-2">
          <label className="text-[13px] font-medium text-cyber-heading uppercase tracking-wider block mb-1">
            Visibility Status
          </label>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-cyber-border bg-cyber-surface-active group-hover:border-neon">
                <input
                  type="radio"
                  value="active"
                  {...form.register("status")}
                  className="peer sr-only"
                />
                <div className="w-2 h-2 rounded-full bg-neon scale-0 peer-checked:scale-100 transition-transform shadow-[0_0_8px_rgba(84,234,253,0.8)]" />
              </div>
              <span className="text-[14px] text-cyber-body group-hover:text-cyber-heading transition-colors">
                Active (Public)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-cyber-border bg-cyber-surface-active group-hover:border-[#FF3366]">
                <input
                  type="radio"
                  value="inactive"
                  {...form.register("status")}
                  className="peer sr-only"
                />
                <div className="w-2 h-2 rounded-full bg-[#FF3366] scale-0 peer-checked:scale-100 transition-transform shadow-[0_0_8px_rgba(255,51,102,0.8)]" />
              </div>
              <span className="text-[14px] text-cyber-body group-hover:text-cyber-heading transition-colors">
                Inactive (Hidden)
              </span>
            </label>
          </div>
        </div>
      </form>
    </CustomDialog>
  );
}
