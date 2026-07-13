import {
  NotificationType,
  PaymentStatus,
  TransactionType,
} from "../generated/prisma/enums";
import { verifySignatureKey } from "../lib/midtrans";
import prisma from "../lib/prisma";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { config } from "../utils/app.config";
import { convertCreditToRealCurrency } from "../utils/helper";
import { createNotification } from "./notification.service";
import { Prisma } from "../generated/prisma/client";

export type TransactionWithDetails = Prisma.TransactionGetPayload<{
  include: { user: true; plan: true };
}>;

export const midtransWebhookService = async (notificationBody: any) => {
  const isValidSignature = verifySignatureKey(notificationBody);
  if (!isValidSignature) {
    throw new BadRequestException("Invalid Signature Key");
  }

  const orderId = notificationBody.order_id;
  const transactionStatus = notificationBody.transaction_status;
  const fraudStatus = notificationBody.fraud_status;

  let newStatus: PaymentStatus = PaymentStatus.PENDING;
  if (transactionStatus == "capture") {
    if (fraudStatus == "challenge") {
      newStatus = PaymentStatus.PENDING;
    } else if (fraudStatus == "accept") {
      newStatus = PaymentStatus.PAID;
    }
  } else if (transactionStatus == "settlement") {
    newStatus = PaymentStatus.PAID;
  } else if (
    transactionStatus == "cancel" ||
    transactionStatus == "deny" ||
    transactionStatus == "expire"
  ) {
    newStatus = PaymentStatus.FAILED;
  } else if (transactionStatus == "pending") {
    newStatus = PaymentStatus.PENDING;
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: orderId },
    include: { user: true, plan: true },
  });
  if (!transaction) {
    throw new NotFoundException(`Transaction ${orderId} not found`);
  }

  if (transaction.status === newStatus) {
    return { message: "Status unchanged" };
  }

  if (
    newStatus === PaymentStatus.PAID &&
    transaction.status !== PaymentStatus.PAID
  ) {
    if (transaction.type === TransactionType.TOPUP_CREDIT) {
      await handleTopUpService(transaction, notificationBody);
    } else if (transaction.type === TransactionType.SUBSCRIPTION) {
      await handleSubscriptionService(transaction, notificationBody);
    } else if (transaction.type === TransactionType.BUY_ASSET) {
      await handleBuyPremiumAssetService(transaction, notificationBody);
    } else if (transaction.type === TransactionType.DONATION) {
      await handleDonationService(transaction, notificationBody);
    } else {
      await updateTransactionStatus(
        transaction.id,
        newStatus,
        notificationBody.payment_type,
      );
    }
  } else {
    // Just update status for FAILED, PENDING, or unsupported types
    await updateTransactionStatus(
      transaction.id,
      newStatus,
      notificationBody.payment_type,
    );
  }

  return { message: "Transaction updated", status: newStatus };
};

const updateTransactionStatus = async (
  transactionId: string,
  status: PaymentStatus,
  paymentMethod: string,
) => {
  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status,
      paymentMethod,
    },
  });
};

const handleTopUpService = async (
  transaction: TransactionWithDetails,
  notificationBody: any,
) => {
  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.PAID,
        paymentMethod: notificationBody.payment_type,
      },
    });

    if (transaction.creditAmount) {
      await tx.user.update({
        where: { id: transaction.userId },
        data: {
          creditBalance: { increment: transaction.creditAmount },
          purchasedCredit: { increment: transaction.creditAmount },
        },
      });
    }
  });
};

const handleSubscriptionService = async (
  transaction: TransactionWithDetails,
  notificationBody: any,
) => {
  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.PAID,
        paymentMethod: notificationBody.payment_type,
      },
    });

    const user = transaction.user;
    const plan = transaction.plan;

    if (plan) {
      const now = new Date();
      const activeDays = transaction.periodDays || 30;

      let subscriptionExpiresAt = new Date(now);
      if (user.subscriptionExpiresAt && user.subscriptionExpiresAt > now) {
        subscriptionExpiresAt = new Date(user.subscriptionExpiresAt);
        subscriptionExpiresAt.setDate(
          subscriptionExpiresAt.getDate() + activeDays,
        );
      } else {
        subscriptionExpiresAt.setDate(now.getDate() + activeDays);
      }

      // Calculate Next Quota Reset
      let nextQuotaReset = new Date(now);
      nextQuotaReset.setMonth(now.getMonth() + 1);
      if (nextQuotaReset > subscriptionExpiresAt) {
        nextQuotaReset = new Date(subscriptionExpiresAt);
      }

      await tx.user.update({
        where: { id: user.id },
        data: {
          isPremium: true,
          planId: plan.id,
          billingCycle: transaction.billingCycle || "MONTHLY",
          subscriptionExpiresAt: subscriptionExpiresAt,
          premiumQuota: plan.premiumQuota,
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
    }
  });
};

