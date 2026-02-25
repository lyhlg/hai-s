import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { TableSession } from "@hai-s/shared";

export class SessionRepository {
  constructor(private pool: Pool) {}

  async findActive(storeId: number, tableId: number): Promise<TableSession | null> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM table_sessions WHERE store_id = ? AND table_id = ? AND is_active = true",
      [storeId, tableId],
    );
    const arr = rows as any[];
    if (arr.length === 0) return null;
    return this.toSession(arr[0]);
  }

  async create(storeId: number, tableId: number): Promise<TableSession> {
    const now = new Date();
    const [result] = await this.pool.execute<ResultSetHeader>(
      "INSERT INTO table_sessions (store_id, table_id, started_at, is_active) VALUES (?, ?, ?, ?)",
      [storeId, tableId, now, true],
    );
    return { id: result.insertId, store_id: storeId, table_id: tableId, started_at: now, completed_at: null, is_active: true };
  }

  async endSession(sessionId: number): Promise<Date> {
    const now = new Date();
    await this.pool.execute(
      "UPDATE table_sessions SET completed_at = ?, is_active = false WHERE id = ?",
      [now, sessionId],
    );
    return now;
  }

  private toSession(r: any): TableSession {
    return { id: r.id, store_id: r.store_id, table_id: r.table_id, started_at: r.started_at, completed_at: r.completed_at, is_active: !!r.is_active };
  }
}
