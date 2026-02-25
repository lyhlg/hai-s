import { describe, it, expect, vi, beforeEach } from "vitest";
import { MenuRepository } from "../../src/repositories/menu.js";

const mockExecute = vi.fn();
const mockPool = { execute: mockExecute } as any;

describe("MenuRepository", () => {
  let repo: MenuRepository;

  beforeEach(() => {
    repo = new MenuRepository(mockPool);
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("inserts menu item and returns it", async () => {
      mockExecute.mockResolvedValueOnce([{}]);
      const result = await repo.create("store-1", {
        name: "라면", price: 5000, category: "면류",
      });
      expect(result.name).toBe("라면");
      expect(result.price).toBe(5000);
      expect(result.store_id).toBe("store-1");
      expect(result.is_available).toBe(true);
      expect(result.is_popular).toBe(false);
    });
  });

  describe("getByStore", () => {
    it("returns menu items sorted by display_order", async () => {
      mockExecute.mockResolvedValueOnce([[
        { id: "m1", store_id: "s1", name: "라면", description: null, price: 5000, category: "면류", image_url: null, is_available: 1, is_popular: 0, display_order: 0, created_at: new Date(), updated_at: new Date() },
        { id: "m2", store_id: "s1", name: "김밥", description: null, price: 3000, category: "밥류", image_url: null, is_available: 1, is_popular: 1, display_order: 1, created_at: new Date(), updated_at: new Date() },
      ]]);
      const result = await repo.getByStore("s1");
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("라면");
    });
  });

  describe("getById", () => {
    it("returns menu item", async () => {
      mockExecute.mockResolvedValueOnce([[
        { id: "m1", store_id: "s1", name: "라면", description: null, price: 5000, category: "면류", image_url: null, is_available: 1, is_popular: 0, display_order: 0, created_at: new Date(), updated_at: new Date() },
      ]]);
      const result = await repo.getById("m1");
      expect(result).not.toBeNull();
      expect(result!.id).toBe("m1");
    });

    it("returns null when not found", async () => {
      mockExecute.mockResolvedValueOnce([[]]);
      const result = await repo.getById("bad");
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("updates specified fields", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);
      await repo.update("m1", { name: "짜장면", price: 6000 });
      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE menu_items"),
        expect.arrayContaining(["짜장면", 6000, "m1"]),
      );
    });
  });

  describe("deleteItem", () => {
    it("deletes menu item", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);
      await repo.deleteItem("m1");
      expect(mockExecute).toHaveBeenCalledWith("DELETE FROM menu_items WHERE id = ?", ["m1"]);
    });
  });

  describe("getByIds", () => {
    it("returns items by ids", async () => {
      mockExecute.mockResolvedValueOnce([[
        { id: "m1", store_id: "s1", name: "라면", price: 5000, is_available: 1 },
      ]]);
      const result = await repo.getByIds(["m1"]);
      expect(result).toHaveLength(1);
    });

    it("returns empty for empty ids", async () => {
      const result = await repo.getByIds([]);
      expect(result).toEqual([]);
    });
  });
});
