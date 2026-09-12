import Button from '../Button';
import { ArrowRight } from 'lucide-react';
export default function CompareBar({ count, onCompare, onClear }) {
  if (!count) return null;
  return (
    <div className="mt-4 sticky top-[4.5rem] z-20 rounded-xl bg-brand-950 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 shadow-card">
      <span className="text-sm font-semibold">{count} selected for comparison</span>
      <span className="flex items-center gap-2">
        <button type="button" onClick={onClear} className="text-xs font-semibold text-white/80 underline">Clear</button>
        <Button size="sm" className="bg-white text-ink hover:bg-brand-50" onClick={onCompare}>Compare selected<ArrowRight className="w-3.5 h-3.5"/></Button>
      </span>
    </div>
  );
}
