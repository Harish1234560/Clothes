import { Link, type LinkProps } from 'react-router-dom';
import { classNames } from '@/lib/format';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={classNames('flex items-center gap-2 text-sm text-ink-faint', className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="hover:text-accent transition-colors duration-300"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-ink-soft' : ''}>{item.label}</span>
            )}
            {!isLast && <span className="text-ink-faint/50">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
