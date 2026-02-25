# 병렬 작업 티켓 분배 (4명)

> PR 충돌 0건을 목표로 파일 소유권을 완전 분리한 티켓 구조

---

## 담당자 역할

| 담당자 | 전문 영역 |
|--------|----------|
| 개발자 A | 인프라 셋업, Menu BE, Settlement BE |
| 개발자 B | Core BE, Order + SSE BE, 세션종료 BE |
| 개발자 C | Customer App 전체 |
| 개발자 D | Admin App 전체 |

---

## Phase 0: 프로젝트 셋업 (A 단독, 반나절)

### T1: 프로젝트 셋업 + 전체 DB 스키마 + 빈 껍데기

- **담당**: 개발자 A
- **산출물**:
  - Turborepo 초기화 (`turbo.json`, `pnpm-workspace.yaml`, root `package.json`)
  - `packages/shared/src/types/` — 전체 도메인 타입 정의 (store, table, menu, order, settlement, auth, sse)
  - `apps/backend/` — package.json (의존성 전부), DB 설정, 전체 마이그레이션
  - `apps/backend/src/index.ts` — 모든 라우트 마운트 포인트 미리 선언
  - `apps/backend/src/routes/*.ts` — 빈 라우터 껍데기 (auth, table, menu, order, settlement, sse)
  - `apps/customer/` — package.json, vite.config.ts, 빈 src 구조
  - `apps/admin/` — package.json, vite.config.ts, 빈 src 구조
- **완료 조건**: `pnpm install && pnpm build` 성공, 빈 앱 3개 기동 확인

> T1 완료 후 Phase 1 시작

---

## Phase 1: 기반 구축 (B, C, D 동시)

### T2: Auth + Store + Table 백엔드 (Unit 1 BE)

- **담당**: 개발자 B
- **터치 파일**:
  - `apps/backend/src/routes/auth.ts`, `routes/table.ts`
  - `apps/backend/src/services/auth.ts`, `services/table.ts`
  - `apps/backend/src/repositories/store.ts`, `repositories/table.ts`, `repositories/session.ts`
  - `apps/backend/src/middleware/auth.ts`
- **관련 스토리**: US-1, US-2, US-10
- **완료 조건**: Auth/Table API 동작, JWT 발급/검증 확인

### T3: Customer App 셋업 + 공통 컴포넌트 + 로그인

- **담당**: 개발자 C
- **터치 파일**: `apps/customer/src/**` 전체
- **관련 스토리**: US-1
- **산출물**: 라우팅, 공통 UI (Header, Layout, Button, Modal), API client, 로그인 페이지
- **완료 조건**: mock API로 자동 로그인 플로우 동작

### T4: Admin App 셋업 + 공통 컴포넌트 + 로그인 + 테이블관리

- **담당**: 개발자 D
- **터치 파일**: `apps/admin/src/**` 전체
- **관련 스토리**: US-2, US-10
- **산출물**: 라우팅, 공통 UI, API client, 관리자 로그인, 테이블 설정 페이지
- **완료 조건**: mock API로 로그인 + 테이블 CRUD 동작

---

## Phase 2: 핵심 기능 (4명 동시)

### T5: Menu 백엔드 (Unit 2 BE)

- **담당**: 개발자 A
- **터치 파일**:
  - `apps/backend/src/routes/menu.ts`
  - `apps/backend/src/services/menu.ts`
  - `apps/backend/src/repositories/menu.ts`
- **관련 스토리**: US-3, US-4
- **완료 조건**: Menu CRUD API, 카테고리 조회, 순서 변경 동작

### T6: Order + SSE 백엔드 (Unit 3 BE)

- **담당**: 개발자 B
- **터치 파일**:
  - `apps/backend/src/routes/order.ts`, `routes/sse.ts`
  - `apps/backend/src/services/order.ts`, `services/sse.ts`
  - `apps/backend/src/repositories/order.ts`
- **관련 스토리**: US-5, US-6, US-7, US-8, US-11
- **완료 조건**: 주문 CRUD API, SSE 이벤트 발행/구독 동작

### T7: Customer App 메뉴 + 장바구니 + 주문

- **담당**: 개발자 C
- **터치 파일**: `apps/customer/src/**`
- **관련 스토리**: US-3, US-5, US-6, US-7
- **산출물**: 메뉴 조회, 장바구니 (localStorage), 주문 생성/내역, SSE 연동
- **완료 조건**: 고객 주문 플로우 E2E 동작 (BE 연동 후)

### T8: Admin App 메뉴관리 + 주문 모니터링

- **담당**: 개발자 D
- **터치 파일**: `apps/admin/src/**`
- **관련 스토리**: US-4, US-8, US-11
- **산출물**: 메뉴 CRUD 페이지, 실시간 주문 대시보드, 주문 상태 변경/삭제 UI
- **완료 조건**: 관리자 메뉴관리 + 주문 모니터링 동작 (BE 연동 후)

