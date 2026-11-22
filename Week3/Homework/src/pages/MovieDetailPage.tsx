import { useParams } from 'react-router';
import PageMessage from '../components/PageMessage';
import MovieDetailView from '../components/MovieDetailView';
import { useMovieDetail } from '../hooks/useMovieDetail';

function MovieDetailContent({ movieId }: { movieId: number }) {
  const { movie, isLoading, error, notFound, retry } = useMovieDetail(movieId);

  if (isLoading) {
    return (
      <div role="status" aria-label="영화 정보를 불러오고 있어요" className="py-8">
        <p className="text-center text-sm text-muted">영화 정보를 불러오고 있어요…</p>
        <div aria-hidden="true" className="mt-8 h-96 rounded-3xl border border-line bg-surface motion-safe:animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <PageMessage
        title={notFound ? '영화를 찾을 수 없어요' : '영화 정보를 불러오지 못했어요'}
        description={error}
        onRetry={notFound ? undefined : retry}
        isError
      />
    );
  }

  return movie ? <MovieDetailView movie={movie} /> : null;
}

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const isValidId =
    movieId !== undefined &&
    /^[1-9]\d*$/.test(movieId) &&
    Number.isSafeInteger(Number(movieId));

  if (!isValidId) {
    return (
      <PageMessage
        title="영화 주소를 확인해 주세요"
        description="올바른 영화 번호가 아니에요. 목록에서 영화를 다시 선택해 주세요."
      />
    );
  }

  return <MovieDetailContent key={movieId} movieId={Number(movieId)} />;
}
