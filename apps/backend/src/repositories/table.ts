import type { Pool } from "mysql2/promise";
import type { Table, TableWithPassword } from "@hai-s/shared";
import { v4 as uuid } from "uuid";

export class TableRepository {
  constructor(private pool: Pool) {}

  async create(storeId: string, tableNumber: number, passwordHash: string): Promise<Table> {
    const id = uuid();
    const now = new Date();
    await this.pool.execute(
      "INSERT INTO tables_ (id, store_id, table_number, password_hash) VALUES (?, ?, ?, ?)",
      [id, storeId, tableNumber, passwordHash],
    );
    return { id, store_id: storeId, table_number: tableNumber, created_at: now };
  }

  async findByStoreAndNumber(storeId: string, tableNumber: number): Promise<TableWithPassword | null> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM tables_ WHERE store_id = ? AND table_number = ?",
      [storeId, tableNumber],
    );
    const arr = rows as any[];
    if (arr.length === 0) return null;
    return this.toTableWithPassword(arr[0]);
  }

  async getById(id: string): Promise<Table | null> {
    const [rows] = await this.pool.execute("SELECT * FROM tables_ WHERE id = ?", [id]);
    const arr = rows as any[];
    if (arr.length === 0) return null;
    return this.toTable(arr[0]);
  }

  async getByStore(storeId: string): Promise<Table[]> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM tables_ WHERE store_id = ? ORDER BY table_number ASC",
      [storeId],
    );
    return (rows as any[]).map(this.toTable);
  }

  private toTable(r: any): Table {
    return { id: r.id, store_id: r.store_id, table_number: r.table_number, created_at: r.created_at };
  }

  private toTableWithPassword(r: any): TableWithPassword {
    return { id: r.id, store_id: r.store_id, table_number: r.table_number, password_hash: r.password_hash, created_at: r.created_at };
  }
}
