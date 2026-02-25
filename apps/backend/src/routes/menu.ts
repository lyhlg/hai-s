import { Router } from "express";
import { pool } from "../db.js";
import { config } from "../config/index.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createMenuItemSchema, updateMenuItemSchema } from "../schemas/menu.js";
import { MenuService } from "../services/menu.js";
import { MenuRepository } from "../repositories/menu.js";
import { StoreRepository } from "../repositories/store.js";

const router = Router({ mergeParams: true });
const auth = authenticate(config.jwt.secret);

const menuService = new MenuService(
  new MenuRepository(pool),
  new StoreRepository(pool),
);

// POST /api/stores/:storeId/menu - 메뉴 생성 (Admin only)
router.post("/", auth, authorize("admin"), validate(createMenuItemSchema), async (req, res, next) => {
  try {
    const storeId = req.params.storeId as string;
    const item = await menuService.createMenuItem(storeId, {
      name: req.body.name, description: req.body.description, price: req.body.price,
      category: req.body.category, imageUrl: req.body.imageUrl,
      isPopular: req.body.isPopular, displayOrder: req.body.displayOrder,
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

// GET /api/stores/:storeId/menu - 메뉴 목록 조회 (Admin/Table)
router.get("/", auth, authorize("admin", "table"), async (req, res, next) => {
  try {
    const items = await menuService.getMenuItems(req.params.storeId as string);
    res.json(items);
  } catch (err) { next(err); }
});

// PUT /api/stores/:storeId/menu/:menuId - 메뉴 수정 (Admin only)
router.put("/:menuId", auth, authorize("admin"), validate(updateMenuItemSchema), async (req, res, next) => {
  try {
    const { storeId, menuId } = req.params as Record<string, string>;
    await menuService.updateMenuItem(storeId, menuId, req.body);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// DELETE /api/stores/:storeId/menu/:menuId - 메뉴 삭제 (Admin only)
router.delete("/:menuId", auth, authorize("admin"), async (req, res, next) => {
  try {
    const { storeId, menuId } = req.params as Record<string, string>;
    await menuService.deleteMenuItem(storeId, menuId);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
