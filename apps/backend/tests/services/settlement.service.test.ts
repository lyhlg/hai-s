import { describe, it, expect, vi, beforeEach } from "vitest";
import { SettlementService } from "../../src/services/settlement.js";

const mockSettlementRepo = { getDailySales: vi.fn(), getTableSales: vi.fn() };
const mockStoreRepo = { validate: vi.fn() };

describe("SettlementService", () => {
  let service: SettlementService;

  beforeEach(() => {
    service = new SettlementService(mockSettlementRepo as any, mockStoreRepo as any);
    vi.clearAllMocks();
  });

  it("returns daily sales with table breakdown", async () => {
    mockStoreRepo.validate.mockResolvedValue(true);
    mockSettlementRepo.getDailySales.mockResolvedValue({ total_orders: 5, total_amount: 50000 });
    mockSettlementRepo.getTableSales.mockResolvedValue([
      { table_id: "t1", table_number: 1, total_orders: 3, total_amount: 30000 },
    ]);

    const result = await service.getDailySales("s1", "2026-02-25");
    expect(result.date).toBe("2026-02-25");
    expect(result.total_orders).toBe(5);
    expect(result.total_amount).toBe(50000);
    expect(result.tables).toHaveLength(1);
  });

  it("throws when store not found", async () => {
    mockStoreRepo.validate.mockResolvedValue(false);
    await expect(service.getDailySales("bad", "2026-02-25")).rejects.toThrow("매장을 찾을 수 없습니다");
  });
});
