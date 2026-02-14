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
import { ColorSchema, colorSchema } from "@/validators/color.validation";
import { useCreateColor, useUpdateColor } from "@/hooks/use-color";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";
import ColorPicker from "../color-picker";

interface ColorDialogFormProps {
  mode: "create" | "edit";
  initialData?: { id: string; name: string; color: string };
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const ColorDialogForm = ({
  mode,
  initialData,
  open,
  onOpenChange,
}: ColorDialogFormProps) => {
  const form = useForm<ColorSchema>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: "",
      color: "#000000",
    },
  });

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name || "",
        color: initialData?.color || "#000000",
      });
    }
  }, [open, initialData, form]);

  const watchedColor = form.watch("color");

  const { mutate: createColor, isPending: isCreatePending } = useCreateColor();
  const { mutate: updateColor, isPending: isUpdatePending } = useUpdateColor();

  const isPending = isCreatePending || isUpdatePending;

  const onSubmit = (data: ColorSchema) => {
    if (mode === "create") {
      createColor(data, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    } else {
      if (!initialData?.id) return;
      updateColor(
        { id: initialData.id, data },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Color" : "Edit Color"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new color to your palette."
              : "Update existing color details."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 py-4"
        >
          {/* Name Field */}
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              placeholder="e.g. Red"
              {...form.register("name")}
              disabled={isPending}
            />
            {form.formState.errors.name && (
              <FieldError>{form.formState.errors.name.message}</FieldError>
            )}
          </Field>

          {/* Color Field */}
          <Field>
            <FieldLabel htmlFor="color">Color (Hex)</FieldLabel>
            <ColorPicker
              value={watchedColor}
              onChange={(val) =>
                form.setValue("color", val, { shouldValidate: true })
              }
              disabled={isPending}
            />
            {form.formState.errors.color && (
              <FieldError>{form.formState.errors.color.message}</FieldError>
            )}
          </Field>

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
              {mode === "create" ? "Create Color" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ColorDialogForm;
