# Unit 3: Order + SSE - TDD Code Generation Plan

> TDD 방식: Red (테스트 작성) → Green (최소 구현) → Refactor

---

## Step 0: 사전 준비
- [x] 0-1. shared types 수정 (Order, OrderItem, SSE 타입 — id를 string UUID로 통일)
- [x] 0-2. DB migration 추가 (orders, order_items 테이블)
- [x] 0-3. zod 스키마 작성 (schemas/order.ts)

## Step 1: OrderRepository
- [x] 1-1. RED: order.repository.test.ts (create, getById, getBySession, updateStatus, deleteOrder 테스트)
- [x] 1-2. GREEN: repositories/order.ts 구현

## Step 2: SSE Manager
- [x] 2-1. RED: sse-manager.test.ts (subscribe, unsubscribe, broadcast 테스트)
- [x] 2-2. GREEN: services/sse-manager.ts 구현 (EventEmitter 기반)

## Step 3: OrderService
- [x] 3-1. RED: order.service.test.ts (createOrder, getOrders, updateStatus, deleteOrder 테스트 — 세션 검증, 메뉴 검증, SSE 이벤트 발행 포함)
- [x] 3-2. GREEN: services/order.ts 구현

## Step 4: Order Routes
- [x] 4-1. RED: order.routes.test.ts (POST/GET/PUT/DELETE 통합 테스트)
- [x] 4-2. GREEN: routes/order.ts 구현

## Step 5: SSE Routes
- [x] 5-1. RED: sse.routes.test.ts (SSE 연결, 이벤트 수신 테스트)
- [x] 5-2. GREEN: routes/sse.ts 구현

## Step 6: 통합 검증
- [x] 6-1. 전체 테스트 실행 및 통과 확인 (17 files, 107 tests passed)

---

## API Endpoints 설계

### Order Routes (인증 필요)

| Method | Path | Auth | 설명 |
|--------|------|------|------|
| POST | `/api/orders` | Table | 주문 생성 |
| GET | `/api/orders?sessionId=` | Table/Admin | 세션별 주문 목록 |
| PUT | `/api/orders/:orderId/status` | Admin | 주문 상태 변경 |
| DELETE | `/api/orders/:orderId` | Admin | 주문 삭제 |

### SSE Routes

| Method | Path | Auth | 설명 |
|--------|------|------|------|
| GET | `/api/sse/orders?storeId=` | Admin | 매장 주문 실시간 스트림 |

---

## 비즈니스 규칙

### BR-ORDER-1: 주문 생성
1. JWT에서 storeId, tableId 추출
2. 활성 세션 확인 → 없으면 자동 생성 (TableService.startSession)
3. 메뉴 아이템 존재 + 판매 가능(is_available) 검증
4. orders + order_items INSERT (트랜잭션)
5. SSE로 order:created 이벤트 broadcast
6. 주문 번호(순번) 반환

### BR-ORDER-2: 주문 목록 조회
- session_id 기준 조회, created_at DESC 정렬
- order_items JOIN하여 반환

### BR-ORDER-3: 주문 상태 변경
- Admin만 가능
- 유효 상태 전이: pending→confirmed→preparing→ready→served
- SSE로 order:updated 이벤트 broadcast

### BR-ORDER-4: 주문 삭제
- Admin만 가능
- orders + order_items DELETE (트랜잭션)
- SSE로 order:cancelled 이벤트 broadcast

---

## 파일 생성 목록

```
packages/shared/src/types/order.ts    (수정)
packages/shared/src/types/sse.ts      (수정)

apps/backend/
├── migrations/002_orders.sql
├── src/
│   ├── schemas/order.ts
│   ├── repositories/order.ts
│   ├── services/order.ts
│   ├── services/sse-manager.ts
│   ├── routes/order.ts              (기존 TODO 교체)
│   └── routes/sse.ts                (기존 TODO 교체)
└── tests/
    ├── repositories/order.repository.test.ts
    ├── services/order.service.test.ts
    ├── services/sse-manager.test.ts
    ├── routes/order.routes.test.ts
    └── routes/sse.routes.test.ts
```
