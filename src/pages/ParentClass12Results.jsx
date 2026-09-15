import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, ChevronDown, X, Scale, Bookmark, CalendarDays, GraduationCap } from 'lucide-react';
import Button from '../components/Button';
import { FadeIn } from '../components/AnimatedPage';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import { scoreParentClass12, fitLevel, whyMatches, tradeOffs, examsForCareer, degreeOf, nextStepsFor, headerContext } from '../data/parentClass12Scoring';

/* ── Fit ring (SVG progress ring + accessible text) ── */
function FitRing({ score }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const color = score >= 75 ? '#0b1e3d' : score >= 55 ? '#0d8f7e' : '#b4751a';
  return (
    <div className="flex flex-col items-center shrink-0" role="img" aria-label={`Fit score ${score} out of 100`}>
      <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
        <circle cx="38" cy="38" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
        <circle cx="38" cy="38" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 38 38)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        <text x="38" y="37" textAnchor="middle" fontSize="19" fontWeight="700" fill="#0b1e3d" fontFamily="Plus Jakarta Sans, Inter, sans-serif">{score}</text>
        <text x="38" y="50" textAnchor="middle" fontSize="8" fontWeight="600" fill="#6b7a94" letterSpacing="0.08em">FIT SCORE</text>
      </svg>
    </div>
  );
}

