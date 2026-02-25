import { Router } from "express";
import { pool } from "../db.js";
import { config } from "../config/index.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createTableSchema } from "../schemas/table.js";
import { TableService } from "../services/table.js";
import { StoreRepository } from "../repositories/store.js";
import { TableRepository } from "../repositories/table.js";
import { SessionRepository } from "../repositories/session.js";

export const tableRouter = Router();

const auth = authenticate(config.jwt.secret);
const tableService = new TableService(
  new StoreRepository(pool),
  new TableRepository(pool),
  new SessionRepository(pool),
);

tableRouter.post("/:storeId/tables", auth, authorize("admin"), validate(createTableSchema), async (req, res, next) => {
  try {
    const storeId = req.params.storeId as string;
    const { tableNumber, password } = req.body;
    const table = await tableService.createTable(storeId, tableNumber, password);
    res.status(201).json({ id: table.id, storeId: table.storeId, tableNumber: table.tableNumber, createdAt: table.createdAt });
  } catch (err) {
    next(err);
  }
});

tableRouter.get("/:storeId/tables", auth, authorize("admin"), async (req, res, next) => {
  try {
    const storeId = req.params.storeId as string;
    const tables = await tableService.getTables(storeId);
    res.json(tables.map((t) => ({ id: t.id, storeId: t.storeId, tableNumber: t.tableNumber, createdAt: t.createdAt })));
  } catch (err) {
    next(err);
  }
});

tableRouter.get("/:storeId/tables/:tableId", auth, authorize("admin", "table"), async (req, res, next) => {
  try {
    const { storeId, tableId } = req.params as Record<string, string>;
    const table = await tableService.getTable(storeId, tableId);
    res.json({ id: table.id, storeId: table.storeId, tableNumber: table.tableNumber, createdAt: table.createdAt });
  } catch (err) {
    next(err);
  }
});

tableRouter.post("/:storeId/tables/:tableId/start-session", auth, authorize("table"), async (req, res, next) => {
  try {
    const { storeId, tableId } = req.params as Record<string, string>;
    const session = await tableService.startSession(storeId, tableId);
    res.json({ sessionId: session.id });
  } catch (err) {
    next(err);
  }
});

tableRouter.post("/:storeId/tables/:tableId/end-session", auth, authorize("admin"), async (req, res, next) => {
  try {
    const { storeId, tableId } = req.params as Record<string, string>;
    const completedAt = await tableService.endSession(storeId, tableId);
    res.json({ completedAt: completedAt.toISOString() });
  } catch (err) {
    next(err);
  }
});

tableRouter.get("/:storeId/tables/:tableId/session", auth, authorize("admin", "table"), async (req, res, next) => {
  try {
    const { storeId, tableId } = req.params as Record<string, string>;
    const session = await tableService.getActiveSession(storeId, tableId);
    res.json(session);
  } catch (err) {
    next(err);
  }
});
