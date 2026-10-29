import { Link } from 'react-router';
import type { MovieDetail } from '../types/movie';
import { formatCount, formatCountry, formatLanguage, formatMoney, formatRuntime, formatStatus } from '../utils/formatMovie';
import MovieImage from './MovieImage';

interface MovieDetailViewProps {
  movie: MovieDetail;
}

export default function MovieDetailView({ movie }: MovieDetailViewProps) {
  const title = movie.title.trim() || '제목 미정';
  const facts = [
    { label: '평점', value: movie.vote_count > 0 ? `★ ${movie.vote_average.toFixed(1)} / 10` : '정보 없음' },
    { label: '상영 시간', value: formatRuntime(movie.runtime) },
    { label: '투표 수', value: formatCount(movie.vote_count) },
    { label: '상태', value: formatStatus(movie.status) },
  ];
  const information = [
    { label: '원제', value: movie.original_title.trim() || '정보 없음' },
    { label: '원어', value: formatLanguage(movie.original_language) },
    { label: '제작 국가', value: movie.production_countries.map((country) => formatCountry(country.iso_3166_1, country.name)).join(', ') || '정보 없음' },
    { label: '사용 언어', value: movie.spoken_languages.map((language) => formatLanguage(language.iso_639_1, language.name || language.english_name)).join(', ') || '정보 없음' },
    { label: '예산 (USD)', value: formatMoney(movie.budget) },
    { label: '수익 (USD)', value: formatMoney(movie.revenue) },
  ];

  return (
    <article aria-labelledby="movie-title">
      <Link to="/" className="mb-6 inline-flex rounded-lg py-2 text-sm font-semibold text-accent transition-colors hover:text-ink">
        ← 목록으로 돌아가기
      </Link>

      <div className="relative isolate overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="absolute inset-0 -z-10">
          <MovieImage path={movie.backdrop_path} title={title} kind="backdrop" loading="eager" className="size-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-linear-to-r from-canvas/95 via-canvas/80 to-canvas/60" />
        </div>
        <div className="grid items-center gap-8 p-6 sm:p-8 md:grid-cols-[220px_minmax(0,1fr)] lg:p-10">
          <div className="mx-auto aspect-2/3 w-full max-w-56 overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:mx-0">
            <MovieImage path={movie.poster_path} title={title} loading="eager" className="size-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.24em] text-accent">MOVIE DETAILS</p>
            <h1 id="movie-title" className="mt-3 break-words text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-4 text-sm text-muted">
              개봉일 {movie.release_date ? <time dateTime={movie.release_date}>{movie.release_date.replaceAll('-', '.')}</time> : '정보 없음'}
            </p>
            {movie.genres.length > 0 ? (
              <ul aria-label="장르" className="mt-5 flex flex-wrap gap-2">
                {movie.genres.map((genre) => <li key={genre.id} className="rounded-full border border-white/15 bg-surface/60 px-3 py-1 text-xs text-ink">{genre.name}</li>)}
              </ul>
            ) : <p className="mt-5 text-sm text-muted">장르 정보 없음</p>}
            <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-0">
                  <dt className="text-xs text-muted">{fact.label}</dt>
                  <dd className="mt-2 break-words text-sm font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section aria-labelledby="overview-title" className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 id="overview-title" className="text-lg font-bold">줄거리</h2>
        <p className="mt-4 whitespace-pre-line break-words text-sm leading-8 text-muted sm:text-base">
          {movie.overview?.trim() || '아직 등록된 줄거리가 없어요.'}
        </p>
      </section>

      <section aria-labelledby="information-title" className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 id="information-title" className="text-lg font-bold">기본 정보</h2>
        <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {information.map((item) => (
            <div key={item.label} className="min-w-0 border-t border-line pt-4">
              <dt className="text-xs text-muted">{item.label}</dt>
              <dd className="mt-2 break-words text-sm leading-7 text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
