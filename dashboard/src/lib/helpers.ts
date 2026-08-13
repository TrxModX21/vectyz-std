import { api } from "./axios";
import axios from "axios";

export const convertCreditToIDR = (creditAmount: number) => {
  return creditAmount * 1000;
};

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void,
  folder?: string,
) => {
  // 1. Get Signature
  const { data: signData } = await api.post("/uploads/sign-upload", {
    folder: folder || "vectyz/categories",
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
