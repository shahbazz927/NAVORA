import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <span className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-brand-600" />
      </span>
      <h3 className="font-ui font-semibold text-lg text-ink">{title}</h3>
      {description && <p className="mt-2 text-sm text-ink-2 max-w-sm">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 shadow-brand transition-colors">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
