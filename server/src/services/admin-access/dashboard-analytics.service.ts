import prisma from "../../lib/prisma";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient();

export const getOverviewStatsService = async () => {
  // 1. Total Vectolio Revenue (Sum of creditAmount from successful transactions)
  const totalRevenueAggr = await prisma.transaction.aggregate({
    _sum: {
      creditAmount: true,
    },
    where: {
      status: "PAID",
      type: "PLATFORM_FEE",
    },
  });
  const totalRevenue = Number(totalRevenueAggr._sum.creditAmount || 0);

  // 2. Total Success Transactions
  const totalSuccessTransactions = await prisma.transaction.count({
    where: {
      status: "PAID",
      type: {
        in: ["TOPUP_CREDIT", "SUBSCRIPTION", "BUY_ASSET", "DONATION"],
      },
    },
  });

  // 3. Total Vectyzen (exclude admins)
  const totalVectyzen = await prisma.user.count({
    where: {
      role: {
        not: "admin",
      },
    },
  });

  // 4. Credit Pool This Month
  const now = new Date();
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

  const creditPool = monthlyPool
    ? Number(monthlyPool.premiumPoolAmount) + Number(monthlyPool.freePoolAmount)
    : 0;

  return {
    totalRevenue,
    totalSuccessTransactions,
    totalVectyzen,
    creditPool,
  };
};

export const getRecentSalesService = async () => {
  const recentSales = await prisma.transaction.findMany({
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
        },
      },
    },
    where: {
      type: {
        in: ["TOPUP_CREDIT", "SUBSCRIPTION", "BUY_ASSET", "DONATION"],
      },
    },
  });

  return recentSales;
};

