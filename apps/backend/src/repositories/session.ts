import type { Pool } from "mysql2/promise";
import type { TableSession } from "@hai-s/shared";
import { v4 as uuid } from "uuid";

export class SessionRepository {
  constructor(private pool: Pool) {}

  async findActive(storeId: string, tableId: string): Promise<TableSession | null> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM table_sessions WHERE store_id = ? AND table_id = ? AND is_active = true",
      [storeId, tableId],
    );
    const arr = rows as any[];
    if (arr.length === 0) return null;
    return this.toSession(arr[0]);
  }

  async create(storeId: string, tableId: string): Promise<TableSession> {
    const id = uuid();
    const now = new Date();
    await this.pool.execute(
      "INSERT INTO table_sessions (id, store_id, table_id) VALUES (?, ?, ?)",
      [id, storeId, tableId],
    );
    return { id, storeId, tableId, startedAt: now, completedAt: null, isActive: true };
  }

  async endSession(sessionId: string): Promise<Date> {
    const now = new Date();
    await this.pool.execute(
      "UPDATE table_sessions SET completed_at = ?, is_active = false WHERE id = ?",
      [now, sessionId],
    );
    return now;
  }

  private toSession(r: any): TableSession {
    return {
      id: r.id,
      storeId: r.store_id,
      tableId: r.table_id,
      startedAt: r.started_at,
      completedAt: r.completed_at,
      isActive: Boolean(r.is_active),
    };
  }
}
