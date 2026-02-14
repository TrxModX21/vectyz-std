
import { Router, Request, Response } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { HTTPSTATUS } from "../utils/http.config";

const testRoutes = Router();

// Public Route
testRoutes.get("/public", (req: Request, res: Response) => {
  res.status(HTTPSTATUS.OK).json({
    message: "Public route accessed successfully",
    timestamp: new Date().toISOString(),
  });
});

// Protected Route (Login required)
testRoutes.get("/protected", requireAuth, (req: Request, res: Response) => {
  res.status(HTTPSTATUS.OK).json({
    message: "Protected route accessed successfully",
    user: res.locals.user,
    session: res.locals.session,
  });
});

// Admin Route (Role 'admin' required)
testRoutes.get(
  "/admin",
  requireAuth,
  requireRole(["admin"]),
  (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Admin route accessed successfully",
      user: res.locals.user,
    });
  }
);

export default testRoutes;
