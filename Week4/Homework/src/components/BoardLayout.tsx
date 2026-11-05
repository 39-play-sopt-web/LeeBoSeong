import { Link, NavLink, Outlet } from 'react-router';

export default function BoardLayout() {
  return (
    <>
      <header className="board-header">
        <div className="board-header-inner">
          <div>
            <Link to="/posts" className="board-brand">SOPT 게시판</Link>
            <span className="board-part">파트 미선택</span>
          </div>
          <nav aria-label="게시판 메뉴">
            <NavLink to="/posts" end>게시글 목록</NavLink>
            <NavLink to="/posts/new">글쓰기</NavLink>
            <Link to="/auth">로그아웃</Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
