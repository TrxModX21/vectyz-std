import {
  NotificationType,
  PaymentStatus,
  TransactionType,
} from "../generated/prisma/enums";
import prisma from "../lib/prisma";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { config } from "../utils/app.config";
import { convertCreditToRealCurrency } from "../utils/helper";
import { PurchaseStockSchemaType } from "../validation/purchase-stock.validation";
import { createNotification } from "./notification.service";
import { polar } from "../lib/polar";
import { createSnapTransaction } from "../lib/midtrans";

export const purchaseStockCreditGatewayService = async (
  currentUserId: string,
  input: PurchaseStockSchemaType,
) => {
  // Menggunakan database transaction agar jika salah satu proses gagal, semuanya otomatis di-rollback
  return await prisma.$transaction(async (tx) => {
    // 1. Pengecekan eksistensi User (Pembeli)
    const user = await tx.user.findUnique({ where: { id: currentUserId } });
    if (!user) throw new NotFoundException("User not found");

    // 2. Pengecekan eksistensi Stock (Aset yang terkait)
    const stock = await tx.stock.findUnique({
      where: { id: input.stockId },
      include: { user: true },
    });
    if (!stock) throw new NotFoundException("Stock not found");

    // 3. Validasi: Tidak boleh beli aset sendiri
    if (currentUserId === stock.userId) {
      throw new BadRequestException("You cannot buy your own asset");
    }

    // 4. Validasi: Tidak boleh beli aset yang sudah dimiliki
    const existingPurchase = await tx.transaction.findFirst({
      where: {
        userId: currentUserId,
        stockId: input.stockId,
        type: TransactionType.BUY_ASSET,
        status: PaymentStatus.PAID,
      },
    });
    if (existingPurchase) {
      throw new BadRequestException("You already own this asset");
    }

    const priceInCredit = Number(stock.price);

    // 5. Validasi: Saldo kredit harus mencukupi
    if (user.creditBalance.lt(stock.price)) {
      throw new BadRequestException("Insufficient credit balance");
    }

    // 6. Kalkulasi pemotongan Purchased Credit vs Earned Credit
    const userPurchased = Number(user.purchasedCredit);
    let deductPurchased = 0;
    let deductEarned = 0;

    if (userPurchased >= priceInCredit) {
      deductPurchased = priceInCredit;
    } else {
      deductPurchased = userPurchased;
      deductEarned = priceInCredit - userPurchased;
    }

    // 7. Potong saldo kredit User (Pembeli)
    await tx.user.update({
      where: { id: currentUserId },
      data: {
        creditBalance: { decrement: priceInCredit },
        purchasedCredit: { decrement: deductPurchased },
        earnedCredit: { decrement: deductEarned },
      },
    });

    // 8. Kalkulasi Distribusi Revenue (75% Creator, 25% Platform)
    const creatorShareCredit = priceInCredit * 0.75;
    const platformShare = priceInCredit - creatorShareCredit;

    // 9. Tambah kredit ke Creator
    await tx.user.update({
      where: { id: stock.userId },
      data: {
        creditBalance: { increment: creatorShareCredit },
        earnedCredit: { increment: creatorShareCredit },
      },
    });

    // 10. Catat transaksi utama (BUY_ASSET)
    const transaction = await tx.transaction.create({
      data: {
        userId: currentUserId,
        targetUserId: stock.userId,
        stockId: stock.id,
        type: TransactionType.BUY_ASSET,
        status: PaymentStatus.PAID,
        amount:
          input.currency === "IDR"
            ? convertCreditToRealCurrency(priceInCredit, "IDR") // Rupiah asli
            : Math.round(
                convertCreditToRealCurrency(priceInCredit, "USD") * 100, // Disimpan dalam bentuk cents
              ),
        amountCurrency: input.currency,
        creditAmount: priceInCredit, // User keluar credit
        paymentMethod: "CREDIT_BALANCE",
      },
    });

    // 11. Catat transaksi penerimaan (EARNING_ASSET) untuk Creator
    await tx.transaction.create({
      data: {
        userId: stock.userId,
        targetUserId: currentUserId,
        stockId: stock.id,
        type: TransactionType.EARNING_ASSET,
        status: PaymentStatus.PAID,
        amount:
          input.currency === "IDR"
            ? convertCreditToRealCurrency(creatorShareCredit, "IDR")
            : Math.round(
                convertCreditToRealCurrency(creatorShareCredit, "USD") * 100,
              ),
        amountCurrency: input.currency,
        creditAmount: creatorShareCredit,
        paymentMethod: "SYSTEM",
      },
    });

    // 12. Kirim notifikasi penjualan ke Creator
    await createNotification({
      userId: stock.userId,
      type: NotificationType.ASSET_SOLD,
      title: "Asset Sold! 🎉",
      message: `${user.name} just purchased "${stock.title}". You earned ${creatorShareCredit} credits.`,
      sourceUserId: currentUserId,
      stockId: stock.id,
      recipientEmail: stock.user.email,
    });

    // 13. Tambah kredit ke Platform & Catat transaksi PLATFORM_FEE
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
            input.currency === "IDR"
              ? convertCreditToRealCurrency(platformShare, "IDR")
              : Math.round(
                  convertCreditToRealCurrency(platformShare, "USD") * 100,
                ),
          amountCurrency: input.currency,
          creditAmount: platformShare,
          paymentMethod: "SYSTEM",
        },
      });
    }

    return transaction;
  });
};

