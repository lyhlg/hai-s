import { http, HttpResponse, delay } from 'msw';

// mock 데이터
let tableIdSeq = 3;
const mockTables = [
  { id: '1', store_id: '1', table_number: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: '2', store_id: '1', table_number: 2, created_at: '2026-01-01T00:00:00Z' },
];

// 간단한 JWT-like token 생성 (mock 전용)
function makeMockToken(storeId: string) {
  const payload = btoa(JSON.stringify({ userId: 1, storeId: Number(storeId), role: 'admin', exp: Date.now() / 1000 + 57600 }));
  return `mock.${payload}.sig`;
}

let loginFailCount = 0;

export const handlers = [
  // POST /api/auth/admin/login
  http.post('/api/auth/admin/login', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, string>;

    if (loginFailCount >= 5) {
      return HttpResponse.json(
        { error: 'TOO_MANY_ATTEMPTS', message: '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요', retryAfter: 900 },
        { status: 429 },
      );
    }

    if (body.username === 'admin' && body.password === 'admin123') {
      loginFailCount = 0;
      const token = makeMockToken(body.storeId);
      return HttpResponse.json({ token, expiresAt: new Date(Date.now() + 57600000).toISOString() });
    }

    loginFailCount++;
    return HttpResponse.json(
      { error: 'UNAUTHORIZED', message: '매장 ID, 사용자명 또는 비밀번호가 올바르지 않습니다' },
      { status: 401 },
    );
  }),

  // GET /api/stores/:storeId/tables
  http.get('/api/stores/:storeId/tables', async () => {
    await delay(200);
    return HttpResponse.json(mockTables);
  }),

  // GET /api/stores/:storeId/tables/:tableId
  http.get('/api/stores/:storeId/tables/:tableId', async ({ params }) => {
    await delay(200);
    const table = mockTables.find((t) => t.id === params.tableId);
    if (!table) return HttpResponse.json({ error: 'NOT_FOUND', message: '테이블을 찾을 수 없습니다' }, { status: 404 });
    return HttpResponse.json(table);
  }),

  // POST /api/stores/:storeId/tables
  http.post('/api/stores/:storeId/tables', async ({ request, params }) => {
    await delay(300);
    const body = (await request.json()) as { tableNumber: number; password: string };
    if (mockTables.some((t) => t.table_number === body.tableNumber)) {
      return HttpResponse.json({ error: 'CONFLICT', message: '이미 존재하는 테이블 번호입니다' }, { status: 409 });
    }
    const newTable = {
      id: String(tableIdSeq++),
      store_id: String(params.storeId),
      table_number: body.tableNumber,
      created_at: new Date().toISOString(),
    };
    mockTables.push(newTable);
    return HttpResponse.json(newTable, { status: 201 });
  }),
];
