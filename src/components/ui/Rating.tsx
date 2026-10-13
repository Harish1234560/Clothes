import { Star } from 'lucide-react';
import { classNames } from '@/lib/format';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function Rating({ value, count, size = 'sm', showCount = true, className }: RatingProps) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.25 && value - full < 0.75;
  const rounded = value - full >= 0.75 ? full + 1 : full;

  return (
    <div className={classNames('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < rounded;
          const half = i === rounded && hasHalf;
          return (
            <Star
              key={i}
              className={classNames(
                sizeMap[size],
                filled || half ? 'fill-accent text-accent' : 'fill-none text-ink-faint'
              )}
            />
          );
        })}
      </div>
      <span className="text-xs font-medium text-ink-soft tabular-nums">
        {value.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className="text-xs text-ink-faint tabular-nums">
          ({count})
        </span>
      )}
    </div>
  );
}
