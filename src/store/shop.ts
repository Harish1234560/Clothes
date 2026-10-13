import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as defaultProducts, type Product } from '../data/products';
import {
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  assignDeliveryBoyInFirestore,
  updateDeliveryBoyDutyInFirestore,
} from '../services/firebaseStore';
import { firebaseSignOut } from '../services/firebaseAuth';

export type CartItem = { slug: string; color: string; size: string; qty: number };
export type UserRole = 'customer' | 'admin' | 'delivery';

export type User = {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  deliveryBoyId?: string;
};

export type Account = User & {
  hash: string;
  vehicle?: string;
  vehicleNumber?: string;
  zone?: string;
};

export type OrderInfo = { id: string; email: string; total: number; items: number; placedAt: number };
export type Theme = 'dark' | 'light';

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Out for delivery' | 'Delivered' | 'Cancelled';

export type OrderItem = {
  slug: string;
  name: string;
  price: number;
  qty: number;
  color: string;
  size: string;
  image?: string;
};

export type FullOrder = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  paymentMethod: 'cod' | 'card';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  assignedDeliveryBoyId?: string;
  deliveryNotes?: string;
  placedAt: number;
  deliveredAt?: number;
};

export type DeliveryBoy = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  vehicleNumber: string;
  status: 'available' | 'on_duty' | 'offline';
  zone: string;
  rating: number;
  activeOrdersCount: number;
  accountEmail?: string;
};

export const cartKey = (i: Pick<CartItem, 'slug' | 'color' | 'size'>) => `${i.slug}|${i.color}|${i.size}`;

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Default role-based credentials for clean login
export const DEFAULT_ACCOUNTS: Account[] = [
  {
    name: 'Administrator',
    email: 'admin@store.com',
    role: 'admin',
    hash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
  },
  {
    name: 'Rahul Sharma',
    email: 'delivery@store.com',
    role: 'delivery',
    phone: '+91 98765 43210',
    deliveryBoyId: 'DB-01',
    vehicle: 'Hero Splendor (Bike)',
    vehicleNumber: 'DL 01 AB 1234',
    zone: 'Gurugram & South Delhi',
    hash: 'd8541cd85756b64db7fa4d90d99ecd014e0ef76a1759afb343837e67a5bef29c', // delivery123
  },
  {
    name: 'Customer User',
    email: 'user@store.com',
    role: 'customer',
    hash: 'e606e38b0d8c19b24cf0ee3808183162ea7cd63ff7912dbb22b5e803286b4446', // user123
  },
];

const defaultDeliveryBoys: DeliveryBoy[] = [
  {
    id: 'DB-01',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    vehicle: 'Hero Splendor (Bike)',
    vehicleNumber: 'DL 01 AB 1234',
    status: 'on_duty',
    zone: 'Gurugram & South Delhi',
    rating: 5.0,
    activeOrdersCount: 0,
    accountEmail: 'delivery@store.com',
  },
];

