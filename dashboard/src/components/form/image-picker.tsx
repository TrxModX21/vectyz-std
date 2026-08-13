import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, X, Loader } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression";
import { toast } from "@/components/uitripled/notification-center-shadcnui";

interface ImagePickerProps {
  label?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  error?: string;
  className?: string;
  defaultPreviewUrl?: string;
}

export function ImagePicker({ label, value, onChange, onRemove, error, className, defaultPreviewUrl }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (value) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (defaultPreviewUrl) {
      setPreview(defaultPreviewUrl);
    } else {
      setPreview(null);
    }
  }, [value, defaultPreviewUrl]);

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      onChange(compressedFile);
    } catch (error) {
      console.error(error);
      toast.error("Failed to compress image");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
    // Clear input so selecting the same file again works
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (onRemove) onRemove();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await processFile(file);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-[13px] font-medium text-cyber-heading">
          {label}
        </label>
      )}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-cyber border-2 border-dashed p-4 text-center transition-colors",
          isDragActive
            ? "border-neon bg-[rgba(84,234,253,0.1)]"
            : "bg-cyber-surface-active hover:bg-[rgba(84,234,253,0.05)]",
          error && !isDragActive
            ? "border-[#FF003C] hover:border-[#FF003C]"
            : !isDragActive && "border-cyber-border hover:border-neon",
          preview ? "py-4" : "py-8"
        )}
      >
        {preview ? (
          <div className="relative w-full aspect-video max-h-[200px] rounded-sm overflow-hidden border border-cyber-border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-cyber bg-black/60 text-white hover:bg-black/80 hover:text-[#FF3366] transition-colors backdrop-blur-sm"
            >
              <X size={16} />
            </button>
          </div>
        ) : isProcessing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader size={32} className="animate-spin text-neon mb-3" />
            <p className="text-[14px] font-medium text-cyber-heading">
              Compressing image...
            </p>
          </div>
        ) : (
          <>
            <UploadCloud size={32} className={cn("mb-3", error ? "text-[#FF003C]" : "text-neon")} />
            <p className="text-[14px] font-medium text-cyber-heading mb-1">
              Drag and drop your image here
            </p>
            <p className="text-[12px] text-cyber-body-subtle mb-4">
              SVG, PNG, JPG or GIF (max. 5MB)
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-4 py-[10px] text-[13px] font-medium text-neon transition-colors hover:bg-[rgba(84,234,253,0.2)]"
            >
              Browse file
            </button>
          </>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs font-medium text-[#FF003C]">{error}</p>
      )}
    </div>
  );
}
