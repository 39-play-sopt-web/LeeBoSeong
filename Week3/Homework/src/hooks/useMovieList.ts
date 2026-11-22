import { useCallback, useEffect, useRef, useState } from 'react';
import { getApiErrorMessage } from '../apis/errors';
import { getMovies, MAX_MOVIE_PAGE } from '../apis/movies';
import { getRatingFilter } from '../constants/ratingFilters';
import type { MovieSummary, RatingFilterId } from '../types/movie';

export function useMovieList() {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [filterId, setFilterId] = useState<RatingFilterId>('all');
  const [attempt, setAttempt] = useState(0);
  const requestIdRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchPage = useCallback(async (
    nextPage: number,
    requestId: number,
  ) => {
    try {
      const data = await getMovies({
        page: nextPage,
        rating: getRatingFilter(filterId).range,
      });

      if (requestId !== requestIdRef.current) return;

      setPage(data.page);
      setTotalPages(Math.min(data.total_pages, MAX_MOVIE_PAGE));
      setMovies((previous) => {
        if (nextPage === 1) return data.results;

        const movieIds = previous.map((movie) => movie.id);
        const nextMovies = [...previous];

        for (const movie of data.results) {
          if (!movieIds.includes(movie.id)) {
            movieIds.push(movie.id);
            nextMovies.push(movie);
          }
        }

        return nextMovies;
      });
    } catch (cause: unknown) {
      if (requestId === requestIdRef.current) {
        const message = getApiErrorMessage(cause);

        if (nextPage === 1) setError(message);
        else setLoadMoreError(message);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        isFetchingRef.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, [filterId]);

  useEffect(() => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    isFetchingRef.current = true;

    async function fetchFirstPage() {
      await fetchPage(1, requestId);
    }

    fetchFirstPage();

    return () => {
      requestIdRef.current += 1;
    };
  }, [attempt, fetchPage]);

  const loadMore = useCallback(async (retryFailedPage = false) => {
    if (
      isFetchingRef.current || page === 0 || page >= totalPages ||
      (loadMoreError && !retryFailedPage)
    ) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(null);
    await fetchPage(page + 1, requestIdRef.current);
  }, [page, totalPages, loadMoreError, fetchPage]);

  function resetList() {
    requestIdRef.current += 1;
    isFetchingRef.current = true;
    setMovies([]);
    setPage(0);
    setTotalPages(0);
    setIsLoading(true);
    setError(null);
    setIsLoadingMore(false);
    setLoadMoreError(null);
  }

  function retry() {
    resetList();
    setAttempt((previous) => previous + 1);
  }

  function selectFilter(nextFilterId: RatingFilterId) {
    if (nextFilterId === filterId) return;

    resetList();
    setFilterId(nextFilterId);
  }

  const hasMore = page > 0 && page < totalPages;

  return {
    movies, page, isLoading, error, retry, filterId, selectFilter,
    loadMore, isLoadingMore, loadMoreError, hasMore,
  };
}
