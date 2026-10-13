import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, BadgeCheck } from 'lucide-react';

const messages = [
  { icon: Truck, text: 'Free shipping on orders over \u20B9499' },
  { icon: ShieldCheck, text: 'Secure payment via Razorpay and Stripe' },
  { icon: RotateCcw, text: '7-day returns on damaged books' },
  { icon: BadgeCheck, text: 'Authentic publisher-sourced books' },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="relative z-[99] flex h-9 items-center justify-center overflow-hidden bg-ink text-bg-0"
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container-shell flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="flex items-center gap-2 text-xs font-medium tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {(() => {
                  const Icon = messages[index].icon;
                  return <Icon className="w-3.5 h-3.5 text-accent" />;
                })()}
                <span>{messages[index].text}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