export const purchaseStockMidtransGatewayService = async (
  currentUserId: string,
  input: PurchaseStockSchemaType,
) => {
  // 1. Pengecekan eksistensi User (Pembeli)
  const user = await prisma.user.findUnique({ where: { id: currentUserId } });
  if (!user) throw new NotFoundException("User not found");

  // 2. Pengecekan eksistensi Stock (Aset yang terkait)
  const stock = await prisma.stock.findUnique({
    where: { id: input.stockId },
    include: { user: true },
  });
  if (!stock) throw new NotFoundException("Stock not found");

  // 3. Validasi: Tidak boleh beli aset sendiri
  if (currentUserId === stock.userId) {
    throw new BadRequestException("You cannot buy your own asset");
  }

  // 4. Validasi: Tidak boleh beli aset yang sudah dimiliki
  const existingPurchase = await prisma.transaction.findFirst({
    where: {
      userId: currentUserId,
      stockId: input.stockId,
      type: TransactionType.BUY_ASSET,
      status: PaymentStatus.PAID,
    },
  });
  if (existingPurchase) {
    throw new BadRequestException("You already own this asset");
  }

  const priceInCredit = Number(stock.price);

  // 5. Konversi kredit ke IDR (Rupiah) karena Midtrans hanya menerima Rupiah
  const amountIdr = convertCreditToRealCurrency(priceInCredit, "IDR");

  // 6. Buat rekam transaksi awal (Pending) di database
  const transaction = await prisma.transaction.create({
    data: {
      userId: currentUserId,
      targetUserId: stock.userId,
      stockId: stock.id,
      type: TransactionType.BUY_ASSET,
      status: PaymentStatus.PENDING,
      amount: amountIdr,
      amountCurrency: "IDR",
      creditAmount: priceInCredit,
      paymentMethod: "midtrans",
    },
  });

  // 7. Request Snap Token ke Midtrans
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

  // 8. Update Transaksi dengan External ID (Token Snap Midtrans)
  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { snapToken: snap.token, externalId: snap.token },
  });

  // 9. Kembalikan ID transaksi lokal beserta Snap Token dan Redirect URL ke Client
  return {
    transactionId: transaction.id,
    snapToken: snap.token,
    redirectUrl: snap.redirect_url,
  };
};

