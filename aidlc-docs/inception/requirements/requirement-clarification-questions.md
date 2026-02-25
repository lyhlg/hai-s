# 요구사항 명확화 질문

응답 분석 중 1건의 모순이 감지되었습니다. 아래 질문에 답변해 주세요.

## Contradiction 1: 배포 환경 vs 이미지 스토리지

Q4에서 "로컬 개발 환경만 (MVP 단계)"를 선택하셨고, Q6에서 "S3 클라우드 스토리지 업로드"를 선택하셨습니다.
로컬 환경에서 S3를 사용하려면 AWS 계정 및 설정이 필요합니다.

### Clarification Question 1
로컬 개발 환경에서 이미지 저장을 어떻게 처리하시겠습니까?

A) LocalStack 등으로 S3를 로컬에서 에뮬레이션
B) 로컬 파일 시스템에 저장 (추후 S3로 전환 가능하도록 추상화)
C) 실제 AWS S3 사용 (AWS 계정 보유, 로컬에서 AWS 접근 가능)
D) Other (please describe after [Answer]: tag below)

[Answer]: B
