import { Link } from 'react-router-dom';
import { ArrowIcon, SearchIcon } from '../components/Icons';
import PageShell from '../components/PageShell';
import { categories } from '../data/products';

export default function NotFoundPage() {
  return (
    <PageShell
      title="404 - Page Not Found | STORE Menswear"
      description="The page you are looking for cannot be found. Explore STORE menswear collections, new arrivals, or return to our homepage."
    >
      <div className="st-wrap">
        <div className="st-404">
          <b>404</b>
          <h1>This piece is not on our rack</h1>
          <p>The page you requested could not be found or may have been relocated.</p>
          
          <div className="st-row" style={{ justifyContent: 'center', marginBottom: 36 }}>
            <Link to="/" className="st-btn primary">
              Back to Home <ArrowIcon size={18} />
            </Link>
            <Link to="/shop" className="st-btn ghost">
              Browse All Products
            </Link>
          </div>

          <div style={{ maxWidth: 640, margin: '40px auto 0', padding: '24px', background: 'var(--st-card)', borderRadius: 24, border: '1px solid var(--st-line)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Popular Categories</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 99,
                    background: 'var(--st-card2)',
                    color: 'var(--st-text)',
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    border: '1px solid var(--st-line)',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/new-arrivals"
                style={{
                  padding: '8px 14px',
                  borderRadius: 99,
                  background: 'rgba(217, 133, 69, 0.15)',
                  color: 'var(--st-accent)',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid rgba(217, 133, 69, 0.3)',
                }}
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
