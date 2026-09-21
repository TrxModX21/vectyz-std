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

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Check if it's a valid Cloudinary URL
    if (!url.includes("cloudinary.com")) return null;

    // Example: https://res.cloudinary.com/demo/image/upload/v1570979139/folder/sample.jpg
    // Split by '/' to get parts
    const parts = url.split("/");

    // Find the index of "upload"
    const uploadIndex = parts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) return null;

    // Everything after the version number (which starts with 'v' followed by digits) or directly after "upload" could be the public_id
    // But usually Cloudinary structure is .../upload/v<version>/<folder>/<filename>.<ext>
    // OR .../upload/<folder>/<filename>.<ext> (if version is omitted, though standard is versioned)

    // Let's take parts after "upload"
    // parts[uploadIndex + 1] could be version "v12345"
    let publicIdParts = parts.slice(uploadIndex + 1);

    // If first part is version (starts with 'v' and is numeric-ish), remove it
    if (
      publicIdParts.length > 0 &&
      publicIdParts[0].startsWith("v") &&
      !isNaN(Number(publicIdParts[0].substring(1)))
    ) {
      publicIdParts = publicIdParts.slice(1);
    }

    // Join the remaining parts back with '/' => "folder/sample.jpg"
    const publicIdWithExtension = publicIdParts.join("/");

    // Remove extension
    const lastDotIndex = publicIdWithExtension.lastIndexOf(".");
    if (lastDotIndex === -1) return publicIdWithExtension;

    return publicIdWithExtension.substring(0, lastDotIndex);
  } catch (error) {
    console.error("Error extracting publicId:", error);
    return null;
  }
};
