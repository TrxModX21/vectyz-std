"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateFileTypeSchema,
  updateFileTypeSchema,
} from "@/validators/manage-filetype.validator";
import { Input } from "@/components/form/input";
import { ImagePicker } from "@/components/form/image-picker";
import IconPicker from "@/components/form/icon-picker";
import { uploadToCloudinary } from "@/lib/helpers";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { useUpdateFiletypeMutation } from "@/features/manage-filetypes/mutations";
import { FileTypeData } from "../../../types/manage-filetype";
import { CustomDialog } from "@/components/common/dialog";

interface EditFiletypeModalProps {
  filetype: FileTypeData | null;
  onClose: () => void;
}

export function EditFiletypeModal({
  filetype,
  onClose,
}: EditFiletypeModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const updateFiletypeMutation = useUpdateFiletypeMutation();

  const form = useForm<UpdateFileTypeSchema>({
    resolver: zodResolver(updateFileTypeSchema),
    defaultValues: {
      name: "",
      icon: "",
      supported_file_extension: "",
      status: "active",
    },
  });

  // Populate form when filetype changes
  useEffect(() => {
    if (filetype) {
      form.reset({
        name: filetype.name,
        icon: filetype.icon || "",
        supported_file_extension: filetype.supportedFileExtension || "",
        status: filetype.status as "active" | "inactive",
        collection_image: undefined, // optional during edit
      });
      setIsImageRemoved(false);
    }
  }, [filetype, form]);

  if (!filetype) return null;

  const onSubmit = async (values: UpdateFileTypeSchema) => {
    try {
      setIsUploading(true);
      let imageUrl = isImageRemoved ? null : filetype.collectionImage;

      // Only upload if user selected a new image (File or Blob)
      if (values.collection_image && typeof values.collection_image === "object") {
        const toastId = toast.loading("Uploading new image... 0%");
        const uploadData = await uploadToCloudinary(
          values.collection_image,
          (progress) => {
            toast.update(toastId, `Uploading image... ${progress}%`, "info");
          },
          "vectyz/file-type",
        );
        imageUrl = uploadData.url;
      }

      // Save filetype
      await updateFiletypeMutation.mutateAsync({
        id: filetype.id,
        data: {
          name: values.name,
          icon: values.icon,
          supported_file_extension: values.supported_file_extension,
          collection_image: imageUrl,
          status: values.status,
        },
      });

      toast.success(`Filetype "${values.name}" updated successfully`);
      form.reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update filetype");
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <CustomDialog
      open={!!filetype}
      onOpenChange={(open) => !open && onClose()}
      title="Edit Filetype"
      description="Update filetype details and metadata."
      confirmText="Save Changes"
      onConfirm={handleConfirm}
      isLoading={isUploading || updateFiletypeMutation.isPending}
      maxWidth="min-w-sm max-w-2xl"      
    >
      <form
        id="edit-filetype-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-4 gap-y-5 max-h-[70vh] overflow-y-auto px-2"
      >
        {/* Image Dropzone (Full Width) */}
        <div className="col-span-1">
          <Controller
            control={form.control}
            name="collection_image"
            render={({ field, fieldState }) => (
              <ImagePicker
                label="Collection Image"
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
                    ? filetype.collectionImage || undefined
                    : undefined
                }
              />
            )}
          />
        </div>

        {/* Filetype Name */}
        <div className="col-span-1">
          <Input
            label="Filetype Name"
            placeholder="e.g. Photos"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />
        </div>

        {/* Icon Picker */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-cyber-heading">
            Icon <span className="text-[#FF3366]">*</span>
          </label>
          <div className="relative">
            <IconPicker
              value={form.watch("icon") || ""}
              onChange={(val) => form.setValue("icon", val)}
              disabled={updateFiletypeMutation.isPending}
              error={form.formState.errors.icon?.message}
            />
          </div>
        </div>

        {/* Supported Extension */}
        <div className="col-span-1">
          <Input
            label="Supported Extension"
            placeholder="e.g. .svg, .eps"
            error={form.formState.errors.supported_file_extension?.message}
            {...form.register("supported_file_extension")}
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