function MatchPill({ level }) {
  const cls = level === 'Strong match'
    ? 'bg-brand-950 text-white'
    : level === 'Good match'
      ? 'bg-success text-white'
      : 'bg-warning text-white';
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-bold tracking-wide uppercase ${cls}`}>{level}</span>;
}

const FILTERS = ['All careers', 'Strong match', 'Good match', 'Worth exploring'];
function CareerCard(p) {
  const { item, rank } = p;
  const c = item.career;
  const act = (c.experienceIdeas || [])[0] || 'Talk to someone doing this work.';
  return (
    <article aria-labelledby={`pc12-t-${c.id}`} className={`bg-white border rounded-[14px] p-5 sm:p-6 ${rank === 0 ? 'border-[#c9d6ff]' : 'border-line'} shadow-card`}>
      <div className="flex items-start gap-4">
        <label className="mt-1 inline-flex items-center gap-2 cursor-pointer shrink-0">
          <input type="checkbox" checked={p.compared} disabled={p.cantAdd && !p.compared} onChange={p.onToggle} aria-label={`Select ${c.title} for comparison`} className="w-4 h-4 accent-[#0b1e3d] cursor-pointer" />
          <span className="text-xs font-bold text-ink-3 tabular-nums">{String(rank + 1).padStart(2, '0')}</span>
        </label>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id={`pc12-t-${c.id}`} className="font-ui font-bold text-lg text-ink">{c.title}</h3>
            <MatchPill level={item.level} />
          </div>
          <p className="mt-1 text-[0.8rem] font-medium text-ink-3">{c.category}{item.degree.short ? ` · ${item.degree.short} pathway` : ''}</p>
          <p className="mt-2 text-sm text-ink-2 leading-relaxed">{c.description}</p>
        </div>
        <FitRing score={item.score} />
      </div>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-line bg-paper px-3.5 py-3">
          <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-ink-3">Recommended degree</p>
          <p className="mt-1 text-sm font-semibold text-ink">{item.degree.short || 'See route'}</p>
          <p className="mt-0.5 text-xs text-ink-3">{item.degree.full || 'Multiple routes.'}</p>
        </div>
        <div className="rounded-xl border border-line bg-paper px-3.5 py-3">
          <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-ink-3">Entrance exams</p>
          <p className="mt-1 text-sm font-semibold text-ink">{item.exams.map((e) => e.name).join(' · ')}</p>
          <p className="mt-0.5 text-xs text-ink-3">Typical periods — check notices.</p>
        </div>
        <div className="rounded-xl border border-line bg-paper px-3.5 py-3">
          <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-ink-3">Foundations to build</p>
          <p className="mt-1 text-sm font-semibold text-ink">{(c.skillsToDevelop || []).slice(0, 2).join(', ')}</p>
          <p className="mt-0.5 text-xs text-ink-3">Strengthen alongside subjects.</p>
        </div>
      </div>
      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#eaf7ef] px-4 py-3.5">
          <p className="text-[0.68rem] font-bold uppercase text-[#1c8a4b]">Why it matches</p>
          <ul className="mt-2 space-y-1.5">{item.matches.map((m) => <li key={m} className="text-[0.82rem] text-ink-2">{m}</li>)}</ul>
        </div>
        <div className="rounded-xl bg-[#fff8e8] border border-[#f0dfae] px-4 py-3.5">
          <p className="text-[0.68rem] font-bold uppercase text-[#7a5b12]">Why this may not be right</p>
          <ul className="mt-2 space-y-1.5">{item.considerations.map((m) => <li key={m} className="text-[0.82rem] text-ink-2">{m}</li>)}</ul>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-line">
        <button type="button" onClick={p.onToggleDetail} aria-expanded={p.open} aria-controls={`pc12-s-${c.id}`} className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-brand-700 cursor-pointer">
          <span>See scoring breakdown and how to try it</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${p.open ? 'rotate-180' : ''}`} />
        </button>
        <div id={`pc12-s-${c.id}`} className={`grid transition-all duration-300 ${p.open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden"><div className="px-4 pb-4 pt-1 border-t border-line">
            <ul className="mt-3 space-y-2">{item.factors.map((f) => (
              <li key={f.key} className="text-sm">
                <div className="flex items-center justify-between gap-3"><span className="font-medium text-ink">{f.key} <span className="text-ink-3 font-normal">- {f.weight}%</span></span><span className="text-xs font-bold text-ink-2 tabular-nums">{f.value}/100</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-paper-deep overflow-hidden" role="progressbar" aria-valuenow={f.value} aria-valuemin={0} aria-valuemax={100} aria-label={`${f.key} score`}><div className="h-full bg-brand-500 rounded-full" style={{ width: `${f.value}%` }} /></div>
                <p className="mt-1 text-xs text-ink-3">{f.why}</p>
              </li>))}
            </ul>
            <div className="mt-3 rounded-lg bg-brand-50 border border-brand-100 px-3.5 py-3">
              <p className="text-[0.68rem] font-bold uppercase text-brand-700">Try this month</p>
              <p className="mt-1 text-sm text-ink-2">{act}</p>
            </div>
          </div></div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-ink-3">Based on your questionnaire responses. This is guidance, not a prediction.</p>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={p.onSave} aria-pressed={p.saved}><Bookmark className="w-3.5 h-3.5" />{p.saved ? 'Saved' : 'Save'}</Button>
          <Button variant="primary" size="sm" onClick={p.onExplore}>Explore career<ArrowRight className="w-3.5 h-3.5" /></Button>
        </div>
      </div>
    </article>
  );
}


export default function ParentClass12Results({ result, onBack, onRetake, onSaveDashboard }) {
  useScrollTop();
  const navigate = useNavigate();
  const { answers, setAnswers, comparisonItems, setComparisonItems } = useUser();
  const [filter, setFilter] = useState('All careers');
  const [openId, setOpenId] = useState(null);
  const [toast, setToast] = useState('');
  const [savedIds, setSavedIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [steps, setSteps] = useState({});
  const ranked = useMemo(() => {
    const list = (result?.careers || []).map((career) => {
      const s = scoreParentClass12(answers, career);
      const level = fitLevel(s.score);
      return { career, score: s.score, factors: s.factors, level,
        matches: whyMatches(answers, career, s.factors),
        considerations: tradeOffs(answers, career, s.factors),
        exams: examsForCareer(career), degree: degreeOf(career) };
    });
    return list.sort((a, b) => b.score - a.score);
  }, [result, answers]);
  const counts = useMemo(() => ({
    'All careers': ranked.length,
    'Strong match': ranked.filter((r) => r.level === 'Strong match').length,
    'Good match': ranked.filter((r) => r.level === 'Good match').length,
    'Worth exploring': ranked.filter((r) => r.level === 'Worth exploring').length,
  }), [ranked]);
  const visible = filter === 'All careers' ? ranked : ranked.filter((r) => r.level === filter);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t); }, [toast]);
  const ctx = headerContext(answers);
  const topExams = useMemo(() => {
    const seen = new Map();
    ranked.slice(0, 3).forEach((r) => r.exams.forEach((e) => { if (!seen.has(e.name)) seen.set(e.name, e); }));
    return [...seen.values()].slice(0, 4);
  }, [ranked]);
  const primary = ranked[0];
  const primarySteps = useMemo(() => (primary ? nextStepsFor(primary.career) : null), [primary]);
  if (!result || !ranked.length) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-14 text-center">
        <h1 className="font-ui font-bold text-3xl text-ink">No Class 12 answers yet</h1>
        <p className="mt-3 text-ink-2">Answer a few questions about your child to see degree and career direction.</p>
        <div className="mt-6"><Button size="lg" onClick={onRetake || (() => navigate('/assessment'))}>Start parent Class 12 flow<ArrowRight className="w-4 h-4" /></Button></div>
      </div>
    );
  }
  const isCmp = (id, title) => comparisonItems.some((x) => (x.id || x.name) === id || x.name === title);
  const toggleCompare = (career) => {
    if (isCmp(career.id, career.title)) {
      setComparisonItems(comparisonItems.filter((x) => (x.id || x.name) !== career.id && x.name !== career.title));
      return;
    }
    if (comparisonItems.length >= 3) { setToast('You can compare up to 3 careers.'); return; }
    const top = ranked.find((r) => r.career.id === career.id);
    setComparisonItems([...comparisonItems, { id: career.id, name: career.title, duration: (career.educationRoutes || [])[0] || '-', fit: top ? top.score : '-', growth: career.category, salary: '-', note: career.description }]);
  };
  const cmpFull = comparisonItems.map((ci) => ranked.find((r) => r.career.id === ci.id || r.career.title === ci.name)).filter(Boolean);
  const rows = [
    ['Fit Score', (r) => `${r.score} / 100`],
    ['Degree', (r) => r.degree.short || '-'],
    ['Entrance exams', (r) => r.exams.map((e) => e.name).join(' · ')],
    ['Skills', (r) => (r.career.skillsToDevelop || []).slice(0, 3).join(', ')],
    ['Why it matches', (r) => r.matches[0] || '-'],
    ['Considerations', (r) => r.considerations[0] || '-'],
    ['Career pathway', (r) => (r.career.educationRoutes || []).join(' / ') || '-'],
  ];
  const tableCols = cmpFull.length ? cmpFull : ranked.slice(0, 3);
  return (
    <div className="min-h-screen bg-paper-gradient">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 lg:py-10">
        <button type="button" onClick={onBack || (() => navigate(-1))} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink cursor-pointer"><ArrowLeft className="w-4 h-4" />Back to questionnaire</button>
        <FadeIn>
          <p className="eyebrow text-brand-600 mt-6 mb-2">Your career direction match</p>
          <h1 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em]">Your Child&apos;s Degree and Career Direction</h1>
          <p className="mt-2 text-ink-2">Ranked by NAVORA Fit Score — based on the answers provided.</p>
          <div className="mt-3 flex flex-wrap gap-2">{ctx.map((c) => <span key={c} className="inline-flex items-center rounded-full bg-paper border border-line px-2.5 py-1 text-xs font-medium text-ink-2">{c}</span>)}</div>
        </FadeIn>
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter careers">
          {FILTERS.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
              className={`rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold border cursor-pointer ${filter === f ? 'bg-brand-950 text-white border-brand-950' : 'bg-white text-ink-2 border-line'}`}>
              {f} ({counts[f]})
            </button>))}
        </div>
        {comparisonItems.length > 0 && (
          <div className="mt-4 sticky top-[4.5rem] z-20 rounded-xl bg-brand-950 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 shadow-card">
            <span className="text-sm font-semibold">{comparisonItems.length} selected for comparison</span>
            <span className="flex items-center gap-2">
              <button type="button" onClick={() => setComparisonItems([])} className="text-xs font-semibold text-white/80 underline cursor-pointer">Clear</button>
              <Button size="sm" className="bg-white text-ink hover:bg-brand-50" onClick={() => setCompareOpen(true)}>Compare selected<ArrowRight className="w-3.5 h-3.5" /></Button>
            </span>
          </div>
        )}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-4 min-w-0">
            {visible.map((item) => (
              <CareerCard key={item.career.id} item={item} rank={ranked.indexOf(item)}
                compared={isCmp(item.career.id, item.career.title)} cantAdd={comparisonItems.length >= 3}
                onToggle={() => toggleCompare(item.career)}
                saved={savedIds.includes(item.career.id)}
                onSave={() => { setSavedIds((s) => (s.includes(item.career.id) ? s : [...s, item.career.id])); setToast(`Saved ${item.career.title}.`); }}
                onExplore={() => setOpenId(openId === item.career.id ? null : item.career.id)}
                open={openId === item.career.id} onToggleDetail={() => setOpenId(openId === item.career.id ? null : item.career.id)} />
            ))}

            {primarySteps && (
              <section aria-labelledby="pc12-next" className="bg-white border border-line rounded-[14px] p-5 sm:p-6 shadow-card">
                <h2 id="pc12-next" className="eyebrow text-brand-600">Your next steps</h2>
                <div className="mt-4 grid sm:grid-cols-3 gap-4">
                  {[['This month', primarySteps.month], ['Next 3 months', primarySteps.quarter], ['Later', primarySteps.later]].map(([h, arr]) => (
                    <div key={h}><p className="text-sm font-bold text-ink">{h}</p>
                      <ul className="mt-2 space-y-2">{arr.map((s) => {
                        const k = `${h}:${s}`;
                        return (<li key={s}><label className="flex items-start gap-2 text-[0.82rem] text-ink-2 cursor-pointer">
                          <input type="checkbox" checked={!!steps[k]} onChange={() => setSteps((p) => ({ ...p, [k]: !p[k] }))} className="mt-0.5 w-4 h-4 accent-[#2451e0]" />
                          <span className={steps[k] ? 'line-through text-ink-3' : ''}>{s}</span>
                        </label></li>);
                      })}</ul>
                    </div>))}
                </div>
              </section>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button variant="secondary" size="lg" onClick={onRetake || (() => navigate('/assessment'))}>Retake this flow</Button>
              <Button variant="primary" size="lg" shine onClick={onSaveDashboard || (() => { setAnswers({ ...answers, lastSavedAt: new Date().toISOString() }); navigate('/dashboard'); })}>Save to dashboard<ArrowRight className="w-4 h-4" /></Button>
            </div>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24">
            <section aria-labelledby="pc12-exams" className="bg-white border border-line rounded-[14px] p-5 shadow-card">
              <h2 id="pc12-exams" className="flex items-center gap-2 text-[0.72rem] font-bold uppercase text-ink-3"><CalendarDays className="w-4 h-4" />Entrance exam calendar</h2>
              <ul className="mt-3 divide-y divide-line">
                {topExams.map((e) => (<li key={e.name} className="py-2.5 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-ink">{e.name}</span><span className="text-xs text-ink-3">{e.period}</span></li>))}
              </ul>
              <p className="mt-2 text-[0.72rem] text-ink-3">Typical periods only — verify official notices.</p>
            </section>
            <section aria-labelledby="pc12-col" className="rounded-[14px] p-5 text-white shadow-card" style={{ background: 'linear-gradient(135deg, #0f1f4d, #0a1638)' }}>
              <h2 id="pc12-col" className="flex items-center gap-2 text-[0.72rem] font-bold uppercase text-white/70"><GraduationCap className="w-4 h-4" />Next: colleges</h2>
              <p className="mt-2 text-sm text-white/85">We can shortlist colleges for the recommended degree with eligibility, fees and placement context.</p>
              <div className="mt-4"><Button size="md" className="w-full" onClick={() => navigate('/recommendations/parent')}>View colleges<ArrowRight className="w-4 h-4" /></Button></div>
            </section>
            <section className="bg-paper border border-line rounded-[14px] p-5">
              <p className="text-sm text-ink-2">Not sure this feels right? Explore the alternatives above before deciding.</p>
            </section>
          </aside>
        </div>
      </div>
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-brand-950 text-white text-sm font-medium rounded-full pl-4 pr-3 py-2.5 max-w-[92vw]">
          <Check className="w-4 h-4 shrink-0" /><span className="truncate">{toast}</span>
          <button type="button" onClick={() => setToast('')} aria-label="Dismiss" className="p-1 rounded-full hover:bg-white/15 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {compareOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Compare careers">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setCompareOpen(false)} />
          <div className="relative bg-white rounded-2xl border border-line w-full max-w-4xl max-h-[88vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-line px-5 py-4 flex items-center justify-between gap-3">
              <h2 className="font-ui font-bold text-lg text-ink flex items-center gap-2"><Scale className="w-5 h-5" />Compare careers</h2>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => { setCompareOpen(false); navigate('/compare'); }}>Open full view<ArrowRight className="w-3.5 h-3.5" /></Button>
                <button type="button" onClick={() => setCompareOpen(false)} aria-label="Close comparison" className="p-2 rounded-lg hover:bg-paper-deep cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-sm">
              <thead><tr className="bg-paper border-b border-line">
                <th className="text-left p-4 text-xs uppercase text-ink-3 w-36">Feature</th>
                {tableCols.map((r) => (<th key={r.career.id} className="text-left p-4 align-top min-w-[180px]"><span className="font-ui font-bold text-ink">{r.career.title}</span><span className="block mt-1"><MatchPill level={r.level} /></span></th>))}
              </tr></thead>
              <tbody>
                {rows.map(([label, fn], i) => (
                  <tr key={label} className={i % 2 ? 'bg-paper/60' : ''}>
                    <td className="p-4 font-semibold text-ink-3 align-top">{label}</td>
                    {tableCols.map((r) => <td key={r.career.id} className="p-4 text-ink-2 align-top">{fn(r)}</td>)}
                  </tr>))}
              </tbody>
            </table></div>
          </div>
        </div>
      )}
    </div>
  );
}
