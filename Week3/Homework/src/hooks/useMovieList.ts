import { useCallback, useEffect, useRef, useState } from 'react';
import { getApiErrorMessage, isRequestCanceled } from '../apis/errors';
import { getMovies, MAX_MOVIE_PAGE } from '../apis/movies';
import { getRatingFilter } from '../constants/ratingFilters';
import type { MovieListResponse, RatingFilterId } from '../types/movie';

type MovieListState =
  | { status: 'loading' }
  | { status: 'success'; data: MovieListResponse }
  | { status: 'error'; message: string };

type MoreMoviesState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string };

interface MovieRequest {
  filterId: RatingFilterId;
  page: number;
  totalPages: number;
  status: MoreMoviesState['status'];
}

export function useMovieList() {
  const [state, setState] = useState<MovieListState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [filterId, setFilterId] = useState<RatingFilterId>('all');
  const [moreState, setMoreState] = useState<MoreMoviesState>({ status: 'idle' });
  const controllerRef = useRef<AbortController | null>(null);
  const requestRef = useRef<MovieRequest | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const request: MovieRequest = { filterId, page: 0, totalPages: 0, status: 'loading' };
    controllerRef.current = controller;
    requestRef.current = request;

    async function fetchMovies() {
      try {
        const data = await getMovies({
          page: 1,
          rating: getRatingFilter(filterId).range,
          signal: controller.signal,
        });

        if (!controller.signal.aborted && requestRef.current === request) {
          request.page = data.page;
          request.totalPages = Math.min(data.total_pages, MAX_MOVIE_PAGE);
          request.status = 'idle';
          setState({ status: 'success', data });
        }
      } catch (error: unknown) {
        if (!controller.signal.aborted && requestRef.current === request && !isRequestCanceled(error)) {
          request.status = 'error';
          setState({ status: 'error', message: getApiErrorMessage(error) });
        }
      }
    }

    void fetchMovies();

    return () => {
      controller.abort();

      if (requestRef.current === request) {
        controllerRef.current?.abort();
        requestRef.current = null;
      }
    };
  }, [attempt, filterId]);

  const loadMore = useCallback(async (retryFailedPage = false) => {
    const request = requestRef.current;

    if (
      !request || request.page === 0 || request.status === 'loading' ||
      (request.status === 'error' && !retryFailedPage) ||
      request.page >= request.totalPages
    ) return;

    request.status = 'loading';
    const controller = new AbortController();
    controllerRef.current = controller;
    setMoreState({ status: 'loading' });

    try {
      const data = await getMovies({
        page: request.page + 1,
        rating: getRatingFilter(request.filterId).range,
        signal: controller.signal,
      });

      if (controller.signal.aborted || requestRef.current !== request) return;

      request.page = data.page;
      request.totalPages = Math.min(data.total_pages, MAX_MOVIE_PAGE);
      request.status = 'idle';
      setState((previous) => {
        if (previous.status !== 'success') return previous;

        const seenIds = new Set(previous.data.results.map((movie) => movie.id));
        const newMovies = data.results.filter((movie) => {
          if (seenIds.has(movie.id)) return false;
          seenIds.add(movie.id);
          return true;
        });

        return {
          status: 'success',
          data: { ...data, results: [...previous.data.results, ...newMovies] },
        };
      });
      setMoreState({ status: 'idle' });
    } catch (error: unknown) {
      if (!controller.signal.aborted && requestRef.current === request && !isRequestCanceled(error)) {
        request.status = 'error';
        setMoreState({ status: 'error', message: getApiErrorMessage(error) });
      }
    }
  }, []);

  function retry() {
    controllerRef.current?.abort();
    requestRef.current = null;
    setState({ status: 'loading' });
    setMoreState({ status: 'idle' });
    setAttempt((previous) => previous + 1);
  }

  function selectFilter(nextFilterId: RatingFilterId) {
    if (nextFilterId === filterId) return;

    controllerRef.current?.abort();
    requestRef.current = null;
    setState({ status: 'loading' });
    setMoreState({ status: 'idle' });
    setFilterId(nextFilterId);
  }

  const hasMore = state.status === 'success' &&
    state.data.page < Math.min(state.data.total_pages, MAX_MOVIE_PAGE);

  return { state, retry, filterId, selectFilter, loadMore, moreState, hasMore };
}
