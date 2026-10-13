import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

const collections = [
  { numeral: 'I', title: 'Books to Read This Winter', desc: 'Twelve slow, immersive reads for long evenings.', slug: 'winter-reads', color: '#1F3A32' },
  { numeral: 'II', title: 'Voices from the Margins', desc: 'Eight debut authors reshaping Indian fiction.', slug: 'voices-from-the-margins', color: '#4A6D7C' },
  { numeral: 'III', title: 'The Quiet Shelf', desc: 'Five meditative non-fiction picks for thoughtful readers.', slug: 'quiet-shelf', color: '#7B2D26' },
];

export function Collections() {
  return (
    <section className="py-128 bg-bg-2">
      <div className="container-shell">
        <Reveal>
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="label-eyebrow mb-4 text-accent">Curated</p>
            <h2 className="text-h2 font-serif text-ink">Reading Lists</h2>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((col, i) => (
            <Reveal key={col.slug} delay={i * 0.12}>
              <Link
                to={`/collections/${col.slug}`}
                className="spotlight-card group relative block overflow-hidden rounded-28 border border-line bg-bg-1 p-8 transition-all duration-450 hover:-translate-y-1 hover:shadow-card"
              >
                <div
                  className="absolute -right-4 -top-4 select-none font-serif italic"
                  style={{
                    fontSize: '120px',
                    lineHeight: 1,
                    color: `${col.color}15`,
                    fontWeight: 400,
                  }}
                >
                  {col.numeral}
                </div>
                <div className="relative z-10">
                  <p className="label-eyebrow text-accent mb-3">Collection {col.numeral}</p>
                  <h3 className="text-h3 font-serif text-ink">{col.title}</h3>
                  <p className="mt-3 text-sm text-ink-soft">{col.desc}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors group-hover:text-accent">
                    Explore
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