const handleBuyPremiumAssetService = async (
  transaction: TransactionWithDetails,
  notificationBody: any,
) => {
  await prisma.$transaction(async (tx) => {
    // 1. Update Transaction to PAID
    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.PAID,
        paymentMethod: notificationBody.payment_type,
      },
    });

    if (transaction.stockId) {
      const stock = await tx.stock.findUnique({
        where: { id: transaction.stockId },
      });

      if (stock) {
        const priceInCredit = Number(stock.price);
        const creditAmount = Number(transaction.creditAmount) || priceInCredit;

        // Distribusi 75% Creator & 25% Platform
        const creatorShareCredit = creditAmount * 0.75;
        const platformShare = creditAmount - creatorShareCredit;

        // 2. Tambah Credit ke Creator
        await tx.user.update({
          where: { id: stock.userId },
          data: {
            creditBalance: { increment: creatorShareCredit },
            earnedCredit: { increment: creatorShareCredit },
          },
        });

        // 3. Catat Transaksi EARNING_ASSET untuk Creator
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
                    convertCreditToRealCurrency(creatorShareCredit, "USD") *
                      100,
                  ),
            amountCurrency: transaction.amountCurrency,
            creditAmount: creatorShareCredit,
            paymentMethod: "SYSTEM",
            externalId: transaction.externalId,
          },
        });

        // 4. Buat Notifikasi
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

        // 5. Tambah Credit ke Platform & Catat PLATFORM_FEE
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
    }
  });
};

const handleDonationService = async (
  transaction: TransactionWithDetails,
  notificationBody: any,
) => {
  // Menggunakan database transaction agar jika terjadi error, data tidak tersimpan setengah jalan
  await prisma.$transaction(async (tx) => {
    // 1. Ambil jumlah donasi dalam Rupiah asli dan hitung kreditnya
    const actualIdrPaid = Number(transaction.amount);
    // Jika tidak ada creditAmount di transaksi lama, kita hitung manual, tapi seharusnya sekarang ada
    const actualCreditAmount = transaction.creditAmount
      ? Number(transaction.creditAmount)
      : actualIdrPaid / 1000;

    // 2. Update status Transaksi Pembeli menjadi PAID
    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.PAID,
        paymentMethod: notificationBody.payment_type || "midtrans",
        creditAmount: actualCreditAmount, // Pastikan tersimpan dengan benar
      },
    });

    if (transaction.targetUserId) {
      const targetUser = await tx.user.findUnique({
        where: { id: transaction.targetUserId },
      });

      if (targetUser) {
        // 3. Distribusi Bagi Hasil (Revenue Share)
        // 95% masuk ke Kreator, sisa 5% diambil Platform/Admin (Midtrans fee lebih kecil dari Polar)
        const creatorShareCredit = actualCreditAmount * 0.95;
        const platformShare = actualCreditAmount - creatorShareCredit;

        // 4. Tambahkan saldo (Earned Credit) ke Target User (Kreator)
        await tx.user.update({
          where: { id: targetUser.id },
          data: {
            creditBalance: { increment: creatorShareCredit },
            earnedCredit: { increment: creatorShareCredit },
          },
        });

        // 5. Pencatatan Histori Transaksi Pendapatan (Untuk Kreator)
        await tx.transaction.create({
          data: {
            userId: targetUser.id,
            targetUserId: transaction.userId, // Yang mendonasi
            stockId: transaction.stockId,
            type: TransactionType.EARNING_DONATION,
            status: PaymentStatus.PAID,
            amount: Math.round(
              convertCreditToRealCurrency(creatorShareCredit, "IDR"),
            ),
            amountCurrency: "IDR",
            creditAmount: creatorShareCredit,
            paymentMethod: "SYSTEM",
            externalId: transaction.externalId,
          },
        });

        // 6. Kirim Notifikasi Donasi ke Kreator
        await createNotification({
          userId: targetUser.id,
          type: NotificationType.DONATION_RECEIVED,
          title: "You received a coffee! ☕",
          message: `Someone just sent you ${creatorShareCredit} credits.`,
          sourceUserId: transaction.userId,
          stockId: transaction.stockId || undefined,
          recipientEmail: targetUser.email,
        });

        // 7. Tambahkan saldo fee ke akun Platform/Admin (jika ID di-set di config)
        if (config.PLATFORM_FEE_USER_ID) {
          await tx.user.update({
            where: { id: config.PLATFORM_FEE_USER_ID },
            data: {
              creditBalance: { increment: platformShare },
              earnedCredit: { increment: platformShare },
            },
          });

          // 8. Pencatatan Histori Transaksi untuk Platform Fee
          await tx.transaction.create({
            data: {
              userId: config.PLATFORM_FEE_USER_ID,
              targetUserId: targetUser.id,
              stockId: transaction.stockId,
              type: TransactionType.PLATFORM_FEE,
              status: PaymentStatus.PAID,
              amount: Math.round(
                convertCreditToRealCurrency(platformShare, "IDR"), // Simpan dalam bentuk IDR Rupiah
              ),
              amountCurrency: "IDR",
              creditAmount: platformShare,
              paymentMethod: "SYSTEM",
              externalId: transaction.externalId,
            },
          });
        }
      }
    }
  });
};
