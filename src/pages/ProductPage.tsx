import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { ArrowIcon, CheckIcon, HangerIcon, HeartIcon, LinkIcon, MinusIcon, PlusIcon, StarIcon } from '../components/Icons';
import PageShell from '../components/PageShell';
import Price from '../components/Price';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import { byCategory, categoryName, getProduct, products, type Product } from '../data/products';
import { useShop } from '../store/shop';

export default function ProductPage() {
  const { slug } = useParams();
  const product = slug ? getProduct(slug) : undefined;

  if (!product) {
    return (
      <PageShell title="Product not found">
        <div className="st-wrap">
          <div className="st-empty">
            <h2>Product not found</h2>
            <p>This product may have been removed or the link is wrong.</p>
            <Link to="/shop" className="st-btn primary">Back to shop <ArrowIcon size={18} /></Link>
          </div>
        </div>
      </PageShell>
    );
  }
  return <ProductView key={product.slug} product={product} />;
}

function ProductView({ product: p }: { product: Product }) {
  const navigate = useNavigate();
  const addToCart = useShop((s) => s.addToCart);
  const wished = useShop((s) => s.wishlist.includes(p.slug));
  const inFit = useShop((s) => s.fitting.includes(p.slug));
  const toggleWishlist = useShop((s) => s.toggleWishlist);
  const toggleFitting = useShop((s) => s.toggleFitting);

  const [color, setColor] = useState(p.colors[0].name);
  const [size, setSize] = useState(p.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const related = [...byCategory(p.category).filter((x) => x.slug !== p.slug), ...products.filter((x) => x.category !== p.category)].slice(0, 4);

  const add = () => {
    addToCart({ slug: p.slug, color, size, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  const buyNow = () => {
    addToCart({ slug: p.slug, color, size, qty });
    navigate('/checkout');
  };
  const openFittingRoom = () => {
    if (!inFit) toggleFitting(p.slug);
    window.dispatchEvent(new Event('store:open-fitting-room'));
  };
  const copy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const enc = encodeURIComponent;

  return (
    <PageShell
      title={`${p.name} | STORE Menswear`}
      description={`${p.description} Available in multiple sizes and premium finishes with fast shipping.`}
    >
      <div className="st-wrap">
        <Breadcrumbs items={[{ label: 'Shop', to: '/shop' }, { label: categoryName(p.category), to: `/category/${p.category}` }, { label: p.name }]} />

        <div className="st-pd">
          <div className="st-pd-media">
            <div className="st-pd-tools">
              <button type="button" className={`st-round${wished ? ' on' : ''}`} aria-pressed={wished} aria-label="Wishlist" onClick={() => toggleWishlist(p.slug)}><HeartIcon size={18} filled={wished} /></button>
              <button type="button" className={`st-round${inFit ? ' accent' : ''}`} aria-pressed={inFit} title={inFit ? 'Open the fitting room' : 'Try it on'} aria-label="Try it on" onClick={openFittingRoom}><HangerIcon size={18} /></button>
            </div>
            {off > 0 && <span className="st-off">{off}% Off</span>}
            <ProductImage product={p} />
          </div>

          <div>
            <div className="st-pd-top">
              <div>
                <p className="st-label">{categoryName(p.category)}</p>
                <h1 className="st-pd-title">{p.name}</h1>
              </div>
              <div className="st-share">
                <span>Share on</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">f</a>
                <a href={`https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(p.name)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">X</a>
                <a href={`https://wa.me/?text=${enc(`${p.name} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">W</a>
                <button type="button" onClick={copy} aria-label="Copy link">{copied ? <CheckIcon size={15} /> : <LinkIcon size={15} />}</button>
              </div>
            </div>

            <p className="st-desc">{p.description}</p>
            <div className="st-stars" aria-label={`Rated ${p.rating} out of 5`}>
              {[1, 2, 3, 4, 5].map((n) => <StarIcon key={n} size={17} filled={n <= Math.round(p.rating)} />)}
              <span>({p.reviews} Reviews)</span>
            </div>

            <hr className="st-hr" />
            <Price product={p} size="lg" />
            <p className="st-tax">Inclusive of all taxes</p>
            <hr className="st-hr" />

            <p className="st-opt-label">Choose a Color <span>{color}</span></p>
            <div className="st-swatches">
              {p.colors.map((c) => (
                <button type="button" key={c.name} className={`st-swatch${color === c.name ? ' on' : ''}`} onClick={() => setColor(c.name)} aria-label={c.name} aria-pressed={color === c.name}>
                  <i style={{ background: c.hex }} />
                </button>
              ))}
            </div>

            <p className="st-opt-label" style={{ marginTop: 24 }}>Select Size</p>
            <div className="st-sizes">
              {p.sizes.map((s) => (
                <button type="button" key={s} className={`st-size${size === s ? ' on' : ''}`} onClick={() => setSize(s)} aria-pressed={size === s}>{s}</button>
              ))}
            </div>

            <hr className="st-hr" />
            <div className="st-qtyrow">
              <div className="st-qty">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity"><MinusIcon size={16} /></button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} disabled={qty >= 10} aria-label="Increase quantity"><PlusIcon size={16} /></button>
              </div>
              <span className="st-stock">In stock and ready to ship</span>
            </div>

            <div className="st-pd-actions">
              <button type="button" className="st-btn primary" onClick={add}>{added ? <><CheckIcon size={18} /> Added</> : 'Add to Cart'}</button>
              <button type="button" className="st-btn ghost" onClick={buyNow}>Buy Now</button>
            </div>
            {added && <p className="st-note"><Link to="/cart" style={{ color: 'var(--st-accent)', fontWeight: 600 }}>View cart</Link> to review your items.</p>}
          </div>
        </div>

        <div className="st-sections">
          <section>
            <h3>Product Description</h3>
            <p>{p.description}</p>
          </section>
          <section>
            <h3>Benefits</h3>
            <ul className="st-checklist">{p.benefits.map((b) => <li key={b}><CheckIcon size={16} />{b}</li>)}</ul>
          </section>
          <section>
            <h3>Product Details</h3>
            <ul className="st-checklist">
              <li><CheckIcon size={16} />Category: {categoryName(p.category)}</li>
              <li><CheckIcon size={16} />Reference: {p.details.reference}</li>
              <li><CheckIcon size={16} />Approximate weight: {p.details.weight}</li>
              <li><CheckIcon size={16} />Primary materials: {p.details.material.toLowerCase()}</li>
              <li><CheckIcon size={16} />Imported. Model is 186 cm and wears size M.</li>
            </ul>
          </section>
          <section>
            <h3>Care Instructions</h3>
            <ul className="st-checklist">{p.care.map((c) => <li key={c}><CheckIcon size={16} />{c}</li>)}</ul>
          </section>
        </div>

        <section className="st-section">
          <div className="st-head"><h2 className="st-h2">You May <b>Also Like</b></h2></div>
          <div className="st-grid c4">{related.map((r) => <ProductCard key={r.slug} product={r} />)}</div>
        </section>
      </div>
    </PageShell>
  );
}
