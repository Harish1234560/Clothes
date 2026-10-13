import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from '@/components/motion/Reveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const pages = [
  { text: 'A book is a dream that you hold in your hand.', author: 'Neil Gaiman' },
  { text: 'There is no friend as loyal as a book.', author: 'Ernest Hemingway' },
  { text: 'A reader lives a thousand lives before he dies.', author: 'George R.R. Martin' },
  { text: 'Books are a uniquely portable magic.', author: 'Stephen King' },
  { text: 'The world was hers for the reading.', author: 'Betty Smith' },
];

function DustParticles() {
  const particles = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((_, i) => (
        <div
          key={i}
          className="dust-particle"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            background: 'rgb(184 137 59)',
          }}
        />
      ))}
    </div>
  );
}

export function PagesTurn() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const activePage = useTransform(scrollYProgress, [0.1, 0.9], [0, pages.length - 1]);
  const pageOpacity = (index: number) =>
    useTransform(activePage, [index - 0.8, index, index + 0.8], [0, 1, 0]);

  if (reduced) {
    return (
      <section className="bg-ink py-128">
        <div className="container-shell text-center">
          <p className="label-eyebrow mb-4 text-accent">Pages That Turn</p>
          <h2 className="text-h2 font-serif text-bg-0 mb-12">A reader's companion</h2>
          <div className="mx-auto max-w-2xl">
            <div className="flex min-h-[280px] items-center justify-center rounded-12 border border-bg-0/10 bg-bg-1/5 p-12">
              <div className="text-center">
                <p className="font-serif text-2xl italic leading-relaxed text-bg-0/90">
                  "{pages[0].text}"
                </p>
                <p className="mt-4 label-eyebrow text-bg-0/40">— {pages[0].author}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink py-128" style={{ minHeight: '120vh' }}>
      <DustParticles />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgb(184 137 59 / 0.5) 0%, transparent 70%)',
        }}
      />

      {/* Sticky content */}
      <div className="sticky top-0 flex min-h-screen items-center justify-center">
        <div className="container-shell relative z-10 text-center">
          <Reveal>
            <p className="label-eyebrow mb-4 text-accent">Pages That Turn</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-h2 font-serif text-bg-0 mb-16">
              A <span className="italic font-light text-accent">reader's</span> companion
            </h2>
          </Reveal>

          <div className="relative mx-auto max-w-2xl min-h-[300px] flex items-center justify-center">
            {pages.map((page, i) => {
              const opacity = pageOpacity(i);
              const scale = useTransform(activePage, [i - 1, i, i + 1], [0.9, 1, 0.9]);
              const rotateY = useTransform(activePage, [i - 1, i, i + 1], [-15, 0, 15]);
              return (
                <motion.div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ opacity, scale, rotateY, transformStyle: 'preserve-3d' }}
                >
                  <div className="w-full rounded-20 border border-bg-0/10 bg-bg-1/5 backdrop-blur-sm p-12">
                    <p className="font-serif text-2xl italic leading-relaxed text-bg-0/90 md:text-3xl">
                      "{page.text}"
                    </p>
                    <p className="mt-4 label-eyebrow text-bg-0/40">— {page.author}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
