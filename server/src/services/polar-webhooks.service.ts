import { Order } from "@polar-sh/sdk/dist/commonjs/models/components/order";
import {
  Currency,
  NotificationType,
  PaymentStatus,
  TransactionType,
} from "../generated/prisma/enums";
import prisma from "../lib/prisma";
import {
  convertCentToUsd,
  convertCreditToRealCurrency,
  convertRealCurrencyToCredit,
} from "../utils/helper";
import { Prisma } from "../generated/prisma/client";
import { createNotification } from "./notification.service";
import { config } from "../utils/app.config";

export type TransactionWithDetails = Prisma.TransactionGetPayload<{
  include: { user: true; plan: true };
}>;

export const handlePolarWebhookEventService = async (payload: any) => {
  const polarPayloadType = payload.type;
  const polarPayloadData = payload.data;

  if (polarPayloadType === "order.paid") {
    const transactionId = polarPayloadData.metadata?.transactionId;
    if (!transactionId) {
      console.warn("Polar Webhook: No transactionId found in metadata");
      return;
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true, plan: true },
    });
    if (!transaction) return;
    if (
      transaction.status === PaymentStatus.PAID &&
      polarPayloadData.billing_reason !== "subscription_cycle"
    ) {
      return; // Already processed or not found
    }

    if (transaction.type === TransactionType.TOPUP_CREDIT) {
      await handleTopUpService(polarPayloadData, transaction);
    } else if (transaction.type === TransactionType.DONATION) {
      await handleDonationService(polarPayloadData, transaction);
    } else if (
      transaction.type === TransactionType.SUBSCRIPTION &&
      transaction.planId &&
      transaction.user &&
      transaction.plan
    ) {
      await handleSubscriptionService(polarPayloadData, transaction);
    } else if (
      transaction.type === TransactionType.BUY_ASSET &&
      transaction.stockId
    ) {
      await handleBuyPremiumAssetService(transaction);
    }
  }
};

const handleTopUpService = async (
  polarPayloadData: Order,
  transaction: TransactionWithDetails,
) => {
  await prisma.$transaction(async (tx) => {
    const actualUsdCents =
      polarPayloadData.subtotalAmount || transaction.amount;
    const actualUsdPaid = convertCentToUsd(actualUsdCents);
    const actualCreditAmount = convertRealCurrencyToCredit(
      actualUsdPaid,
      "USD",
    );
    const finalCredit = Math.floor(actualCreditAmount);

    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.PAID,
        amount: actualUsdCents,
        amountCurrency: Currency.USD,
        creditAmount: finalCredit,
        paymentMethod: "polar",
      },
    });

    await tx.user.update({
      where: { id: transaction.userId },
      data: {
        creditBalance: { increment: finalCredit },
        purchasedCredit: { increment: finalCredit },
      },
    });
  });
};

