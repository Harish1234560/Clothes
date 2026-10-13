import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Truck, User } from 'lucide-react';
import Field, { isEmail } from '../components/Field';
import PageShell from '../components/PageShell';
import PasswordField from '../components/PasswordField';
import { sha256, useShop, type UserRole, type User as StoreUser } from '../store/shop';
import { firebaseRegisterWithEmail, firebaseSignInWithGoogle } from '../services/firebaseAuth';
import { isFirebaseConfigured } from '../lib/firebase';

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useShop((s) => s.register);
  const setUser = useShop((s) => s.setUser);

  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('Hero Splendor (Bike)');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [zone, setZone] = useState('Central Delivery Hub');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedirect = (registeredRole: UserRole) => {
    if (registeredRole === 'admin') navigate('/admin');
    else if (registeredRole === 'delivery') navigate('/delivery');
    else navigate('/');
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setFormError('');
    try {
      const gUser = await firebaseSignInWithGoogle(role);
      setUser(gUser);
      handleRedirect(gUser.role);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.warn('Google sign-up error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setFormError('Google sign-up popup was closed.');
      } else {
        setFormError(
          error.message ||
            'Google Sign-Up failed. Please check your Firebase configuration in .env.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (name.trim().length < 2) er.name = 'Enter your full name';
    if (!isEmail(email)) er.email = 'Enter a valid email address';
    if (role === 'delivery' && !/^\+?[0-9\s-]{7,15}$/.test(phone.trim())) {
      er.phone = 'Enter a valid mobile phone number';
    }
    if (pw.length < 8) er.pw = 'Password must be at least 8 characters';
    if (pw2 !== pw) er.pw2 = 'Passwords do not match';
    setErrors(er);
    setFormError('');
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      // 1. If Firebase is active, create user in Firebase Auth & Firestore
      if (isFirebaseConfigured) {
        try {
          const fbUser = await firebaseRegisterWithEmail({
            email: email.trim().toLowerCase(),
            pass: pw,
            name: name.trim(),
            role,
            phone: phone.trim() || undefined,
            vehicle: role === 'delivery' ? vehicle : undefined,
            vehicleNumber: role === 'delivery' ? vehicleNumber.trim() : undefined,
            zone: role === 'delivery' ? zone.trim() : undefined,
          });
          setUser(fbUser);
        } catch (fbErr: unknown) {
          const fbError = fbErr as { code?: string; message?: string };
          console.warn('Firebase registration warning:', fbError.code || fbError.message);
          if (fbError.code === 'auth/email-already-in-use') {
            setFormError('An account with this email address already exists in Firebase.');
            setLoading(false);
            return;
          }
        }
      }

      // 2. Also register in local Zustand accounts store
      const hash = await sha256(pw);
      const ok = register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        hash,
        phone: phone.trim() || undefined,
        vehicle: role === 'delivery' ? vehicle : undefined,
        vehicleNumber: role === 'delivery' ? vehicleNumber.trim() : undefined,
        zone: role === 'delivery' ? zone.trim() : undefined,
      });

      if (!ok && !isFirebaseConfigured) {
        setFormError('An account with this email address already exists.');
        setLoading(false);
        return;
      }

      handleRedirect(role);
    } catch {
      setFormError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Create Account | Register | STORE Menswear"
      description="Create a STORE customer or partner account. Fast checkout, saved orders, and role-based portal access."
    >
      <div className="st-wrap">
        <div className="st-auth st-box" style={{ maxWidth: 540, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', margin: '0 0 8px' }}>Create Account</h1>
          <p className="sub" style={{ textAlign: 'center', marginBottom: 20 }}>
            Register as a Store Patron, Delivery Partner, or Administrator.
          </p>

          {/* Account Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setRole('customer')}
              style={{
                background: role === 'customer' ? 'var(--st-card2)' : 'transparent',
                border: `1px solid ${role === 'customer' ? 'var(--st-accent)' : 'var(--st-line)'}`,
                color: role === 'customer' ? 'var(--st-accent)' : 'var(--st-mute)',
                borderRadius: 12,
                padding: '10px 6px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              <User size={16} />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('delivery')}
              style={{
                background: role === 'delivery' ? 'var(--st-card2)' : 'transparent',
                border: `1px solid ${role === 'delivery' ? '#60a5fa' : 'var(--st-line)'}`,
                color: role === 'delivery' ? '#60a5fa' : 'var(--st-mute)',
                borderRadius: 12,
                padding: '10px 6px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              <Truck size={16} />
              <span>Delivery Partner</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              style={{
                background: role === 'admin' ? 'var(--st-card2)' : 'transparent',
                border: `1px solid ${role === 'admin' ? '#f59e0b' : 'var(--st-line)'}`,
                color: role === 'admin' ? '#f59e0b' : 'var(--st-mute)',
                borderRadius: 12,
                padding: '10px 6px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              <Shield size={16} />
              <span>Administrator</span>
            </button>
          </div>

          <form className="st-form" onSubmit={submit} noValidate>
            {formError && (
              <div className="st-alert bad" role="alert">
                {formError}
              </div>
            )}

            <Field
              id="name"
              label="Full Name"
              value={name}
              onChange={setName}
              error={errors.name}
              autoComplete="name"
              placeholder="e.g. John Doe"
            />

            <Field
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              autoComplete="email"
              placeholder="name@example.com"
            />

            {/* Delivery Partner Specific Details */}
            {role === 'delivery' && (
              <>
                <Field
                  id="phone"
                  label="Contact Phone"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  error={errors.phone}
                  placeholder="+91 98765 43210"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="st-label" style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
                      Vehicle Type
                    </label>
                    <select
                      className="adm-select"
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                    >
                      <option value="Hero Splendor (Bike)">Motorcycle</option>
                      <option value="Honda Activa (Scooter)">Scooter</option>
                      <option value="EV Electric Scooter">Electric Scooter</option>
                      <option value="Tata Ace (Van)">Delivery Van</option>
                    </select>
                  </div>

                  <div>
                    <label className="st-label" style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
                      Plate Number
                    </label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="DL 01 AB 1234"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                    />
                  </div>
                </div>

                <Field
                  id="zone"
                  label="Delivery Area / Hub"
                  value={zone}
                  onChange={setZone}
                  placeholder="e.g. South Delhi, Sector 29"
                />
              </>
            )}

            <PasswordField
              id="pw"
              label="Password (min. 8 characters)"
              value={pw}
              onChange={setPw}
              error={errors.pw}
              autoComplete="new-password"
            />

            <PasswordField
              id="pw2"
              label="Confirm Password"
              value={pw2}
              onChange={setPw2}
              error={errors.pw2}
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="st-btn primary block"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'delivery' ? 'Delivery Partner' : role === 'admin' ? 'Administrator' : 'Customer'}`}
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
            onClick={handleGoogleSignUp}
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
            Sign up with Google ({role.toUpperCase()})
          </button>

          <p className="alt">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
