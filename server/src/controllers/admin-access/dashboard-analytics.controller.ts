import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../../utils/http.config";
import {
  getOverviewStatsService,
  getRecentSalesService,
  getTopAssetsAnalyticsService,
  getTopVectyzenAnalyticsService,
  getTrafficAnalyticsService,
  getGeoAnalyticsService,
} from "../../services/admin-access/dashboard-analytics.service";

export const getOverviewStatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getOverviewStatsService();

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Dashboard overview stats fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getRecentSalesController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getRecentSalesService();

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Dashboard recent sales fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getTopAssetsAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { tier } = req.query;

    // Validasi parameter tier
    let parsedTier: "free" | "premium" | "all" = "all";
    if (tier === "free" || tier === "premium") {
      parsedTier = tier;
    }

    const result = await getTopAssetsAnalyticsService(parsedTier);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Dashboard top assets analytics fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getTopVectyzenAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getTopVectyzenAnalyticsService();

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Dashboard top contributor analytics fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getTrafficAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const period = (req.query.period as string) || "Last 7 days";
    const result = await getTrafficAnalyticsService(period);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Dashboard traffic analytics fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);

export const getGeoAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const period = (req.query.period as string) || "Last 7 days";
    const result = await getGeoAnalyticsService(period);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Dashboard geo analytics fetched successfully",
      timestamp: new Date().toISOString(),
      data: result,
    });
  },
);
