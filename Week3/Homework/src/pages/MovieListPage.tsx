import MovieCard from '../components/MovieCard';
import MovieListFeedback from '../components/MovieListFeedback';
import RatingFilter from '../components/RatingFilter';
import { getRatingFilter } from '../constants/ratingFilters';
import { useMovieList } from '../hooks/useMovieList';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

function MovieListSkeleton() {
  return (
    <div role="status" aria-label="영화를 불러오고 있어요">
      <p className="mb-5 text-sm text-muted">영화를 불러오는 중…</p>
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
  const {
    movies, page, isLoading, error, retry, filterId, selectFilter,
    loadMore, isLoadingMore, loadMoreError, hasMore,
  } = useMovieList();
  const sentinelRef = useInfiniteScroll({
    enabled: hasMore && !isLoadingMore && !loadMoreError,
    page,
    onLoadMore: loadMore,
  });

  return (
    <section aria-labelledby="movie-list-title">
      <p className="text-xs font-semibold tracking-[0.24em] text-accent">YOUR NEXT SCENE</p>
      <h1 id="movie-list-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">영화 둘러보기</h1>

      <RatingFilter selected={filterId} onSelect={selectFilter} />

      <div className="mt-10" aria-busy={isLoading}>
        {isLoading && <MovieListSkeleton />}
        {error && (
          <MovieListFeedback
            title="영화 목록을 불러오지 못했어요"
            message={error}
            isError
            onRetry={retry}
          />
        )}
        {!isLoading && !error && (
          <>
          {movies.length === 0 && !hasMore ? (
            <MovieListFeedback
              title="지금은 표시할 영화가 없어요"
              message="다른 평점을 선택하거나 잠시 후 다시 확인해 주세요."
              onRetry={retry}
            />
          ) : movies.length === 0 ? (
            <p role="status" className="py-8 text-center text-sm text-muted">
              선택한 평점의 영화를 찾고 있어요…
            </p>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between gap-4 text-xs text-muted">
                <p>{getRatingFilter(filterId).label} · 인기순</p>
                <p aria-live="polite">{movies.length}편</p>
              </div>
              <ul className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
                {movies.map((movie) => (
                  <li key={movie.id} className="min-w-0">
                    <MovieCard movie={movie} />
                  </li>
                ))}
              </ul>
            </>
          )}
          {(hasMore || movies.length > 0) && (
            <div ref={sentinelRef} className="mt-8 flex min-h-24 flex-col items-center justify-center gap-4 py-6 text-center">
              {isLoadingMore && (
                <p role="status" className="text-sm text-muted">다음 영화를 불러오고 있어요…</p>
              )}
              {loadMoreError && (
                <>
                  <p role="alert" className="max-w-md text-sm leading-7 text-muted">
                    다음 영화를 불러오지 못했어요. {loadMoreError}
                  </p>
                  <button
                    type="button"
                    onClick={() => void loadMore(true)}
                    className="cursor-pointer rounded-full border border-line px-6 py-3 text-sm font-semibold text-accent hover:border-accent"
                  >
                    다음 영화 다시 불러오기
                  </button>
                </>
              )}
              {!loadMoreError && hasMore && (
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={isLoadingMore}
                  className="cursor-pointer rounded-full border border-line px-6 py-3 text-sm font-semibold text-accent hover:border-accent disabled:cursor-wait disabled:opacity-50"
                >
                  영화 더 불러오기
                </button>
              )}
              {!hasMore && (
                <p role="status" className="text-sm text-muted">마지막 영화까지 불러왔어요.</p>
              )}
            </div>
          )}
          </>
        )}
      </div>
    </section>
  );
}
