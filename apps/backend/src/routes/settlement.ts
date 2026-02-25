import { Router } from "express";
import { pool } from "../db.js";
import { config } from "../config/index.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { SettlementService } from "../services/settlement.js";
import { SettlementRepository } from "../repositories/settlement.js";
import { StoreRepository } from "../repositories/store.js";
import { BadRequestError } from "../errors/index.js";

const router = Router();
const auth = authenticate(config.jwt.secret);

const settlementService = new SettlementService(
  new SettlementRepository(pool),
  new StoreRepository(pool),
);

// GET /api/settlement/daily?date=YYYY-MM-DD - 일매출 조회 (Admin only)
router.get("/daily", auth, authorize("admin"), async (req, res, next) => {
  try {
    const { storeId } = req.user!;
    const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new BadRequestError("날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)");
    const result = await settlementService.getDailySales(storeId, date);
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
