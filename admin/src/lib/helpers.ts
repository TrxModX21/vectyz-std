import { api } from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void,
) => {
  // 1. Get Signature
  const { data: signData } = await api.post("/uploads/sign-upload", {
    folder: "vectyz/stocks/previews",
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
      fileType: file.type,
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

export const handleDownload = async (publicId: string) => {
  try {
    toast.loading("Preparing download...", { id: "download-toast" });
    const { data } = await api.post("/uploads/download-url", {
      key: publicId,
    });

    if (data.downloadUrl) {
      window.open(data.downloadUrl, "_blank");
      toast.success("Download started", { id: "download-toast" });
    } else {
      toast.error("Failed to generate download URL", {
        id: "download-toast",
      });
    }
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to download file", { id: "download-toast" });
  }
};
