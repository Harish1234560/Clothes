import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import Reveal from '../components/Reveal';
import { ArrowIcon, ArrowUpRightIcon, AwardIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons';
import { categories, FREE_SHIPPING_OVER, getProduct, money, products, type Product } from '../data/products';

const pick = (slugs: string[]) => slugs.map(getProduct).filter((p): p is Product => Boolean(p));

const heroPieces = pick(['dark-brown-leather-biker-jacket', 'camel-wool-trench-coat', 'tan-leather-chelsea-boots']);
const collection = pick(['cream-oversized-hoodie', 'olive-puffer-vest', 'olive-cargo-pants', 'red-and-black-flannel-shirt']);
const sideCards = pick(['camel-wool-trench-coat', 'olive-bomber-jacket']);
const leather = getProduct('dark-brown-leather-biker-jacket');

const features = [
  { icon: <TruckIcon size={26} />, title: 'Free Shipping', text: `On orders over ${money(FREE_SHIPPING_OVER)}` },
  { icon: <ReturnIcon size={26} />, title: 'Easy Returns', text: '30-day return policy' },
  { icon: <ShieldIcon size={26} />, title: 'Secure Payment', text: '100% secure checkout' },
  { icon: <AwardIcon size={26} />, title: 'Premium Quality', text: 'Curated menswear' },
];

const editorial = [
  {
    roman: 'I',
    name: 'Curated',
    slug: 'camel-wool-trench-coat',
    blurb: 'Hand-picked tailoring and outerwear built for sharp silhouettes and effortless layering.',
  },
  {
    roman: 'II',
    name: 'Modern',
    slug: 'beige-linen-shirt',
    blurb: 'Modern silhouettes that look as good in motion as on the rack, never dated, never loud.',
  },
  {
    roman: 'III',
    name: 'Considered',
    slug: 'tan-leather-chelsea-boots',
    blurb: 'Artisanal footwear and durable staples crafted from premium materials made to last.',
  },
];

export default function HomePage() {
  const [active, setActive] = useState(3);
  const [activeEd, setActiveEd] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % collection.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const bestSellers = products.filter((p) => p.tags.includes('bestseller')).slice(0, 8);

  return (
    <PageShell
      title="STORE | Premium Menswear & Curated Wardrobe"
      description="Shop STORE for premium menswear, outerwear, jackets, fine shirts, denim and footwear crafted with honest fabrics for the modern gentleman."
      home
    >
      <section className="st-hero">
        <div className="st-wrap st-hero-in">
          <div className="st-hero-copy">
            <p className="st-label spaced">New collection {new Date().getFullYear()}</p>
            <h1 className="st-hero-title">
              <span className="thin">Elevate</span>
              <span className="bold">Your <i>Style</i></span>
            </h1>
            <p className="st-lead">Timeless pieces, hand-picked for the modern gentleman. Premium labels, distinctive style.</p>
            <div className="st-row">
              <Link className="st-btn primary" to="/shop">Shop Now <ArrowIcon size={18} /></Link>
              <Link className="st-btn ghost" to="/new-arrivals">New Arrivals</Link>
            </div>
          </div>
          <div className="st-hero-stage" aria-hidden="true">
            {heroPieces.map((p, i) => (
              <div key={p.slug} className={`st-hero-piece p${i}`}><ProductImage product={p} /></div>
            ))}
          </div>
        </div>
      </section>

      <div className="st-wrap">
        <Reveal>
          <div className="st-features">
            {features.map((f) => (
              <div className="st-feature" key={f.title}>
                {f.icon}
                <div><h3>{f.title}</h3><p>{f.text}</p></div>
              </div>
            ))}
          </div>
        </Reveal>

        <section className="st-section">
          <Reveal>
            <div className="st-head">
              <div>
                <p className="st-label">Find your style</p>
                <h2 className="st-h2">Shop by <b>Category</b></h2>
              </div>
              <Link to="/shop" className="st-link">View All <ArrowIcon size={16} /></Link>
            </div>
          </Reveal>
          <div className="st-cats">
            {categories.map((c, i) => {
              const t = products.find((p) => p.category === c.slug);
              return (
                <Reveal key={c.slug} delay={i * 60}>
                  <Link to={`/category/${c.slug}`} className="st-cat">
                    <div className="img">{t && <ProductImage product={t} />}</div>
                    <span>{c.name}</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="st-section">
          <Reveal>
            <div className="st-landed">
              {leather && (
                <Link to={`/products/${leather.slug}`} className="st-big">
                  <ProductImage product={leather} />
                  <div className="st-big-copy">
                    <p className="st-label">Just dropped</p>
                    <h3>The Spring <b>Edit</b></h3>
                  </div>
                </Link>
              )}
              <div className="st-landed-side">
                <div>
                  <p className="st-label">New arrivals</p>
                  <h2 className="st-h2">Refined essentials for <b>the season ahead</b></h2>
                  <p className="st-lead">Each piece in our edit is chosen with intention: premium labels, considered details, lasting style.</p>
                  <Link to="/new-arrivals" className="st-link">View All New Arrivals <ArrowUpRightIcon size={16} /></Link>
                </div>
                <div className="st-side-grid">
                  {sideCards.map((p) => <ProductCard key={p.slug} product={p} />)}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="st-section">
          <Reveal>
            <div className="st-head" style={{ marginBottom: 14 }}>
              <div>
                <p className="st-label">Most popular</p>
                <h2 className="st-h2">Best <b>Sellers</b></h2>
              </div>
              <Link to="/shop" className="st-link">View All <ArrowIcon size={16} /></Link>
            </div>
            <p className="st-lead" style={{ textAlign: 'center', margin: '0 auto 30px', maxWidth: 460, fontSize: 14, color: 'var(--st-mute)' }}>
              Fresh arrivals picked for the season, built for style and comfort that lasts.
            </p>
          </Reveal>
          <div className="st-grid c4">
            {bestSellers.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 80}><ProductCard product={p} /></Reveal>
            ))}
          </div>
        </section>

        <section className="st-section">
          <Reveal>
            <div className="st-head">
              <div>
                <p className="st-label">Our obsessions</p>
                <h2 className="st-h2">The <b>Editorial</b></h2>
              </div>
              <Link to="/shop" className="st-link">View All <ArrowIcon size={16} /></Link>
            </div>
          </Reveal>
          <div className="st-ed-grid" onMouseLeave={() => setActiveEd(null)}>
            {editorial.map((e, i) => {
              const p = getProduct(e.slug);
              if (!p) return null;
              const isExpanded = activeEd === i;
              return (
                <Reveal
                  key={e.name}
                  delay={i * 100}
                  className={`st-ed-col${isExpanded ? ' expanded' : ''}`}
                >
                  <article
                    className={`st-ed${isExpanded ? ' mid' : ''}`}
                    onMouseEnter={() => setActiveEd(i)}
                    onFocus={() => setActiveEd(i)}
                    tabIndex={0}
                    role="region"
                    aria-label={`Edit ${e.roman}: ${e.name}`}
                  >
                    <span className="st-roman">{e.roman}</span>
                    <div className="st-ed-img"><ProductImage product={p} /></div>
                    <p className="st-label" style={{ position: 'relative' }}>Edit {e.roman}</p>
                    <h3 className="st-ed-name">{e.name}</h3>
                    <div className="st-ed-expanded">
                      <p className="st-ed-blurb">{e.blurb}</p>
                      <div className="st-ed-foot">
                        <div><small>SHOWN HERE</small>{p.name}</div>
                        <Link to={`/products/${p.slug}`} className="st-link">SHOP <ArrowUpRightIcon size={16} /></Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="st-section">
          <Reveal>
            <div className="st-head">
              <div>
                <p className="st-label" style={{ marginBottom: 6, color: '#e28842', letterSpacing: '0.22em' }}>SUMMER SELECTION</p>
                <h2 className="st-h2" style={{ margin: 0 }}>Shop the <b>Collection</b></h2>
              </div>
              <Link to="/shop" className="st-link">View All <ArrowIcon size={16} /></Link>
            </div>
          </Reveal>
          <Reveal>
            <div className="st-acc" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              {collection.map((p, i) => (
                <div
                  key={p.slug}
                  className={`st-acc-item${i === active ? ' on' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={p.name}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <ProductImage product={p} />
                  <span className="st-acc-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="st-acc-info">
                    <div>
                      <small>{String(i + 1).padStart(2, '0')} / {String(collection.length).padStart(2, '0')}</small>
                      <h3>{p.name}</h3>
                    </div>
                    <Link to={`/products/${p.slug}`} className="st-acc-go" aria-label={`View ${p.name}`}><ArrowIcon size={20} /></Link>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </div>
    </PageShell>
  );
}
