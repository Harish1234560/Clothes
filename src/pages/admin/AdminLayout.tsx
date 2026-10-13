import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  BarChart3,
  ExternalLink,
  Moon,
  Package,
  ShoppingBag,
  Sun,
  Truck,
  Users,
} from 'lucide-react';
import { useShop } from '../../store/shop';
import '../../styles/admin.css';

export default function AdminLayout() {
  const theme = useShop((s) => s.theme);
  const toggleTheme = useShop((s) => s.toggleTheme);
  const orders = useShop((s) => s.orders);
  const user = useShop((s) => s.user);
  const logout = useShop((s) => s.logout);

  const pendingOrders = orders.filter((o) => o.status === 'Placed' || o.status === 'Packed').length;

  return (
    <div className="adm-container">
      <header className="adm-topbar">
        <div className="adm-topbar-row">
          <Link to="/admin" className="adm-brand">
            <span style={{ fontWeight: 800, letterSpacing: '0.12em', fontSize: 16 }}>STORE</span>
            <span className="adm-badge-admin">Admin</span>
          </Link>

          <div className="adm-top-tools">
            {user && (
              <div className="adm-user-chip">
                <span style={{ width: 7, height: 7, borderRadius: 99, background: '#22c55e', flexShrink: 0 }} />
                <strong>{user.name}</strong>
              </div>
            )}

            <button
              type="button"
              className="adm-tool-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <Link to="/delivery" className="adm-tool-btn" title="Open Delivery Partner Portal">
              <Truck size={14} />
              <span className="adm-tool-text">Delivery</span>
            </Link>

            <Link to="/" className="adm-tool-btn" style={{ background: 'var(--st-card2)' }}>
              <ExternalLink size={14} />
              <span className="adm-tool-text">Store</span>
            </Link>

            <button
              type="button"
              className="adm-tool-btn"
              style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
              onClick={logout}
              title="Sign out of Admin Console"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="adm-nav-container">
          <nav className="adm-nav" aria-label="Admin navigation">
            <NavLink to="/admin" end className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}>
              <BarChart3 size={15} />
              Dashboard
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}>
              <Package size={15} />
              Orders {pendingOrders > 0 && <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 99 }}>{pendingOrders}</span>}
            </NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}>
              <ShoppingBag size={15} />
              Products
            </NavLink>
            <NavLink to="/admin/delivery" className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}>
              <Truck size={15} />
              Fleet & Partners
            </NavLink>
            <NavLink to="/admin/customers" className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}>
              <Users size={15} />
              Customers
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
}

