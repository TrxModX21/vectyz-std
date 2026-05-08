import { deleteFromCloudinary } from "../lib/cloudinary";
import prisma from "../lib/prisma";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { extractPublicIdFromUrl } from "../utils/cloudinary.utils";
import {
  UpdateAvatarAndBannerSchema,
  UpdateProfileBioShcema,
} from "../validation/profile.validation";

export const updateProfileImageService = async (
  userId: string,
  body: UpdateAvatarAndBannerSchema,
) => {
  const { image } = body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (image !== undefined && image !== user.image) {
    if (user.image) {
      const publicId = extractPublicIdFromUrl(user.image);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch((err) =>
          console.error("Failed to delete old image", err),
        );
      }
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      image,
    },
  });

  return true;
};

export const updateProfileBannerService = async (
  userId: string,
  body: UpdateAvatarAndBannerSchema,
) => {
  const { image } = body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (image !== undefined && image !== user.banner) {
    if (user.banner) {
      const publicId = extractPublicIdFromUrl(user.banner);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch((err) =>
          console.error("Failed to delete old image", err),
        );
      }
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      banner: image,
    },
  });

  return true;
};

export const updateProfileBioService = async (
  userId: string,
  body: UpdateProfileBioShcema,
) => {
  const { name, username, mobile, address, city, state, country, zip } = body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (username) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException("Username is already taken");
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      username,
      profile: {
        upsert: {
          create: {
            mobile,
            city,
            state,
            countryName: country,
            zip,
            address,
          },
          update: {
            mobile,
            city,
            state,
            countryName: country,
            zip,
            address,
          },
        },
      },
    },
  });

  return true;
};

export const checkUsernameAvailabilityService = async (
  userId: string,
  username: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser && existingUser.id !== userId) {
    return { available: false };
  }

  return { available: true };
};

export const updateNewsletterService = async (
  userId: string,
  newsletter: boolean,
) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        upsert: {
          create: { newsletter },
          update: { newsletter },
        },
      },
    },
  });
  return true;
};
