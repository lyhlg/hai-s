import { Router } from "express";
import { config } from "../config/index.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { sseManager } from "../services/sse-manager.js";

const router = Router();
const auth = authenticate(config.jwt.secret);

// GET /api/sse/orders - 매장 주문 실시간 스트림 (Admin only)
router.get("/orders", auth, authorize("admin"), (req, res) => {
  const { storeId } = req.user!;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.write(`data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`);

  sseManager.subscribe(storeId, res);

  req.on("close", () => {
    sseManager.unsubscribe(storeId, res);
  });
});

// GET /api/sse/table-orders - 고객 테이블 주문 실시간 스트림 (Table only)
router.get("/table-orders", auth, authorize("table"), (req, res) => {
  const { storeId } = req.user!;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.write(`data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`);

  sseManager.subscribe(storeId, res);

  req.on("close", () => {
    sseManager.unsubscribe(storeId, res);
  });
});

export default router;
