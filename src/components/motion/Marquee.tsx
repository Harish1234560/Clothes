import type { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  className?: string;
}

export function Marquee({ children, className }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className || ''}`}>
      <div className="marquee-track">
        <div className="flex shrink-0 items-center gap-12">{children}</div>
        <div className="flex shrink-0 items-center gap-12" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
