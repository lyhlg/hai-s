import type { Pool } from "mysql2/promise";
import type { AdminUserWithPassword } from "@hai-s/shared";

export class AdminUserRepository {
  constructor(private pool: Pool) {}

  async findByStoreAndUsername(storeId: string, username: string): Promise<AdminUserWithPassword | null> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM admin_users WHERE store_id = ? AND username = ?",
      [storeId, username],
    );
    const arr = rows as any[];
    if (arr.length === 0) return null;
    const r = arr[0];
    return { id: r.id, store_id: r.store_id, username: r.username, password_hash: r.password_hash, created_at: r.created_at };
  }
}
