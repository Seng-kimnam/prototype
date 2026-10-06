import { StarIcon, StarOutline } from './icons.jsx';

export function Rating({ value, reviews, className = '', showCount = true, size = 'h-4 w-4' }) {
  const rating = Number(value) || 0;
  const filled = Math.round(rating);

  return (
    <div className={`flex items-center gap-1.5 text-[#a96900] ${className}`}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) =>
          index < filled ? (
            <StarIcon key={index} className={size} />
          ) : (
            <StarOutline key={index} className={`${size} opacity-45`} />
          ),
        )}
      </span>
      <span className="text-[13px] font-bold">{rating.toFixed(1)}</span>
      {showCount && reviews ? <span className="text-xs text-muted">({reviews.toLocaleString('en-US')})</span> : null}
      <span className="sr-only">{`Rated ${rating.toFixed(1)} out of 5`}</span>
    </div>
  );
}