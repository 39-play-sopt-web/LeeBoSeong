import type {
  MovieDetail,
  MovieListOptions,
  MovieListResponse,
} from '../types/movie';
import { tmdbClient } from './client';

export async function getMovies({
  page = 1,
  rating,
  signal,
}: MovieListOptions = {}): Promise<MovieListResponse> {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new RangeError('페이지 번호는 1 이상의 정수여야 합니다.');
  }

  const { data } = await tmdbClient.get<MovieListResponse>('/discover/movie', {
    params: {
      page,
      include_adult: false,
      sort_by: 'popularity.desc',
      'vote_average.gte': rating?.min,
      'vote_average.lte': rating?.max,
    },
    signal,
  });

  return {
    ...data,
    results: data.results.filter((movie) => (
      (rating?.min === undefined || movie.vote_average >= rating.min) &&
      (rating?.max === undefined || movie.vote_average <= rating.max)
    )),
  };
}

export async function getMovieDetail(
  movieId: number,
  signal?: AbortSignal,
): Promise<MovieDetail> {
  if (!Number.isSafeInteger(movieId) || movieId < 1) {
    throw new RangeError('영화 번호는 1 이상의 정수여야 합니다.');
  }

  const { data } = await tmdbClient.get<MovieDetail>(`/movie/${movieId}`, {
    signal,
  });

  return data;
}
