import { Link, Outlet } from 'react-router';

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
        당신의 다음 장면을 찾아보세요.
      </footer>
    </div>
  );
}
