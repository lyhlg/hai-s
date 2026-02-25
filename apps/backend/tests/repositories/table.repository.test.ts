import { describe, it, expect, vi, beforeEach } from "vitest";
import { TableRepository } from "../../src/repositories/table.js";

const mockPool = { execute: vi.fn() } as any;

describe("TableRepository", () => {
  let repo: TableRepository;

  beforeEach(() => {
    repo = new TableRepository(mockPool);
    vi.clearAllMocks();
  });

  it("create inserts and returns table", async () => {
    mockPool.execute.mockResolvedValue([{}]);
    const result = await repo.create("store-001", 1, "hash");
    expect(result.storeId).toBe("store-001");
    expect(result.tableNumber).toBe(1);
    expect(mockPool.execute).toHaveBeenCalledTimes(1);
  });

  it("findByStoreAndNumber returns table when found", async () => {
    const row = { id: "t1", store_id: "s1", table_number: 1, password_hash: "h", created_at: new Date() };
    mockPool.execute.mockResolvedValue([[row]]);
    const result = await repo.findByStoreAndNumber("s1", 1);
    expect(result).toMatchObject({ id: "t1", storeId: "s1", tableNumber: 1 });
  });

  it("findByStoreAndNumber returns null when not found", async () => {
    mockPool.execute.mockResolvedValue([[]]);
    const result = await repo.findByStoreAndNumber("s1", 99);
    expect(result).toBeNull();
  });

  it("getByStore returns all tables for store", async () => {
    const rows = [
      { id: "t1", store_id: "s1", table_number: 1, password_hash: "h", created_at: new Date() },
      { id: "t2", store_id: "s1", table_number: 2, password_hash: "h", created_at: new Date() },
    ];
    mockPool.execute.mockResolvedValue([rows]);
    const result = await repo.getByStore("s1");
    expect(result).toHaveLength(2);
  });

  it("getById returns table when found", async () => {
    const row = { id: "t1", store_id: "s1", table_number: 1, password_hash: "h", created_at: new Date() };
    mockPool.execute.mockResolvedValue([[row]]);
    const result = await repo.getById("t1");
    expect(result?.id).toBe("t1");
  });
});
