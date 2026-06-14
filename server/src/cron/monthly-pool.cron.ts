import cron from "node-cron";
import prisma from "../lib/prisma";
import { PaymentStatus, TransactionType } from "../generated/prisma/client";

export const distributeMonthlyPool = async () => {
  console.log("[CRON] Starting Monthly Pool Distribution...");

  try {
    const now = new Date();
    // Kita jalankan cron ini di tanggal 1. Jadi kita ambil data bulan sebelumnya.
    // Jika sekarang Februari (1), maka target kita Januari (0)
    let targetMonth = now.getMonth(); // 0-11, jadi getMonth() sudah mewakili bulan sebelumnya (karena bulan 1-12)
    let targetYear = now.getFullYear();

    // Jika sekarang Januari (0), maka target kita Desember (12) tahun sebelumnya
    if (targetMonth === 0) {
      targetMonth = 12;
      targetYear -= 1;
    }

    // Cari pool bulan lalu yang belum didistribusikan
    const pool = await prisma.monthlyPool.findUnique({
      where: {
        month_year: {
          month: targetMonth,
          year: targetYear,
        },
      },
    });

    if (!pool) {
      console.log(`[CRON] No pool found for ${targetMonth}/${targetYear}.`);
      return;
    }

    if (pool.isDistributed) {
      console.log(
        `[CRON] Pool for ${targetMonth}/${targetYear} is already distributed.`,
      );
      return;
    }

    const premiumPoolAmount = Number(pool.premiumPoolAmount);
    const freePoolAmount = Number(pool.freePoolAmount);

    if (premiumPoolAmount <= 0 && freePoolAmount <= 0) {
      console.log("[CRON] Pool amount is 0, marking as distributed.");
      await prisma.monthlyPool.update({
        where: { id: pool.id },
        data: { isDistributed: true },
      });
      return;
    }

    // Dapatkan batas waktu bulan lalu
    const startOfLastMonth = new Date(targetYear, targetMonth - 1, 1);
    const endOfLastMonth = new Date(
      targetYear,
      targetMonth,
      0,
      23,
      59,
      59,
      999,
    );

    // Ambil semua riwayat download bulan lalu yang valid untuk pool (didownload oleh user Premium)
    const validDownloads = await prisma.downloadHistory.findMany({
      where: {
        downloadDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
        isUserPremium: true, // Hanya download dari user premium yang menyumbang ke pool
      },
      include: {
        stock: {
          select: {
            userId: true, // ID Kreator
          },
        },
      },
    });

    if (validDownloads.length === 0) {
      console.log(
        "[CRON] No valid downloads found for pool sharing. Marking as distributed.",
      );
      await prisma.monthlyPool.update({
        where: { id: pool.id },
        data: { isDistributed: true },
      });
      return;
    }

    // Menghitung total download global
    let totalPremiumDownloads = 0;
    let totalFreeDownloads = 0;

    // Mapping jumlah download per kreator
    // creatorId -> { premium: count, free: count }
    const creatorStats: Record<string, { premium: number; free: number }> = {};

    for (const dl of validDownloads) {
      const creatorId = dl.stock.userId;
      if (!creatorStats[creatorId]) {
        creatorStats[creatorId] = { premium: 0, free: 0 };
      }

      if (dl.isStockPremium) {
        totalPremiumDownloads++;
        creatorStats[creatorId].premium++;
      } else {
        totalFreeDownloads++;
        creatorStats[creatorId].free++;
      }
    }

    // Siapkan transaksi database
    const operations: any[] = [];

    // Hitung share untuk masing-masing kreator
    for (const [creatorId, stats] of Object.entries(creatorStats)) {
      let earned = 0;

      if (totalPremiumDownloads > 0) {
        earned += (stats.premium / totalPremiumDownloads) * premiumPoolAmount;
      }
      if (totalFreeDownloads > 0) {
        earned += (stats.free / totalFreeDownloads) * freePoolAmount;
      }

      if (earned > 0) {
        const finalCredit = Math.floor(earned * 100) / 100; // Pembulatan 2 desimal

        // 1. Tambah saldo kreator
        operations.push(
          prisma.user.update({
            where: { id: creatorId },
            data: {
              creditBalance: { increment: finalCredit },
              earnedCredit: { increment: finalCredit },
            },
          }),
        );

        // 2. Buat record transaksi POOL_EARNING
        operations.push(
          prisma.transaction.create({
            data: {
              userId: creatorId,
              type: TransactionType.POOL_EARNING,
              amount: finalCredit * 1000, // Rupiah equivalent
              creditAmount: finalCredit,
              status: PaymentStatus.PAID,
              paymentMethod: "SYSTEM",
              externalId: `POOL-${targetYear}-${targetMonth}`,
            },
          }),
        );
      }
    }

    // Update state pool
    operations.push(
      prisma.monthlyPool.update({
        where: { id: pool.id },
        data: {
          isDistributed: true,
          totalPremiumDownloads,
          totalFreeDownloads,
        },
      }),
    );

    // Eksekusi semua operasi dalam satu transaksi atomic
    await prisma.$transaction(operations);

    console.log(
      `[CRON] Successfully distributed pool for ${targetMonth}/${targetYear}!`,
    );
  } catch (error) {
    console.error("[CRON] Error distributing monthly pool:", error);
  }
};

export const initCronJobs = () => {
  // Jadwal: Menit 0, Jam 1, Tanggal 1, Tiap Bulan, Tiap Hari (0 1 1 * *)
  cron.schedule(
    "0 1 1 * *",
    () => {
      distributeMonthlyPool();
    },
    {
      timezone: "Asia/Jakarta",
    },
  );

  console.log("[CRON] Jobs initialized.");
};
