import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { ArrowIcon, BagIcon, MinusIcon, PlusIcon, TrashIcon } from '../components/Icons';
import PageShell from '../components/PageShell';
import ProductImage from '../components/ProductImage';
import { FREE_SHIPPING_OVER, getProduct, money, shippingFor, type Product } from '../data/products';
import { cartKey, useShop, type CartItem } from '../store/shop';

export default function CartPage() {
  const cart = useShop((s) => s.cart);
  const setQty = useShop((s) => s.setQty);
  const remove = useShop((s) => s.removeFromCart);
  const clear = useShop((s) => s.clearCart);

  const lines = cart
    .map((item) => ({ item, product: getProduct(item.slug) }))
    .filter((l): l is { item: CartItem; product: Product } => Boolean(l.product));

  const subtotal = lines.reduce((a, l) => a + l.product.price * l.item.qty, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const count = lines.reduce((a, l) => a + l.item.qty, 0);

  return (
    <PageShell
      title="Shopping Cart | STORE Menswear"
      description="Review your selected menswear pieces, adjust quantities, and proceed to our secure checkout."
    >
      <div className="st-wrap">
        <Breadcrumbs items={[{ label: 'Cart' }]} />
        <h1 className="st-title">Your Cart<small>{count} item{count === 1 ? '' : 's'}</small></h1>

        {lines.length === 0 ? (
          <div className="st-empty">
            <BagIcon size={44} />
            <h2>Your cart is empty</h2>
            <p>Looks like you have not added anything yet.</p>
            <Link to="/shop" className="st-btn primary">Start shopping <ArrowIcon size={18} /></Link>
          </div>
        ) : (
          <div className="st-cart">
            <div>
              {lines.map(({ item, product: p }) => {
                const key = cartKey(item);
                return (
                  <div className="st-line" key={key}>
                    <Link to={`/products/${p.slug}`} className="st-thumb"><ProductImage product={p} /></Link>
                    <div>
                      <h3><Link to={`/products/${p.slug}`}>{p.name}</Link></h3>
                      <p>{item.color} · {item.size}</p>
                      <p>{money(p.price, true)} each</p>
                    </div>
                    <div className="st-qty">
                      <button type="button" onClick={() => setQty(key, item.qty - 1)} aria-label="Decrease quantity"><MinusIcon size={16} /></button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => setQty(key, item.qty + 1)} disabled={item.qty >= 10} aria-label="Increase quantity"><PlusIcon size={16} /></button>
                    </div>
                    <strong className="st-price">{money(p.price * item.qty, true)}</strong>
                    <button type="button" className="st-icon-btn" onClick={() => remove(key)} aria-label={`Remove ${p.name}`}><TrashIcon size={18} /></button>
                  </div>
                );
              })}
              <button type="button" className="st-link" onClick={clear}>Clear cart</button>
            </div>

            <aside className="st-summary">
              <h2>Order Summary</h2>
              <div className="st-sum-row"><span>Subtotal</span><span>{money(subtotal, true)}</span></div>
              <div className="st-sum-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : money(shipping, true)}</span></div>
              <div className="st-sum-row total"><span>Total</span><span>{money(total, true)}</span></div>
              {shipping > 0 && <p className="st-note">Add {money(FREE_SHIPPING_OVER - subtotal, true)} more for free shipping.</p>}
              <p className="st-note">Prices are inclusive of all taxes.</p>
              <Link to="/checkout" className="st-btn primary block" style={{ marginTop: 20 }}>Checkout <ArrowIcon size={18} /></Link>
              <Link to="/shop" className="st-btn ghost block" style={{ marginTop: 10 }}>Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </PageShell>
  );
}
