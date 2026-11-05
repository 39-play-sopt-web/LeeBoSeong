import { Link, useParams } from 'react-router';

export default function PostDetailPage() {
  const { postId } = useParams();

  return (
    <>
      <article>
        <h1>게시글 상세</h1>
        <p>게시글 번호 {postId}</p>
      </article>
      <Link to="/posts">게시글 목록으로 돌아가기</Link>
    </>
  );
}
