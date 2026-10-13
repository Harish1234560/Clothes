import { useState, type FormEvent } from 'react';
import {
  Edit3,
  MapPin,
  Phone,
  Plus,
  Power,
  Shield,
  Star,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useShop, type DeliveryBoy } from '../../store/shop';

export default function AdminDeliveryBoysPage() {
  const deliveryBoys = useShop((s) => s.deliveryBoys);
  const addDeliveryBoy = useShop((s) => s.addDeliveryBoy);
  const updateDeliveryBoy = useShop((s) => s.updateDeliveryBoy);
  const deleteDeliveryBoy = useShop((s) => s.deleteDeliveryBoy);
  const toggleDeliveryDuty = useShop((s) => s.toggleDeliveryDuty);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBoy, setEditingBoy] = useState<DeliveryBoy | null>(null);

  // Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('Hero Splendor (Bike)');
  const [vehicleNumber, setVehicleNumber] = useState('DL 01 AB 1234');
  const [zone, setZone] = useState('South Delhi & Connaught Place');

  const openAdd = () => {
    setEditingBoy(null);
    setName('');
    setPhone('');
    setVehicle('Hero Splendor (Bike)');
    setVehicleNumber('DL 01 AB 1234');
    setZone('South Delhi & Connaught Place');
    setModalOpen(true);
  };

  const openEdit = (boy: DeliveryBoy) => {
    setEditingBoy(boy);
    setName(boy.name);
    setPhone(boy.phone);
    setVehicle(boy.vehicle);
    setVehicleNumber(boy.vehicleNumber);
    setZone(boy.zone);
    setModalOpen(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingBoy) {
      updateDeliveryBoy(editingBoy.id, {
        name: name.trim(),
        phone: phone.trim(),
        vehicle,
        vehicleNumber: vehicleNumber.trim(),
        zone: zone.trim(),
      });
    } else {
      const id = `DB-${String(deliveryBoys.length + 1).padStart(2, '0')}`;
      const newBoy: DeliveryBoy = {
        id,
        name: name.trim(),
        phone: phone.trim(),
        vehicle,
        vehicleNumber: vehicleNumber.trim(),
        zone: zone.trim(),
        status: 'on_duty',
        rating: 5.0,
        activeOrdersCount: 0,
      };
      addDeliveryBoy(newBoy);
    }

    setModalOpen(false);
  };

  return (
    <div>
      <div className="adm-header">
        <div>
          <h1 className="adm-title">Delivery Partners & Fleet</h1>
          <p className="adm-subtitle">Manage couriers, delivery zones, active fleets & on-duty shifts.</p>
        </div>
        <button
          type="button"
          className="adm-btn-primary"
          onClick={openAdd}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={16} /> Add Delivery Partner
        </button>
      </div>

      {/* Delivery Cards Grid */}
      <div className="adm-cards-grid">
        {deliveryBoys.map((boy) => {
          const isOnline = boy.status === 'on_duty';
          return (
            <div
              key={boy.id}
              style={{
                background: 'var(--st-card)',
                border: '1px solid var(--st-line)',
                borderRadius: 20,
                padding: 20,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minWidth: 0,
                maxWidth: '100%',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: isOnline ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        color: isOnline ? '#4ade80' : 'var(--st-mute)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Truck size={22} />
                    </div>
                    <div className="adm-break">
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{boy.name}</h3>
                      <span style={{ fontSize: 12, color: 'var(--st-accent)', fontFamily: 'monospace' }}>
                        ID: {boy.id}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 99,
                      fontSize: 12,
                      fontWeight: 700,
                      background: isOnline ? 'rgba(34, 197, 94, 0.15)' : 'rgba(107, 114, 128, 0.2)',
                      color: isOnline ? '#4ade80' : '#9ca3af',
                      border: `1px solid ${isOnline ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
                    }}
                  >
                    {isOnline ? '🟢 On Duty' : '⚪ Offline'}
                  </span>
                </div>

                <div style={{ background: 'var(--st-bg)', borderRadius: 14, padding: 14, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 8 }}>
                    <Phone size={14} color="var(--st-mute)" />
                    <strong>{boy.phone}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 8 }}>
                    <Truck size={14} color="var(--st-mute)" />
                    <span className="adm-break">{boy.vehicle} • <span style={{ fontFamily: 'monospace' }}>{boy.vehicleNumber}</span></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <MapPin size={14} color="var(--st-mute)" />
                    <span className="adm-break">{boy.zone}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 13, marginBottom: 16, color: 'var(--st-mute)' }}>
                  <span>
                    Rating: <strong style={{ color: '#facc15' }}>★ {boy.rating}</strong>
                  </span>
                  <span>
                    Active parcels: <strong style={{ color: '#fff' }}>{boy.activeOrdersCount}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--st-line)', paddingTop: 14, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="adm-tool-btn"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => toggleDeliveryDuty(boy.id)}
                >
                  <Power size={13} color={isOnline ? '#ef4444' : '#22c55e'} />
                  {isOnline ? 'Set Offline' : 'Set Online'}
                </button>
                <button
                  type="button"
                  className="adm-tool-btn"
                  onClick={() => openEdit(boy)}
                  title="Edit details"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  className="adm-tool-btn"
                  style={{ color: '#f87171' }}
                  onClick={() => {
                    if (confirm(`Remove delivery partner "${boy.name}"?`)) {
                      deleteDeliveryBoy(boy.id);
                    }
                  }}
                  title="Delete partner"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="adm-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">
                {editingBoy ? 'Edit Delivery Partner' : 'Add New Delivery Partner'}
              </h2>
              <button
                type="button"
                className="adm-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-form-group">
                <label className="adm-label">Rider Full Name</label>
                <input
                  type="text"
                  required
                  className="adm-input"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="adm-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label className="adm-label">Vehicle Type</label>
                  <select
                    className="adm-select"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                  >
                    <option value="Hero Splendor (Bike)">Motorcycle (Bike)</option>
                    <option value="Honda Activa (Scooter)">Scooter</option>
                    <option value="Electric Scooter (EV)">Electric EV Scooter</option>
                    <option value="Tata Ace (Van)">Delivery Van</option>
                  </select>
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Vehicle Plate Number</label>
                  <input
                    type="text"
                    required
                    className="adm-input"
                    placeholder="DL 01 AB 1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Assigned Delivery Zone</label>
                <input
                  type="text"
                  required
                  className="adm-input"
                  placeholder="e.g. South Delhi, Gurugram Sector 29"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </div>

              <div className="adm-header-actions" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  type="button"
                  className="adm-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  {editingBoy ? 'Update Partner' : 'Register Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

