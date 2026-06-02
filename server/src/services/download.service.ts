import {
  TransactionType,
  PaymentStatus,
  Prisma,
} from "../generated/prisma/client";
import prisma from "../lib/prisma";
import {
  AppError,
  ForbiddenException,
  NotFoundException,
} from "../utils/app-error";
import { getFileStream } from "../lib/r2";
// @ts-ignore
import archiver from "archiver";
import { GetMyDownloadHistorySchema } from "../validation/download.validation";

export const validateDownloadAccess = async (
  userId: string,
  stockId: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  });

  const stock = await prisma.stock.findUnique({
    where: { id: stockId },
    include: { files: true },
  });

  if (!user || !stock) {
    throw new NotFoundException("User or Stock not found");
  }

  // 0. Cek apakah user sudah pernah mendownload aset ini
  const downloadHistory = await prisma.downloadHistory.findFirst({
    where: { stockId, userId },
  });

  if (downloadHistory) {
    return {
      allowed: true,
      quotaDeduction: false,
      reason: "PREVIOUSLY_DOWNLOADED",
    };
  }

  // 0. Admin & Reviewer Bypass
  if (user.role === "admin" || user.role === "reviewer") {
    return {
      allowed: true,
      quotaDeduction: false,
      reason: "ADMIN_ACCESS",
    };
  }

  // 0.1 Owner bypass
  if (user.id === stock.userId) {
    return {
      allowed: true,
      quotaDeduction: false,
      reason: "OWNER_ACCESS",
    };
  }

  // 1. Cek User Anonim
  if (user.isAnonymous) {
    if (stock.isPremium) {
      throw new ForbiddenException(
        "Premium assets are for registered members only. Please sign up.",
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const downloadCount = await prisma.downloadHistory.count({
      where: {
        userId: user.id,
        downloadDate: {
          gte: today,
        },
      },
    });

    const remainingLimit = Math.max(0, 3 - downloadCount);

    if (downloadCount >= 3) {
      throw new ForbiddenException("ANONYMOUS_LIMIT_REACHED");
    }

    return {
      allowed: true,
      quotaDeduction: false,
      reason: "ANONYMOUS_FREE",
      remainingLimit,
    };
  }

  // 2. Cek Apakah User Pernah Beli Putus (Direct Purchase)
  const hasPurchased = await prisma.transaction.findFirst({
    where: {
      userId: user.id,
      stockId: stock.id,
      type: TransactionType.BUY_ASSET,
      status: PaymentStatus.PAID,
    },
  });
  if (hasPurchased) {
    return { allowed: true, quotaDeduction: false, reason: "PURCHASED" };
  }

  // 2. Jika Stock FREE
  if (!stock.isPremium) {
    // User Premium -> Unlimited Free Stock
    if (user.isPremium) {
      return {
        allowed: true,
        quotaDeduction: false,
        reason: "PREMIUM_FREE_UNLIMITED",
      };
    }

    const remainingLimit = Math.max(0, 10 - user.dailyFreeDownloadCount);

    // User Free -> Cek Limit Harian
    if (user.dailyFreeDownloadCount >= 10) {
      throw new ForbiddenException(
        "Daily free download limit reached (10/10). Upgrade to Premium for unlimited access.",
      );
    }

    return {
      allowed: true,
      quotaDeduction: false,
      reason: "FREE_DAILY_QUOTA",
      remainingLimit,
    };
  }

  // 3. Jika Stock PREMIUM
  if (stock.isPremium) {
    // User Premium wajib
    if (!user.isPremium || !user.plan) {
      throw new ForbiddenException(
        "This is a Premium asset. Please upgrade your plan or buy it directly.",
      );
    }

    // Cek apakah stock ini bisa didownload via Subscription?
    if (!stock.isSubscriptionAccessible) {
      throw new ForbiddenException(
        "This exclusive asset is available for Direct Purchase only.",
      );
    }

    // Cek Kuota Premium User
    const remainingLimit = user.premiumQuota;

    if (user.premiumQuota <= 0) {
      throw new ForbiddenException(
        "Your premium download quota for this month is exhausted.",
      );
    }

    return {
      allowed: true,
      quotaDeduction: true,
      reason: "PREMIUM_QUOTA",
      remainingLimit,
    };
  }

  throw new ForbiddenException("Access denied.");
};

export const recordDownloadHistory = async (
  userId: string,
  stockId: string,
  reason: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const stock = await prisma.stock.findUnique({ where: { id: stockId } });

  if (!user || !stock) return;

  // Cek apakah sudah download hari ini? (Supaya tidak catat history double & potong kuota double untuk file yang sama)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingHistory = await prisma.downloadHistory.findFirst({
    where: {
      userId,
      stockId,
      downloadDate: {
        gte: today,
      },
    },
  });

  // Jika sudah pernah download hari ini, skip recording & deduction
  // Jika sudah pernah download, tidak perlu memotong kuota dan menambah history
  if (reason === "PREVIOUSLY_DOWNLOADED") {
    return;
  }

  // Jika sudah pernah download hari ini (dari check sebelumnya yang lolos), skip recording & deduction
  if (existingHistory) {
    return;
  }

  // Jika Admin/Reviewer, skip recording
  if (reason === "ADMIN_ACCESS") {
    return;
  }

  if (reason === "OWNER_ACCESS") {
    return;
  }

  // Transaction untuk History & Deduksi
  await prisma.$transaction(async (tx) => {
    // 1. Deduksi Kuota / Limit
    if (reason === "FREE_DAILY_QUOTA") {
      await tx.user.update({
        where: { id: userId },
        data: { dailyFreeDownloadCount: { increment: 1 } },
      });
    } else if (reason === "PREMIUM_QUOTA") {
      await tx.user.update({
        where: { id: userId },
        data: { premiumQuota: { decrement: 1 } },
      });
    }

    // 2. Catat History & Increment Total Downloads
    await tx.downloadHistory.create({
      data: {
        userId,
        stockId,
        isUserPremium: user.isPremium,
        userPlanId: user.planId,
        isStockPremium: stock.isPremium,
        isCountedForPool:
          reason === "PREMIUM_QUOTA" || reason === "PREMIUM_FREE_UNLIMITED", // Logic untuk revenue share
      },
    });

    // 3. Increment Counter Stock
    await tx.stock.update({
      where: { id: stockId },
      data: { totalDownloads: { increment: 1 } },
    });
  });
};

