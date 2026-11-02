import type { RatingFilterId, RatingRange } from '../types/movie';

interface RatingFilterOption {
  id: RatingFilterId;
  label: string;
  range: RatingRange;
}

const DEFAULT_RATING_FILTER: RatingFilterOption = { id: 'all', label: '전체', range: {} };

export const RATING_FILTERS: RatingFilterOption[] = [
  DEFAULT_RATING_FILTER,
  { id: '9-up', label: '9점 이상', range: { min: 9 } },
  { id: '8-9', label: '8~9점', range: { min: 8, max: 9 } },
  { id: '7-8', label: '7~8점', range: { min: 7, max: 8 } },
  { id: '6-7', label: '6~7점', range: { min: 6, max: 7 } },
  { id: '6-down', label: '6점 이하', range: { max: 6 } },
];

export function getRatingFilter(id: RatingFilterId): RatingFilterOption {
  return RATING_FILTERS.find((option) => option.id === id) ?? DEFAULT_RATING_FILTER;
}
