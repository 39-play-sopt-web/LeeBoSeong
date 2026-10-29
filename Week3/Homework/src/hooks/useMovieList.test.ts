import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMovies } from '../apis/movies';
import type { MovieListResponse, MovieSummary } from '../types/movie';
import { useMovieList } from './useMovieList';

vi.mock('../apis/movies', async (importOriginal) => ({
  ...await importOriginal<typeof import('../apis/movies')>(),
  getMovies: vi.fn(),
}));

const mockGetMovies = vi.mocked(getMovies);
const initialResponse: MovieListResponse = {
  page: 1,
  results: [],
  total_pages: 10,
  total_results: 200,
};
const filteredResponse: MovieListResponse = {
  page: 1,
  results: [],
  total_pages: 2,
  total_results: 30,
};

function moviePage(page: number, ids: number[], totalPages = 3): MovieListResponse {
  const movies: MovieSummary[] = ids.map((id) => ({
    id,
    title: `영화 ${id}`,
    original_title: `Movie ${id}`,
    original_language: 'ko',
    overview: null,
    poster_path: null,
    backdrop_path: null,
    release_date: '',
    vote_average: 8,
    vote_count: 100,
    adult: false,
    genre_ids: [],
    popularity: 10,
    video: false,
  }));

  return { page, results: movies, total_pages: totalPages, total_results: 60 };
}

function deferredResponse() {
  let resolve!: (value: MovieListResponse) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<MovieListResponse>((fulfill, fail) => {
    resolve = fulfill;
    reject = fail;
  });

  return { promise, resolve, reject };
}

beforeEach(() => {
  mockGetMovies.mockReset();
});

afterEach(() => {
  cleanup();
});

