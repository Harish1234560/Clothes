import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { BookCard } from '@/components/store/BookCard';

const sampleBooks = [
  { id: '1', slug: 'river-of-stars', title: 'River of Stars', author: 'Priya Nair', coverColor: '#8B4513', price: 449, originalPrice: 599, rating: 4.3, ratingCount: 45, isNew: true, stock: 12 },
  { id: '2', slug: 'the-silent-hours', title: 'The Silent Hours', author: 'Rohan Kapoor', coverColor: '#1F3A32', price: 399, rating: 4.7, ratingCount: 89, isBestseller: true, stock: 5 },
  { id: '3', slug: 'winter-bloom', title: 'Winter Bloom', author: 'Meera Iyer', coverColor: '#7B2D26', price: 549, originalPrice: 699, rating: 4.1, ratingCount: 32, stock: 20 },
  { id: '4', slug: 'found-objects', title: 'Found Objects', author: 'Vikram Joshi', coverColor: '#3D5A2C', price: 299, rating: 4.0, ratingCount: 18, isNew: true, stock: 0 },
  { id: '5', slug: 'letters-to-no-one', title: 'Letters to No One', author: 'Aravind Mehta', coverColor: '#2C2C2C', price: 379, originalPrice: 499, rating: 4.5, ratingCount: 67, stock: 8 },
  { id: '6', slug: 'after-the-rain', title: 'After the Rain', author: 'Priya Nair', coverColor: '#4B3B5C', price: 429, rating: 4.2, ratingCount: 24, stock: 15 },
  { id: '7', slug: 'the-glassmaker', title: 'The Glassmaker', author: 'Rohan Kapoor', coverColor: '#4A6D7C', price: 499, originalPrice: 650, rating: 4.6, ratingCount: 52, isBestseller: true, stock: 3 },
  { id: '8', slug: 'pale-fire-songs', title: 'Pale Fire Songs', author: 'Meera Iyer', coverColor: '#C2453B', price: 349, rating: 3.9, ratingCount: 12, stock: 10 },
];

export function Bestsellers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="py-128">
      <div className="container-shell">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="label-eyebrow mb-3 text-accent">What People Are Reading</p>
              <h2 className="text-h2 font-serif text-ink">Bestsellers</h2>
            </div>
            <div className="hidden gap-2 sm:flex">
              <button
                onClick={() => scroll('left')}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="container-shell">
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth snap-x-mandatory pb-4"
        >
          {sampleBooks.map((book) => (
            <div key={book.id} className="snap-start shrink-0 w-[200px] sm:w-[240px]">
              <BookCard {...book} onAddToCart={(id: string) => console.log('add', id)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
