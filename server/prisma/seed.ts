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
      name: "On-Demand (48-Hour Pass)",
      slug: "on-demand-48h",
      price: 25000,
      currency: "IDR",
      durationDays: 2,
      premiumQuota: 5,
      dailyFreeLimit: 9999, // Unlimited
      licenseType: LicenseType.STANDARD,
      maxDevices: 1,
      downloadSpeed: "STANDARD",
      isBestValue: false,
      features: [
        "5 Premium Downloads (Max)",
        "Unlimited Free Stock Access",
        "Standard Commercial License",
        "No Attribution Required",
        "Standard Speed (~1 MBps)",
        "1 Active Device",
      ],
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
      features: [
        "20 Premium Downloads / month",
        "Unlimited Free Stock Access",
        "Standard Commercial License",
        "No Attribution Required",
        "Ad-Free Experience",
        "Standard Download Speed",
        "1 Active Device",
      ],
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
      features: [
        "100 Premium Downloads / month",
        "Unlimited Free Stock Access",
        "Standard Commercial License",
        "No Attribution Required",
        "Priority High-Speed Server",
        "Priority Email Support (< 24h)",
        "2 Concurrent Devices (Laptop & PC)",
      ],
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
      features: [
        "350 Premium Downloads / month",
        "Unlimited Free Stock Access",
        "Extended Commercial License",
        "No Attribution Required",
        "Priority High-Speed Server",
        "VIP Support (Live Chat & WhatsApp)",
        "Team Seat: 5 Concurrent Devices",
      ],
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
