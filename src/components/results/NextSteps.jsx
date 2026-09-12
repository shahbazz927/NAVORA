export default function NextSteps({ steps, checked, onToggle }) {
  if (!steps) return null;
  const cols = [['This month', steps.month], ['Next 3 months', steps.quarter], ['Later', steps.later]];
  return (
    <section aria-labelledby="next-steps" className="bg-white border border-line rounded-[14px] p-5 sm:p-6 shadow-card">
      <h2 id="next-steps" className="eyebrow text-brand-600">Your next steps</h2>
      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        {cols.map(([h, arr])=> (
          <div key={h}><p className="text-sm font-bold text-ink">{h}</p>
            <ul className="mt-2 space-y-2">{(arr||[]).map(s=> {
              const k=`${h}:${s}`;
              return (<li key={s}><label className="flex items-start gap-2 text-[0.82rem] text-ink-2 cursor-pointer">
                <input type="checkbox" checked={!!checked[k]} onChange={()=> onToggle(k)} className="mt-0.5 w-4 h-4 accent-[#2451e0]"/>
                <span className={checked[k] ? 'line-through text-ink-3' : ''}>{s}</span>
              </label></li>);
            })}</ul>
          </div>))}
      </div>
    </section>
  );
}