type Shop = {
  cart: CartItem[];
  wishlist: string[];
  fitting: string[];
  accounts: Account[];
  user: User | null;
  lastOrder: OrderInfo | null;
  theme: Theme;
  orders: FullOrder[];
  deliveryBoys: DeliveryBoy[];
  activeDeliveryBoyId: string;
  adminProducts: Product[];
  addToCart: (i: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  removeFromCart: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  toggleFitting: (slug: string) => void;
  clearFitting: () => void;
  setUser: (u: User | null) => void;
  register: (a: Account) => boolean;
  login: (email: string, hash: string) => User | null;
  logout: () => void;
  setLastOrder: (o: OrderInfo) => void;
  toggleTheme: () => void;
  // Orders
  setOrders: (orders: FullOrder[]) => void;
  createOrder: (order: FullOrder) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  assignDeliveryBoy: (orderId: string, deliveryBoyId: string) => void;
  // Delivery Partners
  addDeliveryBoy: (boy: DeliveryBoy) => void;
  updateDeliveryBoy: (id: string, update: Partial<DeliveryBoy>) => void;
  deleteDeliveryBoy: (id: string) => void;
  toggleDeliveryDuty: (id: string) => void;
  setActiveDeliveryBoyId: (id: string) => void;
  // Products
  addProduct: (product: Product) => void;
  updateProduct: (slug: string, update: Partial<Product>) => void;
  deleteProduct: (slug: string) => void;
};

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export const useShop = create<Shop>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      fitting: [],
      accounts: DEFAULT_ACCOUNTS,
      user: null,
      lastOrder: null,
      theme: 'dark',
      orders: [], // CLEAN: Start with 0 orders, real orders populate from checkout!
      deliveryBoys: defaultDeliveryBoys,
      activeDeliveryBoyId: 'DB-01',
      adminProducts: defaultProducts,
      addToCart: ({ qty = 1, ...i }) =>
        set((s) => {
          const k = cartKey(i);
          const ex = s.cart.find((c) => cartKey(c) === k);
          return {
            cart: ex
              ? s.cart.map((c) => (cartKey(c) === k ? { ...c, qty: Math.min(10, c.qty + qty) } : c))
              : [...s.cart, { ...i, qty: Math.min(10, qty) }],
          };
        }),
      removeFromCart: (key) => set((s) => ({ cart: s.cart.filter((c) => cartKey(c) !== key) })),
      setQty: (key, qty) =>
        set((s) => ({
          cart: qty < 1
            ? s.cart.filter((c) => cartKey(c) !== key)
            : s.cart.map((c) => (cartKey(c) === key ? { ...c, qty: Math.min(10, qty) } : c)),
        })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (slug) => set((s) => ({ wishlist: toggle(s.wishlist, slug) })),
      toggleFitting: (slug) => set((s) => ({ fitting: toggle(s.fitting, slug) })),
      clearFitting: () => set({ fitting: [] }),
      register: (a) => {
        const normalizedEmail = a.email.trim().toLowerCase();
        if (get().accounts.some((x) => x.email.toLowerCase() === normalizedEmail)) return false;

        let boyId = a.deliveryBoyId;
        const newBoys = [...get().deliveryBoys];

        if (a.role === 'delivery') {
          boyId = boyId || `DB-${String(newBoys.length + 1).padStart(2, '0')}`;
          const newRider: DeliveryBoy = {
            id: boyId,
            name: a.name,
            phone: a.phone || '+91 98000 00000',
            vehicle: a.vehicle || 'Hero Splendor (Bike)',
            vehicleNumber: a.vehicleNumber || 'DL 01 AB 0000',
            status: 'on_duty',
            zone: a.zone || 'Central City Hub',
            rating: 5.0,
            activeOrdersCount: 0,
            accountEmail: normalizedEmail,
          };
          newBoys.push(newRider);
        }

        const accountToSave: Account = {
          ...a,
          email: normalizedEmail,
          deliveryBoyId: boyId,
        };

        const u: User = {
          name: a.name,
          email: normalizedEmail,
          role: a.role,
          phone: a.phone,
          deliveryBoyId: boyId,
        };

        set((s) => ({
          accounts: [...s.accounts, accountToSave],
          deliveryBoys: newBoys,
          user: u,
          ...(boyId ? { activeDeliveryBoyId: boyId } : {}),
        }));
        return true;
      },
      login: (email, hash) => {
        const normalizedEmail = email.trim().toLowerCase();
        const a = get().accounts.find((x) => x.email.toLowerCase() === normalizedEmail && x.hash === hash);
        if (!a) return null;

        const u: User = {
          name: a.name,
          email: a.email,
          role: a.role || 'customer',
          phone: a.phone,
          deliveryBoyId: a.deliveryBoyId,
        };

        set({
          user: u,
          ...(a.deliveryBoyId ? { activeDeliveryBoyId: a.deliveryBoyId } : {}),
        });
        return u;
      },
      setUser: (u) => set({ user: u }),
      logout: () => {
        firebaseSignOut().catch((err) => console.warn('Firebase signout warning:', err));
        set({ user: null });
      },
      setLastOrder: (o) => set({ lastOrder: o }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // Order Management
      setOrders: (orders) => set({ orders }),

      createOrder: (order) => {
        // Optimistic local state update
        set((s) => ({
          orders: [order, ...s.orders],
        }));
        // Realtime Firestore sync
        saveOrderToFirestore(order).catch((err) =>
          console.warn('Could not sync created order to Firestore:', err)
        );
      },

      updateOrderStatus: (orderId, status, notes) => {
        const deliveredAt = status === 'Delivered' ? Date.now() : undefined;
        set((s) => {
          const updated = s.orders.map((o) => {
            if (o.id !== orderId) return o;
            return {
              ...o,
              status,
              ...(notes ? { deliveryNotes: notes } : {}),
              ...(deliveredAt ? { deliveredAt } : {}),
            };
          });

          // Recount active deliveries for delivery boys
          const boys = s.deliveryBoys.map((b) => ({
            ...b,
            activeOrdersCount: updated.filter(
              (o) => o.assignedDeliveryBoyId === b.id && o.status !== 'Delivered' && o.status !== 'Cancelled',
            ).length,
          }));

          return { orders: updated, deliveryBoys: boys };
        });

        // Realtime Firestore sync
        updateOrderStatusInFirestore(orderId, status, notes, deliveredAt).catch((err) =>
          console.warn('Could not sync status update to Firestore:', err)
        );
      },

      assignDeliveryBoy: (orderId, deliveryBoyId) => {
        set((s) => {
          const updated = s.orders.map((o) => {
            if (o.id !== orderId) return o;
            return {
              ...o,
              assignedDeliveryBoyId: deliveryBoyId,
              status: o.status === 'Placed' || o.status === 'Packed' ? ('Shipped' as OrderStatus) : o.status,
            };
          });

          const boys = s.deliveryBoys.map((b) => ({
            ...b,
            activeOrdersCount: updated.filter(
              (o) => o.assignedDeliveryBoyId === b.id && o.status !== 'Delivered' && o.status !== 'Cancelled',
            ).length,
          }));

          return { orders: updated, deliveryBoys: boys };
        });

        // Realtime Firestore sync
        assignDeliveryBoyInFirestore(orderId, deliveryBoyId).catch((err) =>
          console.warn('Could not sync assignment to Firestore:', err)
        );
      },

      // Delivery Boys
      addDeliveryBoy: (boy) => set((s) => ({ deliveryBoys: [...s.deliveryBoys, boy] })),

      updateDeliveryBoy: (id, update) =>
        set((s) => ({
          deliveryBoys: s.deliveryBoys.map((b) => (b.id === id ? { ...b, ...update } : b)),
        })),

      deleteDeliveryBoy: (id) =>
        set((s) => ({
          deliveryBoys: s.deliveryBoys.filter((b) => b.id !== id),
        })),

      toggleDeliveryDuty: (id) => {
        let newStatus: 'on_duty' | 'offline' = 'offline';
        set((s) => ({
          deliveryBoys: s.deliveryBoys.map((b) => {
            if (b.id === id) {
              newStatus = b.status === 'offline' ? 'on_duty' : 'offline';
              return { ...b, status: newStatus };
            }
            return b;
          }),
        }));
        updateDeliveryBoyDutyInFirestore(id, newStatus).catch((err) =>
          console.warn('Could not sync duty status to Firestore:', err)
        );
      },

      setActiveDeliveryBoyId: (id) => set({ activeDeliveryBoyId: id }),

      // Product Management
      addProduct: (product) => set((s) => ({ adminProducts: [product, ...s.adminProducts] })),

      updateProduct: (slug, update) =>
        set((s) => ({
          adminProducts: s.adminProducts.map((p) => (p.slug === slug ? { ...p, ...update } : p)),
        })),

      deleteProduct: (slug) =>
        set((s) => ({
          adminProducts: s.adminProducts.filter((p) => p.slug !== slug),
        })),
    }),
    { name: 'st-shop-v4' },
  ),
);


