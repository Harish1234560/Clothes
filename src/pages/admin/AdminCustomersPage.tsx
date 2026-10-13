import { useState } from 'react';
import { Mail, Phone, Search, ShoppingBag, UserCheck, Users } from 'lucide-react';
import { money } from '../../data/products';
import { useShop } from '../../store/shop';

export default function AdminCustomersPage() {
  const orders = useShop((s) => s.orders);
  const accounts = useShop((s) => s.accounts);
  const [search, setSearch] = useState('');

  // Aggregate customers from accounts and orders
  const customerMap = new Map<
    string,
    {
      name: string;
      email: string;
      phone: string;
      city: string;
      ordersCount: number;
      totalSpent: number;
      lastOrderDate: number;
    }
  >();

  // Add registered customer accounts
  accounts
    .filter((acc) => acc.role === 'customer' || !acc.role)
    .forEach((acc) => {
      customerMap.set(acc.email.toLowerCase(), {
        name: acc.name,
        email: acc.email,
        phone: acc.phone || '—',
        city: '—',
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: 0,
      });
    });

  // Aggregate orders
  orders.forEach((o) => {
    const key = o.email.toLowerCase();
    const existing = customerMap.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += o.total;
      existing.lastOrderDate = Math.max(existing.lastOrderDate, o.placedAt);
      if (o.customerName) existing.name = o.customerName;
      if (o.phone) existing.phone = o.phone;
      if (o.city) existing.city = o.city;
    } else {
      customerMap.set(key, {
        name: o.customerName,
        email: o.email,
        phone: o.phone,
        city: o.city,
        ordersCount: 1,
        totalSpent: o.total,
        lastOrderDate: o.placedAt,
      });
    }
  });

  const customerList = Array.from(customerMap.values()).filter((c) => {
    const q = search.toLowerCase().trim();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="adm-header">
        <div>
          <h1 className="adm-title">Customer Database</h1>
          <p className="adm-subtitle">Profiles, order volumes, lifetime value & communication history ({customerList.length} total).</p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={16} className="adm-search-icon" />
          <input
            type="text"
            className="adm-search-input"
            placeholder="Search by customer name, email, phone or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="adm-table-card">
        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Customer Profile</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Orders Placed</th>
                <th>Lifetime Spend</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {customerList.map((c) => (
                <tr key={c.email}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 99,
                          background: 'rgba(217, 133, 69, 0.15)',
                          color: 'var(--st-accent)',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <strong style={{ fontSize: 14 }} className="adm-break">{c.name || 'Store Patron'}</strong>
                        <div style={{ fontSize: 12, color: 'var(--st-mute)' }}>
                          {c.ordersCount > 0 ? `${c.ordersCount} completed order${c.ordersCount > 1 ? 's' : ''}` : 'Registered Shopper'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }} className="adm-break">
                      <Mail size={13} color="var(--st-mute)" style={{ flexShrink: 0 }} /> {c.email}
                    </div>
                    {c.phone && c.phone !== '—' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--st-mute)', marginTop: 2 }}>
                        <Phone size={12} /> {c.phone}
                      </div>
                    )}
                  </td>

                  <td>
                    <span style={{ fontSize: 13 }}>{c.city && c.city !== '—' ? c.city : 'Direct Storefront'}</span>
                  </td>

                  <td>
                    <span style={{ fontWeight: 600 }}>{c.ordersCount}</span> order{c.ordersCount !== 1 ? 's' : ''}
                  </td>

                  <td>
                    <strong style={{ color: 'var(--st-accent)' }}>{money(c.totalSpent)}</strong>
                  </td>

                  <td>
                    <span style={{ fontSize: 12, color: 'var(--st-mute)' }}>
                      {c.lastOrderDate > 0
                        ? new Date(c.lastOrderDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'No orders placed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

