import { Link, Navigate, NavLink, Outlet } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';

export default function BoardLayout() {
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  if (!session?.authorizationCode) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <header className="board-header">
        <div className="board-header-inner">
          <div>
            <Link to="/posts" className="board-brand">SOPT 게시판</Link>
            <span className="board-part">{session.part}</span>
          </div>
          <nav aria-label="게시판 메뉴">
            <NavLink to="/posts" end>게시글 목록</NavLink>
            <NavLink to="/posts/new">글쓰기</NavLink>
            <button type="button" onClick={clearSession}>로그아웃</button>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
