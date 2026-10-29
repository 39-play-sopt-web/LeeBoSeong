import { RATING_FILTERS } from '../constants/ratingFilters';
import type { RatingFilterId } from '../types/movie';

interface RatingFilterProps {
  selected: RatingFilterId;
  onSelect: (id: RatingFilterId) => void;
}

export default function RatingFilter({ selected, onSelect }: RatingFilterProps) {
  return (
    <fieldset className="mt-8" aria-describedby="rating-filter-description">
      <legend className="text-sm font-semibold">평점으로 골라보기</legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {RATING_FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected === option.id}
            onClick={() => onSelect(option.id)}
            className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
              selected === option.id
                ? 'border-accent bg-accent text-canvas'
                : 'border-line bg-surface text-muted hover:border-accent/60 hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p id="rating-filter-description" className="mt-3 text-xs leading-6 text-muted">
        범위의 양 끝 평점을 포함해요. 경계에 있는 영화는 두 범위에서 볼 수 있어요.
      </p>
    </fieldset>
  );
}
