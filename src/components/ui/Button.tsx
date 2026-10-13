import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { classNames } from '@/lib/format';

type Variant = 'primary' | 'ghost' | 'link' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const sizes: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-xs',
  md: 'px-7 py-3.5 text-sm',
  lg: 'px-9 py-4 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props }, ref) => {
    const base = 'relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 ease-premium active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent';

    const variants: Record<Variant, string> = {
      primary: 'btn-sweep bg-accent text-accent-ink font-semibold hover:text-accent-ink shadow-gold',
      ghost: 'bg-transparent text-ink hover:bg-bg-2 border border-line',
      outline: 'bg-transparent text-ink border border-ink/20 hover:border-accent hover:text-accent',
      link: 'bg-transparent text-accent underline-offset-4 hover:underline px-0 py-0',
    };

    return (
      <button
        ref={ref}
        className={classNames(base, sizes[size], variants[variant], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
