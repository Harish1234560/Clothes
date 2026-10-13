import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import ScrollToTop from './ScrollToTop';
import TryOnButton from './TryOnButton';

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="layout-content">
        <Outlet />
      </main>
      <Footer />
      <TryOnButton />
    </>
  );
}
