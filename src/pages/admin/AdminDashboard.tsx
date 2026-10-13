import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import { money } from '../../data/products';
import { useShop, type OrderStatus } from '../../store/shop';

export default function AdminDashboard() {
  const orders = useShop((s) => s.orders);
  const products = useShop((s) => s.adminProducts);
  const deliveryBoys = useShop((s) => s.deliveryBoys);
  const updateOrderStatus = useShop((s) => s.updateOrderStatus);

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.status === 'Placed' || o.status === 'Packed').length;
  const inTransitCount = orders.filter((o) => o.status === 'Shipped' || o.status === 'Out for delivery').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const onDutyBoys = deliveryBoys.filter((b) => b.status === 'on_duty').length;

  const recentOrders = orders.slice(0, 6);

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
          <h1 className="adm-title">Business Overview</h1>
          <p className="adm-subtitle">Real-time storefront, fulfillment & delivery operations.</p>
        </div>
        <div className="adm-header-actions">
          <Link to="/admin/orders" className="adm-btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Package size={15} /> All Orders
          </Link>
          <Link to="/admin/products" className="adm-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Plus size={15} /> Add Product
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="adm-metrics-grid">
        <div className="adm-metric-card">
          <div>
            <p className="adm-metric-title">TOTAL REVENUE</p>
            <h2 className="adm-metric-val">{money(totalRevenue)}</h2>
            <p className="adm-metric-subtitle" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={13} /> Across {orders.length} orders
            </p>
          </div>
          <div className="adm-metric-icon">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="adm-metric-card">
          <div>
            <p className="adm-metric-title">PENDING FULFILLMENT</p>
            <h2 className="adm-metric-val">{pendingCount}</h2>
            <p className="adm-metric-subtitle" style={{ color: pendingCount > 0 ? '#facc15' : 'var(--st-mute)' }}>
              {pendingCount} need packing / dispatch
            </p>
          </div>
          <div className="adm-metric-icon" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#facc15' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="adm-metric-card">
          <div>
            <p className="adm-metric-title">OUT FOR DELIVERY</p>
            <h2 className="adm-metric-val">{inTransitCount}</h2>
            <p className="adm-metric-subtitle">
              {deliveredCount} completed successfully
            </p>
          </div>
          <div className="adm-metric-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
            <Truck size={22} />
          </div>
        </div>

        <div className="adm-metric-card">
          <div>
            <p className="adm-metric-title">ACTIVE RIDERS</p>
            <h2 className="adm-metric-val">{onDutyBoys} / {deliveryBoys.length}</h2>
            <p className="adm-metric-subtitle">
              {products.length} products in catalogue
            </p>
          </div>
          <div className="adm-metric-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80' }}>
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="adm-split-grid">
        <div className="adm-table-card" style={{ flex: 2 }}>
          <div className="adm-card-head">
            <div className="adm-break">
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Recent Orders</h3>
              <p style={{ margin: '2px 0 0', color: 'var(--st-mute)', fontSize: 13 }}>Latest orders received across the store.</p>
            </div>
            <Link to="/admin/orders" className="adm-inline-link">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="adm-table-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '42px 16px', color: 'var(--st-mute)' }}>
                      <Package size={34} style={{ margin: '0 auto 10px', opacity: 0.4, display: 'block' }} />
                      <div style={{ fontWeight: 600, color: 'var(--st-fg)', marginBottom: 4 }}>No orders yet</div>
                      <div style={{ fontSize: 13 }}>New customer orders placed in the store will appear here in real-time.</div>
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => {
                    const assignedBoy = deliveryBoys.find((b) => b.id === o.assignedDeliveryBoyId);
                    return (
                    <tr key={o.id}>
                      <td>
                        <strong style={{ fontFamily: 'monospace', color: 'var(--st-accent)' }}>{o.id}</strong>
                        <div style={{ fontSize: 11, color: 'var(--st-mute)' }}>
                          {new Date(o.placedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }} className="adm-break">{o.customerName}</div>
                        <div style={{ fontSize: 12, color: 'var(--st-mute)' }}>{o.city}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: 13 }}>{o.items.length} item{o.items.length > 1 ? 's' : ''}</span>
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
                        {assignedBoy && (
                          <div style={{ fontSize: 11, color: 'var(--st-mute)', marginTop: 4 }}>
                            Courier: {assignedBoy.name.split(' ')[0]}
                          </div>
                        )}
                      </td>
                      <td>
                        {o.status === 'Placed' && (
                          <button
                            type="button"
                            className="adm-tool-btn"
                            style={{ fontSize: 12, padding: '4px 8px' }}
                            onClick={() => updateOrderStatus(o.id, 'Packed')}
                          >
                            Mark Packed
                          </button>
                        )}
                        {o.status === 'Packed' && (
                          <Link
                            to="/admin/orders"
                            className="adm-tool-btn"
                            style={{ fontSize: 12, padding: '4px 8px', color: 'var(--st-accent)' }}
                          >
                            Assign Courier
                          </Link>
                        )}
                        {o.status === 'Shipped' && (
                          <button
                            type="button"
                            className="adm-tool-btn"
                            style={{ fontSize: 12, padding: '4px 8px' }}
                            onClick={() => updateOrderStatus(o.id, 'Out for delivery')}
                          >
                            Out for Delivery
                          </button>
                        )}
                        {o.status === 'Out for delivery' && (
                          <button
                            type="button"
                            className="adm-tool-btn"
                            style={{ fontSize: 12, padding: '4px 8px', color: '#4ade80' }}
                            onClick={() => updateOrderStatus(o.id, 'Delivered')}
                          >
                            <CheckCircle2 size={12} /> Delivered
                          </button>
                        )}
                        {o.status === 'Delivered' && (
                          <span style={{ color: '#4ade80', fontSize: 12 }}>Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Fleet Quick Card */}
        <div className="adm-table-card">
          <div className="adm-card-head">
            <div className="adm-break">
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Delivery Fleet</h3>
              <p style={{ margin: '2px 0 0', color: 'var(--st-mute)', fontSize: 13 }}>Riders active and on-call.</p>
            </div>
            <Link to="/admin/delivery" className="adm-inline-link">
              Manage <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ padding: '16px 12px' }}>
            {deliveryBoys.map((boy) => (
              <div key={boy.id} className="adm-fleet-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: boy.status === 'on_duty' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      color: boy.status === 'on_duty' ? '#4ade80' : 'var(--st-mute)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Truck size={18} />
                  </div>
                  <div className="adm-break">
                    <strong style={{ fontSize: 14 }}>{boy.name}</strong>
                    <div style={{ fontSize: 12, color: 'var(--st-mute)' }}>{boy.vehicle} • {boy.zone.split('&')[0]}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 99,
                      background: boy.status === 'on_duty' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(107, 114, 128, 0.2)',
                      color: boy.status === 'on_duty' ? '#4ade80' : '#9ca3af',
                    }}
                  >
                    {boy.status === 'on_duty' ? 'On Duty' : boy.status === 'available' ? 'Available' : 'Offline'}
                  </span>
                  <div style={{ fontSize: 11, color: 'var(--st-mute)', marginTop: 3 }}>
                    {boy.activeOrdersCount} active parcel{boy.activeOrdersCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

