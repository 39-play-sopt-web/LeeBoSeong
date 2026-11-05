import { Link } from 'react-router';

export default function PostCreatePage() {
  return (
    <>
      <h1>게시글 작성</h1>
      <Link to="/posts">게시글 목록으로 돌아가기</Link>
    </>
  );
}
