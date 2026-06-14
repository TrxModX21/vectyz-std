// RUN THIS FILE WITH THIS COMMAND:
// npx ts-node-dev --transpile-only prisma/reset-transactions.ts

import { config } from "../src/utils/app.config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${config.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting reset for Transactions and Monthly Pool...");

  // 1. Delete all records from MonthlyPool
  const deletedPools = await prisma.monthlyPool.deleteMany({});
  console.log(`✅ Deleted ${deletedPools.count} records from MonthlyPool.`);

  // 2. Delete all records from Transaction
  const deletedTransactions = await prisma.transaction.deleteMany({});
  console.log(
    `✅ Deleted ${deletedTransactions.count} records from Transaction.`,
  );

  // 3. (OPSIONAL) Reset saldo pengguna jika diperlukan
  // Karena riwayat transaksi dihapus, saldo (uang) milik user mungkin menjadi tidak valid
  // Uncomment kode di bawah ini jika kamu juga ingin meng-nol-kan dompet semua user

  const resetUsers = await prisma.user.updateMany({
    data: {
      creditBalance: 0,
      purchasedCredit: 0,
      earnedCredit: 0,
    },
  });
  console.log(`✅ Reset credit balances for ${resetUsers.count} users to 0.`);

  // 4. (OPSIONAL) Hapus Riwayat Payout dan Download History jika ini reset total ekonomi
  /*
  const deletedPayouts = await prisma.payout.deleteMany({});
  console.log(`✅ Deleted ${deletedPayouts.count} records from Payout.`);

  const deletedDownloadHistory = await prisma.downloadHistory.deleteMany({});
  console.log(`✅ Deleted ${deletedDownloadHistory.count} records from DownloadHistory.`);
  */

  console.log("🎉 Reset completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
