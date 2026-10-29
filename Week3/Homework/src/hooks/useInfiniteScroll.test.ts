import { createElement } from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInfiniteScroll } from './useInfiniteScroll';

const observe = vi.fn();
const disconnect = vi.fn();
let notify: (entries: Pick<IntersectionObserverEntry, 'isIntersecting'>[]) => void;

function ScrollTarget({ enabled, page, onLoadMore }: {
  enabled: boolean;
  page: number;
  onLoadMore: () => void;
}) {
  const ref = useInfiniteScroll({ enabled, page, onLoadMore });
  return createElement('div', { ref });
}

beforeEach(() => {
  observe.mockClear();
  disconnect.mockClear();
  vi.stubGlobal('IntersectionObserver', vi.fn(function (callback: typeof notify) {
    notify = callback;
    return { observe, disconnect };
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('무한 스크롤 관찰', () => {
  it('하단 영역이 보일 때 조회하고 페이지 변경·비활성화 시 이전 관찰을 정리한다', () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(createElement(ScrollTarget, { enabled: true, page: 1, onLoadMore }));
    expect(observe).toHaveBeenCalledTimes(1);

    act(() => notify([{ isIntersecting: false }]));
    expect(onLoadMore).not.toHaveBeenCalled();
    act(() => notify([{ isIntersecting: true }]));
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    rerender(createElement(ScrollTarget, { enabled: true, page: 2, onLoadMore }));
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledTimes(2);
    rerender(createElement(ScrollTarget, { enabled: false, page: 2, onLoadMore }));
    expect(disconnect).toHaveBeenCalledTimes(2);
    expect(observe).toHaveBeenCalledTimes(2);
  });

  it('IntersectionObserver가 없는 환경에서도 렌더링한다', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const onLoadMore = vi.fn();

    render(createElement(ScrollTarget, { enabled: true, page: 1, onLoadMore }));
    expect(observe).not.toHaveBeenCalled();
    expect(onLoadMore).not.toHaveBeenCalled();
  });
});
