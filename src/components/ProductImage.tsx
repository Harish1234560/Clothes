import { useState } from 'react';
import type { Product } from '../data/products';

export default function ProductImage({ product, className, image = product.image, alt = product.name }: {
  product: Product;
  className?: string;
  image?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`st-ph ${className ?? ''}`} style={{ background: `radial-gradient(circle at 50% 38%, ${product.tint}, #151518)` }} role="img" aria-label={alt}>
        <span>{product.name.split(' ').slice(-1)[0]}</span>
      </div>
    );
  }
  return <img className={className} src={image} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
