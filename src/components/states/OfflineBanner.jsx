import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  if (!offline) return null;
  return (
    <div role="status" aria-live="polite" className="sticky top-[4.25rem] z-30 bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 flex items-center justify-center gap-2 text-sm">
      <WifiOff className="w-4 h-4" /> You are offline. Some features may not work until you reconnect.
    </div>
  );
}
