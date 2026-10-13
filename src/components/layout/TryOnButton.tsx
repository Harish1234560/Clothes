import { useEffect, useState } from 'react';
import { RotateCcw, Sparkles, X, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HangerIcon } from '../Icons';
import { getProduct, type Product } from '../../data/products';
import { useShop } from '../../store/shop';

function MannequinPreview() {
  return (
    <svg className="tryon-mannequin" viewBox="0 0 320 410" role="img" aria-label="Full-body mannequin against a grey studio background">
      <defs>
        <linearGradient id="mannequin-backdrop" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#aaa" />
          <stop offset="1" stopColor="#737373" />
        </linearGradient>
        <linearGradient id="mannequin-body" x1="0" y1="0" x2="1" y2=".2">
          <stop stopColor="#85898a" />
          <stop offset=".24" stopColor="#d6d9d9" />
          <stop offset=".52" stopColor="#aeb3b4" />
          <stop offset=".78" stopColor="#e0e2e2" />
          <stop offset="1" stopColor="#777c7d" />
        </linearGradient>
      </defs>
      <rect width="320" height="410" fill="url(#mannequin-backdrop)" />
      <ellipse cx="160" cy="392" rx="78" ry="9" fill="#4d4d4d" opacity=".42" />
      <g fill="url(#mannequin-body)" stroke="#767b7c" strokeOpacity=".4" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M160 23c-16 0-26 13-26 32 0 21 10 39 26 39s26-18 26-39c0-19-10-32-26-32Z" />
        <path d="M148 89h24v25h-24z" />
        <path d="M143 108c-17 2-30 8-41 18l-17 32 20 13 17-24 9 97h58l9-97 17 24 20-13-17-32c-11-10-24-16-41-18l-17 17z" />
        <path d="M102 126c-8 8-13 21-19 39l-13 39c-4 12-4 21 2 26 4 3 9 1 11-5l16-44 20-37zm116 0c8 8 13 21 19 39l13 39c4 12 4 21-2 26-4 3-9 1-11-5l-16-44-20-37z" />
        <path d="M126 242c-1 17-5 35-8 56l-5 54c-1 10 2 16 8 17 7 1 10-5 12-15l17-66 10-43zm68 0c1 17 5 35 8 56l5 54c1 10-2 16-8 17-7 1-10-5-12-15l-17-66-10-43z" />
        <path d="M113 349c5 1 13 1 20 0l-4 30c-1 6-4 9-10 9H99c-7 0-9-6-4-10l15-12zm94 0c-5 1-13 1-20 0l4 30c1 6 4 9 10 9h20c7 0 9-6 4-10l-15-12z" />
      </g>
      <path d="M141 112q19 15 38 0m-19 12v70m-26 18q26 12 52 0m-50 31q24 9 48 0m-43 58 18 1m22-1-18 1m-30-89 28 8 28-8" fill="none" stroke="#6c7172" strokeOpacity=".34" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function TryOnButton() {
  const fitting = useShop((state) => state.fitting);
  const clearFitting = useShop((state) => state.clearFitting);
  const toggleFitting = useShop((state) => state.toggleFitting);
  const products = fitting.map(getProduct).filter((product): product is Product => Boolean(product));
  const [open, setOpen] = useState(false);
  const [apiNotice, setApiNotice] = useState(false);

  useEffect(() => {
    const openPanel = () => setOpen(true);
    window.addEventListener('store:open-fitting-room', openPanel);
    return () => window.removeEventListener('store:open-fitting-room', openPanel);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const startOver = () => {
    clearFitting();
    setApiNotice(false);
  };

  return (
    <>
      {!open && (
        <button className="fitting-pill" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Open virtual fitting room try it on">
          <span className="fitting-avatar">
            <svg viewBox="0 0 100 100" width="28" height="28" style={{ display: 'block' }}>
              <rect width="100" height="100" fill="#78797d" />
              <ellipse cx="50" cy="22" rx="11" ry="14" fill="#d6d7db" />
              <rect x="46" y="34" width="8" height="9" fill="#a2a4a8" />
              <path d="M29 44 C29 44, 40 46, 50 46 C60 46, 71 44, 71 44 L66 78 C66 78, 58 84, 50 84 C42 84, 34 78, 34 78 Z" fill="#e6e7eb" />
              <path d="M50 46 L50 84" stroke="#999ba0" strokeWidth="1.5" />
              <rect x="47" y="84" width="6" height="16" fill="#4d4f52" />
            </svg>
          </span>
          <span className="fitting-text">Try it on</span>
          {products.length > 0 && <b>{products.length}</b>}
        </button>
      )}

      {open && (
        <section className="tryon-panel" role="dialog" aria-modal="false" aria-labelledby="tryon-title">
          <header className="tryon-panel-header">
            <div>
              <h2 id="tryon-title">Fitting room</h2>
              <p>Tap the hanger on any product to add it here.</p>
            </div>
            <button className="tryon-close" type="button" onClick={() => setOpen(false)} aria-label="Close fitting room">
              <X size={19} />
            </button>
          </header>

          <div className="tryon-preview">
            <MannequinPreview />
            <span className="tryon-zoom" aria-hidden="true"><ZoomIn size={17} /></span>
            {products.length === 0 && <p className="tryon-empty-hint">Your saved pieces will appear here.</p>}
          </div>

          {products.length > 0 && (
            <div className="tryon-selection" aria-label="Products saved to the fitting room">
              {products.map((product) => (
                <span className="tryon-selection-item" key={product.slug}>
                  <Link to={`/products/${product.slug}`} onClick={() => setOpen(false)}>{product.name}</Link>
                  <button type="button" onClick={() => toggleFitting(product.slug)} aria-label={`Remove ${product.name}`}>
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <footer className="tryon-panel-actions">
            <button className="tryon-api-button" type="button" onClick={() => setApiNotice((visible) => !visible)}>
              <Sparkles size={15} /> Style Studio Preview
            </button>
            <button className="tryon-reset" type="button" onClick={startOver}>
              <RotateCcw size={14} /> Clear all
            </button>
          </footer>
          {apiNotice && (
            <p className="tryon-api-note">
              Virtual Try-On preview reflects selected garments on the mannequin studio avatar. Tap the hanger on any jacket, shirt, or pants in the store to coordinate layered outfit combinations.
            </p>
          )}
        </section>
      )}
    </>
  );
}
