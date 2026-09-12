import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useScrollTop } from '../hooks/useLocalStorage';

export default function VerifyEmail() {
  useScrollTop();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setErr(null); setMsg(null);
    if (!email.includes('@')) { setErr('Enter a valid email.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
    setBusy(false);
    if (error) setErr(error.message);
    else setMsg('Verification email resent. Check your inbox (and spam).');
  };

  return (
    <div className="bg-paper min-h-[70vh] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md bg-surface border border-line rounded-3xl p-8 shadow-card">
        <span className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4"><Mail className="w-6 h-6 text-brand-600" /></span>
        <h1 className="font-ui font-bold text-2xl text-ink">Verify your email</h1>
        <p className="mt-2 text-sm text-ink-2">After signing up, Supabase sends a verification link to your email. Click it to activate your account, then <Link to="/login" className="text-brand-600 underline">sign in</Link>.</p>
        {msg && <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex gap-2"><CheckCircle2 className="w-4 h-4" />{msg}</div>}
        {err && <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex gap-2"><AlertCircle className="w-4 h-4" />{err}</div>}
        <form onSubmit={handleResend} className="mt-6 space-y-3">
          <input type="email" required placeholder="name@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
          <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 text-sm disabled:opacity-50">
            {busy ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RefreshCw className="w-4 h-4" />} Resend verification email
          </button>
        </form>
        <p className="mt-4 text-xs text-ink-3 text-center"><Link to="/login" className="underline">Back to sign in</Link></p>
      </div>
    </div>
  );
}
