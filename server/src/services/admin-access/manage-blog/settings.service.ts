import { deleteFromCloudinary } from "../../../lib/cloudinary";
import prisma from "../../../lib/prisma";
import { extractPublicIdFromUrl } from "../../../utils/cloudinary.utils";
import { UpdateBlogSettingSchema } from "../../../validation/manage-blog-validation";

export const getBlogSettingsService = async () => {
  // Hanya ambil row dengan id 'global'
  let settings = await prisma.blogSetting.findUnique({
    where: { id: "global" },
  });

  // Jika belum ada di database, buatkan secara otomatis
  if (!settings) {
    settings = await prisma.blogSetting.create({
      data: { id: "global" },
    });
  }

  return settings;
};

export const updateBlogSettingsService = async (
  data: UpdateBlogSettingSchema,
) => {
  // 1. Ambil data settings yang ada saat ini
  const existingSettings = await prisma.blogSetting.findUnique({
    where: { id: "global" },
  });

  // 2. Jika ada gambar lama dan gambar baru berbeda (atau dihapus), hapus gambar lama dari Cloudinary
  if (
    existingSettings?.defaultSocialImage &&
    data.defaultSocialImage !== undefined &&
    data.defaultSocialImage !== existingSettings.defaultSocialImage
  ) {
    const publicId = extractPublicIdFromUrl(
      existingSettings.defaultSocialImage,
    );
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error(
          "Failed to delete old social image from Cloudinary:",
          err,
        );
      }
    }
  }

  // 3. Siapkan payload update (jika string kosong, simpan sebagai null)
  const updatePayload = {
    ...data,
    defaultSocialImage:
      data.defaultSocialImage === "" ? null : data.defaultSocialImage,
  };

  // 4. Update data ke database
  const settings = await prisma.blogSetting.upsert({
    where: { id: "global" },
    update: updatePayload,
    create: {
      id: "global",
      ...updatePayload,
    },
  });
  
  return settings;
};
