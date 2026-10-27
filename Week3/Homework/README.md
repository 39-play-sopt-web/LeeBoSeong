# 3주차 과제 — 영화 탐색 페이지

[과제 안내](https://app.notion.com/p/sopt-official/3-React-TypeScript-API-3fa1e48dd96080abaef0ebf1df32361f)

React + TypeScript와 TMDB API를 사용하는 영화 탐색 페이지입니다. 현재 **1단계 프로젝트·스타일·라우팅 설정**까지 구현했습니다. 영화 데이터 조회, 카드, 필터, 무한 스크롤과 상세 정보는 이후 단계에서 추가합니다.

## 실행 방법

Node.js 24와 pnpm 12.6.0을 사용했습니다. `Week3/Homework`에서 실행합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

검증 명령은 `pnpm build`(TypeScript 검사 포함), `pnpm lint`입니다. 타입 검사만 실행하려면 `pnpm typecheck`를 사용합니다.

## 1단계 구성

- Vite + React + TypeScript, TypeScript strict 설정과 명시적 any를 금지하는 ESLint 규칙.
- Tailwind CSS 4의 Vite 플러그인으로 화면 레이아웃과 유틸리티 스타일 작성.
- Emotion의 `ThemeProvider`와 `Global`을 사용한 `GlobalStyle`로 공통 색상·폰트 관리.
- Emotion 테마 → CSS 변수 → Tailwind `@theme inline`으로 연결해 색상 값을 한 곳에서 관리.
- React Router 7의 `createBrowserRouter`, `RouterProvider`, 공통 `AppLayout`의 `Outlet` 사용.
- `/`: 영화 목록 준비 화면.
- `/movies/:movieId`: 상세 경로와 ID 검사. 실제 영화 정보는 다음 API 단계에서 연결.
- 그 외 경로: 없는 페이지 안내와 목록 복귀.

Tailwind는 화면 스타일을 담당하고, Emotion은 과제에서 요구한 테마·전역 스타일에 사용합니다. 별도의 styled 컴포넌트는 사용하지 않습니다.

## 환경변수

다음 API 단계에서는 `.env.example`을 `.env`로 복사해 TMDB 키를 입력합니다. 1단계 실행에는 키가 필요하지 않습니다.

실제 `.env`, `node_modules`, `dist`는 Git에서 제외하고 변수 이름만 예시 파일로 공유합니다. `VITE_` 변수는 브라우저에 노출되므로 서버 비밀키나 관리자 비밀번호를 넣지 않습니다.

## 폴더 구조

```text
src/
├─ components/  # 공통 레이아웃과 안내 화면
├─ pages/       # 목록·상세·없는 페이지
├─ router/      # 경로 설정
├─ styles/      # 테마, GlobalStyle, Tailwind 진입 CSS
├─ App.tsx      # ThemeProvider와 RouterProvider
└─ main.tsx     # React 진입점
```

## 확인한 항목

- `pnpm build`, `pnpm lint` 통과.
- 브라우저에서 테마 색상과 Tailwind 스타일 적용 확인.
- 상세 URL 직접 접속·새로고침과 목록 복귀 확인.
- 잘못된 movieId와 없는 경로의 안내 확인.
- 브라우저 콘솔 오류·경고 없음.

## 구현 순서

1. TypeScript 프로젝트, 테마·전역 스타일, 목록·상세 라우터 설정
2. TMDB API 클라이언트와 영화 응답 타입 정의
3. 영화 목록과 카드 UI 구현
4. 평점 범위 필터 구현
5. 무한 스크롤 구현
6. 영화 상세 정보 구현
7. 요청 실패·누락 데이터 처리 및 검증
8. 결과물과 공유 과제 정리

## 과제 체크리스트

- [x] React + TypeScript
- [ ] HTTP 클라이언트 라이브러리 사용
- [x] ThemeProvider, GlobalStyle 사용
- [x] `any` 사용 금지

### 영화 목록 페이지

- [ ] 리스트 형태로 영화 데이터 불러오기
- [ ] 별점을 통한 필터링 기능 구현
- [ ] 영화 카드에 포스터, 제목, 개봉일, 줄거리 표시
- [ ] 영화 카드 hover 효과
- [ ] 카드 클릭 시 영화 상세 페이지 이동
- [ ] 무한 스크롤

### 영화 상세 페이지

- [x] movieId로 라우팅
- [ ] 포스터, 배경, 제목, 개봉일, 장르, 평점, 상영 시간, 투표 수, 상태, 줄거리 표시
- [ ] 원제, 원어, 제작 국가, 사용 언어, 예산, 수익 표시
- [x] 목록으로 돌아가기

## 공유 과제

새 블로그 아티클의 제목과 URL은 작성 후 추가합니다.
