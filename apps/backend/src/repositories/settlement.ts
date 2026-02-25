import type { Pool } from "mysql2/promise";

interface DailySalesRow { total_orders: number; total_amount: number; }
interface TableSalesRow { table_id: string; table_number: number; total_orders: number; total_amount: number; }

export class SettlementRepository {
  constructor(private pool: Pool) {}

  async getDailySales(storeId: string, date: string): Promise<DailySalesRow> {
    const [rows] = await this.pool.execute(
      `SELECT COUNT(*) as total_orders, COALESCE(SUM(o.total_amount), 0) as total_amount
       FROM orders o
       JOIN table_sessions ts ON o.session_id = ts.id
       WHERE o.store_id = ? AND DATE(o.created_at) = ? AND o.status != 'cancelled'`,
      [storeId, date],
    );
    const r = (rows as any[])[0];
    return { total_orders: Number(r.total_orders), total_amount: Number(r.total_amount) };
  }

  async getTableSales(storeId: string, date: string): Promise<TableSalesRow[]> {
    const [rows] = await this.pool.execute(
      `SELECT o.table_id, t.table_number, COUNT(*) as total_orders, SUM(o.total_amount) as total_amount
       FROM orders o
       JOIN tables_ t ON o.table_id = t.id
       WHERE o.store_id = ? AND DATE(o.created_at) = ? AND o.status != 'cancelled'
       GROUP BY o.table_id, t.table_number
       ORDER BY t.table_number ASC`,
      [storeId, date],
    );
    return (rows as any[]).map((r: any) => ({
      table_id: r.table_id, table_number: r.table_number,
      total_orders: Number(r.total_orders), total_amount: Number(r.total_amount),
    }));
  }
}
