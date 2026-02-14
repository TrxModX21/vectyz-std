import prisma from "../lib/prisma";
import { ConflictException, NotFoundException } from "../utils/app-error";
import { generateSlugFromName } from "../utils/helper";
import { deleteFromCloudinary } from "../lib/cloudinary";
import { extractPublicIdFromUrl } from "../utils/cloudinary.utils";

export const allFileTypeService = async (
  sort: "asc" | "desc" = "desc",
  includeCategories: boolean = false,
  limit: number = 10
) => {
  const [fileTypes, totalCount] = await Promise.all([
    prisma.fileType.findMany({ orderBy: { createdAt: sort } }),
    prisma.fileType.count(),
  ]);

  if (includeCategories) {
    const fileTypesWithCategories = await Promise.all(
      fileTypes.map(async (ft) => {
        const categories = await prisma.category.findMany({
          where: {
            status: "active",
            stocks: {
              some: {
                fileTypeId: ft.id,
                status: "APPROVED",
              },
            },
          },
          orderBy: { name: "asc" },
          take: limit,
        });
        return { ...ft, categories };
      })
    );
    return { fileTypes: fileTypesWithCategories, totalCount };
  }

  return { fileTypes, totalCount };
};

export const createFileTypeService = async (body: any) => {
  const {
    name,
    icon,
    image,
    collection_image,
    video,
    status,
    supported_file_extension,
  } = body;

  const slug = generateSlugFromName(name);

  // Check duplicate slug
  const existingSlug = await prisma.fileType.findUnique({ where: { slug } });
  if (existingSlug) {
    throw new ConflictException("File type name already exists");
  }

  const newFileType = await prisma.fileType.create({
    data: {
      name,
      slug,
      icon,
      image,
      collectionImage: collection_image,
      video,
      status,
      supportedFileExtension: supported_file_extension,
    },
  });

  return newFileType;
};

export const updateFileTypeService = async (id: string, body: any) => {
  const {
    name,
    icon,
    image,
    collection_image,
    video,
    status,
    supported_file_extension,
  } = body;

  const existingFileType = await prisma.fileType.findUnique({ where: { id } });
  if (!existingFileType) {
    throw new NotFoundException("File type not found");
  }

  let slug = existingFileType.slug;

  if (name && name !== existingFileType.name) {
    slug = generateSlugFromName(name);
    const checkSlug = await prisma.fileType.findUnique({ where: { slug } });
    if (checkSlug && checkSlug.id !== id) {
      throw new ConflictException("File type name already exists");
    }
  }

  // Handle Image Deletion for collection_image
  if (collection_image && collection_image !== existingFileType.collectionImage) {
    if (existingFileType.collectionImage) {
      const publicId = extractPublicIdFromUrl(existingFileType.collectionImage);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch((err) =>
          console.error("Failed to delete old collection image", err),
        );
      }
    }
  }

  // Handle Image Deletion for image
  if (image && image !== existingFileType.image) {
    if (existingFileType.image) {
      const publicId = extractPublicIdFromUrl(existingFileType.image);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch((err) =>
          console.error("Failed to delete old image", err),
        );
      }
    }
  }

  // Handle Image Deletion for icon
  if (icon && icon !== existingFileType.icon) {
    if (existingFileType.icon) {
      const publicId = extractPublicIdFromUrl(existingFileType.icon);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch((err) =>
          console.error("Failed to delete old icon", err),
        );
      }
    }
  }

  const updatedFileType = await prisma.fileType.update({
    where: { id },
    data: {
      name,
      slug,
      icon,
      image,
      collectionImage: collection_image,
      video,
      status,
      supportedFileExtension: supported_file_extension,
    },
  });

  return updatedFileType;
};

export const deleteFileTypeService = async (id: string) => {
  const existingFileType = await prisma.fileType.findUnique({ where: { id } });
  if (!existingFileType) {
    throw new NotFoundException("File type not found");
  }

  // Delete all associated images
  if (existingFileType.collectionImage) {
    const publicId = extractPublicIdFromUrl(existingFileType.collectionImage);
    if (publicId) {
       await deleteFromCloudinary(publicId).catch((err) =>
        console.error("Failed to delete collection image on delete", err),
      );
    }
  }

  if (existingFileType.image) {
    const publicId = extractPublicIdFromUrl(existingFileType.image);
    if (publicId) {
       await deleteFromCloudinary(publicId).catch((err) =>
        console.error("Failed to delete image on delete", err),
      );
    }
  }

  if (existingFileType.icon) {
    const publicId = extractPublicIdFromUrl(existingFileType.icon);
    if (publicId) {
       await deleteFromCloudinary(publicId).catch((err) =>
        console.error("Failed to delete icon on delete", err),
      );
    }
  }

  await prisma.fileType.delete({ where: { id } });
  return true;
};
