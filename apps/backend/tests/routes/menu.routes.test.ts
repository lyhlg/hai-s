import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

const mockCreateMenuItem = vi.fn();
const mockGetMenuItems = vi.fn();
const mockUpdateMenuItem = vi.fn();
const mockDeleteMenuItem = vi.fn();

vi.mock("../../src/services/menu.js", () => ({
  MenuService: vi.fn().mockImplementation(() => ({
    createMenuItem: mockCreateMenuItem,
    getMenuItems: mockGetMenuItems,
    updateMenuItem: mockUpdateMenuItem,
    deleteMenuItem: mockDeleteMenuItem,
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

describe("Menu Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/stores/:storeId/menu", () => {
    it("returns 201 on creation (admin)", async () => {
      const now = new Date();
      mockCreateMenuItem.mockResolvedValue({
        id: "m1", store_id: "store-001", name: "라면", price: 5000, category: "면류",
        description: null, image_url: null, is_available: true, is_popular: false,
        display_order: 0, created_at: now, updated_at: now,
      });

      const res = await supertest(app)
        .post("/api/stores/store-001/menu")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "라면", price: 5000, category: "면류" });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe("m1");
      expect(res.body.name).toBe("라면");
    });

    it("returns 403 with table role", async () => {
      const res = await supertest(app)
        .post("/api/stores/store-001/menu")
        .set("Authorization", `Bearer ${tableToken}`)
        .send({ name: "라면", price: 5000, category: "면류" });
      expect(res.status).toBe(403);
    });

    it("returns 400 on missing required fields", async () => {
      const res = await supertest(app)
        .post("/api/stores/store-001/menu")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "라면" });
      expect(res.status).toBe(400);
    });

    it("returns 400 on price <= 0", async () => {
      const res = await supertest(app)
        .post("/api/stores/store-001/menu")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "라면", price: 0, category: "면류" });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/stores/:storeId/menu", () => {
    it("returns menu list (table)", async () => {
      mockGetMenuItems.mockResolvedValue([
        { id: "m1", name: "라면", price: 5000, category: "면류" },
      ]);

      const res = await supertest(app)
        .get("/api/stores/store-001/menu")
        .set("Authorization", `Bearer ${tableToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it("returns menu list (admin)", async () => {
      mockGetMenuItems.mockResolvedValue([]);
      const res = await supertest(app)
        .get("/api/stores/store-001/menu")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it("returns 401 without token", async () => {
      const res = await supertest(app).get("/api/stores/store-001/menu");
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/stores/:storeId/menu/:menuId", () => {
    it("updates menu item (admin)", async () => {
      mockUpdateMenuItem.mockResolvedValue(undefined);

      const res = await supertest(app)
        .put("/api/stores/store-001/menu/m1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "짜장면", price: 6000 });

      expect(res.status).toBe(200);
      expect(mockUpdateMenuItem).toHaveBeenCalledWith("store-001", "m1", { name: "짜장면", price: 6000 });
    });

    it("returns 403 with table role", async () => {
      const res = await supertest(app)
        .put("/api/stores/store-001/menu/m1")
        .set("Authorization", `Bearer ${tableToken}`)
        .send({ name: "짜장면" });
      expect(res.status).toBe(403);
    });

    it("returns 404 when menu not found", async () => {
      const { NotFoundError } = await import("../../src/errors/index.js");
      mockUpdateMenuItem.mockRejectedValue(new NotFoundError("메뉴를 찾을 수 없습니다"));

      const res = await supertest(app)
        .put("/api/stores/store-001/menu/bad")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "x" });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/stores/:storeId/menu/:menuId", () => {
    it("deletes menu item (admin)", async () => {
      mockDeleteMenuItem.mockResolvedValue(undefined);

      const res = await supertest(app)
        .delete("/api/stores/store-001/menu/m1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(mockDeleteMenuItem).toHaveBeenCalledWith("store-001", "m1");
    });

    it("returns 403 with table role", async () => {
      const res = await supertest(app)
        .delete("/api/stores/store-001/menu/m1")
        .set("Authorization", `Bearer ${tableToken}`);
      expect(res.status).toBe(403);
    });

    it("returns 404 when menu not found", async () => {
      const { NotFoundError } = await import("../../src/errors/index.js");
      mockDeleteMenuItem.mockRejectedValue(new NotFoundError("메뉴를 찾을 수 없습니다"));

      const res = await supertest(app)
        .delete("/api/stores/store-001/menu/bad")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });
});
