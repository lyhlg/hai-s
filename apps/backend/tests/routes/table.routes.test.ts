import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

// Mock services before importing app
const mockCreateTable = vi.fn();
const mockGetTables = vi.fn();
const mockGetTable = vi.fn();
const mockStartSession = vi.fn();
const mockEndSession = vi.fn();
const mockGetActiveSession = vi.fn();
vi.mock("../../src/services/table.js", () => ({
  TableService: vi.fn().mockImplementation(() => ({
    createTable: mockCreateTable,
    getTables: mockGetTables,
    getTable: mockGetTable,
    startSession: mockStartSession,
    endSession: mockEndSession,
    getActiveSession: mockGetActiveSession,
  })),
}));

const { default: supertest } = await import("supertest");
const { app } = await import("../../src/index.js");

const SECRET = "test-secret";
const adminToken = jwt.sign({ userId: "admin-001", storeId: "store-001", role: "admin" }, SECRET);
const tableToken = jwt.sign({ tableId: "table-001", storeId: "store-001", tableNumber: 1, role: "table" }, SECRET);

describe("Table Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/stores/:storeId/tables", () => {
    it("returns 201 on successful creation (admin)", async () => {
      const now = new Date();
      mockCreateTable.mockResolvedValue({ id: "t1", store_id: "store-001", table_number: 1, capacity: 4, is_active: true, created_at: now });

      const res = await supertest(app)
        .post("/api/stores/store-001/tables")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ tableNumber: 1, password: "pass123" });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe("t1");
      expect(res.body.tableNumber).toBe(1);
      expect(res.body.capacity).toBe(4);
      expect(res.body.isActive).toBe(true);
    });

    it("returns 401 without token", async () => {
      const res = await supertest(app)
        .post("/api/stores/store-001/tables")
        .send({ tableNumber: 1, password: "pass" });

      expect(res.status).toBe(401);
    });

    it("returns 403 with table role", async () => {
      const res = await supertest(app)
        .post("/api/stores/store-001/tables")
        .set("Authorization", `Bearer ${tableToken}`)
        .send({ tableNumber: 1, password: "pass" });

      expect(res.status).toBe(403);
    });

    it("returns 400 on invalid body", async () => {
      const res = await supertest(app)
        .post("/api/stores/store-001/tables")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ tableNumber: -1 });

      expect(res.status).toBe(400);
    });

    it("returns 409 on duplicate table", async () => {
      const { ConflictError } = await import("../../src/errors/index.js");
      mockCreateTable.mockRejectedValue(new ConflictError("이미 존재하는 테이블 번호입니다"));

      const res = await supertest(app)
        .post("/api/stores/store-001/tables")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ tableNumber: 1, password: "pass" });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("CONFLICT");
    });
  });

  describe("GET /api/stores/:storeId/tables", () => {
    it("returns table list (admin)", async () => {
      const now = new Date();
      mockGetTables.mockResolvedValue([
        { id: "t1", store_id: "s1", table_number: 1, capacity: 4, is_active: true, created_at: now },
        { id: "t2", store_id: "s1", table_number: 2, capacity: 6, is_active: true, created_at: now },
      ]);

      const res = await supertest(app)
        .get("/api/stores/store-001/tables")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("returns 403 with table role", async () => {
      const res = await supertest(app)
        .get("/api/stores/store-001/tables")
        .set("Authorization", `Bearer ${tableToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/stores/:storeId/tables/:tableId", () => {
    it("returns table detail (admin or table)", async () => {
      const now = new Date();
      mockGetTable.mockResolvedValue({ id: "t1", store_id: "s1", table_number: 1, capacity: 4, is_active: true, created_at: now });

      const res = await supertest(app)
        .get("/api/stores/store-001/tables/t1")
        .set("Authorization", `Bearer ${tableToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe("t1");
    });
  });

  describe("POST /api/stores/:storeId/tables/:tableId/start-session", () => {
    it("returns session id (table role)", async () => {
      mockStartSession.mockResolvedValue({ id: "ses-1" });

      const res = await supertest(app)
        .post("/api/stores/store-001/tables/t1/start-session")
        .set("Authorization", `Bearer ${tableToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sessionId).toBe("ses-1");
    });

    it("returns 403 with admin role", async () => {
      const res = await supertest(app)
        .post("/api/stores/store-001/tables/t1/start-session")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/stores/:storeId/tables/:tableId/end-session", () => {
    it("returns completedAt (admin role)", async () => {
      const now = new Date();
      mockEndSession.mockResolvedValue(now);

      const res = await supertest(app)
        .post("/api/stores/store-001/tables/t1/end-session")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.completedAt).toBe(now.toISOString());
    });

    it("returns 400 when no active session", async () => {
      const { BadRequestError } = await import("../../src/errors/index.js");
      mockEndSession.mockRejectedValue(new BadRequestError("활성 세션이 없습니다"));

      const res = await supertest(app)
        .post("/api/stores/store-001/tables/t1/end-session")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("BAD_REQUEST");
    });

    it("returns 403 with table role", async () => {
      const res = await supertest(app)
        .post("/api/stores/store-001/tables/t1/end-session")
        .set("Authorization", `Bearer ${tableToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/stores/:storeId/tables/:tableId/session", () => {
    it("returns active session (admin or table)", async () => {
      mockGetActiveSession.mockResolvedValue({ id: "ses-1", store_id: "s1", table_id: "t1", is_active: true });

      const res = await supertest(app)
        .get("/api/stores/store-001/tables/t1/session")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe("ses-1");
    });
  });
});
