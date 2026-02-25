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
      "INSERT INTO table_sessions (id, store_id, table_id, started_at, is_active) VALUES (?, ?, ?, ?, ?)",
      [id, storeId, tableId, now, true],
    );
    return { 
      id, 
      store_id: storeId, 
      table_id: tableId, 
      started_at: now, 
      completed_at: null, 
      is_active: true 
    };
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
      store_id: r.store_id,
      table_id: r.table_id,
      started_at: r.started_at,
      completed_at: r.completed_at,
      is_active: !!r.is_active
    };
  }
}
