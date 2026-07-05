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
} from "../generated/prisma/client";
import { config } from "../utils/app.config";
import { getCreditValue } from "../utils/helper";
import { createNotification } from "./notification.service";

// 1. TOPUP CREDIT
export const createTopupTransaction = async (
  userId: string,
  creditAmount: number,
  gateway: string = "midtrans",
) => {
  if (creditAmount < 10) {
    throw new BadRequestException("Minimum topup is 10 Credits");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundException("User not found");

  const amountRupiah = getCreditValue(creditAmount, "IDR");
  const amountUsd = getCreditValue(creditAmount, "USD");

  // Create Transaction Record (Pending)
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: TransactionType.TOPUP_CREDIT,
      amount:
        gateway === "polar" ? Math.round(amountUsd * 16000) : amountRupiah,
      creditAmount: creditAmount,
      status: PaymentStatus.PENDING,
    },
  });

  if (gateway === "polar") {
    if (!config.POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID) {
      throw new Error(
        "POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID is not configured",
      );
    }

    const checkout = await polar.checkouts.create({
      products: [config.POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID as string],
      amount: Math.round(amountUsd * 100), // in cents
      customerEmail: user.email,
      customerName: user.name,
      externalCustomerId: user.id,
      allowDiscountCodes: false,
      metadata: {
        transactionId: transaction.id,
      },
    });

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { externalId: checkout.id },
    });

    return {
      transactionId: transaction.id,
      polarCheckoutUrl: checkout.url,
    };
  }

  // Get Snap Token (Midtrans)
  const snap = await createSnapTransaction({
    order_id: transaction.id,
    gross_amount: amountRupiah,
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
    item_details: [
      {
        id: "TOPUP-CREDIT",
        price: amountRupiah,
        quantity: 1,
        name: `${creditAmount} Credits`,
      },
    ],
  });

  // Update Snap Token to Transaction (Optional, if we had a field for it, or just return it)
  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { snapToken: snap.token, externalId: snap.token },
  });

  return {
    transactionId: transaction.id,
    snapToken: snap.token,
    redirectUrl: snap.redirect_url,
  };
};

// 2. SUBSCRIPTION PLAN
export const createSubscriptionTransaction = async (
  userId: string,
  planId: string,
  billingCycle: "MONTHLY" | "YEARLY" | "ONE_TIME",
  ipAddress: string,
  billingAddress?: {
    first_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country_code?: string;
  },
  phone?: string,
  gateway: "midtrans" | "polar" = "midtrans",
  currency: "IDR" | "USD" = "IDR",
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const plan = await prisma.plan.findUnique({ where: { id: planId } });

  if (!user) throw new NotFoundException("User not found");
  if (!plan) throw new NotFoundException("Plan not found");

  // Determine Price & Period based on Cycle
  let amount = getCreditValue(plan.price, "IDR");
  let creditAmount = plan.price;
  let periodDays = 30; // Default Monthly
  let itemName = `${plan.name} Subscription (Monthly)`;

  if (billingCycle === "YEARLY") {
    if (plan.priceInYear) {
      amount = getCreditValue(plan.priceInYear, "IDR");
      creditAmount = plan.priceInYear;
    } else {
      // Fallback if priceInYear not set: 12 * price (or handle error)
      amount = getCreditValue(plan.price * 12, "IDR");
      creditAmount = plan.price * 12;
    }
    periodDays = 365;
    itemName = `${plan.name} Subscription (Yearly)`;
  } else if (billingCycle === "ONE_TIME") {
    amount = getCreditValue(plan.price, "IDR");
    creditAmount = plan.price;
    periodDays = plan.durationDays; // Use plan duration (e.g. 2 days)
    itemName = `${plan.name} (One Time Pass)`;
  }

  // Create Transaction Record
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: TransactionType.SUBSCRIPTION,
      amount: amount,
      creditAmount: creditAmount,
      planId: plan.id,
      status: PaymentStatus.PENDING,
      billingCycle: billingCycle,
      periodDays: periodDays,
    },
  });

  if (gateway === "polar") {
    const productId =
      billingCycle === "YEARLY"
        ? plan.polarYearlyProductId
        : plan.polarMonthlyProductId;

    if (!productId) {
      throw new BadRequestException(
        `Polar product ID for ${billingCycle} is not configured for this plan.`,
      );
    }

    const checkout = await polar.checkouts.create({
      products: [productId],
      customerEmail: billingAddress?.email || user.email,
      customerName: billingAddress?.first_name || user.name,
      externalCustomerId: user.id,
      embedOrigin: config.CLIENT_URL as string,
      allowDiscountCodes: false,
      customerIpAddress: ipAddress,
      metadata: {
        transactionId: transaction.id,
      },
      successUrl: `${config.CLIENT_URL}/pricing?success=true`,
    });

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { externalId: checkout.id },
    });

    return {
      transactionId: transaction.id,
      polarCheckoutUrl: checkout.url,
    };
  }

  // Get Snap Token
  const snap = await createSnapTransaction({
    order_id: transaction.id,
    gross_amount: amount,
    customer_details: {
      first_name: billingAddress?.first_name || user.name,
      email: billingAddress?.email || user.email,
      phone: phone || billingAddress?.phone || "",
      billing_address: billingAddress,
    },
    item_details: [
      {
        id: plan.id,
        price: amount,
        quantity: 1,
        name: itemName,
      },
    ],
  });

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { snapToken: snap.token, externalId: snap.token },
  });

  return {
    transactionId: transaction.id,
    snapToken: snap.token,
    redirectUrl: snap.redirect_url,
  };
};