export const purchaseStockPolarGatewayService = async (
  currentUserId: string,
  input: PurchaseStockSchemaType,
  ipAddress: string,
) => {
  // 1. Pengecekan eksistensi User (Pembeli)
  const user = await prisma.user.findUnique({ where: { id: currentUserId } });
  if (!user) throw new NotFoundException("User not found");

  // 2. Pengecekan eksistensi Stock (Aset yang terkait)
  const stock = await prisma.stock.findUnique({
    where: { id: input.stockId },
    include: { user: true },
  });
  if (!stock) throw new NotFoundException("Stock not found");

  // 3. Validasi: Tidak boleh beli aset sendiri
  if (currentUserId === stock.userId) {
    throw new BadRequestException("You cannot buy your own asset");
  }

  // 4. Validasi: Tidak boleh beli aset yang sudah dimiliki
  const existingPurchase = await prisma.transaction.findFirst({
    where: {
      userId: currentUserId,
      stockId: input.stockId,
      type: TransactionType.BUY_ASSET,
      status: PaymentStatus.PAID,
    },
  });
  if (existingPurchase) {
    throw new BadRequestException("You already own this asset");
  }

  const priceInCredit = Number(stock.price);

  // 5. Kalkulasi ke USD (cents) untuk Polar Gateway
  // Polar mengharuskan `priceAmount` dalam bentuk integer cents (misal $1 = 100)
  const priceInCents = Math.round(
    convertCreditToRealCurrency(priceInCredit, "USD") * 100,
  );

  // 6. Buat rekam transaksi awal (Pending) di database
  const transaction = await prisma.transaction.create({
    data: {
      userId: currentUserId,
      targetUserId: stock.userId,
      stockId: stock.id,
      type: TransactionType.BUY_ASSET,
      status: PaymentStatus.PENDING,
      amount: priceInCents,
      amountCurrency: "USD",
      creditAmount: priceInCredit,
      paymentMethod: "polar",
    },
  });

  // 7. Tentukan atau Buat Produk Polar (jika belum ada atau harga berubah)
  let polarProductId = stock.polarProductId;

  if (polarProductId) {
    try {
      const product = await polar.products.get({ id: polarProductId });
      const prices = (product as any).prices || [];
      const hasMatchingPrice = prices.some(
        (p: any) => p.amountType === "fixed" && p.priceAmount === priceInCents,
      );

      // Jika harga sudah berubah, kita butuh membuat produk baru
      if (!hasMatchingPrice) {
        polarProductId = null;
      }
    } catch (error) {
      console.error("Failed to fetch Polar product:", error);
      polarProductId = null; // force recreation
    }
  }

  if (!polarProductId) {
    const title =
      stock.title.length > 55
        ? stock.title.substring(0, 52) + "..."
        : stock.title;
    const newPolarProduct = await polar.products.create({
      name: `Asset: ${title}`.substring(0, 64),
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

    // Simpan produk ID terbaru ke aset
    await prisma.stock.update({
      where: { id: stock.id },
      data: { polarProductId },
    });
  }

  // 8. Buat sesi Checkout di Polar API
  const checkout = await polar.checkouts.create({
    products: [polarProductId],
    customerEmail: user.email,
    customerName: user.name,
    externalCustomerId: user.id,
    embedOrigin: config.CLIENT_URL as string, // Agar user diarahkan kembali ke aplikasi setelah bayar
    allowDiscountCodes: false,
    customerIpAddress: ipAddress,
    metadata: {
      transactionId: transaction.id, // Sisipkan ID transaksi lokal agar dikenali saat webhook masuk
    },
  });

  // 9. Update Transaksi dengan External ID (ID Checkout Polar)
  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { externalId: checkout.id, paymentMethod: "polar" },
  });

  // 10. Kembalikan ID transaksi lokal beserta URL checkout Polar ke Client
  return {
    transactionId: transaction.id,
    polarCheckoutUrl: checkout.url,
  };
};
