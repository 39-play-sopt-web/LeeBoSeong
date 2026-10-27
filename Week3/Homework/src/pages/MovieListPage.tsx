export default function MovieListPage() {
  return (
    <section>
      <p className="text-xs font-semibold tracking-[0.24em] text-accent">YOUR NEXT SCENE</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">영화 둘러보기</h1>
      <p className="mt-4 text-sm text-muted sm:text-base">오늘은 어떤 이야기를 만나볼까요?</p>

      <div className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center sm:min-h-80">
        <svg
          aria-hidden="true"
          className="mb-6 size-10 text-accent"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="4" y="5" width="24" height="22" rx="3" />
          <path d="M10 5v22M22 5v22M4 12h6m-6 8h6m12-8h6m-6 8h6" />
        </svg>
        <h2 className="text-lg font-semibold">영화 목록을 준비하고 있어요</h2>
        <p className="mt-2 max-w-sm text-sm leading-7 text-muted">
          다양한 영화와 새로운 이야기를 곧 이곳에서 만나보세요.
        </p>
      </div>
    </section>
  );
}