// 3. DIRECT PURCHASE (Payment Gateway / Cash)
export const createDirectPurchaseTransaction = async (
  userId: string,
  stockId: string,
  gateway: "midtrans" | "polar" = "midtrans",
  ipAddress: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const stock = await prisma.stock.findUnique({ where: { id: stockId } });

  if (!user) throw new NotFoundException("User not found");
  if (!stock) throw new NotFoundException("Stock not found");

  let amountIdr = getCreditValue(Number(stock.price), "IDR");

  // Create Transaction Record
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      stockId: stock.id,
      type: TransactionType.BUY_ASSET,
      status: PaymentStatus.PENDING,
      amount: amountIdr,
    },
  });

  if (gateway === "polar") {
    // 1 Credit = $0.05 => stock.price (in credits) * 5 cents
    const priceInCents = Math.round(Number(stock.price) * 5);

    let polarProductId = stock.polarProductId;

    if (polarProductId) {
      try {
        const product = await polar.products.get({ id: polarProductId });
        const prices = (product as any).prices || [];
        const hasMatchingPrice = prices.some(
          (p: any) =>
            p.amountType === "fixed" && p.priceAmount === priceInCents,
        );

        if (!hasMatchingPrice) {
          polarProductId = null; // force recreation with new price
        }
      } catch (error) {
        console.error("Failed to fetch Polar product:", error);
        polarProductId = null; // force recreation
      }
    }

    if (!polarProductId) {
      const newPolarProduct = await polar.products.create({
        name: `Asset: ${stock.title}`,
        visibility: "private",
        description: stock.description,
        prices: [
          {
            amountType: "fixed",
            priceAmount: priceInCents,
            priceCurrency: "usd",
          },
        ],
      });

      polarProductId = newPolarProduct.id;

      await prisma.stock.update({
        where: { id: stock.id },
        data: { polarProductId },
      });
    }

    const checkout = await polar.checkouts.create({
      products: [polarProductId],
      customerEmail: user.email,
      customerName: user.name,
      externalCustomerId: user.id,
      embedOrigin: config.CLIENT_URL as string,
      allowDiscountCodes: false,
      customerIpAddress: ipAddress,
      metadata: {
        transactionId: transaction.id,
      },
    });

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { externalId: checkout.id, paymentMethod: "POLAR" },
    });

    return {
      transactionId: transaction.id,
      polarCheckoutUrl: checkout.url,
    };
  }

  // Get Snap Token
  const snap = await createSnapTransaction({
    order_id: transaction.id,
    gross_amount: amountIdr,
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
    item_details: [
      {
        id: stock.id,
        price: amountIdr,
        quantity: 1,
        name: `Asset: ${stock.title.substring(0, 20)}...`,
      },
    ],
  });

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { snapToken: snap.token, externalId: snap.token },
  });

  return {
    transactionId: transaction.id,
    snapToken: snap.token,
    redirectUrl: snap.redirect_url,
  };
};