---

## Phase 3: 정산 + 마무리 (4명 동시)

### T9: Settlement 백엔드 (Unit 4 BE 일부)

- **담당**: 개발자 A
- **터치 파일**:
  - `apps/backend/src/routes/settlement.ts`
  - `apps/backend/src/services/settlement.ts`
  - `apps/backend/src/repositories/settlement.ts` (필요 시)
- **관련 스토리**: US-9
- **완료 조건**: 일매출 집계 API 동작

### T10: 세션 종료 + 과거 내역 백엔드 (Unit 4 BE 일부)

- **담당**: 개발자 B
- **터치 파일**:
  - `apps/backend/src/routes/table.ts` (EndSession 엔드포인트 추가)
  - `apps/backend/src/services/table.ts` (EndSession 로직 추가)
- **관련 스토리**: US-12, US-13
- **완료 조건**: 세션 종료 → 과거 이력 이동 → 테이블 리셋 플로우 동작

### T11: Customer App 통합 + 폴리싱

- **담당**: 개발자 C
- **터치 파일**: `apps/customer/src/**`
- **관련 스토리**: 전체 Customer 스토리 통합
- **산출물**: mock → 실제 API 전환, 에러 핸들링, UX 개선
- **완료 조건**: Customer App 전체 플로우 정상 동작

### T12: Admin App 정산 + 세션종료 + 과거내역

- **담당**: 개발자 D
- **터치 파일**: `apps/admin/src/**`
- **관련 스토리**: US-9, US-12, US-13
- **산출물**: 이용 완료 UI, 과거 주문 내역, 일매출 정산 페이지
- **완료 조건**: Admin App 전체 플로우 정상 동작

---

## 파일 소유권 매트릭스

> 각 Phase에서 동시에 같은 파일을 수정하는 경우가 없음을 보장

| 파일/디렉토리 | Phase 0 (A) | Phase 1 (B/C/D) | Phase 2 (A/B/C/D) | Phase 3 (A/B/C/D) |
|---|---|---|---|---|
| `turbo.json`, `pnpm-workspace.yaml` | A ✏️ | - | - | - |
| `packages/shared/types/` | A ✏️ | - | - | - |
| `backend/src/index.ts` | A ✏️ | - | - | - |
| `backend/routes/auth.ts` | A(빈껍데기) | B ✏️ | - | - |
| `backend/routes/table.ts` | A(빈껍데기) | B ✏️ | - | B ✏️ |
| `backend/routes/menu.ts` | A(빈껍데기) | - | A ✏️ | - |
| `backend/routes/order.ts` | A(빈껍데기) | - | B ✏️ | - |
| `backend/routes/settlement.ts` | A(빈껍데기) | - | - | A ✏️ |
| `backend/routes/sse.ts` | A(빈껍데기) | - | B ✏️ | - |
| `backend/services/auth.ts` | - | B ✏️ | - | - |
| `backend/services/table.ts` | - | B ✏️ | - | B ✏️ |
| `backend/services/menu.ts` | - | - | A ✏️ | - |
| `backend/services/order.ts` | - | - | B ✏️ | - |
| `backend/services/settlement.ts` | - | - | - | A ✏️ |
| `backend/services/sse.ts` | - | - | B ✏️ | - |
| `backend/repositories/store.ts` | - | B ✏️ | - | - |
| `backend/repositories/table.ts` | - | B ✏️ | - | - |
| `backend/repositories/session.ts` | - | B ✏️ | - | - |
| `backend/repositories/menu.ts` | - | - | A ✏️ | - |
| `backend/repositories/order.ts` | - | - | B ✏️ | - |
| `backend/middleware/auth.ts` | - | B ✏️ | - | - |
| `backend/migrations/` | A ✏️ | - | - | - |
| `customer/src/**` | - | C ✏️ | C ✏️ | C ✏️ |
| `admin/src/**` | - | D ✏️ | D ✏️ | D ✏️ |

**충돌 검증**: 모든 Phase 내에서 같은 파일을 서로 다른 담당자가 수정하는 경우 없음 ✅

---

## 충돌 방지 핵심 규칙

1. **T1에서 모든 공유 파일 확정** — `index.ts`, `shared/types`, `package.json`, 마이그레이션은 Phase 0에서 완성
2. **빈 껍데기 패턴** — 라우트 파일을 빈 Router로 미리 생성, 각 담당자가 내부만 구현
3. **프론트엔드 앱 완전 분리** — `customer/src/`는 C 전담, `admin/src/`는 D 전담
4. **백엔드 도메인 분리** — A(Menu, Settlement), B(Auth, Table, Order, SSE)로 파일 단위 분리
5. **Phase 간 sync point** — 각 Phase 완료 시 `main` 브랜치 머지 후 다음 Phase 시작
