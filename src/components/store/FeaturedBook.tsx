import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { Price } from '@/components/ui/Price';
import { useMagnetic } from '@/hooks/useMagnetic';

export function FeaturedBook() {
  const coverRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const magneticRef = useMagnetic<HTMLButtonElement>(0.25);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const coverY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const coverRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-12, 0, 8]);

  const handleMove = (e: React.MouseEvent) => {
    const el = coverRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const cy = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setRot({ x: cy * -14, y: cx * 16 });
  };

  const handleLeave = () => setRot({ x: 0, y: 0 });

  return (
    <section ref={sectionRef} className="py-128 bg-bg-2 relative overflow-hidden">
      {/* Decorative serif numeral */}
      <div className="absolute right-8 top-20 select-none pointer-events-none">
        <span className="font-serif italic text-[200px] leading-none text-accent/[0.06]">01</span>
      </div>

      <div className="container-shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: cover with tilt + scroll parallax */}
          <Reveal>
            <div className="flex justify-center" style={{ perspective: '1400px' }}>
              <motion.div
                style={{ y: coverY, rotateY: coverRotate }}
              >
                <div
                  ref={coverRef}
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                  className="book-cover-3d relative"
                  style={{ width: 300, height: 450, transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`, transformStyle: 'preserve-3d' }}
                  data-cursor="View"
                >
                  <div
                    className="book-spine-shadow relative h-full w-full overflow-hidden rounded-12"
                    style={{ background: 'linear-gradient(135deg, #1F3A32, #2A4A3F)', transform: 'translateZ(20px)' }}
                  >
                    <div className="flex h-full flex-col justify-between p-8">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                          Featured
                        </p>
                        <div className="mt-2 h-px w-12 bg-accent/60" />
                      </div>
                      <div>
                        <p className="font-serif text-2xl font-medium leading-tight text-white/90" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                          The Cartographer of Lost Places
                        </p>
                        <p className="mt-2 text-sm text-white/50">Aravind Mehta</p>
                      </div>
                    </div>
                    <div className="absolute inset-y-0 left-0 w-2 bg-black/25" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
                  </div>
                </div>
              </motion.div>
            </div>
          </Reveal>

          {/* Right: content */}
          <div>
            <Reveal>
              <p className="label-eyebrow mb-4 text-accent">Book of the Month</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-h2 font-serif text-ink">
                The Cartographer<br />of <span className="italic font-light">Lost</span> Places
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-3 text-ink-soft">
                by <Link to="/authors/aravind-mehta" className="text-accent hover:underline">Aravind Mehta</Link>
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 max-w-lg text-body text-ink-soft">
                A sweeping novel about a mapmaker who walks the borders of forgotten towns, drawing what no one else remembers. A meditation on place, memory, and the quiet violence of erasure.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-6 flex items-center gap-4">
                <Rating value={4.5} count={128} size="md" />
              </div>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="mt-8">
                <Price amount={599} originalAmount={799} size="lg" />
                <p className="mt-1 text-xs text-ink-faint">Inclusive of all taxes</p>
              </div>
            </Reveal>
            <Reveal delay={0.6}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button ref={magneticRef} size="md" variant="primary" className="magnetic">
                  Add to Cart
                  <ArrowRight className="w-4 h-4 btn-arrow" />
                </Button>
                <Link to="/books/the-cartographer-of-lost-places">
                  <Button size="md" variant="outline">View Details</Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