// 3a. DONATION (Payment Gateway)
export const createDonationTransactionGateway = async (
  userId: string,
  stockId: string,
  targetUserId: string,
  amount: number,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });
  const stock = await prisma.stock.findUnique({ where: { id: stockId } });

  if (!user) throw new NotFoundException("User not found");
  if (!targetUser) throw new NotFoundException("Target user not found");
  if (!stock) throw new NotFoundException("Stock not found");
  if (amount < 10000)
    throw new BadRequestException("Minimum donation is Rp 10.000");

  // Create Transaction Record
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      targetUserId,
      stockId: stock.id,
      type: TransactionType.DONATION,
      amount: amount,
      status: PaymentStatus.PENDING,
    },
  });

  // Get Snap Token
  const snap = await createSnapTransaction({
    order_id: transaction.id,
    gross_amount: amount,
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
    item_details: [
      {
        id: "DONATION",
        price: amount,
        quantity: 1,
        name: `Donation to ${targetUser.name}`,
      },
    ],
  });

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { snapToken: snap.token, externalId: snap.token },
  });

  return {
    transactionId: transaction.id,
    snapToken: snap.token,
    redirectUrl: snap.redirect_url,
  };
};

// 3b. DONATION (Internal Credit)
export const processDonationWithCredit = async (
  userId: string,
  stockId: string,
  targetUserId: string,
  amountInRupiah: number,
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    const targetUser = await tx.user.findUnique({
      where: { id: targetUserId },
    });
    const stock = await tx.stock.findUnique({ where: { id: stockId } });

    if (!user) throw new NotFoundException("User not found");
    if (!targetUser) throw new NotFoundException("Target user not found");
    if (!stock) throw new NotFoundException("Stock not found");
    if (amountInRupiah < 11000)
      throw new BadRequestException("Minimum donation is Rp 11.000");

    if (userId === targetUserId) {
      throw new BadRequestException("You cannot donate to yourself");
    }

    const amountInCredit = amountInRupiah / 1000;

    if (user.creditBalance.lt(amountInCredit)) {
      throw new BadRequestException("Insufficient credit balance");
    }

    // 1. Potong Credit User
    const userPurchased = Number(user.purchasedCredit);
    let deductPurchased = 0;
    let deductEarned = 0;

    if (userPurchased >= amountInCredit) {
      deductPurchased = amountInCredit;
    } else {
      deductPurchased = userPurchased;
      deductEarned = amountInCredit - userPurchased;
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        creditBalance: { decrement: amountInCredit },
        purchasedCredit: { decrement: deductPurchased },
        earnedCredit: { decrement: deductEarned },
      },
    });

    // 2. Distribusi Revenue (95% Creator, 5% Platform)
    const creatorShareRupiah = amountInRupiah * 0.95;
    const rawCredit = creatorShareRupiah / 1000;
    const creatorShare = Math.floor(rawCredit * 100) / 100;
    const platformShare = amountInCredit - creatorShare;

    // Tambah Saldo Creator
    await tx.user.update({
      where: { id: targetUserId },
      data: {
        creditBalance: { increment: creatorShare },
        earnedCredit: { increment: creatorShare },
      },
    });

    if (config.PLATFORM_FEE_USER_ID) {
      await tx.user.update({
        where: { id: config.PLATFORM_FEE_USER_ID },
        data: {
          creditBalance: { increment: platformShare },
          earnedCredit: { increment: platformShare },
        },
      });
    }

    // 3. Catat Transaksi Pembeli
    const transaction = await tx.transaction.create({
      data: {
        userId,
        targetUserId,
        stockId: stock.id,
        type: TransactionType.DONATION,
        status: PaymentStatus.PAID,
        amount: amountInRupiah,
        creditAmount: amountInCredit, // User keluar credit
        paymentMethod: "CREDIT_BALANCE",
      },
    });

    // 4. Catat Transaksi EARNING_DONATION & PLATFORM_FEE
    await tx.transaction.create({
      data: {
        userId: targetUserId,
        targetUserId: userId,
        stockId: stock.id,
        type: TransactionType.EARNING_DONATION,
        status: PaymentStatus.PAID,
        amount: amountInRupiah,
        creditAmount: creatorShare,
        paymentMethod: "SYSTEM",
      },
    });

    // Notify the receiver
    await createNotification({
      userId: targetUserId,
      type: NotificationType.DONATION_RECEIVED,
      title: "You received a coffee! ☕",
      message: `${user.name} just sent you ${creatorShare} credits.`,
      sourceUserId: userId,
      stockId: stockId,
      recipientEmail: targetUser.email,
    });

    if (config.PLATFORM_FEE_USER_ID) {
      await tx.transaction.create({
        data: {
          userId: config.PLATFORM_FEE_USER_ID,
          targetUserId,
          stockId: stock.id,
          type: TransactionType.PLATFORM_FEE,
          status: PaymentStatus.PAID,
          amount: amountInRupiah,
          creditAmount: platformShare,
          paymentMethod: "SYSTEM",
        },
      });
    }

    return transaction;
  });
};

