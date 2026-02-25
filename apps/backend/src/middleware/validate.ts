import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "BAD_REQUEST",
        message: "입력값이 올바르지 않습니다",
        details: result.error.issues,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
