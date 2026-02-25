import type { StoreRepository } from "../repositories/store.js";
import type { TableRepository } from "../repositories/table.js";
import type { SessionRepository } from "../repositories/session.js";
import { hashPassword } from "../utils/password.js";
import { NotFoundError, ConflictError, BadRequestError } from "../errors/index.js";

export class TableService {
  constructor(
    private storeRepo: StoreRepository,
    private tableRepo: TableRepository,
    private sessionRepo: SessionRepository,
  ) {}

  async createTable(storeId: string, tableNumber: number, password: string) {
    if (!(await this.storeRepo.validate(storeId))) {
      throw new NotFoundError("매장을 찾을 수 없습니다");
    }
    if (await this.tableRepo.findByStoreAndNumber(storeId, tableNumber)) {
      throw new ConflictError("이미 존재하는 테이블 번호입니다");
    }
    const passwordHash = await hashPassword(password);
    return this.tableRepo.create(storeId, tableNumber, passwordHash);
  }

  async getTables(storeId: string) {
    if (!(await this.storeRepo.validate(storeId))) {
      throw new NotFoundError("매장을 찾을 수 없습니다");
    }
    return this.tableRepo.getByStore(storeId);
  }

  async getTable(storeId: string, tableId: string) {
    const table = await this.tableRepo.getById(tableId);
    if (!table || table.store_id.toString() !== storeId) {
      throw new NotFoundError("테이블을 찾을 수 없습니다");
    }
    return table;
  }

  async startSession(storeId: string, tableId: string) {
    const existing = await this.sessionRepo.findActive(storeId, tableId);
    if (existing) return existing;
    return this.sessionRepo.create(storeId, tableId);
  }

  async endSession(storeId: string, tableId: string) {
    const session = await this.sessionRepo.findActive(storeId, tableId);
    if (!session) throw new BadRequestError("활성 세션이 없습니다");
    return this.sessionRepo.endSession(session.id.toString());
  }

  async getActiveSession(storeId: string, tableId: string) {
    return this.sessionRepo.findActive(storeId, tableId);
  }
}
