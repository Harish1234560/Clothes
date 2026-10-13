import { useEffect, useState } from 'react';
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Moon,
  Package,
  Shield,
  ShoppingBag,
  Sun,
  Truck,
  UserRound,
  X,
} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useShop } from '../../store/shop';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'active' : '';

export default function Navbar() {
  const { pathname } = useLocation();
  const cartCount = useShop((state) => state.cart.reduce((count, item) => count + item.qty, 0));
  const theme = useShop((state) => state.theme);
  const toggleTheme = useShop((state) => state.toggleTheme);
  const user = useShop((state) => state.user);
  const logout = useShop((state) => state.logout);

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return { background: 'rgba(217, 133, 69, 0.2)', color: 'var(--accent)', border: '1px solid rgba(217, 133, 69, 0.4)' };
      case 'delivery':
        return { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)' };
      default:
        return { background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.4)' };
    }
  };

  return (
    <>
      {menuOpen && (
        <div
          className="mobile-scrim"
          onClick={closeMenus}
          aria-hidden="true"
        />
      )}
      <header className="navbar">
        <button
          className="mobile-menu"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="main-mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav
          id="main-mobile-nav"
          className={`nav-links ${menuOpen ? 'open' : ''}`}
          aria-label="Main navigation"
        >
          <NavLink to="/" end className={navLinkClass} onClick={closeMenus}>HOME</NavLink>
          <NavLink to="/shop" className={navLinkClass} onClick={closeMenus}>SHOP</NavLink>
          <NavLink to="/new-arrivals" className={navLinkClass} onClick={closeMenus}>NEW ARRIVALS</NavLink>
          <NavLink to="/sale" className={navLinkClass} onClick={closeMenus}>SALE</NavLink>

          <div className="mobile-only mobile-nav-divider" />

          <NavLink to="/wishlist" className={`mobile-only ${navLinkClass}`} onClick={closeMenus}>
            <Heart size={15} /> WISHLIST
          </NavLink>
          <NavLink to="/track-order" className={`mobile-only ${navLinkClass}`} onClick={closeMenus}>
            <Package size={15} /> TRACK ORDER
          </NavLink>

          <div className="mobile-only mobile-nav-divider" />

          {user ? (
            <div className="mobile-only mobile-user-drawer">
              <div className="mobile-user-card">
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>{user.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 6 }}>{user.email}</div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    padding: '2px 7px',
                    borderRadius: 99,
                    ...getRoleBadgeStyle(user.role),
                  }}
                >
                  {user.role === 'admin' ? 'ADMINISTRATOR' : user.role === 'delivery' ? 'COURIER PARTNER' : 'CUSTOMER'}
                </span>
              </div>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" onClick={closeMenus} style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    <Shield size={14} /> Admin Console
                  </Link>
                  <Link to="/admin/orders" onClick={closeMenus}>
                    <Package size={14} /> Manage Orders
                  </Link>
                  <Link to="/delivery" onClick={closeMenus} style={{ color: '#60a5fa' }}>
                    <Truck size={14} /> Delivery Portal
                  </Link>
                </>
              )}
              {user.role === 'delivery' && (
                <>
                  <Link to="/delivery" onClick={closeMenus} style={{ color: '#60a5fa', fontWeight: 600 }}>
                    <Truck size={14} /> Delivery Dashboard
                  </Link>
                  <Link to="/delivery/tasks" onClick={closeMenus}>
                    <Package size={14} /> Assigned Tasks
                  </Link>
                </>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="mobile-logout-button"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          ) : (
            <div className="mobile-only mobile-auth-drawer">
              <Link to="/login" onClick={closeMenus} style={{ fontWeight: 600 }}>
                <UserRound size={15} /> Sign in
              </Link>
              <Link to="/register" onClick={closeMenus}>
                Create account
              </Link>
              <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
              <Link to="/login?redirect=/admin" onClick={closeMenus} style={{ color: 'var(--accent)', fontSize: 12 }}>
                <Shield size={13} /> Admin Console
              </Link>
              <Link to="/login?redirect=/delivery" onClick={closeMenus} style={{ color: '#60a5fa', fontSize: 12 }}>
                <Truck size={13} /> Delivery Partner Portal
              </Link>
            </div>
          )}
        </nav>
        <Link className="logo" to="/" onClick={closeMenus} aria-label="STORE home">S T O R E</Link>
      <div className="nav-tools">
        <span className="country-pill" title="Region: United States" aria-label="Region: United States">
          🇺🇸
        </span>
        <button
          className="round-button theme-toggle"
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          aria-pressed={theme === 'light'}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="user-menu">
          <button
            className="round-button user-button"
            type="button"
            aria-label="Account menu"
            aria-expanded={userMenuOpen}
            onClick={() => setUserMenuOpen((open) => !open)}
            title={user ? `${user.name} (${user.role.toUpperCase()})` : 'Account menu'}
          >
            <UserRound size={17} />
            <ChevronDown size={12} />
          </button>

          {userMenuOpen && (
            <div className="user-dropdown" style={{ minWidth: 220 }}>
              {user ? (
                <>
                  {/* Active User Header */}
                  <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        padding: '2px 7px',
                        borderRadius: 99,
                        ...getRoleBadgeStyle(user.role),
                      }}
                    >
                      {user.role === 'admin' ? 'ADMINISTRATOR' : user.role === 'delivery' ? 'COURIER PARTNER' : 'CUSTOMER'}
                    </span>
                  </div>

                  {/* Role Specific Actions */}
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin" onClick={closeMenus} style={{ color: 'var(--accent)', fontWeight: 600 }}>
                        <Shield size={14} /> Admin Console
                      </Link>
                      <Link to="/admin/orders" onClick={closeMenus}>
                        <Package size={14} /> Manage Orders
                      </Link>
                      <Link to="/delivery" onClick={closeMenus} style={{ color: '#60a5fa' }}>
                        <Truck size={14} /> Delivery Portal
                      </Link>
                    </>
                  )}

                  {user.role === 'delivery' && (
                    <>
                      <Link to="/delivery" onClick={closeMenus} style={{ color: '#60a5fa', fontWeight: 600 }}>
                        <Truck size={14} /> Delivery Dashboard
                      </Link>
                      <Link to="/delivery/tasks" onClick={closeMenus}>
                        <Package size={14} /> Assigned Tasks
                      </Link>
                    </>
                  )}

                  <Link to="/track-order" onClick={closeMenus}>
                    <Package size={14} /> Track Order
                  </Link>

                  <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{ color: '#f87171' }}
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenus} style={{ fontWeight: 600 }}>
                    Sign in
                  </Link>
                  <Link to="/register" onClick={closeMenus}>
                    Create account
                  </Link>
                  <Link to="/track-order" onClick={closeMenus}>
                    Track order
                  </Link>
                  <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
                  <Link to="/login?redirect=/admin" onClick={closeMenus} style={{ color: 'var(--accent)', fontSize: 12 }}>
                    <Shield size={13} /> Admin Console
                  </Link>
                  <Link to="/login?redirect=/delivery" onClick={closeMenus} style={{ color: '#60a5fa', fontSize: 12 }}>
                    <Truck size={13} /> Delivery Partner Portal
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <Link className="round-button cart-button" to="/cart" aria-label="Shopping cart" onClick={closeMenus}>
          <ShoppingBag size={17} />
          {cartCount > 0 && <b>{cartCount}</b>}
        </Link>
      </div>
    </header>
  </>
  );
}
