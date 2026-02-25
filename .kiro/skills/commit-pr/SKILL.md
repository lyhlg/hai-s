---
name: commit-pr
description: 커밋 생성부터 PR 생성까지 한번에 수행합니다. 내부적으로 /commit + PR 생성 워크플로우를 실행합니다.
version: 1.0.0
tags: [git, commit, pr, workflow]
user-invocable: true
---

# 커밋 & PR 통합 스킬

변경사항을 분석하여 커밋을 생성하고, PR까지 한번에 생성합니다.

## 동작 순서

### Phase 1: 커밋 생성

> **`/commit` 스킬의 전체 워크플로우를 실행합니다.**

커밋 규칙, 워크플로우, 체크리스트는 `/commit` 스킬을 참조하세요.

---

### Phase 2: PR 생성

#### 1단계: 리뷰 포커스 제안 (AskUserQuestion)

전체 변경사항을 분석하여 "리뷰 포커스" 섹션 초안을 제안합니다.

**제안 형식:**
```
- GitHub PR 템플릿 신규 생성
- PR 스킬에서 템플릿 파일 참조 방식으로 변경
```

**선택지:**
- "제안대로 진행"
- "직접 입력" → 사용자가 입력한 내용을 **그대로** 사용

#### 2단계: Push 및 PR 생성

- remote 브랜치 없으면 먼저 push
- `gh pr create` 명령어로 PR 생성
- PR body는 `.github/pull_request_template.md` 템플릿 기반
- 템플릿 섹션 채우기:
  - `## 이 부분을 중심으로 봐주세요`: 사용자가 확인한 리뷰 포커스 내용
- body 마지막에 `Generated with [Claude Code](https://claude.com/claude-code)` 추가

#### 3단계: 결과 반환

- PR URL 반환

---

## 중요 사항

1. **사용자 승인 후 실행** - 커밋/PR 생성 전 반드시 사용자 승인 받기
2. **리뷰 포커스 그대로 사용** - "직접 입력" 선택 시 사용자 입력을 그대로 사용
3. **Summary ≠ 리뷰 포커스** - 두 섹션을 혼동하지 않기
4. **remote 브랜치 확인** - 없으면 먼저 push
