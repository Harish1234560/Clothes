import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductPage from './pages/ProductPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import TrackOrderPage from './pages/TrackOrderPage';
import WishlistPage from './pages/WishlistPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminDeliveryBoysPage from './pages/admin/AdminDeliveryBoysPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';

// Delivery Boy (Delivery Partner) Pages
import DeliveryLayout from './pages/delivery/DeliveryLayout';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import DeliveryTasksPage from './pages/delivery/DeliveryTasksPage';
import DeliveryHistoryPage from './pages/delivery/DeliveryHistoryPage';
import DeliveryProfilePage from './pages/delivery/DeliveryProfilePage';

import ProtectedRoute from './components/auth/ProtectedRoute';
import { useShop } from './store/shop';
import { subscribeToFirebaseAuth } from './services/firebaseAuth';
import { listenToFirestoreOrders } from './services/firebaseStore';

export default function App() {
  const setUser = useShop((s) => s.setUser);
  const setOrders = useShop((s) => s.setOrders);

  useEffect(() => {
    // Realtime Firebase Auth sync
    const unsubAuth = subscribeToFirebaseAuth((fbUser) => {
      if (fbUser) {
        setUser(fbUser);
      }
    });

    // Realtime Firestore Orders sync
    const unsubOrders = listenToFirestoreOrders((fbOrders) => {
      if (fbOrders.length > 0) {
        setOrders(fbOrders);
      }
    });

    return () => {
      unsubAuth();
      unsubOrders();
    };
  }, [setUser, setOrders]);

  return (
    <Routes>
      {/* Storefront Customer Routes */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage mode="all" />} />
        <Route path="new-arrivals" element={<ShopPage mode="new" />} />
        <Route path="sale" element={<ShopPage mode="sale" />} />
        <Route path="category/:slug" element={<ShopPage mode="category" />} />
        <Route path="products/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="track-order" element={<TrackOrderPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Protected Admin Console Routes (Only 'admin' role) */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="delivery" element={<AdminDeliveryBoysPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
        </Route>
      </Route>

      {/* Protected Delivery Partner Routes ('delivery' or 'admin' roles) */}
      <Route element={<ProtectedRoute allowedRoles={['delivery', 'admin']} />}>
        <Route path="delivery" element={<DeliveryLayout />}>
          <Route index element={<DeliveryDashboard />} />
          <Route path="tasks" element={<DeliveryTasksPage />} />
          <Route path="history" element={<DeliveryHistoryPage />} />
          <Route path="profile" element={<DeliveryProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
