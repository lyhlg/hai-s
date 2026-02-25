# Unit 1: Core - NFR Design

> NFR Requirements를 구현하기 위한 구체적 패턴 및 구조 설계

---

## 1. 인증 미들웨어 패턴

### 구조

```
src/middleware/
├── auth.ts          # JWT 검증 + role 체크
└── validate.ts      # 입력 유효성 검증
```

### auth.ts 설계

```typescript
// 미들웨어 체인:
// 1. authenticate - JWT 검증, req.user에 claims 주입
// 2. authorize("admin") - role 체크
// 3. authorize("table") - role 체크
// 4. authorize("admin", "table") - 복수 role 허용

type UserClaims = {
  userId?: string;
  tableId?: string;
  storeId: string;
  tableNumber?: number;
  role: "admin" | "table";
};

// authenticate: Bearer 토큰 추출 → jwt.verify → req.user = claims
// authorize(...roles): req.user.role이 허용 목록에 있는지 확인
```

### 라우터 적용 예시

```typescript
// Admin 전용
router.post("/stores/:storeId/tables", authenticate, authorize("admin"), createTable);

// Table 전용
router.post("/stores/:storeId/tables/:tableId/start-session", authenticate, authorize("table"), startSession);

// 공통
router.get("/stores/:storeId/tables/:tableId", authenticate, authorize("admin", "table"), getTable);
```

---

## 2. 비밀번호 해싱 패턴

### 유틸리티 모듈

```
src/utils/
└── password.ts      # hashPassword, comparePassword
```

```typescript
// hashPassword(plain: string): Promise<string>
//   → bcrypt.hash(plain, BCRYPT_ROUNDS)

// comparePassword(plain: string, hash: string): Promise<boolean>
//   → bcrypt.compare(plain, hash)
```

- `BCRYPT_ROUNDS`는 환경 변수에서 로드 (기본값: 10)

---

## 3. 로그인 시도 제한 패턴

### Repository 레벨 구현

```typescript
// LoginAttemptRepository
// - countRecentFailures(identifier: string, windowMinutes: number): Promise<number>
//   → SELECT COUNT(*) FROM login_attempts
//     WHERE identifier = ? AND success = false AND attempted_at > NOW() - INTERVAL ? MINUTE
//
// - record(identifier: string, success: boolean): Promise<void>
//   → INSERT INTO login_attempts (id, identifier, success)
```

### Service 레벨 로직

```typescript
// AuthService.checkLoginAllowed(identifier: string):
//   failures = await loginAttemptRepo.countRecentFailures(identifier, 15)
//   if (failures >= 5) throw TooManyAttemptsError(retryAfter: 900)
```

---

## 4. 에러 핸들링 패턴

### 커스텀 에러 클래스

```
src/errors/
└── index.ts         # AppError + 서브클래스
```

```typescript
// AppError (base)
//   - statusCode: number
//   - errorCode: string
//   - message: string

// 서브클래스:
// - BadRequestError(message)        → 400
// - UnauthorizedError(message)      → 401
// - NotFoundError(message)          → 404
// - ConflictError(message)          → 409
// - TooManyAttemptsError(retryAfter) → 429
```

### 글로벌 에러 핸들러 미들웨어

```typescript
// src/middleware/error-handler.ts
// - AppError 인스턴스: { error: err.errorCode, message: err.message } + statusCode
// - 기타 에러: { error: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다" } + 500
// - 프로덕션에서는 stack trace 미노출
```

---

## 5. 입력 유효성 검증 패턴

### zod 스키마 기반

```
src/schemas/
├── auth.ts          # 로그인 요청 스키마
└── table.ts         # 테이블 생성 스키마
```

```typescript
// 예시: adminLoginSchema
// z.object({
//   storeId: z.string().uuid(),
//   username: z.string().min(1).max(50),
//   password: z.string().min(1),
// })

// validate 미들웨어: schema.parse(req.body) → 실패 시 BadRequestError
```

---

## 6. 설정 관리 패턴

```
src/config/
└── index.ts         # 환경 변수 로드 + 검증
```

```typescript
// dotenv.config() 호출
// 필수 환경 변수 존재 확인 → 없으면 서버 시작 실패
// export const config = {
//   port: number,
//   db: { host, port, user, password, name },
//   jwt: { secret, expiresIn },
//   bcrypt: { rounds },
// }
```

---

## 7. 요청 로깅 패턴

```typescript
// src/middleware/logger.ts
// morgan 또는 커스텀 미들웨어
// 형식: [timestamp] METHOD /path STATUS responseTime ms
// 민감 필드 (password) 마스킹: req.body 로깅 시 password → "***"
```

---

## 파일 구조 요약 (Unit 1 기준)

```
src/
├── config/
│   └── index.ts              # 환경 변수 설정
├── middleware/
│   ├── auth.ts               # JWT 인증 + 역할 인가
│   ├── validate.ts           # zod 스키마 검증
│   ├── error-handler.ts      # 글로벌 에러 핸들러
│   └── logger.ts             # 요청 로깅
├── errors/
│   └── index.ts              # AppError + 서브클래스
├── schemas/
│   ├── auth.ts               # 인증 요청 스키마
│   └── table.ts              # 테이블 요청 스키마
├── utils/
│   └── password.ts           # bcrypt 래퍼
├── routes/
│   ├── auth.ts               # 인증 라우터
│   └── table.ts              # 테이블 라우터
├── services/
│   ├── auth.ts               # AuthService
│   └── table.ts              # TableService
├── repositories/
│   ├── store.ts              # StoreRepository
│   ├── admin-user.ts         # AdminUserRepository
│   ├── table.ts              # TableRepository
│   ├── session.ts            # SessionRepository
│   └── login-attempt.ts      # LoginAttemptRepository
├── models/
│   └── types.ts              # TypeScript 타입 정의
└── index.ts                  # Express 앱 엔트리포인트
```
