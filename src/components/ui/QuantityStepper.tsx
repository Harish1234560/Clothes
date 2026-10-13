import { useState, type ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';
import { classNames } from '@/lib/format';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function QuantityStepper({ value, min = 1, max = 99, onChange, className }: QuantityStepperProps) {
  const [local, setLocal] = useState(value);

  const update = (v: number) => {
    const clamped = Math.max(min, Math.min(max, v));
    setLocal(clamped);
    onChange(clamped);
  };

  return (
    <div className={classNames('inline-flex items-center rounded-full border border-line bg-bg-1', className)}>
      <button
        onClick={() => update(local - 1)}
        disabled={local <= min}
        className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:text-accent disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums text-ink">
        {local}
      </span>
      <button
        onClick={() => update(local + 1)}
        disabled={local >= max}
        className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:text-accent disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
