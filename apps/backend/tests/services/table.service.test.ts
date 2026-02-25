import { describe, it, expect, vi, beforeEach } from "vitest";
import { TableService } from "../../src/services/table.js";

const mockStoreRepo = { validate: vi.fn() };
const mockTableRepo = { create: vi.fn(), getById: vi.fn(), getByStore: vi.fn(), findByStoreAndNumber: vi.fn() };
const mockSessionRepo = { findActive: vi.fn(), create: vi.fn(), endSession: vi.fn() };

describe("TableService", () => {
  let service: TableService;

  beforeEach(() => {
    service = new TableService(mockStoreRepo as any, mockTableRepo as any, mockSessionRepo as any);
    vi.clearAllMocks();
  });

  describe("createTable", () => {
    it("creates table successfully", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockTableRepo.findByStoreAndNumber.mockResolvedValue(null);
      mockTableRepo.create.mockResolvedValue({ id: 1, store_id: 1, table_number: "1", capacity: 4, is_active: true, created_at: new Date() });

      const result = await service.createTable(1, "1", "pass");
      expect(result.id).toBe(1);
    });

    it("throws NotFoundError when store invalid", async () => {
      mockStoreRepo.validate.mockResolvedValue(false);
      await expect(service.createTable(999, "1", "pass")).rejects.toThrow("매장을 찾을 수 없습니다");
    });

    it("throws ConflictError on duplicate table number", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockTableRepo.findByStoreAndNumber.mockResolvedValue({ id: 1 });
      await expect(service.createTable(1, "1", "pass")).rejects.toThrow("이미 존재하는 테이블 번호입니다");
    });
  });

  describe("startSession", () => {
    it("creates new session when no active session", async () => {
      mockSessionRepo.findActive.mockResolvedValue(null);
      mockSessionRepo.create.mockResolvedValue({ id: 1 });
      const result = await service.startSession(1, 1);
      expect(result.id).toBe(1);
    });

    it("returns existing session when already active", async () => {
      mockSessionRepo.findActive.mockResolvedValue({ id: 10 });
      const result = await service.startSession(1, 1);
      expect(result.id).toBe(10);
    });
  });

  describe("endSession", () => {
    it("ends active session", async () => {
      mockSessionRepo.findActive.mockResolvedValue({ id: 1 });
      const now = new Date();
      mockSessionRepo.endSession.mockResolvedValue(now);
      const result = await service.endSession(1, 1);
      expect(result).toBe(now);
    });

    it("throws BadRequestError when no active session", async () => {
      mockSessionRepo.findActive.mockResolvedValue(null);
      await expect(service.endSession(1, 1)).rejects.toThrow("활성 세션이 없습니다");
    });
  });
});
