import { describe, it, expect, vi, beforeEach } from "vitest";
import { TableRepository } from "../../src/repositories/table.js";

const mockPool = { execute: vi.fn() } as any;

describe("TableRepository", () => {
  let repo: TableRepository;

  beforeEach(() => {
    repo = new TableRepository(mockPool);
    vi.clearAllMocks();
  });

  it("create inserts and returns table with default capacity", async () => {
    mockPool.execute.mockResolvedValue([{ insertId: 1 }]);
    const result = await repo.create(1, "1", "hash");
    expect(result.store_id).toBe(1);
    expect(result.table_number).toBe("1");
    expect(result.capacity).toBe(4);
    expect(result.is_active).toBe(true);
    expect(result.id).toBe(1);
  });

  it("create accepts custom capacity", async () => {
    mockPool.execute.mockResolvedValue([{ insertId: 2 }]);
    const result = await repo.create(1, "1", "hash", 6);
    expect(result.capacity).toBe(6);
  });

  it("create passes hashed password to DB", async () => {
    mockPool.execute.mockResolvedValue([{ insertId: 3 }]);
    await repo.create(1, "1", "$2a$10$hashedvalue");
    const insertArgs = mockPool.execute.mock.calls[0][1];
    expect(insertArgs[3]).toBe("$2a$10$hashedvalue");
  });

  it("findByStoreAndNumber returns table when found", async () => {
    const row = { id: 1, store_id: 1, table_number: "1", capacity: 4, is_active: 1, password_hash: "h", created_at: new Date() };
    mockPool.execute.mockResolvedValue([[row]]);
    const result = await repo.findByStoreAndNumber(1, "1");
    expect(result).toMatchObject({ id: 1, store_id: 1, table_number: "1", capacity: 4, is_active: true, password_hash: "h" });
  });

  it("findByStoreAndNumber returns null when not found", async () => {
    mockPool.execute.mockResolvedValue([[]]);
    expect(await repo.findByStoreAndNumber(1, "99")).toBeNull();
  });

  it("getByStore returns all tables sorted by table_number", async () => {
    const rows = [
      { id: 1, store_id: 1, table_number: "1", capacity: 4, is_active: 1, password_hash: "h", created_at: new Date() },
      { id: 2, store_id: 1, table_number: "2", capacity: 6, is_active: 1, password_hash: "h", created_at: new Date() },
    ];
    mockPool.execute.mockResolvedValue([rows]);
    const result = await repo.getByStore(1);
    expect(result).toHaveLength(2);
    expect(result[1].capacity).toBe(6);
    expect(mockPool.execute.mock.calls[0][0]).toContain("ORDER BY table_number ASC");
  });

  it("getById returns table when found", async () => {
    const row = { id: 1, store_id: 1, table_number: "1", capacity: 4, is_active: 1, password_hash: "h", created_at: new Date() };
    mockPool.execute.mockResolvedValue([[row]]);
    const result = await repo.getById(1);
    expect(result?.id).toBe(1);
    expect(result?.capacity).toBe(4);
    expect(result?.is_active).toBe(true);
  });
});