// 4. DIRECT PURCHASE (Internal Credit)
export const processDirectPurchaseWithCredit = async (
  userId: string,
  stockId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    const stock = await tx.stock.findUnique({
      where: { id: stockId },
      include: { user: true },
    });

    if (!user || !stock) throw new NotFoundException("User or Stock not found");

    if (userId === stock.userId) {
      throw new BadRequestException("You cannot buy your own asset");
    }

    const existingPurchase = await tx.transaction.findFirst({
      where: {
        userId,
        stockId,
        type: TransactionType.BUY_ASSET,
        status: PaymentStatus.PAID,
      },
    });
    if (existingPurchase) {
      throw new BadRequestException("You already own this asset");
    }

    // Calculate Price in Credits (Asumsi stock.price masih dalam rupiah, perlu konversi atau pakai field khusus credit)
    // Untuk simplifikasi, kita anggap stock.price adalah Rupiah, konversi ke Credit / 1000.

    const priceInCredit = Number(stock.price);
    const priceInRupiah = priceInCredit * 1000;

    if (user.creditBalance.lt(priceInCredit)) {
      throw new BadRequestException("Insufficient credit balance");
    }

    // 1. Potong Credit User
    const userPurchased = Number(user.purchasedCredit);
    let deductPurchased = 0;
    let deductEarned = 0;

    if (userPurchased >= priceInCredit) {
      deductPurchased = priceInCredit;
    } else {
      deductPurchased = userPurchased;
      deductEarned = priceInCredit - userPurchased;
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        creditBalance: { decrement: priceInCredit },
        purchasedCredit: { decrement: deductPurchased },
        earnedCredit: { decrement: deductEarned },
      },
    });

    // 2. Distribusi Revenue (75% Creator, 25% Platform)
    const creatorShare = priceInCredit * 0.75; // 75%
    const platformShare = priceInCredit - creatorShare; // 25%

    // Tambah Saldo Creator
    await tx.user.update({
      where: { id: stock.userId },
      data: {
        creditBalance: { increment: creatorShare },
        earnedCredit: { increment: creatorShare },
      },
    });

    if (config.PLATFORM_FEE_USER_ID) {
      await tx.user.update({
        where: { id: config.PLATFORM_FEE_USER_ID },
        data: {
          creditBalance: { increment: platformShare },
          earnedCredit: { increment: platformShare },
        },
      });
    }

    // 3. Catat Transaksi Pembeli
    const transaction = await tx.transaction.create({
      data: {
        userId,
        stockId,
        type: TransactionType.BUY_ASSET,
        status: PaymentStatus.PAID,
        amount: priceInRupiah,
        creditAmount: priceInCredit, // User keluar credit
        paymentMethod: "CREDIT_BALANCE",
      },
    });

    // 4. Catat Transaksi EARNING_ASSET & PLATFORM_FEE
    await tx.transaction.create({
      data: {
        userId: stock.userId,
        targetUserId: userId,
        stockId,
        type: TransactionType.EARNING_ASSET,
        status: PaymentStatus.PAID,
        amount: priceInRupiah,
        creditAmount: creatorShare,
        paymentMethod: "SYSTEM",
      },
    });

    // Notify the creator
    await createNotification({
      userId: stock.userId,
      type: NotificationType.ASSET_SOLD,
      title: "Asset Sold! 🎉",
      message: `${user.name} just purchased "${stock.title}". You earned ${creatorShare} credits.`,
      sourceUserId: userId,
      stockId: stockId,
      recipientEmail: stock.user.email,
    });

    if (config.PLATFORM_FEE_USER_ID) {
      await tx.transaction.create({
        data: {
          userId: config.PLATFORM_FEE_USER_ID,
          targetUserId: stock.userId,
          stockId,
          type: TransactionType.PLATFORM_FEE,
          status: PaymentStatus.PAID,
          amount: priceInRupiah,
          creditAmount: platformShare,
          paymentMethod: "SYSTEM",
        },
      });
    }

    return transaction;
  });
};

