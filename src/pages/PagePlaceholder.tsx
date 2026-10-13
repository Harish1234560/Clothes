import { type ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

interface PagePlaceholderProps {
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  children?: ReactNode;
}

export function PagePlaceholder({ title, description, breadcrumbs, children }: PagePlaceholderProps) {
  return (
    <div className="container-shell pt-32 pb-128">
      <Breadcrumbs items={breadcrumbs} className="mb-8" />
      <div className="flex flex-col items-center text-center">
        <p className="label-eyebrow mb-4 text-accent">{title}</p>
        {description && <p className="max-w-md text-ink-soft mb-8">{description}</p>}
        {children || (
          <EmptyState
            title="Coming in the next phase"
            description="This page will be fully built in an upcoming phase with real data, filters, and interactive features."
            action={
              <a href="/">
                <Button variant="outline" size="md">Back to Home</Button>
              </a>
            }
          />
        )}
      </div>
    </div>
  );
}
