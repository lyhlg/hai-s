# Unit 1: Core - Functional Design Summary

## 범위
- **Unit**: Unit 1 - Core (기반 모듈)
- **컴포넌트**: Store, Table, Auth
- **관련 스토리**: US-1 (테이블 자동 로그인), US-2 (관리자 로그인), US-10 (테이블 초기 설정)

## 산출물
- [data-models.md](./data-models.md) - 데이터 모델 (5개 테이블: stores, admin_users, tables, table_sessions, login_attempts)
- [business-rules.md](./business-rules.md) - 비즈니스 규칙 및 API 설계

## 핵심 설계 결정

1. **인증 방식**: JWT (16시간 만료), 관리자/테이블 별도 로그인 엔드포인트
2. **비밀번호**: bcrypt 해싱
3. **로그인 제한**: 15분 내 5회 실패 시 15분 차단
4. **세션 관리**: 첫 주문 시 자동 시작, 관리자가 수동 종료
5. **매장 초기화**: Seed 스크립트 (회원가입 없음)
6. **ID 전략**: UUID (VARCHAR(36))
