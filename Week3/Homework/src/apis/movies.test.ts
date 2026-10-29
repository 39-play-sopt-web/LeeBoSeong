import { AxiosError, type AxiosAdapter } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MovieDetail, MovieListResponse, MovieSummary } from '../types/movie';

const movie: MovieSummary = {
  id: 550,
  title: '테스트 영화',
  original_title: 'Test Movie',
  original_language: 'en',
  overview: null,
  poster_path: null,
  backdrop_path: null,
  release_date: '',
  vote_average: 8.4,
  vote_count: 100,
  adult: false,
  genre_ids: [18],
  popularity: 10,
  video: false,
};

const movieList: MovieListResponse = {
  page: 2,
  results: [movie],
  total_pages: 3,
  total_results: 41,
};

const movieDetail: MovieDetail = {
  id: movie.id,
  title: movie.title,
  original_title: movie.original_title,
  original_language: movie.original_language,
  overview: movie.overview,
  poster_path: movie.poster_path,
  backdrop_path: movie.backdrop_path,
  release_date: movie.release_date,
  vote_average: movie.vote_average,
  vote_count: movie.vote_count,
  genres: [{ id: 18, name: '드라마' }],
  runtime: null,
  status: 'Released',
  budget: 0,
  revenue: 0,
  production_countries: [],
  spoken_languages: [],
};

async function loadApi(responseData: unknown = movieList) {
  const { tmdbClient } = await import('./client');
  const api = await import('./movies');
  const errors = await import('./errors');
  const adapter = vi.fn<AxiosAdapter>(async (config) => ({
    data: responseData,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }));

  tmdbClient.defaults.adapter = adapter;

  return { ...api, ...errors, tmdbClient, adapter };
}

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.themoviedb.org/3');
  vi.stubEnv('VITE_API_KEY', 'test-key');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('TMDB 영화 API', () => {
  it('목록 요청에 인증·언어·페이지·평점 조건을 보내고 페이지 정보를 보존한다', async () => {
    const { getMovies, tmdbClient, adapter } = await loadApi();

    const response = await getMovies({ page: 2, rating: { min: 8, max: 9 } });
    const request = adapter.mock.calls[0]?.[0];

    expect(response).toEqual(movieList);
    expect(request?.url).toBe('/discover/movie');
    expect(request?.timeout).toBe(10_000);
    expect(request).toBeDefined();

    if (!request) throw new Error('목록 요청이 없습니다.');

    const url = new URL(tmdbClient.getUri(request));
    expect(url.origin + url.pathname).toBe('https://api.themoviedb.org/3/discover/movie');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      api_key: 'test-key',
      language: 'ko-KR',
      page: '2',
      include_adult: 'false',
      sort_by: 'popularity.desc',
      'vote_average.gte': '8',
      'vote_average.lte': '9',
    });
  });

  it('기본 조회는 1페이지이며 평점 조건을 전송하지 않는다', async () => {
    const { getMovies, tmdbClient, adapter } = await loadApi();
    await getMovies();
    const request = adapter.mock.calls[0]?.[0];
    if (!request) throw new Error('목록 요청이 없습니다.');

    const url = new URL(tmdbClient.getUri(request));
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.has('vote_average.gte')).toBe(false);
    expect(url.searchParams.has('vote_average.lte')).toBe(false);
  });

  it('평점 0을 유효한 하한으로 전송한다', async () => {
    const { getMovies, tmdbClient, adapter } = await loadApi();
    await getMovies({ rating: { min: 0, max: 6 } });
    const request = adapter.mock.calls[0]?.[0];
    if (!request) throw new Error('목록 요청이 없습니다.');

    expect(new URL(tmdbClient.getUri(request)).searchParams.get('vote_average.gte')).toBe('0');
  });

  it('상세는 movieId 경로로 요청하고 상세 객체를 반환한다', async () => {
    const { getMovieDetail, adapter } = await loadApi(movieDetail);

    expect(await getMovieDetail(550)).toEqual(movieDetail);
    expect(adapter.mock.calls[0]?.[0].url).toBe('/movie/550');
  });

  it('키가 없으면 외부 요청 전에 설정 오류를 알린다', async () => {
    vi.stubEnv('VITE_API_KEY', '  ');
    const { getMovies, getApiErrorMessage, adapter } = await loadApi();

    const error: unknown = await getMovies().catch((cause: unknown) => cause);
    expect(error).toBeInstanceOf(Error);
    expect(getApiErrorMessage(error)).toContain('영화 서비스 연결');
    expect(adapter).not.toHaveBeenCalled();
  });

  it('취소된 요청은 일반 실패와 구분하며 전송하지 않는다', async () => {
    const { getMovies, isRequestCanceled, adapter } = await loadApi();
    const controller = new AbortController();
    controller.abort();

    const error: unknown = await getMovies({ signal: controller.signal })
      .catch((cause: unknown) => cause);

    expect(isRequestCanceled(error)).toBe(true);
    expect(adapter).not.toHaveBeenCalled();
  });

  it('상세 요청에도 AbortSignal을 전달한다', async () => {
    const { getMovieDetail, adapter } = await loadApi(movieDetail);
    const controller = new AbortController();
    await getMovieDetail(550, controller.signal);

    expect(adapter.mock.calls[0]?.[0].signal).toBe(controller.signal);
  });

  it('잘못된 페이지와 영화 ID는 요청하지 않는다', async () => {
    const { getMovies, getMovieDetail, adapter } = await loadApi();

    await expect(getMovies({ page: 0 })).rejects.toThrow(RangeError);
    await expect(getMovies({ page: 1.5 })).rejects.toThrow(RangeError);
    await expect(getMovieDetail(-1)).rejects.toThrow(RangeError);
    await expect(getMovieDetail(Number.NaN)).rejects.toThrow(RangeError);
    expect(adapter).not.toHaveBeenCalled();
  });

  it('404를 빈 성공 응답으로 바꾸지 않고 호출자에게 전달한다', async () => {
    const { getMovieDetail, getApiErrorMessage, adapter } = await loadApi();
    adapter.mockImplementation(async (config) => {
      throw new AxiosError('Not Found', 'ERR_BAD_REQUEST', config, undefined, {
        data: { status_code: 34 },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
      });
    });

    await expect(getMovieDetail(550)).rejects.toMatchObject({ response: { status: 404 } });
    const error: unknown = await getMovieDetail(550).catch((cause: unknown) => cause);
    expect(getApiErrorMessage(error)).toBe('요청한 영화를 찾을 수 없어요.');
  });

  it('네트워크·시간 초과·알 수 없는 오류를 안전한 안내로 바꾼다', async () => {
    const { getApiErrorMessage } = await loadApi();

    expect(getApiErrorMessage(new AxiosError('Network Error', 'ERR_NETWORK')))
      .toContain('네트워크');
    expect(getApiErrorMessage(new AxiosError('timeout', 'ECONNABORTED')))
      .toContain('응답이 늦어지고');
    expect(getApiErrorMessage({ unexpected: 'value' })).toContain('불러오지 못했어요');
  });
});
