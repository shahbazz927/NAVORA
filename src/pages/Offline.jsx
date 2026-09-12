import { WifiOff, RefreshCw } from 'lucide-react';
import { useScrollTop } from '../hooks/useLocalStorage';
export default function Offline() {
  useScrollTop();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-paper">
      <span className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5"><WifiOff className="w-8 h-8 text-amber-600" /></span>
      <h1 className="font-ui font-bold text-4xl text-ink">You’re offline</h1>
      <p className="mt-3 text-ink-2 max-w-md">No internet connection. Your questionnaire progress is saved locally and will work again when you reconnect. AI features need connectivity.</p>
      <button onClick={()=>window.location.reload()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 text-white px-5 py-2.5 text-sm font-semibold"><RefreshCw className="w-4 h-4" /> Retry</button>
    </div>
  );
}
