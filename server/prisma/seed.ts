import { PrismaPg } from "@prisma/adapter-pg";
import { LicenseType, PrismaClient } from "../src/generated/prisma/client";
import { config } from "../src/utils/app.config";

const connectionString = `${config.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Start seeding Plans...");

  const plans = [
    {
      name: "Ngecer (48-Hour Pass)",
      slug: "ngecer-48h",
      price: 25000,
      currency: "IDR",
      durationDays: 2,
      premiumQuota: 5,
      dailyFreeLimit: 9999, // Unlimited
      licenseType: LicenseType.STANDARD,
      maxDevices: 1,
      downloadSpeed: "STANDARD",
      isBestValue: false,
    },
    {
      name: "Creator (Monthly)",
      slug: "creator-monthly",
      price: 79000,
      currency: "IDR",
      durationDays: 30,
      premiumQuota: 20,
      dailyFreeLimit: 9999,
      licenseType: LicenseType.STANDARD,
      maxDevices: 1,
      downloadSpeed: "STANDARD",
      isBestValue: false,
    },
    {
      name: "Professional (Monthly)",
      slug: "professional-monthly",
      price: 199000,
      currency: "IDR",
      durationDays: 30,
      premiumQuota: 100,
      dailyFreeLimit: 9999,
      licenseType: LicenseType.STANDARD,
      maxDevices: 2,
      downloadSpeed: "HIGH",
      isBestValue: true, // Best Value
    },
    {
      name: "Agency (Monthly)",
      slug: "agency-monthly",
      price: 499000,
      currency: "IDR",
      durationDays: 30,
      premiumQuota: 350,
      dailyFreeLimit: 9999,
      licenseType: LicenseType.EXTENDED, // Extended License
      maxDevices: 5,
      downloadSpeed: "HIGH",
      isBestValue: false,
    },
  ];

  for (const plan of plans) {
    const result = await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
    console.log(`✅ Upserted plan: ${result.name}`);
  }

  console.log("🚀 Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
