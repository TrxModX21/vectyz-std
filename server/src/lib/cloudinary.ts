import { v2 as cloudinary } from "cloudinary";
import { config } from "../utils/app.config";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME as string,
  api_key: config.CLOUDINARY_API_KEY as string,
  api_secret: config.CLOUDINARY_API_SECRET as string,
});

export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};

export const generateSignature = (folder: string) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    config.CLOUDINARY_API_SECRET as string,
  );

  return { timestamp, signature };
};
