import { useParams } from 'react-router';
import PageMessage from '../components/PageMessage';

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

  return (
    <PageMessage
      title="영화 상세 정보를 준비하고 있어요"
      description="영화의 다양한 이야기를 곧 만나볼 수 있어요."
    />
  );
}
