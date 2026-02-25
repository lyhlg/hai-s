import type { MenuRepository } from "../repositories/menu.js";
import type { StoreRepository } from "../repositories/store.js";
import { NotFoundError } from "../errors/index.js";

export class MenuService {
  constructor(
    private menuRepo: MenuRepository,
    private storeRepo: StoreRepository,
  ) {}

  async createMenuItem(storeId: string, input: { name: string; description?: string; price: number; category: string; imageUrl?: string; isPopular?: boolean; displayOrder?: number }) {
    if (!(await this.storeRepo.validate(storeId))) throw new NotFoundError("매장을 찾을 수 없습니다");
    return this.menuRepo.create(storeId, input);
  }

  async getMenuItems(storeId: string) {
    if (!(await this.storeRepo.validate(storeId))) throw new NotFoundError("매장을 찾을 수 없습니다");
    return this.menuRepo.getByStore(storeId);
  }

  async updateMenuItem(storeId: string, menuId: string, input: { name?: string; description?: string | null; price?: number; category?: string; imageUrl?: string | null; isAvailable?: boolean; isPopular?: boolean; displayOrder?: number }) {
    const menu = await this.menuRepo.getById(menuId);
    if (!menu || menu.store_id !== storeId) throw new NotFoundError("메뉴를 찾을 수 없습니다");
    await this.menuRepo.update(menuId, input);
  }

  async deleteMenuItem(storeId: string, menuId: string) {
    const menu = await this.menuRepo.getById(menuId);
    if (!menu || menu.store_id !== storeId) throw new NotFoundError("메뉴를 찾을 수 없습니다");
    await this.menuRepo.deleteItem(menuId);
  }
}
