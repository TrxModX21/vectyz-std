"use client";

import { ImageIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { addWatermark } from "@/lib/watermark";

interface ImagePickerProps {
  label?: string;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  required?: boolean;
  giveWatermark?: boolean;
}

const ImagePicker = ({
  label = "Image",
  value,
  onChange,
  disabled,
  required = false,
  giveWatermark = false,
}: ImagePickerProps) => {
  const [preview, setPreview] = useState<string | null>(null);
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (giveWatermark) {
        const watermarkedFile = await addWatermark(file);
        onChange?.(watermarkedFile);
      } else {
        onChange?.(file);
      }
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div
        className={`group relative flex aspect-auto h-56 max-h-80 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors ${
          !disabled ? "hover:bg-muted/50" : "opacity-60 cursor-not-allowed"
        }`}
        onClick={() => !disabled && !preview && fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-contain"
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
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="rounded-full bg-background p-3 shadow-sm">
              <ImageIcon className="size-6" />
            </div>
            <span className="text-sm font-medium">Click to upload image</span>
            <span className="text-xs text-muted-foreground/75">
              SVG, PNG, JPG or GIF (max. 2MB)
            </span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ImagePicker;
