import type { Pool, ResultSetHeader } from "mysql2/promise";

export class LoginAttemptRepository {
  constructor(private pool: Pool) {}

  async countRecentFailures(identifier: string, windowMinutes: number): Promise<number> {
    const [rows] = await this.pool.execute(
      "SELECT COUNT(*) as cnt FROM login_attempts WHERE identifier = ? AND success = false AND attempted_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)",
      [identifier, windowMinutes],
    );
    return (rows as any[])[0].cnt;
  }

  async record(identifier: string, success: boolean): Promise<void> {
    await this.pool.execute(
      "INSERT INTO login_attempts (identifier, success) VALUES (?, ?)",
      [identifier, success],
    );
  }
}
