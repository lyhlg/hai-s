# T4: Admin App Phase 1 — 셋업 + 로그인 + 테이블관리

> 담당: 개발자 D | 브랜치: `feature/t4-admin-setup-login-table`
> 관련 스토리: US-2 (관리자 로그인), US-10 (테이블 초기 설정)
> 완료 조건: mock API로 로그인 + 테이블 CRUD 동작

---

## 체크리스트

### Step 1: 프로젝트 구조 + 공통 UI
- [ ] 디렉토리 구조 생성 (`components/`, `pages/`, `hooks/`, `contexts/`, `api/`)
- [ ] 공통 CSS 변수 / 글로벌 스타일
- [ ] Layout 컴포넌트 (Header + Sidebar + Content)
- [ ] 공통 컴포넌트: Button, Input, Modal, LoadingSpinner

### Step 2: API Client + Mock
- [ ] axios 인스턴스 (baseURL, JWT 인터셉터)
- [ ] mock 핸들러 (로그인, 테이블 CRUD)
- [ ] 환경변수로 mock/real 전환 (`VITE_USE_MOCK`)

### Step 3: Auth (US-2)
- [ ] AuthContext (JWT 저장/복원, 로그인/로그아웃, 16h 만료 체크)
- [ ] ProtectedRoute 컴포넌트
- [ ] 로그인 페이지 (매장ID + 사용자명 + 비밀번호)
  - [ ] 필드 검증
  - [ ] 로그인 실패 시 에러 메시지 + 남은 시도 횟수
  - [ ] 성공 시 대시보드 리다이렉트

### Step 4: 테이블 관리 (US-10)
- [ ] 테이블 목록 페이지 (조회)
- [ ] 테이블 생성 폼 (번호 + 비밀번호)
  - [ ] 중복 번호 검증
  - [ ] 필수 필드 검증
- [ ] 성공/실패 피드백

### Step 5: 라우팅 통합
- [ ] `/login` → 로그인 페이지
- [ ] `/` → 대시보드 (placeholder, Phase 2에서 구현)
- [ ] `/tables` → 테이블 관리
- [ ] 미인증 시 `/login` 리다이렉트

### Step 6: 검증
- [ ] mock API로 로그인 플로우 동작 확인
- [ ] mock API로 테이블 CRUD 동작 확인
- [ ] 브라우저 새로고침 시 세션 유지 확인
- [ ] `pnpm build` 성공 확인

---

## 기술 스택 (Phase 0에서 확정)
- React 18 + TypeScript + Vite
- React Router v6
- axios
- `@hai-s/shared` 타입 참조

## 파일 소유권
- `apps/admin/src/**` 전체 — 개발자 D 전담
- 다른 디렉토리 수정 없음 (충돌 0건 보장)
