import axios from 'axios';

export class ApiConfigurationError extends Error {
  constructor() {
    super('TMDB API 키가 없어요. .env의 VITE_API_KEY를 설정해 주세요.');
    this.name = 'ApiConfigurationError';
  }
}

const apiKey = import.meta.env.VITE_API_KEY?.trim();

export const tmdbClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    'https://api.themoviedb.org/3',
  timeout: 10_000,
  params: {
    api_key: apiKey,
    language: 'ko-KR',
  },
});

tmdbClient.interceptors.request.use((config) => {
  if (!apiKey) {
    throw new ApiConfigurationError();
  }

  return config;
});
