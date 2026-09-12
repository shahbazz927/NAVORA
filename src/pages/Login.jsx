import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import loginLogo from '../assets/login-logo.png';
import AuthCard from '../components/auth/AuthCard';
import BackgroundEffects from '../components/auth/BackgroundEffects';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import { soundFx } from '../utils/soundFx';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  const [isAnimating, setIsAnimating] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Entrance animation + sound
  useEffect(() => {
    soundFx.enabled = true;
    soundFx.playWhoosh();
    const shimmerTimer = setTimeout(() => soundFx.playShimmer(), 450);
    const finishTimer = setTimeout(() => setIsAnimating(false), 1100);
    return () => {
      clearTimeout(shimmerTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  // On load, restore any existing Supabase session and hydrate context
  useEffect(() => {
    let mounted = true;
    async function checkAuthSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data?.session?.user && mounted) {
          const user = data.session.user;
          setUser({
            email: user.email || '',
            name: user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : ''),
            avatarUrl: user.user_metadata?.avatar_url,
            loggedInAt: new Date(),
          });
        }
      } catch {
        /* ignore */
      } finally {
        if (mounted) setIsCheckingAuth(false);
      }
    }
    checkAuthSession();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginSuccess = (session) => {
    setUser(session);
    const from = location.state?.from;
    // Prevent open redirect — only same-origin absolute paths
    const safeFrom = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : null;
    if (safeFrom) navigate(safeFrom, { replace: true });
    else navigate('/get-started');
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden bg-gradient-to-b from-slate-50 via-sky-50/25 to-slate-100 text-slate-900">
      {/* Cinematic Ambient Atmosphere Background */}
      <BackgroundEffects theme="light" animationActive={isAnimating} />

      {/* Main Stage */}
      <main className="w-full max-w-md mx-auto py-8 flex flex-col items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {isCheckingAuth ? (
            <motion.div
              key="auth-checking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"
            />
          ) : (
            <div key="auth-stage">
              {/* Brand / Logo Entrance */}
              <div className="relative flex flex-col items-center mb-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mb-2"
                >
                  <img
                    src={loginLogo}
                    alt="NAVORA"
                    className="h-12 w-auto object-contain"
                  />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.4 }}
                  className="font-display text-2xl sm:text-3xl font-bold tracking-tight"
                >
                  Welcome to <span className="text-brand-600">NAVORA</span>
                </motion.h1>
              </div>

              {/* Staggered form reveal */}
              <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex justify-center"
              >
                <AuthCard
                  mode={authMode}
                  onModeChange={setAuthMode}
                  onOpenForgotPassword={() => setIsForgotModalOpen(true)}
                  onLoginSuccess={handleLoginSuccess}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Password Reset Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        theme="light"
      />
    </div>
  );
}