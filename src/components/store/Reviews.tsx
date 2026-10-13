import { Reveal } from '@/components/motion/Reveal';
import { Marquee } from '@/components/motion/Marquee';
import { Rating } from '@/components/ui/Rating';

const reviews = [
  { name: 'Ananya R.', text: 'Beautifully packaged and delivered in three days. The book selection is unlike any other store.', rating: 5, book: 'The Silent Hours' },
  { name: 'Karthik S.', text: 'The gold accent packaging made it feel like a gift. Will order again.', rating: 5, book: 'River of Stars' },
  { name: 'Deepa M.', text: 'Found titles I could not locate anywhere else. The curation is thoughtful.', rating: 4.5, book: 'Winter Bloom' },
  { name: 'Rahul V.', text: 'Smooth checkout, quick delivery, and genuine publisher copies. Highly recommend.', rating: 5, book: 'The Cartographer of Lost Places' },
  { name: 'Sneha P.', text: 'The reading lists helped me discover three new authors I now love.', rating: 5, book: 'Found Objects' },
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="w-[320px] shrink-0 rounded-20 border border-line bg-bg-1 p-6">
      <Rating value={review.rating} size="sm" showCount={false} />
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">"{review.text}"</p>
      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">{review.name}</p>
          <p className="text-xs text-ink-faint">on {review.book}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-accent-soft" />
      </div>
    </div>
  );
}

export function Reviews() {
  return (
    <section className="py-128 overflow-hidden">
      <div className="container-shell">
        <Reveal>
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="label-eyebrow mb-4 text-accent">Kind Words</p>
            <h2 className="text-h2 font-serif text-ink">From Our Readers</h2>
          </div>
        </Reveal>
      </div>
      <Marquee>
        {reviews.map((r) => (
          <ReviewCard key={r.name} review={r} />
        ))}
      </Marquee>
    </section>
  );
}
