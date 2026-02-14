import { Request, Response } from "express";
import { HTTPSTATUS } from "../utils/http.config";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { generateSignature, deleteFromCloudinary } from "../lib/cloudinary";
import { generateR2PresignedUrl } from "../lib/r2";
import { config } from "../utils/app.config";

export const getUploadSignatureController = asyncHandler(
  async (req: Request, res: Response) => {
    const { folder } = req.body;

    // Use default folder if not specified
    const uploadFolder = folder || "vectyz/stocks";

    try {
      const { timestamp, signature } = generateSignature(uploadFolder);

      return res.status(HTTPSTATUS.OK).json({
        signature,
        timestamp,
        cloudName: config.CLOUDINARY_CLOUD_NAME,
        apiKey: config.CLOUDINARY_API_KEY,
        folder: uploadFolder,
      });
    } catch (error: any) {
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Error generating signature",
        error: error.message,
      });
    }
  },
);

export const getPresignedUrlController = asyncHandler(
  async (req: Request, res: Response) => {
    const { folder, fileName, fileType } = req.body;
    console.log("Presigned URL Request:", { folder, fileName, fileType });

    if (!fileName || !fileType) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "File name and file type are required",
      });
    }

    // Use default folder if not specified
    const uploadFolder = folder || "vectyz/stocks";

    try {
      const { uploadUrl, publicUrl, key } = await generateR2PresignedUrl(
        uploadFolder,
        fileName,
        fileType
      );

      return res.status(HTTPSTATUS.OK).json({
        uploadUrl,
        publicUrl,
        key,
      });
    } catch (error: any) {
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Error generating presigned URL",
        error: error.message,
      });
    }
  }
);

export const deleteImageController = asyncHandler(
  async (req: Request, res: Response) => {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Public ID is required",
      });
    }

    try {
      const result = await deleteFromCloudinary(publicId);

      if (result.result !== "ok") {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          message: "Failed to delete image from Cloudinary",
          result,
        });
      }

      return res.status(HTTPSTATUS.OK).json({
        message: "Image deleted successfully",
      });
    } catch (error: any) {
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Error deleting image",
        error: error.message,
      });
    }
  },
);

// export const getDownloadUrlController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { key } = req.body;

//     if (!key) {
//       return res.status(HTTPSTATUS.BAD_REQUEST).json({
//         message: "File key is required",
//       });
//     }

//     // Security check: ensure key belongs to allowed folders (optional but good practice)
//     // if (!key.startsWith("vectyz/stocks")) ... 

//     try {
//       // Import internally to avoid circular dep issues if any, or just use established pattern
//       const { generateR2ReadUrl } = require("../lib/r2");
//       const downloadUrl = await generateR2ReadUrl(key);

//       return res.status(HTTPSTATUS.OK).json({
//         downloadUrl,
//       });
//     } catch (error: any) {
//       return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
//         message: "Error generating download URL",
//         error: error.message,
//       });
//     }
//   }
// );
