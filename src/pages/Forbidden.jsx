import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { useScrollTop } from '../hooks/useLocalStorage';
export default function Forbidden() {
  useScrollTop();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-paper">
      <span className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5"><ShieldAlert className="w-8 h-8 text-amber-600" /></span>
      <h1 className="font-ui font-bold text-4xl text-ink">Permission denied</h1>
      <p className="mt-3 text-ink-2 max-w-md">You don’t have permission to view this. If you should have access, try signing in with a different account.</p>
      <div className="flex gap-3 mt-6">
        <Link to="/login" className="rounded-xl bg-brand-500 text-white px-5 py-2.5 text-sm font-semibold">Sign in</Link>
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-medium"><Home className="w-4 h-4" /> Home</Link>
      </div>
    </div>
  );
}
