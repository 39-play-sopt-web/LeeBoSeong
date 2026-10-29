import { useState } from 'react';
import { Link } from 'react-router';
import type { MovieSummary } from '../types/movie';

interface MovieCardProps {
  movie: MovieSummary;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const title = movie.title.trim() || '제목 미정';
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const hasPoster = posterUrl !== null && posterUrl !== failedImageUrl;

  return (
    <Link
      to={`/movies/${movie.id}`}
      aria-label={`${title} 상세 보기`}
      className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:border-accent/60 hover:shadow-xl hover:shadow-black/20 focus-visible:border-accent motion-safe:hover:-translate-y-1 motion-reduce:transition-none"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-2/3 overflow-hidden bg-canvas">
          {hasPoster ? (
            <img
              src={posterUrl}
              alt={`${title} 포스터`}
              width={500}
              height={750}
              loading="lazy"
              decoding="async"
              onError={() => setFailedImageUrl(posterUrl)}
              className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-3 px-5 text-center text-muted">
              <svg aria-hidden="true" className="size-10 text-accent/60" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="5" width="24" height="22" rx="3" />
                <path d="M10 5v22M22 5v22M4 12h6m-6 8h6m12-8h6m-6 8h6" />
              </svg>
              <span className="text-xs">포스터 준비 중</span>
            </div>
          )}
          <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-canvas/90 px-2.5 py-1 text-xs font-semibold text-accent">
            {movie.vote_count > 0 ? `★ ${movie.vote_average.toFixed(1)}` : '평점 미정'}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h2 className="line-clamp-2 break-words text-lg font-bold leading-7 transition-colors group-hover:text-accent">{title}</h2>
          {movie.release_date ? (
            <time dateTime={movie.release_date} className="mt-2 text-xs text-muted">
              {movie.release_date.replaceAll('-', '.')}
            </time>
          ) : (
            <p className="mt-2 text-xs text-muted">개봉일 미정</p>
          )}
          <p className="mt-4 line-clamp-3 break-words text-sm leading-6 text-muted">
            {movie.overview?.trim() || '아직 등록된 줄거리가 없어요.'}
          </p>
          <span aria-hidden="true" className="mt-auto pt-5 text-xs font-semibold text-accent">자세히 보기 ↗</span>
        </div>
      </article>
    </Link>
  );
}
