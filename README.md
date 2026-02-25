# HAI-S Design System

shadcn 기반 디자인 시스템 monorepo. Primary color만 입력하면 Radix UI 스타일의 12단계 색상 scale이 자동 생성됩니다.

## 프로젝트 구조

```
hai-s-ds/
├── packages/
│   ├── design-system/    # shadcn 기반 디자인 시스템
│   └── shared/           # 공유 유틸리티
├── apps/
│   ├── backend/          # Backend API
│   └── frontend/         # Frontend 데모 앱
```

## 시작하기

### 설치

```bash
pnpm install
```

### 빌드

```bash
# 모든 패키지 빌드
pnpm build

# design-system만 빌드
pnpm --filter @hai-s/design-system build
```

### 개발

```bash
# Frontend 데모 앱 실행
pnpm --filter @hai-s/frontend dev

# Backend 실행
pnpm --filter @hai-s/backend dev
```

## Design System 사용법

### 1. Primary Color 설정

앱 루트에 `design-system.config.ts` 파일을 생성합니다:

```typescript
// apps/your-app/design-system.config.ts
export default {
  primaryColor: '#3b82f6' // 원하는 primary color
};
```

### 2. Tailwind 설정

```javascript
import designSystemPreset from '@hai-s/design-system/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [designSystemPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/design-system/dist/**/*.js',
  ],
};
```

### 3. CSS 토큰 Import

```css
/* 상대 경로로 tokens.css import */
@import url('../../packages/design-system/dist/tokens.css');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

**참고**: monorepo 환경에서는 상대 경로를 사용합니다. 외부 프로젝트에서 사용 시에는 `@hai-s/design-system/tokens.css`로 import할 수 있습니다.

### 4. 컴포넌트 사용

```tsx
import { Button, Card, Input, Mail, Search } from '@hai-s/design-system';

function App() {
  return (
    <Card>
      <Input placeholder="Enter text..." />
      <Button>
        <Search className="w-4 h-4 mr-2" />
        Submit
      </Button>
    </Card>
  );
}
```

### 5. 아이콘 사용

```tsx
import { Search, Plus, Trash2, Heart } from '@hai-s/design-system';

// 기본 사용
<Search className="w-6 h-6" />

// 버튼과 함께
<Button>
  <Plus className="w-4 h-4 mr-2" />
  추가
</Button>

// 색상 적용
<Heart className="w-8 h-8 text-red-500" />
```

1000+ 아이콘 사용 가능: [lucide.dev](https://lucide.dev/icons/)

## 색상 시스템

Primary color 기반으로 12단계 scale이 자동 생성됩니다:

- **CSS Variables**: `--primary-1` ~ `--primary-12`
- **Tailwind 클래스**: `bg-primary-1` ~ `bg-primary-12`, `text-primary-1` ~ `text-primary-12`
- **기본값**: `primary-9`가 기본 primary color

### 색상 사용 가이드

- `primary-1` ~ `primary-4`: 배경색 (밝음)
- `primary-5` ~ `primary-8`: 호버, 비활성 상태
- `primary-9`: 기본 primary color (버튼, 링크 등)
- `primary-10` ~ `primary-11`: 호버 상태, 강조
- `primary-12`: 텍스트 (어두움)

## 컴포넌트

- **Button**: 다양한 variant (default, outline, ghost, link, secondary, destructive)
- **Card**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Input**: 텍스트 입력 필드
- **Label**: 폼 레이블
- **Textarea**: 여러 줄 텍스트 입력
- **Badge**: 상태 표시 배지
- **Separator**: 구분선
- **Spinner**: 로딩 스피너
- **Skeleton**: 로딩 스켈레톤
- **Tooltip**: 툴팁 (Radix UI 기반)
- **Dialog**: 모달 다이얼로그 (Radix UI 기반)
- **Sonner**: Toast 알림 (Sonner 라이브러리)

## 토큰 시스템

- **Colors**: 12단계 primary color scale (light/dark 모드)
- **Typography**: Font family, size, weight, line-height
- **Spacing**: 4px 기반 spacing scale
- **Shadows**: Box shadow 정의
- **Radius**: Border radius 값

## 데모

### Frontend 데모 앱

Frontend 데모 앱을 실행하여 디자인 시스템을 확인할 수 있습니다:

```bash
pnpm --filter @hai-s/frontend dev
```

브라우저에서 `http://localhost:5173`을 열어 다양한 컴포넌트와 색상 scale을 확인하세요.

### Storybook

Storybook을 실행하여 컴포넌트를 개별적으로 확인하고 테스트할 수 있습니다:

```bash
pnpm --filter @hai-s/design-system storybook
```

브라우저에서 `http://localhost:6006`을 열어 다음을 확인하세요:
- Button, Card, Input 컴포넌트의 다양한 variant
- 12단계 색상 scale 시각화
- 인터랙티브 컴포넌트 테스트

## Primary Color 변경 테스트

1. `apps/frontend/design-system.config.ts`에서 `primaryColor` 값 변경
2. Design system 재빌드: `pnpm --filter @hai-s/design-system build`
3. Frontend 재시작: `pnpm --filter @hai-s/frontend dev`
4. 브라우저에서 색상 변경 확인

## 라이선스

워크샵 교육용 프로젝트입니다.