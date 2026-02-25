# HAI-S 테이블오더

매장 테이블오더 MVP 서비스 (고객 주문 + 관리자 모니터링)

## 프로젝트 구조

```
hai-s/
├── packages/
│   └── shared/           # 공유 타입 정의
├── apps/
│   ├── backend/          # Express API 서버
│   ├── customer/         # 고객용 React 앱 (Vite)
│   └── admin/            # 관리자용 React 앱 (Vite)
```

## 시작하기

```bash
pnpm install
pnpm build
```

## 개발

```bash
# 백엔드
pnpm --filter @hai-s/backend dev

# 고객 앱 (port 3001)
pnpm --filter @hai-s/customer dev

# 관리자 앱 (port 3002)
pnpm --filter @hai-s/admin dev
```

## 테스트

```bash
pnpm --filter @hai-s/backend test
```

## 기술 스택

- Backend: Express, MySQL, JWT, SSE, zod
- Frontend: React 18, React Router, Vite
- Monorepo: Turborepo, pnpm workspace
- Test: Vitest, Supertest
