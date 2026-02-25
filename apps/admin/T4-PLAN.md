# T4: Admin App Phase 1 — 셋업 + 로그인 + 테이블관리

> 담당: 개발자 D | 브랜치: `feature/t4-admin-setup-login-table`
> 관련 스토리: US-2 (관리자 로그인), US-10 (테이블 초기 설정)
> 완료 조건: mock API로 로그인 + 테이블 CRUD 동작

---

## 체크리스트

### Step 1: 프로젝트 구조
- [x] 디렉토리 구조 생성 (`components/`, `pages/`, `hooks/`, `contexts/`, `api/`, `mocks/`)
- [x] shadcn/ui + Tailwind CSS v4 설정
- [x] Layout 컴포넌트 (Sidebar 네비게이션 + 로그아웃)
- [x] 공통 컴포넌트: shadcn/ui (Button, Input, Label, Card, Table, Dialog, Alert, Badge, Separator, Sonner, Spinner)

### Step 2: API Client + Mock
- [x] axios 인스턴스 (baseURL, JWT 인터셉터)
- [x] mock 핸들러 (msw: 로그인, 테이블 CRUD)
- [x] DEV 환경에서 자동 mock 활성화 (`main.tsx`에서 msw worker start)

### Step 3: Auth (US-2)
- [x] AuthContext (JWT 저장/복원, 로그인/로그아웃, 16h 만료 체크 타이머)
- [x] ProtectedRoute 컴포넌트
- [x] 로그인 페이지 (매장ID + 사용자명 + 비밀번호) — 최소 UI, shadcn 교체 예정
  - [x] 필드 검증
  - [x] 로그인 실패 시 에러 메시지
  - [x] 성공 시 대시보드 리다이렉트

### Step 4: 테이블 관리 (US-10)
- [x] 테이블 목록 페이지 (조회) — 최소 UI, shadcn 교체 예정
- [x] 테이블 생성 폼 (번호 + 비밀번호) — 최소 UI, shadcn 교체 예정
  - [x] 중복 번호 검증 (서버 사이드)
  - [x] 필수 필드 검증
- [x] 성공/실패 피드백

### Step 5: 라우팅 통합
- [x] `/login` → 로그인 페이지
- [x] `/` → 대시보드 (placeholder, Phase 2에서 구현)
- [x] `/tables` → 테이블 관리
- [x] 미인증 시 `/login` 리다이렉트

### Step 6: 커스텀 Hooks
- [x] useAuth (AuthContext 래퍼)
- [x] useTables (테이블 CRUD + 상태 관리)

### Step 7: 검증
- [x] `pnpm build` 성공 확인
- [ ] mock API로 로그인 플로우 동작 확인 (브라우저)
- [ ] mock API로 테이블 CRUD 동작 확인 (브라우저)
- [ ] 브라우저 새로고침 시 세션 유지 확인

### Step 8: UI (shadcn/ui)
- [x] shadcn/ui 설치 + Tailwind CSS v4 설정
- [x] 로그인 페이지 UI (Card, Input, Alert)
- [x] 테이블 관리 페이지 UI (Table, Dialog, Badge, toast)
- [x] AppLayout (Sidebar + 로그아웃)

---

## 기술 스택
- React 18 + TypeScript + Vite
- React Router v6
- axios + msw (mock)
- `@hai-s/shared` 타입 참조
- shadcn/ui (대기 중)

## 파일 소유권
- `apps/admin/src/**` 전체 — 개발자 D 전담
- 다른 디렉토리 수정 없음 (충돌 0건 보장)

## 파일 구조 (현재)
```
apps/admin/src/
├── api/
│   ├── client.ts          # axios 인스턴스 + JWT 인터셉터
│   ├── auth.ts            # 로그인 API
│   ├── tables.ts          # 테이블 CRUD API
│   └── index.ts           # barrel export
├── components/
│   └── ProtectedRoute.tsx # 인증 가드
├── contexts/
│   └── AuthContext.tsx     # JWT 상태 관리
├── hooks/
│   ├── useAuth.ts         # AuthContext 래퍼
│   └── useTables.ts       # 테이블 CRUD + 상태
├── mocks/
│   ├── handlers.ts        # msw mock 핸들러
│   └── browser.ts         # msw worker 설정
├── pages/
│   ├── login/LoginPage.tsx
│   ├── dashboard/DashboardPage.tsx
│   └── tables/TablesPage.tsx
├── App.tsx                # 라우팅
├── main.tsx               # 엔트리 (msw 부트스트랩)
└── vite-env.d.ts
```
