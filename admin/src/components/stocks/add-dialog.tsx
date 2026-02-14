import { useState } from "react";
import ImagePicker from "../image-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { AddStockSchema, addStockSchema } from "@/validators/stock.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Loader, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { IconFile, IconTrash } from "@tabler/icons-react";
import InputStockExtension from "../input-stock-extension";
import { copyToClipboard, uploadToCloudinary, uploadToR2 } from "@/lib/helpers";
import { Textarea } from "../ui/textarea";
import SelectWithSearching from "../select-with-searching";
import { useGetCategories } from "@/hooks/use-category";
import { useGetFileTypes } from "@/hooks/use-file-type";
import { KeywordInput } from "../keyword-input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Progress } from "../ui/progress";
import { useCreateStock } from "@/hooks/use-stocks";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStockDialog = ({ open, onOpenChange }: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedOriginalFiles, setSelectedOriginalFiles] = useState<File[]>(
    [],
  );

  const { data: categoriesResponse, isLoading: categoryLoading } =
    useGetCategories();
  const categories = categoriesResponse?.categories || [];

  const { data: fileTypesResponse, isLoading: fileTypeLoading } =
    useGetFileTypes();
  const fileTypes = fileTypesResponse?.fileTypes || [];

  const { mutate, isPending: createStockPending } = useCreateStock();

  const form = useForm<AddStockSchema>({
    resolver: zodResolver(addStockSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      fileTypeId: "",
      keywords: [],
      colors: [],
      isPremium: false,
      price: 0,
      currency: "IDR",
      files: [],
    },
  });
  const keywords = form.watch("keywords");
  const isPremium = form.watch("isPremium");

  const handleOriginalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter((file) => {
        if (file.size > 80 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds 80MB limit`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      if (selectedOriginalFiles.length + validFiles.length > 3) {
        toast.error("Maximum 3 files allowed in total");
        return;
      }
      const newFiles = [...selectedOriginalFiles, ...validFiles];
      setSelectedOriginalFiles(newFiles);
      form.setValue("files", newFiles);
      // Reset input to allow selecting same file again if needed or clean state
      e.target.value = "";
    }
  };
  const removeOriginalFile = (index: number) => {
    const newFiles = [...selectedOriginalFiles.filter((_, i) => i !== index)];
    setSelectedOriginalFiles(newFiles);
    form.setValue("files", newFiles);
  };

  const clearField = (fieldName: keyof AddStockSchema, emptyVal: any) => {
    form.setValue(fieldName, emptyVal);
  };

  const isPending = createStockPending || isUploading;

  const onSubmit = async (values: AddStockSchema) => {
    try {
      setIsUploading(true);
      toast.loading("Uploading stock...", { id: "create-stock" });

      const filesPayload: any[] = [];
      const hasOriginal = values.files;
      const hasPreview = values.preview;
      const baseProgress = hasPreview ? 20 : 0;

      // Handle Preview Image
      const previewData = await uploadToCloudinary(
        values.preview,
        (progress) => {
          if (hasOriginal) {
            setUploadProgress(Math.round(progress * 0.2));
          } else {
            setUploadProgress(progress);
          }
        },
      );
      filesPayload.push({
        purpose: "PREVIEW",
        ...previewData,
      });

      // Handle Original Files
      const originalData = await uploadToR2(values.files, (progress) => {
        const weightedProgress = hasPreview
          ? Math.round(progress * 0.8)
          : progress;
        setUploadProgress(baseProgress + weightedProgress);
      });
      const originalDataArray = Array.isArray(originalData)
        ? originalData
        : [originalData];

      filesPayload.push(
        ...originalDataArray.map((item) => ({
          purpose: "ORIGINAL",
          ...item,
        })),
      );

      // Reconstruct payload to send
      const payloadToSend = {
        title: values.title,
        description: values.description,
        categoryId: values.categoryId,
        fileTypeId: values.fileTypeId,
        keywords: values.keywords,
        colors: values.colors,
        isPremium: values.isPremium,
        price: values.price,
        currency: values.currency,
        files: filesPayload,
      };

      // Send payload
      mutate(payloadToSend, {
        onSuccess: () => {
          toast.success("Stock created successfully!", { id: "create-stock" });
          form.reset();
          setSelectedOriginalFiles([]);
          setUploadProgress(0);
          setIsUploading(false);
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error("An error occurred during stock creation", {
            id: "create-stock",
          });
          setIsUploading(false);
        },
      });
    } catch (error: any) {
      //   console.error("Submission error:", error);
      toast.error("An error occurred during stock creation", {
        id: "create-stock",
      });
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay onClick={(e) => e.stopPropagation()}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="min-w-4xl max-h-[85%] overflow-y-scroll"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
            <DialogDescription>Add new stock in your account</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Preview Image */}
              <Field className="space-y-2">
                <ImagePicker
                  label="Preview Image"
                  value={form.watch("preview")}
                  onChange={(file) => form.setValue("preview", file!)}
                  required={true}
                  disabled={isPending}
                  giveWatermark={true}
                />
                <p className="text-xs text-muted-foreground">
                  Max 5MB. Supported: JPG, PNG, SVG, GIF.
                </p>
                {form.formState.errors.preview && (
                  <FieldError>
                    {form.formState.errors.preview.message}
                  </FieldError>
                )}
              </Field>

              {/* Original Files */}
              <Field>
                <FieldLabel>
                  Original Files <span className="text-red-500">*</span>
                </FieldLabel>
                <div className="space-y-3">
                  <div className="rounded-lg border border-dashed p-4">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <UploadCloud className="h-8 w-8" />
                      <p className="text-sm">
                        Click to upload a new original file(up to 3 file)
                      </p>
                      <Input
                        type="file"
                        multiple
                        className="max-w-xs"
                        onChange={handleOriginalFileChange}
                        disabled={
                          isPending || selectedOriginalFiles.length >= 3
                        }
                        accept=".ai,.eps,.psd,.psb,.fig,.cdr,.ppt,.pptx,.zip,image/*"
                      />
                    </div>

                    {selectedOriginalFiles.length > 0 && (
                      <div className="mt-3 grid gap-2">
                        {selectedOriginalFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-md border bg-muted/40 p-2 text-sm"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <IconFile className="size-4 shrink-0 text-muted-foreground" />
                              <span className="truncate">{file.name}</span>
                              <span className="shrink-0 text-xs text-muted-foreground">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeOriginalFile(index)}
                              disabled={isPending}
                            >
                              <IconTrash className="size-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    Max 3 files (Max 10MB/file). Supported: Vector (.ai, .eps,
                    .cdr), Figma (.fig), Photoshop (.psd, .psb), PowerPoint
                    (.ppt, .pptx), Zip (.zip), Images.
                  </div>
                </div>
                {form.formState.errors.files && (
                  <FieldError>{form.formState.errors.files.message}</FieldError>
                )}
              </Field>

              {/* Title */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </FieldLabel>
                  <InputStockExtension
                    counter={form.watch("title").length}
                    maxCounter="100"
                    onCopy={() => copyToClipboard(form.watch("title"), "Title")}
                    onDelete={() => clearField("title", "")}
                  />
                </div>
                <Textarea
                  id="title"
                  placeholder="Enter the title"
                  className="resize-none"
                  maxLength={100}
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <FieldError>{form.formState.errors.title.message}</FieldError>
                )}
              </Field>

              {/* Description */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <InputStockExtension
                    counter={(form.watch("description") || "").length}
                    maxCounter="500"
                    onCopy={() =>
                      copyToClipboard(
                        form.watch("description") || "",
                        "Description",
                      )
                    }
                    onDelete={() => clearField("description", "")}
                  />
                </div>
                <Textarea
                  id="description"
                  placeholder="Enter the description"
                  className="resize-none"
                  maxLength={500}
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <FieldError>
                    {form.formState.errors.description.message}
                  </FieldError>
                )}
              </Field>

              {/* Category & File Type */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>
                    Category <span className="text-red-500">*</span>
                  </FieldLabel>
                  <SelectWithSearching<Category>
                    items={categories}
                    value={form.watch("categoryId")}
                    onValueChange={(val) => form.setValue("categoryId", val)}
                    getLabel={(c) => c.name}
                    getValue={(c) => c.id.toString()}
                    placeholder="Select category"
                    searchPlaceholder="Search category..."
                    disabled={categoryLoading}
                  />
                  {form.formState.errors.categoryId && (
                    <FieldError>
                      {form.formState.errors.categoryId.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>
                    File Type <span className="text-red-500">*</span>
                  </FieldLabel>
                  <SelectWithSearching<FileType>
                    items={fileTypes}
                    value={form.watch("fileTypeId")}
                    onValueChange={(val) => form.setValue("fileTypeId", val)}
                    getLabel={(c) => c.name}
                    getValue={(c) => c.id.toString()}
                    placeholder="Select file type"
                    searchPlaceholder="Search file type..."
                    disabled={fileTypeLoading}
                  />
                  {form.formState.errors.fileTypeId && (
                    <FieldError>
                      {form.formState.errors.fileTypeId.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              {/* Keywords */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel>
                    Keywords <span className="text-red-500">*</span>
                  </FieldLabel>
                  <InputStockExtension
                    counter={keywords.length}
                    maxCounter="50"
                    onCopy={() =>
                      copyToClipboard(keywords.join(", "), "Keywords")
                    }
                    onDelete={() => form.setValue("keywords", [])}
                  />
                </div>
                <KeywordInput
                  keywords={keywords}
                  onKeywordsChange={(newKeywords) =>
                    form.setValue("keywords", newKeywords)
                  }
                />
                {form.formState.errors.keywords && (
                  <FieldError>
                    {form.formState.errors.keywords.message}
                  </FieldError>
                )}
              </Field>

              {/* Premium Switch */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Premium Content</Label>
                  <p className="text-sm text-muted-foreground">
                    Mark this stock as premium content
                  </p>
                </div>
                <Switch
                  checked={isPremium}
                  onCheckedChange={(checked) =>
                    form.setValue("isPremium", checked)
                  }
                />
              </div>

              {/* Price  */}
              {isPremium && (
                <Field>
                  <FieldLabel>
                    Price (IDR) <span className="text-red-500">*</span>
                  </FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      className="pl-9"
                      type="number"
                      placeholder="0"
                      min={0}
                      {...form.register("price", { valueAsNumber: true })}
                    />
                  </div>
                  {form.formState.errors.price && (
                    <FieldError>
                      {form.formState.errors.price.message}
                    </FieldError>
                  )}
                </Field>
              )}

              {/* Button Action */}
              <div className="sticky -bottom-1 left-0 space-y-6 py-5 bg-background border-t">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader className="animate-spin" />}
                    {isPending ? "Create..." : "Create Stock"}
                  </Button>
                </div>

                {isUploading && (
                  <div className="space-y-1">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-center text-xs text-muted-foreground">
                      Uploading files... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default AddStockDialog;
