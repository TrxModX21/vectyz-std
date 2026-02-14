import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../utils/http.config";
import {
  createPlanSchema,
  updatePlanSchema,
} from "../validators/plan.validator";
import {
  allPlanService,
  createPlanService,
  deletePlanService,
  getPlanDetailService,
  updatePlanService,
} from "../services/plan.service";

export const allPlanController = asyncHandler(
  async (req: Request, res: Response) => {
    const { plans, totalCount } = await allPlanService();

    return res.status(HTTPSTATUS.OK).json({
      message: "All plan retrieved successfully",
      timestamp: new Date().toISOString(),
      plans,
      totalCount,
    });
  },
);

export const planDetailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const plan = await getPlanDetailService(id as string);

    return res.status(HTTPSTATUS.OK).json({
      message: "Plan retrieved successfully",
      timestamp: new Date().toISOString(),
      plan,
    });
  },
);

export const createPlanController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createPlanSchema.parse(req.body);
    const plan = await createPlanService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Plan created successfully",
      timestamp: new Date().toISOString(),
      plan,
    });
  },
);

export const updatePlanController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const body = updatePlanSchema.parse(req.body);

    const plan = await updatePlanService(id, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Plan updated successfully",
      timestamp: new Date().toISOString(),
      plan,
    });
  },
);

export const deletePlanController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await deletePlanService(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Plan deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);
