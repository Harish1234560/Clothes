import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Field, { isEmail } from '../components/Field';
import { ArrowIcon, CheckIcon } from '../components/Icons';
import PageShell from '../components/PageShell';
import ProductImage from '../components/ProductImage';
import { getProduct, money, shippingFor, type Product } from '../data/products';
import { cartKey, useShop, type CartItem, type OrderInfo } from '../store/shop';

const empty = { name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'India' };
type Form = typeof empty;
const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates'];

function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 2) e.name = 'Enter your full name';
  if (!isEmail(f.email)) e.email = 'Enter a valid email';
  if (!/^\+?[0-9\s-]{7,15}$/.test(f.phone.trim())) e.phone = 'Enter a valid phone number';
  if (f.address.trim().length < 5) e.address = 'Enter your address';
  if (f.city.trim().length < 2) e.city = 'Enter your city';
  if (f.state.trim().length < 2) e.state = 'Enter your state';
  if (!/^[A-Za-z0-9\s-]{3,10}$/.test(f.zip.trim())) e.zip = 'Enter a valid postal code';
  return e;
}

export default function CheckoutPage() {
  const cart = useShop((s) => s.cart);
  const user = useShop((s) => s.user);
  const clearCart = useShop((s) => s.clearCart);
  const setLastOrder = useShop((s) => s.setLastOrder);

  const [f, setF] = useState<Form>({ ...empty, name: user?.name ?? '', email: user?.email ?? '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [pay, setPay] = useState<'cod' | 'card'>('cod');
  const [done, setDone] = useState<OrderInfo | null>(null);

  const set = (k: keyof Form) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const lines = cart
    .map((item) => ({ item, product: getProduct(item.slug) }))
    .filter((l): l is { item: CartItem; product: Product } => Boolean(l.product));
  const subtotal = lines.reduce((a, l) => a + l.product.price * l.item.qty, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const count = lines.reduce((a, l) => a + l.item.qty, 0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er = validate(f);
    setErrors(er);
    if (Object.keys(er).length) return;
    const orderId = `ST-${Date.now().toString().slice(-8)}`;
    const order: OrderInfo = { id: orderId, email: f.email.trim(), total, items: count, placedAt: Date.now() };
    
    useShop.getState().createOrder({
      id: orderId,
      customerName: f.name.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
      address: f.address.trim(),
      city: f.city.trim(),
      state: f.state.trim(),
      zip: f.zip.trim(),
      country: f.country,
      paymentMethod: pay,
      items: lines.map((l) => ({
        slug: l.product.slug,
        name: l.product.name,
        price: l.product.price,
        qty: l.item.qty,
        color: l.item.color,
        size: l.item.size,
        image: l.product.image,
      })),
      subtotal,
      shipping,
      total,
      status: 'Placed',
      placedAt: Date.now(),
    });

    setLastOrder(order);
    clearCart();
    setDone(order);
  };

  if (done) {
    return (
      <PageShell
        title="Order Confirmed | STORE Menswear"
        description="Thank you for your purchase. Your order has been received and assigned for processing and delivery."
      >
        <div className="st-wrap">
          <div className="st-success">
            <div className="tick"><CheckIcon size={34} /></div>
            <h1>Thank you for your order</h1>
            <p>A confirmation and order invoice have been sent to <strong>{done.email}</strong>. Your order is registered and will be prepared for dispatch.</p>
            <div className="code">{done.id}</div>
            <div className="st-row" style={{ justifyContent: 'center' }}>
              <Link to="/track-order" className="st-btn primary">Track order <ArrowIcon size={18} /></Link>
              <Link to="/shop" className="st-btn ghost">Continue shopping</Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  if (lines.length === 0) {
    return (
      <PageShell
        title="Checkout | STORE Menswear"
        description="Complete your order with secure shipping and payment options."
      >
        <div className="st-wrap">
          <div className="st-empty">
            <h2>Nothing to check out</h2>
            <p>Your cart is empty.</p>
            <Link to="/shop" className="st-btn primary">Start shopping <ArrowIcon size={18} /></Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Secure Checkout | STORE Menswear"
      description="Enter your shipping details and select your preferred payment method to complete your purchase securely."
    >
      <div className="st-wrap">
        <Breadcrumbs items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
        <h1 className="st-title">Checkout</h1>

        <form className="st-cart" onSubmit={submit} noValidate>
          <div className="st-form">
            <div className="st-box">
              <h2>Shipping details</h2>
              <div className="st-form">
                <Field id="name" label="Full name" value={f.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                <div className="st-two">
                  <Field id="email" label="Email" type="email" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                  <Field id="phone" label="Phone" type="tel" value={f.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
                </div>
                <Field id="address" label="Address" value={f.address} onChange={set('address')} error={errors.address} autoComplete="street-address" />
                <div className="st-two">
                  <Field id="city" label="City" value={f.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
                  <Field id="state" label="State" value={f.state} onChange={set('state')} error={errors.state} autoComplete="address-level1" />
                </div>
                <div className="st-two">
                  <Field id="zip" label="Postal code" value={f.zip} onChange={set('zip')} error={errors.zip} autoComplete="postal-code" />
                  <div className="st-field">
                    <label htmlFor="country">Country</label>
                    <select id="country" className="st-input" value={f.country} onChange={(e) => set('country')(e.target.value)}>
                      {countries.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="st-box">
              <h2>Payment</h2>
              <div className="st-pay">
                <label className={pay === 'cod' ? 'on' : ''}><input type="radio" name="pay" checked={pay === 'cod'} onChange={() => setPay('cod')} /> Cash on delivery</label>
                <label className={pay === 'card' ? 'on' : ''}><input type="radio" name="pay" checked={pay === 'card'} onChange={() => setPay('card')} /> Card / UPI (demo)</label>
              </div>
              <p className="st-note">This is a demo checkout. No card details are collected and no payment is processed.</p>
            </div>
          </div>

          <aside className="st-summary">
            <h2>Your order</h2>
            {lines.map(({ item, product: p }) => (
              <div className="st-mini" key={cartKey(item)}>
                <div className="st-thumb"><ProductImage product={p} /></div>
                <div>
                  <strong>{p.name}</strong>
                  <p>{item.color} · {item.size} · Qty {item.qty}</p>
                </div>
                <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{money(p.price * item.qty, true)}</span>
              </div>
            ))}
            <div className="st-sum-row" style={{ marginTop: 12 }}><span>Subtotal</span><span>{money(subtotal, true)}</span></div>
            <div className="st-sum-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : money(shipping, true)}</span></div>
            <div className="st-sum-row total"><span>Total</span><span>{money(total, true)}</span></div>
            <button type="submit" className="st-btn primary block" style={{ marginTop: 20 }}>Place Order <ArrowIcon size={18} /></button>
          </aside>
        </form>
      </div>
    </PageShell>
  );
}
