# Story Generation Plan

## 방법론
- **분류**: Domain Slice 기반 (인증, 메뉴, 주문, 테이블관리)
- **상세 수준**: Story + Acceptance Criteria + Given/When/Then + 엣지 케이스 + UI 힌트
- **우선순위**: MoSCoW (Must/Should/Could)

## 실행 체크리스트

### Personas
- [x] 고객 페르소나 2개 생성 (기술 친숙 / 기술 미숙)
- [x] 관리자 페르소나 1개 생성 + 확장 고려사항 섹션

### Domain: 인증 (Authentication)
- [x] US-1: 고객 - 테이블 태블릿 자동 로그인 (FR-1)
- [x] US-2: 관리자 - 매장 로그인 (FR-6)

### Domain: 메뉴 (Menu)
- [x] US-3: 고객 - 메뉴 조회 및 탐색 (FR-2)
- [x] US-4: 관리자 - 메뉴 CRUD (FR-9)

### Domain: 주문 (Order)
- [x] US-5: 고객 - 장바구니 관리 (FR-3)
- [x] US-6: 고객 - 주문 생성 (FR-4)
- [x] US-7: 고객 - 주문 내역 조회 (FR-5)
- [x] US-8: 관리자 - 실시간 주문 모니터링 (FR-7)

### Domain: 테이블 관리 (Table Management)
- [x] US-9: 관리자 - 테이블 초기 설정 (FR-8)
- [x] US-10: 관리자 - 주문 삭제 (FR-8)
- [x] US-11: 관리자 - 테이블 세션 종료 (FR-8)
- [x] US-12: 관리자 - 과거 주문 내역 조회 (FR-8)

### 완료
- [x] stories.md 최종 검증
- [x] personas.md 최종 검증
