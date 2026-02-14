import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImagePicker from "../image-picker";
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
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  CategorySchema,
  categorySchema,
} from "@/validators/category.validation";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-category";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";

interface CategoryDialogFormProps {
  mode: "create" | "edit";
  initialData?: { id: string; name: string; image?: string; status: string };
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const CategoryDialogForm = ({
  mode,
  initialData,
  open,
  onOpenChange,
}: CategoryDialogFormProps) => {
  const { mutate: createCategory, isPending: isCreatePending } =
    useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdatePending } =
    useUpdateCategory();

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      status: initialData ? initialData.status === "active" : true,
      image: initialData?.image || undefined,
    },
  });

  const isPending = isCreatePending || isUpdatePending;

  const onSubmit = async (data: CategorySchema) => {
    let uploadedImagePublicId: string | null = null;
    try {
      let imageUrl = data.image;

      // 1. Upload Image if it's a File
      if (data.image instanceof File) {
        toast.info("Uploading image...");
        const uploadResult = await uploadToCloudinary(
          data.image,
          "vectyz/categories",
        );

        if (Array.isArray(uploadResult)) {
          return;
        }

        imageUrl = uploadResult.url;
        uploadedImagePublicId = uploadResult.publicId;
      }

      const payload = {
        ...data,
        image: typeof imageUrl === "string" ? imageUrl : undefined,
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
        createCategory(payload, mutationOptions);
      } else {
        if (!initialData?.id) return;
        updateCategory({ id: initialData.id, data: payload }, mutationOptions);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] max-h-[80vh] sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Kategori" : "Edit Kategori"}
          </DialogTitle>
          <DialogDescription>
            Fill in all required forms correctly.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 py-4"
        >
          {/* Image Picker */}
          <ImagePicker
            label="Category Image"
            value={form.watch("image")}
            onChange={(file) => form.setValue("image", file)}
            disabled={isPending}
          />

          {/* Name Field */}
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              placeholder="e.g. Graphic Design"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <FieldError>{form.formState.errors.name.message}</FieldError>
            )}
          </Field>

          {/* Status Switch */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Disable this to hide the category from the public.
              </p>
            </div>
            <Switch
              checked={form.watch("status")}
              onCheckedChange={(checked: boolean) =>
                form.setValue("status", checked)
              }
            />
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
              {isPending && (
                <LoaderIcon className="animate-spin mr-1" size={16} />
              )}
              {mode === "create" ? "Create Category" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialogForm;
