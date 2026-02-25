import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrderService } from "../../src/services/order.js";

const mockOrderRepo = {
  create: vi.fn(),
  getById: vi.fn(),
  getBySession: vi.fn(),
  updateStatus: vi.fn(),
  deleteOrder: vi.fn(),
};
const mockMenuRepo = { getByIds: vi.fn() };
const mockSessionRepo = { findActive: vi.fn(), create: vi.fn() };
const mockTableRepo = { getById: vi.fn() };
const mockSSE = { broadcast: vi.fn() };

describe("OrderService", () => {
  let service: OrderService;

  beforeEach(() => {
    service = new OrderService(mockOrderRepo as any, mockMenuRepo as any, mockSessionRepo as any, mockTableRepo as any, mockSSE as any);
    vi.clearAllMocks();
  });

  describe("createOrder", () => {
    it("creates order with auto session start", async () => {
      mockSessionRepo.findActive.mockResolvedValue(null);
      mockSessionRepo.create.mockResolvedValue({ id: "ses-new" });
      mockTableRepo.getById.mockResolvedValue({ id: "t1", table_number: 3 });
      mockMenuRepo.getByIds.mockResolvedValue([
        { id: "m1", store_id: "s1", name: "라면", price: 5000, is_available: true },
      ]);
      mockOrderRepo.create.mockResolvedValue({
        id: "o1", store_id: "s1", session_id: "ses-new", table_id: "t1",
        status: "pending", total_amount: 10000, items: [{ menu_item_name: "라면", quantity: 2 }],
      });

      const result = await service.createOrder("s1", "t1", [{ menuItemId: "m1", quantity: 2 }]);

      expect(result.id).toBe("o1");
      expect(mockSessionRepo.create).toHaveBeenCalledWith("s1", "t1");
      expect(mockSSE.broadcast).toHaveBeenCalledWith("s1", "order:created", expect.objectContaining({ order_id: "o1" }));
    });

    it("uses existing active session", async () => {
      mockSessionRepo.findActive.mockResolvedValue({ id: "ses-existing" });
      mockTableRepo.getById.mockResolvedValue({ id: "t1", table_number: 3 });
      mockMenuRepo.getByIds.mockResolvedValue([
        { id: "m1", store_id: "s1", name: "라면", price: 5000, is_available: true },
      ]);
      mockOrderRepo.create.mockResolvedValue({
        id: "o1", store_id: "s1", session_id: "ses-existing", table_id: "t1",
        status: "pending", total_amount: 5000, items: [],
      });

      await service.createOrder("s1", "t1", [{ menuItemId: "m1", quantity: 1 }]);
      expect(mockSessionRepo.create).not.toHaveBeenCalled();
    });

    it("throws when menu item not found", async () => {
      mockSessionRepo.findActive.mockResolvedValue({ id: "ses-1" });
      mockMenuRepo.getByIds.mockResolvedValue([]);

      await expect(
        service.createOrder("s1", "t1", [{ menuItemId: "bad", quantity: 1 }]),
      ).rejects.toThrow("존재하지 않는 메뉴");
    });

    it("throws when menu item unavailable", async () => {
      mockSessionRepo.findActive.mockResolvedValue({ id: "ses-1" });
      mockMenuRepo.getByIds.mockResolvedValue([
        { id: "m1", store_id: "s1", name: "라면", price: 5000, is_available: false },
      ]);

      await expect(
        service.createOrder("s1", "t1", [{ menuItemId: "m1", quantity: 1 }]),
      ).rejects.toThrow("품절");
    });

    it("throws when menu belongs to different store", async () => {
      mockSessionRepo.findActive.mockResolvedValue({ id: "ses-1" });
      mockMenuRepo.getByIds.mockResolvedValue([
        { id: "m1", store_id: "other-store", name: "라면", price: 5000, is_available: true },
      ]);

      await expect(
        service.createOrder("s1", "t1", [{ menuItemId: "m1", quantity: 1 }]),
      ).rejects.toThrow("존재하지 않는 메뉴");
    });
  });

  describe("getOrders", () => {
    it("returns orders by session", async () => {
      mockOrderRepo.getBySession.mockResolvedValue([{ id: "o1" }]);
      const result = await service.getOrders("ses-1");
      expect(result).toHaveLength(1);
    });
  });

  describe("updateStatus", () => {
    it("updates status and broadcasts", async () => {
      mockOrderRepo.getById.mockResolvedValue({ id: "o1", store_id: "s1", status: "pending" });
      mockOrderRepo.updateStatus.mockResolvedValue(undefined);

      await service.updateStatus("o1", "confirmed");

      expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith("o1", "confirmed");
      expect(mockSSE.broadcast).toHaveBeenCalledWith("s1", "order:updated", expect.objectContaining({ order_id: "o1", status: "confirmed" }));
    });

    it("throws when order not found", async () => {
      mockOrderRepo.getById.mockResolvedValue(null);
      await expect(service.updateStatus("bad", "confirmed")).rejects.toThrow("주문을 찾을 수 없습니다");
    });
  });

  describe("deleteOrder", () => {
    it("deletes and broadcasts", async () => {
      mockOrderRepo.getById.mockResolvedValue({ id: "o1", store_id: "s1" });
      mockOrderRepo.deleteOrder.mockResolvedValue(undefined);

      await service.deleteOrder("o1");

      expect(mockOrderRepo.deleteOrder).toHaveBeenCalledWith("o1");
      expect(mockSSE.broadcast).toHaveBeenCalledWith("s1", "order:cancelled", { order_id: "o1" });
    });

    it("throws when order not found", async () => {
      mockOrderRepo.getById.mockResolvedValue(null);
      await expect(service.deleteOrder("bad")).rejects.toThrow("주문을 찾을 수 없습니다");
    });
  });
});
