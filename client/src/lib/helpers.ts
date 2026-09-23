import axios from "axios";
import { api } from "./axios";
import { toast } from "sonner";

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void,
  folder?: string,
) => {
  // 1. Get Signature
  const { data: signData } = await api.post("/uploads/sign-upload", {
    folder: folder || "vectyz/stocks/previews",
  });

  const formData = new FormData();
  formData.append("file", file as any);
  formData.append("api_key", signData.apiKey);
  formData.append("timestamp", signData.timestamp.toString());
  formData.append("signature", signData.signature);
  formData.append("folder", signData.folder);

  // 2. Upload
  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          if (onProgress) onProgress(percentCompleted);
        }
      },
    },
  );

  return {
    publicId: res.data.public_id,
    url: res.data.secure_url,
    format: res.data.format,
    bytes: res.data.bytes,
    width: res.data.width,
    height: res.data.height,
  };
};

export const uploadToR2 = async (
  files: File | File[],
  onProgress?: (progress: number) => void,
) => {
  const fileArray = Array.isArray(files) ? files : [files];
  const totalSize = fileArray.reduce((acc, file) => acc + file.size, 0);
  const fileProgress = new Map<number, number>();

  const uploadPromises = fileArray.map(async (file, index) => {
    // 1. Get Presigned URL
    const { data: presignedData } = await api.post("/uploads/presigned-url", {
      folder: "vectyz/stocks/originals",
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
    });

    // 2. Upload
    await axios.put(presignedData.uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          fileProgress.set(index, progressEvent.loaded);
          const totalLoaded = Array.from(fileProgress.values()).reduce(
            (a, b) => a + b,
            0,
          );
          const percentCompleted = Math.round((totalLoaded * 100) / totalSize);
          if (onProgress) onProgress(percentCompleted);
        }
      },
    });

    return {
      publicId: presignedData.key,
      url: presignedData.publicUrl,
      format: file.name.split(".").pop() || "bin",
      bytes: file.size,
    };
  });

  const results = await Promise.all(uploadPromises);

  return Array.isArray(files) ? results : results[0];
};

export const copyToClipboard = (text: string, label: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard`);
};

// Placeholder Blur Data URL (gray pixel)
export const blurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f/78fwAI0MN5q9372wAAAABJRU5ErkJggg==";

export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const priceToCredit = (amount: number) => {
  return Math.ceil(amount / 1000);
};

export const convertCreditToRealCurrency = (
  creditAmount: number,
  currency: "IDR" | "USD",
) => {
  return currency === "IDR" ? creditAmount * 1000 : creditAmount * 0.05;
};

// Credit to currency convertion
export function formatPrice(
  creditAmount: number,
  currency: "IDR" | "USD",
  compact: boolean = false,
) {
  if (currency === "IDR") {
    const value = creditAmount * 1000;
    if (compact) {
      if (value >= 1000000) {
        return `Rp ${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
      } else if (value >= 1000) {
        return `Rp ${(value / 1000).toFixed(0)}K`;
      }
      return `Rp ${value}`;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  } else {
    const value = creditAmount * 0.05;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      ...(compact && { notation: "compact", maximumFractionDigits: 2 }),
    }).format(value);
  }
}

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

export function extractDomain(website?: string) {
  if (!website) return null;

  // tambahkan protocol jika belum ada
  let url = website;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return website;
  }
}

/**
 * Strips basic Markdown formatting characters from a string.
 * Useful for displaying plain text excerpts from Markdown content.
 */
export const stripMarkdown = (markdown?: string | null): string => {
  if (!markdown) return "";
  
  return markdown
    // Remove headers (## Header)
    .replace(/^#+\s+/gm, "")
    // Remove bold/italic (**bold**, *italic*, __bold__, _italic_)
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    // Remove blockquotes (> quote)
    .replace(/^>\s+/gm, "")
    // Remove inline code (`code`)
    .replace(/`([^`]+)`/g, "$1")
    // Remove images (![alt](url))
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    // Replace links with just their text ([text](url) -> text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove strikethrough (~~text~~)
    .replace(/~~([^~]+)~~/g, "$1")
    // Remove unordered list bullets (- item, * item, + item)
    .replace(/^[-*+]\s+/gm, "")
    // Remove ordered list numbers (1. item)
    .replace(/^\d+\.\s+/gm, "")
    // Replace multiple newlines with a single space
    .replace(/\n+/g, " ")
    .trim();
};

