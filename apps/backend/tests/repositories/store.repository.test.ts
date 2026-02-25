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
    const row = { id: 1, name: "테스트 매장", created_at: new Date() };
    mockPool.execute.mockResolvedValue([[row]]);
    const result = await repo.getById(1);
    expect(result).toEqual({ id: 1, name: "테스트 매장", created_at: row.created_at });
  });

  it("getById returns null when not found", async () => {
    mockPool.execute.mockResolvedValue([[]]);
    const result = await repo.getById(999);
    expect(result).toBeNull();
  });

  it("validate returns true when store exists", async () => {
    mockPool.execute.mockResolvedValue([[{ cnt: 1 }]]);
    expect(await repo.validate(1)).toBe(true);
  });

  it("validate returns false when store does not exist", async () => {
    mockPool.execute.mockResolvedValue([[{ cnt: 0 }]]);
    expect(await repo.validate(999)).toBe(false);
  });
});
