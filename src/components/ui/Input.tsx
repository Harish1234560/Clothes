import { forwardRef, type InputHTMLAttributes } from 'react';
import { classNames } from '@/lib/format';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="label-eyebrow text-ink-soft">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={classNames(
            'w-full rounded-12 border bg-bg-1 px-4 py-3 text-body text-ink placeholder:text-ink-faint',
            'transition-all duration-300 ease-premium',
            'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
            error ? 'border-error' : 'border-line',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        {hint && !error && <p className="text-sm text-ink-faint">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
