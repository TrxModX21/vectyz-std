import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../utils/http.config";
import {
  allColorService,
  createColorService,
  deleteColorService,
  updateColorService,
} from "../services/color.service";
import {
  createColorSchema,
  updateColorSchema,
} from "../validation/color.validation";

export const allColorsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { colors, totalCount } = await allColorService();
    return res.status(HTTPSTATUS.OK).json({
      message: "Colors retrieved successfully",
      colors,
      totalCount,
    });
  }
);

export const createColorController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createColorSchema.parse(req.body);
    const color = await createColorService(body);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Color created successfully",
      color,
    });
  }
);

export const updateColorController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateColorSchema.parse(req.body);
    const color = await updateColorService(id as string, body);
    return res.status(HTTPSTATUS.OK).json({
      message: "Color updated successfully",
      color,
    });
  }
);

export const deleteColorController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteColorService(id as string);
    return res.status(HTTPSTATUS.OK).json({
      message: "Color deleted successfully",
    });
  }
);
