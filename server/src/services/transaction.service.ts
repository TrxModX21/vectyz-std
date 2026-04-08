import prisma from "../lib/prisma";
import { createSnapTransaction, verifySignatureKey } from "../lib/midtrans";
import { NotFoundException, BadRequestException } from "../utils/app-error";
import { TransactionType, PaymentStatus } from "../generated/prisma/client";
import { config } from "../utils/app.config";

// 1. TOPUP CREDIT
export const createTopupTransaction = async (
  userId: string,
  amount: number,
) => {
  if (amount < 10000) {
    throw new BadRequestException("Minimum topup is Rp 10.000");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundException("User not found");

  // Create Transaction Record (Pending)
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: TransactionType.TOPUP_CREDIT,
      amount: amount,
      creditAmount: amount / 1000, // 1 Credit = Rp 1.000
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
        id: "TOPUP-CREDIT",
        price: amount,
        quantity: 1,
        name: `${amount / 1000} Credits`,
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
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const plan = await prisma.plan.findUnique({ where: { id: planId } });

  if (!user) throw new NotFoundException("User not found");
  if (!plan) throw new NotFoundException("Plan not found");

  // Determine Price & Period based on Cycle
  let amount = plan.price;
  let periodDays = 30; // Default Monthly
  let itemName = `${plan.name} Subscription (Monthly)`;

  if (billingCycle === "YEARLY") {
    if (plan.priceInYear) {
      amount = plan.priceInYear;
    } else {
      // Fallback if priceInYear not set: 12 * price (or handle error)
      amount = plan.price * 12;
    }
    periodDays = 365;
    itemName = `${plan.name} Subscription (Yearly)`;
  } else if (billingCycle === "ONE_TIME") {
    amount = plan.price;
    periodDays = plan.durationDays; // Use plan duration (e.g. 2 days)
    itemName = `${plan.name} (One Time Pass)`;
  }

  // Create Transaction Record
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: TransactionType.SUBSCRIPTION,
      amount: amount,
      planId: plan.id,
      status: PaymentStatus.PENDING,
      billingCycle: billingCycle,
      periodDays: periodDays,
    },
  });

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
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const stock = await prisma.stock.findUnique({ where: { id: stockId } });

  if (!user) throw new NotFoundException("User not found");
  if (!stock) throw new NotFoundException("Stock not found");

  // Create Transaction Record
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: TransactionType.BUY_ASSET,
      amount: Number(stock.price),
      stockId: stock.id,
      status: PaymentStatus.PENDING,
    },
  });

  // Get Snap Token
  const snap = await createSnapTransaction({
    order_id: transaction.id,
    gross_amount: Number(stock.price),
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
    item_details: [
      {
        id: stock.id,
        price: Number(stock.price),
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
  if (amount < 11000)
    throw new BadRequestException("Minimum donation is Rp 11.000");

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
    const priceInRupiah = Number(stock.price);
    const priceInCredit = Math.ceil(priceInRupiah / 1000);

    if (user.creditBalance.lt(priceInCredit)) {
      throw new BadRequestException("Insufficient credit balance");
    }

    // 1. Potong Credit User
    await tx.user.update({
      where: { id: userId },
      data: { creditBalance: { decrement: priceInCredit } },
    });

    // 2. Distribusi Revenue (75% Creator, 25% Platform)
    const creatorShare = priceInCredit * 0.75; // 75%
    const platformShare = priceInCredit - creatorShare; // 25%

    // Tambah Saldo Creator
    await tx.user.update({
      where: { id: stock.userId },
      data: { creditBalance: { increment: creatorShare } },
    });

    if (config.PLATFORM_FEE_USER_ID) {
      await tx.user.update({
        where: { id: config.PLATFORM_FEE_USER_ID },
        data: { creditBalance: { increment: platformShare } },
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
        creditAmount: -priceInCredit, // User keluar credit
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
          data: { creditBalance: { increment: transaction.creditAmount } },
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

          // 2. Calculate Next Quota Reset (Always Monthly for Quota)
          // Even for Yearly plan, quota resets every month
          const nextQuotaReset = new Date(now);
          nextQuotaReset.setMonth(now.getMonth() + 1);

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
          const amount = Number(transaction.amount); // Ensure number
          const premiumShare = amount * 0.5;
          const freeShare = amount * 0.1;

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
          const priceInRupiah = Number(stock.price);
          const priceInCredit = Math.ceil(priceInRupiah / 1000);

          // Distribusi Creator & Platform
          const creatorShare = priceInCredit * 0.75;
          const platformShare = priceInCredit - creatorShare;

          await tx.user.update({
            where: { id: stock.userId },
            data: { creditBalance: { increment: creatorShare } },
          });

          if (config.PLATFORM_FEE_USER_ID) {
            await tx.user.update({
              where: { id: config.PLATFORM_FEE_USER_ID },
              data: { creditBalance: { increment: platformShare } },
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

          await tx.user.update({
            where: { id: targetUser.id },
            data: { creditBalance: { increment: finalCredit } },
          });
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
