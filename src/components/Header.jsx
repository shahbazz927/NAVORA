import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/study-abroad', label: 'Global Study' },
  { to: '/get-started', label: 'Get Started' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/advisor', label: 'Advisor' },
  { to: '/parents', label: 'For Parents' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/85 backdrop-blur-xl shadow-[0_1px_0_0_var(--color-line),0_10px_30px_-18px_rgba(11,30,61,0.25)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[4.25rem]">
          <Link to="/" className="flex items-center" aria-label="NAVORA home">
            <Logo size="md" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={`px-4 py-2 rounded-full text-[0.92rem] font-medium transition-colors ${
                    active
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-ink-2 hover:text-ink hover:bg-paper-deep'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/account" className="flex items-center gap-2 rounded-full hover:bg-paper-deep px-2 py-1 -ml-2 transition-colors">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-50 text-brand-700 font-ui font-semibold text-sm ring-1 ring-brand-100">
                    {(user.name || user.email || '?').charAt(0).toUpperCase()}
                  </span>
                  <div className="text-left leading-tight">
                    <p className="text-[0.82rem] font-semibold text-ink truncate max-w-[9rem]">{user.name || user.email}</p>
                    <p className="text-xs text-ink-3">View account</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-ink-3 hover:text-error flex items-center gap-1 transition-colors cursor-pointer ml-1"
                >
                  <LogOut className="w-3 h-3" /> Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-700 border border-brand-200 hover:bg-brand-50 transition-colors"
              >
                Sign In
              </Link>
            )}
            {!user && (
              <Link to="/get-started">
                <span className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-sm px-5 py-2.5 shadow-brand transition-all hover:-translate-y-px">
                  Start Your Path
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-2 rounded-lg text-ink hover:bg-paper-deep transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-line bg-white overflow-hidden"
          >
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={active ? 'page' : undefined}
                    className={`block px-3 py-3 rounded-xl text-[0.95rem] font-medium transition-colors ${
                      active ? 'text-brand-700 bg-brand-50' : 'text-ink-2 hover:text-ink hover:bg-paper'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 space-y-2">
                {user ? (
                  <div className="px-1">
                    <Link to="/account" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-50 border border-brand-100 hover:bg-brand-100 transition-colors">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-brand-700 font-ui font-semibold text-sm">
                        {(user.name || user.email || '?').charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{user.name || user.email}</p>
                        <p className="text-xs text-ink-3">View account</p>
                      </div>
                    </Link>
                    <button onClick={handleLogout} className="mt-2 text-xs text-ink-3 flex items-center gap-1 px-3"><LogOut className="w-3 h-3" /> Sign out</button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 rounded-xl border border-brand-200 text-brand-700 font-ui font-semibold text-sm px-5 py-3 transition-colors hover:bg-brand-50"
                  >
                    Sign In
                  </Link>
                )}
                {!user && (
                  <Link
                    to="/get-started"
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-sm px-5 py-3 shadow-brand transition-colors"
                  >
                    Start Your Path
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
