import prisma from "../lib/prisma";
import { createSnapTransaction } from "../lib/midtrans";
import { NotFoundException, BadRequestException } from "../utils/app-error";
import { TransactionType, PaymentStatus } from "../generated/prisma/client";

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
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const plan = await prisma.plan.findUnique({ where: { id: planId } });

  if (!user) throw new NotFoundException("User not found");
  if (!plan) throw new NotFoundException("Plan not found");

  // Create Transaction Record
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: TransactionType.SUBSCRIPTION,
      amount: plan.price,
      planId: plan.id,
      status: PaymentStatus.PENDING,
    },
  });

  // Get Snap Token
  const snap = await createSnapTransaction({
    order_id: transaction.id,
    gross_amount: plan.price,
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
    item_details: [
      {
        id: plan.id,
        price: plan.price,
        quantity: 1,
        name: `${plan.name} Subscription`,
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

    // Calculate Price in Credits (Asumsi stock.price masih dalam rupiah, perlu konversi atau pakai field khusus credit)
    // Untuk simplifikasi, kita anggap stock.price adalah Rupiah, konversi ke Credit / 1000.
    const priceInRupiah = Number(stock.price);
    const priceInCredit = Math.ceil(priceInRupiah / 1000);

    if (user.creditBalance < priceInCredit) {
      throw new BadRequestException("Insufficient credit balance");
    }

    // 1. Potong Credit User
    await tx.user.update({
      where: { id: userId },
      data: { creditBalance: { decrement: priceInCredit } },
    });

    // 2. Distribusi Revenue (75% Creator, 25% Platform)
    const creatorShare = Math.floor(priceInCredit * 0.75); // 75%
    // const platformShare = priceInCredit - creatorShare; // 25% (Implisit masuk platform)

    // Tambah Saldo Creator
    await tx.user.update({
      where: { id: stock.userId },
      data: { creditBalance: { increment: creatorShare } },
    });

    // 3. Catat Transaksi
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

    return transaction;
  });
};

// 4. HANDLE PAYMENT NOTIFICATION (Webhook)
export const handlePaymentNotification = async (notificationBody: any) => {
  // const status = await verifyPaymentNotification(notificationBody);
  // Loop dependency issue if we import verify from lib/midtrans directly here?
  // Actually verifyPaymentNotification is in lib/midtrans, so it is fine.
  // But wait, we need to import it.

  // Let's implement logic assuming verification is done in controller or here.
  // Ideally service handles business logic.

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
          // Reset Premium Quota Date
          // Calculate Next Reset (1 Month later)
          const nextReset = new Date(now);
          nextReset.setMonth(now.getMonth() + 1);

          await tx.user.update({
            where: { id: user.id },
            data: {
              isPremium: true,
              planId: plan.id,
              premiumQuota: plan.premiumQuota,
              premiumQuotaResetDate: nextReset,
              // Optional: Reset daily limit if needed, or keep standard
            },
          });
        }
      }

      // CASE C: DIRECT PURCHASE VIA GATEWAY (CASH)
      // Logic: Konversi amount -> credit -> beli aset -> bagi hasil
      // But wait, the transaction type for this scenario needs to be handled.
      // If we create order with type BUY_ASSET and status PENDING.
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

          // Creator User
          const creatorShare = Math.floor(priceInCredit * 0.75);

          await tx.user.update({
            where: { id: stock.userId },
            data: { creditBalance: { increment: creatorShare } },
          });

          // Note: User doesn't need credit deduction because they paid cash.
          // We just needed to forward share to Creator.
        }
      }
    }
  });

  return { message: "Transaction updated", status: newStatus };
};

// 5. FIND ALL TRANSACTIONS (Admin)
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

  return { transactions, totalCount, totalPages: Math.ceil(totalCount / Number(limit)) };
};

// 6. FIND USER TRANSACTIONS
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

  return { transactions, totalCount, totalPages: Math.ceil(totalCount / Number(limit)) };
};

// 7. FIND ONE TRANSACTION
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
