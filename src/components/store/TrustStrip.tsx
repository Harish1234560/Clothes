import { Truck, ShieldCheck, RotateCcw, BadgeCheck } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

const items = [
  { icon: Truck, title: 'Free Shipping', text: 'On orders over \u20B9499' },
  { icon: ShieldCheck, title: 'Secure Payment', text: 'Razorpay & Stripe' },
  { icon: RotateCcw, title: '7-Day Returns', text: 'On damaged books' },
  { icon: BadgeCheck, title: 'Authentic Sources', text: 'Direct from publishers' },
];

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-bg-1 py-10">
      <div className="container-shell">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="flex flex-col items-center gap-3 text-center md:flex-row md:text-left">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-ink-faint">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
