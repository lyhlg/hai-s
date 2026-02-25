import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserClaims, UserRole } from "@hai-s/shared";

declare global {
  namespace Express {
    interface Request {
      user?: UserClaims;
    }
  }
}

export function authenticate(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "인증이 필요합니다" });
      return;
    }

    try {
      const token = authHeader.slice(7);
      const claims = jwt.verify(token, secret) as UserClaims;
      req.user = claims;
      next();
    } catch {
      res.status(401).json({ error: "UNAUTHORIZED", message: "유효하지 않은 토큰입니다" });
    }
  };
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "권한이 없습니다" });
      return;
    }
    next();
  };
}
