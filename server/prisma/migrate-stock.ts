// RUN THIS FILE WITH THIS COMMAND:
// npx ts-node-dev --transpile-only prisma/migrate-stock.ts

import { config } from "../src/utils/app.config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${config.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting stock price migration from IDR to Credit...");

  // Kita gunakan ORM Prisma secara manual agar lebih aman
  // dan mencegah error double-run (jika script ter-run 2x)
  const stocks = await prisma.stock.findMany({
    where: { price: { gt: 0 } },
  });

  let updatedCount = 0;

  for (const stock of stocks) {
    const currentPrice = Number(stock.price);

    // Hanya proses jika harga di atas atau sama dengan 1000
    // Ini mencegah harga yang sudah Credit (misal 25) dibagi 1000 lagi jadi 0.025
    if (currentPrice >= 1000) {
      const newPrice = Math.floor(currentPrice / 1000);
      await prisma.stock.update({
        where: { id: stock.id },
        data: { price: newPrice },
      });
      console.log(
        `Updated stock ${stock.id}: ${currentPrice} IDR -> ${newPrice} Credit`,
      );
      updatedCount++;
    } else {
      console.log(
        `Skipped stock ${stock.id}: price is already ${currentPrice}`,
      );
    }
  }

  console.log(
    `Migration completed! Successfully updated ${updatedCount} stocks.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
