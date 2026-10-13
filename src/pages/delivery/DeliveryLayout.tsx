import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  Clock,
  ExternalLink,
  History,
  LogOut,
  Moon,
  Power,
  Shield,
  Sun,
  Truck,
  User,
} from 'lucide-react';
import { useShop } from '../../store/shop';
import '../../styles/admin.css';
import '../../styles/delivery.css';

export default function DeliveryLayout() {
  const theme = useShop((s) => s.theme);
  const toggleTheme = useShop((s) => s.toggleTheme);
  const user = useShop((s) => s.user);
  const logout = useShop((s) => s.logout);
  const deliveryBoys = useShop((s) => s.deliveryBoys);
  const activeDeliveryBoyId = useShop((s) => s.activeDeliveryBoyId);
  const setActiveDeliveryBoyId = useShop((s) => s.setActiveDeliveryBoyId);
  const toggleDeliveryDuty = useShop((s) => s.toggleDeliveryDuty);
  const orders = useShop((s) => s.orders);

  // If user is a courier, pick their profile, otherwise pick activeDeliveryBoyId or first
  const currentBoy =
    deliveryBoys.find((b) => (user?.deliveryBoyId && b.id === user.deliveryBoyId) || b.accountEmail === user?.email) ||
    deliveryBoys.find((b) => b.id === activeDeliveryBoyId) ||
    deliveryBoys[0];

  const isOnline = currentBoy?.status === 'on_duty';

  const myAssignedOrders = orders.filter(
    (o) => o.assignedDeliveryBoyId === currentBoy?.id && o.status !== 'Delivered' && o.status !== 'Cancelled',
  );

  return (
    <div className="del-container">
      {/* Top Header */}
      <header className="del-topbar">
        <div className="del-topbar-row">
          <Link to="/delivery" className="del-brand">
            <span style={{ fontWeight: 800, letterSpacing: '0.12em', fontSize: 16 }}>STORE</span>
            <span className="del-badge">Courier</span>
          </Link>

          <div className="del-top-tools">
            {currentBoy && (
              <button
                type="button"
                className={`del-duty-toggle ${isOnline ? 'online' : 'offline'}`}
                onClick={() => toggleDeliveryDuty(currentBoy.id)}
              >
                <Power size={13} />
                {isOnline ? 'On Duty' : 'Go Online'}
              </button>
            )}

            <button
              type="button"
              className="adm-tool-btn"
              style={{ padding: '6px 10px' }}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {user?.role === 'admin' && (
              <Link to="/admin" className="adm-tool-btn" style={{ padding: '6px 10px', fontSize: 12 }}>
                <Shield size={13} />
                <span className="del-tool-text">Admin</span>
              </Link>
            )}

            <Link to="/" className="adm-tool-btn" style={{ padding: '6px 10px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <ExternalLink size={13} />
              <span className="del-tool-text">Store</span>
            </Link>

            <button
              type="button"
              className="adm-tool-btn"
              style={{ padding: '6px 10px', fontSize: 12, color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)', display: 'inline-flex', alignItems: 'center', gap: 5 }}
              onClick={logout}
              title="Sign out of Delivery Portal"
            >
              <LogOut size={13} />
              <span className="del-tool-text">Sign out</span>
            </button>
          </div>
        </div>

        {user?.role === 'delivery' ? (
          <div className="del-partner-selector">
            <User size={14} color="#60a5fa" />
            <strong style={{ fontSize: 13, color: '#fff' }}>{user.name}</strong>
            <span style={{ fontSize: 11, color: 'var(--st-mute)' }}>({currentBoy?.id})</span>
          </div>
        ) : (
          <div className="del-partner-selector">
            <User size={14} color="#60a5fa" />
            <select
              className="del-partner-select"
              value={currentBoy?.id || ''}
              onChange={(e) => setActiveDeliveryBoyId(e.target.value)}
              title="Select Delivery Agent (Admin View)"
            >
              {deliveryBoys.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.id})
                </option>
              ))}
            </select>
          </div>
        )}

        <nav className="del-nav" aria-label="Delivery navigation">
          <NavLink to="/delivery" end className={({ isActive }) => `del-nav-link${isActive ? ' active' : ''}`}>
            <Clock size={15} />
            Active ({myAssignedOrders.length})
          </NavLink>
          <NavLink to="/delivery/tasks" className={({ isActive }) => `del-nav-link${isActive ? ' active' : ''}`}>
            <Truck size={15} />
            All Tasks
          </NavLink>
          <NavLink to="/delivery/history" className={({ isActive }) => `del-nav-link${isActive ? ' active' : ''}`}>
            <History size={15} />
            History & Earnings
          </NavLink>
          <NavLink to="/delivery/profile" className={({ isActive }) => `del-nav-link${isActive ? ' active' : ''}`}>
            <User size={15} />
            Profile
          </NavLink>
        </nav>
      </header>

      {/* Main Delivery Partner Content */}
      <main className="del-main">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="del-mobile-bar">
        <NavLink to="/delivery" end className={({ isActive }) => `del-nav-link${isActive ? ' active' : ''}`}>
          <Clock size={16} />
          Active
        </NavLink>
        <NavLink to="/delivery/tasks" className={({ isActive }) => `del-nav-link${isActive ? ' active' : ''}`}>
          <Truck size={16} />
          Tasks
        </NavLink>
        <NavLink to="/delivery/history" className={({ isActive }) => `del-nav-link${isActive ? ' active' : ''}`}>
          <History size={16} />
          Earnings
        </NavLink>
        <NavLink to="/delivery/profile" className={({ isActive }) => `del-nav-link${isActive ? ' active' : ''}`}>
          <User size={16} />
          Profile
        </NavLink>
      </div>
    </div>
  );
}

