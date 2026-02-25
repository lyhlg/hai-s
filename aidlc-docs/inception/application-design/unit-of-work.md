# Unit of Work

> 모노레포 단일 서비스 구조, Domain Slice 기반 모듈 분리

---

## 아키텍처 결정
- **배포 단위**: 단일 서비스 (Go 백엔드 1개 + React 프론트엔드 2개)
- **모듈 분리**: Domain Slice 기반 논리적 모듈
- **개발 순서**: 의존성 순서대로 (하위 → 상위)

---

## Unit 1: Core (기반 모듈)
- **범위**: 매장, 테이블, 인증 — 다른 모든 모듈의 기반
- **백엔드 모듈**: Store, Table, Auth
- **프론트엔드**: 고객용 초기 설정/자동 로그인, 관리자용 로그인/테이블 설정
- **관련 스토리**: US-1, US-2, US-9 (구 US-10), US-10 (구 US-9 → 테이블 초기 설정)

## Unit 2: Menu (메뉴 모듈)
- **범위**: 메뉴 CRUD, 카테고리, 인기/품절 관리
- **백엔드 모듈**: Menu
- **프론트엔드**: 고객용 메뉴 조회, 관리자용 메뉴 관리
- **관련 스토리**: US-3, US-4

## Unit 3: Order (주문 모듈)
- **범위**: 장바구니, 주문 생성/조회/삭제, 상태 변경, SSE 실시간 통신
- **백엔드 모듈**: Order, SSE
- **프론트엔드**: 고객용 장바구니/주문/내역, 관리자용 모니터링/주문삭제
- **관련 스토리**: US-5, US-6, US-7, US-8, US-11

## Unit 4: Session & Settlement (세션/정산 모듈)
- **범위**: 테이블 세션 종료, 과거 내역, 일매출 정산
- **백엔드 모듈**: Table (세션 종료), Settlement
- **프론트엔드**: 관리자용 이용 완료, 과거 내역, 정산
- **관련 스토리**: US-9, US-12, US-13

---

## 코드 구조 (Turborepo 모노레포)

```
hai-s/
├── turbo.json              # Turborepo 설정
├── pnpm-workspace.yaml     # pnpm workspace 설정
├── package.json            # 루트 (scripts, devDependencies)
├── packages/
│   └── shared/             # 공유 타입/유틸리티
│       ├── src/
│       │   ├── types/      # 공통 타입 정의
│       │   └── utils/      # 공통 유틸리티
│       └── package.json
├── apps/
│   ├── backend/            # Node.js (Express) 백엔드
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   ├── middleware/
│   │   │   ├── config/
│   │   │   └── index.ts
│   │   ├── migrations/     # DB 마이그레이션
│   │   └── package.json
│   ├── customer/           # 고객용 React 앱 (Vite)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── contexts/
│   │   │   └── api/
│   │   └── package.json
│   └── admin/              # 관리자용 React 앱 (Vite)
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── hooks/
│       │   ├── contexts/
│       │   └── api/
│       └── package.json
└── README.md
```

## 개발 순서

```
Unit 1 (Core) → Unit 2 (Menu) → Unit 3 (Order) → Unit 4 (Session & Settlement)
```

Unit 1이 인증/매장/테이블 기반을 제공하고, Unit 2가 메뉴 데이터를 제공해야 Unit 3에서 주문이 가능하며, Unit 4는 주문 데이터에 의존합니다.
