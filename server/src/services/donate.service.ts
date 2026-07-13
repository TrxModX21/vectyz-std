import {
  NotificationType,
  PaymentStatus,
  TransactionType,
} from "../generated/prisma/enums";
import { createSnapTransaction } from "../lib/midtrans";
import { polar } from "../lib/polar";
import prisma from "../lib/prisma";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { config } from "../utils/app.config";
import { convertCreditToRealCurrency } from "../utils/helper";
import { DonateCreditGatewayType } from "../validation/donate.validation";
import { createNotification } from "./notification.service";

export const donateCreditGatewayService = async (
  currentUserId: string,
  input: DonateCreditGatewayType,
) => {
  // Menggunakan database transaction agar jika salah satu proses gagal, semuanya otomatis di-rollback
  return await prisma.$transaction(async (tx) => {
    // 1. Pengecekan eksistensi User (Pembeli/Donatur)
    const user = await tx.user.findUnique({ where: { id: currentUserId } });
    if (!user) throw new NotFoundException("User not found");

    // 2. Pengecekan eksistensi Target User (Kreator yang menerima donasi)
    const targetUser = await tx.user.findUnique({
      where: { id: input.targetUserId },
    });
    if (!targetUser) throw new NotFoundException("Target user not found");

    // 3. Pengecekan eksistensi Stock (Aset yang terkait dengan donasi)
    const stock = await tx.stock.findUnique({ where: { id: input.stockId } });
    if (!stock) throw new NotFoundException("Stock not found");

    // 4. Validasi: Tidak boleh donasi ke akun sendiri
    if (currentUserId === input.targetUserId) {
      throw new BadRequestException("You cannot donate to yourself");
    }

    // 5. Validasi: Pastikan saldo donatur mencukupi
    if (user.creditBalance.lt(input.creditAmount)) {
      throw new BadRequestException("Insufficient credit balance");
    }

    // 6. Logika pemotongan saldo (Purchased vs Earned)
    // Aturan bisnis: Saldo hasil top up (Purchased) selalu diprioritaskan untuk dipotong.
    // Jika tidak cukup, sisa kekurangannya baru dipotong dari saldo hasil jualan (Earned).
    const userPurchased = Number(user.purchasedCredit);
    let deductPurchased = 0;
    let deductEarned = 0;

    if (userPurchased >= input.creditAmount) {
      deductPurchased = input.creditAmount;
    } else {
      deductPurchased = userPurchased;
      deductEarned = input.creditAmount - userPurchased;
    }

    // Eksekusi pemotongan saldo donatur di database
    await tx.user.update({
      where: { id: currentUserId },
      data: {
        creditBalance: { decrement: input.creditAmount },
        purchasedCredit: { decrement: deductPurchased },
        earnedCredit: { decrement: deductEarned },
      },
    });

    // 7. Distribusi Bagi Hasil (Revenue Share)
    // 95% untuk Kreator, 5% untuk Platform/Admin
    const creatorShareCredit = input.creditAmount * 0.95;
    const platformShare = input.creditAmount - creatorShareCredit;

    // Tambahkan saldo bersih (95%) ke Kreator sebagai earnedCredit (bisa ditarik tunai)
    await tx.user.update({
      where: { id: input.targetUserId },
      data: {
        creditBalance: { increment: creatorShareCredit },
        earnedCredit: { increment: creatorShareCredit },
      },
    });

    // Tambahkan potongan (5%) ke saldo Platform (jika ID Admin di-set di config)
    if (config.PLATFORM_FEE_USER_ID) {
      await tx.user.update({
        where: { id: config.PLATFORM_FEE_USER_ID },
        data: {
          creditBalance: { increment: platformShare },
          earnedCredit: { increment: platformShare },
        },
      });
    }

    // 8. Pencatatan Histori Transaksi (Untuk Pembeli)
    // Tipe DONATION: Menandakan pengeluaran dari sisi pembeli
    const transaction = await tx.transaction.create({
      data: {
        userId: currentUserId,
        targetUserId: input.targetUserId,
        stockId: stock.id,
        type: TransactionType.DONATION,
        status: PaymentStatus.PAID,
        amount:
          input.currency === "IDR"
            ? convertCreditToRealCurrency(input.creditAmount, "IDR") // Rupiah asli
            : Math.round(
                convertCreditToRealCurrency(input.creditAmount, "USD") * 100, // Disimpan dalam bentuk cents
              ),
        amountCurrency: input.currency,
        creditAmount: input.creditAmount,
        paymentMethod: "CREDIT_BALANCE",
      },
    });

    // 9. Pencatatan Histori Transaksi (Untuk Kreator)
    // Tipe EARNING_DONATION: Menandakan pemasukan bersih ke sisi kreator
    await tx.transaction.create({
      data: {
        userId: input.targetUserId, // Pemilik aset
        targetUserId: currentUserId, // Yang mendonasi
        stockId: stock.id,
        type: TransactionType.EARNING_DONATION,
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

    // Notify the receiver
    await createNotification({
      userId: input.targetUserId,
      type: NotificationType.DONATION_RECEIVED,
      title: "You received a coffee! ☕",
      message: `${user.name} just sent you ${creatorShareCredit} credits.`,
      sourceUserId: currentUserId,
      stockId: input.stockId,
      recipientEmail: targetUser.email,
    });

    // 11. Pencatatan Histori Transaksi (Untuk Platform/Admin)
    // Tipe PLATFORM_FEE: Menandakan komisi 5% yang diambil platform
    if (config.PLATFORM_FEE_USER_ID) {
      await tx.transaction.create({
        data: {
          userId: config.PLATFORM_FEE_USER_ID, // Platform ID
          targetUserId: input.targetUserId,
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

    // Kembalikan data transaksi pembeli sebagai hasil akhir request
    return transaction;
  });
};

export const donatePolarGatewayService = async (
  currentUserId: string,
  input: DonateCreditGatewayType,
  ipAddress: string,
) => {
  // Menggunakan database transaction agar jika salah satu proses gagal, semuanya otomatis di-rollback
  return await prisma.$transaction(async (tx) => {
    // 1. Pengecekan eksistensi User (Pembeli/Donatur)
    const user = await tx.user.findUnique({ where: { id: currentUserId } });
    if (!user) throw new NotFoundException("User not found");

    // 2. Pengecekan eksistensi Target User (Kreator yang menerima donasi)
    const targetUser = await tx.user.findUnique({
      where: { id: input.targetUserId },
    });
    if (!targetUser) throw new NotFoundException("Target user not found");

    // 3. Pengecekan eksistensi Stock (Aset yang terkait dengan donasi)
    const stock = await tx.stock.findUnique({ where: { id: input.stockId } });
    if (!stock) throw new NotFoundException("Stock not found");

    // 4. Validasi: Tidak boleh donasi ke akun sendiri
    if (currentUserId === input.targetUserId) {
      throw new BadRequestException("You cannot donate to yourself");
    }

    // 5. Buat rekam transaksi awal (Pending)
    // Nominal yang disimpan dikonversi ke USD lalu dikalikan 100 agar menjadi satuan cents
    const transaction = await tx.transaction.create({
      data: {
        userId: currentUserId,
        targetUserId: input.targetUserId,
        stockId: stock.id,
        type: TransactionType.DONATION,
        status: PaymentStatus.PENDING,
        amount: Math.round(
          convertCreditToRealCurrency(input.creditAmount, "USD") * 100, // Disimpan dalam bentuk cents
        ),
        amountCurrency: "USD",
        creditAmount: input.creditAmount,
        paymentMethod: "polar",
      },
    });

    // 6. Validasi ketersediaan Product ID Polar di environment variables
    if (!config.POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID) {
      throw new Error(
        "POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID is not configured",
      );
    }

    // 7. Buat sesi Checkout di Polar API
    const checkout = await polar.checkouts.create({
      products: [config.POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID as string],
      amount: Math.round(
        convertCreditToRealCurrency(input.creditAmount, "USD") * 100, // Harus sama persis dengan amount di transaksi (dalam cents)
      ),
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

    // 8. Update Transaksi dengan External ID (ID Checkout Polar)
    await tx.transaction.update({
      where: { id: transaction.id },
      data: { externalId: checkout.id },
    });

    // 9. Kembalikan ID transaksi lokal beserta URL checkout Polar ke Client
    return {
      transactionId: transaction.id,
      checkoutUrl: checkout.url,
    };
  });
};

export const donateMidtransGatewayService = async (
  currentUserId: string,
  input: DonateCreditGatewayType,
) => {
  // Menggunakan database transaction agar jika terjadi error, otomatis di-rollback
  return await prisma.$transaction(async (tx) => {
    // 1. Pengecekan eksistensi User (Pembeli/Donatur)
    const user = await tx.user.findUnique({ where: { id: currentUserId } });
    if (!user) throw new NotFoundException("User not found");

    // 2. Pengecekan eksistensi Target User (Kreator yang menerima donasi)
    const targetUser = await tx.user.findUnique({
      where: { id: input.targetUserId },
    });
    if (!targetUser) throw new NotFoundException("Target user not found");

    // 3. Pengecekan eksistensi Stock (Aset yang terkait dengan donasi)
    const stock = await tx.stock.findUnique({ where: { id: input.stockId } });
    if (!stock) throw new NotFoundException("Stock not found");

    // 4. Validasi: Tidak boleh donasi ke akun sendiri
    if (currentUserId === input.targetUserId) {
      throw new BadRequestException("You cannot donate to yourself");
    }

    // 5. Konversi kredit ke IDR (Rupiah) karena Midtrans hanya menerima Rupiah
    const amountInIdr = Math.round(
      convertCreditToRealCurrency(input.creditAmount, "IDR"),
    );

    // 6. Buat rekam transaksi awal (Pending) di database
    const transaction = await tx.transaction.create({
      data: {
        userId: currentUserId,
        targetUserId: input.targetUserId,
        stockId: stock.id,
        type: TransactionType.DONATION,
        status: PaymentStatus.PENDING,
        amount: amountInIdr, // Disimpan dalam Rupiah
        amountCurrency: "IDR",
        creditAmount: input.creditAmount, // Source of truth donasi
        paymentMethod: "midtrans",
      },
    });

    // 7. Request Snap Token ke Midtrans
    const snap = await createSnapTransaction({
      order_id: transaction.id,
      gross_amount: amountInIdr,
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
      item_details: [
        {
          id: "DONATION",
          price: amountInIdr,
          quantity: 1,
          name: `Donation to ${targetUser.name}`,
        },
      ],
    });

    // 8. Update Transaksi dengan External ID (Token Snap Midtrans)
    await tx.transaction.update({
      where: { id: transaction.id },
      data: { snapToken: snap.token, externalId: snap.token },
    });

    // 9. Kembalikan ID transaksi lokal beserta Snap Token dan Redirect URL ke Client
    return {
      transactionId: transaction.id,
      snapToken: snap.token,
      redirectUrl: snap.redirect_url,
    };
  });
};
