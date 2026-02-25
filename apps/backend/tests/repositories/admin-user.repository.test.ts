import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminUserRepository } from "../../src/repositories/admin-user.js";

const mockPool = { execute: vi.fn() } as any;

describe("AdminUserRepository", () => {
  let repo: AdminUserRepository;

  beforeEach(() => {
    repo = new AdminUserRepository(mockPool);
    vi.clearAllMocks();
  });

  it("findByStoreAndUsername returns user when found", async () => {
    const row = { id: "admin-001", store_id: "store-001", username: "admin", password_hash: "hash", created_at: new Date() };
    mockPool.execute.mockResolvedValue([[row]]);

    const result = await repo.findByStoreAndUsername("store-001", "admin");
    expect(result).toEqual({
      id: "admin-001",
      storeId: "store-001",
      username: "admin",
      passwordHash: "hash",
      createdAt: row.created_at,
    });
  });

  it("findByStoreAndUsername returns null when not found", async () => {
    mockPool.execute.mockResolvedValue([[]]);
    const result = await repo.findByStoreAndUsername("store-001", "nonexistent");
    expect(result).toBeNull();
  });
});
