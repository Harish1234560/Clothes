import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { SplitLines } from '@/components/motion/SplitLines';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const heroBooks = [
  { color: '#1F3A32', title: 'The Silent Hours', w: 120, h: 180, x: -200, y: -50, rot: -8, delay: 0, depth: 0.6 },
  { color: '#8B4513', title: 'River of Stars', w: 100, h: 150, x: -90, y: 70, rot: 6, delay: 0.08, depth: 0.8 },
  { color: '#2C2C2C', title: 'Letters to No One', w: 130, h: 195, x: 40, y: -90, rot: -4, delay: 0.16, depth: 0.5 },
  { color: '#4A6D7C', title: 'The Cartographer', w: 110, h: 165, x: 150, y: 30, rot: 10, delay: 0.24, depth: 0.7 },
  { color: '#7B2D26', title: 'Winter Bloom', w: 95, h: 142, x: 240, y: -60, rot: -6, delay: 0.32, depth: 0.9 },
  { color: '#3D5A2C', title: 'Found Objects', w: 115, h: 172, x: -240, y: 90, rot: 12, delay: 0.40, depth: 0.65 },
  { color: '#4B3B5C', title: 'After the Rain', w: 105, h: 158, x: 300, y: 100, rot: -10, delay: 0.48, depth: 0.75 },
];

function FloatingBook({ book, index, scrollY }: { book: typeof heroBooks[0]; index: number; scrollY: { current: number } }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const start = performance.now();

    const animate = (now: number) => {
      const t = (now - start) / 1000;
      const bob = Math.sin(t * 0.5 + index * 0.7) * 10;
      const driftRot = Math.sin(t * 0.25 + index * 0.5) * 2.5;
      const scrollOffset = scrollY.current * book.depth;

      el.style.transform = `translate(${book.x}px, ${book.y + bob - scrollOffset}px) rotate(${book.rot + driftRot}deg) scale(${Math.max(0.3, 1 - scrollY.current / 1200)})`;
      el.style.opacity = `${Math.max(0, 1 - scrollY.current / 600)}`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [book, index, scrollY]);

  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-1/2"
      style={{ marginLeft: -book.w / 2, marginTop: -book.h / 2, zIndex: 10 + index, willChange: 'transform, opacity' }}
    >
      <div
        className="book-spine-shadow relative overflow-hidden rounded-sm"
        style={{ width: book.w, height: book.h, background: `linear-gradient(135deg, ${book.color}, ${book.color}cc)` }}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-3">
          <div className="h-px w-8 bg-white/20" />
          <div className="font-serif text-[11px] font-medium leading-tight text-white/85" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {book.title}
          </div>
        </div>
        <div className="absolute inset-y-0 left-0 w-1.5 bg-black/25" />
        {/* Glossy highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
      </div>
    </div>
  );
}

function DustParticles() {
  const particles = Array.from({ length: 12 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((_, i) => (
        <div
          key={i}
          className="dust-particle"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on('change', (v: number) => {
      scrollRef.current = v;
    });
    return () => unsub();
  }, [scrollY]);

  const contentY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -80]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, reduced ? 1 : 0]);
  const bgGradientOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    if (reduced) return;
    const el = containerRef.current;
    if (!el) return;

    const onMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const cy = (e.clientY - rect.top - rect.height / 2) / rect.height;
      el.style.setProperty('--rx', `${cy * -5}deg`);
      el.style.setProperty('--ry', `${cx * 5}deg`);
    };

    window.addEventListener('mousemove', onMouse);
    return () => window.removeEventListener('mousemove', onMouse);
  }, [reduced]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24">
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 35%, rgb(var(--accent-soft) / 0.15) 0%, transparent 70%)',
          opacity: bgGradientOpacity,
        }}
      />

      {/* Dust particles */}
      {!reduced && <DustParticles />}

      {/* Floating books */}
      {!reduced && (
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
        >
          <div
            className="relative transition-transform duration-300 ease-out"
            style={{
              transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
              transformStyle: 'preserve-3d',
            }}
          >
            {heroBooks.map((book, i) => (
              <FloatingBook key={i} book={book} index={i} scrollY={scrollRef} />
            ))}
          </div>
        </div>
      )}

      {/* Content overlay */}
      <motion.div
        className="container-shell relative z-20 text-center"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <Reveal delay={0.2}>
          <p className="label-eyebrow mb-6 text-accent">Stories Worth Keeping</p>
        </Reveal>

        <SplitLines
          className="text-hero font-serif font-medium text-ink"
          lines={[
            <>A bookshop for</>,
            <><span className="italic font-light">quiet</span> readers,</>,
            <>everywhere.</>,
          ]}
          delay={0.4}
        />

        <Reveal delay={0.9}>
          <p className="mx-auto mt-8 max-w-xl text-body text-ink-soft">
            Handpicked paperbacks, hardcovers, and eBooks from independent voices and timeless classics. Delivered across India with care.
          </p>
        </Reveal>

        <Reveal delay={1.1}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/books" data-cursor="Shop">
              <Button size="lg" variant="primary">
                Shop Books
                <ArrowRight className="w-4 h-4 btn-arrow" />
              </Button>
            </Link>
            <Link to="/new-releases">
              <Button size="lg" variant="outline">New Releases</Button>
            </Link>
          </div>
        </Reveal>
      </motion.div>

      {/* Scroll indicator */}
      {!reduced && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{ opacity: contentOpacity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">Scroll</span>
            <div className="relative h-12 w-px bg-line overflow-hidden">
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 bg-accent"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <ArrowDown className="w-3 h-3 text-ink-faint" />
          </div>
        </motion.div>
      )}
    </section>
  );
}
