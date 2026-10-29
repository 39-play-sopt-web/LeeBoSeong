import { useCallback, useEffect, useRef, useState } from 'react';
import { getApiErrorMessage, isRequestCanceled } from '../apis/errors';
import { getMovies, MAX_MOVIE_PAGE } from '../apis/movies';
import { getRatingFilter } from '../constants/ratingFilters';
import type { MovieSummary, RatingFilterId } from '../types/movie';

interface MovieRequest {
  filterId: RatingFilterId;
  page: number;
  totalPages: number;
  status: 'idle' | 'loading' | 'error';
}

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
  const controllerRef = useRef<AbortController | null>(null);
  const requestRef = useRef<MovieRequest | null>(null);

  const fetchPage = useCallback(async (
    nextPage: number,
    request: MovieRequest,
    controller: AbortController,
  ) => {
    request.status = 'loading';

    try {
      const data = await getMovies({
        page: nextPage,
        rating: getRatingFilter(request.filterId).range,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      request.page = data.page;
      request.totalPages = Math.min(data.total_pages, MAX_MOVIE_PAGE);
      request.status = 'idle';
      setPage(request.page);
      setTotalPages(request.totalPages);
      setMovies((previous) => {
        if (nextPage === 1) return data.results;

        const seenIds = new Set(previous.map((movie) => movie.id));
        const newMovies = data.results.filter((movie) => {
          if (seenIds.has(movie.id)) return false;
          seenIds.add(movie.id);
          return true;
        });

        return [...previous, ...newMovies];
      });
    } catch (cause: unknown) {
      if (!controller.signal.aborted && !isRequestCanceled(cause)) {
        request.status = 'error';
        const message = getApiErrorMessage(cause);

        if (nextPage === 1) setError(message);
        else setLoadMoreError(message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const request: MovieRequest = { filterId, page: 0, totalPages: 0, status: 'loading' };
    controllerRef.current = controller;
    requestRef.current = request;

    async function fetchFirstPage() {
      await fetchPage(1, request, controller);
    }

    void fetchFirstPage();

    return () => {
      controller.abort();
      requestRef.current = null;
    };
  }, [attempt, filterId, fetchPage]);

  const loadMore = useCallback(async (retryFailedPage = false) => {
    const request = requestRef.current;
    const controller = controllerRef.current;

    if (
      !request || !controller || controller.signal.aborted ||
      request.page === 0 || request.status === 'loading' ||
      (request.status === 'error' && !retryFailedPage) ||
      request.page >= request.totalPages
    ) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);
    await fetchPage(request.page + 1, request, controller);
  }, [fetchPage]);

  function resetList() {
    controllerRef.current?.abort();
    requestRef.current = null;
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
