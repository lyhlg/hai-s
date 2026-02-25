import { describe, it, expect, vi, beforeEach } from "vitest";
import { SessionRepository } from "../../src/repositories/session.js";

const mockPool = { execute: vi.fn() } as any;

describe("SessionRepository", () => {
  let repo: SessionRepository;

  beforeEach(() => {
    repo = new SessionRepository(mockPool);
    vi.clearAllMocks();
  });

  it("findActive returns session when active exists", async () => {
    const row = { id: 1, store_id: 1, table_id: 1, started_at: new Date(), completed_at: null, is_active: 1 };
    mockPool.execute.mockResolvedValue([[row]]);
    const result = await repo.findActive(1, 1);
    expect(result).toMatchObject({ id: 1, store_id: 1, table_id: 1, is_active: true });
  });

  it("findActive returns null when no active session", async () => {
    mockPool.execute.mockResolvedValue([[]]);
    expect(await repo.findActive(1, 1)).toBeNull();
  });

  it("create inserts and returns session", async () => {
    mockPool.execute.mockResolvedValue([{ insertId: 1 }]);
    const result = await repo.create(1, 1);
    expect(result.store_id).toBe(1);
    expect(result.table_id).toBe(1);
    expect(result.is_active).toBe(true);
    expect(result.completed_at).toBeNull();
  });

  it("endSession updates and returns completedAt", async () => {
    mockPool.execute.mockResolvedValue([{ affectedRows: 1 }]);
    const result = await repo.endSession(1);
    expect(result).toBeInstanceOf(Date);
  });
});
