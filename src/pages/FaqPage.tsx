import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { ChevronIcon } from '../components/Icons';
import PageShell from '../components/PageShell';
import { FREE_SHIPPING_OVER, SHIPPING_FEE, money } from '../data/products';

const faqs = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3 to 7 business days. You will receive tracking details as soon as your order ships.' },
  { q: 'Is shipping free?', a: `Yes. Orders over ${money(FREE_SHIPPING_OVER)} ship free. Below that, a flat shipping fee of ${money(SHIPPING_FEE, true)} applies.` },
  { q: 'What is your return policy?', a: 'You can return unworn items with their tags attached within 30 days of delivery for a full refund.' },
  { q: 'How do I find my size?', a: 'Each product page lists the available sizes and the model height and size. If you are between sizes, we suggest sizing up for a relaxed fit.' },
  { q: 'How do I track my order?', a: 'Open the Track Order page and enter your order number and email. You will see the current status of your delivery.' },
  { q: 'Which payment methods do you accept?', a: 'We accept major cards, UPI and cash on delivery in supported regions. All payments are processed securely.' },
  { q: 'Can I change or cancel my order?', a: 'You can change or cancel an order before it is packed. Contact us as soon as possible with your order number.' },
  { q: 'How should I care for my garments?', a: 'Care instructions are listed on every product page. As a rule, wash cold, dry flat or on low heat, and store wool and leather on wide hangers.' },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell
      title="Frequently Asked Questions (FAQ) | STORE Menswear"
      description="Got questions about orders, shipping rates, 30-day return policies, garment sizing or fabric care? Read our full FAQ."
    >
      <div className="st-wrap">
        <Breadcrumbs items={[{ label: 'FAQ' }]} />
        <h1 className="st-title" style={{ textAlign: 'center' }}>Frequently Asked Questions<small>Quick answers to common questions.</small></h1>
        <div className="st-faq">
          {faqs.map((f, i) => (
            <div key={f.q} className={`st-faq-item${open === i ? ' open' : ''}`}>
              <button type="button" className="st-faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                {f.q}<ChevronIcon size={20} />
              </button>
              <div className="st-faq-a"><div><p>{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
