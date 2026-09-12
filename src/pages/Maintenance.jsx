import { Wrench } from 'lucide-react';
export default function Maintenance() {
  const enabled = import.meta.env.VITE_MAINTENANCE === 'true';
  if (!enabled) return null;
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-paper">
      <span className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5"><Wrench className="w-8 h-8 text-brand-600" /></span>
      <h1 className="font-ui font-bold text-4xl text-ink">Under maintenance</h1>
      <p className="mt-3 text-ink-2 max-w-md">We’re performing scheduled maintenance. Please check back shortly. Your local progress is saved in your browser.</p>
    </div>
  );
}
