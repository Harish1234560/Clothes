import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { useShop } from '../store/shop';
import { BagPlusIcon, CheckIcon, HangerIcon, HeartIcon, StarIcon } from './Icons';
import Price from './Price';
import ProductImage from './ProductImage';

export default function ProductCard({ product: p }: { product: Product }) {
  const wished = useShop((s) => s.wishlist.includes(p.slug));
  const inFittingRoom = useShop((s) => s.fitting.includes(p.slug));
  const toggleWishlist = useShop((s) => s.toggleWishlist);
  const toggleFitting = useShop((s) => s.toggleFitting);
  const addToCart = useShop((s) => s.addToCart);
  const [added, setAdded] = useState(false);
  const [showWearingImage, setShowWearingImage] = useState(false);
  const lastTap = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setShowWearingImage((current) => !current);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [p.slug]);

  const changeImageOnDoubleTap = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'touch' && event.pointerType !== 'mouse') return;
    const now = Date.now();
    if (now - lastTap.current < 350) {
      setShowWearingImage((current) => !current);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  const quickAdd = () => {
    addToCart({ slug: p.slug, color: p.colors[0].name, size: p.sizes[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const openFittingRoom = () => {
    toggleFitting(p.slug);
    window.dispatchEvent(new Event('store:open-fitting-room'));
  };

  return (
    <article className={`st-card${added ? ' is-added' : ''}`}>
      <Link to={`/products/${p.slug}`} className="st-card-link" aria-label={p.name} />
      <div className="st-card-top">
        <div className="st-card-tools">
          <button type="button" className={`st-round${wished ? ' on' : ''}`} aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => toggleWishlist(p.slug)}>
            <HeartIcon size={18} filled={wished} />
          </button>
          <button type="button" className={`st-round${inFittingRoom ? ' accent' : ''}`} aria-pressed={inFittingRoom} aria-label={inFittingRoom ? `Remove ${p.name} from fitting room` : `Try ${p.name} on`} title={inFittingRoom ? 'In your fitting room' : 'Try it on'} onClick={openFittingRoom}>
            <HangerIcon size={18} />
          </button>
        </div>
        <span className="st-rating"><StarIcon size={12} /> {p.rating.toFixed(1)}</span>
      </div>
      <button
        className={`st-card-img${showWearingImage ? ' is-wearing' : ''}`}
        type="button"
        aria-label={`Double tap or double-click to switch to ${showWearingImage ? 'the product photo' : 'the styled model photo'} for ${p.name}`}
        aria-pressed={showWearingImage}
        title="Photos switch automatically. Double-tap or double-click to switch now."
        onPointerDown={changeImageOnDoubleTap}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setShowWearingImage((current) => !current);
          }
        }}
      >
        <ProductImage
          key={showWearingImage ? p.wearingImage : p.image}
          product={p}
          className="st-card-photo"
          image={showWearingImage ? p.wearingImage : p.image}
          alt={showWearingImage ? `Styled model look for ${p.name}` : p.name}
        />
      </button>
      <div className="st-card-bottom">
        <div>
          <p className="st-card-name">{p.name}</p>
          <Price product={p} />
        </div>
        <button type="button" className="st-bag" onClick={quickAdd} aria-label={`Add ${p.name} to cart`}>
          {added ? <CheckIcon size={22} /> : <BagPlusIcon size={22} />}
        </button>
      </div>
      <span className="st-corner" aria-hidden="true" />
    </article>
  );
}
