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
    const row = { id: 1, store_id: 1, username: "admin", password_hash: "hash", created_at: new Date() };
    mockPool.execute.mockResolvedValue([[row]]);
    const result = await repo.findByStoreAndUsername(1, "admin");
    expect(result).toEqual({ id: 1, store_id: 1, username: "admin", password_hash: "hash", created_at: row.created_at });
  });

  it("findByStoreAndUsername returns null when not found", async () => {
    mockPool.execute.mockResolvedValue([[]]);
    expect(await repo.findByStoreAndUsername(1, "nonexistent")).toBeNull();
  });
});
