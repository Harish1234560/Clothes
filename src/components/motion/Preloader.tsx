import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDone(true);
      return;
    }
    const visited = sessionStorage.getItem('bookstore-visited');
    if (visited) {
      setDone(true);
      return;
    }
    sessionStorage.setItem('bookstore-visited', '1');
    const timer = setTimeout(() => setDone(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h1
              className="font-serif text-5xl font-medium text-bg-0"
              initial={{ letterSpacing: '0.1em' }}
              animate={{ letterSpacing: '0.4em' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              ATHENAEUM
            </motion.h1>
            <motion.div
              className="mx-auto mt-6 h-px bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              style={{ width: '80px' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
