import { useEffect, useState } from 'react';
import { getApiErrorMessage, isNotFoundError } from '../apis/errors';
import { getMovieDetail } from '../apis/movies';
import type { MovieDetail } from '../types/movie';

export function useMovieDetail(movieId: number) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchMovie() {
      try {
        const data = await getMovieDetail(movieId);

        if (!ignore) {
          setMovie(data);
          setError(null);
          setNotFound(false);
        }
      } catch (cause: unknown) {
        if (!ignore) {
          setMovie(null);
          setError(getApiErrorMessage(cause));
          setNotFound(isNotFoundError(cause));
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchMovie();
    return () => { ignore = true; };
  }, [movieId, attempt]);

  function retry() {
    setMovie(null);
    setError(null);
    setNotFound(false);
    setIsLoading(true);
    setAttempt((previous) => previous + 1);
  }

  return { movie, isLoading, error, notFound, retry };
}
