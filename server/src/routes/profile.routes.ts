import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  updateProfileBannerController,
  updateProfileBioController,
  updateProfileImageController,
  checkUsernameAvailabilityController,
  updateNewsletterController,
} from "../controllers/profile.controller";

const profileRoutes = Router();

profileRoutes.put("/avatar", requireAuth, updateProfileImageController);
profileRoutes.put("/banner", requireAuth, updateProfileBannerController);
profileRoutes.put("/bio", requireAuth, updateProfileBioController);
profileRoutes.get(
  "/check-username",
  requireAuth,
  checkUsernameAvailabilityController,
);
profileRoutes.patch("/newsletter", requireAuth, updateNewsletterController);


export default profileRoutes;
