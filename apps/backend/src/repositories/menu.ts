import type { Pool } from "mysql2/promise";

export interface MenuItemRow {
  id: string;
  store_id: string;
  name: string;
  price: number;
  is_available: boolean;
}

export class MenuRepository {
  constructor(private pool: Pool) {}

  async getByIds(ids: string[]): Promise<MenuItemRow[]> {
    if (ids.length === 0) return [];
    const [rows] = await this.pool.execute(
      `SELECT id, store_id, name, price, is_available FROM menu_items WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids,
    );
    return rows as MenuItemRow[];
  }
}
