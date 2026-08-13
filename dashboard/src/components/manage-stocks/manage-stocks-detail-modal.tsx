import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import KeywordInput from "../form/keyword-input";
import StockInputExtension from "../form/stock-input-extension";
import SelectWithSearch from "../form/select-with-search";
import { StockData } from "../../../types/manage-stocks";
import { useManageCategories } from "@/features/manage-categories/queries";
import { useManageFiletypes } from "@/features/manage-filetypes/queries";
import { useSaveStockMetadataMutation } from "@/features/manage-stocks/mutations";
import { UpdateStockMetadataSchema, updateStockMetadataSchema } from "@/validators/manage-stocks.validator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Download,
  Eye,
  Heart,
  XCircle,
  AlertTriangle,
  Save,
  Loader2,
  FileIcon,
} from "lucide-react";
import { toast } from "@/components/uitripled/notification-center-shadcnui";
import { api } from "@/lib/axios";

interface ManageStocksDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockData | null;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onSave: (stock: StockData) => void;
}

const ManageStocksDetailModal = ({
  isOpen,
  onClose,
  stock,
  onApprove,
  onReject,
  onSave,
}: ManageStocksDetailModalProps) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [fileTypeSearch, setFileTypeSearch] = useState("");
  const [downloading, setDownloading] = useState(false);

  const saveMetadataMutation = useSaveStockMetadataMutation();

  const form = useForm<UpdateStockMetadataSchema>({
    resolver: zodResolver(updateStockMetadataSchema),
    defaultValues: {
      title: "",
      description: "",
      keywords: [],
      categoryId: "",
      fileTypeId: "",
      isPremium: false,
      price: 0,
    },
  });

  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useManageCategories({
      page: 1,
      limit: 20,
      search: categorySearch,
      sortBy: "name",
      sortOrder: "asc",
    });
  const categoryData = categoriesResponse?.data;

  const { data: filetypesResponse, isLoading: isLoadingFileTypes } =
    useManageFiletypes({
      page: 1,
      limit: 20,
      search: fileTypeSearch,
      sortBy: "name",
      sortOrder: "asc",
    });
  const filetypeData = filetypesResponse?.data;

  useEffect(() => {
    if (stock) {
      form.reset({
        title: stock.title,
        description: stock.description || "",
        keywords: stock.keywords,
        categoryId: stock.category.id,
        fileTypeId: stock.fileType.id,
        isPremium: stock.isPremium,
        price: Number(stock.price) || 0,
      });
    }
  }, [stock, form]);

  if (!stock) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      toast.info("Preparing your download...");
      const response = await api.post(
        `/downloads/${stock.id}`,
        {},
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${stock.slug}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Download started!");
    } catch (error: any) {
      let message = "Failed to download original files";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          message = json.message || json.reason || message;
        } catch (e) {}
      } else {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setDownloading(false);
    }
  };

  const onSubmit = async (values: UpdateStockMetadataSchema) => {
    if (!stock) return;
    try {
      await saveMetadataMutation.mutateAsync({ id: stock.id, data: values });
      if (onSave) onSave(stock); // keeping this in case parent still wants to do something
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save metadata");
    }
  };

  const originalFiles = stock.files.filter((f) => f.purpose === "ORIGINAL");
  const originalFile = originalFiles[0] || stock.files[0];
  const previewFile =
    stock.files.find((f) => f.purpose === "PREVIEW") || stock.files[0];

  const categoryOptions =
    categoryData?.items.map((c: any) => ({
      value: c.id,
      label: c.name,
    })) || [];

  const fileTypeOptions =
    filetypeData?.items.map((f: any) => ({
      value: f.id,
      label: f.name,
    })) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:min-w-5xl max-w-7xl w-[95vw] sm:w-full bg-cyber-surface border-cyber-border text-cyber-heading p-0 overflow-hidden shadow-[0_0_40px_rgba(84,234,253,0.15)] flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <DialogHeader className="p-4 sm:p-6 border-b border-cyber-border-subtle bg-cyber-surface-active shrink-0">
          <DialogTitle className="text-lg sm:text-xl tracking-wide flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3">
            Review Asset: <span className="text-neon">{stock.title}</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${
                stock.deletedAt
                  ? "bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/50 line-through opacity-80"
                  : stock.status === "PENDING"
                  ? "bg-[#FFD166]/10 text-[#FFD166] border-[#FFD166]/30"
                  : stock.status === "APPROVED"
                    ? "bg-neon/10 text-neon border-neon/30"
                    : "bg-[#FF3366]/10 text-[#FF3366] border-[#FF3366]/30"
              }`}
            >
              {stock.deletedAt ? "DELETED" : stock.status}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:grid md:grid-cols-2 flex-1 min-h-0 md:overflow-hidden overflow-y-auto">
          {/* Left: Visual Preview */}
          <div className="bg-cyber-background md:border-r md:border-b-0 border-b border-cyber-border flex flex-col items-center justify-center p-4 sm:p-6 relative group overflow-hidden md:h-full h-[35vh] shrink-0">
            <div className="relative w-full h-full rounded-md overflow-hidden border border-cyber-border-subtle shadow-inner">
              {previewFile?.url ? (
                <Image
                  src={previewFile.url}
                  alt={stock.title}
                  fill
                  sizes="500px"
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-cyber-body-subtle">
                  No preview available
                </div>
              )}
            </div>

            <div className="w-full mt-4 flex items-center justify-between text-[12px] text-cyber-body bg-cyber-surface-active p-3 rounded-cyber border border-cyber-border">
              <div className="flex flex-col">
                <span className="text-cyber-body-subtle">Format</span>
                <span className="font-semibold uppercase">
                  {originalFile?.format || stock.fileType.name}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-cyber-body-subtle">Uploader</span>
                <span className="font-semibold">{stock.user.name}</span>
              </div>
            </div>
          </div>

          {/* Right: Metadata & Edit Form */}
          <div className="flex flex-col md:overflow-y-auto p-4 sm:p-6 gap-6">
            <form id="edit-metadata-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col min-h-0 h-full">
            {/* Analytics Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-cyber-surface-active border border-cyber-border-subtle rounded-cyber p-3 flex flex-col items-center justify-center">
                <Download size={16} className="text-neon mb-1" />
                <span className="text-xl font-bold tabular-nums leading-none">
                  {stock.totalDownloads}
                </span>
                <span className="text-[10px] text-cyber-body-subtle uppercase">
                  Downloads
                </span>
              </div>
              <div className="bg-cyber-surface-active border border-cyber-border-subtle rounded-cyber p-3 flex flex-col items-center justify-center">
                <Eye size={16} className="text-neon mb-1" />
                <span className="text-xl font-bold tabular-nums leading-none">
                  {stock.totalViews}
                </span>
                <span className="text-[10px] text-cyber-body-subtle uppercase">
                  Views
                </span>
              </div>
              <div className="bg-cyber-surface-active border border-cyber-border-subtle rounded-cyber p-3 flex flex-col items-center justify-center">
                <Heart size={16} className="text-[#FF3366] mb-1" />
                <span className="text-xl font-bold tabular-nums leading-none">
                  {stock.totalLikes}
                </span>
                <span className="text-[10px] text-cyber-body-subtle uppercase">
                  Likes
                </span>
              </div>
            </div>

            {/* Quick Edit Form */}
            <div className="flex flex-col gap-4">
              {/* Original Files List */}
              {originalFiles.length > 0 && (
                <div className="flex flex-col gap-3 p-4 rounded-cyber border border-cyber-border-subtle bg-cyber-background">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[14px] font-medium text-cyber-heading">
                      Original Files
                    </h4>
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-neon/10 border border-neon/30 text-neon text-[12px] font-medium hover:bg-neon/20 transition-colors disabled:opacity-50"
                    >
                      {downloading ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3" />
                          Download All (ZIP)
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid gap-2">
                    {originalFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center rounded-sm border border-cyber-border bg-cyber-surface-active p-3 hover:border-cyber-border-hover transition-colors overflow-hidden"
                      >
                        <div className="flex items-center gap-3 overflow-hidden min-w-0 w-full">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-cyber-surface border border-cyber-border-subtle">
                            <FileIcon className="h-4 w-4 text-cyber-body-subtle" />
                          </div>

                          <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                            <span className="text-[13px] font-medium text-cyber-heading truncate block">
                              {file.publicId.split("/").pop()}
                            </span>

                            <div className="flex items-center gap-2 text-[11px] text-cyber-body-subtle">
                              <span className="uppercase">{file.format}</span>
                              <span>•</span>
                              <span>
                                {(Number(file.bytes) / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5 group/field">
                <div className="flex items-center justify-between opacity-100 lg:opacity-100 transition-opacity duration-200 group-hover/field:opacity-100 focus-within:opacity-100">
                  <label className="text-[13px] font-medium text-cyber-body">
                    Title
                  </label>
                  <StockInputExtension
                    counter={form.watch("title")?.length || 0}
                    maxCounter={100}
                    inputName="Title"
                    onCopy={() => navigator.clipboard.writeText(form.watch("title") || "")}
                    onDelete={() => form.setValue("title", "")}
                  />
                </div>
                <input
                  type="text"
                  {...form.register("title")}
                  maxLength={100}
                  className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[14px] focus:border-neon focus:outline-none transition-colors"
                />
                {form.formState.errors.title && (
                  <span className="text-[12px] text-[#FF3366]">{form.formState.errors.title.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-20">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-cyber-body">
                    Category
                  </label>
                  <Controller
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <SelectWithSearch
                        value={field.value}
                        onChange={field.onChange}
                        options={categoryOptions}
                        onSearch={setCategorySearch}
                        isLoading={isLoadingCategories}
                        placeholder="Select category"
                        searchPlaceholder="Search category..."
                        fallbackLabel={stock.category.name}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-cyber-body">
                    File Type
                  </label>
                  <Controller
                    control={form.control}
                    name="fileTypeId"
                    render={({ field }) => (
                      <SelectWithSearch
                        value={field.value}
                        onChange={field.onChange}
                        options={fileTypeOptions}
                        onSearch={setFileTypeSearch}
                        isLoading={isLoadingFileTypes}
                        placeholder="Select file type"
                        searchPlaceholder="Search file type..."
                        fallbackLabel={stock.fileType.name}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 group/field">
                <div className="flex items-center justify-between opacity-100 lg:opacity-100 transition-opacity duration-200 group-hover/field:opacity-100 focus-within:opacity-100">
                  <label className="text-[13px] font-medium text-cyber-body">
                    Description
                  </label>
                  <StockInputExtension
                    counter={form.watch("description")?.length || 0}
                    maxCounter={500}
                    inputName="Description"
                    onCopy={() =>
                      navigator.clipboard.writeText(form.watch("description") || "")
                    }
                    onDelete={() => form.setValue("description", "")}
                  />
                </div>
                <textarea
                  {...form.register("description")}
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[14px] focus:border-neon focus:outline-none transition-colors min-h-52 resize-y"
                />
                {form.formState.errors.description && (
                  <span className="text-[12px] text-[#FF3366]">{form.formState.errors.description.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 group/field">
                <div className="flex items-center justify-between opacity-100 lg:opacity-100 transition-opacity duration-200 group-hover/field:opacity-100 focus-within:opacity-100">
                  <label className="text-[13px] font-medium text-cyber-body">
                    Keywords
                  </label>
                  <StockInputExtension
                    counter={form.watch("keywords")?.length || 0}
                    maxCounter={50}
                    inputName="Keywords"
                    onCopy={() =>
                      navigator.clipboard.writeText(form.watch("keywords")?.join(", ") || "")
                    }
                    onDelete={() => form.setValue("keywords", [])}
                  />
                </div>
                <Controller
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <KeywordInput
                      keywords={field.value || []}
                      onKeywordsChange={field.onChange}
                    />
                  )}
                />
                {form.formState.errors.keywords && (
                  <span className="text-[12px] text-[#FF3366]">{form.formState.errors.keywords.message}</span>
                )}
              </div>

              <div className="p-4 rounded-cyber border border-cyber-border-subtle bg-cyber-background space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-medium">Premium Asset</div>
                    <div className="text-[12px] text-cyber-body-subtle">
                      Require payment to download
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...form.register("isPremium")}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-cyber-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-cyber-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon"></div>
                  </label>
                </div>

                {form.watch("isPremium") && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-cyber-body">
                        Price (Credit)
                      </label>
                      <input
                        type="number"
                        {...form.register("price", { valueAsNumber: true })}
                        className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[14px] focus:border-neon focus:outline-none transition-colors"
                      />
                      {form.formState.errors.price && (
                        <span className="text-[12px] text-[#FF3366]">{form.formState.errors.price.message}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-cyber-border-subtle bg-cyber-surface flex flex-col shrink-0">
          {isRejecting ? (
            <div className="p-3 rounded-cyber border border-[#FF3366]/40 bg-[#FF3366]/5 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 text-[#FF3366] font-semibold mb-2">
                <AlertTriangle size={16} />
                Reason for Rejection
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this asset was rejected..."
                rows={2}
                className="w-full rounded-sm border border-[#FF3366]/40 bg-cyber-background px-3 py-2 text-[13px] focus:border-[#FF3366] focus:outline-none resize-none mb-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1.5 text-[12px] font-medium text-cyber-body hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onReject(stock.id, rejectReason)}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-1.5 text-[12px] font-semibold rounded-sm bg-[#FF3366] text-white hover:bg-[#FF3366]/90 disabled:opacity-50"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="submit"
                form="edit-metadata-form"
                disabled={saveMetadataMutation.isPending || !form.formState.isDirty}
                className="flex items-center justify-center gap-2 text-[13px] font-medium text-cyber-body hover:text-white border border-cyber-border px-4 py-2 rounded-cyber hover:bg-cyber-surface-hover transition-colors disabled:opacity-50"
              >
                {saveMetadataMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Metadata
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!stock.deletedAt && stock.status !== "APPROVED" && (
                  <button
                    onClick={() => onApprove(stock.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-cyber bg-neon/20 border border-neon/50 text-[14px] font-semibold text-neon hover:bg-neon/30 transition-all shadow-[0_0_10px_rgba(84,234,253,0.2)]"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                )}

                {!stock.deletedAt && stock.status !== "REJECTED" && (
                  <button
                    onClick={() => setIsRejecting(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-cyber bg-[#FFD166]/10 border border-[#FFD166]/30 text-[14px] font-semibold text-[#FFD166] hover:bg-[#FFD166]/20 transition-all"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageStocksDetailModal;
