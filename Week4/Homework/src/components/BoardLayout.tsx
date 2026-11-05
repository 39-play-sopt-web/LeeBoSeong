import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';

export default function BoardLayout() {
  const part = useAuthStore((state) => state.session?.part);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();

  function handleLogout() {
    clearSession();
    void navigate('/auth', { replace: true });
  }

  return (
    <>
      <header className="board-header">
        <div className="board-header-inner">
          <div>
            <Link to="/posts" className="board-brand">SOPT 게시판</Link>
            <span className="board-part">{part ?? '파트 미선택'}</span>
          </div>
          <nav aria-label="게시판 메뉴">
            <NavLink to="/posts" end>게시글 목록</NavLink>
            <NavLink to="/posts/new">글쓰기</NavLink>
            <button type="button" onClick={handleLogout}>로그아웃</button>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
