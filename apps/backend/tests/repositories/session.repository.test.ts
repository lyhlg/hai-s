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
    const row = { id: "ses-1", store_id: "s1", table_id: "t1", started_at: new Date(), completed_at: null, is_active: 1 };
    mockPool.execute.mockResolvedValue([[row]]);
    const result = await repo.findActive("s1", "t1");
    expect(result).toMatchObject({ id: "ses-1", isActive: true });
  });

  it("findActive returns null when no active session", async () => {
    mockPool.execute.mockResolvedValue([[]]);
    const result = await repo.findActive("s1", "t1");
    expect(result).toBeNull();
  });

  it("create inserts and returns session", async () => {
    mockPool.execute.mockResolvedValue([{}]);
    const result = await repo.create("s1", "t1");
    expect(result.storeId).toBe("s1");
    expect(result.tableId).toBe("t1");
    expect(result.isActive).toBe(true);
  });

  it("endSession updates and returns completedAt", async () => {
    mockPool.execute.mockResolvedValue([{ affectedRows: 1 }]);
    const result = await repo.endSession("ses-1");
    expect(result).toBeInstanceOf(Date);
  });
});
