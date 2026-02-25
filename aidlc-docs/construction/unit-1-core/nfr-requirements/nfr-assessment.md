# Unit 1: Core - NFR Requirements Assessment

> Store, Table, Auth 컴포넌트에 적용되는 비기능 요구사항

---

## 1. 보안 (Security)

### NFR-SEC-1: 비밀번호 해싱
- **요구사항**: 모든 비밀번호는 bcrypt로 해싱 저장
- **적용 대상**: admin_users.password_hash, tables.password_hash
- **bcrypt cost factor**: 10 (MVP 기준, 로컬 환경에서 적절한 속도/보안 균형)

### NFR-SEC-2: JWT 토큰
- **요구사항**: 인증에 JWT 사용
- **만료 시간**: 16시간
- **서명 알고리즘**: HS256
- **Secret**: 환경 변수로 관리 (`JWT_SECRET`)
- **Payload 최소화**: userId/tableId, storeId, role만 포함

### NFR-SEC-3: 로그인 시도 제한
- **요구사항**: 브루트포스 방지
- **정책**: 15분 내 5회 실패 → 15분 차단
- **구현**: DB 기반 (login_attempts 테이블)
- **MVP 이후 고려**: Redis 기반 rate limiting

### NFR-SEC-4: 인증 미들웨어
- **요구사항**: 보호된 엔드포인트에 JWT 검증 필수
- **역할 기반 접근**: Admin 전용 / Table 전용 / 공통 엔드포인트 구분
- **토큰 위치**: Authorization: Bearer {token}

---

## 2. 성능 (Performance)

### NFR-PERF-1: 인증 응답 시간
- **요구사항**: 로그인 API 응답 500ms 이내
- **bcrypt 해싱 시간**: cost 10 기준 ~100ms
- **JWT 발급**: ~1ms
- **DB 조회**: ~10ms (인덱스 활용)

### NFR-PERF-2: 테이블/세션 조회 성능
- **요구사항**: 테이블 목록, 활성 세션 조회 200ms 이내
- **인덱스**: idx_active_session (store_id, table_id, is_active)
- **예상 데이터량**: 매장당 테이블 수십 개 수준 → 인덱스만으로 충분

---

## 3. 에러 핸들링 (Error Handling)

### NFR-ERR-1: 일관된 에러 응답 형식
- **형식**: `{ "error": "ERROR_CODE", "message": "사용자 친화적 메시지" }`
- **HTTP 상태 코드 매핑**:
  - 400: 잘못된 요청 (유효성 검증 실패)
  - 401: 인증 실패
  - 404: 리소스 없음
  - 409: 충돌 (중복)
  - 429: 요청 제한 초과
  - 500: 서버 내부 오류

### NFR-ERR-2: 입력 유효성 검증
- **요구사항**: 모든 API 입력에 대해 서버 측 유효성 검증
- **라이브러리**: express-validator 또는 zod
- **검증 항목**: 필수 필드, 타입, 길이, 형식

---

## 4. 로깅 (Logging)

### NFR-LOG-1: 요청 로깅
- **요구사항**: 모든 API 요청에 대해 기본 로깅
- **로그 항목**: timestamp, method, path, status code, response time
- **민감 정보 제외**: password 필드는 로그에서 마스킹

---

## 5. 설정 관리 (Configuration)

### NFR-CFG-1: 환경 변수
- **요구사항**: 설정값은 환경 변수로 관리
- **필수 환경 변수**:
  - `PORT`: 서버 포트
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: MySQL 접속 정보
  - `JWT_SECRET`: JWT 서명 키
  - `BCRYPT_ROUNDS`: bcrypt cost factor (기본값: 10)
- **dotenv**: 로컬 개발 시 `.env` 파일 지원

---

## NFR 우선순위 요약

| NFR | 우선순위 | Unit 1 적용 |
|-----|---------|------------|
| 비밀번호 해싱 (bcrypt) | Must | ✅ |
| JWT 인증 | Must | ✅ |
| 로그인 시도 제한 | Must | ✅ |
| 인증 미들웨어 | Must | ✅ |
| 에러 응답 형식 | Must | ✅ |
| 입력 유효성 검증 | Must | ✅ |
| 환경 변수 관리 | Must | ✅ |
| 요청 로깅 | Should | ✅ |
| 응답 시간 목표 | Should | ✅ (인덱스 설계로 충족) |
