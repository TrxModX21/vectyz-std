import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { auth } from "../lib/auth";
import { generateSecurePassword, generateUsername } from "../utils/helper";

interface GetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllUsersService = async ({
  page = 1,
  limit = 10,
  search,
}: GetAllUsersParams) => {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    role: "user",
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        role: true,
        banned: true,
        createdAt: true,
        emailVerified: true,
        totalFollowers: true,
        totalFollowing: true,
        _count: {
          select: { uploadedStocks: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const mappedUsers = users.map((user) => ({
    ...user,
    totalUploadedStocks: user._count.uploadedStocks,
    _count: undefined,
  }));

  return {
    users: mappedUsers,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
};

export const banUserService = async (
  userId: string,
  adminId: string,
  banReason?: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  const isBanning = !user.banned;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        banned: isBanning,
        banReason: isBanning ? banReason : null,
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: adminId, // The admin performing the action
        action: isBanning ? "BAN_USER" : "UNBAN_USER",
        metadata: {
          targetUserId: userId,
          reason: banReason,
          timestamp: new Date(),
        },
      },
    }),
  ]);

  return { isBanning };
};

export const getUserByIdService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      banned: true,
      createdAt: true,
      emailVerified: true,
      totalFollowers: true,
      totalFollowing: true,
      _count: {
        select: { uploadedStocks: true },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const mappedUser = {
    ...user,
    totalUploadedStocks: user._count.uploadedStocks,
    _count: undefined,
  };

  return mappedUser;
};

export const getMeService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      _count: {
        select: {
          uploadedStocks: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateMeService = async (
  userId: string,
  data: {
    name?: string;
    username?: string;
    image?: string;
    mobile?: string;
    dialCode?: string;
    countryCode?: string;
    countryName?: string;
    city?: string;
    state?: string;
    zip?: string;
    address?: string;
  },
) => {
  const {
    name,
    username,
    image,
    mobile,
    dialCode,
    countryCode,
    countryName,
    city,
    state,
    zip,
    address,
  } = data;

  // Check if username is taken
  if (username) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser && existingUser.id !== userId) {
      throw new Error("Username is already taken");
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      username,
      image,
      profile: {
        upsert: {
          create: {
            mobile,
            dialCode,
            countryCode,
            countryName,
            city,
            state,
            zip,
            address,
          },
          update: {
            mobile,
            dialCode,
            countryCode,
            countryName,
            city,
            state,
            zip,
            address,
          },
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return user;
};

export const deleteMeService = async (userId: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  // Delete user (cascade will handle related data)
  await prisma.user.delete({ where: { id: userId } });

  return true;
};

export const createUserService = async (input: {
  name: string;
  email: string;
  role: string;
}) => {
  const { name, email, role } = input;
  const password = generateSecurePassword(); // Default random password
  const username = generateUsername(name);

  // Use better-auth API to create user
  // We pass empty headers/req to ensure we don't accidentally attach session to current request
  // or rely on current request headers.
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      username,
    },
  });

  // b-auth signUp doesn't allow setting role directly for security (usually).
  // We update it manually after creation since we are in admin context.
  if (result.user) {
    await prisma.user.update({
      where: { id: result.user.id },
      data: { role: role },
    });
  }

  return result.user;
};
