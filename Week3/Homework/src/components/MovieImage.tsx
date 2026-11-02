import { useState } from 'react';

interface MovieImageProps {
  path: string | null;
  title: string;
  kind?: 'poster' | 'backdrop';
  className?: string;
  loading?: 'lazy' | 'eager';
}

export default function MovieImage({
  path,
  title,
  kind = 'poster',
  className = '',
  loading = 'lazy',
}: MovieImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const size = kind === 'poster' ? 'w500' : 'w1280';
  const url = path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
  const label = kind === 'poster' ? '포스터' : '배경 이미지';

  if (!url || failedUrl === url) {
    return (
      <div role="img" aria-label={`${title} ${label} 없음`} className={`flex flex-col items-center justify-center gap-3 bg-canvas px-5 text-center text-muted ${className}`}>
        <svg aria-hidden="true" className="size-10 text-accent/60" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="5" width="24" height="22" rx="3" />
          <path d="M10 5v22M22 5v22M4 12h6m-6 8h6m12-8h6m-6 8h6" />
        </svg>
        <span className="text-xs">{label} 준비 중</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={`${title} ${label}`}
      width={kind === 'poster' ? 500 : 1280}
      height={kind === 'poster' ? 750 : 720}
      loading={loading}
      decoding="async"
      onError={() => setFailedUrl(url)}
      className={className}
    />
  );
}
