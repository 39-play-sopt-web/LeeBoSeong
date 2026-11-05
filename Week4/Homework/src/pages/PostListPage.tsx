import { Link } from 'react-router';

export default function PostListPage() {
  return (
    <>
      <h1>게시글 목록</h1>
      <p>웹 파트의 이야기를 나누는 공간.</p>
      <article className="post-preview">
        <h2><Link to="/posts/1">예시 게시글</Link></h2>
      </article>
    </>
  );
}
