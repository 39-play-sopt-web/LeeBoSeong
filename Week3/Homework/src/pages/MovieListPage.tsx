import MovieCard from '../components/MovieCard';
import MovieListFeedback from '../components/MovieListFeedback';
import RatingFilter from '../components/RatingFilter';
import { getRatingFilter } from '../constants/ratingFilters';
import { useMovieList } from '../hooks/useMovieList';

function MovieListSkeleton() {
  return (
    <div role="status" aria-label="영화를 불러오고 있어요">
      <p className="mb-5 text-sm text-muted">영화를 불러오고 있어요…</p>
      <div aria-hidden="true" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-line bg-surface motion-safe:animate-pulse">
            <div className="aspect-2/3 bg-line/50" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 rounded bg-line" />
              <div className="h-3 w-1/2 rounded bg-line" />
              <div className="h-12 rounded bg-line/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MovieListPage() {
  const { state, retry, filterId, selectFilter } = useMovieList();

  return (
    <section aria-labelledby="movie-list-title">
      <p className="text-xs font-semibold tracking-[0.24em] text-accent">YOUR NEXT SCENE</p>
      <h1 id="movie-list-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">영화 둘러보기</h1>
      <p className="mt-4 text-sm text-muted sm:text-base">오늘은 어떤 이야기를 만나볼까요?</p>

      <RatingFilter selected={filterId} onSelect={selectFilter} />

      <div className="mt-10" aria-busy={state.status === 'loading'}>
        {state.status === 'loading' && <MovieListSkeleton />}
        {state.status === 'error' && (
          <MovieListFeedback
            title="영화 목록을 불러오지 못했어요"
            message={state.message}
            isError
            onRetry={retry}
          />
        )}
        {state.status === 'success' && (
          state.data.results.length === 0 ? (
            <MovieListFeedback
              title="지금은 표시할 영화가 없어요"
              message="다른 평점을 선택하거나 잠시 후 다시 확인해 주세요."
              onRetry={retry}
            />
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between gap-4 text-xs text-muted">
                <p>{getRatingFilter(filterId).label} · 인기순</p>
                <p>{state.data.results.length}편</p>
              </div>
              <ul className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
                {state.data.results.map((movie) => (
                  <li key={movie.id} className="min-w-0">
                    <MovieCard movie={movie} />
                  </li>
                ))}
              </ul>
            </>
          )
        )}
      </div>
    </section>
  );
}
