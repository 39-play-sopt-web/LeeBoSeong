interface MovieBase {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieSummary extends MovieBase {
  adult: boolean;
  genre_ids: number[];
  popularity: number;
  video: boolean;
}

export interface MovieListResponse {
  page: number;
  results: MovieSummary[];
  total_pages: number;
  total_results: number;
}

export interface MovieGenre {
  id: number;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieDetail extends MovieBase {
  genres: MovieGenre[];
  runtime: number | null;
  status: string;
  budget: number;
  revenue: number;
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

export interface RatingRange {
  min?: number;
  max?: number;
}

export type RatingFilterId = 'all' | '9-up' | '8-9' | '7-8' | '6-7' | '6-down';

export interface MovieListOptions {
  page?: number;
  rating?: RatingRange;
}
