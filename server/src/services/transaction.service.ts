import prisma from "../lib/prisma";
import { polar } from "../lib/polar";
import { createSnapTransaction, verifySignatureKey } from "../lib/midtrans";
import { NotFoundException, BadRequestException } from "../utils/app-error";
import {
  TransactionType,
  PaymentStatus,
  Prisma,
  PayoutStatus,
  NotificationType,
  Currency,
} from "../generated/prisma/client";
import { config } from "../utils/app.config";
import { convertCentToUsd, convertRealCurrencyToCredit } from "../utils/helper";
import { createNotification } from "./notification.service";

// 6. FIND ALL TRANSACTIONS (Admin)
export const findAllTransactions = async (query: any) => {
  const { page = 1, limit = 10, status, type, paymentMethod, search } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  if (status) where.status = status;
  if (type) where.type = type;
  if (paymentMethod) where.paymentMethod = paymentMethod;
  if (search) {
    where.OR = [
      { id: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [transactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    totalCount,
    totalPages: Math.ceil(totalCount / Number(limit)),
  };
};

// 7. FIND USER TRANSACTIONS
export const findUserTransactions = async (userId: string, query: any) => {
  const { page = 1, limit = 10, status, type } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = { userId };
  if (status) where.status = status;
  if (type) where.type = type;

  const [transactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        stock: { select: { title: true } },
        plan: { select: { name: true } },
        targetUser: { select: { name: true } },
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    totalCount,
    totalPages: Math.ceil(totalCount / Number(limit)),
  };
};

// 8. FIND ONE TRANSACTION
export const findOneTransaction = async (transactionId: string) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      plan: true,
      stock: { select: { id: true, title: true, slug: true } },
    },
  });

  if (!transaction) throw new NotFoundException("Transaction not found");

  return transaction;
};

// 9. GET EARNINGS OVERVIEW
export const getEarningsOverviewService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditBalance: true, earnedCredit: true },
  });

  if (!user) throw new NotFoundException("User not found");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  // Tanggal 1 bulan depan
  const nextPayoutDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // This Month Direct Earnings
  const thisMonthTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: {
        in: [TransactionType.EARNING_ASSET, TransactionType.EARNING_DONATION],
      },
      status: PaymentStatus.PAID,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  const thisMonthEarnings = thisMonthTransactions.reduce(
    (sum, t) => sum + Number(t.creditAmount || 0),
    0,
  );

  // Estimasi Pool Distribution
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const monthlyPool = await prisma.monthlyPool.findUnique({
    where: {
      month_year: {
        month: currentMonth,
        year: currentYear,
      },
    },
  });

  let estimatedPoolShare = 0;

  if (monthlyPool) {
    // Cari total download global bulan ini
    const globalPremiumDownloads = await prisma.downloadHistory.count({
      where: {
        isCountedForPool: true,
        isStockPremium: true,
        downloadDate: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const globalFreeDownloads = await prisma.downloadHistory.count({
      where: {
        isCountedForPool: true,
        isStockPremium: false,
        downloadDate: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    // Cari total download milik user ini
    const userPremiumDownloads = await prisma.downloadHistory.count({
      where: {
        stock: { userId: userId },
        isCountedForPool: true,
        isStockPremium: true,
        downloadDate: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const userFreeDownloads = await prisma.downloadHistory.count({
      where: {
        stock: { userId: userId },
        isCountedForPool: true,
        isStockPremium: false,
        downloadDate: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const premiumPool = Number(monthlyPool.premiumPoolAmount);
    const freePool = Number(monthlyPool.freePoolAmount);

    const userPremiumShare =
      globalPremiumDownloads > 0
        ? (userPremiumDownloads / globalPremiumDownloads) * premiumPool
        : 0;

    const userFreeShare =
      globalFreeDownloads > 0
        ? (userFreeDownloads / globalFreeDownloads) * freePool
        : 0;

    // Convert share from IDR to Credit (1 Credit = Rp 1000)
    estimatedPoolShare = (userPremiumShare + userFreeShare) / 1000;
  }

  return {
    totalBalance: Number(user.creditBalance),
    withdrawableBalance: Number(user.earnedCredit),
    thisMonthEarnings,
    estimatedPoolShare,
    nextPayoutDate: nextPayoutDate.toISOString(),
  };
};

// 10. GET EARNINGS HISTORY
export const getEarningsHistoryService = async (userId: string, query: any) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: Prisma.TransactionWhereInput = {
    OR: [
      {
        userId,
        type: {
          in: [
            TransactionType.EARNING_ASSET,
            TransactionType.POOL_EARNING,
            TransactionType.EARNING_DONATION,
          ],
        },
      },
      {
        userId: userId,
        type: TransactionType.WITHDRAWAL,
      },
    ],
  };

  const [history, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        user: { select: { name: true } },
        targetUser: { select: { name: true } },
        stock: { select: { title: true } },
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    history,
    totalCount,
    totalPages: Math.ceil(totalCount / Number(limit)),
    currentPage: Number(page),
  };
};

// 11. REQUEST PAYOUT
export const requestPayoutService = async (
  userId: string,
  data: {
    amountCredit: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  },
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    const amountToWithdraw = Number(data.amountCredit);

    if (amountToWithdraw < 250) {
      throw new BadRequestException("Minimum payout is 250 Credits");
    }

    if (Number(user.earnedCredit) < amountToWithdraw) {
      throw new BadRequestException("Insufficient withdrawable balance");
    }

    // 1. Potong saldo user
    await tx.user.update({
      where: { id: userId },
      data: {
        creditBalance: { decrement: amountToWithdraw }, // Kurangi total saldo tampilan
        earnedCredit: { decrement: amountToWithdraw }, // Kurangi saldo bisa ditarik
      },
    });

    const exchangeRate = 1000;
    const totalAmountIdr = amountToWithdraw * exchangeRate;

    // 2. Buat Payout Request
    const payout = await tx.payout.create({
      data: {
        userId,
        amountCredit: amountToWithdraw,
        exchangeRate,
        totalAmountIdr,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountHolder: data.accountHolder,
        status: PayoutStatus.REQUESTED,
      },
    });

    // 3. Buat Transaksi WITHDRAWAL
    await tx.transaction.create({
      data: {
        userId,
        type: TransactionType.WITHDRAWAL,
        amount: totalAmountIdr,
        creditAmount: -amountToWithdraw,
        status: PaymentStatus.PENDING,
        paymentMethod: "BANK_TRANSFER",
      },
    });

    return payout;
  });
};
