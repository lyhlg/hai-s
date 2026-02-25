# 요구사항 검증 질문

아래 질문에 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.

## Question 1
백엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js (Express/Fastify)
B) Kotlin (Spring Boot)
C) Python (FastAPI/Django)
D) Go
E) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 2
프론트엔드 기술 스택으로 어떤 것을 사용하시겠습니까? 

A) React (Next.js)
B) React (Vite/CRA)
C) Vue.js (Nuxt)
D) Svelte (SvelteKit)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL
C) MongoDB
D) DynamoDB
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
배포 환경은 어디를 대상으로 하시겠습니까?

A) AWS (ECS/EKS)
B) AWS Lambda (Serverless)
C) 자체 서버 (Docker Compose)
D) 로컬 개발 환경만 (MVP 단계)
E) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 5
매장(Store)은 단일 매장만 지원하면 되나요, 아니면 멀티 매장(SaaS)을 지원해야 하나요?

A) 단일 매장 (하나의 매장만 운영)
B) 멀티 매장 (여러 매장을 하나의 시스템에서 관리)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 6
메뉴 이미지는 어떻게 관리하시겠습니까? (constraints에서 이미지 리사이징/최적화는 제외되었습니다)

A) 외부 URL 직접 입력 (이미지 호스팅은 별도 관리)
B) S3 등 클라우드 스토리지에 업로드 (단순 업로드만, 최적화 없음)
C) 이미지 없이 텍스트만으로 MVP 진행
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 7
관리자 계정은 어떻게 생성되나요?

A) 시스템 초기 설정 시 seed 데이터로 생성 (회원가입 없음)
B) 관리자 회원가입 기능 포함
C) CLI 또는 API로 수동 생성
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8
고객용 인터페이스와 관리자용 인터페이스를 어떻게 구성하시겠습니까?

A) 하나의 프론트엔드 앱에서 라우팅으로 분리
B) 별도의 프론트엔드 앱 2개 (고객용 + 관리자용)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 9
주문 상태 실시간 업데이트(고객 화면)는 MVP에 포함하시겠습니까? (요구사항에 "선택사항"으로 표기됨)

A) MVP에 포함 (SSE 사용)
B) MVP에서 제외 (수동 새로고침으로 대체)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10
모노레포(monorepo) 구조를 사용하시겠습니까?

A) 모노레포 (백엔드 + 프론트엔드를 하나의 저장소에서 관리)
B) 별도 저장소 (백엔드와 프론트엔드 분리)
C) Other (please describe after [Answer]: tag below)

[Answer]: A
