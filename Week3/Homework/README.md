# 3주차 과제 — 영화 탐색 페이지

[과제 안내](https://app.notion.com/p/sopt-official/3-React-TypeScript-API-3fa1e48dd96080abaef0ebf1df32361f)

React + TypeScript와 TMDB API를 사용하는 영화 탐색 페이지입니다. 현재 **3단계 영화 목록·카드 UI**까지 구현했습니다. 첫 페이지 목록 조회, 카드와 상세 경로 이동을 연결했으며, 평점 필터 UI·무한 스크롤·상세 정보 표시는 이후 단계에서 추가합니다.

## 실행 방법

Node.js 24와 pnpm 12.6.0을 사용했습니다. `Week3/Homework`에서 실행합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

검증 명령은 `pnpm build`(TypeScript 검사 포함), `pnpm lint`, `pnpm test`입니다. 타입 검사만 실행하려면 `pnpm typecheck`를 사용합니다.

## 1단계 구성

- Vite + React + TypeScript, TypeScript strict 설정과 명시적 any를 금지하는 ESLint 규칙.
- Tailwind CSS 4의 Vite 플러그인으로 화면 레이아웃과 유틸리티 스타일 작성.
- Emotion의 `ThemeProvider`와 `Global`을 사용한 `GlobalStyle`로 공통 색상·폰트 관리.
- Emotion 테마 → CSS 변수 → Tailwind `@theme inline`으로 연결해 색상 값을 한 곳에서 관리.
- React Router 7의 `createBrowserRouter`, `RouterProvider`, 공통 `AppLayout`의 `Outlet` 사용.
- `/`: 영화 목록 준비 화면.
- `/movies/:movieId`: 상세 경로와 ID 검사. 실제 영화 정보는 상세 UI 단계에서 연결.
- 그 외 경로: 없는 페이지 안내와 목록 복귀.

Tailwind는 화면 스타일을 담당하고, Emotion은 과제에서 요구한 테마·전역 스타일에 사용합니다. 별도의 styled 컴포넌트는 사용하지 않습니다.

## 환경변수

`.env.example`을 `.env`로 복사해 TMDB의 **API Key (v3 auth)**를 `VITE_API_KEY`에 입력합니다. 기본 URL은 `https://api.themoviedb.org/3`입니다. 환경변수를 변경하면 개발 서버를 다시 실행합니다.

키 없이 실행하면 목록 영역에 영화 서비스 연결 안내가 표시됩니다. 실제 API 함수를 호출할 때 키가 없으면 네트워크 요청 전에 설정 오류를 반환하며, 화면에는 구현 세부 정보가 없는 안내 문구를 표시합니다. 아직 키를 발급하지 않아 실제 TMDB 서버 응답은 확인하지 않았습니다.

실제 `.env`, `node_modules`, `dist`는 Git에서 제외하고 변수 이름만 예시 파일로 공유합니다. `VITE_` 변수는 브라우저에 노출되므로 서버 비밀키나 관리자 비밀번호를 넣지 않습니다.

## 2단계 API 구성

- `apis/client.ts`: 공통 Axios 인스턴스. API 키, 한국어 응답, 10초 제한 시간을 설정합니다.
- `getMovies({ page, rating, signal })`: `/discover/movie`를 조회합니다. `{ page, results, total_pages, total_results }`를 반환해 다음 페이지 유무를 판단할 수 있습니다.
- `getMovieDetail(movieId, signal)`: `/movie/{movieId}`를 조회하고 상세 객체를 반환합니다.
- `RatingRange`의 `min`/`max`는 서버의 `vote_average.gte`/`vote_average.lte`로 전달합니다. 두 조건 모두 경계값을 포함합니다. 실제 필터 탭의 범위는 4단계에서 확정합니다.
- 두 함수에 `AbortController.signal`을 전달할 수 있습니다. 호출자는 `isRequestCanceled(error)`로 취소를 구분해 오류 UI를 생략할 수 있습니다.
- 실패를 빈 성공 데이터로 바꾸지 않고 호출자에게 전달합니다. `getApiErrorMessage(error: unknown)`로 설정·인증·404·요청 제한·네트워크·시간 초과 안내를 얻습니다.
- `MovieSummary`와 `MovieDetail`은 공통 필드를 공유하며, 목록의 `genre_ids`와 상세의 `genres`를 구분합니다. 이미지 경로·줄거리·상영 시간의 null을 타입에 반영했습니다.

Axios의 응답 제네릭은 개발 중 타입 검사를 위한 계약입니다. 서버 응답의 런타임 검증을 수행하지는 않습니다. 테스트는 실제 키나 네트워크 없이 Axios adapter로 요청 경로·직렬화된 query·응답·취소·오류를 검증합니다.

참고: [TMDB 목록](https://developer.themoviedb.org/reference/discover-movie), [상세](https://developer.themoviedb.org/reference/movie-details), [인증](https://developer.themoviedb.org/docs/authentication-application), [Axios 요청 취소](https://axios.rest/pages/advanced/cancellation).

## 3단계 영화 목록·카드

- `useMovieList`: 첫 페이지를 조회하고 로딩·성공·실패 상태와 재시도를 관리합니다. 페이지를 벗어나면 요청을 취소하고 취소된 요청의 응답은 상태에 반영하지 않습니다.
- `MovieListPage`: 상태에 따라 로딩 skeleton, 실패 안내, 빈 목록 안내 또는 카드 목록을 표시합니다.
- `MovieCard`: 포스터·제목·개봉일·줄거리·평점을 표시하고 해당 영화의 상세 경로로 이동합니다. hover 시 테두리·그림자·확대 효과를 적용하고, 움직임 줄이기 설정을 반영합니다.
- 이미지가 없거나 로딩에 실패하면 대체 화면을 표시합니다. 비어 있는 제목·개봉일·줄거리·평점에도 안내를 제공합니다.
- `MovieListFeedback`: 실패·빈 결과 안내와 다시 불러오기 버튼을 표시합니다.
- 포스터는 [TMDB 이미지 안내](https://developer.themoviedb.org/docs/image-basics)의 `https://image.tmdb.org/t/p/w500`과 이미지 경로를 조합합니다.

목록은 첫 페이지까지만 표시합니다. 카드에서 상세 경로로 이동하면 현재는 상세 준비 화면이 나옵니다. 평점 조건은 API 함수에서 지원하지만 필터 UI는 다음 단계입니다.

## 폴더 구조

```text
src/
├─ apis/        # Axios 인스턴스, 목록·상세 함수, 오류 안내와 테스트
├─ components/  # 공통 레이아웃, 영화 카드, 안내 화면
├─ hooks/       # 목록 조회 상태와 재시도, 요청 취소
├─ pages/       # 목록·상세·없는 페이지
├─ router/      # 경로 설정
├─ styles/      # 테마, GlobalStyle, Tailwind 진입 CSS
├─ types/       # 영화 응답과 조회 조건 타입
├─ App.tsx      # ThemeProvider와 RouterProvider
└─ main.tsx     # React 진입점
```

## 확인한 항목

- `pnpm build`, `pnpm lint`, `pnpm test` 통과.
- 브라우저에서 테마 색상과 Tailwind 스타일 적용 확인.
- 상세 URL 직접 접속·새로고침과 목록 복귀 확인.
- 잘못된 movieId와 없는 경로의 안내 확인.
- 초기 테마·라우팅 검증에서 브라우저 콘솔 오류·경고 없음.

3단계는 로컬 테스트 API의 응답으로 브라우저에서 다음 항목을 확인했습니다. 테스트 API와 데이터는 과제 소스에 포함하지 않았습니다.

- 정상 목록의 카드 정보, 정상 이미지, 누락 이미지·이미지 오류의 대체 화면.
- 빈 개봉일·줄거리·평점, 긴 제목과 가로 넘침 없음.
- 키보드로 카드 선택 → 해당 movieId 경로 → 목록 복귀.
- 실패 안내 → 다시 불러오기 → 정상 목록 복구.
- 빈 결과 안내, 지연 응답의 로딩 skeleton, 로딩 중 상세 경로 이동.
- 테스트 설정을 제거한 실제 개발 환경에서 API 키 누락 안내.

테스트 중에는 의도한 이미지 404와 API 503 응답이 발생했습니다. 실제 TMDB 목록·상세 응답 검증은 API 키 설정 후 진행합니다.

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

전체 구현을 마친 후 마지막에 체크합니다. 단계별 완료 범위는 위 구현 설명으로 기록합니다.

- [ ] React + TypeScript
- [ ] HTTP 클라이언트 라이브러리 사용
- [ ] ThemeProvider, GlobalStyle 사용
- [ ] `any` 사용 금지

### 영화 목록 페이지

- [ ] 리스트 형태로 영화 데이터 불러오기
- [ ] 별점을 통한 필터링 기능 구현
- [ ] 영화 카드에 포스터, 제목, 개봉일, 줄거리 표시
- [ ] 영화 카드 hover 효과
- [ ] 카드 클릭 시 영화 상세 페이지 이동
- [ ] 무한 스크롤

### 영화 상세 페이지

- [ ] movieId로 라우팅
- [ ] 포스터, 배경, 제목, 개봉일, 장르, 평점, 상영 시간, 투표 수, 상태, 줄거리 표시
- [ ] 원제, 원어, 제작 국가, 사용 언어, 예산, 수익 표시
- [ ] 목록으로 돌아가기

## 공유 과제

새 블로그 아티클의 제목과 URL은 작성 후 추가합니다.
