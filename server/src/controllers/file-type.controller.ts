import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTPSTATUS } from "../utils/http.config";
import {
  allFileTypeService,
  createFileTypeService,
  deleteFileTypeService,
  updateFileTypeService,
} from "../services/file-type.service";
import {
  createFileTypeSchema,
  updateFileTypeSchema,
} from "../validation/file-type.validation";

export const allFileTypesController = asyncHandler(
  async (req: Request, res: Response) => {
    const sort = (req.query.sort as string) === "asc" ? "asc" : "desc";
    const includeCategories = req.query.include_categories === "true";
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const { fileTypes, totalCount } = await allFileTypeService(
      sort,
      includeCategories,
      limit
    );
    
    return res.status(HTTPSTATUS.OK).json({
      message: "File types retrieved successfully",
      fileTypes,
      totalCount,
    });
  }
);

export const createFileTypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createFileTypeSchema.parse(req.body);
    const fileType = await createFileTypeService(body);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "File type created successfully",
      fileType,
    });
  }
);

export const updateFileTypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateFileTypeSchema.parse(req.body);
    const fileType = await updateFileTypeService(id as string, body);
    return res.status(HTTPSTATUS.OK).json({
      message: "File type updated successfully",
      fileType,
    });
  }
);

export const deleteFileTypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteFileTypeService(id as string);
    return res.status(HTTPSTATUS.OK).json({
      message: "File type deleted successfully",
    });
  }
);
