import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ErrorState({ title = 'Something went wrong', message, onRetry, correlationId }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <span className="w-14 h-14 rounded-2xl bg-error-soft border border-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-error" />
      </span>
      <h3 className="font-ui font-semibold text-lg text-ink">{title}</h3>
      {message && <p className="mt-2 text-sm text-ink-2 max-w-md">{message}</p>}
      {correlationId && <p className="mt-2 text-xs text-ink-3 font-mono">Ref: {correlationId}</p>}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        {onRetry && (
          <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 shadow-brand transition-colors">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        )}
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface hover:bg-paper text-sm font-medium px-5 py-2.5 transition-colors">
          <Home className="w-4 h-4" /> Go home
        </Link>
      </div>
    </div>
  );
}
