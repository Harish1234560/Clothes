import type { ReactNode } from 'react';
import { classNames } from '@/lib/format';

type BadgeVariant = 'new' | 'bestseller' | 'sale' | 'default' | 'success' | 'error';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  new: 'bg-accent text-accent-ink',
  bestseller: 'bg-success text-white',
  sale: 'bg-error text-white',
  default: 'bg-bg-2 text-ink-soft border border-line',
  success: 'bg-success/10 text-success border border-success/20',
  error: 'bg-error/10 text-error border border-error/20',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