export const getTopAssetsAnalyticsService = async (
  tier: "free" | "premium" | "all" = "all",
) => {
  // 1. Dapatkan 5 ID teratas berdasarkan skor kustom menggunakan SQL murni
  // Formula: Score = (totalViews * 1) + (totalLikes * 3) + (totalDownloads * 10)

  let rawIds: { id: string }[];

  if (tier === "free") {
    rawIds = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id 
      FROM stock 
      WHERE "status" = 'APPROVED' 
        AND "deletedAt" IS NULL 
        AND "isPremium" = false
      ORDER BY (("totalViews" * 1) + ("totalLikes" * 3) + ("totalDownloads" * 10)) DESC
      LIMIT 5
    `;
  } else if (tier === "premium") {
    rawIds = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id 
      FROM stock 
      WHERE "status" = 'APPROVED' 
        AND "deletedAt" IS NULL 
        AND "isPremium" = true
      ORDER BY (("totalViews" * 1) + ("totalLikes" * 3) + ("totalDownloads" * 10)) DESC
      LIMIT 5
    `;
  } else {
    rawIds = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id 
      FROM stock 
      WHERE "status" = 'APPROVED' 
        AND "deletedAt" IS NULL
      ORDER BY (("totalViews" * 1) + ("totalLikes" * 3) + ("totalDownloads" * 10)) DESC
      LIMIT 5
    `;
  }

  const ids = rawIds.map((row) => row.id);

  if (ids.length === 0) return [];

  // 2. Ambil data lengkap dari ID tersebut
  const assets = await prisma.stock.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
      files: {
        where: {
          purpose: "PREVIEW",
        },
        select: {
          url: true,
        },
      },
    },
  });

  // 3. Urutkan kembali hasil findMany agar sesuai dengan urutan skor dari raw query
  const sortedAssets = ids
    .map((id) => assets.find((asset) => asset.id === id))
    .filter(Boolean);

  return sortedAssets;
};

export const getTopVectyzenAnalyticsService = async () => {
  // 1. Ambil 5 ID User teratas menggunakan SQL murni dengan pembobotan
  // Formula: Score = (Total Downloads * 10) + (Total Followers * 5) + (Total Likes * 3)
  const rawIds = await prisma.$queryRaw<{ id: string }[]>`
    SELECT u.id 
    FROM "user" u
    LEFT JOIN stock s ON s."userId" = u.id AND s."status" = 'APPROVED' AND s."deletedAt" IS NULL
    GROUP BY u.id
    ORDER BY (
      (COALESCE(SUM(s."totalDownloads"), 0) * 10) + 
      (u."totalFollowers" * 5) + 
      (COALESCE(SUM(s."totalLikes"), 0) * 3)
    ) DESC
    LIMIT 5
  `;

  const ids = rawIds.map((row) => row.id);

  if (ids.length === 0) return [];

  // 2. Ambil data lengkap User berdasarkan urutan ID pemenang
  const contributors = await prisma.user.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      role: true,
      totalFollowers: true,
      uploadedStocks: {
        where: {
          status: "APPROVED",
          deletedAt: null,
        },
        select: {
          totalDownloads: true,
          totalLikes: true,
        }
      }
    },
  });

  // 3. Mapping dan urutkan kembali, serta totalkan nilainya untuk ditampilkan
  const sortedContributors = ids
    .map((id) => {
      const user = contributors.find((c) => c.id === id);
      if (!user) return null;

      // Hitung agregasi tambahan jika dibutuhkan frontend
      const totalDownloads = user.uploadedStocks.reduce((acc, curr) => acc + curr.totalDownloads, 0);
      const totalLikes = user.uploadedStocks.reduce((acc, curr) => acc + curr.totalLikes, 0);

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        role: user.role,
        totalFollowers: user.totalFollowers,
        totalDownloads,
        totalLikes,
        totalAssets: user.uploadedStocks.length,
      };
    })
    .filter(Boolean);

  return sortedContributors;
};

export const getTrafficAnalyticsService = async (period: string = "Last 7 days") => {
  if (!process.env.GA_PROPERTY_ID) {
    return { totalSessions: 0, totalActiveUsers: 0, rows: [] };
  }
  
  const propertyId = process.env.GA_PROPERTY_ID;
  
  let startDate = "7daysAgo";
  if (period === "Last 30 days") startDate = "30daysAgo";
  if (period === "Last 90 days") startDate = "90daysAgo";
  if (period === "All time") startDate = "2020-01-01";

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate: "today",
        },
      ],
      dimensions: [
        { name: "sessionDefaultChannelGroup" },
        { name: "deviceCategory" }
      ],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" }
      ],
    });

    let totalSessions = 0;
    let totalActiveUsers = 0;
    
    const rows = response.rows?.map(row => {
      const channel = row.dimensionValues?.[0].value || "Unknown";
      const device = row.dimensionValues?.[1].value || "Unknown";
      const sessions = parseInt(row.metricValues?.[0].value || "0", 10);
      const activeUsers = parseInt(row.metricValues?.[1].value || "0", 10);
      
      totalSessions += sessions;
      totalActiveUsers += activeUsers;
      
      return { channel, device, sessions, activeUsers };
    }) || [];
    
    return {
      totalSessions,
      totalActiveUsers,
      rows
    };
  } catch (error) {
    console.error("GA4 Traffic Error:", error);
    return { totalSessions: 0, totalActiveUsers: 0, rows: [] };
  }
};

export const getGeoAnalyticsService = async (period: string = "Last 7 days") => {
  if (!process.env.GA_PROPERTY_ID) {
    return [];
  }
  
  const propertyId = process.env.GA_PROPERTY_ID;
  
  let startDate = "7daysAgo";
  if (period === "Last 30 days") startDate = "30daysAgo";
  if (period === "All time") startDate = "2020-01-01";

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate: "today",
        },
      ],
      dimensions: [
        { name: "country" }
      ],
      metrics: [
        { name: "sessions" }
      ],
    });

    const rows = response.rows?.map(row => {
      const country = row.dimensionValues?.[0].value || "Unknown";
      const sessions = parseInt(row.metricValues?.[0].value || "0", 10);
      return { country, sessions };
    }).filter(row => row.country !== "(not set)") || [];
    
    return rows;
  } catch (error) {
    console.error("GA4 Geo Error:", error);
    return [];
  }
};
