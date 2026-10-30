import axios from 'axios';

export const tmdbClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    'https://api.themoviedb.org/3',
  timeout: 10_000,
  params: {
    api_key: import.meta.env.VITE_API_KEY?.trim(),
    language: 'ko-KR',
  },
});
