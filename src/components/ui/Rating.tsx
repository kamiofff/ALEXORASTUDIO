import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  size?: number;
}

export function Rating({ value, size = 16 }: RatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < value ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}
        />
      ))}
    </div>
  );
}
