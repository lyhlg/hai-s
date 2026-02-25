import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { Store } from "@hai-s/shared";

export class StoreRepository {
  constructor(private pool: Pool) {}

  async getById(id: number): Promise<Store | null> {
    const [rows] = await this.pool.execute("SELECT * FROM stores WHERE id = ?", [id]);
    const arr = rows as any[];
    if (arr.length === 0) return null;
    return { id: arr[0].id, name: arr[0].name, created_at: arr[0].created_at };
  }

  async validate(id: number): Promise<boolean> {
    const [rows] = await this.pool.execute("SELECT COUNT(*) as cnt FROM stores WHERE id = ?", [id]);
    return (rows as any[])[0].cnt > 0;
  }
}
