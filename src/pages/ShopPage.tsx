import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { ArrowIcon, CloseIcon, FilterIcon, ReturnIcon, SearchIcon, StarIcon } from '../components/Icons';
import PageShell from '../components/PageShell';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import { categories, MAX_PRODUCT_PRICE_INR, money, products, type Product } from '../data/products';

type Mode = 'all' | 'new' | 'sale' | 'category';

const MAX = MAX_PRODUCT_PRICE_INR;

const sorts: Array<[string, string]> = [
  ['newest', 'Newest'],
  ['price-asc', 'Price: Low to High'],
  ['price-desc', 'Price: High to Low'],
  ['rating', 'Top Rated'],
];

const slides = [
  { label: 'Cold weather', title: 'Coats for the season ahead', text: 'Wool overcoats and layers built for real winters.', cta: 'Shop outerwear', to: '/category/jackets-outerwear', bg: 'linear-gradient(110deg,#120f0d 35%,#6a4426 100%)' },
  { label: 'Wardrobe staples', title: 'Shirts for every day', text: 'Oxford, linen and flannel in honest fabrics.', cta: 'Shop shirts', to: '/category/shirts', bg: 'linear-gradient(110deg,#0f1114 35%,#3b4a5c 100%)' },
  { label: 'Now reduced', title: 'The finishing touches', text: 'Leather, silk and steel, selected pieces on sale.', cta: 'Shop the sale', to: '/sale', bg: 'linear-gradient(110deg,#120d0b 35%,#7a4a22 100%)' },
];

const newestRank = (p: Product) => (p.tags.includes('new') ? 1 : 0);

