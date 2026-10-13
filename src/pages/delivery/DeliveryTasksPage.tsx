import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  Navigation,
  Package,
  Phone,
  Search,
  Truck,
} from 'lucide-react';
import { money } from '../../data/products';
import { useShop, type OrderStatus } from '../../store/shop';

export default function DeliveryTasksPage() {
  const deliveryBoys = useShop((s) => s.deliveryBoys);
  const activeDeliveryBoyId = useShop((s) => s.activeDeliveryBoyId);
  const orders = useShop((s) => s.orders);
  const updateOrderStatus = useShop((s) => s.updateOrderStatus);
  const user = useShop((s) => s.user);

  const currentBoy =
    deliveryBoys.find((b) => (user?.deliveryBoyId && b.id === user.deliveryBoyId) || b.accountEmail === user?.email) ||
    deliveryBoys.find((b) => b.id === activeDeliveryBoyId) ||
    deliveryBoys[0];

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_transit' | 'delivered'>('all');

  const myOrders = orders.filter((o) => o.assignedDeliveryBoyId === currentBoy?.id);

  const filtered = myOrders.filter((o) => {
    if (filter === 'pending' && o.status !== 'Packed') return false;
    if (filter === 'in_transit' && o.status !== 'Shipped' && o.status !== 'Out for delivery') return false;
    if (filter === 'delivered' && o.status !== 'Delivered') return false;

    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="adm-header">
        <div>
          <h1 className="adm-title">All Assigned Deliveries</h1>
          <p className="adm-subtitle">Full roster of parcels assigned to {currentBoy?.name} ({currentBoy?.id}).</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={16} className="adm-search-icon" />
          <input
            type="text"
            className="adm-search-input"
            placeholder="Search tasks by order ID, address or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="adm-filter-tabs">
          <button
            type="button"
            className={`adm-tab${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks ({myOrders.length})
          </button>
          <button
            type="button"
            className={`adm-tab${filter === 'in_transit' ? ' active' : ''}`}
            onClick={() => setFilter('in_transit')}
          >
            In Transit ({myOrders.filter((o) => o.status === 'Shipped' || o.status === 'Out for delivery').length})
          </button>
          <button
            type="button"
            className={`adm-tab${filter === 'delivered' ? ' active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Completed ({myOrders.filter((o) => o.status === 'Delivered').length})
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div>
        {filtered.length === 0 ? (
          <div
            style={{
              background: 'var(--st-card)',
              border: '1px solid var(--st-line)',
              borderRadius: 20,
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h3 style={{ margin: 0, fontSize: 16 }}>No deliveries found for this filter</h3>
          </div>
        ) : (
          filtered.map((order) => {
            const isDelivered = order.status === 'Delivered';
            return (
              <div key={order.id} className="del-task-list-item">
                <div className="adm-break">
                  <div className="del-task-meta">
                    <strong style={{ fontFamily: 'monospace', color: 'var(--st-accent)', fontSize: 14 }}>
                      {order.id}
                    </strong>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 600,
                        background: isDelivered ? 'rgba(74, 222, 128, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: isDelivered ? '#4ade80' : '#60a5fa',
                      }}
                    >
                      {order.status}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--st-mute)' }}>
                      {new Date(order.placedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: 15 }}>{order.customerName}</div>
                  <div style={{ color: 'var(--st-mute)', fontSize: 13, marginTop: 2 }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                    {order.address}, {order.city}
                  </div>

                  {order.deliveryNotes && (
                    <div style={{ fontSize: 12, color: '#4ade80', marginTop: 4 }}>
                      Note: {order.deliveryNotes}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{money(order.total)}</div>
                  <div style={{ fontSize: 12, color: order.paymentMethod === 'cod' ? '#facc15' : '#4ade80', marginTop: 2 }}>
                    {order.paymentMethod.toUpperCase()}
                  </div>

                  <div className="adm-actions-row" style={{ marginTop: 10, justifyContent: 'flex-end' }}>
                    <a
                      href={`tel:${order.phone}`}
                      className="adm-tool-btn"
                      style={{ padding: '6px 10px', fontSize: 12 }}
                    >
                      <Phone size={12} /> Call
                    </a>
                    {!isDelivered && (
                      <button
                        type="button"
                        className="del-btn-delivered"
                        style={{ padding: '6px 14px', fontSize: 12 }}
                        onClick={() => updateOrderStatus(order.id, 'Delivered', 'Delivered by courier partner')}
                      >
                        <CheckCircle2 size={13} /> Deliver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

