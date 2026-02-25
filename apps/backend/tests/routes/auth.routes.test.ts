import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

// Mock services before importing app
const mockLoginAdmin = vi.fn();
const mockLoginTable = vi.fn();
vi.mock("../../src/services/auth.js", () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    loginAdmin: mockLoginAdmin,
    loginTable: mockLoginTable,
  })),
}));

const { default: supertest } = await import("supertest");
const { app } = await import("../../src/index.js");

const SECRET = "test-secret";

describe("Auth Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/admin/login", () => {
    it("returns 200 with token on valid credentials", async () => {
      mockLoginAdmin.mockResolvedValue({ token: "jwt-token", expiresAt: "2026-02-26T00:00:00.000Z" });

      const res = await supertest(app)
        .post("/api/auth/admin/login")
        .send({ storeId: "store-001", username: "admin", password: "admin123" });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe("jwt-token");
      expect(res.body.expiresAt).toBeDefined();
    });

    it("returns 400 on missing fields", async () => {
      const res = await supertest(app)
        .post("/api/auth/admin/login")
        .send({ storeId: "store-001" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("BAD_REQUEST");
    });

    it("returns 401 on invalid credentials", async () => {
      const { UnauthorizedError } = await import("../../src/errors/index.js");
      mockLoginAdmin.mockRejectedValue(new UnauthorizedError("매장 ID, 사용자명 또는 비밀번호가 올바르지 않습니다"));

      const res = await supertest(app)
        .post("/api/auth/admin/login")
        .send({ storeId: "store-001", username: "admin", password: "wrong" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("UNAUTHORIZED");
    });

    it("returns 429 on too many attempts", async () => {
      const { TooManyAttemptsError } = await import("../../src/errors/index.js");
      mockLoginAdmin.mockRejectedValue(new TooManyAttemptsError());

      const res = await supertest(app)
        .post("/api/auth/admin/login")
        .send({ storeId: "store-001", username: "admin", password: "pass" });

      expect(res.status).toBe(429);
      expect(res.body.error).toBe("TOO_MANY_ATTEMPTS");
      expect(res.body.retryAfter).toBe(900);
    });
  });

  describe("POST /api/auth/table/login", () => {
    it("returns 200 with token on valid credentials", async () => {
      mockLoginTable.mockResolvedValue({ token: "jwt-token", storeId: "store-001", tableId: "table-001", tableNumber: 1 });

      const res = await supertest(app)
        .post("/api/auth/table/login")
        .send({ storeId: "store-001", tableNumber: 1, password: "table123" });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe("jwt-token");
      expect(res.body.tableId).toBe("table-001");
      expect(res.body.tableNumber).toBe(1);
    });

    it("returns 400 on invalid tableNumber type", async () => {
      const res = await supertest(app)
        .post("/api/auth/table/login")
        .send({ storeId: "store-001", tableNumber: "abc", password: "pass" });

      expect(res.status).toBe(400);
    });

    it("returns 401 on invalid credentials", async () => {
      const { UnauthorizedError } = await import("../../src/errors/index.js");
      mockLoginTable.mockRejectedValue(new UnauthorizedError("매장 ID, 테이블 번호 또는 비밀번호가 올바르지 않습니다"));

      const res = await supertest(app)
        .post("/api/auth/table/login")
        .send({ storeId: "store-001", tableNumber: 1, password: "wrong" });

      expect(res.status).toBe(401);
    });
  });
});
