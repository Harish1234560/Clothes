import { money, type Product } from '../data/products';

export default function Price({ product: p, size = 'md' }: { product: Product; size?: 'md' | 'lg' }) {
  const d = size === 'lg';
  return (
    <span className={`st-pricebox ${size}`}>
      <span className={`st-price${p.oldPrice ? ' sale' : ''}`}>{money(p.price, d)}</span>
      {p.oldPrice && <s className="st-old">{money(p.oldPrice, d)}</s>}
      {p.oldPrice && !d && <em className="st-pill">Sale</em>}
    </span>
  );
}
