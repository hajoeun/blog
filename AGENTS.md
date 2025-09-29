# AGENTS.md

이 문서는 이 리포지토리에서 코드 작업을 수행하는 도구/에이전트를 위한 가이드입니다.

## 프로젝트 개요
- **스택**: Next.js 15(App Router), MDX, TypeScript
- **콘텐츠 소스**: MDX 게시글 + Vercel Postgres에 저장된 YouTube 게시글
- **언어**: 한국어 중심

## 명령어
```bash
pnpm dev        # 개발 서버 실행
pnpm build      # 프로덕션 빌드
pnpm start      # 프로덕션 서버 실행
```

## 아키텍처

### 핵심 기술
- **Next.js 15** (App Router)
- **MDX** (Frontmatter 지원)
- **Tailwind CSS**
- **TypeScript** (non-strict)
- **Vercel Postgres** (YouTube 게시글 저장)

### 프로젝트 구조
- `/app` - App Router 페이지 및 라우트
  - `[year]/[id]` - 블로그 게시글 동적 라우트
  - `atom/route.ts` - RSS 피드 생성
  - `og/[id]` - Open Graph 이미지 생성
- `/src/posts` - 연도별 MDX 게시글(2017–현재)
- `/src/components` - 재사용 컴포넌트
  - `/ui` - MDX 전용 UI 컴포넌트
- `/src/utils` - 게시글 관리 유틸리티
- `/public` - 정적 에셋

### 주요 패턴
#### 게시글 관리
- 소스 1) `src/posts/{year}/{id}.mdx`
- 소스 2) Vercel Postgres의 YouTube 게시글
- `src/utils/get-posts.ts`의 `getPosts()`가 두 소스를 병합하고 `date` 내림차순으로 정렬합니다.

#### MDX 처리
- `@next/mdx` + `remark-frontmatter`, `remark-mdx-frontmatter`, `rehype-pretty-code` 사용
- MDX 전용 UI 컴포넌트는 `src/components/ui/`에서 가져옵니다.

#### 라우팅
- `next.config.mjs`에서 레거시 ID를 연도 기반 라우트로 리다이렉트합니다. (예: `/post-id` → `/{year}/post-id`)

#### 스타일링
- Tailwind CSS, 다크 모드 지원, 코드 블록 하이라이팅

## 환경변수
- `GOOGLE_ANALYTICS_ID` - Google Analytics 추적용
- `POSTGRES_*` - Vercel Postgres 연결(YouTube 게시글용)

### 설정 및 동기화 절차
1) 로컬과 Vercel 프로젝트 연결
```bash
vercel link
```

2) Vercel에 저장된 환경변수 로컬로 가져오기(동기화)
- 개발 환경 변수 → `.env.local`에 저장 권장
```bash
vercel env pull .env.local --yes
```

3) 프리뷰/프로덕션 환경 변수를 특정 환경 기준으로 당겨오기(선택)
```bash
# 프리뷰 환경 값을 .env.local로
vercel env pull --environment=preview .env.local --yes

# 프로덕션 환경 값을 .env로
vercel env pull --environment=production .env --yes
```

4) 환경변수 조회/추가/삭제(선택)
```bash
# 조회
vercel env ls
vercel env ls development

# 추가 (예: 개발 환경)
vercel env add GOOGLE_ANALYTICS_ID development

# 삭제 (예: 개발 환경)
vercel env rm GOOGLE_ANALYTICS_ID development --yes
```

5) Vercel 대시보드나 CLI로 값을 변경한 뒤에는, 다시 아래 명령으로 로컬 파일을 갱신하세요.
```bash
vercel env pull .env.local --yes
```

참고: [Vercel CLI 환경변수 문서](https://vercel.com/docs/cli/env)

> 메모
> - Next.js 로컬 개발은 `.env.local`을 자동 로드합니다.
> - CI/배포는 Vercel 프로젝트에 저장된 환경값을 사용합니다. 로컬 파일은 커밋하지 마세요.
