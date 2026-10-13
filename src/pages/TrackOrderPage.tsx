import { useState, type FormEvent } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import Field, { isEmail } from '../components/Field';
import PageShell from '../components/PageShell';
import { useShop } from '../store/shop';

const steps = ['Order placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
const DAY = 86400000;
const fmt = (t: number) => new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

type Result = { id: string; stage: number; base: number; real: boolean };

export default function TrackOrderPage() {
  const lastOrder = useShop((s) => s.lastOrder);
  const orders = useShop((s) => s.orders);
  const deliveryBoys = useShop((s) => s.deliveryBoys);
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result & { deliveryBoyName?: string; statusText?: string } | null>(null);

  const statusMap: Record<string, number> = {
    Placed: 0,
    Packed: 1,
    Shipped: 2,
    'Out for delivery': 3,
    Delivered: 4,
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (id.trim().length < 4) er.id = 'Enter your order number';
    if (!isEmail(email)) er.email = 'Enter a valid email';
    setErrors(er);
    if (Object.keys(er).length) return;
    const code = id.trim().toUpperCase();

    // Check full orders first
    const full = orders.find(
      (o) => o.id.toUpperCase() === code && o.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (full) {
      const stage = statusMap[full.status] ?? 0;
      const boy = deliveryBoys.find((b) => b.id === full.assignedDeliveryBoyId);
      setResult({
        id: code,
        stage,
        base: full.placedAt,
        real: true,
        deliveryBoyName: boy ? `${boy.name} (${boy.vehicle})` : undefined,
        statusText: full.status,
      });
      return;
    }

    if (lastOrder && lastOrder.id.toUpperCase() === code && lastOrder.email.toLowerCase() === email.trim().toLowerCase()) {
      const stage = Math.min(4, Math.floor((Date.now() - lastOrder.placedAt) / DAY));
      setResult({ id: code, stage, base: lastOrder.placedAt, real: true });
    } else {
      setErrors({ form: `No active order found with number "${code}" and email "${email.trim()}". Please verify your order confirmation.` });
      setResult(null);
    }
  };

  return (
    <PageShell
      title="Track Your Order | STORE Delivery Status"
      description="Track your STORE order in real time. Enter your order ID and email to view packaging, dispatch, and courier partner delivery status."
    >
      <div className="st-wrap">
        <Breadcrumbs items={[{ label: 'Track Order' }]} />
        <div className="st-auth st-box" style={{ maxWidth: 560 }}>
          <h1>Track Order</h1>
          <p className="sub">Enter your order number and email to see the latest status.</p>
          <form className="st-form" onSubmit={submit} noValidate>
            {errors.form && <div className="st-alert bad" role="alert">{errors.form}</div>}
            <Field id="oid" label="Order number" placeholder="ST-12345678" value={id} onChange={setId} error={errors.id} />
            <Field id="oem" label="Email" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" />
            <button type="submit" className="st-btn primary block">Track</button>
          </form>

          {result && (
            <div style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong>Order {result.id}</strong>
                {result.statusText && (
                  <span className="st-pill" style={{ background: 'var(--st-card2)', color: 'var(--st-accent)', padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                    {result.statusText}
                  </span>
                )}
              </div>

              {result.deliveryBoyName && (
                <div style={{ background: 'var(--st-card2)', padding: '12px 16px', borderRadius: 12, marginBottom: 16, fontSize: 13 }}>
                  <span style={{ color: 'var(--st-mute)', display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Delivery Partner</span>
                  <strong>{result.deliveryBoyName}</strong>
                </div>
              )}

              <ol className="st-steps">
                {steps.map((s, i) => (
                  <li key={s} className={i <= result.stage ? 'done' : ''}>
                    <strong>{s}</strong>
                    <small>{i <= result.stage ? fmt(result.base + i * DAY) : 'Pending'}</small>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
