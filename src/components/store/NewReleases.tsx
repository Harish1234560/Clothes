import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { BookCard } from '@/components/store/BookCard';

const newBooks = [
  { id: '10', slug: 'the-glassmaker', title: 'The Glassmaker', author: 'Rohan Kapoor', coverColor: '#4A6D7C', price: 499, rating: 4.6, ratingCount: 52, isNew: true, stock: 12 },
  { id: '11', slug: 'pale-fire-songs', title: 'Pale Fire Songs', author: 'Meera Iyer', coverColor: '#C2453B', price: 349, rating: 4.0, ratingCount: 18, isNew: true, stock: 8 },
  { id: '12', slug: 'the-unquiet-hours', title: 'The Unquiet Hours', author: 'Vikram Joshi', coverColor: '#2C2C2C', price: 429, originalPrice: 549, rating: 4.3, ratingCount: 29, isNew: true, stock: 5 },
  { id: '13', slug: 'songs-of-the-marrow', title: 'Songs of the Marrow', author: 'Aravind Mehta', coverColor: '#3D5A2C', price: 379, rating: 4.4, ratingCount: 15, isNew: true, stock: 20 },
];

export function NewReleases() {
  return (
    <section className="py-128 bg-bg-1">
      <div className="container-shell">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="label-eyebrow mb-3 text-accent">Just Arrived</p>
              <h2 className="text-h2 font-serif text-ink">New Releases</h2>
            </div>
            <Link
              to="/new-releases"
              className="group flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-accent"
            >
              View all
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {newBooks.map((book, i) => (
            <Reveal key={book.id} delay={i * 0.08}>
              <BookCard {...book} onAddToCart={(id: string) => console.log('add', id)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
