import type { Pool } from "mysql2/promise";
import type { MenuItem } from "@hai-s/shared";
import { v4 as uuid } from "uuid";

export interface MenuItemRow {
  id: string;
  store_id: string;
  name: string;
  price: number;
  is_available: boolean;
}

interface CreateInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isPopular?: boolean;
  displayOrder?: number;
}

interface UpdateInput {
  name?: string;
  description?: string | null;
  price?: number;
  category?: string;
  imageUrl?: string | null;
  isAvailable?: boolean;
  isPopular?: boolean;
  displayOrder?: number;
}

export class MenuRepository {
  constructor(private pool: Pool) {}

  async create(storeId: string, input: CreateInput): Promise<MenuItem> {
    const id = uuid();
    const now = new Date();
    await this.pool.execute(
      "INSERT INTO menu_items (id, store_id, name, description, price, category, image_url, is_popular, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, storeId, input.name, input.description ?? null, input.price, input.category, input.imageUrl ?? null, input.isPopular ?? false, input.displayOrder ?? 0, now, now],
    );
    return {
      id, store_id: storeId, name: input.name, description: input.description ?? null,
      price: input.price, category: input.category, image_url: input.imageUrl ?? null,
      is_available: true, is_popular: input.isPopular ?? false,
      display_order: input.displayOrder ?? 0, created_at: now, updated_at: now,
    };
  }

  async getByStore(storeId: string): Promise<MenuItem[]> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM menu_items WHERE store_id = ? ORDER BY display_order ASC, created_at ASC",
      [storeId],
    );
    return (rows as any[]).map(this.toMenuItem);
  }

  async getById(id: string): Promise<MenuItem | null> {
    const [rows] = await this.pool.execute("SELECT * FROM menu_items WHERE id = ?", [id]);
    const arr = rows as any[];
    return arr.length === 0 ? null : this.toMenuItem(arr[0]);
  }

  async update(id: string, input: UpdateInput): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) { fields.push("name = ?"); values.push(input.name); }
    if (input.description !== undefined) { fields.push("description = ?"); values.push(input.description); }
    if (input.price !== undefined) { fields.push("price = ?"); values.push(input.price); }
    if (input.category !== undefined) { fields.push("category = ?"); values.push(input.category); }
    if (input.imageUrl !== undefined) { fields.push("image_url = ?"); values.push(input.imageUrl); }
    if (input.isAvailable !== undefined) { fields.push("is_available = ?"); values.push(input.isAvailable); }
    if (input.isPopular !== undefined) { fields.push("is_popular = ?"); values.push(input.isPopular); }
    if (input.displayOrder !== undefined) { fields.push("display_order = ?"); values.push(input.displayOrder); }

    if (fields.length === 0) return;
    fields.push("updated_at = ?");
    values.push(new Date());
    values.push(id);

    await this.pool.execute(`UPDATE menu_items SET ${fields.join(", ")} WHERE id = ?`, values);
  }

  async deleteItem(id: string): Promise<void> {
    await this.pool.execute("DELETE FROM menu_items WHERE id = ?", [id]);
  }

  async getByIds(ids: string[]): Promise<MenuItemRow[]> {
    if (ids.length === 0) return [];
    const [rows] = await this.pool.execute(
      `SELECT id, store_id, name, price, is_available FROM menu_items WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids,
    );
    return rows as MenuItemRow[];
  }

  private toMenuItem(r: any): MenuItem {
    return {
      id: r.id, store_id: r.store_id, name: r.name, description: r.description,
      price: r.price, category: r.category, image_url: r.image_url,
      is_available: !!r.is_available, is_popular: !!r.is_popular,
      display_order: r.display_order, created_at: r.created_at, updated_at: r.updated_at,
    };
  }
}
