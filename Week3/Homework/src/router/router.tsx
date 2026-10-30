import { createBrowserRouter } from 'react-router';
import AppLayout from '../components/AppLayout';
import MovieDetailPage from '../pages/MovieDetailPage';
import MovieListPage from '../pages/MovieListPage';
import NotFoundPage from '../pages/NotFoundPage';
import ErrorPage from '../pages/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: MovieListPage },
      { path: 'movies/:movieId', Component: MovieDetailPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
