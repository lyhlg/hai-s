# Unit 1: Core - Business Rules

> Store, Table, Auth 컴포넌트의 비즈니스 로직 상세 정의

---

## Auth 비즈니스 규칙

### BR-AUTH-1: 관리자 로그인
1. `store_id`로 매장 존재 여부 확인 → 없으면 404
2. 로그인 시도 제한 확인 (BR-AUTH-3)
3. `store_id + username`으로 admin_users 조회 → 없으면 401
4. bcrypt.compare(password, password_hash) → 불일치 시 401, 실패 기록
5. 성공 시: JWT 발급 (payload: `{userId, storeId, role: "admin"}`, 만료: 16시간)
6. 성공 기록 저장

### BR-AUTH-2: 테이블 로그인
1. `store_id`로 매장 존재 여부 확인 → 없으면 404
2. 로그인 시도 제한 확인 (BR-AUTH-3)
3. `store_id + table_number`로 tables 조회 → 없으면 401
4. bcrypt.compare(password, password_hash) → 불일치 시 401, 실패 기록
5. 성공 시: JWT 발급 (payload: `{tableId, storeId, tableNumber, role: "table"}`, 만료: 16시간)
6. 성공 기록 저장

### BR-AUTH-3: 로그인 시도 제한
- 최근 15분 이내 연속 실패 5회 → 15분간 로그인 차단
- identifier 기준: `store:{storeId}:admin:{username}` 또는 `store:{storeId}:table:{tableNumber}`
- 성공 로그인 시 실패 카운트 리셋 (이후 실패만 카운트)

### BR-AUTH-4: JWT 토큰 검증
1. Authorization 헤더에서 Bearer 토큰 추출
2. JWT 서명 검증 + 만료 확인
3. 유효하면 claims를 request context에 주입
4. 무효하면 401 응답

---

## Store 비즈니스 규칙

### BR-STORE-1: 매장 초기 데이터
- Seed 스크립트로 초기 매장 + 관리자 계정 생성
- 회원가입 기능 없음 (MVP 범위 외)

### BR-STORE-2: 매장 유효성 검증
- `store_id`로 stores 테이블 조회
- 존재하면 `{valid: true}`, 없으면 `{valid: false}`

---

## Table 비즈니스 규칙

### BR-TABLE-1: 테이블 생성
1. `store_id` 매장 존재 확인
2. `store_id + table_number` 중복 확인 → 중복 시 409
3. 비밀번호 bcrypt 해싱 후 저장
4. 생성된 테이블 반환

### BR-TABLE-2: 테이블 목록 조회
- `store_id` 기준 전체 테이블 목록 반환
- table_number 오름차순 정렬

### BR-TABLE-3: 세션 시작
- 해당 테이블에 활성 세션(is_active=true)이 없을 때만 새 세션 생성
- 이미 활성 세션이 있으면 기존 세션 ID 반환
- 첫 주문 시점에 OrderService에서 호출

### BR-TABLE-4: 세션 종료 (이용 완료)
1. 활성 세션 존재 확인 → 없으면 400
2. `completed_at = NOW()`, `is_active = false` 업데이트
3. 완료 시각 반환

### BR-TABLE-5: 활성 세션 조회
- `store_id + table_id + is_active=true` 조건으로 조회
- 없으면 null 반환

---

## API Endpoints

### Auth Routes

| Method | Path | Auth | 설명 |
|--------|------|------|------|
| POST | `/api/auth/admin/login` | - | 관리자 로그인 |
| POST | `/api/auth/table/login` | - | 테이블 로그인 |

### Table Routes

| Method | Path | Auth | 설명 |
|--------|------|------|------|
| POST | `/api/stores/:storeId/tables` | Admin | 테이블 생성 |
| GET | `/api/stores/:storeId/tables` | Admin | 테이블 목록 조회 |
| GET | `/api/stores/:storeId/tables/:tableId` | Admin/Table | 테이블 상세 조회 |
| POST | `/api/stores/:storeId/tables/:tableId/start-session` | Table | 세션 시작 |
| POST | `/api/stores/:storeId/tables/:tableId/end-session` | Admin | 세션 종료 |
| GET | `/api/stores/:storeId/tables/:tableId/session` | Admin/Table | 활성 세션 조회 |

### Store Routes

| Method | Path | Auth | 설명 |
|--------|------|------|------|
| GET | `/api/stores/:storeId` | Admin/Table | 매장 정보 조회 |

---

## Request/Response 스키마

### POST /api/auth/admin/login
```json
// Request
{ "storeId": "string", "username": "string", "password": "string" }

// Response 200
{ "token": "string", "expiresAt": "ISO8601" }

// Response 401
{ "error": "INVALID_CREDENTIALS", "message": "매장 ID, 사용자명 또는 비밀번호가 올바르지 않습니다" }

// Response 429
{ "error": "TOO_MANY_ATTEMPTS", "message": "로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요", "retryAfter": 900 }
```

### POST /api/auth/table/login
```json
// Request
{ "storeId": "string", "tableNumber": 1, "password": "string" }

// Response 200
{ "token": "string", "storeId": "string", "tableId": "string", "tableNumber": 1 }

// Response 401
{ "error": "INVALID_CREDENTIALS", "message": "매장 ID, 테이블 번호 또는 비밀번호가 올바르지 않습니다" }
```

### POST /api/stores/:storeId/tables
```json
// Request
{ "tableNumber": 1, "password": "string" }

// Response 201
{ "id": "string", "storeId": "string", "tableNumber": 1, "createdAt": "ISO8601" }

// Response 409
{ "error": "DUPLICATE_TABLE", "message": "이미 존재하는 테이블 번호입니다" }
```

### POST /api/stores/:storeId/tables/:tableId/end-session
```json
// Response 200
{ "completedAt": "ISO8601" }

// Response 400
{ "error": "NO_ACTIVE_SESSION", "message": "활성 세션이 없습니다" }
```
