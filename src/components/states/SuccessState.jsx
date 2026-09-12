import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SuccessState({ title = 'Success', message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <span className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
      </span>
      <h3 className="font-ui font-semibold text-lg text-ink">{title}</h3>
      {message && <p className="mt-2 text-sm text-ink-2 max-w-md">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 shadow-brand transition-colors">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
