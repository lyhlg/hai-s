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
    // Authorization 헤더 또는 쿼리 파라미터에서 토큰 추출
    let token: string | undefined;
    
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else if (req.query.token && typeof req.query.token === "string") {
      token = req.query.token;
    }

    if (!token) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "인증이 필요합니다" });
      return;
    }

    try {
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
      res.status(403).json({ error: "FORBIDDEN", message: "권한이 없습니다" });
      return;
    }
    next();
  };
}
