import type { ReactNode } from 'react';
import '../styles/pages.css';
import useTitle from './useTitle';

export default function PageShell({
  title,
  description,
  home = false,
  children,
}: {
  title: string;
  description?: string;
  home?: boolean;
  children: ReactNode;
}) {
  useTitle(title, description);
  return <div className={`st-page${home ? ' is-home' : ''}`}>{children}</div>;
}
