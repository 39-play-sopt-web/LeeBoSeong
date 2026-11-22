import { Link, Outlet, ScrollRestoration } from 'react-router';
import tmdbLogo from '../assets/tmdb-logo.svg';

export default function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:m-4 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-canvas"
      >
        본문으로 건너뛰기
      </a>

      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10">
          <Link to="/" className="text-sm font-extrabold tracking-wider">
            PLAY SOPT <span className="text-accent">MOVIE</span>
          </Link>
          <nav aria-label="메인 메뉴">
            <Link
              to="/"
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              영화 둘러보기
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10 sm:py-16">
        <Outlet />
      </main>

      <footer className="border-t border-line px-6 py-6 text-center text-xs tracking-wide text-muted">
        <p>당신의 다음 장면을 찾아보세요.</p>
        <section aria-label="데이터 출처" className="mx-auto mt-5 flex max-w-2xl flex-col items-center gap-3 leading-6">
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" aria-label="TMDB 웹사이트">
            <img src={tmdbLogo} alt="TMDB" className="h-3 w-auto" />
          </a>
          <p>영화 데이터와 이미지 출처: TMDB</p>
          <p lang="en">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </section>
      </footer>
      <ScrollRestoration />
    </div>
  );
}
