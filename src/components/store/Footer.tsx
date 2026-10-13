import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

const footerColumns = [
  {
    title: 'Shop',
    links: [
      { label: 'All Books', href: '/books' },
      { label: 'New Releases', href: '/new-releases' },
      { label: 'Bestsellers', href: '/bestsellers' },
      { label: 'Offers', href: '/offers' },
      { label: 'Collections', href: '/collections' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping & Returns', href: '/shipping-returns' },
      { label: 'Track Order', href: '/order-tracking' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-line bg-bg-1">
      <div className="container-shell py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand + contact */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-accent" />
              <span className="font-serif text-2xl font-semibold text-ink">Athenaeum</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              A quiet, independent bookshop bringing you stories worth keeping. Curated with care, delivered with love.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-ink-soft">
              <a href="mailto:hello@athenaeum.in" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" /> hello@athenaeum.in
              </a>
              <a href="tel:+918000000000" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-4 h-4" /> +91 80000 00000
              </a>
              <span className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> 123 KG Road, Bengaluru, Karnataka 560001
              </span>
            </div>
            <div className="mt-5 flex gap-2">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="label-eyebrow mb-4 text-ink-faint">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-ink-soft transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment + bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 md:flex-row">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} Athenaeum Books. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {['Razorpay', 'Stripe', 'VISA', 'Mastercard', 'UPI'].map((p) => (
              <span
                key={p}
                className="rounded-md border border-line bg-bg-2 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-faint"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Giant outline wordmark */}
      <div className="overflow-hidden">
        <h2
          className="select-none text-center font-serif font-bold leading-none text-transparent"
          style={{
            fontSize: 'clamp(80px, 18vw, 260px)',
            WebkitTextStroke: '1px rgb(var(--text-3) / 0.15)',
            transform: 'translateY(30%)',
          }}
        >
          ATHENAEUM
        </h2>
      </div>
    </footer>
  );
}
