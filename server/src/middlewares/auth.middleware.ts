
import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { UnauthorizedException, ForbiddenException } from "../utils/app-error";
import { asyncHandler } from "./async-handler.middleware";

// Extend Express Request/Locale types if needed, or just rely on res.locals
// For better type safety, we can declare global namespace override, but for now let's keep it simple.

export const requireAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw new UnauthorizedException("You must be logged in to access this resource");
  }

// Store user and session in res.locals for next middleware/controllers
  res.locals.user = session.user;
  res.locals.session = session.session;

  next();
});

export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (session) {
    res.locals.user = session.user;
    res.locals.session = session.session;
  }

  next();
});

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      throw new UnauthorizedException("User context missing");
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException("You do not have permission to perform this action");
    }

    next();
  };
};

export const requireAdmin = requireRole(["admin"]);
export const requireSuperAdmin = requireRole(["superadmin"]);
