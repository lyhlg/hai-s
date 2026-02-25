import type { SettlementRepository } from "../repositories/settlement.js";
import type { StoreRepository } from "../repositories/store.js";
import { NotFoundError } from "../errors/index.js";

export class SettlementService {
  constructor(
    private settlementRepo: SettlementRepository,
    private storeRepo: StoreRepository,
  ) {}

  async getDailySales(storeId: string, date: string) {
    if (!(await this.storeRepo.validate(storeId))) throw new NotFoundError("매장을 찾을 수 없습니다");
    const daily = await this.settlementRepo.getDailySales(storeId, date);
    const tables = await this.settlementRepo.getTableSales(storeId, date);
    return { date, ...daily, tables };
  }
}
