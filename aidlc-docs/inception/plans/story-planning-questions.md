# Story Planning Questions

아래 질문에 답변해주세요. 각 질문의 [Answer]: 뒤에 선택지 알파벳을 입력해주세요.

---

## Question 1
User Story 분류 방식을 어떻게 할까요?

A) User Journey 기반 - 사용자 흐름 순서대로 (로그인→메뉴조회→장바구니→주문→내역확인)
B) Feature 기반 - 시스템 기능 단위로 (인증, 메뉴, 장바구니, 주문, 모니터링 등)
C) Persona 기반 - 사용자 유형별로 (고객 스토리 묶음, 관리자 스토리 묶음)
D) Other (please describe after [Answer]: tag below)

[Answer]: D 더 고도화된 방식 + 구현단계에서 충돌최소화 할 수 있는 방법을 추천해줘

---

## Question 2
User Story의 상세 수준을 어떻게 할까요?

A) 간결 - Story + Acceptance Criteria 최소한으로 (빠른 개발 착수 목적)
B) 표준 - Story + Acceptance Criteria + 시나리오 (Given/When/Then)
C) 상세 - Story + Acceptance Criteria + 시나리오 + 엣지 케이스 + UI 힌트
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3
Persona 정의 수준을 어떻게 할까요?

A) 최소 - 이름, 역할, 핵심 목표만 정의
B) 표준 - 이름, 역할, 목표, 동기, 불편사항(Pain Points) 포함
C) 상세 - 표준 + 기술 숙련도, 사용 시나리오, 인구통계 정보 포함
D) Other (please describe after [Answer]: tag below)

[Answer]: B (동기 빼고 나머지 반영)

---

## Question 4
고객 페르소나를 세분화할 필요가 있나요?

A) 단일 페르소나 - "테이블 고객" 하나로 충분
B) 2개 페르소나 - 기술 친숙 고객 / 기술 미숙 고객 (연령대 등)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 5
관리자 페르소나를 세분화할 필요가 있나요?

A) 단일 페르소나 - "매장 관리자" 하나로 충분
B) 2개 페르소나 - 매장 사장님 / 매장 직원 (권한 차이)
C) Other (please describe after [Answer]: tag below)

[Answer]: A (B의 확장성을 고려한 설계) 

---

## Question 6
Story 우선순위 표기를 포함할까요?

A) 포함 - 각 Story에 Must/Should/Could (MoSCoW) 우선순위 표기
B) 미포함 - MVP 범위가 이미 정의되어 있으므로 별도 우선순위 불필요
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

# Clarification Questions

Q1, Q3, Q5 답변에 대해 추가 확인이 필요합니다.

---

## Clarification 1 (Q1 관련)
"더 고도화된 방식 + 구현 충돌 최소화"를 고려하여 아래 방식을 제안합니다. 어떤 것이 적합할까요?

A) Persona + Journey 하이브리드 - 페르소나별로 그룹핑하되, 각 그룹 내에서 사용자 흐름 순서로 정렬. 구현 시 페르소나 단위로 독립 개발 가능하여 충돌 최소화
B) Domain Slice 기반 - 비즈니스 도메인(인증, 메뉴, 주문, 테이블관리)별로 분류하되, 각 slice가 프론트+백엔드를 수직으로 포함. 도메인 간 의존성 최소화로 병렬 개발 가능
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Clarification 2 (Q3 관련)
"동기 빼고 나머지 반영"을 확인합니다. 아래 항목 중 포함할 것을 확인해주세요.

A) 이름, 역할, 목표, 불편사항(Pain Points) - 동기만 제외
B) 이름, 역할, 목표, 불편사항(Pain Points) + 기술 숙련도 - 동기 제외하되 기술 숙련도 추가 (Q4에서 기술 친숙/미숙 구분이 있으므로)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Clarification 3 (Q5 관련)
"단일 페르소나 + B의 확장성을 고려한 설계"를 확인합니다. 구체적으로 어떤 수준의 확장성을 의미하나요?

A) Story 작성은 단일 "매장 관리자"로 하되, Acceptance Criteria에 "향후 권한 분리 시 영향받는 기능" 주석 표기
B) Story 작성은 단일 "매장 관리자"로 하되, 별도 "확장 고려사항" 섹션에 사장님/직원 분리 시나리오 간략 기술
C) Other (please describe after [Answer]: tag below)

[Answer]: B
