import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginAttemptRepository } from "../../src/repositories/login-attempt.js";

const mockPool = { execute: vi.fn() } as any;

describe("LoginAttemptRepository", () => {
  let repo: LoginAttemptRepository;

  beforeEach(() => {
    repo = new LoginAttemptRepository(mockPool);
    vi.clearAllMocks();
  });

  it("countRecentFailures returns count", async () => {
    mockPool.execute.mockResolvedValue([[{ cnt: 3 }]]);
    const result = await repo.countRecentFailures("store:1:admin:user", 15);
    expect(result).toBe(3);
  });

  it("record inserts a login attempt", async () => {
    mockPool.execute.mockResolvedValue([{}]);
    await repo.record("store:1:admin:user", false);
    expect(mockPool.execute).toHaveBeenCalledTimes(1);
    expect(mockPool.execute.mock.calls[0][0]).toContain("INSERT INTO login_attempts");
  });
});
