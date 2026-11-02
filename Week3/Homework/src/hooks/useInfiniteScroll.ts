import { useEffect, useRef } from 'react';

interface InfiniteScrollOptions {
  enabled: boolean;
  page: number;
  onLoadMore: () => void;
}

export function useInfiniteScroll({ enabled, page, onLoadMore }: InfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = sentinelRef.current;

    if (!enabled || !target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
    }, { rootMargin: '300px 0px', threshold: 0 });

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, page, onLoadMore]);

  return sentinelRef;
}
