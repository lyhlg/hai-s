# Component Dependencies

## Dependency Matrix

| Component | 의존 대상 | 관계 |
|-----------|----------|------|
| Auth | Store, Table | Store/Table 유효성 검증 |
| Store | - | 독립 (최하위) |
| Table | - | 독립 (최하위) |
| Menu | Store | 매장 소유권 검증 |
| Order | Menu, Table | 메뉴 유효성, 테이블/세션 참조 |
| Settlement | Order | 주문 데이터 집계 |
| SSE | - | 독립 (이벤트 브로커) |

## Communication Patterns

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Customer App │────▶│  Go Backend │◀────│  Admin App  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  MySQL   │ │   SSE    │ │  Local   │
        │    DB    │ │ Channels │ │  Files   │
        └──────────┘ └──────────┘ └──────────┘
```

## Data Flow

### 주문 생성 플로우
```
Customer App → POST /orders
  → AuthMiddleware (JWT 검증)
  → OrderService.CreateOrder
    → MenuComponent.GetMenu (메뉴 유효성)
    → TableComponent.GetActiveSession (세션 확인, 없으면 자동 시작)
    → OrderComponent.CreateOrder (DB 저장)
    → SSEService.PublishOrderEvent (실시간 알림)
  → Response (주문 번호)
```

### 주문 상태 변경 플로우
```
Admin App → PATCH /orders/:id/status
  → AuthMiddleware (JWT 검증, 관리자 권한)
  → OrderService.UpdateStatus
    → OrderComponent.UpdateOrderStatus (DB 업데이트)
    → SSEService.PublishOrderEvent (고객 + 관리자 알림)
  → Response (업데이트된 주문)
```

### 테이블 세션 종료 플로우
```
Admin App → POST /tables/:id/end-session
  → AuthMiddleware (JWT 검증, 관리자 권한)
  → TableService.EndSession
    → OrderComponent.GetOrdersBySession (현재 주문 조회)
    → OrderComponent → OrderHistory (과거 이력 이동)
    → TableComponent.EndSession (세션 종료, 리셋)
    → SSEService.PublishOrderEvent (테이블 리셋 알림)
  → Response (완료)
```

## 레이어 구조 (Node.js Backend)

```
src/
├── routes/         ← Express 라우터 (요청/응답 처리)
│   ├── auth.ts
│   ├── menu.ts
│   ├── order.ts
│   ├── table.ts
│   ├── settlement.ts
│   └── sse.ts
├── services/       ← 비즈니스 로직 오케스트레이션
│   ├── auth.ts
│   ├── menu.ts
│   ├── order.ts
│   ├── table.ts
│   ├── settlement.ts
│   └── sse.ts
├── repositories/   ← 데이터 접근 (MySQL)
│   ├── store.ts
│   ├── table.ts
│   ├── menu.ts
│   ├── order.ts
│   └── session.ts
├── models/         ← 데이터 모델 / 타입
├── middleware/      ← JWT 인증 미들웨어
├── config/         ← 설정
└── index.ts        ← 엔트리포인트
```
