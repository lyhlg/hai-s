import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn();

vi.mock("../../src/services/sse-manager.js", () => ({
  SSEManager: vi.fn(),
  sseManager: {
    subscribe: mockSubscribe,
    unsubscribe: mockUnsubscribe,
    broadcast: vi.fn(),
    getClientCount: vi.fn(),
  },
}));

const { default: supertest } = await import("supertest");
const { app } = await import("../../src/index.js");

const SECRET = "test-secret";
const adminToken = jwt.sign({ userId: "admin-001", storeId: "store-001", role: "admin" }, SECRET);
const tableToken = jwt.sign({ tableId: "table-001", storeId: "store-001", tableNumber: 1, role: "table" }, SECRET);

describe("SSE Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/sse/orders", () => {
    it("sets SSE headers and subscribes (admin)", async () => {
      const res = await supertest(app)
        .get("/api/sse/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .buffer(false)
        .parse((res, cb) => {
          let data = "";
          res.on("data", (chunk: Buffer) => { data += chunk.toString(); });
          // Close after first chunk
          setTimeout(() => { res.destroy(); cb(null, data); }, 50);
        });

      expect(res.headers["content-type"]).toBe("text/event-stream");
      expect(res.headers["cache-control"]).toBe("no-cache");
      expect(res.headers["connection"]).toBe("keep-alive");
      expect(mockSubscribe).toHaveBeenCalledWith("store-001", expect.anything());
    });

    it("returns 401 without token", async () => {
      const res = await supertest(app).get("/api/sse/orders");
      expect(res.status).toBe(401);
    });

    it("returns 403 with table role", async () => {
      const res = await supertest(app)
        .get("/api/sse/orders")
        .set("Authorization", `Bearer ${tableToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/sse/table-orders", () => {
    it("sets SSE headers and subscribes (table)", async () => {
      const res = await supertest(app)
        .get("/api/sse/table-orders")
        .set("Authorization", `Bearer ${tableToken}`)
        .buffer(false)
        .parse((res, cb) => {
          let data = "";
          res.on("data", (chunk: Buffer) => { data += chunk.toString(); });
          setTimeout(() => { res.destroy(); cb(null, data); }, 50);
        });

      expect(res.headers["content-type"]).toBe("text/event-stream");
      expect(mockSubscribe).toHaveBeenCalledWith("store-001", expect.anything());
    });

    it("returns 403 with admin role", async () => {
      const res = await supertest(app)
        .get("/api/sse/table-orders")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(403);
    });
  });
});