// 5. HANDLE PAYMENT NOTIFICATION (Webhook)
export const handlePaymentNotification = async (notificationBody: any) => {
  // 1. Verify Signature Key (Security Check)
  // Import dynamically to avoid circular dependency issues if any, or just use the imported one.
  // We need to add import { verifySignatureKey } from "../lib/midtrans"; at the top later.
  // For now, assuming it's available or we use requirement.
  const isValidSignature = verifySignatureKey(notificationBody);

  if (!isValidSignature) {
    throw new BadRequestException("Invalid Signature Key");
  }

  const orderId = notificationBody.order_id;
  const transactionStatus = notificationBody.transaction_status;
  const fraudStatus = notificationBody.fraud_status;

  // Simple check (Verification better done in controller/lib)
  let newStatus: PaymentStatus = PaymentStatus.PENDING;
  if (transactionStatus == "capture") {
    if (fraudStatus == "challenge") {
      newStatus = PaymentStatus.PENDING; // Challenge
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

  // Idempotency Check: Get existing transaction
  const transaction = await prisma.transaction.findUnique({
    where: { id: orderId },
    include: { user: true, plan: true },
  });

  if (!transaction) {
    throw new NotFoundException(`Transaction ${orderId} not found`);
  }

  // If status not changed, ignore
  if (transaction.status === newStatus) {
    return { message: "Status unchanged" };
  }

  // Update logic inside Transaction
  await prisma.$transaction(async (tx) => {
    // 1. Update Transaction Status
    await tx.transaction.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        paymentMethod: notificationBody.payment_type,
      },
    });

    // 2. Grant Benefit if PAID (and previously checking pending/failed)
    if (
      newStatus === PaymentStatus.PAID &&
      transaction.status !== PaymentStatus.PAID
    ) {
      const user = transaction.user;

      // CASE A: TOPUP
      if (
        transaction.type === TransactionType.TOPUP_CREDIT &&
        transaction.creditAmount
      ) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            creditBalance: { increment: transaction.creditAmount },
            purchasedCredit: { increment: transaction.creditAmount },
          },
        });
      }

      // CASE B: SUBSCRIPTION
      if (
        transaction.type === TransactionType.SUBSCRIPTION &&
        transaction.planId
      ) {
        const plan = transaction.plan;
        if (plan) {
          const now = new Date();

          // --- EXPIRY & QUOTA LOGIC ---
          const activeDays = transaction.periodDays || 30; // Fallback 30

          // Calculate Expiry Date (Extend if active, Reset if expired)
          let subscriptionExpiresAt = new Date(now);
          if (user.subscriptionExpiresAt && user.subscriptionExpiresAt > now) {
            // User masih aktif, tambahkan durasi ke tanggal expired lama
            subscriptionExpiresAt = new Date(user.subscriptionExpiresAt);
            subscriptionExpiresAt.setDate(
              subscriptionExpiresAt.getDate() + activeDays,
            );
          } else {
            // User sudah mati atau baru, set dari sekarang
            subscriptionExpiresAt.setDate(now.getDate() + activeDays);
          }

          // 2. Calculate Next Quota Reset (Always Monthly for Quota, but capped at expiry)
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
          // 50% Premium Pool, 10% Free Pool
          const baseCredit = Number(transaction.creditAmount || 0); // Use Credit
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
      }

      // CASE C: DIRECT PURCHASE VIA GATEWAY (CASH)
      // Logic: Konversi amount -> credit -> beli aset -> bagi hasil
      if (
        transaction.type === TransactionType.BUY_ASSET &&
        transaction.stockId
      ) {
        const stock = await tx.stock.findUnique({
          where: { id: transaction.stockId },
        });

        if (stock) {
          const priceInCredit = Number(stock.price);
          const priceInRupiah = priceInCredit * 1000;

          // Distribusi Creator & Platform
          const creatorShare = priceInCredit * 0.75;
          const platformShare = priceInCredit - creatorShare;

          await tx.user.update({
            where: { id: stock.userId },
            data: {
              creditBalance: { increment: creatorShare },
              earnedCredit: { increment: creatorShare },
            },
          });

          if (config.PLATFORM_FEE_USER_ID) {
            await tx.user.update({
              where: { id: config.PLATFORM_FEE_USER_ID },
              data: {
                creditBalance: { increment: platformShare },
                earnedCredit: { increment: platformShare },
              },
            });
          }

          // Catat Transaksi EARNING_ASSET & PLATFORM_FEE
          await tx.transaction.create({
            data: {
              userId: stock.userId,
              targetUserId: transaction.userId,
              stockId: stock.id,
              type: TransactionType.EARNING_ASSET,
              status: PaymentStatus.PAID,
              amount: priceInRupiah,
              creditAmount: creatorShare,
              paymentMethod: notificationBody.payment_type || "SYSTEM",
              externalId: transaction.externalId,
            },
          });

          // Notify the creator (We don't have the creator's email easily here without another query, so we skip email or fetch user)
          const creator = await tx.user.findUnique({
            where: { id: stock.userId },
          });
          await createNotification({
            userId: stock.userId,
            type: NotificationType.ASSET_SOLD,
            title: "Asset Sold! 🎉",
            message: `Someone just purchased "${stock.title}". You earned ${creatorShare} credits.`,
            sourceUserId: transaction.userId,
            stockId: stock.id,
            recipientEmail: creator?.email,
          });

          if (config.PLATFORM_FEE_USER_ID) {
            await tx.transaction.create({
              data: {
                userId: config.PLATFORM_FEE_USER_ID,
                targetUserId: stock.userId,
                stockId: stock.id,
                type: TransactionType.PLATFORM_FEE,
                status: PaymentStatus.PAID,
                amount: priceInRupiah,
                creditAmount: platformShare,
                paymentMethod: notificationBody.payment_type || "SYSTEM",
                externalId: transaction.externalId,
              },
            });
          }
        }
      }

      // CASE D: DONATION
      if (
        transaction.type === TransactionType.DONATION &&
        transaction.targetUserId
      ) {
        const targetUser = await tx.user.findUnique({
          where: { id: transaction.targetUserId },
        });

        if (targetUser) {
          const donationInRupiah = Number(transaction.amount);

          // Potongan 5% platform fee, jadi kreator dapat 95%
          const creatorShareRupiah = donationInRupiah * 0.95;

          // Convert ke Credit (1 Credit = Rp 1000). Boleh desimal maksimal 2 digit di belakang koma.
          // Misal Rp 15.000 potong 5% = 14.250 -> 14.25 credit
          // Jika 14.24343 maka jadi 14.24
          const rawCredit = creatorShareRupiah / 1000;
          const finalCredit = Math.floor(rawCredit * 100) / 100;

          // Add Credit to Target User
          await tx.user.update({
            where: { id: targetUser.id },
            data: {
              creditBalance: { increment: finalCredit },
              earnedCredit: { increment: finalCredit },
            },
          });

          // Catat Transaksi EARNING_DONATION
          await tx.transaction.create({
            data: {
              userId: targetUser.id,
              targetUserId: transaction.userId,
              stockId: transaction.stockId,
              type: TransactionType.EARNING_DONATION,
              status: PaymentStatus.PAID,
              amount: donationInRupiah,
              creditAmount: finalCredit,
              paymentMethod: notificationBody.payment_type || "SYSTEM",
              externalId: transaction.externalId,
            },
          });

          await createNotification({
            userId: targetUser.id,
            type: NotificationType.DONATION_RECEIVED,
            title: "You received a coffee! ☕",
            message: `Someone just sent you ${finalCredit} credits.`,
            sourceUserId: transaction.userId,
            stockId: transaction.stockId || undefined,
            recipientEmail: targetUser.email,
          });

          if (config.PLATFORM_FEE_USER_ID) {
            const platformFeeCredit = donationInRupiah / 1000 - finalCredit;

            await tx.user.update({
              where: { id: config.PLATFORM_FEE_USER_ID },
              data: {
                creditBalance: { increment: platformFeeCredit },
                earnedCredit: { increment: platformFeeCredit },
              },
            });

            await tx.transaction.create({
              data: {
                userId: config.PLATFORM_FEE_USER_ID,
                targetUserId: targetUser.id,
                stockId: transaction.stockId,
                type: TransactionType.PLATFORM_FEE,
                status: PaymentStatus.PAID,
                amount: donationInRupiah,
                creditAmount: platformFeeCredit,
                paymentMethod: notificationBody.payment_type || "SYSTEM",
                externalId: transaction.externalId,
              },
            });
          }
        }
      }
    }
  });

  return { message: "Transaction updated", status: newStatus };
};

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

