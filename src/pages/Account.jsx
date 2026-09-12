import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Trash2, Download, LogOut, KeyRound, Mail, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';
import { useScrollTop } from '../hooks/useLocalStorage';

export default function Account() {
  useScrollTop();
  const { user, setUser, reset } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data?.user?.email || user?.email || ''));
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    reset();
    navigate('/login');
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErr(null); setMsg(null);
    if (!newPassword || newPassword.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setBusy(false);
    if (error) setErr(error.message);
    else { setMsg('Password updated.'); setNewPassword(''); }
  };

  const handleExport = () => {
    try {
      const raw = localStorage.getItem('novera-state-v1') || '{}';
      const blob = new Blob([raw], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'novera-data.json'; a.click();
      URL.revokeObjectURL(url);
      setMsg('Local data exported.');
    } catch { setErr('Export failed.'); }
  };

  const handleClearData = () => {
    reset();
    setMsg('Local questionnaire data cleared.');
  };

  const handleDeleteAccount = async () => {
    setErr(null);
    // Supabase deletion requires backend or direct auth admin; we sign out and clear local data and ask to contact support for DB deletion.
    await supabase.auth.signOut().catch(() => {});
    reset();
    setUser(null);
    setMsg('Signed out and local data cleared. To fully delete server data, contact support — see Privacy Policy.');
    setShowDelete(false);
  };

  return (
    <div className="bg-paper min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
        <h1 className="font-ui font-bold text-3xl text-ink">Account settings</h1>
        <p className="mt-2 text-sm text-ink-2">Manage your NAVORA account. Only real controls are shown.</p>

        {msg && <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex gap-2"><Shield className="w-4 h-4 mt-0.5" />{msg}</div>}
        {err && <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex gap-2"><AlertTriangle className="w-4 h-4 mt-0.5" />{err}</div>}

        <div className="mt-8 space-y-6">
          <section className="bg-surface border border-line rounded-2xl p-6">
            <h2 className="font-ui font-semibold flex items-center gap-2"><Mail className="w-4 h-4" /> Email</h2>
            <p className="text-sm text-ink-2 mt-1">{email || 'Not signed in'}</p>
            {!email && <Link to="/login" className="mt-3 inline-flex rounded-xl bg-brand-500 text-white px-4 py-2 text-sm font-semibold">Sign in</Link>}
          </section>

          <section className="bg-surface border border-line rounded-2xl p-6">
            <h2 className="font-ui font-semibold flex items-center gap-2"><KeyRound className="w-4 h-4" /> Change password</h2>
            <p className="text-xs text-ink-3 mt-1">Uses Supabase <code>auth.updateUser</code> — current session required. Recovery email flow is at <Link to="/reset-password" className="text-brand-600 underline">Reset password</Link>.</p>
            <form onSubmit={handleUpdatePassword} className="mt-4 flex gap-2 flex-wrap">
              <input type="password" placeholder="New password (min 6)" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="flex-1 min-w-[200px] rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-brand-400" />
              <button disabled={busy} className="rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 text-sm font-semibold disabled:opacity-50">Update</button>
            </form>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-6">
            <h2 className="font-ui font-semibold flex items-center gap-2"><Download className="w-4 h-4" /> Data</h2>
            <p className="text-sm text-ink-2">Export your local questionnaire data or clear it from this browser.</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <button onClick={handleExport} className="rounded-xl border border-line bg-surface hover:bg-paper px-4 py-2 text-sm font-medium">Export JSON</button>
              <button onClick={handleClearData} className="rounded-xl border border-line bg-surface hover:bg-paper px-4 py-2 text-sm font-medium">Clear local data</button>
            </div>
            <p className="text-xs text-ink-3 mt-2">Keys: <code>novera-state-v1</code> in localStorage; server keeps only auth record via Supabase.</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-6">
            <h2 className="font-ui font-semibold flex items-center gap-2"><LogOut className="w-4 h-4" /> Session</h2>
            <button onClick={handleSignOut} className="mt-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 text-sm font-semibold">Sign out</button>
          </section>

          <section className="bg-surface border border-red-200 rounded-2xl p-6">
            <h2 className="font-ui font-semibold flex items-center gap-2 text-error"><Trash2 className="w-4 h-4" /> Delete account data</h2>
            <p className="text-sm text-ink-2 mt-1">Removes local data and signs you out. For full server-side deletion, contact support per Privacy Policy.</p>
            {!showDelete ? <button onClick={()=>setShowDelete(true)} className="mt-3 rounded-xl border border-red-200 text-error hover:bg-error-soft px-5 py-2 text-sm font-semibold">Delete local data &amp; sign out</button>
            : <div className="mt-3 flex gap-2"><button onClick={handleDeleteAccount} className="rounded-xl bg-error text-white px-5 py-2 text-sm font-semibold">Confirm</button><button onClick={()=>setShowDelete(false)} className="rounded-xl border border-line px-5 py-2 text-sm">Cancel</button></div>}
          </section>

          <p className="text-xs text-ink-3">See <Link to="/privacy" className="underline">Privacy</Link> · <Link to="/cookies" className="underline">Cookies</Link> · <Link to="/support" className="underline">Support</Link></p>
        </div>
      </div>
    </div>
  );
}
