import { Link } from 'react-router-dom';
import { SearchX, Home, Compass } from 'lucide-react';
import { useScrollTop } from '../hooks/useLocalStorage';
export default function NotFound() {
  useScrollTop();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-paper">
      <span className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5"><SearchX className="w-8 h-8 text-brand-600" /></span>
      <h1 className="font-ui font-bold text-4xl text-ink">Page not found</h1>
      <p className="mt-3 text-ink-2 max-w-md">The destination doesn’t exist or was moved. Check the URL or return to a known location — we won’t redirect you to an unsafe external URL.</p>
      <div className="flex gap-3 mt-6 flex-wrap justify-center">
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-sm font-semibold"><Home className="w-4 h-4" /> Go home</Link>
        <Link to="/get-started" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-medium"><Compass className="w-4 h-4" /> Start assessment</Link>
      </div>
    </div>
  );
}
