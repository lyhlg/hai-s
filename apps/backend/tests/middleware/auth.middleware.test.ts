import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { authenticate, authorize } from "../../src/middleware/auth.js";
import jwt from "jsonwebtoken";

const SECRET = "test-secret";

function mockReqRes(token?: string) {
  const req = { headers: { authorization: token ? `Bearer ${token}` : undefined } } as any as Request;
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any as Response;
  const next = vi.fn() as NextFunction;
  return { req, res, next };
}

describe("auth middleware", () => {
  describe("authenticate", () => {
    const authMiddleware = authenticate(SECRET);

    it("sets req.user on valid token", () => {
      const token = jwt.sign({ userId: "u1", storeId: "s1", role: "admin" }, SECRET);
      const { req, res, next } = mockReqRes(token);

      authMiddleware(req, res, next);
      expect((req as any).user).toMatchObject({ userId: "u1", storeId: "s1", role: "admin" });
      expect(next).toHaveBeenCalled();
    });

    it("returns 401 when no token", () => {
      const { req, res, next } = mockReqRes();
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns 401 on invalid token", () => {
      const { req, res, next } = mockReqRes("invalid-token");
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("authorize", () => {
    it("calls next when role matches", () => {
      const req = { user: { role: "admin" } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      authorize("admin")(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("returns 403 when role does not match", () => {
      const req = { user: { role: "table" } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      authorize("admin")(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it("allows multiple roles", () => {
      const req = { user: { role: "table" } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      authorize("admin", "table")(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
