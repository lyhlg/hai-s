import jwt from "jsonwebtoken";
import type { StoreRepository } from "../repositories/store.js";
import type { AdminUserRepository } from "../repositories/admin-user.js";
import type { TableRepository } from "../repositories/table.js";
import type { LoginAttemptRepository } from "../repositories/login-attempt.js";
import { comparePassword } from "../utils/password.js";
import { NotFoundError, UnauthorizedError, TooManyAttemptsError } from "../errors/index.js";

export class AuthService {
  constructor(
    private storeRepo: StoreRepository,
    private adminUserRepo: AdminUserRepository,
    private tableRepo: TableRepository,
    private loginAttemptRepo: LoginAttemptRepository,
    private jwtSecret: string,
  ) {}

  async loginAdmin(storeId: string, username: string, password: string) {
    if (!(await this.storeRepo.validate(storeId))) {
      throw new NotFoundError("매장을 찾을 수 없습니다");
    }

    const identifier = `store:${storeId}:admin:${username}`;
    await this.checkLoginAllowed(identifier);

    const user = await this.adminUserRepo.findByStoreAndUsername(storeId, username);
    if (!user || !(await comparePassword(password, user.password_hash!))) {
      await this.loginAttemptRepo.record(identifier, false);
      throw new UnauthorizedError("매장 ID, 사용자명 또는 비밀번호가 올바르지 않습니다");
    }

    await this.loginAttemptRepo.record(identifier, true);

    const token = jwt.sign({ userId: user.id, storeId, role: "admin" }, this.jwtSecret, { expiresIn: "16h" });
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    return { token, expiresAt: new Date(decoded.exp! * 1000).toISOString() };
  }

  async loginTable(storeId: string, tableNumber: number, password: string) {
    if (!(await this.storeRepo.validate(storeId))) {
      throw new NotFoundError("매장을 찾을 수 없습니다");
    }

    const identifier = `store:${storeId}:table:${tableNumber}`;
    await this.checkLoginAllowed(identifier);

    const table = await this.tableRepo.findByStoreAndNumber(storeId, tableNumber);
    if (!table || !(await comparePassword(password, table.password_hash!))) {
      await this.loginAttemptRepo.record(identifier, false);
      throw new UnauthorizedError("매장 ID, 테이블 번호 또는 비밀번호가 올바르지 않습니다");
    }

    await this.loginAttemptRepo.record(identifier, true);

    const token = jwt.sign(
      { tableId: table.id, storeId, tableNumber, role: "table" },
      this.jwtSecret,
      { expiresIn: "16h" },
    );

    return { token, storeId, tableId: table.id, tableNumber };
  }

  private async checkLoginAllowed(identifier: string) {
    const failures = await this.loginAttemptRepo.countRecentFailures(identifier, 15);
    if (failures >= 5) throw new TooManyAttemptsError();
  }
}
