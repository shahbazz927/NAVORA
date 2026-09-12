import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useScrollTop } from '../hooks/useLocalStorage';

export default function ResetPassword() {
  useScrollTop();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [hasSession, setHasSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setHasSession(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null); setMsg(null);
    if (password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setErr('Passwords do not match.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setErr(error.message);
    else { setMsg('Password updated. You can now sign in.'); setTimeout(()=>navigate('/login'), 1200); }
  };

  return (
    <div className="bg-paper min-h-[70vh] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md bg-surface border border-line rounded-3xl p-8 shadow-card">
        <span className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4"><KeyRound className="w-6 h-6 text-brand-600" /></span>
        <h1 className="font-ui font-bold text-2xl text-ink">Set a new password</h1>
        {hasSession === false && <p className="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">This link is only valid when opened from your recovery email. If it expired, request a new one from <Link to="/login" className="underline">Sign in → Forgot password</Link>.</p>}
        {hasSession && <p className="mt-2 text-sm text-ink-2">Enter your new password. The recovery token is single-use and expiring (managed by Supabase).</p>}
        {msg && <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex gap-2"><CheckCircle2 className="w-4 h-4" />{msg}</div>}
        {err && <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex gap-2"><AlertCircle className="w-4 h-4" />{err}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input type="password" required placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm focus:border-brand-400 outline-none" />
          <input type="password" required placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm focus:border-brand-400 outline-none" />
          <button disabled={busy} className="w-full rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 text-sm disabled:opacity-50">
            {busy ? 'Updating…' : 'Update password'}
          </button>
        </form>
        <p className="mt-4 text-xs text-ink-3 text-center"><Link to="/login" className="underline">Back to sign in</Link></p>
      </div>
    </div>
  );
}
