import { useEffect, useState } from 'react';
import { getApiErrorMessage, isRequestCanceled } from '../apis/errors';
import { getMovies } from '../apis/movies';
import type { MovieListResponse } from '../types/movie';

type MovieListState =
  | { status: 'loading' }
  | { status: 'success'; data: MovieListResponse }
  | { status: 'error'; message: string };

export function useMovieList() {
  const [state, setState] = useState<MovieListState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        const data = await getMovies({ signal: controller.signal });

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
  }, [attempt]);

  function retry() {
    setState({ status: 'loading' });
    setAttempt((previous) => previous + 1);
  }

  return { state, retry };
}
