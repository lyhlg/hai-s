import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../src/services/auth.js";

const mockStoreRepo = { validate: vi.fn() };
const mockAdminUserRepo = { findByStoreAndUsername: vi.fn() };
const mockTableRepo = { findByStoreAndNumber: vi.fn() };
const mockLoginAttemptRepo = { countRecentFailures: vi.fn(), record: vi.fn() };

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService(
      mockStoreRepo as any,
      mockAdminUserRepo as any,
      mockTableRepo as any,
      mockLoginAttemptRepo as any,
      "test-secret",
    );
    vi.clearAllMocks();
  });

  describe("loginAdmin", () => {
    it("returns token on valid credentials", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockLoginAttemptRepo.countRecentFailures.mockResolvedValue(0);
      const { hashPassword } = await import("../../src/utils/password.js");
      const hash = await hashPassword("admin123");
      mockAdminUserRepo.findByStoreAndUsername.mockResolvedValue({
        id: 1, store_id: 1, username: "admin", password_hash: hash,
      });

      const result = await service.loginAdmin(1, "admin", "admin123");
      expect(result.token).toBeDefined();
      expect(result.expiresAt).toBeDefined();
      expect(mockLoginAttemptRepo.record).toHaveBeenCalledWith("store:1:admin:admin", true);
    });

    it("throws NotFoundError when store does not exist", async () => {
      mockStoreRepo.validate.mockResolvedValue(false);
      await expect(service.loginAdmin(999, "admin", "pass")).rejects.toThrow("매장을 찾을 수 없습니다");
    });

    it("throws TooManyAttemptsError when login attempts exceeded", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockLoginAttemptRepo.countRecentFailures.mockResolvedValue(5);
      await expect(service.loginAdmin(1, "admin", "pass")).rejects.toThrow("로그인 시도 횟수를 초과했습니다");
    });

    it("throws UnauthorizedError when user not found", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockLoginAttemptRepo.countRecentFailures.mockResolvedValue(0);
      mockAdminUserRepo.findByStoreAndUsername.mockResolvedValue(null);

      await expect(service.loginAdmin(1, "admin", "pass")).rejects.toThrow("매장 ID, 사용자명 또는 비밀번호가 올바르지 않습니다");
      expect(mockLoginAttemptRepo.record).toHaveBeenCalledWith("store:1:admin:admin", false);
    });

    it("throws UnauthorizedError on wrong password", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockLoginAttemptRepo.countRecentFailures.mockResolvedValue(0);
      const { hashPassword } = await import("../../src/utils/password.js");
      const hash = await hashPassword("correct");
      mockAdminUserRepo.findByStoreAndUsername.mockResolvedValue({
        id: 1, store_id: 1, username: "admin", password_hash: hash,
      });

      await expect(service.loginAdmin(1, "admin", "wrong")).rejects.toThrow("매장 ID, 사용자명 또는 비밀번호가 올바르지 않습니다");
      expect(mockLoginAttemptRepo.record).toHaveBeenCalledWith("store:1:admin:admin", false);
    });
  });

  describe("loginTable", () => {
    it("returns token on valid credentials", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockLoginAttemptRepo.countRecentFailures.mockResolvedValue(0);
      const { hashPassword } = await import("../../src/utils/password.js");
      const hash = await hashPassword("table123");
      mockTableRepo.findByStoreAndNumber.mockResolvedValue({
        id: 1, store_id: 1, table_number: "1", capacity: 4, is_active: true, password_hash: hash,
      });

      const result = await service.loginTable(1, "1", "table123");
      expect(result.token).toBeDefined();
      expect(result.storeId).toBe(1);
      expect(result.tableId).toBe(1);
      expect(result.tableNumber).toBe("1");
    });

    it("throws NotFoundError when store does not exist", async () => {
      mockStoreRepo.validate.mockResolvedValue(false);
      await expect(service.loginTable(1, "1", "pass")).rejects.toThrow("매장을 찾을 수 없습니다");
    });

    it("throws TooManyAttemptsError when login attempts exceeded", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockLoginAttemptRepo.countRecentFailures.mockResolvedValue(5);
      await expect(service.loginTable(1, "1", "pass")).rejects.toThrow("로그인 시도 횟수를 초과했습니다");
    });

    it("throws UnauthorizedError when table not found", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockLoginAttemptRepo.countRecentFailures.mockResolvedValue(0);
      mockTableRepo.findByStoreAndNumber.mockResolvedValue(null);
      await expect(service.loginTable(1, "99", "pass")).rejects.toThrow("매장 ID, 테이블 번호 또는 비밀번호가 올바르지 않습니다");
    });

    it("throws UnauthorizedError on wrong password and records failure", async () => {
      mockStoreRepo.validate.mockResolvedValue(true);
      mockLoginAttemptRepo.countRecentFailures.mockResolvedValue(0);
      const { hashPassword } = await import("../../src/utils/password.js");
      const hash = await hashPassword("correct");
      mockTableRepo.findByStoreAndNumber.mockResolvedValue({
        id: 1, store_id: 1, table_number: "1", capacity: 4, is_active: true, password_hash: hash,
      });

      await expect(service.loginTable(1, "1", "wrong")).rejects.toThrow("매장 ID, 테이블 번호 또는 비밀번호가 올바르지 않습니다");
      expect(mockLoginAttemptRepo.record).toHaveBeenCalledWith("store:1:table:1", false);
    });
  });
});
