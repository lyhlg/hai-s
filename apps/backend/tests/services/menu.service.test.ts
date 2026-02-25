import { describe, it, expect, vi, beforeEach } from "vitest";
import { MenuService } from "../../src/services/menu.js";

const mockMenuRepo = {
  create: vi.fn(),
  getByStore: vi.fn(),
  getById: vi.fn(),
  update: vi.fn(),
  deleteItem: vi.fn(),
};
const mockStoreRepo = { validate: vi.fn() };

describe("MenuService", () => {
  let service: MenuService;

  beforeEach(() => {
    service = new MenuService(mockMenuRepo as any, mockStoreRepo as any);
    vi.clearAllMocks();
  });

  describe("createMenuItem", () => {
    it("creates menu item", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockMenuRepo.create.mockResolvedValue({ id: "m1", name: "라면", price: 5000 });

      const result = await service.createMenuItem("s1", { name: "라면", price: 5000, category: "면류" });
      expect(result.id).toBe("m1");
      expect(mockMenuRepo.create).toHaveBeenCalledWith("s1", { name: "라면", price: 5000, category: "면류" });
    });

    it("throws when store not found", async () => {
      mockStoreRepo.validate.mockResolvedValue(false);
      await expect(service.createMenuItem("bad", { name: "라면", price: 5000, category: "면류" })).rejects.toThrow("매장을 찾을 수 없습니다");
    });
  });

  describe("getMenuItems", () => {
    it("returns items by store", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockMenuRepo.getByStore.mockResolvedValue([{ id: "m1" }, { id: "m2" }]);
      const result = await service.getMenuItems("s1");
      expect(result).toHaveLength(2);
    });

    it("throws when store not found", async () => {
      mockStoreRepo.validate.mockResolvedValue(false);
      await expect(service.getMenuItems("bad")).rejects.toThrow("매장을 찾을 수 없습니다");
    });
  });

  describe("updateMenuItem", () => {
    it("updates menu item", async () => {
      mockMenuRepo.getById.mockResolvedValue({ id: "m1", store_id: "s1" });
      mockMenuRepo.update.mockResolvedValue(undefined);
      mockMenuRepo.getById.mockResolvedValueOnce({ id: "m1", store_id: "s1" });

      await service.updateMenuItem("s1", "m1", { name: "짜장면" });
      expect(mockMenuRepo.update).toHaveBeenCalledWith("m1", { name: "짜장면" });
    });

    it("throws when menu not found", async () => {
      mockMenuRepo.getById.mockResolvedValue(null);
      await expect(service.updateMenuItem("s1", "bad", { name: "x" })).rejects.toThrow("메뉴를 찾을 수 없습니다");
    });

    it("throws when menu belongs to different store", async () => {
      mockMenuRepo.getById.mockResolvedValue({ id: "m1", store_id: "other" });
      await expect(service.updateMenuItem("s1", "m1", { name: "x" })).rejects.toThrow("메뉴를 찾을 수 없습니다");
    });
  });

  describe("deleteMenuItem", () => {
    it("deletes menu item", async () => {
      mockMenuRepo.getById.mockResolvedValue({ id: "m1", store_id: "s1" });
      mockMenuRepo.deleteItem.mockResolvedValue(undefined);

      await service.deleteMenuItem("s1", "m1");
      expect(mockMenuRepo.deleteItem).toHaveBeenCalledWith("m1");
    });

    it("throws when menu not found", async () => {
      mockMenuRepo.getById.mockResolvedValue(null);
      await expect(service.deleteMenuItem("s1", "bad")).rejects.toThrow("메뉴를 찾을 수 없습니다");
    });
  });
});
