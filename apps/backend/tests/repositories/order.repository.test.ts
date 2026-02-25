import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrderRepository } from "../../src/repositories/order.js";

const mockExecute = vi.fn();
const mockPool = { execute: mockExecute, getConnection: vi.fn() } as any;

describe("OrderRepository", () => {
  let repo: OrderRepository;

  beforeEach(() => {
    repo = new OrderRepository(mockPool);
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("inserts order and items in transaction", async () => {
      const mockConn = {
        beginTransaction: vi.fn(),
        execute: vi.fn(),
        commit: vi.fn(),
        rollback: vi.fn(),
        release: vi.fn(),
      };
      mockPool.getConnection.mockResolvedValue(mockConn);

      const result = await repo.create(
        "store-1",
        "session-1",
        "table-1",
        [{ menuItemId: "m1", menuItemName: "라면", quantity: 2, unitPrice: 5000 }],
      );

      expect(result.store_id).toBe("store-1");
      expect(result.session_id).toBe("session-1");
      expect(result.status).toBe("pending");
      expect(result.total_amount).toBe(10000);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].subtotal).toBe(10000);
      expect(mockConn.beginTransaction).toHaveBeenCalled();
      expect(mockConn.commit).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
    });

    it("rolls back on error", async () => {
      const mockConn = {
        beginTransaction: vi.fn(),
        execute: vi.fn().mockRejectedValue(new Error("DB error")),
        commit: vi.fn(),
        rollback: vi.fn(),
        release: vi.fn(),
      };
      mockPool.getConnection.mockResolvedValue(mockConn);

      await expect(
        repo.create("s1", "ses1", "t1", [{ menuItemId: "m1", menuItemName: "라면", quantity: 1, unitPrice: 5000 }]),
      ).rejects.toThrow("DB error");
      expect(mockConn.rollback).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
    });
  });

  describe("getBySession", () => {
    it("returns orders with items for session", async () => {
      mockExecute
        .mockResolvedValueOnce([[
          { id: "o1", store_id: "s1", session_id: "ses1", table_id: "t1", status: "pending", total_amount: 10000, created_at: new Date(), updated_at: new Date() },
        ]])
        .mockResolvedValueOnce([[
          { id: "oi1", order_id: "o1", menu_item_id: "m1", menu_item_name: "라면", quantity: 2, unit_price: 5000, subtotal: 10000 },
        ]]);

      const result = await repo.getBySession("ses1");
      expect(result).toHaveLength(1);
      expect(result[0].items).toHaveLength(1);
    });

    it("returns empty array when no orders", async () => {
      mockExecute.mockResolvedValueOnce([[]]);
      const result = await repo.getBySession("ses-none");
      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("returns order with items", async () => {
      mockExecute
        .mockResolvedValueOnce([[
          { id: "o1", store_id: "s1", session_id: "ses1", table_id: "t1", status: "pending", total_amount: 10000, created_at: new Date(), updated_at: new Date() },
        ]])
        .mockResolvedValueOnce([[
          { id: "oi1", order_id: "o1", menu_item_id: "m1", menu_item_name: "라면", quantity: 2, unit_price: 5000, subtotal: 10000 },
        ]]);

      const result = await repo.getById("o1");
      expect(result).not.toBeNull();
      expect(result!.id).toBe("o1");
      expect(result!.items).toHaveLength(1);
    });

    it("returns null when not found", async () => {
      mockExecute.mockResolvedValueOnce([[]]);
      const result = await repo.getById("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("updateStatus", () => {
    it("updates order status", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);
      await repo.updateStatus("o1", "confirmed");
      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE orders"),
        ["confirmed", expect.any(Date), "o1"],
      );
    });
  });

  describe("deleteOrder", () => {
    it("deletes order (cascade deletes items)", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);
      await repo.deleteOrder("o1");
      expect(mockExecute).toHaveBeenCalledWith("DELETE FROM orders WHERE id = ?", ["o1"]);
    });
  });
});
