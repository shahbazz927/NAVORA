import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck,
  AlertCircle, Check, X, CheckCircle2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { soundFx } from '../../utils/soundFx';

const fieldMotionVariants = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

export default function AuthCard({
  mode,
  onModeChange,
  onOpenForgotPassword,
  onLoginSuccess,
}) {
  const isLogin = mode === 'login';

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);

  // Real-time password criteria evaluation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passedCriteriaCount = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

  const getPasswordStrengthDetails = () => {
    if (!password) {
      return {
        percent: 0, level: 'Empty', label: 'Enter a strong password',
        barColor: 'bg-slate-300', textColor: 'text-slate-400',
        badgeBg: 'bg-slate-100 text-slate-500 border-slate-200',
      };
    }
    if (password.length < 6) {
      return {
        percent: 15, level: 'Too Short', label: 'Minimum 6 characters required',
        barColor: 'bg-rose-500', textColor: 'text-rose-600',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      };
    }
    switch (passedCriteriaCount) {
      case 1:
        return {
          percent: 25, level: 'Weak', label: 'Weak — easily guessed',
          barColor: 'bg-rose-500', textColor: 'text-rose-600',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 2:
        return {
          percent: 50, level: 'Fair', label: 'Fair — add symbols or numbers',
          barColor: 'bg-amber-500', textColor: 'text-amber-600',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 3:
        return {
          percent: 75, level: 'Good', label: 'Good — almost secure',
          barColor: 'bg-sky-500', textColor: 'text-sky-600',
          badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 4:
        return {
          percent: 100, level: 'Strong', label: 'Excellent & highly secure',
          barColor: 'bg-emerald-500', textColor: 'text-emerald-600',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      default:
        return {
          percent: 25, level: 'Weak', label: 'Weak',
          barColor: 'bg-rose-500', textColor: 'text-rose-600',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        };
    }
  };

  const strength = getPasswordStrengthDetails();
const triggerError = (msg) => {
    setErrorMessage(msg);
    setSuccessMessage(null);
    setShakeKey((prev) => prev + 1);
    soundFx.playError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !email.includes('@') || !email.includes('.')) {
      triggerError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      triggerError('Password must be at least 6 characters.');
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        triggerError('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        triggerError('You must accept the terms of service.');
        return;
      }
      if (passedCriteriaCount < 1) {
        triggerError('Please choose a stronger password to continue.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          triggerError(error.message || 'Invalid email or password. Please try again.');
          return;
        }
        if (data?.user) {
          soundFx.playSuccess();
          onLoginSuccess({
            email: data.user.email || email,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            loggedInAt: new Date(),
          });
        }
      } else {
        const signupEmail = email.trim();
        const { error } = await supabase.auth.signUp({
          email: signupEmail,
          password,
          options: { data: { full_name: name.trim() || signupEmail.split('@')[0] } },
        });
        if (error) {
          triggerError(error.message || 'Failed to create Supabase account.');
          return;
        }
        await supabase.auth.signOut().catch(() => {});
        soundFx.playSuccess();
        setPassword('');
        setConfirmPassword('');
        setName('');
        setEmail(signupEmail);
        setErrorMessage(null);
        setSuccessMessage(
          'Your account has been created. Please check your email and verify your address before logging in.'
        );
        onModeChange('login');
      }
    } catch (err) {
      // TEMP DEBUG: log the real error object so we can diagnose the "Failed to fetch".
      console.error('[supabase.auth] error object:', err);
      triggerError(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      if (error) {
        triggerError(error.message || `Unable to authenticate with ${provider}.`);
      }
    } catch (err) {
      triggerError(err.message || `Social login with ${provider} failed.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key={shakeKey}
      id="auth-main-card"
      animate={shakeKey > 0 ? { x: [0, -10, 10, -8, 8, -4, 4, 0], rotate: [0, -1, 1, -0.8, 0.8, 0] } : {}}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="relative w-full max-w-[440px] rounded-3xl p-7 sm:p-8 backdrop-blur-2xl transition-all duration-300 shadow-2xl border bg-white/95 border-slate-200/90 text-slate-900 shadow-xl shadow-slate-200/60 ring-1 ring-black/5"
    >
      {/* Decorative Card Top Glow Bar */}
      <div className="absolute -top-px left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80" />

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1.5 rounded-2xl mb-6 border transition-colors bg-slate-100/90 border-slate-200/80">
        <button
          type="button"
          id="tab-login"
          onClick={() => { setErrorMessage(null); setSuccessMessage(null); onModeChange('login'); }}
          className={`relative py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
            isLogin ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          id="tab-signup"
          onClick={() => { setErrorMessage(null); setSuccessMessage(null); onModeChange('signup'); }}
          className={`relative py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
            !isLogin ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Create Account
        </button>
      </div>
{/* Form Title & Subtitle */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {isLogin ? 'Welcome back' : 'Create an Account'}
        </h2>
        <p className="text-xs mt-1.5 text-slate-500">
          {isLogin
            ? 'Enter your credentials to access your NAVORA portal'
            : 'Join NAVORA and unlock intelligent high-performance workflows'}
        </p>
      </div>

      {/* Error Message with Shake feedback */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name field for Sign Up */}
        <AnimatePresence>
          {!isLogin && (
            <motion.div
              key="signup-name-field"
              variants={fieldMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1.5 overflow-hidden"
            >
              <label htmlFor="input-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Full Name
              </label>
              <motion.div
                animate={{ y: focusedField === 'name' ? -2 : 0, boxShadow: focusedField === 'name' ? '0 10px 25px -5px rgba(59,130,246,0.12)' : 'none' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative rounded-xl"
              >
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="input-name"
                  type="text"
                  placeholder="Alex Rivera"
                  value={name}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                    if (successMessage) setSuccessMessage(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none border bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-slate-900 placeholder:text-slate-400"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email field */}
        <div className="space-y-1.5">
          <label htmlFor="input-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Email Address
          </label>
          <motion.div
            animate={{ y: focusedField === 'email' ? -2 : 0, boxShadow: focusedField === 'email' ? '0 10px 25px -5px rgba(59,130,246,0.12)' : 'none' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative rounded-xl"
          >
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="input-email"
              type="email"
              required
              placeholder="name@company.com"
              autoComplete="email"
              value={email}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
                if (successMessage) setSuccessMessage(null);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none border bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-slate-900 placeholder:text-slate-400"
            />
          </motion.div>
        </div>
{/* Password field */}
        <div className="space-y-1.5">
          <label htmlFor="input-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Password
          </label>
          <motion.div
            animate={{ y: focusedField === 'password' ? -2 : 0, boxShadow: focusedField === 'password' ? '0 10px 25px -5px rgba(59,130,246,0.12)' : 'none' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative rounded-xl"
          >
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="input-password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
                if (successMessage) setSuccessMessage(null);
              }}
              className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm transition-all outline-none border bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="button"
              id="toggle-password-visibility"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </motion.div>
<AnimatePresence>
            {!isLogin && password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="pt-2 pb-1 space-y-2.5 overflow-hidden"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Strength:</span>
                    <span className={`font-semibold ${strength.textColor}`}>{strength.level}</span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${strength.badgeBg}`}>
                    {strength.percent}% Secure
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-100 p-0.5 rounded-full border border-slate-200/80">
                  {[1, 2, 3, 4].map((step) => {
                    const isActive = strength.percent / 25 >= step;
                    return (
                      <motion.div
                        key={step}
                        initial={false}
                        animate={{
                          backgroundColor: isActive
                            ? strength.percent === 25 ? '#F43F5E'
                              : strength.percent === 50 ? '#F59E0B'
                                : strength.percent === 75 ? '#0EA5E9'
                                  : '#10B981'
                            : '#E2E8F0',
                        }}
                        transition={{ duration: 0.3 }}
                        className="rounded-full"
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-0.5 text-[11px]">
                  <div className={`flex items-center gap-1.5 transition-colors ${hasMinLength ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {hasMinLength ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                    </div>
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors ${hasUppercase ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasUppercase ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {hasUppercase ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                    </div>
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors ${hasNumber ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {hasNumber ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                    </div>
                    <span>Number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors ${hasSpecial ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasSpecial ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {hasSpecial ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                    </div>
                    <span>Special character</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
{/* Confirm Password (Sign Up only) */}
        <AnimatePresence>
          {!isLogin && (
            <motion.div
              key="signup-confirm-password-field"
              variants={fieldMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1.5 overflow-hidden"
            >
              <label htmlFor="input-confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Confirm Password
              </label>
              <motion.div
                animate={{ y: focusedField === 'confirmPassword' ? -2 : 0, boxShadow: focusedField === 'confirmPassword' ? '0 10px 25px -5px rgba(59,130,246,0.12)' : 'none' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative rounded-xl"
              >
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                    if (successMessage) setSuccessMessage(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none border bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
{/* Checkbox Options */}
        <motion.div
          variants={fieldMotionVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.35, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between pt-1"
        >
          {isLogin ? (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/40 cursor-pointer"
              />
              <span className="text-xs text-slate-600">Remember for 30 days</span>
            </label>
          ) : (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/40 cursor-pointer"
              />
              <span className="text-xs text-slate-600">
                I agree to the <span className="text-blue-600 font-medium underline">Terms &amp; Privacy</span>
              </span>
            </label>
          )}
        </motion.div>

        {/* Forgot Password link (login only) */}
        <motion.button
          type="button"
          onClick={onOpenForgotPassword}
          variants={fieldMotionVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.35, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex items-center justify-end text-xs font-medium text-blue-600 hover:text-blue-500 underline cursor-pointer mt-1"
        >
          Forgot password?
        </motion.button>

        {/* Submit Button */}
        <motion.button
          variants={fieldMotionVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.35, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          type="submit"
          id="auth-submit-btn"
          disabled={isLoading}
          className="w-full relative group mt-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </motion.button>
      </form>
{/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center border-slate-200">
          <div className="w-full border-t border-inherit" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-slate-400">Or continue with</span>
        </div>
      </div>

      {/* Social Providers with real Supabase OAuth */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { id: 'google', name: 'Google', provider: 'google', icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          )},
          { id: 'github', name: 'GitHub', provider: 'github', icon: (
            <svg className="w-4 h-4 fill-current text-slate-800" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          )},
          { id: 'apple', name: 'Apple', provider: 'apple', icon: (
            <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 1.01-2.84-.89.04-1.98.6-2.61 1.34-.56.64-1.05 1.68-.92 2.7 1 .08 2.01-.52 2.52-1.2z"/>
            </svg>
          )},
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialAuth(p.provider)}
            title={`Sign in with ${p.name}`}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all duration-200 active:scale-95 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 cursor-pointer disabled:opacity-50"
          >
            {p.icon}
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Security Footer Notice */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Connected to Supabase PostgreSQL &amp; Auth</span>
      </div>
    </motion.div>
  );
}