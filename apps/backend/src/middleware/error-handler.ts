import type { Request, Response, NextFunction } from "express";
import { AppError, TooManyAttemptsError } from "../errors/index.js";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof TooManyAttemptsError) {
    res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
      retryAfter: err.retryAfter,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "INTERNAL_ERROR",
    message: "서버 오류가 발생했습니다",
  });
}
