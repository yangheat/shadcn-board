# shadcn-board

Next.js + Supabase로 만든 TODO 태스크 보드입니다. shadcn/ui를 사용했고, 프로젝트 구조는 Feature-Sliced Design (FSD)을 적용했습니다.

> 이 저장소는 Next.js Basic 강의(플레이리스트)를 실습하며 학습한 내용을 정리한 공간입니다.  
> https://www.youtube.com/playlist?list=PL-cIzvS-5d-2yF2fmNv5S7PCv9zBFiHDe

## 참고

- 강의 실습을 진행한 뒤, 추후에 AI 에이전트 Codex를 통해 FSD 아키텍처로 리팩터링했습니다.

## 기술 스택

- Next.js (App Router)
- React
- Supabase
- Jotai
- shadcn/ui + Radix UI
- SCSS

## 시작하기

1) 의존성 설치

```
npm install
```

2) 환경 변수 설정

`.env.local` 파일을 만들고 아래 값을 추가합니다.

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key
```

3) 개발 서버 실행

```
npm run dev
```

## 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행

## 프로젝트 구조 (FSD)

```
src/
  app/            # Next.js 라우트/레이아웃
  shared/         # 공용 UI, lib, styles, api
  entities/       # 도메인 모델 및 상태
  features/       # 기능 로직 및 UI
  widgets/        # 조합된 UI 블록
```

### FSD 매핑 (현재)

- `shared/ui` - shadcn/ui 컴포넌트
- `shared/lib` - 유틸리티 (예: `cn`)
- `shared/api` - Supabase 클라이언트
- `entities/task` - task 모델, atoms, 조회 API
- `entities/board` - board 모델
- `entities/todo` - todo 컨텍스트
- `features/task` - task 생성/삭제 플로우
- `features/board` - board 생성/삭제/편집 플로우
- `widgets` - 네비게이션, 보드 카드 합성
