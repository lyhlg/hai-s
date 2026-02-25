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
    expect(result.store_id).toBe("store-001");
    expect(result.table_number).toBe(1);
    expect(result.id).toBeDefined();
    expect(mockPool.execute).toHaveBeenCalledTimes(1);
  });

  it("create passes hashed password to DB", async () => {
    mockPool.execute.mockResolvedValue([{}]);
    await repo.create("store-001", 1, "$2a$10$hashedvalue");
    const insertArgs = mockPool.execute.mock.calls[0][1];
    expect(insertArgs[3]).toBe("$2a$10$hashedvalue");
  });

  it("findByStoreAndNumber returns table when found", async () => {
    const row = { id: "t1", store_id: "s1", table_number: 1, password_hash: "h", created_at: new Date() };
    mockPool.execute.mockResolvedValue([[row]]);
    const result = await repo.findByStoreAndNumber("s1", 1);
    expect(result).toMatchObject({ id: "t1", store_id: "s1", table_number: 1, password_hash: "h" });
  });

  it("findByStoreAndNumber returns null when not found", async () => {
    mockPool.execute.mockResolvedValue([[]]);
    const result = await repo.findByStoreAndNumber("s1", 99);
    expect(result).toBeNull();
  });

  it("getByStore returns all tables for store sorted by table_number", async () => {
    const rows = [
      { id: "t1", store_id: "s1", table_number: 1, password_hash: "h", created_at: new Date() },
      { id: "t2", store_id: "s1", table_number: 2, password_hash: "h", created_at: new Date() },
    ];
    mockPool.execute.mockResolvedValue([rows]);
    const result = await repo.getByStore("s1");
    expect(result).toHaveLength(2);
    expect(mockPool.execute.mock.calls[0][0]).toContain("ORDER BY table_number ASC");
  });

  it("getById returns table when found", async () => {
    const row = { id: "t1", store_id: "s1", table_number: 1, password_hash: "h", created_at: new Date() };
    mockPool.execute.mockResolvedValue([[row]]);
    const result = await repo.getById("t1");
    expect(result?.id).toBe("t1");
  });
});
