# Unit of Work - Story Map

## Story → Unit 매핑

| Story | 제목 | Unit | 우선순위 |
|-------|------|------|----------|
| US-1 | 테이블 태블릿 자동 로그인 | Unit 1: Core | Must |
| US-2 | 관리자 매장 로그인 | Unit 1: Core | Must |
| US-3 | 메뉴 조회 및 탐색 | Unit 2: Menu | Must |
| US-4 | 메뉴 관리 (CRUD) | Unit 2: Menu | Should |
| US-5 | 장바구니 관리 | Unit 3: Order | Must |
| US-6 | 주문 생성 | Unit 3: Order | Must |
| US-7 | 주문 내역 조회 | Unit 3: Order | Must |
| US-8 | 실시간 주문 모니터링 | Unit 3: Order | Must |
| US-9 | 일매출 정산 | Unit 4: Session & Settlement | Should |
| US-10 | 테이블 초기 설정 | Unit 1: Core | Must |
| US-11 | 주문 삭제 | Unit 3: Order | Must |
| US-12 | 테이블 세션 종료 | Unit 4: Session & Settlement | Must |
| US-13 | 과거 주문 내역 조회 | Unit 4: Session & Settlement | Should |

## Unit별 요약

| Unit | Story 수 | Must | Should |
|------|----------|------|--------|
| Unit 1: Core | 3 | 3 | 0 |
| Unit 2: Menu | 2 | 1 | 1 |
| Unit 3: Order | 5 | 5 | 0 |
| Unit 4: Session & Settlement | 3 | 1 | 2 |
| **합계** | **13** | **10** | **3** |
