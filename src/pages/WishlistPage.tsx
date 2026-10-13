import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { ArrowIcon, HeartIcon } from '../components/Icons';
import PageShell from '../components/PageShell';
import ProductCard from '../components/ProductCard';
import { getProduct, type Product } from '../data/products';
import { useShop } from '../store/shop';

export default function WishlistPage() {
  const wishlist = useShop((s) => s.wishlist);
  const items = wishlist.map(getProduct).filter((p): p is Product => Boolean(p));

  return (
    <PageShell
      title="Saved Items | Wishlist | STORE Menswear"
      description="View and manage your saved wishlist items at STORE. Curate your wardrobe pieces for future orders."
    >
      <div className="st-wrap">
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />
        <h1 className="st-title">Your Wishlist<small>{items.length} saved item{items.length === 1 ? '' : 's'}</small></h1>
        {items.length === 0 ? (
          <div className="st-empty">
            <HeartIcon size={44} />
            <h2>Nothing saved yet</h2>
            <p>Tap the heart on any product to save it here. Tap it again to remove it.</p>
            <Link to="/shop" className="st-btn primary">Browse products <ArrowIcon size={18} /></Link>
          </div>
        ) : (
          <div className="st-grid c4">{items.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
        )}
      </div>
    </PageShell>
  );
}
