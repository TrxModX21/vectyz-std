import { Router } from "express";

import {
  deleteImageController,
  getUploadSignatureController,
  getPresignedUrlController,
  // getDownloadUrlController,
} from "../controllers/upload.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const uploadRoutes = Router();

// Endpoint to get signature for upload (User & Admin)
uploadRoutes.post("/sign-upload", requireAuth, getUploadSignatureController);

// Endpoint to get R2 Presigned URL
uploadRoutes.post("/presigned-url", requireAuth, getPresignedUrlController);

// Endpoint to get R2 Download URL
// uploadRoutes.post("/download-url", requireAuth, getDownloadUrlController);

// Endpoint to delete image (Admin only)
uploadRoutes.post(
  "/delete",
  requireAuth,
  requireRole(["admin", "user"]),
  deleteImageController,
);

export default uploadRoutes;
