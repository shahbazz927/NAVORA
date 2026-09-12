import { Link, useNavigate } from 'react-router-dom';
import { Clock, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';
export default function SessionExpired() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const handleContinue = async () => {
    await supabase.auth.signOut().catch(()=>{});
    setUser(null);
    navigate('/login');
  };
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-paper">
      <span className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5"><Clock className="w-8 h-8 text-brand-600" /></span>
      <h1 className="font-ui font-bold text-3xl text-ink">Session expired</h1>
      <p className="mt-3 text-ink-2 max-w-md">Your session has expired. Please sign in again. We’ll return you to where you were, without open-redirect risks (only same-origin paths).</p>
      <div className="flex gap-3 mt-6">
        <button onClick={handleContinue} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 text-white px-5 py-2.5 text-sm font-semibold"><LogIn className="w-4 h-4" /> Sign in again</button>
        <Link to="/" className="rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-medium">Home</Link>
      </div>
    </div>
  );
}
