import { useEffect, useRef, useState } from 'react';
import { getApiErrorMessage, isRequestCanceled } from '../apis/errors';
import { getMovies } from '../apis/movies';
import { getRatingFilter } from '../constants/ratingFilters';
import type { MovieListResponse, RatingFilterId } from '../types/movie';

type MovieListState =
  | { status: 'loading' }
  | { status: 'success'; data: MovieListResponse }
  | { status: 'error'; message: string };

export function useMovieList() {
  const [state, setState] = useState<MovieListState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [filterId, setFilterId] = useState<RatingFilterId>('all');
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    async function fetchMovies() {
      try {
        const data = await getMovies({
          page: 1,
          rating: getRatingFilter(filterId).range,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setState({ status: 'success', data });
        }
      } catch (error: unknown) {
        if (!controller.signal.aborted && !isRequestCanceled(error)) {
          setState({ status: 'error', message: getApiErrorMessage(error) });
        }
      }
    }

    void fetchMovies();

    return () => controller.abort();
  }, [attempt, filterId]);

  function retry() {
    controllerRef.current?.abort();
    setState({ status: 'loading' });
    setAttempt((previous) => previous + 1);
  }

  function selectFilter(nextFilterId: RatingFilterId) {
    if (nextFilterId === filterId) return;

    controllerRef.current?.abort();
    setState({ status: 'loading' });
    setFilterId(nextFilterId);
  }

  return { state, retry, filterId, selectFilter };
}
