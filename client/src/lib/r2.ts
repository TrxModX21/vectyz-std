import axios, { AxiosProgressEvent } from "axios";
import { api } from "./axios";

interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

// Helper to determine MIME type if file.type is empty
const getMimeType = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  
  switch (ext) {
    case "psb": return "application/vnd.adobe.photoshop";
    case "psd": return "image/vnd.adobe.photoshop";
    case "ai": return "application/postscript";
    case "eps": return "application/postscript";
    case "cdr": return "application/coreldraw"; 
    case "fig": return "application/figma"; 
    case "ppt": return "application/vnd.ms-powerpoint";
    case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "rar": return "application/vnd.rar";
    case "zip": return "application/zip";
    case "7z": return "application/x-7z-compressed";
    default: return "application/octet-stream";
  }
};

export const getPresignedUrl = async (
  file: File,
  folder: string = "vectyz/stocks"
): Promise<PresignedUrlResponse> => {
  const fileType = file.type || getMimeType(file.name);

  const { data } = await api.post(
    "/uploads/presigned-url",
    {
      folder,
      fileName: file.name,
      fileType, 
    }
  );

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data as PresignedUrlResponse;
};

export const uploadToR2 = async (
  file: File,
  folder: string = "vectyz/stocks",
  onProgress?: (progress: number) => void
) => {
  try {
    // 1. Get Presigned URL
    // Note: getPresignedUrl handles missing file.type internally now
    const { uploadUrl, publicUrl, key } = await getPresignedUrl(file, folder);

    // 2. Upload directly to R2
    // IMPORTANT: We must use the exact same Content-Type as used in generating the signature
    const fileType = file.type || getMimeType(file.name);

    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": fileType,
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(percentCompleted);
          }
        }
      },
    });

    return {
      publicUrl, // Store this in DB
      key,
      format: file.name.split(".").pop() || "",
      bytes: file.size,
      width: 0, // Not available without image processing
      height: 0,
    };
  } catch (error: any) {
    console.error("R2 Upload Error:", error);
    // Extracting detailed error from axios response if available
    const detailedError = error.response?.data?.message || 
                          error.response?.statusText || 
                          error.message || 
                          "R2 upload failed";
    throw new Error(detailedError);
  }
};
