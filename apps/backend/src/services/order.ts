import type { OrderRepository } from "../repositories/order.js";
import type { MenuRepository } from "../repositories/menu.js";
import type { SessionRepository } from "../repositories/session.js";
import type { TableRepository } from "../repositories/table.js";
import type { SSEManager } from "./sse-manager.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

interface OrderItemInput {
  menuItemId: string;
  quantity: number;
}

export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private menuRepo: MenuRepository,
    private sessionRepo: SessionRepository,
    private tableRepo: TableRepository,
    private sse: SSEManager,
  ) {}

  async createOrder(storeId: string, tableId: string, items: OrderItemInput[]) {
    // 세션 확인/자동 생성
    let session = await this.sessionRepo.findActive(storeId, tableId);
    if (!session) {
      session = await this.sessionRepo.create(storeId, tableId);
    }

    // 메뉴 검증
    const menuIds = items.map((i) => i.menuItemId);
    const menuItems = await this.menuRepo.getByIds(menuIds);
    const menuMap = new Map(menuItems.map((m) => [m.id, m]));

    for (const item of items) {
      const menu = menuMap.get(item.menuItemId);
      if (!menu || menu.store_id !== storeId) throw new BadRequestError("존재하지 않는 메뉴가 포함되어 있습니다");
      if (!menu.is_available) throw new BadRequestError(`품절된 메뉴가 포함되어 있습니다: ${menu.name}`);
    }

    const createItems = items.map((i) => {
      const menu = menuMap.get(i.menuItemId)!;
      return { menuItemId: i.menuItemId, menuItemName: menu.name, quantity: i.quantity, unitPrice: menu.price };
    });

    const order = await this.orderRepo.create(storeId, session.id, tableId, createItems);

    // 테이블 번호 조회 후 SSE broadcast
    const table = await this.tableRepo.getById(tableId);
    this.sse.broadcast(storeId, "order:created", {
      order_id: order.id,
      session_id: order.session_id,
      table_id: tableId,
      table_number: table?.table_number ?? 0,
      items: order.items.map((i) => ({ menu_item_name: i.menu_item_name, quantity: i.quantity })),
      total_amount: order.total_amount,
    });

    return order;
  }

  async getOrders(sessionId: string) {
    return this.orderRepo.getBySession(sessionId);
  }

  private static STATUS_FLOW: Record<string, string[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["served", "cancelled"],
  };

  async updateStatus(orderId: string, status: string) {
    const order = await this.orderRepo.getById(orderId);
    if (!order) throw new NotFoundError("주문을 찾을 수 없습니다");

    const allowed = OrderService.STATUS_FLOW[order.status];
    if (!allowed || !allowed.includes(status)) {
      throw new BadRequestError(`'${order.status}' 상태에서 '${status}'(으)로 변경할 수 없습니다`);
    }

    await this.orderRepo.updateStatus(orderId, status);

    const eventType = status === "cancelled" ? "order:cancelled" as const : "order:updated" as const;
    this.sse.broadcast(order.store_id, eventType, {
      order_id: orderId,
      status,
      updated_at: new Date().toISOString(),
    });
  }

  async deleteOrder(orderId: string) {
    const order = await this.orderRepo.getById(orderId);
    if (!order) throw new NotFoundError("주문을 찾을 수 없습니다");

    await this.orderRepo.deleteOrder(orderId);
    this.sse.broadcast(order.store_id, "order:deleted", { order_id: orderId });
  }
}
