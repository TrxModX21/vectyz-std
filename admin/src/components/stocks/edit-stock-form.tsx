"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useGetCategories } from "@/hooks/use-category";
import { useGetFileTypes } from "@/hooks/use-file-type";
import {
  EditStockSchema,
  editStockSchema,
} from "@/validators/stock.validation";
import { useState } from "react";
import { FileIcon, UploadCloud, Download, Trash } from "lucide-react";

import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import ImagePicker from "@/components/image-picker";
import {
  copyToClipboard,
  handleDownload,
  uploadToCloudinary,
  uploadToR2,
} from "@/lib/helpers";
import { useUpdateStock } from "@/hooks/use-stocks";
import SelectWithSearching from "@/components/select-with-searching";
import DeleteStockDialog from "./delete-dialog";
import InputStockExtension from "../input-stock-extension";
import { KeywordInput } from "../keyword-input";
import { Progress } from "@/components/ui/progress";

export function EditStockForm({
  stock,
  onOpenChange,
}: {
  stock: Stock;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: categoriesResponse, isLoading: categoryLoading } =
    useGetCategories();
  const categories = categoriesResponse?.categories || [];

  const { data: fileTypesResponse, isLoading: fileTypeLoading } =
    useGetFileTypes();
  const fileTypes = fileTypesResponse?.fileTypes || [];

  const { mutate: updateStock, isPending: isUpdating } = useUpdateStock();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const isPending = isUpdating || isUploading;

  // State to manage visible original files (mocking deletion until mutation)
  const [existingOriginals, setExistingOriginals] = useState<File[]>(
    stock.files.filter((f) => f.purpose === "ORIGINAL") as unknown as File[],
  );

  const form = useForm<EditStockSchema>({
    resolver: zodResolver(editStockSchema),
    defaultValues: {
      title: stock.title,
      description: stock.description || "",
      categoryId: stock.categoryId,
      fileTypeId: stock.fileTypeId,
      keywords: stock.keywords,
      isPremium: stock.isPremium,
      price: Number(stock.price) || 0,
      currency: "IDR",
      preview: stock.files.find((f) => f.purpose === "PREVIEW")?.url,
    },
  });

  const keywords = form.watch("keywords");
  const isPremium = form.watch("isPremium");
  const newOriginalFile = form.watch("original");

  const handleDeleteExistingOriginal = (fileId: string) => {
    setFileToDelete(fileId);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      setExistingOriginals((prev) =>
        prev.filter((f: any) => f.id !== fileToDelete),
      );
      toast.success("File removed from list (not yet deleted from server)");
      setFileToDelete(null);
    }
  };

  const onSubmit = async (values: EditStockSchema) => {
    try {
      if (values.original instanceof File || values.preview instanceof File) {
        setIsUploading(true);
        setUploadProgress(0);
      }

      toast.loading("Updating stock...", { id: "update-stock" });

      const filesPayload: any[] = [];

      // 1. Handle Preview Image
      if (values.preview instanceof File) {
        // Simple weight: if original also exists, give preview 20%, original 80%
        // If only preview, 100%
        const hasOriginal = values.original instanceof File;

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
      } else if (typeof values.preview === "string") {
        // Find existing preview to allow keeping it
        const existingPreview = stock.files.find(
          (f) => f.purpose === "PREVIEW",
        );
        if (existingPreview) {
          filesPayload.push({
            purpose: "PREVIEW",
            publicId: existingPreview.publicId,
            url: existingPreview.url,
            format: existingPreview.format,
            bytes: existingPreview.bytes,
            width: existingPreview.width,
            height: existingPreview.height,
          });
        }
      }

      // 2. Handle Original Files
      // A. Existing originals (not deleted)
      const keptOriginals = existingOriginals.map((f: any) => ({
        purpose: "ORIGINAL",
        publicId: f.publicId,
        url: f.url,
        format: f.format,
        bytes: f.bytes,
        width: f.width,
        height: f.height,
      }));
      filesPayload.push(...keptOriginals);

      // B. New original file
      if (values.original instanceof File) {
        const hasPreview = values.preview instanceof File;
        const baseProgress = hasPreview ? 20 : 0;

        const originalData = await uploadToR2(values.original, (progress) => {
          const weightedProgress = hasPreview
            ? Math.round(progress * 0.8)
            : progress;
          setUploadProgress(baseProgress + weightedProgress);
        });
        filesPayload.push({
          purpose: "ORIGINAL",
          ...originalData,
        });
      }

      // 3. Construct Payload
      const payload = {
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

      // 4. Send Update
      updateStock(
        { id: stock.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Stock updated successfully!", {
              id: "update-stock",
            });
            setUploadProgress(0);
            setIsUploading(false);
          },
          onError: (err) => {
            console.error("Update error:", err);
            toast.error("Failed to update stock", { id: "update-stock" });
            setIsUploading(false);
          },
        },
      );
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred during update", { id: "update-stock" });
      setIsUploading(false);
    }
  };

  const clearField = (fieldName: keyof EditStockSchema, emptyVal: any) => {
    form.setValue(fieldName, emptyVal);
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Preview Image */}
        <div className="space-y-2">
          <ImagePicker
            label="Preview Image"
            value={form.watch("preview")}
            onChange={(file) => form.setValue("preview", file || undefined)}
            disabled={isPending}
            giveWatermark={true}
          />
          <p className="text-xs text-muted-foreground">
            Max 5MB. Supported: JPG, PNG, SVG, GIF.
          </p>
        </div>

        {/* Original File */}
        <Field>
          <FieldLabel>Original File</FieldLabel>
          <div className="space-y-3">
            {/* New File Upload */}
            <div className="rounded-lg border border-dashed p-4">
              {newOriginalFile ? (
                <div className="flex items-center justify-between rounded-md bg-muted p-2">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {(newOriginalFile as File).name}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    type="button"
                    onClick={() => form.setValue("original", undefined)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <UploadCloud className="h-8 w-8" />
                  <p className="text-sm">Click to upload a new original file</p>
                  <Input
                    type="file"
                    className="max-w-xs"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) form.setValue("original", file);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              Max 10MB/file. Supported: Vector (.ai, .eps, .cdr), Figma (.fig),
              Photoshop (.psd, .psb), PowerPoint (.ppt, .pptx), Zip (.zip),
              Images.
            </div>

            {/* Existing Files List */}
            {existingOriginals.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase">
                  Existing File
                </Label>
                <div className="grid gap-2">
                  {existingOriginals.map((file: any, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors w-full"
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted">
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                          <span className="text-sm font-medium truncate">
                            {file.publicId?.split("/").pop() || "Unknown File"}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="uppercase">{file.format}</span>
                            <span>•</span>
                            <span>
                              {(file.bytes / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => handleDownload(file.publicId)}
                          className="shrink-0 h-8 w-8"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => handleDeleteExistingOriginal(file.id)}
                          className="shrink-0 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Field>

        {/* Title */}
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="title">Title</FieldLabel>
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
                copyToClipboard(form.watch("description") || "", "Description")
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
            <FieldError>{form.formState.errors.description.message}</FieldError>
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Category */}
          <Field>
            <FieldLabel>Category</FieldLabel>
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

          {/* File Type */}
          <Field>
            <FieldLabel>File Type</FieldLabel>
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
            <FieldLabel>Keywords</FieldLabel>
            <InputStockExtension
              counter={keywords.length}
              maxCounter="50"
              onCopy={() => copyToClipboard(keywords.join(", "), "Keywords")}
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
            <FieldError>{form.formState.errors.keywords.message}</FieldError>
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
            onCheckedChange={(checked) => form.setValue("isPremium", checked)}
          />
        </div>

        {isPremium && (
          <Field>
            <FieldLabel>Price (IDR)</FieldLabel>
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
              <FieldError>{form.formState.errors.price.message}</FieldError>
            )}
          </Field>
        )}

        <div className="sticky -bottom-1 left-0 space-y-6 py-5 bg-background border-t">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              // onClick={() => window.history.back()}
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
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

      <DeleteStockDialog
        open={!!fileToDelete}
        onOpenChage={(open) => !open && setFileToDelete(null)}
        confirmDelete={confirmDelete}
        description="This will remove the file from the list. The actual file will be
            deleted when you save changes."
      />
    </div>
  );
}
