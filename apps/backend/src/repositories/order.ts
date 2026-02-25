import type { Pool } from "mysql2/promise";
import type { OrderWithItems, OrderItem } from "@hai-s/shared";
import { v4 as uuid } from "uuid";

interface CreateItemInput {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
}

export class OrderRepository {
  constructor(private pool: Pool) {}

  async create(
    storeId: string,
    sessionId: string,
    tableId: string,
    items: CreateItemInput[],
  ): Promise<OrderWithItems> {
    const conn = await this.pool.getConnection();
    const orderId = uuid();
    const now = new Date();
    const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

    try {
      await conn.beginTransaction();

      await conn.execute(
        "INSERT INTO orders (id, store_id, session_id, table_id, status, total_amount, created_at, updated_at) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)",
        [orderId, storeId, sessionId, tableId, totalAmount, now, now],
      );

      const orderItems: OrderItem[] = [];
      for (const item of items) {
        const itemId = uuid();
        const subtotal = item.quantity * item.unitPrice;
        await conn.execute(
          "INSERT INTO order_items (id, order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [itemId, orderId, item.menuItemId, item.menuItemName, item.quantity, item.unitPrice, subtotal],
        );
        orderItems.push({ id: itemId, order_id: orderId, menu_item_id: item.menuItemId, menu_item_name: item.menuItemName, quantity: item.quantity, unit_price: item.unitPrice, subtotal });
      }

      await conn.commit();

      return {
        id: orderId, store_id: storeId, session_id: sessionId, table_id: tableId,
        status: "pending", total_amount: totalAmount, created_at: now, updated_at: now,
        items: orderItems,
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async getById(orderId: string): Promise<OrderWithItems | null> {
    const [rows] = await this.pool.execute("SELECT * FROM orders WHERE id = ?", [orderId]);
    const arr = rows as any[];
    if (arr.length === 0) return null;

    const [itemRows] = await this.pool.execute("SELECT * FROM order_items WHERE order_id = ?", [orderId]);
    return { ...this.toOrder(arr[0]), items: (itemRows as any[]).map(this.toItem) };
  }

  async getBySession(sessionId: string): Promise<OrderWithItems[]> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM orders WHERE session_id = ? ORDER BY created_at DESC",
      [sessionId],
    );
    const orders = rows as any[];
    if (orders.length === 0) return [];

    const ids = orders.map((o: any) => o.id);
    const [itemRows] = await this.pool.execute(
      `SELECT * FROM order_items WHERE order_id IN (${ids.map(() => "?").join(",")})`,
      ids,
    );
    const itemsByOrder = new Map<string, OrderItem[]>();
    for (const r of itemRows as any[]) {
      const list = itemsByOrder.get(r.order_id) || [];
      list.push(this.toItem(r));
      itemsByOrder.set(r.order_id, list);
    }

    return orders.map((o: any) => ({ ...this.toOrder(o), items: itemsByOrder.get(o.id) || [] }));
  }

  async getByTableHistory(storeId: string, tableId: string, date?: string): Promise<OrderWithItems[]> {
    let sql = `SELECT o.* FROM orders o
      JOIN table_sessions ts ON o.session_id = ts.id
      WHERE o.store_id = ? AND o.table_id = ? AND ts.is_active = false`;
    const params: any[] = [storeId, tableId];
    if (date) { sql += " AND DATE(o.created_at) = ?"; params.push(date); }
    sql += " ORDER BY o.created_at DESC";

    const [rows] = await this.pool.execute(sql, params);
    const orders = rows as any[];
    if (orders.length === 0) return [];

    const ids = orders.map((o: any) => o.id);
    const [itemRows] = await this.pool.execute(
      `SELECT * FROM order_items WHERE order_id IN (${ids.map(() => "?").join(",")})`,
      ids,
    );
    const itemsByOrder = new Map<string, OrderItem[]>();
    for (const r of itemRows as any[]) {
      const list = itemsByOrder.get(r.order_id) || [];
      list.push(this.toItem(r));
      itemsByOrder.set(r.order_id, list);
    }
    return orders.map((o: any) => ({ ...this.toOrder(o), items: itemsByOrder.get(o.id) || [] }));
  }

  async updateStatus(orderId: string, status: string): Promise<void> {
    await this.pool.execute("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?", [status, new Date(), orderId]);
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.pool.execute("DELETE FROM orders WHERE id = ?", [orderId]);
  }

  private toOrder(r: any) {
    return {
      id: r.id, store_id: r.store_id, session_id: r.session_id, table_id: r.table_id,
      status: r.status, total_amount: r.total_amount, created_at: r.created_at, updated_at: r.updated_at,
    };
  }

  private toItem(r: any): OrderItem {
    return {
      id: r.id, order_id: r.order_id, menu_item_id: r.menu_item_id, menu_item_name: r.menu_item_name,
      quantity: r.quantity, unit_price: r.unit_price, subtotal: r.subtotal,
    };
  }
}
