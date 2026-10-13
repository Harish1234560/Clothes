import { useState } from 'react';
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Package,
  Phone,
  Power,
  ShieldCheck,
  Star,
  Truck,
  User,
  X,
} from 'lucide-react';
import { money } from '../../data/products';
import { useShop, type FullOrder } from '../../store/shop';

export default function DeliveryDashboard() {
  const deliveryBoys = useShop((s) => s.deliveryBoys);
  const activeDeliveryBoyId = useShop((s) => s.activeDeliveryBoyId);
  const toggleDeliveryDuty = useShop((s) => s.toggleDeliveryDuty);
  const orders = useShop((s) => s.orders);
  const updateOrderStatus = useShop((s) => s.updateOrderStatus);
  const user = useShop((s) => s.user);

  const currentBoy =
    deliveryBoys.find((b) => (user?.deliveryBoyId && b.id === user.deliveryBoyId) || b.accountEmail === user?.email) ||
    deliveryBoys.find((b) => b.id === activeDeliveryBoyId) ||
    deliveryBoys[0];
  const isOnline = currentBoy?.status === 'on_duty';

  const [confirmModalOrder, setConfirmModalOrder] = useState<FullOrder | null>(null);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [cashCollected, setCashCollected] = useState(true);

  // My assigned active orders
  const myActiveOrders = orders.filter(
    (o) =>
      o.assignedDeliveryBoyId === currentBoy?.id &&
      (o.status === 'Packed' || o.status === 'Shipped' || o.status === 'Out for delivery'),
  );

  const myDeliveredOrders = orders.filter(
    (o) => o.assignedDeliveryBoyId === currentBoy?.id && o.status === 'Delivered',
  );

  const totalCodToCollect = myActiveOrders
    .filter((o) => o.paymentMethod === 'cod')
    .reduce((sum, o) => sum + o.total, 0);

  const handleCompleteDelivery = () => {
    if (!confirmModalOrder) return;
    updateOrderStatus(
      confirmModalOrder.id,
      'Delivered',
      deliveryNote.trim() || 'Handed directly to recipient',
    );
    setConfirmModalOrder(null);
    setDeliveryNote('');
  };

  return (
    <div>
      {/* Shift Banner */}
      <div className={`del-duty-banner ${isOnline ? 'online' : 'offline'}`}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 99,
                background: isOnline ? '#22c55e' : '#ef4444',
                boxShadow: isOnline ? '0 0 10px #22c55e' : 'none',
              }}
            />
            <strong style={{ fontSize: 16 }} className="adm-break">
              {isOnline ? `You are Online & On Duty (${currentBoy.name})` : `You are currently Offline (${currentBoy.name})`}
            </strong>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--st-mute)', fontSize: 13 }}>
            {isOnline
              ? `Assigned Zone: ${currentBoy.zone} • Vehicle: ${currentBoy.vehicle} (${currentBoy.vehicleNumber})`
              : 'Turn on your duty switch to receive new pick-ups and assignments.'}
          </p>
        </div>

        <button
          type="button"
          className={`del-duty-toggle ${isOnline ? 'online' : 'offline'}`}
          style={{ padding: '9px 18px', fontSize: 13 }}
          onClick={() => toggleDeliveryDuty(currentBoy.id)}
        >
          <Power size={14} />
          {isOnline ? 'End Shift (Go Offline)' : 'Start Shift (Go Online)'}
        </button>
      </div>

      {/* Rider KPI Metrics */}
      <div className="del-stats-grid">
        <div className="del-stat-box">
          <span className="del-stat-lbl">Active Parcels</span>
          <div className="del-stat-num" style={{ color: '#60a5fa' }}>{myActiveOrders.length}</div>
          <small style={{ color: 'var(--st-mute)' }}>In queue for delivery</small>
        </div>

        <div className="del-stat-box">
          <span className="del-stat-lbl">COD Cash To Collect</span>
          <div className="del-stat-num" style={{ color: '#facc15' }}>{money(totalCodToCollect)}</div>
          <small style={{ color: 'var(--st-mute)' }}>Cash on delivery orders</small>
        </div>

        <div className="del-stat-box">
          <span className="del-stat-lbl">Completed Today</span>
          <div className="del-stat-num" style={{ color: '#4ade80' }}>{myDeliveredOrders.length}</div>
          <small style={{ color: 'var(--st-mute)' }}>Delivered successfully</small>
        </div>

        <div className="del-stat-box">
          <span className="del-stat-lbl">Customer Rating</span>
          <div className="del-stat-num" style={{ color: '#facc15', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={22} fill="#facc15" color="#facc15" /> {currentBoy.rating}
          </div>
          <small style={{ color: 'var(--st-mute)' }}>Top rated courier partner</small>
        </div>
      </div>

      {/* Active Delivery Queue Section */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
          <div className="adm-break">
            <h2 className="del-section-title">Active Deliveries Queue</h2>
            <p style={{ margin: '2px 0 0', color: 'var(--st-mute)', fontSize: 13 }}>
              Live customer parcels assigned to your route.
            </p>
          </div>
        </div>

        {myActiveOrders.length === 0 ? (
          <div
            style={{
              background: 'var(--st-card)',
              border: '1px solid var(--st-line)',
              borderRadius: 20,
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <CheckCircle2 size={42} color="#4ade80" style={{ margin: '0 auto 14px' }} />
            <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>All caught up!</h3>
            <p style={{ margin: 0, color: 'var(--st-mute)', fontSize: 14 }}>
              You have no pending deliveries assigned right now. Keep your duty status Online to accept new parcels from the warehouse.
            </p>
          </div>
        ) : (
          myActiveOrders.map((order) => {
            const isOut = order.status === 'Out for delivery';
            const isCod = order.paymentMethod === 'cod';
            return (
              <div
                key={order.id}
                className={`del-task-card${isOut ? ' active-run' : ''}`}
              >
                {/* Header */}
                <div className="del-task-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {order.id}
                    </span>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 99,
                        fontSize: 12,
                        fontWeight: 600,
                        background: isOut ? 'rgba(251, 146, 60, 0.15)' : 'rgba(196, 181, 253, 0.15)',
                        color: isOut ? '#fb923c' : '#c4b5fd',
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <span className={`del-pay-pill ${isCod ? 'del-pay-cod' : 'del-pay-prepaid'}`}>
                    {isCod ? `COD: Collect ${money(order.total)}` : 'PREPAID (₹0 to Collect)'}
                  </span>
                </div>

                {/* Customer Row */}
                <div className="del-customer-row">
                  <div>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }} className="adm-break">{order.customerName}</h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--st-mute)', fontSize: 13 }} className="adm-break">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}:{' '}
                      {order.items.map((i) => `${i.name} (${i.size})`).join(', ')}
                    </p>
                  </div>

                  <a
                    href={`tel:${order.phone}`}
                    className="del-call-btn"
                    title={`Call ${order.customerName}`}
                  >
                    <Phone size={14} /> Call Customer
                  </a>
                </div>

                {/* Address Box */}
                <div className="del-addr-box">
                  <MapPin size={18} color="#60a5fa" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{order.address}</div>
                    <div style={{ color: 'var(--st-mute)', fontSize: 13, marginTop: 2 }}>
                      {order.city}, {order.state} - {order.zip}
                    </div>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${order.address}, ${order.city}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="adm-tool-btn"
                    style={{ fontSize: 12, padding: '4px 8px', alignSelf: 'center' }}
                  >
                    <Navigation size={13} /> Maps
                  </a>
                </div>

                {/* Status Actions */}
                <div className="del-action-grid">
                  {!isOut ? (
                    <button
                      type="button"
                      className="del-btn-out"
                      onClick={() => updateOrderStatus(order.id, 'Out for delivery')}
                    >
                      <Truck size={16} /> Start Delivery (Out For Delivery)
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fb923c', fontSize: 13, fontWeight: 600 }}>
                      <Clock size={16} /> Parcel is on vehicle — Out for delivery
                    </div>
                  )}

                  <button
                    type="button"
                    className="del-btn-delivered"
                    onClick={() => {
                      setConfirmModalOrder(order);
                      setDeliveryNote('');
                    }}
                  >
                    <CheckCircle2 size={16} /> Mark as Delivered
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirm Delivery Modal */}
      {confirmModalOrder && (
        <div className="adm-modal-backdrop" onClick={() => setConfirmModalOrder(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={24} color="#4ade80" />
                <h2 className="adm-modal-title">Confirm Delivery</h2>
              </div>
              <button
                type="button"
                className="adm-modal-close"
                onClick={() => setConfirmModalOrder(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'var(--st-card2)', padding: 16, borderRadius: 14, marginBottom: 18 }}>
              <div className="del-modal-kv">
                <span style={{ color: 'var(--st-mute)' }}>Order ID:</span>
                <strong>{confirmModalOrder.id}</strong>
              </div>
              <div className="del-modal-kv">
                <span style={{ color: 'var(--st-mute)' }}>Customer:</span>
                <strong>{confirmModalOrder.customerName}</strong>
              </div>
              <div className="del-modal-kv">
                <span style={{ color: 'var(--st-mute)' }}>Amount:</span>
                <strong style={{ color: confirmModalOrder.paymentMethod === 'cod' ? '#facc15' : '#4ade80' }}>
                  {money(confirmModalOrder.total)} ({confirmModalOrder.paymentMethod.toUpperCase()})
                </strong>
              </div>
            </div>

            {confirmModalOrder.paymentMethod === 'cod' && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(234, 179, 8, 0.1)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 18,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={cashCollected}
                  onChange={(e) => setCashCollected(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#facc15' }}>
                  Cash of {money(confirmModalOrder.total)} collected from customer
                </span>
              </label>
            )}

            <div className="adm-form-group">
              <label className="adm-label">Delivery Remarks / Handoff Note</label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. Handed to customer at doorstep / Security desk"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
              />
            </div>

            <div className="del-modal-actions">
              <button
                type="button"
                className="adm-btn-secondary"
                onClick={() => setConfirmModalOrder(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="del-btn-delivered"
                onClick={handleCompleteDelivery}
              >
                <CheckCircle2 size={16} /> Complete & Mark Delivered
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

