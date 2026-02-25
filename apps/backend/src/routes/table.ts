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
import type { Table } from "@hai-s/shared";

export const tableRouter = Router();

const auth = authenticate(config.jwt.secret);
const tableService = new TableService(
  new StoreRepository(pool),
  new TableRepository(pool),
  new SessionRepository(pool),
);

function toResponse(t: Table) {
  return { id: t.id, storeId: t.store_id, tableNumber: t.table_number, capacity: t.capacity, isActive: t.is_active, createdAt: t.created_at };
}

tableRouter.post("/:storeId/tables", auth, authorize("admin"), validate(createTableSchema), async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const table = await tableService.createTable(storeId, req.body.tableNumber, req.body.password, req.body.capacity);
    res.status(201).json(toResponse(table));
  } catch (err) {
    next(err);
  }
});

tableRouter.get("/:storeId/tables", auth, authorize("admin"), async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const tables = await tableService.getTables(storeId);
    res.json(tables.map(toResponse));
  } catch (err) {
    next(err);
  }
});

tableRouter.get("/:storeId/tables/:tableId", auth, authorize("admin", "table"), async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const tableId = Number(req.params.tableId);
    const table = await tableService.getTable(storeId, tableId);
    res.json(toResponse(table));
  } catch (err) {
    next(err);
  }
});

tableRouter.post("/:storeId/tables/:tableId/start-session", auth, authorize("table"), async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const tableId = Number(req.params.tableId);
    const session = await tableService.startSession(storeId, tableId);
    res.json({ sessionId: session.id });
  } catch (err) {
    next(err);
  }
});

tableRouter.post("/:storeId/tables/:tableId/end-session", auth, authorize("admin"), async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const tableId = Number(req.params.tableId);
    const completedAt = await tableService.endSession(storeId, tableId);
    res.json({ completedAt: completedAt.toISOString() });
  } catch (err) {
    next(err);
  }
});

tableRouter.get("/:storeId/tables/:tableId/session", auth, authorize("admin", "table"), async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const tableId = Number(req.params.tableId);
    const session = await tableService.getActiveSession(storeId, tableId);
    res.json(session);
  } catch (err) {
    next(err);
  }
});
