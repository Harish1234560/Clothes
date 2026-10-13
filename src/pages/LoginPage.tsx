import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, KeyRound, LogOut, Shield, ShieldCheck, Truck, UserCheck, Users } from 'lucide-react';
import Field, { isEmail } from '../components/Field';
import PageShell from '../components/PageShell';
import PasswordField from '../components/PasswordField';
import { sha256, useShop, type UserRole, type User } from '../store/shop';
import { firebaseLoginWithEmail, firebaseSignInWithGoogle } from '../services/firebaseAuth';
import { isFirebaseConfigured } from '../lib/firebase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';

  const user = useShop((s) => s.user);
  const logout = useShop((s) => s.logout);
  const login = useShop((s) => s.login);
  const setUser = useShop((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill preset credentials on pill click
  const fillPreset = (eMail: string, pass: string) => {
    setEmail(eMail);
    setPw(pass);
    setFormError('');
    setErrors({});
  };

  const handleRedirect = (authenticatedUser: User) => {
    if (redirectPath) {
      navigate(redirectPath);
    } else if (authenticatedUser.role === 'admin') {
      navigate('/admin');
    } else if (authenticatedUser.role === 'delivery') {
      navigate('/delivery');
    } else {
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setFormError('');
    try {
      const gUser = await firebaseSignInWithGoogle();
      setUser(gUser);
      handleRedirect(gUser);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.warn('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setFormError('Google sign-in popup was closed.');
      } else {
        setFormError(
          error.message ||
            'Google Sign-In failed. Please ensure Firebase is configured in .env.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!isEmail(email)) er.email = 'Enter a valid email address';
    if (!pw) er.pw = 'Enter your password';
    setErrors(er);
    setFormError('');
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      let authenticatedUser: User | null = null;

      // 1. If Firebase is active, attempt Firebase Email/Password login first
      if (isFirebaseConfigured) {
        try {
          authenticatedUser = await firebaseLoginWithEmail(email, pw);
        } catch (fbErr: unknown) {
          const fbError = fbErr as { code?: string };
          console.info('Firebase login fallback to local credentials:', fbError.code);
        }
      }

      // 2. Fallback to local accounts if not authenticated via Firebase
      if (!authenticatedUser) {
        const hash = await sha256(pw);
        authenticatedUser = login(email.trim().toLowerCase(), hash);
      }

      if (!authenticatedUser) {
        setFormError('Invalid email or password. Please verify credentials.');
        setLoading(false);
        return;
      }

      setUser(authenticatedUser);
      handleRedirect(authenticatedUser);
    } catch {
      setFormError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Sign In | Account Access | STORE Menswear"
      description="Sign in to your STORE account to view your past orders, manage delivery details, and access role-based portals."
    >
      <div className="st-wrap">
        <div className="st-auth st-box" style={{ maxWidth: 520, margin: '0 auto' }}>
          {user ? (
            <div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <UserCheck size={26} />
              </div>

              <h1 style={{ textAlign: 'center', margin: '0 0 6px' }}>Active Session</h1>
              <p className="sub" style={{ textAlign: 'center', marginBottom: 20 }}>
                Signed in as <strong>{user.name}</strong> ({user.email})
              </p>

              <div
                style={{
                  background: 'var(--st-card2)',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 24,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--st-mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Current Authorization Role
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: user.role === 'admin' ? 'var(--st-accent)' : user.role === 'delivery' ? '#60a5fa' : '#4ade80',
                    marginTop: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {user.role === 'admin' ? '🛡️ Administrator' : user.role === 'delivery' ? '🚚 Delivery Partner' : '👤 Customer'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {user.role === 'admin' && (
                  <Link to="/admin" className="st-btn primary block" style={{ textAlign: 'center' }}>
                    Go to Admin Console →
                  </Link>
                )}
                {user.role === 'delivery' && (
                  <Link to="/delivery" className="st-btn primary block" style={{ textAlign: 'center' }}>
                    Go to Delivery Partner Portal →
                  </Link>
                )}
                {user.role === 'customer' && (
                  <Link to="/shop" className="st-btn primary block" style={{ textAlign: 'center' }}>
                    Continue Shopping →
                  </Link>
                )}
                <button type="button" className="st-btn ghost block" onClick={logout}>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 700 }}>Sign In</h1>
                <p className="sub" style={{ margin: 0 }}>
                  Enter your credentials to access your store or staff portal.
                </p>
              </div>

              {/* Fast 1-Click Role Logins */}
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 11, color: 'var(--st-mute)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Quick Fill Test Credentials:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => fillPreset('admin@store.com', 'admin123')}
                    style={{
                      background: 'rgba(217, 133, 69, 0.1)',
                      border: '1px solid rgba(217, 133, 69, 0.3)',
                      color: 'var(--st-accent)',
                      borderRadius: 10,
                      padding: '8px 4px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Shield size={14} />
                    <span>Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillPreset('delivery@store.com', 'delivery123')}
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#60a5fa',
                      borderRadius: 10,
                      padding: '8px 4px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Truck size={14} />
                    <span>Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillPreset('user@store.com', 'user123')}
                    style={{
                      background: 'rgba(74, 222, 128, 0.1)',
                      border: '1px solid rgba(74, 222, 128, 0.3)',
                      color: '#4ade80',
                      borderRadius: 10,
                      padding: '8px 4px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Users size={14} />
                    <span>Customer</span>
                  </button>
                </div>
              </div>

              {formError && (
                <div className="st-alert bad" role="alert" style={{ marginBottom: 18 }}>
                  {formError}
                </div>
              )}

              <form className="st-form" onSubmit={submit} noValidate>
                <Field
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  error={errors.email}
                  autoComplete="email"
                  placeholder="name@store.com"
                />

                <PasswordField
                  id="pw"
                  label="Password"
                  value={pw}
                  onChange={setPw}
                  error={errors.pw}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />

                <button
                  type="submit"
                  className="st-btn primary block"
                  disabled={loading}
                  style={{ marginTop: 8 }}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--st-line)' }} />
                <span style={{ fontSize: 11, color: 'var(--st-mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'var(--st-line)' }} />
              </div>

              <button
                type="button"
                className="st-btn ghost block"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  background: 'var(--st-card2)',
                  border: '1px solid var(--st-line)',
                  borderRadius: 12,
                  padding: '11px 16px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  color: 'inherit',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              <p className="alt" style={{ marginTop: 22 }}>
                Need an account? <Link to="/register">Create customer or partner account</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
