import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { getPostById } from '../apis/post';

export default function PostDetailPage() {
  const { postId } = useParams();
  const id = Number(postId);
  const isValidId = Number.isSafeInteger(id) && id > 0;
  const { data: post, isPending, isError } = useQuery({
    queryKey: ['post', id], // 게시글별로 캐시를 구분.
    queryFn: () => getPostById(id),
    enabled: isValidId,
  });

  return (
    <>
      <h1>게시글 상세</h1>
      {!isValidId && <p role="alert">올바르지 않은 게시글 번호입니다.</p>}
      {isValidId && isPending && <p role="status">게시글을 불러오는 중입니다.</p>}
      {isError && <p role="alert">게시글을 불러오지 못했습니다.</p>}
      {post && (
        <article className="post-detail">
          <h2>{post.title}</h2>
          <p>
            작성자: {post.author} · 작성일: <time dateTime={post.createdAt}>{post.createdAt.slice(0, 10)}</time>
          </p>
          <p className="post-detail-content">{post.content}</p>
        </article>
      )}
      <Link to="/posts" className="post-list-link">게시글 목록으로 돌아가기</Link>
    </>
  );
}
