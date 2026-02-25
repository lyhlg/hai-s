import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

const mockGetDailySales = vi.fn();

vi.mock("../../src/services/settlement.js", () => ({
  SettlementService: vi.fn().mockImplementation(() => ({
    getDailySales: mockGetDailySales,
  })),
}));

vi.mock("../../src/services/sse-manager.js", () => ({
  SSEManager: vi.fn(),
  sseManager: { subscribe: vi.fn(), unsubscribe: vi.fn(), broadcast: vi.fn(), getClientCount: vi.fn() },
}));

const { default: supertest } = await import("supertest");
const { app } = await import("../../src/index.js");

const SECRET = "test-secret";
const adminToken = jwt.sign({ userId: "admin-001", storeId: "store-001", role: "admin" }, SECRET);
const tableToken = jwt.sign({ tableId: "table-001", storeId: "store-001", tableNumber: 1, role: "table" }, SECRET);

describe("Settlement Routes", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("GET /api/settlement/daily", () => {
    it("returns daily sales (admin)", async () => {
      mockGetDailySales.mockResolvedValue({ date: "2026-02-25", total_orders: 5, total_amount: 50000, tables: [] });
      const res = await supertest(app)
        .get("/api/settlement/daily?date=2026-02-25")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.total_amount).toBe(50000);
    });

    it("returns 403 with table role", async () => {
      const res = await supertest(app)
        .get("/api/settlement/daily")
        .set("Authorization", `Bearer ${tableToken}`);
      expect(res.status).toBe(403);
    });

    it("returns 400 on invalid date format", async () => {
      const res = await supertest(app)
        .get("/api/settlement/daily?date=invalid")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
    });
  });
});
