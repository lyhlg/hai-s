import { Router } from "express";
import { pool } from "../db.js";
import { config } from "../config/index.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema, updateOrderStatusSchema } from "../schemas/order.js";
import { OrderService } from "../services/order.js";
import { OrderRepository } from "../repositories/order.js";
import { MenuRepository } from "../repositories/menu.js";
import { SessionRepository } from "../repositories/session.js";
import { TableRepository } from "../repositories/table.js";
import { sseManager } from "../services/sse-manager.js";
import { BadRequestError } from "../errors/index.js";

const router = Router();
const auth = authenticate(config.jwt.secret);

const orderService = new OrderService(
  new OrderRepository(pool),
  new MenuRepository(pool),
  new SessionRepository(pool),
  new TableRepository(pool),
  sseManager,
);

// POST /api/orders - 주문 생성 (Table only)
router.post("/", auth, authorize("table"), validate(createOrderSchema), async (req, res, next) => {
  try {
    const { storeId, tableId } = req.user!;
    const order = await orderService.createOrder(storeId, tableId!, req.body.items.map((i: any) => ({ menuItemId: i.menuItemId, quantity: i.quantity })));
    res.status(201).json({
      id: order.id, storeId: order.store_id, sessionId: order.session_id,
      status: order.status, totalAmount: order.total_amount,
      createdAt: order.created_at, items: order.items,
    });
  } catch (err) { next(err); }
});

// GET /api/orders?sessionId= - 세션별 주문 목록 (Table/Admin)
router.get("/", auth, authorize("admin", "table"), async (req, res, next) => {
  try {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) throw new BadRequestError("sessionId는 필수입니다");
    const orders = await orderService.getOrders(sessionId, req.user!.storeId);
    res.json(orders);
  } catch (err) { next(err); }
});

// PUT /api/orders/:orderId/status - 상태 변경 (Admin only)
router.put("/:orderId/status", auth, authorize("admin"), validate(updateOrderStatusSchema), async (req, res, next) => {
  try {
    await orderService.updateStatus(req.params.orderId as string, req.body.status, req.user!.storeId);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// DELETE /api/orders/:orderId - 주문 삭제 (Admin only)
router.delete("/:orderId", auth, authorize("admin"), async (req, res, next) => {
  try {
    await orderService.deleteOrder(req.params.orderId as string, req.user!.storeId);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
