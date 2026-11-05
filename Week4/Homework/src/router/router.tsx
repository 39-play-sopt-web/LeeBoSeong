import { createBrowserRouter, Link, Navigate } from 'react-router';
import BoardLayout from '../components/BoardLayout';
import AuthPage from '../pages/AuthPage';
import PostCreatePage from '../pages/PostCreatePage';
import PostDetailPage from '../pages/PostDetailPage';
import PostListPage from '../pages/PostListPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/auth" replace /> },
  { path: '/auth', Component: AuthPage },
  {
    Component: BoardLayout,
    children: [
      { path: '/posts', Component: PostListPage },
      { path: '/posts/new', Component: PostCreatePage },
      { path: '/posts/:postId', Component: PostDetailPage },
    ],
  },
  {
    path: '*',
    element: (
      <main>
        <h1>페이지를 찾을 수 없습니다.</h1>
        <Link to="/posts">게시글 목록으로 돌아가기</Link>
      </main>
    ),
  },
]);
