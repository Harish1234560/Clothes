import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Eye,
  Filter,
  MapPin,
  Package,
  Phone,
  Search,
  Truck,
  User,
  X,
} from 'lucide-react';
import { money } from '../../data/products';
import { useShop, type FullOrder, type OrderStatus } from '../../store/shop';

export default function AdminOrdersPage() {
  const orders = useShop((s) => s.orders);
  const deliveryBoys = useShop((s) => s.deliveryBoys);
  const updateOrderStatus = useShop((s) => s.updateOrderStatus);
  const assignDeliveryBoy = useShop((s) => s.assignDeliveryBoy);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<FullOrder | null>(null);

  const filterTabs: Array<'All' | OrderStatus> = [
    'All',
    'Placed',
    'Packed',
    'Shipped',
    'Out for delivery',
    'Delivered',
    'Cancelled',
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    const map: Record<OrderStatus, string> = {
      Placed: 'adm-status-placed',
      Packed: 'adm-status-packed',
      Shipped: 'adm-status-shipped',
      'Out for delivery': 'adm-status-out-for-delivery',
      Delivered: 'adm-status-delivered',
      Cancelled: 'adm-status-cancelled',
    };
    return map[status] || 'adm-status-placed';
  };

  return (
    <div>
      <div className="adm-header">
        <div>
          <h1 className="adm-title">Order Management</h1>
          <p className="adm-subtitle">Track, fulfill, and assign deliveries for all customer orders.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={16} className="adm-search-icon" />
          <input
            type="text"
            className="adm-search-input"
            placeholder="Search by Order ID, name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="adm-filter-tabs">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`adm-tab${statusFilter === tab ? ' active' : ''}`}
              onClick={() => setStatusFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="adm-table-card">
        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Shipping Address</th>
                <th>Total</th>
                <th>Status</th>
                <th>Assigned Courier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--st-mute)' }}>
                    <Package size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontWeight: 500 }}>No orders found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const assignedBoy = deliveryBoys.find((b) => b.id === o.assignedDeliveryBoyId);
                  return (
                    <tr key={o.id}>
                      <td>
                        <strong style={{ fontFamily: 'monospace', color: 'var(--st-accent)', fontSize: 14 }}>
                          {o.id}
                        </strong>
                        <div style={{ fontSize: 12, color: 'var(--st-mute)', marginTop: 2 }}>
                          {new Date(o.placedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }} className="adm-break">{o.customerName}</div>
                        <div style={{ fontSize: 12, color: 'var(--st-mute)' }}>{o.phone}</div>
                        <div style={{ fontSize: 11, color: 'var(--st-mute)' }} className="adm-break">{o.email}</div>
                      </td>

                      <td>
                        <div style={{ fontSize: 13, maxWidth: 220, lineHeight: 1.4 }}>
                          {o.address}, {o.city}, {o.state} - {o.zip}
                        </div>
                      </td>

                      <td>
                        <strong>{money(o.total)}</strong>
                        <div style={{ fontSize: 11, color: o.paymentMethod === 'cod' ? '#facc15' : '#4ade80' }}>
                          {o.paymentMethod.toUpperCase()}
                        </div>
                      </td>

                      <td>
                        <span className={`adm-status-badge ${getStatusBadge(o.status)}`}>
                          {o.status}
                        </span>
                      </td>

                      <td>
                        <select
                          className="adm-select"
                          style={{ padding: '6px 10px', fontSize: 12, maxWidth: 170 }}
                          value={o.assignedDeliveryBoyId || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              assignDeliveryBoy(o.id, e.target.value);
                            }
                          }}
                        >
                          <option value="">-- Assign Rider --</option>
                          {deliveryBoys.map((boy) => (
                            <option key={boy.id} value={boy.id}>
                              {boy.name} ({boy.status === 'on_duty' ? '🟢 Online' : '⚪ ' + boy.status})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <div className="adm-actions-row">
                          <button
                            type="button"
                            className="adm-tool-btn"
                            style={{ padding: '6px 10px', fontSize: 12 }}
                            title="View Order Details"
                            onClick={() => setSelectedOrder(o)}
                          >
                            <Eye size={13} /> View
                          </button>

                          {o.status !== 'Delivered' && o.status !== 'Cancelled' && (
                            <button
                              type="button"
                              className="adm-tool-btn"
                              style={{ padding: '6px 10px', fontSize: 12, color: '#4ade80' }}
                              title="Advance Status"
                              onClick={() => {
                                const next: Record<OrderStatus, OrderStatus> = {
                                  Placed: 'Packed',
                                  Packed: 'Shipped',
                                  Shipped: 'Out for delivery',
                                  'Out for delivery': 'Delivered',
                                  Delivered: 'Delivered',
                                  Cancelled: 'Cancelled',
                                };
                                updateOrderStatus(o.id, next[o.status]);
                              }}
                            >
                              Next →
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="adm-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <span className={`adm-status-badge ${getStatusBadge(selectedOrder.status)}`} style={{ marginBottom: 6 }}>
                  {selectedOrder.status}
                </span>
                <h2 className="adm-modal-title">Order {selectedOrder.id}</h2>
              </div>
              <button
                type="button"
                className="adm-modal-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div style={{ background: 'var(--st-card2)', padding: 18, borderRadius: 16, marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 10px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--st-mute)' }}>
                Customer & Destination
              </h4>
              <div className="adm-form-row">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <User size={14} color="var(--st-accent)" /> {selectedOrder.customerName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--st-mute)', marginTop: 4 }}>
                    <Phone size={12} style={{ display: 'inline', marginRight: 4 }} /> {selectedOrder.phone}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--st-mute)' }}>{selectedOrder.email}</div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13 }}>
                    <MapPin size={14} color="var(--st-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      {selectedOrder.address}<br />
                      {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip}<br />
                      {selectedOrder.country}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <h4 style={{ margin: '0 0 10px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--st-mute)' }}>
              Items in Parcel ({selectedOrder.items.length})
            </h4>
            <div style={{ marginBottom: 20 }}>
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--st-line)',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 14 }} className="adm-break">{item.name}</strong>
                    <div style={{ fontSize: 12, color: 'var(--st-mute)' }}>
                      Size: {item.size} • Color: {item.color} • Qty: {item.qty}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>{money(item.price * item.qty)}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ background: 'var(--st-bg)', padding: 16, borderRadius: 14, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>Subtotal</span>
                <span>{money(selectedOrder.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>Delivery</span>
                <span>{selectedOrder.shipping === 0 ? 'FREE' : money(selectedOrder.shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, paddingTop: 8, borderTop: '1px solid var(--st-line)' }}>
                <span>Total ({selectedOrder.paymentMethod.toUpperCase()})</span>
                <span style={{ color: 'var(--st-accent)' }}>{money(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Actions in Modal */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="adm-btn-secondary"
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'Cancelled');
                  setSelectedOrder(null);
                }}
              >
                Cancel Order
              </button>
              <button
                type="button"
                className="adm-btn-primary"
                onClick={() => {
                  const next: Record<OrderStatus, OrderStatus> = {
                    Placed: 'Packed',
                    Packed: 'Shipped',
                    Shipped: 'Out for delivery',
                    'Out for delivery': 'Delivered',
                    Delivered: 'Delivered',
                    Cancelled: 'Cancelled',
                  };
                  updateOrderStatus(selectedOrder.id, next[selectedOrder.status]);
                  setSelectedOrder({ ...selectedOrder, status: next[selectedOrder.status] });
                }}
              >
                Advance to Next Step
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