const handleDonationService = async (
  polarPayloadData: Order,
  transaction: TransactionWithDetails,
) => {
  // Menggunakan database transaction agar jika terjadi error, data tidak tersimpan setengah jalan
  await prisma.$transaction(async (tx) => {
    // 1. Hitung total bayar berdasarkan payload asli Polar (dalam cents)
    const actualUsdCents =
      polarPayloadData.subtotalAmount || transaction.amount;
    const actualUsdPaid = convertCentToUsd(actualUsdCents); // Konversi cents ke hitungan Dolar biasa
    const actualCreditAmount = convertRealCurrencyToCredit(
      actualUsdPaid,
      "USD",
    );

    // 2. Update status Transaksi Pembeli menjadi PAID
    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.PAID,
        amount: actualUsdCents, // Simpan dalam format cents sesuai standar DB
        creditAmount: actualCreditAmount,
      },
    });

    // 3. Distribusi Bagi Hasil (Revenue Share)
    // 88% masuk ke Kreator, sisa 12% diambil Platform/Admin (karena fee gateway Polar sedikit lebih mahal)
    const creatorShareCredit = actualCreditAmount * 0.88;
    const platformShare = actualCreditAmount - creatorShareCredit;

    // 4. Tambahkan saldo (Earned Credit) ke Target User (Kreator)
    await tx.user.update({
      where: { id: transaction.targetUserId! },
      data: {
        creditBalance: { increment: creatorShareCredit },
        earnedCredit: { increment: creatorShareCredit },
      },
    });

    // 5. Pencatatan Histori Transaksi Pendapatan (Untuk Kreator)
    await tx.transaction.create({
      data: {
        userId: transaction.targetUserId!,
        targetUserId: transaction.userId, // Yang mendonasi
        stockId: transaction.stockId,
        type: TransactionType.EARNING_DONATION,
        status: PaymentStatus.PAID,
        amount: Math.round(
          convertCreditToRealCurrency(creatorShareCredit, "USD") * 100,
        ),
        amountCurrency: "USD",
        creditAmount: creatorShareCredit,
        paymentMethod: "SYSTEM",
        externalId: transaction.externalId,
      },
    });

    // 6. Ambil detail Donatur dan Kreator untuk Notifikasi
    const donator = await tx.user.findUnique({
      where: { id: transaction.userId },
    });
    const targetUser = await tx.user.findUnique({
      where: { id: transaction.targetUserId! },
    });

    // 7. Kirim Notifikasi Donasi ke Kreator
    if (donator && targetUser) {
      await createNotification({
        userId: transaction.targetUserId!,
        type: NotificationType.DONATION_RECEIVED,
        title: "New Coffee! ☕",
        message: `${donator.name} gave you ${creatorShareCredit} credits!`,
        sourceUserId: donator.id,
        recipientEmail: targetUser.email,
      });
    }

    // 8. Tambahkan saldo fee ke akun Platform/Admin (jika ID di-set di config)
    if (config.PLATFORM_FEE_USER_ID) {
      await tx.user.update({
        where: { id: config.PLATFORM_FEE_USER_ID },
        data: {
          creditBalance: { increment: platformShare },
          earnedCredit: { increment: platformShare },
        },
      });

      // 9. Pencatatan Histori Transaksi untuk Platform Fee
      await tx.transaction.create({
        data: {
          userId: config.PLATFORM_FEE_USER_ID,
          targetUserId: transaction.targetUserId!,
          stockId: transaction.stockId,
          type: TransactionType.PLATFORM_FEE,
          status: PaymentStatus.PAID,
          amount: Math.round(
            convertCreditToRealCurrency(platformShare, "USD") * 100, // Simpan dalam bentuk cents
          ),
          amountCurrency: "USD",
          creditAmount: platformShare,
          paymentMethod: "SYSTEM",
          externalId: transaction.externalId,
        },
      });
    }
  });
};

const handleSubscriptionService = async (
  polarPayloadData: Order,
  transaction: TransactionWithDetails,
) => {
  await prisma.$transaction(async (tx) => {
    const user = transaction.user;
    const plan = transaction.plan;
    const now = new Date();
    const activeDays = transaction.periodDays || 30; // Fallback 30

    if (polarPayloadData.billingReason === "subscription_cycle") {
      // Create a new transaction record for this month's renewal payment
      await tx.transaction.create({
        data: {
          userId: transaction.userId,
          type: TransactionType.SUBSCRIPTION,
          amount: polarPayloadData.subtotalAmount || transaction.amount,
          creditAmount: transaction.creditAmount,
          planId: transaction.planId,
          status: PaymentStatus.PAID,
          billingCycle: transaction.billingCycle,
          periodDays: transaction.periodDays,
          paymentMethod: "polar",
          externalId: polarPayloadData.id, // order id from polar
        },
      });
    } else {
      // Update initial transaction
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: PaymentStatus.PAID,
          paymentMethod: "polar",
        },
      });
    }

    // Calculate Expiry Date (Extend if active, Reset if expired)
    let subscriptionExpiresAt = new Date(now);
    if (user.subscriptionExpiresAt && user.subscriptionExpiresAt > now) {
      subscriptionExpiresAt = new Date(user.subscriptionExpiresAt);
      subscriptionExpiresAt.setDate(
        subscriptionExpiresAt.getDate() + activeDays,
      );
    } else {
      subscriptionExpiresAt.setDate(now.getDate() + activeDays);
    }

    // Calculate Next Quota Reset (Always Monthly for Quota, but capped at expiry)
    let nextQuotaReset = new Date(now);
    nextQuotaReset.setMonth(now.getMonth() + 1);
    if (nextQuotaReset > subscriptionExpiresAt) {
      nextQuotaReset = new Date(subscriptionExpiresAt);
    }

    await tx.user.update({
      where: { id: user.id },
      data: {
        isPremium: true,
        planId: plan?.id,
        billingCycle: transaction.billingCycle || "MONTHLY",
        subscriptionExpiresAt: subscriptionExpiresAt,
        premiumQuota: plan?.premiumQuota,
        premiumQuotaResetDate: nextQuotaReset,
      },
    });

    // --- MONTHLY POOL DISTRIBUTION ---
    const baseCredit = Number(transaction.creditAmount || 0);
    const premiumShare = baseCredit * 0.5;
    const freeShare = baseCredit * 0.1;

    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    await tx.monthlyPool.upsert({
      where: {
        month_year: {
          month: currentMonth,
          year: currentYear,
        },
      },
      update: {
        premiumPoolAmount: { increment: premiumShare },
        freePoolAmount: { increment: freeShare },
      },
      create: {
        month: currentMonth,
        year: currentYear,
        premiumPoolAmount: premiumShare,
        freePoolAmount: freeShare,
      },
    });
  });
};

