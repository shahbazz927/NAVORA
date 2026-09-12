export default function ResultsFilters({ filters, active, counts, onChange }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter results">
      {filters.map((f) => (
        <button key={f} type="button" onClick={() => onChange(f)} aria-pressed={active === f}
          className={`rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold border ${active === f ? 'bg-brand-950 text-white border-brand-950' : 'bg-white text-ink-2 border-line hover:border-brand-200'}`}>
          {f} ({counts[f] ?? 0})
        </button>
      ))}
    </div>
  );
}
