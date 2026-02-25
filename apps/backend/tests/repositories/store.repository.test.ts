import { describe, it, expect, vi, beforeEach } from "vitest";
import { StoreRepository } from "../../src/repositories/store.js";

const mockPool = { execute: vi.fn() } as any;

describe("StoreRepository", () => {
  let repo: StoreRepository;

  beforeEach(() => {
    repo = new StoreRepository(mockPool);
    vi.clearAllMocks();
  });

  it("getById returns store when found", async () => {
    const row = { id: "store-001", name: "테스트 매장", created_at: new Date() };
    mockPool.execute.mockResolvedValue([[row]]);

    const result = await repo.getById("store-001");
    expect(result).toEqual({ id: "store-001", name: "테스트 매장", created_at: row.created_at });
    expect(mockPool.execute).toHaveBeenCalledWith("SELECT * FROM stores WHERE id = ?", ["store-001"]);
  });

  it("getById returns null when not found", async () => {
    mockPool.execute.mockResolvedValue([[]]);
    const result = await repo.getById("nonexistent");
    expect(result).toBeNull();
  });

  it("validate returns true when store exists", async () => {
    mockPool.execute.mockResolvedValue([[{ cnt: 1 }]]);
    const result = await repo.validate("store-001");
    expect(result).toBe(true);
  });

  it("validate returns false when store does not exist", async () => {
    mockPool.execute.mockResolvedValue([[{ cnt: 0 }]]);
    const result = await repo.validate("nonexistent");
    expect(result).toBe(false);
  });
});
