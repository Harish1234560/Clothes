import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Sparkles,
  TrendingUp,
  Percent,
  Search,
  Sun,
  Moon,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useScrolled } from '@/hooks/useScrolled';
import { classNames } from '@/lib/format';

const navLinks = [
  { label: 'Books', href: '/books', hasMega: true },
  { label: 'Categories', href: '/categories' },
  { label: 'Authors', href: '/authors' },
  { label: 'New Releases', href: '/new-releases' },
  { label: 'Bestsellers', href: '/bestsellers' },
  { label: 'Offers', href: '/offers' },
];

const megaCategories = [
  { label: 'Fiction', icon: BookOpen },
  { label: 'Non-fiction', icon: BookOpen },
  { label: 'Self-help', icon: Sparkles },
  { label: 'Business', icon: TrendingUp },
  { label: 'Children', icon: BookOpen },
  { label: 'Comics', icon: BookOpen },
  { label: 'Academic', icon: BookOpen },
  { label: 'Regional', icon: BookOpen },
];

const megaAuthors = [
  'Aravind Mehta',
  'Priya Nair',
  'Rohan Kapoor',
  'Meera Iyer',
  'Vikram Joshi',
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const scrolled = useScrolled(40);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchKey = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(true);
    }
    if (e.key === 'Escape') setSearchOpen(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleSearchKey);
    return () => window.removeEventListener('keydown', handleSearchKey);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    } else {
      setSearchValue('');
    }
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Scroll progress bar */}
      <ScrollProgress />

      <header
        className={classNames(
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-450 ease-premium',
          scrolled ? 'glass-nav-solid shadow-soft' : 'glass-nav',
          !scrolled && !megaOpen && 'border-b border-transparent',
          scrolled && 'border-b border-line'
        )}
      >
        <div className="container-shell">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <span className="font-serif text-2xl font-semibold tracking-tight text-ink">
                Athenaeum
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasMega && setMegaOpen(true)}
                  onMouseLeave={() => link.hasMega && setMegaOpen(false)}
                >
                  <Link
                    to={link.href}
                    className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors duration-300 hover:text-accent"
                  >
                    {link.label}
                    {link.hasMega && <ChevronDown className="w-3.5 h-3.5" />}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden items-center gap-2 rounded-full border border-line bg-bg-1/50 px-3.5 py-2 text-sm text-ink-faint transition-colors hover:border-accent hover:text-ink-soft sm:flex"
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline">Search</span>
                <kbd className="hidden rounded border border-line bg-bg-2 px-1.5 py-0.5 text-[10px] font-medium md:inline">
                  Ctrl K
                </kbd>
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-bg-2 hover:text-accent sm:hidden"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-bg-2 hover:text-accent"
                aria-label="Toggle theme"
              >
                {theme === 'paper' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Wishlist */}
              <Link
                to="/account/wishlist"
                className="relative grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-bg-2 hover:text-accent"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-ink">
                  0
                </span>
              </Link>

              {/* Account */}
              <Link
                to="/account"
                className="hidden h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-bg-2 hover:text-accent sm:grid"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-bg-2 hover:text-accent"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-ink">
                  0
                </span>
              </Link>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-bg-2 lg:hidden"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              className="absolute left-0 right-0 top-full hidden lg:block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <div className="glass-nav-solid border-b border-line shadow-card">
                <div className="container-shell py-8">
                  <div className="grid grid-cols-12 gap-8">
                    {/* Categories */}
                    <div className="col-span-5">
                      <p className="label-eyebrow mb-4 text-ink-faint">Categories</p>
                      <div className="grid grid-cols-2 gap-2">
                        {megaCategories.map((cat) => (
                          <Link
                            key={cat.label}
                            to={`/categories/${cat.label.toLowerCase().replace(/[^a-z]/g, '-')}`}
                            className="flex items-center gap-2.5 rounded-12 px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-bg-2 hover:text-accent"
                          >
                            <cat.icon className="w-4 h-4 text-ink-faint" />
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Authors */}
                    <div className="col-span-4">
                      <p className="label-eyebrow mb-4 text-ink-faint">Featured Authors</p>
                      <div className="flex flex-col gap-2">
                        {megaAuthors.map((author) => (
                          <Link
                            key={author}
                            to={`/authors/${author.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center gap-2.5 rounded-12 px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-bg-2 hover:text-accent"
                          >
                            <Users className="w-4 h-4 text-ink-faint" />
                            {author}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Promo card */}
                    <div className="col-span-3">
                      <Link
                        to="/offers"
                        className="block overflow-hidden rounded-20 bg-gradient-to-br from-success to-[#2A4A3F] p-6 text-white"
                      >
                        <Percent className="w-6 h-6 mb-3 text-accent" />
                        <p className="font-serif text-xl font-medium leading-tight">
                          Up to 40% off this week
                        </p>
                        <p className="mt-2 text-xs text-white/70">
                          Curated deals across fiction and non-fiction
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search overlay */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        value={searchValue}
        onChange={setSearchValue}
        ref={searchRef}
      />

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[101] h-0.5 bg-transparent">
      <div
        className="h-full bg-accent transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${progress / 100})`, transformOrigin: 'left' }}
      />
    </div>
  );
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  ref: React.RefObject<HTMLInputElement>;
}

function SearchOverlay({ open, onClose, value, onChange, ref }: SearchOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center pt-20 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-2xl rounded-28 bg-bg-1 shadow-float"
            initial={{ scale: 0.97, y: -10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Search className="w-5 h-5 text-ink-faint" />
              <input
                ref={ref}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search books, authors, ISBN..."
                className="flex-1 bg-transparent text-body text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-ink-faint hover:bg-bg-2 hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="label-eyebrow mb-3 text-ink-faint">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {['Mystery', 'Self-help', 'Aravind Mehta', 'Fiction', 'Business'].map((s) => (
                  <button
                    key={s}
                    onClick={() => { onChange(s); }}
                    className="rounded-full border border-line bg-bg-2 px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-bg-1 shadow-float"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-serif text-xl font-semibold text-ink">Menu</span>
              <button onClick={onClose} className="rounded-full p-2 text-ink-soft hover:bg-bg-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-3 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={onClose}
                  className="rounded-12 px-4 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-bg-2 hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-line" />
              <Link
                to="/account"
                onClick={onClose}
                className="rounded-12 px-4 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-bg-2 hover:text-accent"
              >
                My Account
              </Link>
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
