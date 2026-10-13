import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { ArrowIcon } from '../components/Icons';
import PageShell from '../components/PageShell';
import ProductImage from '../components/ProductImage';
import { FREE_SHIPPING_OVER, getProduct, money, products, type Product } from '../data/products';

const showcase = ['camel-wool-trench-coat', 'olive-bomber-jacket', 'tan-leather-chelsea-boots', 'rust-corduroy-baseball-cap']
  .map(getProduct)
  .filter((p): p is Product => Boolean(p));

const values = [
  { t: 'Considered design', d: 'Every piece is chosen for fit, fabric and how well it works with the rest of your wardrobe.' },
  { t: 'Honest materials', d: 'Wool, leather, cotton and linen from trusted mills, described plainly on every product page.' },
  { t: 'Made to last', d: 'We favour reinforced seams and finishes that age well, so you buy less and wear more.' },
];

export default function AboutPage() {
  return (
    <PageShell
      title="About Us | Our Story & Craft | STORE Menswear"
      description="Learn about STORE: A curated menswear label built around timeless coats, shirts, denim, boots and craftsmanship that stands the test of time."
    >
      <div className="st-wrap">
        <Breadcrumbs items={[{ label: 'About' }]} />
        <div className="st-story">
          <div>
            <p className="st-label">Our story</p>
            <h1 className="st-h2">Menswear that is <b>quietly confident</b></h1>
            <p className="st-lead">STORE is a curated menswear label built around timeless pieces: coats, shirts, denim, boots and the finishing touches that complete a look.</p>
            <p className="st-lead">We keep the range small on purpose. Fewer, better pieces that move easily from work to weekends and stay in your wardrobe for years.</p>
            <Link to="/shop" className="st-btn primary">Shop the collection <ArrowIcon size={18} /></Link>
          </div>
          <div className="st-story-img">
            {showcase.map((p) => <div key={p.slug}><ProductImage product={p} /></div>)}
          </div>
        </div>

        <div className="st-stats">
          <div className="st-stat"><b>{products.length}</b><span>Curated pieces</span></div>
          <div className="st-stat"><b>7</b><span>Categories</span></div>
          <div className="st-stat"><b>30</b><span>Day returns</span></div>
          <div className="st-stat"><b>{money(FREE_SHIPPING_OVER)}</b><span>Free shipping over</span></div>
        </div>

        <div className="st-values">
          {values.map((v) => (
            <div className="st-value" key={v.t}><h3>{v.t}</h3><p>{v.d}</p></div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
