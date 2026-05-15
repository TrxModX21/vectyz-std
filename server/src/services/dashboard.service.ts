import prisma from "../lib/prisma";
import { NotFoundException } from "../utils/app-error";
import { TransactionType } from "../generated/prisma/client";

export const getAnalyticsService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  });

  if (!user) throw new NotFoundException("User not found");

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const sixMonthsAgoStart = new Date(now.getFullYear(), now.getMonth() - 5, 1); // 6 months including current

  // --- 1. METRICS & OVERVIEW ---
  // A. Earnings (Transaction: EARNING_ASSET, POOL_EARNING)
  const earningWhereCurrent = {
    userId,
    type: { in: [TransactionType.EARNING_ASSET, TransactionType.POOL_EARNING] },
    createdAt: { gte: currentMonthStart },
  };
  const earningWherePrevious = {
    userId,
    type: { in: [TransactionType.EARNING_ASSET, TransactionType.POOL_EARNING] },
    createdAt: { gte: previousMonthStart, lt: currentMonthStart },
  };

  // B. Downloads (DownloadHistory)
  const downloadWhereCurrent = {
    stock: { userId },
    downloadDate: { gte: currentMonthStart },
  };
  const downloadWherePrevious = {
    stock: { userId },
    downloadDate: { gte: previousMonthStart, lt: currentMonthStart },
  };

  // C. Active Assets (Stock)
  const activeAssetsWhereCurrent = {
    userId,
    status: "APPROVED" as any,
    createdAt: { lte: now }, // current total active assets
  };
  const activeAssetsWherePrevious = {
    userId,
    status: "APPROVED" as any,
    createdAt: { lt: currentMonthStart }, // total active assets until end of last month
  };

  // D. Profile Views (StockView)
  const viewWhereCurrent = {
    stock: { userId },
    createdAt: { gte: currentMonthStart },
  };
  const viewWherePrevious = {
    stock: { userId },
    createdAt: { gte: previousMonthStart, lt: currentMonthStart },
  };

  // Execute Count & Aggregate in Parallel
  const [
    earningsAllTime,
    earningsCurrent,
    earningsPrevious,
    downloadsAllTime,
    downloadsCurrent,
    downloadsPrevious,
    assetsCurrent,
    assetsPrevious,
    viewsAllTime,
    viewsCurrent,
    viewsPrevious,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        type: { in: [TransactionType.EARNING_ASSET, TransactionType.POOL_EARNING] },
      },
      _sum: { creditAmount: true },
    }),
    prisma.transaction.aggregate({ where: earningWhereCurrent, _sum: { creditAmount: true } }),
    prisma.transaction.aggregate({ where: earningWherePrevious, _sum: { creditAmount: true } }),
    prisma.stock.aggregate({ where: { userId }, _sum: { totalDownloads: true } }),
    prisma.downloadHistory.count({ where: downloadWhereCurrent }),
    prisma.downloadHistory.count({ where: downloadWherePrevious }),
    prisma.stock.count({ where: activeAssetsWhereCurrent }),
    prisma.stock.count({ where: activeAssetsWherePrevious }),
    prisma.stock.aggregate({ where: { userId }, _sum: { totalViews: true } }),
    prisma.stockView.count({ where: viewWhereCurrent }),
    prisma.stockView.count({ where: viewWherePrevious }),
  ]);

  // Calculations
  const calcChangePercent = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const allTimeEarnCredits = Number(earningsAllTime._sum.creditAmount || 0);
  const currEarnCredits = Number(earningsCurrent._sum.creditAmount || 0);
  const prevEarnCredits = Number(earningsPrevious._sum.creditAmount || 0);

  // --- 2. CHARTS DATA (Last 6 Months) ---
  const sixMonthsTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: { in: [TransactionType.EARNING_ASSET, TransactionType.POOL_EARNING] },
      createdAt: { gte: sixMonthsAgoStart },
    },
    select: { createdAt: true, creditAmount: true },
  });

  const sixMonthsDownloads = await prisma.downloadHistory.findMany({
    where: {
      stock: { userId },
      downloadDate: { gte: sixMonthsAgoStart },
    },
    select: { downloadDate: true },
  });

  // Grouping by Month in JS
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const chartData: { month: string; year: number; earnings: number; downloads: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = monthNames[d.getMonth()];
    chartData.push({ month: monthKey, year: d.getFullYear(), earnings: 0, downloads: 0 });
  }

  sixMonthsTransactions.forEach((tx) => {
    const monthKey = monthNames[tx.createdAt.getMonth()];
    const year = tx.createdAt.getFullYear();
    const target = chartData.find((c) => c.month === monthKey && c.year === year);
    if (target) {
      target.earnings += Number(tx.creditAmount || 0);
    }
  });

  sixMonthsDownloads.forEach((dl) => {
    const monthKey = monthNames[dl.downloadDate.getMonth()];
    const year = dl.downloadDate.getFullYear();
    const target = chartData.find((c) => c.month === monthKey && c.year === year);
    if (target) {
      target.downloads += 1;
    }
  });

  // --- 3. RECENT ACTIVITY ---
  // Download Activity
  const recentDownloads = await prisma.downloadHistory.findMany({
    where: { stock: { userId } },
    orderBy: { downloadDate: "desc" },
    take: 5,
    include: { stock: { select: { title: true } } },
  });

  // Sale/Earning Activity
  const recentEarnings = await prisma.transaction.findMany({
    where: {
      userId,
      type: { in: [TransactionType.EARNING_ASSET, TransactionType.POOL_EARNING] },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { stock: { select: { title: true } } },
  });

  const combinedActivity = [
    ...recentDownloads.map((d) => ({
      id: d.id,
      type: "DOWNLOAD",
      title: "Asset Downloaded",
      description: d.stock.title,
      date: d.downloadDate,
    })),
    ...recentEarnings.map((e) => ({
      id: e.id,
      type: "SALE",
      title: e.type === TransactionType.EARNING_ASSET ? "Sale Completed" : "Pool Earning",
      description: e.stock?.title || "System",
      date: e.createdAt,
    })),
  ];

  combinedActivity.sort((a, b) => b.date.getTime() - a.date.getTime());
  const finalRecentActivity = combinedActivity.slice(0, 5).map(act => ({
    ...act,
    date: act.date.toISOString(),
  }));

  const formatEarning = (credits: number) => ({
    totalCredits: credits,
    fiat: {
      IDR: credits * 1000,
      USD: credits * 0.065,
    }
  });

  return {
    overview: {
      credits: Number(user.creditBalance),
      plan: {
        name: user.isPremium ? (user.plan?.name || "Premium") : "Free",
        renewalDate: user.subscriptionExpiresAt,
      },
      stats: {
        earnings: {
          current: formatEarning(allTimeEarnCredits),
          changePercent: calcChangePercent(currEarnCredits, prevEarnCredits),
        },
        downloads: {
          current: Number(downloadsAllTime._sum.totalDownloads || 0),
          changePercent: calcChangePercent(downloadsCurrent, downloadsPrevious),
        },
        activeAssets: {
          current: assetsCurrent,
          changeValue: assetsCurrent - assetsPrevious,
        },
        profileViews: {
          current: Number(viewsAllTime._sum.totalViews || 0),
          changePercent: calcChangePercent(viewsCurrent, viewsPrevious),
        },
      },
    },
    charts: {
      downloads: chartData.map(c => ({ month: c.month, downloads: c.downloads })),
      earnings: chartData.map(c => ({ month: c.month, earnings: c.earnings })),
    },
    recentActivities: finalRecentActivity,
  };
};
