"use client";

import { X, Plus, Loader } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCategoryType,
  createCategorySchema,
} from "@/validators/manage-categories.validator";
import { Input } from "@/components/form/input";
import { ImagePicker } from "@/components/form/image-picker";
import { uploadToCloudinary } from "@/lib/helpers";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { useCreateCategoryMutation } from "@/features/manage-categories/mutations";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({
  isOpen,
  onClose,
}: CreateCategoryModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const createCategoryMutation = useCreateCategoryMutation();

  const form = useForm<CreateCategoryType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      image: undefined,
      status: "active",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (values: CreateCategoryType) => {
    try {
      setIsUploading(true);
      
      const toastId = toast.loading("Uploading image... 0%");
      
      // Upload image to Cloudinary
      const uploadData = await uploadToCloudinary(
        values.image,
        (progress) => {
          toast.update(toastId, `Uploading image... ${progress}%`, "info");
        },
        "vectyz/categories"
      );
      
      toast.update(toastId, "Saving category...", "info");

      // Save category
      await createCategoryMutation.mutateAsync({
        name: values.name,
        image: uploadData.url,
        status: values.status,
      });

      toast.update(toastId, "Category created successfully", "success");
      form.reset();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create category");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="cyber-card clip-card flex flex-col w-full min-w-sm max-w-md max-h-[90vh] bg-cyber-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 glow-neon"
        role="dialog"
        aria-modal="true"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border shrink-0">
          <h2 className="text-lg font-heading tracking-[1px] text-cyber-heading">
            Create Category
          </h2>
          <button
            onClick={() => {
              form.reset();
              onClose();
            }}
            disabled={isUploading || createCategoryMutation.isPending}
            className="p-1 rounded-cyber text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="create-category-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-4 gap-y-5">
            {/* Image Dropzone (Full Width) */}
            <div className="col-span-1">
              <Controller
                control={form.control}
                name="image"
                render={({ field, fieldState }) => (
                  <ImagePicker
                    label="Cover Image"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
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
                    <div className="w-2 h-2 rounded-full bg-neon opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[13px] text-cyber-body group-hover:text-cyber-heading">
                    Enable
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-cyber-border bg-cyber-surface-active group-hover:border-neon">
                    <input
                      type="radio"
                      value="inactive"
                      {...form.register("status")}
                      className="peer sr-only"
                    />
                    <div className="w-2 h-2 rounded-full bg-neon opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[13px] text-cyber-body group-hover:text-cyber-heading">
                    Disable
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-cyber-border bg-cyber-surface shrink-0">
          <button
            onClick={() => {
              form.reset();
              onClose();
            }}
            disabled={isUploading || createCategoryMutation.isPending}
            className="flex w-full sm:w-auto items-center justify-center rounded-cyber border border-cyber-border bg-transparent px-4 py-2.5 text-[13px] font-medium text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading disabled:opacity-50"
          >
            Close
          </button>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              form="create-category-form"
              disabled={isUploading || createCategoryMutation.isPending}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-4 py-2.5 text-[13px] font-medium text-neon transition-colors hover:bg-[rgba(84,234,253,0.2)] disabled:opacity-50"
            >
              {(isUploading || createCategoryMutation.isPending) ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
