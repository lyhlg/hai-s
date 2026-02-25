import { Router } from "express";
import { pool } from "../db.js";
import { config } from "../config/index.js";
import { validate } from "../middleware/validate.js";
import { adminLoginSchema, tableLoginSchema } from "../schemas/auth.js";
import { AuthService } from "../services/auth.js";
import { StoreRepository } from "../repositories/store.js";
import { AdminUserRepository } from "../repositories/admin-user.js";
import { TableRepository } from "../repositories/table.js";
import { LoginAttemptRepository } from "../repositories/login-attempt.js";

export const authRouter = Router();

const authService = new AuthService(
  new StoreRepository(pool),
  new AdminUserRepository(pool),
  new TableRepository(pool),
  new LoginAttemptRepository(pool),
  config.jwt.secret,
);

authRouter.post("/admin/login", validate(adminLoginSchema), async (req, res, next) => {
  try {
    const { storeId, username, password } = req.body;
    const result = await authService.loginAdmin(storeId, username, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.post("/table/login", validate(tableLoginSchema), async (req, res, next) => {
  try {
    const { storeId, tableNumber, password } = req.body;
    const result = await authService.loginTable(storeId, tableNumber, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
