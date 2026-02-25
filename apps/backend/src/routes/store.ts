import { Router } from "express";
import { pool } from "../db.js";
import { config } from "../config/index.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { StoreRepository } from "../repositories/store.js";
import { NotFoundError } from "../errors/index.js";

export const storeRouter = Router();

const auth = authenticate(config.jwt.secret);
const storeRepo = new StoreRepository(pool);

storeRouter.get("/:storeId", auth, authorize("admin", "table"), async (req, res, next) => {
  try {
    const store = await storeRepo.getById(req.params.storeId as string);
    if (!store) throw new NotFoundError("매장을 찾을 수 없습니다");
    res.json(store);
  } catch (err) {
    next(err);
  }
});
