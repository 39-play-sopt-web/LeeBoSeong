import { Link } from 'react-router';

export default function AuthPage() {
  return (
    <main>
      <h1>회원 코드 발급</h1>
      <Link to="/posts">게시글 목록으로 이동</Link>
    </main>
  );
}
