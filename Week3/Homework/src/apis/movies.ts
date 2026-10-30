import type {
  MovieDetail,
  MovieListOptions,
  MovieListResponse,
} from '../types/movie';
import { tmdbClient } from './client';

export const MAX_MOVIE_PAGE = 500;

export async function getMovies({
  page = 1,
  rating,
}: MovieListOptions = {}): Promise<MovieListResponse> {
  if (!Number.isSafeInteger(page) || page < 1 || page > MAX_MOVIE_PAGE) {
    throw new RangeError('페이지 번호는 1~500 사이의 정수여야 합니다.');
  }

  const { data } = await tmdbClient.get<MovieListResponse>('/discover/movie', {
    params: {
      page,
      include_adult: false,
      sort_by: 'popularity.desc',
      'vote_average.gte': rating?.min,
      'vote_average.lte': rating?.max,
    },
  });

  return {
    ...data,
    results: data.results.filter((movie) => (
      (rating?.min === undefined || movie.vote_average >= rating.min) &&
      (rating?.max === undefined || movie.vote_average <= rating.max)
    )),
  };
}

export async function getMovieDetail(movieId: number): Promise<MovieDetail> {
  if (!Number.isSafeInteger(movieId) || movieId < 1) {
    throw new RangeError('영화 번호는 1 이상의 정수여야 합니다.');
  }

  const { data } = await tmdbClient.get<MovieDetail>(`/movie/${movieId}`);

  return data;
}
