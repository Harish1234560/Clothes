import {
  Banknote,
  CheckCircle2,
  Clock,
  DollarSign,
  History,
  MapPin,
  TrendingUp,
  User,
} from 'lucide-react';
import { money } from '../../data/products';
import { useShop } from '../../store/shop';

export default function DeliveryHistoryPage() {
  const deliveryBoys = useShop((s) => s.deliveryBoys);
  const activeDeliveryBoyId = useShop((s) => s.activeDeliveryBoyId);
  const orders = useShop((s) => s.orders);
  const user = useShop((s) => s.user);

  const currentBoy =
    deliveryBoys.find((b) => (user?.deliveryBoyId && b.id === user.deliveryBoyId) || b.accountEmail === user?.email) ||
    deliveryBoys.find((b) => b.id === activeDeliveryBoyId) ||
    deliveryBoys[0];

  const deliveredOrders = orders.filter(
    (o) => o.assignedDeliveryBoyId === currentBoy?.id && o.status === 'Delivered',
  );

  const RATE_PER_DELIVERY = 80;
  const totalPayout = deliveredOrders.length * RATE_PER_DELIVERY;

  const totalCodCollected = deliveredOrders
    .filter((o) => o.paymentMethod === 'cod')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <div className="adm-header">
        <div>
          <h1 className="adm-title">Delivery History & Payouts</h1>
          <p className="adm-subtitle">Completed orders, courier compensation & COD cash reconciliation.</p>
        </div>
      </div>

      {/* Payout & Earnings Summary */}
      <div className="del-stats-grid" style={{ marginBottom: 28 }}>
        <div className="del-stat-box" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), var(--st-card))' }}>
          <span className="del-stat-lbl">Courier Payout Earned</span>
          <div className="del-stat-num" style={{ color: '#4ade80' }}>{money(totalPayout)}</div>
          <small style={{ color: 'var(--st-mute)' }}>₹{RATE_PER_DELIVERY} fixed fee per delivered parcel</small>
        </div>

        <div className="del-stat-box" style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12), var(--st-card))' }}>
          <span className="del-stat-lbl">COD Cash Reconciled</span>
          <div className="del-stat-num" style={{ color: '#facc15' }}>{money(totalCodCollected)}</div>
          <small style={{ color: 'var(--st-mute)' }}>Collected from customers & remitted to hub</small>
        </div>

        <div className="del-stat-box">
          <span className="del-stat-lbl">Deliveries Completed</span>
          <div className="del-stat-num" style={{ color: '#60a5fa' }}>{deliveredOrders.length}</div>
          <small style={{ color: 'var(--st-mute)' }}>100% on-time fulfillment score</small>
        </div>
      </div>

      {/* History List */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Completed Deliveries Log</h2>

      <div className="adm-table-card">
        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Delivered Time</th>
                <th>Amount & Type</th>
                <th>Courier Fee</th>
                <th>Proof / Note</th>
              </tr>
            </thead>
            <tbody>
              {deliveredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--st-mute)' }}>
                    No completed deliveries yet. Active deliveries will show here once marked delivered!
                  </td>
                </tr>
              ) : (
                deliveredOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong style={{ fontFamily: 'monospace', color: 'var(--st-accent)' }}>{o.id}</strong>
                    </td>
                    <td>
                      <strong>{o.customerName}</strong>
                      <div style={{ fontSize: 12, color: 'var(--st-mute)' }}>{o.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{o.city}, {o.state}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, color: 'var(--st-mute)' }}>
                        {o.deliveredAt
                          ? new Date(o.deliveredAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : new Date(o.placedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                      </span>
                    </td>
                    <td>
                      <strong>{money(o.total)}</strong>
                      <span
                        style={{
                          display: 'inline-block',
                          marginLeft: 6,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: o.paymentMethod === 'cod' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: o.paymentMethod === 'cod' ? '#facc15' : '#4ade80',
                        }}
                      >
                        {o.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#4ade80' }}>+{money(RATE_PER_DELIVERY)}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4ade80' }}>
                        <CheckCircle2 size={13} /> {o.deliveryNotes || 'Delivered to customer'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

