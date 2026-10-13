import { classNames, formatPrice, calcDiscountPercent } from '@/lib/format';

interface PriceProps {
  amount: number;
  originalAmount?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
};

export function Price({ amount, originalAmount, currency = 'INR', size = 'md', className }: PriceProps) {
  const hasDiscount = originalAmount && originalAmount > amount;
  const discount = hasDiscount ? calcDiscountPercent(originalAmount, amount) : 0;

  return (
    <div className={classNames('flex items-baseline gap-2 tabular-nums', className)}>
      <span className={classNames('font-semibold text-ink', sizeMap[size])}>
        {formatPrice(amount, currency)}
      </span>
      {hasDiscount && (
        <>
          <span className={classNames('text-ink-faint line-through', sizeMap[size === 'lg' ? 'md' : 'sm'])}>
            {formatPrice(originalAmount, currency)}
          </span>
          <span className="text-xs font-semibold text-error">
            {discount}% off
          </span>
        </>
      )}
    </div>
  );
}
