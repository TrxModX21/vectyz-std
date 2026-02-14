import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import {
  createCollectionSchema,
  fetchAllCollectionSchema,
  collectionDetailSchema,
  updateCollectionSchema,
  addItemToCollectionSchema,
  removeItemFromCollectionSchema,
} from "../validation/collection.validation";
import {
  createCollectionService,
  fetchAllCollectionService,
  getCollectionDetailService,
  updateCollectionService,
  deleteCollectionService,
  addItemToCollectionService,
  removeItemFromCollectionService,
  toggleCollectionStatusService,
  toggleCollectionFeaturedService,
} from "../services/collection.service";
import { HTTPSTATUS } from "../utils/http.config";

export const fetchCollectionListController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = fetchAllCollectionSchema.parse(req.query);
    const currentUser = res.locals.user;

    const { collections, currentPage, totalCount, totalPages } =
      await fetchAllCollectionService({
        ...query,
        currentUserId: currentUser?.id,
      });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Collection fetched successfully",
      timestamp: new Date().toISOString(),
      totalCount,
      totalPages,
      currentPage,
      collections,
    });
  },
);

export const createCollectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createCollectionSchema.parse(req.body);
    const user = res.locals.user;

    const collection = await createCollectionService({
      ...body,
      userId: user.id,
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Collection created successfully",
      timestamp: new Date().toISOString(),
      collection,
    });
  },
);

export const getCollectionDetailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = collectionDetailSchema.parse(req.params);
    const user = res.locals.user;

    const collection = await getCollectionDetailService(id, user?.id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Collection fetched successfully",
      timestamp: new Date().toISOString(),
      collection,
    });
  },
);

export const updateCollectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = collectionDetailSchema.parse(req.params);
    const body = updateCollectionSchema.parse(req.body);
    const user = res.locals.user;

    const collection = await updateCollectionService(id, body, user.id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Collection updated successfully",
      timestamp: new Date().toISOString(),
      collection,
    });
  },
);

export const deleteCollectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = collectionDetailSchema.parse(req.params);
    const user = res.locals.user;

    await deleteCollectionService(id, user.id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Collection deleted successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const addItemToCollectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = collectionDetailSchema.parse(req.params);
    const body = addItemToCollectionSchema.parse(req.body);
    const user = res.locals.user;

    const item = await addItemToCollectionService(id, body, user.id);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Stock added to collection successfully",
      timestamp: new Date().toISOString(),
      item,
    });
  },
);

export const removeItemFromCollectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, stockId } = removeItemFromCollectionSchema.parse(req.params);
    const user = res.locals.user;

    await removeItemFromCollectionService(id, stockId, user.id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Stock removed from collection successfully",
      timestamp: new Date().toISOString(),
    });
  },
);

export const toggleCollectionStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = collectionDetailSchema.parse(req.params);

    const collection = await toggleCollectionStatusService(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Collection status toggled successfully",
      timestamp: new Date().toISOString(),
      collection,
    });
  },
);

export const toggleCollectionFeaturedController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = collectionDetailSchema.parse(req.params);

    const collection = await toggleCollectionFeaturedService(id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Collection featured status toggled successfully",
      timestamp: new Date().toISOString(),
      collection,
    });
  },
);
