import {
  Award,
  Calendar,
  CheckCircle2,
  MapPin,
  Phone,
  Power,
  ShieldCheck,
  Star,
  Truck,
  User,
} from 'lucide-react';
import { useShop } from '../../store/shop';

export default function DeliveryProfilePage() {
  const deliveryBoys = useShop((s) => s.deliveryBoys);
  const activeDeliveryBoyId = useShop((s) => s.activeDeliveryBoyId);
  const toggleDeliveryDuty = useShop((s) => s.toggleDeliveryDuty);
  const orders = useShop((s) => s.orders);
  const user = useShop((s) => s.user);

  const currentBoy =
    deliveryBoys.find((b) => (user?.deliveryBoyId && b.id === user.deliveryBoyId) || b.accountEmail === user?.email) ||
    deliveryBoys.find((b) => b.id === activeDeliveryBoyId) ||
    deliveryBoys[0];
  const isOnline = currentBoy?.status === 'on_duty';

  const completedCount = orders.filter(
    (o) => o.assignedDeliveryBoyId === currentBoy?.id && o.status === 'Delivered',
  ).length;

  return (
    <div>
      <div className="adm-header">
        <div>
          <h1 className="adm-title">Delivery Partner Profile</h1>
          <p className="adm-subtitle">Courier credentials, vehicle compliance, zone allocation & ratings.</p>
        </div>
      </div>

      <div className="del-profile-grid">
        {/* Profile Card */}
        <div className="del-profile-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, minWidth: 0 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))',
                color: '#60a5fa',
                display: 'grid',
                placeItems: 'center',
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {currentBoy.name.charAt(0)}
            </div>

            <div className="adm-break">
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{currentBoy.name}</h2>
              <div style={{ color: 'var(--st-accent)', fontSize: 13, fontFamily: 'monospace', fontWeight: 600 }}>
                PARTNER ID: {currentBoy.id}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 4 }}>
                <span style={{ color: '#facc15' }}>★ {currentBoy.rating}</span>
                <span style={{ color: 'var(--st-mute)' }}>• Top Performer</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--st-bg)', borderRadius: 16, padding: 18, marginBottom: 20 }}>
            <div className="del-kv">
              <span>Phone Number</span>
              <strong>{currentBoy.phone}</strong>
            </div>

            <div className="del-kv">
              <span>Vehicle</span>
              <strong>{currentBoy.vehicle}</strong>
            </div>

            <div className="del-kv">
              <span>Number Plate</span>
              <strong style={{ fontFamily: 'monospace' }}>{currentBoy.vehicleNumber}</strong>
            </div>

            <div className="del-kv">
              <span>Assigned Zone</span>
              <strong>{currentBoy.zone}</strong>
            </div>
          </div>

          <div className="del-profile-duty">
            <div>
              <span style={{ fontSize: 13, color: 'var(--st-mute)', display: 'block' }}>Duty Shift</span>
              <strong style={{ color: isOnline ? '#4ade80' : '#9ca3af', fontSize: 14 }}>
                {isOnline ? '🟢 Currently Online (Receiving orders)' : '⚪ Currently Offline'}
              </strong>
            </div>

            <button
              type="button"
              className={`del-duty-toggle ${isOnline ? 'online' : 'offline'}`}
              onClick={() => toggleDeliveryDuty(currentBoy.id)}
            >
              <Power size={14} />
              {isOnline ? 'Turn Offline' : 'Turn Online'}
            </button>
          </div>
        </div>

        {/* Safety & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <div className="del-profile-card" style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={18} color="var(--st-accent)" /> Achievements & Score
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 14 }}>
              <div style={{ background: 'var(--st-bg)', padding: 14, borderRadius: 14 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#4ade80' }}>{completedCount}</div>
                <div style={{ fontSize: 12, color: 'var(--st-mute)', overflowWrap: 'anywhere' }}>Total Parcels Delivered</div>
              </div>
              <div style={{ background: 'var(--st-bg)', padding: 14, borderRadius: 14 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#60a5fa' }}>99.4%</div>
                <div style={{ fontSize: 12, color: 'var(--st-mute)' }}>Customer Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="del-profile-card" style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} color="#4ade80" /> Delivery Standards
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--st-mute)', fontSize: 13, lineHeight: 1.7 }}>
              <li>Collect exact cash amount for all COD orders before handing over packages.</li>
              <li>Inspect sealed parcels to confirm zero transit tampering.</li>
              <li>Contact customer via phone if destination door is locked or security gate denies entry.</li>
              <li>Always wear helmet / safety gear when riding on company shifts.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