const handleBuyPremiumAssetService = async (
  transaction: TransactionWithDetails,
) => {
  await prisma.$transaction(async (tx) => {
    const stock = await tx.stock.findUnique({
      where: { id: transaction.stockId! },
    });

    if (stock) {
      const priceInCredit = Number(stock.price);
      const creditAmount = Number(transaction.creditAmount) || priceInCredit;

      // 1. Update Transaction menjadi PAID dan catat paymentMethod
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: PaymentStatus.PAID,
          paymentMethod: "polar",
        },
      });

      // 2. Kalkulasi Distribusi Revenue (75% Creator, 25% Platform)
      const creatorShareCredit = creditAmount * 0.75;
      const platformShare = creditAmount - creatorShareCredit;

      // 3. Tambah kredit ke Creator
      await tx.user.update({
        where: { id: stock.userId },
        data: {
          creditBalance: { increment: creatorShareCredit },
          earnedCredit: { increment: creatorShareCredit },
        },
      });

      // 4. Catat transaksi penerimaan (EARNING_ASSET) untuk Creator
      await tx.transaction.create({
        data: {
          userId: stock.userId,
          targetUserId: transaction.userId,
          stockId: stock.id,
          type: TransactionType.EARNING_ASSET,
          status: PaymentStatus.PAID,
          amount:
            transaction.amountCurrency === "IDR"
              ? convertCreditToRealCurrency(creatorShareCredit, "IDR")
              : Math.round(
                  convertCreditToRealCurrency(creatorShareCredit, "USD") * 100,
                ),
          amountCurrency: transaction.amountCurrency,
          creditAmount: creatorShareCredit,
          paymentMethod: "SYSTEM",
          externalId: transaction.externalId,
        },
      });

      // 5. Kirim notifikasi penjualan ke Creator
      const creator = await tx.user.findUnique({
        where: { id: stock.userId },
      });
      await createNotification({
        userId: stock.userId,
        type: NotificationType.ASSET_SOLD,
        title: "Asset Sold! 🎉",
        message: `Someone just purchased "${stock.title}". You earned ${creatorShareCredit} credits.`,
        sourceUserId: transaction.userId,
        stockId: stock.id,
        recipientEmail: creator?.email,
      });

      // 6. Tambah kredit ke Platform & Catat transaksi PLATFORM_FEE
      if (config.PLATFORM_FEE_USER_ID) {
        await tx.user.update({
          where: { id: config.PLATFORM_FEE_USER_ID },
          data: {
            creditBalance: { increment: platformShare },
            earnedCredit: { increment: platformShare },
          },
        });

        await tx.transaction.create({
          data: {
            userId: config.PLATFORM_FEE_USER_ID,
            targetUserId: stock.userId,
            stockId: stock.id,
            type: TransactionType.PLATFORM_FEE,
            status: PaymentStatus.PAID,
            amount:
              transaction.amountCurrency === "IDR"
                ? convertCreditToRealCurrency(platformShare, "IDR")
                : Math.round(
                    convertCreditToRealCurrency(platformShare, "USD") * 100,
                  ),
            amountCurrency: transaction.amountCurrency,
            creditAmount: platformShare,
            paymentMethod: "SYSTEM",
            externalId: transaction.externalId,
          },
        });
      }
    }
  });
};
