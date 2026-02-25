# Unit 1: Core - TDD Code Generation Plan

> TDD 방식: Red (테스트 작성) → Green (최소 구현) → Refactor

---

## Step 0: 프로젝트 초기 설정
- [x] 0-1. Turborepo 모노레포 루트 설정 (turbo.json, pnpm-workspace.yaml, root package.json)
- [x] 0-2. `packages/shared` 패키지 (공통 타입)
- [x] 0-3. `apps/backend` 패키지 초기 설정 (package.json, tsconfig.json)
- [x] 0-4. 백엔드 기본 구조 (config, Express 엔트리포인트, DB 연결)
- [x] 0-5. 공통 인프라 코드 (errors, middleware/error-handler, middleware/logger)
- [x] 0-6. DB 마이그레이션 (stores, admin_users, tables, table_sessions, login_attempts)
- [x] 0-7. Seed 스크립트 (초기 매장 + 관리자 계정)

## Step 1: 비밀번호 유틸리티
- [x] 1-1. RED: password.test.ts (hashPassword, comparePassword 테스트)
- [x] 1-2. GREEN: password.ts 구현

## Step 2: Store Repository & Service
- [x] 2-1. RED: store.repository.test.ts (getStore, validateStore 테스트)
- [x] 2-2. GREEN: store.repository.ts 구현
- [x] 2-3. RED: store.test.ts (models/types 테스트)
- [x] 2-4. GREEN: models/types.ts, schemas/store.ts

## Step 3: Auth (로그인 시도 제한 + 로그인)
- [x] 3-1. RED: login-attempt.repository.test.ts (countRecentFailures, record 테스트)
- [x] 3-2. GREEN: login-attempt.repository.ts 구현
- [x] 3-3. RED: admin-user.repository.test.ts (findByStoreAndUsername 테스트)
- [x] 3-4. GREEN: admin-user.repository.ts 구현
- [x] 3-5. RED: auth.service.test.ts (loginAdmin, loginTable, checkLoginAllowed 테스트)
- [x] 3-6. GREEN: auth.service.ts 구현
- [x] 3-7. RED: auth.middleware.test.ts (authenticate, authorize 테스트)
- [x] 3-8. GREEN: middleware/auth.ts 구현
- [x] 3-9. RED: auth.routes.test.ts (POST /api/auth/admin/login, POST /api/auth/table/login 통합 테스트)
- [x] 3-10. GREEN: routes/auth.ts 구현, schemas/auth.ts

## Step 4: Table (CRUD + 세션)
- [x] 4-1. RED: table.repository.test.ts (create, getById, getByStore 테스트)
- [x] 4-2. GREEN: table.repository.ts 구현
- [x] 4-3. RED: session.repository.test.ts (create, findActive, endSession 테스트)
- [x] 4-4. GREEN: session.repository.ts 구현
- [x] 4-5. RED: table.service.test.ts (createTable, getTables, startSession, endSession 테스트)
- [x] 4-6. GREEN: table.service.ts 구현
- [x] 4-7. RED: table.routes.test.ts (POST/GET /api/stores/:storeId/tables, 세션 API 통합 테스트)
- [x] 4-8. GREEN: routes/table.ts 구현, schemas/table.ts

## Step 5: 입력 유효성 검증 미들웨어
- [x] 5-1. RED: validate.middleware.test.ts (zod 스키마 검증 테스트)
- [x] 5-2. GREEN: middleware/validate.ts 구현

## Step 6: 통합 검증
- [x] 6-1. 전체 테스트 실행 및 통과 확인
- [x] 6-2. 린트 검사

---

## 테스트 도구
- **테스트 프레임워크**: vitest
- **HTTP 테스트**: supertest
- **DB 테스트**: 테스트용 MySQL DB 또는 in-memory SQLite (vitest 환경)

## 파일 생성 순서 요약
```
apps/backend/
├── src/
│   ├── config/index.ts
│   ├── index.ts
│   ├── db.ts
│   ├── errors/index.ts
│   ├── utils/password.ts
│   ├── models/types.ts
│   ├── schemas/auth.ts
│   ├── schemas/table.ts
│   ├── middleware/auth.ts
│   ├── middleware/validate.ts
│   ├── middleware/error-handler.ts
│   ├── middleware/logger.ts
│   ├── repositories/store.ts
│   ├── repositories/admin-user.ts
│   ├── repositories/table.ts
│   ├── repositories/session.ts
│   ├── repositories/login-attempt.ts
│   ├── services/auth.ts
│   ├── services/table.ts
│   ├── routes/auth.ts
│   └── routes/table.ts
├── tests/
│   ├── utils/password.test.ts
│   ├── repositories/store.repository.test.ts
│   ├── repositories/admin-user.repository.test.ts
│   ├── repositories/table.repository.test.ts
│   ├── repositories/session.repository.test.ts
│   ├── repositories/login-attempt.repository.test.ts
│   ├── services/auth.service.test.ts
│   ├── services/table.service.test.ts
│   ├── middleware/auth.middleware.test.ts
│   ├── middleware/validate.middleware.test.ts
│   ├── routes/auth.routes.test.ts
│   └── routes/table.routes.test.ts
├── migrations/
│   └── 001_init.sql
└── seeds/
    └── 001_initial_data.sql
```
