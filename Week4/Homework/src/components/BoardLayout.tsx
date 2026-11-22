import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';

export default function BoardLayout() {
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();
  const isRedirecting = useRef(false);

  useEffect(() => {
    if (session?.authorizationCode || isRedirecting.current) return;

    isRedirecting.current = true;
    window.alert('게시판을 이용하려면 회원 코드를 먼저 발급받아 주세요.');
    void navigate('/auth', { replace: true });
  }, [session, navigate]);

  function handleLogout() {
    isRedirecting.current = true;
    clearSession();
    void navigate('/auth', { replace: true });
  }

  if (!session?.authorizationCode) {
    return null;
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
