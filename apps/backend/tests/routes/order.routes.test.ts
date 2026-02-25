import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

const mockCreateOrder = vi.fn();
const mockGetOrders = vi.fn();
const mockUpdateStatus = vi.fn();
const mockDeleteOrder = vi.fn();

vi.mock("../../src/services/order.js", () => ({
  OrderService: vi.fn().mockImplementation(() => ({
    createOrder: mockCreateOrder,
    getOrders: mockGetOrders,
    updateStatus: mockUpdateStatus,
    deleteOrder: mockDeleteOrder,
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

describe("Order Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/orders", () => {
    it("returns 201 on successful order creation (table)", async () => {
      const now = new Date();
      mockCreateOrder.mockResolvedValue({
        id: "o1", store_id: "store-001", session_id: "ses-1", table_id: "table-001",
        status: "pending", total_amount: 10000, created_at: now, updated_at: now,
        items: [{ id: "oi1", order_id: "o1", menu_item_id: "m1", menu_item_name: "라면", quantity: 2, unit_price: 5000, subtotal: 10000 }],
      });

      const res = await supertest(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${tableToken}`)
        .send({ items: [{ menuItemId: "m1", quantity: 2 }] });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe("o1");
      expect(res.body.totalAmount).toBe(10000);
      expect(res.body.items).toHaveLength(1);
    });

    it("returns 401 without token", async () => {
      const res = await supertest(app)
        .post("/api/orders")
        .send({ items: [{ menuItemId: "m1", quantity: 1 }] });
      expect(res.status).toBe(401);
    });

    it("returns 403 with admin role", async () => {
      const res = await supertest(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ items: [{ menuItemId: "m1", quantity: 1 }] });
      expect(res.status).toBe(403);
    });

    it("returns 400 on empty items", async () => {
      const res = await supertest(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${tableToken}`)
        .send({ items: [] });
      expect(res.status).toBe(400);
    });

    it("returns 400 on invalid body", async () => {
      const res = await supertest(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${tableToken}`)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/orders", () => {
    it("returns orders by sessionId (table)", async () => {
      mockGetOrders.mockResolvedValue([
        { id: "o1", status: "pending", total_amount: 10000, items: [] },
      ]);

      const res = await supertest(app)
        .get("/api/orders?sessionId=ses-1")
        .set("Authorization", `Bearer ${tableToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it("returns orders (admin)", async () => {
      mockGetOrders.mockResolvedValue([]);

      const res = await supertest(app)
        .get("/api/orders?sessionId=ses-1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    it("returns 400 without sessionId", async () => {
      const res = await supertest(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${tableToken}`);
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/orders/:orderId/status", () => {
    it("updates status (admin)", async () => {
      mockUpdateStatus.mockResolvedValue(undefined);

      const res = await supertest(app)
        .put("/api/orders/o1/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "confirmed" });

      expect(res.status).toBe(200);
      expect(mockUpdateStatus).toHaveBeenCalledWith("o1", "confirmed", "store-001");
    });

    it("returns 403 with table role", async () => {
      const res = await supertest(app)
        .put("/api/orders/o1/status")
        .set("Authorization", `Bearer ${tableToken}`)
        .send({ status: "confirmed" });
      expect(res.status).toBe(403);
    });

    it("returns 400 on invalid status", async () => {
      const res = await supertest(app)
        .put("/api/orders/o1/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "invalid" });
      expect(res.status).toBe(400);
    });

    it("accepts cancelled status", async () => {
      mockUpdateStatus.mockResolvedValue(undefined);
      const res = await supertest(app)
        .put("/api/orders/o1/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "cancelled" });
      expect(res.status).toBe(200);
    });

    it("returns 400 on invalid status transition", async () => {
      const { BadRequestError } = await import("../../src/errors/index.js");
      mockUpdateStatus.mockRejectedValue(new BadRequestError("변경할 수 없습니다"));
      const res = await supertest(app)
        .put("/api/orders/o1/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "served" });
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/orders/:orderId", () => {
    it("deletes order (admin)", async () => {
      mockDeleteOrder.mockResolvedValue(undefined);

      const res = await supertest(app)
        .delete("/api/orders/o1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(mockDeleteOrder).toHaveBeenCalledWith("o1", "store-001");
    });

    it("returns 403 with table role", async () => {
      const res = await supertest(app)
        .delete("/api/orders/o1")
        .set("Authorization", `Bearer ${tableToken}`);
      expect(res.status).toBe(403);
    });

    it("returns 404 when order not found", async () => {
      const { NotFoundError } = await import("../../src/errors/index.js");
      mockDeleteOrder.mockRejectedValue(new NotFoundError("주문을 찾을 수 없습니다"));

      const res = await supertest(app)
        .delete("/api/orders/bad")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });
});
