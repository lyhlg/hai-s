# Unit of Work - Dependency Matrix

## 의존성 매트릭스

| Unit | 의존 대상 | 의존 유형 |
|------|----------|----------|
| Unit 1: Core | - | 독립 (최하위) |
| Unit 2: Menu | Unit 1 (Store) | 매장 소유권 검증 |
| Unit 3: Order | Unit 1 (Table, Auth), Unit 2 (Menu) | 메뉴 유효성, 테이블/세션 참조 |
| Unit 4: Session & Settlement | Unit 1 (Table), Unit 3 (Order) | 주문 데이터 집계, 세션 관리 |

## 의존성 다이어그램

```
Unit 1 (Core)
  │
  ├──▶ Unit 2 (Menu)
  │       │
  │       ▼
  ├──▶ Unit 3 (Order)
  │       │
  │       ▼
  └──▶ Unit 4 (Session & Settlement)
```

## 병렬 개발 전략 (4명)

> 프론트/백 분리 + 도메인 분리로 PR 충돌 없이 4명 완전 병렬 작업

상세 티켓 분배: [parallel-work-tickets.md](./parallel-work-tickets.md) 참조
