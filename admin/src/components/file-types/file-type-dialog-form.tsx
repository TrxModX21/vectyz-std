import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";
import { useCreateFileType, useUpdateFileType } from "@/hooks/use-file-type";
import { FileTypeSchema, fileTypeSchema } from "@/validators/file-type.validation";
import IconPicker from "../icon-picker";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import ImagePicker from "../image-picker";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";

interface FileTypeDialogFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    icon?: string;
    supportedFileExtension: string;
    status: "active" | "inactive";
    collectionImage?: string;
  };
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const FileTypeDialogForm = ({
  mode,
  initialData,
  open,
  onOpenChange,
}: FileTypeDialogFormProps) => {
  const form = useForm<FileTypeSchema>({
    resolver: zodResolver(fileTypeSchema),
    defaultValues: {
      name: "",
      icon: "",
      supportedFileExtension: "",
      status: "active",
      collectionImage: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name || "",
        icon: initialData?.icon || "",
        supportedFileExtension: initialData?.supportedFileExtension || "",
        status: initialData?.status || "active",
        collectionImage: initialData?.collectionImage || undefined,
      });
    }
  }, [open, initialData, form]);

  const { mutate: createFileType, isPending: isCreatePending } = useCreateFileType();
  const { mutate: updateFileType, isPending: isUpdatePending } = useUpdateFileType();
  
  const isPending = isCreatePending || isUpdatePending;

  const onSubmit = async (data: FileTypeSchema) => {
     let uploadedImagePublicId: string | null = null;
    try {
        let imageUrl = data.collectionImage;

        // 1. Upload Image if it's a File
        if (data.collectionImage instanceof File) {
            toast.info("Uploading image...");
            const uploadResult = await uploadToCloudinary(
                data.collectionImage,
                "vectyz/file-type"
            );

            if (Array.isArray(uploadResult)) {
                return;
            }

            imageUrl = uploadResult.url;
            uploadedImagePublicId = uploadResult.publicId;
        }

        const payload = {
            ...data,
            collectionImage: typeof imageUrl === "string" ? imageUrl : undefined,
        };

        const mutationOptions = {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
            },
            onError: async (error: any) => {
                 // Cleanup image if creation/update fails AND we uploaded a new one
                if (uploadedImagePublicId) {
                    console.log("Cleaning up orphaned image:", uploadedImagePublicId);
                    try {
                        await import("@/lib/axios").then(({ api }) => {
                            api.post("/uploads/delete", {
                                publicId: uploadedImagePublicId,
                            });
                        });
                    } catch (cleanupError) {
                         console.error("Failed to clean up image", cleanupError);
                    }
                }
                 toast.error(error.message || "Something went wrong");
            },
        };

        if (mode === "create") {
            createFileType(payload, mutationOptions);
        } else {
            if (!initialData?.id) return;
            updateFileType(
                { id: initialData.id, data: payload },
                mutationOptions
            );
        }

    } catch (error: any) {
        console.error("Submission error:", error);
        toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New File Type" : "Edit File Type"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new supported file type."
              : "Update existing file type details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 py-4">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              placeholder="e.g. Vector"
              {...form.register("name")}
              disabled={isPending}
            />
            {form.formState.errors.name && (
              <FieldError>{form.formState.errors.name.message}</FieldError>
            )}
          </Field>

           <ImagePicker
            label="Collection Image"
            value={form.watch("collectionImage")}
            onChange={(file) => form.setValue("collectionImage", file)}
            disabled={isPending}
          />

          <Field>
            <FieldLabel htmlFor="icon">Icon</FieldLabel>
            <IconPicker 
                value={form.watch("icon") || ""} 
                onChange={(val) => form.setValue("icon", val)} 
                disabled={isPending}
            />
            {form.formState.errors.icon && (
               <FieldError>{form.formState.errors.icon.message}</FieldError>
            )}
          </Field>

          <Field>
             <FieldLabel htmlFor="ext">Supported Extension</FieldLabel>
             <Input
               id="ext"
               placeholder="e.g. .svg, .eps"
               {...form.register("supportedFileExtension")}
               disabled={isPending}
             />
             {form.formState.errors.supportedFileExtension && (
               <FieldError>{form.formState.errors.supportedFileExtension.message}</FieldError>
             )}
          </Field>
          
           <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={form.watch("status") === "active"}
              onCheckedChange={(checked) =>
                form.setValue("status", checked ? "active" : "inactive")
              }
              disabled={isPending}
            />
            <Label htmlFor="status">Active Status</Label>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <LoaderIcon className="animate-spin mr-1" size={16} />}
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FileTypeDialogForm;
