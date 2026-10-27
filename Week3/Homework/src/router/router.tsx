import { createBrowserRouter } from 'react-router';
import AppLayout from '../components/AppLayout';
import MovieDetailPage from '../pages/MovieDetailPage';
import MovieListPage from '../pages/MovieListPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: MovieListPage },
      { path: 'movies/:movieId', Component: MovieDetailPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
