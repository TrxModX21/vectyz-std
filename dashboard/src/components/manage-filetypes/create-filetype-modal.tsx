import { Loader, Plus, X } from "lucide-react";
import { useState } from "react";
import IconPicker from "../form/icon-picker";
import { useCreateFiletypeMutation } from "@/features/manage-filetypes/mutations";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateFileTypeSchema,
  createFileTypeSchema,
} from "@/validators/manage-filetype.validator";
import { toast } from "../uitripled/notification-center-shadcnui";
import { uploadToCloudinary } from "@/lib/helpers";
import { ImagePicker } from "../form/image-picker";
import { Input } from "../form/input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFileTypeModal = ({ isOpen, onClose }: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const createFiletypeMutation = useCreateFiletypeMutation();

  const form = useForm<CreateFileTypeSchema>({
    resolver: zodResolver(createFileTypeSchema),
    defaultValues: {
      name: "",
      collection_image: undefined,
      icon: undefined,
      supported_file_extension: undefined,
      status: "active",
      image: undefined,
      video: undefined,
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (payload: CreateFileTypeSchema) => {
    try {
      setIsUploading(true);

      const toastId = toast.loading("Uploading image... 0%");

      let uploadedImageUrl = undefined;
      if (payload.collection_image) {
        const uploadData = await uploadToCloudinary(
          payload.collection_image,
          (progress) => {
            toast.update(toastId, `Uploading image... ${progress}%`, "info");
          },
          "vectyz/file-type",
        );

        uploadedImageUrl = uploadData.url;
      }

      toast.update(toastId, "Saving filetype...", "info");

      await createFiletypeMutation.mutateAsync({
        ...payload,
        collection_image: uploadedImageUrl,
      });

      toast.update(toastId, "Filetype created successfully", "success");
      form.reset();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to create filetype",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="cyber-card clip-card flex flex-col min-w-sm max-w-2xl max-h-[90vh] bg-cyber-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 glow-neon"
        role="dialog"
        aria-modal="true"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border shrink-0">
          <h2 className="text-lg font-heading tracking-[1px] text-cyber-heading">
            Create Filetype
          </h2>
          <button
            onClick={onClose}
            disabled={isUploading || createFiletypeMutation.isPending}
            className="p-1 rounded-cyber text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form
            id="create-filetype-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-x-4 gap-y-5"
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
                    onChange={field.onChange}
                    error={fieldState.error?.message}
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
                  disabled={createFiletypeMutation.isPending}
                  error={form.formState.errors.icon?.message}
                />
              </div>
            </div>

            {/* Filetype Name */}
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
            onClick={onClose}
            disabled={isUploading || createFiletypeMutation.isPending}
            className="flex w-full sm:w-auto items-center justify-center rounded-cyber border border-cyber-border bg-transparent px-4 py-2.5 text-[13px] font-medium text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading"
          >
            Close
          </button>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              form="create-filetype-form"
              disabled={isUploading || createFiletypeMutation.isPending}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-4 py-2.5 text-[13px] font-medium text-neon transition-colors hover:bg-[rgba(84,234,253,0.2)]"
            >
              {isUploading || createFiletypeMutation.isPending ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Add Filetype
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFileTypeModal;