export default function ShopPage({ mode = 'all' }: { mode?: Mode }) {
  const [params, setParams] = useSearchParams();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const q = params.get('q') ?? '';
  const sort = params.get('sort') ?? 'newest';
  const catSlug = mode === 'category' ? slug : params.get('cat') ?? undefined;
  const min = Math.max(0, Number(params.get('min')) || 0);
  const max = Math.min(MAX, Number(params.get('max')) || MAX);
  const saleOnly = mode === 'sale' || params.get('sale') === 'true';
  const featured = params.get('featured') === 'true';
  const best = params.get('best') === 'true';
  const category = categories.find((c) => c.slug === catSlug);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const out = products.filter(
      (p) =>
        (!category || p.category === category.slug) &&
        (!saleOnly || p.oldPrice !== undefined) &&
        (!featured || p.tags.includes('featured')) &&
        (!best || p.tags.includes('bestseller')) &&
        p.price >= min &&
        p.price <= max &&
        (!t || p.name.toLowerCase().includes(t)),
    );
    if (sort === 'price-asc') out.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') out.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') out.sort((a, b) => b.rating - a.rating);
    else out.sort((a, b) => newestRank(b) - newestRank(a) || b.id - a.id);
    return out;
  }, [q, sort, category, saleOnly, featured, best, min, max]);

  const setParam = (k: string, v?: string) => {
    const n = new URLSearchParams(params);
    if (!v || v === 'false') n.delete(k);
    else n.set(k, v);
    setParams(n, { replace: true });
  };

  const chooseCat = (s?: string) => {
    if (mode === 'category') navigate(s ? `/category/${s}` : '/shop');
    else setParam('cat', s);
    setOpen(false);
  };

  const reset = () => {
    if (mode === 'category') navigate('/shop');
    else setParams({}, { replace: true });
  };

  if (mode === 'category' && !category) {
    return (
      <PageShell title="Category not found">
        <div className="st-wrap">
          <div className="st-empty">
            <h2>Category not found</h2>
            <p>We could not find that category.</p>
            <Link to="/shop" className="st-btn primary">Browse all products <ArrowIcon size={18} /></Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const title = mode === 'category' ? category!.name : mode === 'new' ? 'New Arrivals' : mode === 'sale' ? 'Sale' : 'All Products';
  const crumbs = mode === 'all' ? [{ label: 'Shop' }] : [{ label: 'Shop', to: '/shop' }, { label: title }];
  const lo = Math.min(min, max);

  return (
    <PageShell
      title={`${title} | Curated Menswear | STORE`}
      description={`Discover our premium selection of ${title.toLowerCase()}. Curated pieces crafted for longevity and modern distinction.`}
    >
      <div className="st-wrap">
        <Breadcrumbs items={crumbs} />

        <div className="st-banner">
          {slides.map((s, i) => (
            <div key={s.title} className={`st-slide${i === slide ? ' on' : ''}`} style={{ background: s.bg }} aria-hidden={i !== slide}>
              <p className="st-label">{s.label}</p>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
              <Link to={s.to} className="st-btn primary" tabIndex={i === slide ? 0 : -1}>{s.cta} <ArrowIcon size={18} /></Link>
            </div>
          ))}
          <div className="st-dots">
            {slides.map((s, i) => (
              <button key={s.title} type="button" className={`st-dot${i === slide ? ' on' : ''}`} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>

        <div className="st-shop-head">
          <h1>{title}<small>{list.length} product{list.length === 1 ? '' : 's'}</small></h1>
          <div className="st-row">
            <button type="button" className="st-btn ghost st-filter-toggle" onClick={() => setOpen(true)}><FilterIcon size={18} /> Filters</button>
            <select className="st-input st-sort" value={sort} onChange={(e) => setParam('sort', e.target.value === 'newest' ? '' : e.target.value)} aria-label="Sort products">
              {sorts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="st-shop">
          <div className={`st-scrim${open ? ' open' : ''}`} onClick={() => setOpen(false)} />
          <aside className={`st-filters${open ? ' open' : ''}`} aria-label="Filters">
            <div className="st-filter-head">
              <span>Filters</span>
              <span className="st-row" style={{ gap: 12 }}>
                <button type="button" className="st-reset" onClick={reset}><ReturnIcon size={14} /> Reset Filters</button>
                <button type="button" className="st-icon-btn st-filter-toggle" onClick={() => setOpen(false)} aria-label="Close filters"><CloseIcon size={18} /></button>
              </span>
            </div>

            <div className="st-search">
              <SearchIcon size={18} />
              <input className="st-input" placeholder="Search products..." value={q} onChange={(e) => setParam('q', e.target.value)} aria-label="Search products" />
            </div>

            <p className="st-filter-title">Category</p>
            <div className="st-catlist">
              <button type="button" className={!category ? 'on' : ''} onClick={() => chooseCat()}>
                <span className="th"><StarIcon size={16} /></span> All Categories
              </button>
              {categories.map((c) => {
                const t = products.find((p) => p.category === c.slug);
                return (
                  <button type="button" key={c.slug} className={category?.slug === c.slug ? 'on' : ''} onClick={() => chooseCat(c.slug)}>
                    <span className="th">{t && <ProductImage product={t} />}</span> {c.name}
                  </button>
                );
              })}
            </div>

            <p className="st-filter-title">Price range</p>
            <div className="st-dual">
              <div className="track" />
              <div className="fill" style={{ left: `${(lo / MAX) * 100}%`, width: `${((max - lo) / MAX) * 100}%` }} />
              <input type="range" min={0} max={MAX} step={100} value={lo} aria-label="Minimum price"
                onChange={(e) => { const v = Math.min(Number(e.target.value), max); setParam('min', v > 0 ? String(v) : ''); }} />
              <input type="range" min={0} max={MAX} step={100} value={max} aria-label="Maximum price"
                onChange={(e) => { const v = Math.max(Number(e.target.value), lo); setParam('max', v < MAX ? String(v) : ''); }} />
            </div>
            <div className="st-minmax">
              <input className="st-input" type="number" min={0} placeholder={`${money(0)} Min`} value={params.get('min') ?? ''} onChange={(e) => setParam('min', e.target.value)} aria-label="Minimum price in rupees" />
              <span>–</span>
              <input className="st-input" type="number" min={0} placeholder={`${money(MAX)} Max`} value={params.get('max') ?? ''} onChange={(e) => setParam('max', e.target.value)} aria-label="Maximum price in rupees" />
            </div>

            <p className="st-filter-title">Highlights</p>
            <div className="st-checks">
              <label><input type="checkbox" checked={saleOnly} disabled={mode === 'sale'} onChange={(e) => setParam('sale', String(e.target.checked))} /> On Sale</label>
              <label><input type="checkbox" checked={featured} onChange={(e) => setParam('featured', String(e.target.checked))} /> Featured</label>
              <label><input type="checkbox" checked={best} onChange={(e) => setParam('best', String(e.target.checked))} /> Best Sellers</label>
            </div>
          </aside>

          <section>
            {list.length === 0 ? (
              <div className="st-empty">
                <SearchIcon size={40} />
                <h2>No products found</h2>
                <p>Try changing or resetting your filters.</p>
                <button type="button" className="st-btn primary" onClick={reset}>Reset Filters</button>
              </div>
            ) : (
              <div className="st-grid">
                {list.map((p) => <ProductCard key={p.slug} product={p} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}
