import { useState, type FormEvent } from 'react';
import { ArrowRight, CreditCard, Landmark, Smartphone, Truck, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json() as { subscribed?: boolean; error?: string };
      if (!response.ok || !result.subscribed) {
        setMessage(result.error ?? 'We could not subscribe you. Please try again.');
        return;
      }
      setEmail('');
      setMessage('You are subscribed. Look out for our next update.');
    } catch {
      setMessage('The newsletter service is unavailable. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="footer shell store-footer">
      <div className="footer-intro">
        <div className="footer-brand">
          <Link className="logo" to="/" aria-label="STORE home">S T O R E</Link>
          <p>Premium menswear for the modern gentleman. Elevate your wardrobe with timeless pieces crafted for distinction.</p>
        </div>
        <form className="footer-newsletter" onSubmit={subscribe}>
          <h2>Newsletter</h2>
          <p>Get exclusive drops, styling notes, and early access to new collections, straight to your inbox.</p>
          <div className="footer-email">
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Your email address"
              aria-label="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe to the newsletter" disabled={submitting}>
              <ArrowRight size={20} />
            </button>
          </div>
          <p className="footer-newsletter-status" role="status" aria-live="polite">{message}</p>
        </form>
      </div>

      <div className="footer-columns">
        <section>
          <h3>Company</h3>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </section>
        <section>
          <h3>Customer Support</h3>
          <Link to="/faq">FAQ</Link>
          <Link to="/track-order">Track Order</Link>
        </section>
        <section>
          <h3>Shop</h3>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/shop?best=true">Best Sellers</Link>
          <Link to="/sale">Sale</Link>
          <Link to="/shop">All Products</Link>
        </section>
        <section>
          <h3>Quick Links</h3>
          <Link to="/shop">Categories</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">My Account</Link>
        </section>
        <section>
          <h3>Contact</h3>
          <a href="mailto:support@store.com">support@store.com</a>
          <a href="tel:+18005550199">+1 (800) 555-0199</a>
          <Link to="/contact">Get in touch</Link>
          <Link to="/track-order">Order support</Link>
        </section>
        <section>
          <h3>Portals</h3>
          <Link to="/admin" style={{ color: 'var(--st-accent)' }}>Admin Console</Link>
          <Link to="/delivery" style={{ color: '#60a5fa' }}>Delivery Partner</Link>
        </section>
      </div>

      <div className="footer-lower">
        <div className="footer-payments">
          <h3>Payment Method</h3>
          <div aria-label="Payment options">
            <span aria-label="Credit card" title="Credit card"><CreditCard size={19} /></span>
            <span aria-label="Wallet" title="Wallet"><WalletCards size={19} /></span>
            <span aria-label="Bank transfer" title="Bank transfer"><Landmark size={19} /></span>
            <span aria-label="Mobile payment" title="Mobile payment"><Smartphone size={19} /></span>
            <span aria-label="Delivery" title="Delivery"><Truck size={19} /></span>
          </div>
        </div>
        <div className="footer-region">
          <h3>Region</h3>
          <span>India · English · INR</span>
        </div>
      </div>

      <div className="footer-copyright">© {new Date().getFullYear()} STORE. All rights reserved.</div>
    </footer>
  );
}
