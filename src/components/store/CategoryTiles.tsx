import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/motion/Reveal';

const categories = [
  { name: 'Fiction', color: '#1F3A32', count: 124 },
  { name: 'Non-fiction', color: '#8B4513', count: 86 },
  { name: 'Self-help', color: '#4A6D7C', count: 42 },
  { name: 'Business', color: '#2C2C2C', count: 38 },
  { name: 'Children', color: '#7B2D26', count: 57 },
  { name: 'Comics', color: '#4B3B5C', count: 31 },
  { name: 'Academic', color: '#3D5A2C', count: 95 },
  { name: 'Regional', color: '#C2453B', count: 48 },
];

function MiniBookStack({ color, hovered }: { color: string; hovered: boolean }) {
  return (
    <div className="relative h-16 w-14">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-sm shadow-soft transition-all duration-500 ease-premium"
          style={{
            width: 32 - i * 4,
            height: 48 - i * 6,
            left: hovered ? i * 8 - 4 : i * 5,
            bottom: hovered ? i * 3 : i * 2,
            background: `linear-gradient(135deg, ${color}, ${color}aa)`,
            zIndex: 3 - i,
            transform: `rotate(${hovered ? (i * 8 - 8) : (i * 4 - 4)}deg) translateY(${hovered ? -i * 2 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
}

export function CategoryTiles() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-128 relative overflow-hidden">
      <div className="container-shell">
        <Reveal>
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="label-eyebrow mb-4 text-accent">Browse</p>
            <h2 className="text-h2 font-serif text-ink">Shop by Category</h2>
            <div className="section-divider mt-6" style={{ transform: 'scaleX(2)' }} />
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 0.06}>
              <Link
                to={`/categories/${cat.name.toLowerCase().replace(/[^a-z]/g, '-')}`}
                className="spotlight-card group flex flex-col items-center justify-center gap-4 rounded-20 border border-line bg-bg-1 p-8 transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-accent hover:shadow-float"
                data-cursor="Explore"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="transition-transform duration-500 ease-premium group-hover:scale-110">
                  <MiniBookStack color={cat.color} hovered={hovered === i} />
                </div>
                <div className="text-center">
                  <p className="font-serif text-lg font-medium text-ink transition-colors duration-300 group-hover:text-accent">
                    {cat.name}
                  </p>
                  <p className="text-xs text-ink-faint mt-0.5">{cat.count} books</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
