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
    const id = parseInt(uuid().replace(/-/g, '').substring(0, 15), 16);
    const now = new Date();
    await this.pool.execute(
      "INSERT INTO table_sessions (id, table_id, customer_token, started_at, is_active) VALUES (?, ?, ?, ?, ?)",
      [id, tableId, uuid(), now, true],
    );
    return { 
      id, 
      table_id: parseInt(tableId), 
      customer_token: uuid(),
      started_at: now, 
      ended_at: null, 
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
      table_id: r.table_id,
      customer_token: r.customer_token,
      started_at: r.started_at,
      ended_at: r.ended_at,
      is_active: r.is_active
    };
  }
}
