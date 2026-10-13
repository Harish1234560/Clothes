import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, LogIn, LogOut, ShieldAlert } from 'lucide-react';
import { useShop, type UserRole } from '../../store/shop';

type ProtectedRouteProps = {
  allowedRoles: UserRole[];
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useShop((s) => s.user);
  const logout = useShop((s) => s.logout);

  // 1. Not Authenticated -> Redirect to Login with callback
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 2. Not Authorized (Forbidden / Role mismatch)
  if (!allowedRoles.includes(user.role)) {
    const roleLabels: Record<UserRole, string> = {
      admin: 'Administrator',
      delivery: 'Delivery Partner',
      customer: 'Store Customer',
    };

    const targetLabel = allowedRoles.map((r) => roleLabels[r]).join(' or ');

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: 'var(--st-bg, #0f0f11)',
          color: 'var(--st-text, #f5f2ee)',
          padding: 16,
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: '100%',
            background: 'var(--st-card, #1b1b1e)',
            border: '1px solid var(--st-line2, rgba(255, 255, 255, 0.15))',
            borderRadius: 24,
            padding: 24,
            textAlign: 'center',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 18px',
            }}
          >
            <ShieldAlert size={28} />
          </div>

          <h1 style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 700 }}>
            Access Restricted
          </h1>

          <p style={{ margin: '0 0 20px', color: 'var(--st-mute, #a8a5a0)', fontSize: 14, lineHeight: 1.6 }}>
            You are signed in as <strong>{user.name}</strong> ({user.email}) with the{' '}
            <span
              style={{
                textTransform: 'uppercase',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2px 8px',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {user.role}
            </span>{' '}
            role. This portal requires <strong>{targetLabel}</strong> authorization.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              borderTop: '1px solid var(--st-line, rgba(255, 255, 255, 0.08))',
              paddingTop: 20,
            }}
          >
            <Link
              to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
              onClick={logout}
              style={{
                background: 'var(--st-accent, #d98545)',
                color: '#1a1008',
                padding: '12px 20px',
                borderRadius: 12,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <LogIn size={16} /> Sign in with {targetLabel} Account
            </Link>

            <Link
              to={user.role === 'delivery' ? '/delivery' : user.role === 'admin' ? '/admin' : '/'}
              style={{
                background: 'var(--st-card2, #242429)',
                color: 'var(--st-text, #f5f2ee)',
                border: '1px solid var(--st-line2, rgba(255, 255, 255, 0.15))',
                padding: '12px 20px',
                borderRadius: 12,
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <ArrowLeft size={16} /> Go to My {roleLabels[user.role]} Home
            </Link>

            <button
              type="button"
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--st-mute, #a8a5a0)',
                padding: '8px',
                fontSize: 13,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <LogOut size={14} /> Sign out completely
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized -> Render portal
  return <Outlet />;
}

