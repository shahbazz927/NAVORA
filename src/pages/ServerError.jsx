import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useScrollTop } from '../hooks/useLocalStorage';
export default function ServerError() {
  useScrollTop();
  const correlationId = Math.random().toString(36).slice(2, 8).toUpperCase();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-paper">
      <span className="w-16 h-16 rounded-2xl bg-error-soft border border-red-200 flex items-center justify-center mb-5"><AlertTriangle className="w-8 h-8 text-error" /></span>
      <h1 className="font-ui font-bold text-4xl text-ink">Something went wrong</h1>
      <p className="mt-3 text-ink-2 max-w-md">An unexpected error occurred. Please retry. If it persists, contact support with the reference below.</p>
      <p className="mt-2 text-xs font-mono text-ink-3">Ref: {correlationId}</p>
      <div className="flex gap-3 mt-6">
        <button onClick={()=>window.location.reload()} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 text-white px-5 py-2.5 text-sm font-semibold"><RefreshCw className="w-4 h-4" /> Retry</button>
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-medium"><Home className="w-4 h-4" /> Home</Link>
      </div>
    </div>
  );
}