export const createStockZipStream = async (stockId: string) => {
  const stock = await prisma.stock.findUnique({
    where: { id: stockId },
    include: { files: true, user: true },
  });

  if (!stock) throw new NotFoundException("Stock not found");

  const originalFiles = stock.files.filter((f) => f.purpose === "ORIGINAL");
  if (originalFiles.length === 0) {
    throw new NotFoundException("Original files not found");
  }

  // Init Archiver
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Max compression
  });

  // 1. Add Original File from R2
  try {
    for (let i = 0; i < originalFiles.length; i++) {
      const file = originalFiles[i];
      const r2Stream = await getFileStream(file.publicId);
      // Penamaan dinamis/aman
      const nameInZip =
        originalFiles.length > 1
          ? `${stock.slug}-${file.format || "file"}-${i + 1}.${file.format}`
          : // atau cukup opsi sederhana: `${stock.slug}-${i + 1}.${file.format}`
            `${stock.slug}.${file.format}`;
      archive.append(r2Stream, { name: nameInZip });
    }
  } catch (error) {
    console.error("Error streaming from R2:", error);
    throw new AppError("Failed to retrieve file from storage", 500);
  }

  // 2. Add License File (Text)
  const licenseText = `
    LICENSE AGREEMENT
    -----------------
    Title: ${stock.title}
    Creator: ${stock.user.name}
    Source: Vectyz.com
    License Type: ${stock.isPremium ? "Premium License" : "Free License"}
    
    You are allowed to use this asset for personal and commercial projects.
    You are NOT allowed to resell, redistribute, or sub-license this asset.
  `;
  archive.append(licenseText, { name: "LICENSE.txt" });

  // Finalize (This starts the stream flow)
  archive.finalize();

  return {
    stream: archive,
    filename: `${stock.slug}.zip`,
  };
};

export const checkStockAccess = async (userId: string, stockId: string) => {
  const result = await validateDownloadAccess(userId, stockId).catch((err) => {
    // If validate throws Forbidden/NotFound, it means NO ACCESS.
    // We want to return status, not throw error for this check endpoint.
    return { allowed: false, reason: err.message, code: err.statusCode };
  });

  // validateDownloadAccess returns { allowed: true, ... } if success.
  // If it returned object, it means allowed.
  if ((result as any).allowed) {
    return result;
  }

  return { allowed: false, reason: "Access denied", code: 403 };
};

export const getDownloadHistoryService = async (
  userId: string,
  input: GetMyDownloadHistorySchema,
) => {
  const { page, limit, search } = input;

  const where: Prisma.DownloadHistoryWhereInput = { userId };

  if (search) {
    where.stock = {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { keywords: { has: search } },
      ],
    };
  }

  const [history, totalCount] = await Promise.all([
    prisma.downloadHistory.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        downloadDate: "desc",
      },
      include: {
        stock: {
          select: {
            id: true,
            title: true,
            slug: true,
            isPremium: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            files: {
              select: {
                id: true,
                url: true,
                purpose: true,
                publicId: true,
                format: true,
                bytes: true,
              },
            },
          },
        },
      },
    }),
    prisma.downloadHistory.count({ where }),
  ]);

  return {
    history,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
};
