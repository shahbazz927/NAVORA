import { X, Scale, ArrowRight } from 'lucide-react';
import Button from '../Button';
function MatchPill({ level }) {
  const cls = level==='Strong match'||level==='Strong fit' ? 'bg-brand-950 text-white' : level==='Good match'||level==='Good option' ? 'bg-success text-white' : 'bg-warning text-white';
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase ${cls}`}>{level}</span>;
}
export default function CompareView({ open, onClose, items, rows, onOpenFull }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Compare">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-line w-full max-w-4xl max-h-[88vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-line px-5 py-4 flex items-center justify-between gap-3">
          <h2 className="font-ui font-bold text-lg text-ink flex items-center gap-2"><Scale className="w-5 h-5"/>Compare</h2>
          <div className="flex items-center gap-2">
            {onOpenFull && <Button variant="secondary" size="sm" onClick={onOpenFull}>Open full view<ArrowRight className="w-3.5 h-3.5"/></Button>}
            <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-lg hover:bg-paper-deep"><X className="w-4 h-4"/></button>
          </div>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-sm">
          <thead><tr className="bg-paper border-b border-line">
            <th className="text-left p-4 text-xs uppercase text-ink-3 w-36">Feature</th>
            {items.map(r=> (<th key={r.career?.id || r.title} className="text-left p-4 align-top min-w-[180px]"><span className="font-ui font-bold text-ink">{r.career?.title || r.title}</span><span className="block mt-1"><MatchPill level={r.level || r.band || r.fit}/></span></th>))}
          </tr></thead>
          <tbody>{rows.map(([label, fn], i)=> (
            <tr key={label} className={i%2? 'bg-paper/60':''}>
              <td className="p-4 font-semibold text-ink-3 align-top">{label}</td>
              {items.map(r=> <td key={(r.career?.id||r.title)+label} className="p-4 text-ink-2 align-top break-words">{fn(r)}</td>)}
            </tr>))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
