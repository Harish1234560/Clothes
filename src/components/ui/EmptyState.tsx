import type { ReactNode } from 'react';
import { Library } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
      <div className="text-ink-faint">
        {icon || <Library className="w-12 h-12" strokeWidth={1} />}
      </div>
      <h3 className="text-h3 font-serif text-ink">{title}</h3>
      {description && <p className="max-w-md text-ink-soft">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