// 7. POLAR DONATION (Checkout)
export const createPolarDonationCheckout = async (
  userId: string,
  stockId: string | null,
  targetUserId: string,
  amountInUsd: number,
  ipAddress: string,
) => {
  if (amountInUsd < 1) {
    throw new BadRequestException("Minimum donation is $1.00 USD");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!user || !targetUser) throw new NotFoundException("User not found");

  // Calculate equivalent Credits and IDR
  // $0.05 USD = 1 Credit
  const creditAmount = amountInUsd / 0.05;
  const amountRupiah = creditAmount * 1000;

  // Create Transaction Record (Pending)
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      stockId: stockId || undefined,
      targetUserId,
      type: TransactionType.DONATION,
      status: PaymentStatus.PENDING,
      amount: amountRupiah,
      creditAmount,
      paymentMethod: "POLAR",
    },
  });

  // Create Polar Custom Checkout
  // productId from app.config.ts POLAR_DONATION_PRODUCT_ID
  if (!config.POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID) {
    throw new Error("POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID is not configured");
  }

  const checkout = await polar.checkouts.create({
    products: [config.POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID as string],
    amount: Math.round(amountInUsd * 100), // in cents
    customerEmail: user.email,
    customerName: user.name,
    externalCustomerId: user.id,
    embedOrigin: config.CLIENT_URL as string,
    allowDiscountCodes: false,
    customerIpAddress: ipAddress,
    metadata: {
      transactionId: transaction.id,
    },
  });

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { externalId: checkout.id },
  });

  return {
    transactionId: transaction.id,
    checkoutUrl: checkout.url,
  };
};