describe('평점 필터 목록 조회', () => {
  it('필터를 바꾸면 기존 요청을 취소하고 새 조건의 1페이지를 요청한다', async () => {
    const initial = deferredResponse();
    const filtered = deferredResponse();
    mockGetMovies.mockReturnValueOnce(initial.promise).mockReturnValueOnce(filtered.promise);
    const { result } = renderHook(() => useMovieList());
    const oldSignal = mockGetMovies.mock.calls[0]?.[0]?.signal;

    act(() => result.current.selectFilter('8-9'));

    expect(oldSignal?.aborted).toBe(true);
    expect(result.current.filterId).toBe('8-9');
    expect(result.current.state).toEqual({ status: 'loading' });
    expect(mockGetMovies.mock.calls[1]?.[0]).toMatchObject({
      page: 1,
      rating: { min: 8, max: 9 },
    });

    await act(async () => {
      filtered.resolve(filteredResponse);
      await filtered.promise;
    });
    expect(result.current.state).toEqual({ status: 'success', data: filteredResponse });

    await act(async () => {
      initial.resolve(initialResponse);
      await initial.promise;
    });
    expect(result.current.state).toEqual({ status: 'success', data: filteredResponse });
  });

  it('빠르게 필터를 연속 변경한 뒤 늦게 도착한 실패를 무시한다', async () => {
    const initial = deferredResponse();
    const middle = deferredResponse();
    const latest = deferredResponse();
    mockGetMovies
      .mockReturnValueOnce(initial.promise)
      .mockReturnValueOnce(middle.promise)
      .mockReturnValueOnce(latest.promise);
    const { result } = renderHook(() => useMovieList());

    act(() => result.current.selectFilter('9-up'));
    act(() => result.current.selectFilter('6-down'));

    expect(mockGetMovies.mock.calls[0]?.[0]?.signal?.aborted).toBe(true);
    expect(mockGetMovies.mock.calls[1]?.[0]?.signal?.aborted).toBe(true);
    expect(mockGetMovies.mock.calls[2]?.[0]).toMatchObject({ page: 1, rating: { max: 6 } });

    await act(async () => {
      middle.reject(new Error('늦게 도착한 실패'));
      await middle.promise.catch(() => undefined);
    });
    expect(result.current.state).toEqual({ status: 'loading' });

    await act(async () => {
      latest.resolve(filteredResponse);
      initial.resolve(initialResponse);
      await Promise.all([latest.promise, initial.promise]);
    });
    expect(result.current.filterId).toBe('6-down');
    expect(result.current.state).toEqual({ status: 'success', data: filteredResponse });
  });

  it('조회 실패 후 재시도에도 선택한 평점 조건을 유지한다', async () => {
    mockGetMovies
      .mockResolvedValueOnce(initialResponse)
      .mockRejectedValueOnce(new Error('조회 실패'))
      .mockResolvedValueOnce(filteredResponse);
    const { result } = renderHook(() => useMovieList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    act(() => result.current.selectFilter('7-8'));
    await waitFor(() => expect(result.current.state.status).toBe('error'));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    expect(mockGetMovies.mock.calls[2]?.[0]).toMatchObject({
      page: 1,
      rating: { min: 7, max: 8 },
    });
    expect(result.current.filterId).toBe('7-8');
  });

  it('이미 선택한 필터를 다시 눌러도 중복 요청하지 않는다', async () => {
    mockGetMovies.mockResolvedValue(initialResponse);
    const { result } = renderHook(() => useMovieList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    act(() => result.current.selectFilter('all'));

    expect(mockGetMovies).toHaveBeenCalledTimes(1);
    expect(mockGetMovies.mock.calls[0]?.[0]?.signal?.aborted).toBe(false);
    expect(result.current.state.status).toBe('success');
  });

  it('페이지를 벗어나면 진행 중인 요청을 취소한다', () => {
    mockGetMovies.mockReturnValue(deferredResponse().promise);
    const { unmount } = renderHook(() => useMovieList());
    const signal = mockGetMovies.mock.calls[0]?.[0]?.signal;

    expect(signal?.aborted).toBe(false);
    unmount();
    expect(signal?.aborted).toBe(true);
  });

  it('추가 요청을 잠그고 중복 ID를 제거해 기존 카드 뒤에 붙인다', async () => {
    const next = deferredResponse();
    mockGetMovies.mockResolvedValueOnce(moviePage(1, [1, 2])).mockReturnValueOnce(next.promise);
    const { result } = renderHook(() => useMovieList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    act(() => {
      void result.current.loadMore();
      void result.current.loadMore();
    });
    expect(mockGetMovies).toHaveBeenCalledTimes(2);
    expect(mockGetMovies.mock.calls[1]?.[0]?.page).toBe(2);
    expect(result.current.moreState.status).toBe('loading');
    expect(result.current.state).toEqual({ status: 'success', data: moviePage(1, [1, 2]) });

    await act(async () => {
      next.resolve(moviePage(2, [2, 3, 3]));
      await next.promise;
    });
    expect(result.current.state).toEqual({ status: 'success', data: moviePage(2, [1, 2, 3]) });
    expect(result.current.hasMore).toBe(true);
  });

  it.each(['success', 'error'])('추가 조회 중 필터를 바꾸면 이전 페이지의 늦은 %s를 무시한다', async (outcome) => {
    const next = deferredResponse();
    mockGetMovies
      .mockResolvedValueOnce(moviePage(1, [1]))
      .mockReturnValueOnce(next.promise)
      .mockResolvedValueOnce(moviePage(1, [10], 2));
    const { result } = renderHook(() => useMovieList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));
    act(() => { void result.current.loadMore(); });
    const oldSignal = mockGetMovies.mock.calls[1]?.[0]?.signal;

    act(() => result.current.selectFilter('8-9'));
    expect(oldSignal?.aborted).toBe(true);
    expect(result.current.state).toEqual({ status: 'loading' });
    expect(mockGetMovies.mock.calls[2]?.[0]).toMatchObject({ page: 1, rating: { min: 8, max: 9 } });
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    await act(async () => {
      if (outcome === 'success') next.resolve(moviePage(2, [2]));
      else next.reject(new Error('오래된 추가 요청 실패'));
      await next.promise.catch(() => undefined);
    });
    expect(result.current.state).toEqual({ status: 'success', data: moviePage(1, [10], 2) });
    expect(result.current.moreState.status).toBe('idle');
  });

  it('추가 조회 실패 시 카드를 유지하고 자동 반복 없이 같은 페이지를 재시도한다', async () => {
    mockGetMovies
      .mockResolvedValueOnce(moviePage(1, [1]))
      .mockRejectedValueOnce(new Error('추가 조회 실패'))
      .mockResolvedValueOnce(moviePage(2, [2]));
    const { result } = renderHook(() => useMovieList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));
    await act(async () => { await result.current.loadMore(); });

    expect(result.current.moreState.status).toBe('error');
    expect(result.current.state).toEqual({ status: 'success', data: moviePage(1, [1]) });
    await act(async () => { await result.current.loadMore(); });
    expect(mockGetMovies).toHaveBeenCalledTimes(2);

    await act(async () => { await result.current.loadMore(true); });
    expect(mockGetMovies.mock.calls[2]?.[0]?.page).toBe(2);
    expect(result.current.state).toEqual({ status: 'success', data: moviePage(2, [1, 2]) });
    expect(result.current.moreState.status).toBe('idle');
  });

  it('빈 페이지도 서버에 다음 페이지가 있으면 계속 조회하고 마지막에서 멈춘다', async () => {
    mockGetMovies
      .mockResolvedValueOnce(moviePage(1, []))
      .mockResolvedValueOnce(moviePage(2, []))
      .mockResolvedValueOnce(moviePage(3, [3]));
    const { result } = renderHook(() => useMovieList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));
    expect(result.current.hasMore).toBe(true);
    await act(async () => { await result.current.loadMore(); });
    expect(result.current.hasMore).toBe(true);
    await act(async () => { await result.current.loadMore(); });

    expect(result.current.state).toEqual({ status: 'success', data: moviePage(3, [3]) });
    expect(result.current.hasMore).toBe(false);
    await act(async () => { await result.current.loadMore(); });
    expect(mockGetMovies).toHaveBeenCalledTimes(3);
  });

  it.each([0, 1])('총 페이지가 %i일 때 첫 응답 이후 더 요청하지 않는다', async (totalPages) => {
    mockGetMovies.mockResolvedValue(moviePage(1, [], totalPages));
    const { result } = renderHook(() => useMovieList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    expect(result.current.hasMore).toBe(false);
    await act(async () => { await result.current.loadMore(); });
    expect(mockGetMovies).toHaveBeenCalledTimes(1);
  });

  it('페이지를 벗어나면 추가 요청도 취소한다', async () => {
    mockGetMovies.mockResolvedValueOnce(moviePage(1, [1])).mockReturnValueOnce(deferredResponse().promise);
    const { result, unmount } = renderHook(() => useMovieList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));
    act(() => { void result.current.loadMore(); });
    const signal = mockGetMovies.mock.calls[1]?.[0]?.signal;

    unmount();
    expect(signal?.aborted).toBe(true);
  });
});
