import { Link } from 'react-router-dom';
import { HomeIcon } from './Icons';

export type Crumb = { label: string; to?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="st-crumbs" aria-label="Breadcrumb">
      <Link to="/" aria-label="Home"><HomeIcon size={16} /></Link>
      {items.map((c, i) => (
        <span key={c.label} style={{ display: 'contents' }}>
          <span aria-hidden="true">›</span>
          {c.to && i < items.length - 1 ? <Link to={c.to}>{c.label}</Link> : <strong aria-current="page">{c.label}</strong>}
        </span>
      ))}
    </nav>
  );
}
