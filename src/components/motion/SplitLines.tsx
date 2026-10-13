import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SplitLinesProps {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  stagger?: number;
}

export function SplitLines({ lines, className, delay = 0, stagger = 0.12 }: SplitLinesProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();

  if (reduced) {
    return <h1 className={className}>{lines.map((l, i) => <span key={i}>{l}</span>)}</h1>;
  }

  return (
    <h1 ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : { y: '110%' }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
