"use client";

import FadeIn from "@/components/common/fade-in";
import InputStockExtension from "@/components/input-stock-extension";
import { KeywordInput } from "@/components/keyword-input";
import SelectWithSearching from "@/components/select-with-searching";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useGetCategories } from "@/hooks/use-categories";
import { useGetFileTypes } from "@/hooks/use-file-type";
import { useCreateStock } from "@/hooks/use-stock";
import { copyToClipboard, uploadToCloudinary, uploadToR2 } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { addWatermark } from "@/lib/watermark";
import { AddStockSchema, addStockSchema } from "@/validators/stock.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileIcon,
  ImageIcon,
  Loader,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateStockPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const clearField = (fieldName: keyof AddStockSchema, emptyVal: any) => {
    form.setValue(fieldName, emptyVal);
  };

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
      price: 1,
      currency: "IDR",
      files: [],
    },
  });
  const keywords = form.watch("keywords");
  const isPremium = form.watch("isPremium");

  const { data: userProfileResponse } = useAuth();
  const user = userProfileResponse?.user;

  const { data: categoriesResponse, isLoading: categoryLoading } =
    useGetCategories();
  const categories = categoriesResponse?.categories || [];

  const { data: fileTypesResponse, isLoading: fileTypeLoading } =
    useGetFileTypes();
  const fileTypes = fileTypesResponse?.fileTypes || [];

  const { mutate, isPending: createStockPending } = useCreateStock();
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
          setUploadProgress(0);
          setIsUploading(false);
        },
        onError: (err) => {
          console.log(err);
          toast.error("An error occurred during stock creation", {
            id: "create-stock",
          });
          setIsUploading(false);
        },
      });
    } catch (err) {
      console.log(err);
      toast.error("An error occurred during stock creation", {
        id: "create-stock",
      });
      setIsUploading(false);
    }
  };

  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Upload New Asset</h1>
          <p className="text-muted-foreground">
            Share your creativity with the world.
          </p>
        </div>
      </div>

      {/* Instruction */}
      <Card className="w-full mb-4 lg:col-span-2">
        <CardHeader>
          <CardTitle>Upload Instruction</CardTitle>
          <CardDescription>
            Read this guide if this first time you upload asset in Vectolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="guide">
              <AccordionTrigger>How to upload asset?</AccordionTrigger>
              <AccordionContent>
                For uploading please select or drop your original image into the
                drop zone. And also you have to wrap your picture with your PSD,
                Ai, XD etc, (if any) including this file below as a zip file.
                Then in the zip file section upload it. Otherwise, your image
                won't be approved
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* File Drag & Drop */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="gap-1">
                Thumbnail Image <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                <ImagePicker
                  disabled={isPending}
                  username={user?.username}
                  value={form.watch("preview")}
                  onChange={(file) => form.setValue("preview", file!)}
                />
                {form.formState.errors.preview && (
                  <FieldError>
                    {form.formState.errors.preview.message}
                  </FieldError>
                )}
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="gap-1">
                Original File <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Field>
                <FilePicker
                  value={form.watch("files")}
                  disabled={isPending}
                  onChange={(files) => form.setValue("files", files!)}
                />
                {form.formState.errors.files && (
                  <FieldError>{form.formState.errors.files.message}</FieldError>
                )}
              </Field>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
            <CardDescription>
              Fill all form to upload your files, provide accurate information
              to help users find your asset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Price  */}
            <div className="grid grid-cols-2 gap-4">
              {/* Premium Switch */}
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4",
                  isPremium ? "col-span-1" : "col-span-2",
                )}
              >
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
                  <FieldLabel htmlFor="price" className="gap-0">
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
                      min={1}
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
            </div>

            {/* Title */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="title" className="gap-0">
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
                placeholder="e.g. Modern Abstract Background"
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
                <FieldLabel htmlFor="description" className="gap-0">
                  Description
                </FieldLabel>
                <InputStockExtension
                  counter={(form.watch("description") || "").length}
                  maxCounter="500"
                  inputName="Description"
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
                className="resize-none min-h-[100px]"
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
            <div className="grid grid-cols-2 gap-4">
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
                  inputName="Keywords"
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

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader className="animate-spin" />}
                {isPending ? "Create..." : "Create Stock"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {isUploading && (
        <div className="space-y-1 my-4">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-center text-xs text-muted-foreground">
            Please wait while we process your files... {uploadProgress}%
          </p>
        </div>
      )}
    </FadeIn>
  );
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const ImagePicker = ({
  value,
  username,
  disabled = false,
  onChange,
}: {
  value?: File | string | null;
  username?: string;
  disabled?: boolean;
  onChange?: (file: File | null) => void;
}) => {
  const [previewDragActive, setPreviewDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value as any);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const watermarkedFile = await addWatermark(file, username);
      onChange?.(watermarkedFile);
    } catch (error) {
      toast.error("Failed to process image watermark");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreviewDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setPreviewDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      await processFile(file);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      (e.key === "Enter" || e.key === " ") &&
      !disabled &&
      !preview &&
      !isProcessing
    ) {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`group relative aspect-video bg-muted rounded-md flex items-center justify-center border text-muted-foreground overflow-hidden transition-colors ${
        previewDragActive ? "border-primary bg-primary/5" : "hover:bg-muted/80"
      }${!disabled ? " hover:bg-muted/50 cursor-pointer" : " opacity-60 cursor-not-allowed"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
      onDragEnter={() => setPreviewDragActive(true)}
      onDragLeave={() => setPreviewDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handlePreviewDrop}
      onClick={() =>
        !disabled && !preview && !isProcessing && fileInputRef.current?.click()
      }
      onKeyDown={handleKeyDown}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
        disabled={disabled || isProcessing}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          {!disabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemoveImage}
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 pointer-events-none p-4 text-center">
          <div className="rounded-full bg-background p-3 shadow-sm">
            {isProcessing ? (
              <Loader className="size-6 animate-spin" />
            ) : (
              <ImageIcon className="size-6" />
            )}
          </div>
          <span className="text-sm font-medium">
            {isProcessing
              ? "Processing image..."
              : "Click or drag image for preview"}
          </span>
          {!isProcessing && (
            <p className="text-xs text-muted-foreground">
              Max 5MB. Supported: JPG, PNG, SVG, GIF.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const FilePicker = ({
  value,
  disabled = false,
  onChange,
}: {
  value?: File[] | null;
  disabled?: boolean;
  onChange?: (file: File[] | null) => void;
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedOriginalFiles, setSelectedOriginalFiles] = useState<File[]>(
    value || [],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedOriginalFiles(value || []);
  }, [value]);

  const processIncomingFiles = (incomingFiles: File[]) => {
    const invalidSizeFiles: string[] = [];
    const invalidTypeFiles: string[] = [];
    const allowedExtensions = [
      ".ai",
      ".eps",
      ".psd",
      ".psb",
      ".fig",
      ".cdr",
      ".ppt",
      ".pptx",
      ".zip",
    ];

    const validFiles = incomingFiles.filter((file) => {
      if (file.size > 80 * 1024 * 1024) {
        invalidSizeFiles.push(file.name);
        return false;
      }

      const fileExt = file.name.includes(".")
        ? "." + file.name.split(".").pop()?.toLowerCase()
        : "";
      const isImage = file.type.startsWith("image/");
      const isValidExt = fileExt ? allowedExtensions.includes(fileExt) : false;

      if (!isImage && !isValidExt) {
        invalidTypeFiles.push(file.name);
        return false;
      }

      return true;
    });

    if (invalidSizeFiles.length > 0) {
      toast.error(`${invalidSizeFiles.length} file(s) exceed the 80MB limit`);
    }

    if (invalidTypeFiles.length > 0) {
      toast.error(`${invalidTypeFiles.length} file(s) have unsupported format`);
    }

    if (validFiles.length === 0) return;

    if (selectedOriginalFiles.length + validFiles.length > 3) {
      toast.error("Maximum 3 files allowed in total");
      return;
    }

    const newFiles = [...selectedOriginalFiles, ...validFiles];
    setSelectedOriginalFiles(newFiles);
    onChange?.(newFiles);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleOriginalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const removeOriginalFile = (index: number) => {
    const newFiles = selectedOriginalFiles.filter((_, i) => i !== index);
    setSelectedOriginalFiles(newFiles);
    onChange?.(newFiles);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      (e.key === "Enter" || e.key === " ") &&
      !disabled &&
      selectedOriginalFiles.length < 3
    ) {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={`border-2 border-dashed bg-muted rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:bg-muted/50"
        } ${
          disabled || selectedOriginalFiles.length >= 3
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer"
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => {
          if (!disabled && selectedOriginalFiles.length < 3) {
            fileInputRef.current?.click();
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          disabled={disabled || selectedOriginalFiles.length >= 3}
          accept=".ai,.eps,.psd,.psb,.fig,.cdr,.ppt,.pptx,.zip,image/*"
          onChange={handleOriginalFileChange}
        />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center pointer-events-none">
            <UploadCloud className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="pointer-events-none">
            <p className="font-medium">
              Click or drag file to this area to upload (up to 3 file)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max 3 files (Max 80MB/file). Supported: Vector (.ai, .eps, .cdr),
              Figma (.fig), Photoshop (.psd, .psb), PowerPoint (.ppt, .pptx),
              Zip (.zip), Images.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            type="button"
            className="pointer-events-none"
            tabIndex={-1}
          >
            Select File
          </Button>
        </div>
      </div>

      {selectedOriginalFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedOriginalFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm truncate max-w-[150px] sm:max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => removeOriginalFile(index)}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CreateStockPage;
