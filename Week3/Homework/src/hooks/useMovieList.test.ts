import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMovies } from '../apis/movies';
import type { MovieListResponse } from '../types/movie';
import { useMovieList } from './useMovieList';

vi.mock('../apis/movies', () => ({ getMovies: vi.fn() }));

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
});
