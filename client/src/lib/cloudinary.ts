import axios from "axios";
import { api } from "./axios";

type UploadResult = {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
};

type SignatureResponse = {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
};

export const uploadSingleFile = async (
  file: File,
  folder: string = "vectyz/stocks",
  onProgress?: (progress: number) => void,
): Promise<UploadResult> => {
  // 1. Get Signature from Backend
  const { data: signData } = await api.post<SignatureResponse>(
    "/uploads/sign-upload",
    {
      folder,
    },
  );

  const { signature, timestamp, cloudName, apiKey } = signData;

  if (!cloudName || !apiKey || !signature) {
    throw new Error("Cloudinary configuration missing from server response");
  }

  // 2. Prepare Form Data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  // 3. Upload to Cloudinary using Axios
  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      formData,
      {
        headers: {
          // "Content-Type": "multipart/form-data", // Let browser set this with boundary
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            if (onProgress) {
              onProgress(percentCompleted);
            }
          }
        },
      },
    );

    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
    };
  } catch (error: any) {
    console.error("Cloudinary Upload Error Details:", error.response?.data);
    throw new Error(
      error.response?.data?.error?.message || "Cloudinary upload failed",
    );
  }
};

export const uploadToCloudinary = async (
  files: File | File[],
  folder: string = "vectyz/stocks",
  onProgress?: (progress: number) => void,
): Promise<UploadResult | UploadResult[]> => {
  // Jika array (Multiple)
  if (Array.isArray(files)) {
    let totalProgress = new Array(files.length).fill(0);

    const updateAggregateProgress = (index: number, percent: number) => {
      totalProgress[index] = percent;
      const total = totalProgress.reduce((a, b) => a + b, 0);
      const avg = Math.round(total / files.length);
      if (onProgress) onProgress(avg);
    };

    const promises = files.map((file, index) =>
      uploadSingleFile(file, folder, (percent) =>
        updateAggregateProgress(index, percent),
      ),
    );
    return await Promise.all(promises);
  }

  // Jika single
  return await uploadSingleFile(files, folder, onProgress);
};

export const deleteImage = async (publicId: string) => {
  try {
    const { data } = await api.post("/uploads/delete", { publicId });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete image");
  }
};