// 8. POLAR WEBHOOK HANDLER
export const handlePolarWebhookEvent = async (payload: any) => {
  const eventType = payload.type;
  const data = payload.data;
  // console.log(data);

  // We only care about order.created for now
  if (eventType === "order.created") {
    const transactionId = data.metadata?.transactionId;

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
      data.billing_reason !== "subscription_cycle"
    ) {
      return; // Already processed or not found
    }

    await prisma.$transaction(async (tx) => {
      if (transaction.type === TransactionType.DONATION) {
        // 1. Calculate actual USD paid from Polar webhook (subtotal is in cents)
        const actualUsdCents = data.subtotalAmount || transaction.amount / 200; // fallback if missing
        const actualUsdPaid = actualUsdCents / 100;

        // Calculate equivalent IDR: $0.05 USD = 1 Credit => 1 USD = 20 Credits = Rp 20.000
        const donationInRupiah = actualUsdPaid * 20000;
        const actualCreditAmount = actualUsdPaid / 0.05;

        // 2. Update Transaction to PAID and update amounts just in case they were modified at checkout
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: PaymentStatus.PAID,
            amount: donationInRupiah,
            creditAmount: actualCreditAmount,
            paymentMethod: "polar",
          },
        });

        // Calculate revenue with 12% platform fee for Polar (5% + 50 cents buffer)
        // Potongan 12% platform fee, jadi kreator dapat 88%
        const creatorShareRupiah = donationInRupiah * 0.88;
        const rawCredit = creatorShareRupiah / 1000;
        const finalCredit = Math.floor(rawCredit * 100) / 100;
        const platformFeeCredit = donationInRupiah / 1000 - finalCredit;

        // 2. Add Credit to Target User
        await tx.user.update({
          where: { id: transaction.targetUserId! },
          data: {
            creditBalance: { increment: finalCredit },
            earnedCredit: { increment: finalCredit },
          },
        });

        // 3. Platform Fee
        if (config.PLATFORM_FEE_USER_ID) {
          await tx.user.update({
            where: { id: config.PLATFORM_FEE_USER_ID },
            data: {
              creditBalance: { increment: platformFeeCredit },
              earnedCredit: { increment: platformFeeCredit },
            },
          });

          await tx.transaction.create({
            data: {
              userId: config.PLATFORM_FEE_USER_ID,
              targetUserId: transaction.targetUserId!,
              stockId: transaction.stockId,
              type: TransactionType.PLATFORM_FEE,
              status: PaymentStatus.PAID,
              amount: donationInRupiah,
              creditAmount: platformFeeCredit,
              paymentMethod: "SYSTEM",
              externalId: transaction.externalId,
            },
          });
        }

        // 4. Earning Transaction for Creator
        await tx.transaction.create({
          data: {
            userId: transaction.targetUserId!,
            targetUserId: transaction.userId,
            stockId: transaction.stockId,
            type: TransactionType.EARNING_DONATION,
            status: PaymentStatus.PAID,
            amount: donationInRupiah,
            creditAmount: finalCredit,
            paymentMethod: "SYSTEM",
            externalId: transaction.externalId,
          },
        });

        const donator = await tx.user.findUnique({
          where: { id: transaction.userId },
        });
        const targetUser = await tx.user.findUnique({
          where: { id: transaction.targetUserId! },
        });

        // 5. Create Notification
        if (donator && targetUser) {
          await createNotification({
            userId: transaction.targetUserId!,
            type: NotificationType.DONATION_RECEIVED,
            title: "New Coffee! ☕",
            message: `${donator.name} gave you ${finalCredit} credits!`,
            sourceUserId: donator.id,
            recipientEmail: targetUser.email,
          });
        }
      } else if (transaction.type === TransactionType.TOPUP_CREDIT) {
        // 1. Calculate actual USD paid from Polar webhook (subtotal is in cents)
        const actualUsdCents = data.subtotalAmount || transaction.amount / 160; // fallback if missing
        const actualUsdPaid = actualUsdCents / 100;

        // Calculate equivalent IDR: $0.05 USD = 1 Credit => 1 USD = 20 Credits
        const topupInRupiah = actualUsdPaid * 16000;
        const actualCreditAmount = actualUsdPaid / 0.05;
        const finalCredit = Math.floor(actualCreditAmount);

        // 2. Update Transaction to PAID
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: PaymentStatus.PAID,
            amount: topupInRupiah,
            creditAmount: finalCredit,
            paymentMethod: "polar",
          },
        });

        // 3. Add Credit to User
        await tx.user.update({
          where: { id: transaction.userId },
          data: {
            creditBalance: { increment: finalCredit },
            purchasedCredit: { increment: finalCredit },
          },
        });
      } else if (
        transaction.type === TransactionType.SUBSCRIPTION &&
        transaction.planId &&
        transaction.user &&
        transaction.plan
      ) {
        const user = transaction.user;
        const plan = transaction.plan;
        const now = new Date();
        const activeDays = transaction.periodDays || 30; // Fallback 30

        if (data.billing_reason === "subscription_cycle") {
          // Create a new transaction record for this month's renewal payment
          await tx.transaction.create({
            data: {
              userId: transaction.userId,
              type: TransactionType.SUBSCRIPTION,
              amount: transaction.amount,
              creditAmount: transaction.creditAmount,
              planId: transaction.planId,
              status: PaymentStatus.PAID,
              billingCycle: transaction.billingCycle,
              periodDays: transaction.periodDays,
              paymentMethod: "polar",
              externalId: data.id, // order id from polar
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
      } else if (
        transaction.type === TransactionType.BUY_ASSET &&
        transaction.stockId
      ) {
        const stock = await tx.stock.findUnique({
          where: { id: transaction.stockId },
        });

        if (stock) {
          const priceInCredit = Number(stock.price);
          const priceInRupiah = priceInCredit * 1000;

          // Update Transaction
          await tx.transaction.update({
            where: { id: transaction.id },
            data: {
              status: PaymentStatus.PAID,
              paymentMethod: "polar",
              amount: priceInRupiah,
            },
          });

          // Distribusi Creator & Platform
          const creatorShare = priceInCredit * 0.75;
          const platformShare = priceInCredit - creatorShare;

          await tx.user.update({
            where: { id: stock.userId },
            data: {
              creditBalance: { increment: creatorShare },
              earnedCredit: { increment: creatorShare },
            },
          });

          if (config.PLATFORM_FEE_USER_ID) {
            await tx.user.update({
              where: { id: config.PLATFORM_FEE_USER_ID },
              data: {
                creditBalance: { increment: platformShare },
                earnedCredit: { increment: platformShare },
              },
            });
          }

          // Catat Transaksi EARNING_ASSET
          await tx.transaction.create({
            data: {
              userId: stock.userId,
              targetUserId: transaction.userId,
              stockId: stock.id,
              type: TransactionType.EARNING_ASSET,
              status: PaymentStatus.PAID,
              amount: priceInRupiah,
              creditAmount: creatorShare,
              paymentMethod: "polar",
              externalId: transaction.externalId,
            },
          });

          const creator = await tx.user.findUnique({
            where: { id: stock.userId },
          });

          await createNotification({
            userId: stock.userId,
            type: NotificationType.ASSET_SOLD,
            title: "Asset Sold! 🎉",
            message: `Someone just purchased "${stock.title}". You earned ${creatorShare} credits.`,
            sourceUserId: transaction.userId,
            stockId: stock.id,
            recipientEmail: creator?.email,
          });

          if (config.PLATFORM_FEE_USER_ID) {
            await tx.transaction.create({
              data: {
                userId: config.PLATFORM_FEE_USER_ID,
                targetUserId: stock.userId,
                stockId: stock.id,
                type: TransactionType.PLATFORM_FEE,
                status: PaymentStatus.PAID,
                amount: priceInRupiah,
                creditAmount: platformShare,
                paymentMethod: "polar",
                externalId: transaction.externalId,
              },
            });
          }
        }
      }
    });
  }
};
