import { useState, useEffect } from 'react';
import { ChevronDown, Bookmark, ArrowRight, X, Briefcase, ClipboardList, Target, Award, Star, BookOpen } from 'lucide-react';
import Button from '../Button';
import FitRing from './FitRing';

function MatchPill({ level }) {
  const cls = level === 'Strong match' || level === 'Strong fit'
    ? 'bg-brand-950 text-white' : level === 'Good match' || level === 'Good option'
      ? 'bg-success text-white' : 'bg-warning text-white';
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-bold tracking-wide uppercase ${cls}`}>{level}</span>;
}

export default function RecommendationCard({ item, rank, compared, cantAdd, onToggleCompare, onToggleDetail, open, saved, onSave, onExplore }) {
  const [savedLocal, setSavedLocal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const isSaved = saved ?? savedLocal;
  const c = item.career || item;
  const title = c.title || item.title || '—';
  const category = c.category || item.category || '';
  const score = item.score ?? item.confidence ?? null;
  const level = item.level || item.band || item.fit || 'Worth exploring';
  const degree = item.degree || (c.educationRoutes ? { short: (c.educationRoutes[0]||'').split(/[\(→+]/)[0].trim()||'See route', full: c.educationRoutes[0]||'' } : null);
  const exams = item.exams || [];
  const foundations = item.foundations || (c.skillsToDevelop || []).slice(0,2);
  const why = item.whyMatches || item.matches || [];
  const cons = item.considerations || item.tradeOffs || [];
  const factors = item.factors || item.breakdown ? (Array.isArray(item.factors) ? item.factors : null) : null;
  const activity = item.activity || (c.experienceIdeas||[])[0] || 'Talk to someone doing this work.';
  const roles = c.roles || [];
  const responsibilities = c.responsibilities || [];
  const objectives = c.objectives || [];
  const skillsAndQualifications = c.skillsAndQualifications || [];
  const preferredQualifications = c.preferredQualifications || [];
  const isFirst = rank === 0;

  useEffect(() => {
    if (!showDetails) return;
    const onKey = (e) => { if (e.key === 'Escape') setShowDetails(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showDetails]);

  return (
    <article aria-labelledby={`rec-t-${c.id || rank}`} className={`bg-white border rounded-[14px] p-5 sm:p-6 ${isFirst ? 'border-[#c9d6ff] shadow-card' : 'border-line shadow-card'}`}>
      <div className="flex items-start gap-4">
        <label className="mt-1 inline-flex items-center gap-2 cursor-pointer shrink-0">
          <input type="checkbox" checked={!!compared} disabled={cantAdd && !compared} onChange={onToggleCompare} aria-label={`Select ${title} for comparison`} className="w-4 h-4 accent-[#0b1e3d] cursor-pointer" />
          <span className="text-xs font-bold text-ink-3 tabular-nums">{String(rank + 1).padStart(2,'0')}</span>
        </label>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id={`rec-t-${c.id || rank}`} className="font-ui font-bold text-lg text-ink break-words">{title}</h3>
            <MatchPill level={level} />
          </div>
          {category && <p className="mt-1 text-[0.8rem] font-medium text-ink-3">{category}{degree?.short ? ` · ${degree.short} pathway` : ''}</p>}
          {c.description && <p className="mt-2 text-sm text-ink-2 leading-relaxed">{c.description}</p>}
        </div>
        {score != null && <FitRing score={score} />}
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-line bg-paper px-3.5 py-3">
          <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-ink-3">Recommended degree</p>
          <p className="mt-1 text-sm font-semibold text-ink break-words">{degree?.short || 'See route'}</p>
          {degree?.full && degree.full !== degree.short && <p className="mt-0.5 text-xs text-ink-3 line-clamp-2">{degree.full}</p>}
        </div>
        <div className="rounded-xl border border-line bg-paper px-3.5 py-3">
          <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-ink-3">Entrance exams</p>
          <p className="mt-1 text-sm font-semibold text-ink break-words">{exams.map(e=>e.name||e).join(' · ') || 'Merit / university admission'}</p>
          <p className="mt-0.5 text-xs text-ink-3">Typical periods — check notices.</p>
        </div>
        <div className="rounded-xl border border-line bg-paper px-3.5 py-3">
          <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-ink-3">Foundations to build</p>
          <p className="mt-1 text-sm font-semibold text-ink break-words">{Array.isArray(foundations) ? foundations.join(', ') : foundations}</p>
          <p className="mt-0.5 text-xs text-ink-3">Strengthen alongside studies.</p>
        </div>
      </div>

      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#eaf7ef] px-4 py-3.5">
          <p className="text-[0.68rem] font-bold uppercase text-[#1c8a4b]">✓ Why it matches</p>
          <ul className="mt-2 space-y-1.5">{why.slice(0,4).map(m=> <li key={m} className="text-[0.82rem] text-ink-2 leading-snug">• {m}</li>)}{why.length===0 && <li className="text-[0.82rem] text-ink-2">Balanced option for your answers.</li>}</ul>
        </div>
        <div className="rounded-xl bg-[#fff8e8] border border-[#f0dfae] px-4 py-3.5">
          <p className="text-[0.68rem] font-bold uppercase text-[#7a5b12]">⚠ Why this may not be right</p>
          <ul className="mt-2 space-y-1.5">{cons.slice(0,3).map(m=> <li key={m} className="text-[0.82rem] text-ink-2 leading-snug">• {m}</li>)}{cons.length===0 && <li className="text-[0.82rem] text-ink-2">Needs real-world exposure before committing.</li>}</ul>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-line">
        <button type="button" onClick={onToggleDetail} aria-expanded={!!open} aria-controls={`rec-s-${c.id || rank}`} className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-brand-700">
          <span>See scoring breakdown & how to try it</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <div id={`rec-s-${c.id || rank}`} className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden"><div className="px-4 pb-4 pt-1 border-t border-line">
            {factors ? (
              <ul className="mt-3 space-y-2">{factors.map(f=> (
                <li key={f.key} className="text-sm">
                  <div className="flex items-center justify-between gap-3"><span className="font-medium text-ink">{f.key} <span className="text-ink-3 font-normal">· {f.weight}%</span></span><span className="text-xs font-bold text-ink-2 tabular-nums">{f.value}/100</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-paper-deep overflow-hidden" role="progressbar" aria-valuenow={f.value} aria-valuemin={0} aria-valuemax={100}><div className="h-full bg-brand-500 rounded-full" style={{width:`${f.value}%`}}/></div>
                  {f.why && <p className="mt-1 text-xs text-ink-3">{f.why}</p>}
                </li>))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-3">Scored from your stream, interests, strengths and priorities. Same answers → same result.</p>
            )}
            <div className="mt-3 rounded-lg bg-brand-50 border border-brand-100 px-3.5 py-3">
              <p className="text-[0.68rem] font-bold uppercase text-brand-700">Try this month</p>
              <p className="mt-1 text-sm text-ink-2">{activity}</p>
            </div>
          </div></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-ink-3">Based on your questionnaire responses. Guidance, not a prediction.</p>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="primary" size="sm" onClick={() => setShowDetails(true)} aria-haspopup="dialog">Learn more<ArrowRight className="w-3.5 h-3.5" /></Button>
          <Button variant="secondary" size="sm" onClick={()=>{ setSavedLocal(true); onSave?.(); }} aria-pressed={isSaved}><Bookmark className="w-3.5 h-3.5"/>{isSaved ? 'Saved ✓' : 'Save'}</Button>
          {onExplore && <Button variant="primary" size="sm" onClick={onExplore}>Explore career<ArrowRight className="w-3.5 h-3.5"/></Button>}
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={`rec-learn-${c.id || rank}`}>
          <button type="button" aria-label="Close details" onClick={() => setShowDetails(false)} className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-line shrink-0">
              <div className="min-w-0">
                <p className="eyebrow text-brand-600">Your Career Direction</p>
                <h3 id={`rec-learn-${c.id || rank}`} className="mt-1 font-ui font-bold text-xl text-ink leading-tight">{title}</h3>
                {category && <p className="mt-1 text-sm text-ink-3">{category}</p>}
              </div>
              <button type="button" onClick={() => setShowDetails(false)} className="shrink-0 p-2 rounded-full hover:bg-paper-deep text-ink-3 hover:text-ink transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-6 space-y-6">
              {c.description && <p className="text-sm text-ink-2 leading-relaxed">{c.description}</p>}
              {c.subjects?.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.14em] uppercase text-ink-3"><BookOpen className="w-4 h-4 text-brand-500" /> Subjects you&apos;ll study</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.subjects.map((s) => (
                      <span key={s} className="inline-flex items-center rounded-full bg-brand-50 border border-brand-100 px-3 py-1.5 text-sm font-medium text-brand-700">{s}</span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-ink-3">Core subjects for this stream/pathway — varies slightly by board/school.</p>
                </div>
              )}
              {roles.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.14em] uppercase text-ink-3"><Briefcase className="w-4 h-4 text-brand-500" /> Job Roles</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {roles.map((r) => (
                      <span key={r} className="inline-flex items-center rounded-full bg-brand-50 border border-brand-100 px-3 py-1.5 text-sm font-medium text-brand-700">{r}</span>
                    ))}
                  </div>
                </div>
              )}
              {responsibilities.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.14em] uppercase text-ink-3"><ClipboardList className="w-4 h-4 text-brand-500" /> Roles & Responsibilities</h4>
                  <ul className="mt-3 space-y-2.5">
                    {responsibilities.map((r) => (
                      <li key={r} className="flex gap-2.5 text-sm text-ink-2 leading-relaxed"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" aria-hidden="true" /><span>{r}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {objectives.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.14em] uppercase text-ink-3"><Target className="w-4 h-4 text-brand-500" /> Objectives of this role</h4>
                  <ul className="mt-3 space-y-2.5">
                    {objectives.map((r) => (
                      <li key={r} className="flex gap-2.5 text-sm text-ink-2 leading-relaxed"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" /><span>{r}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {skillsAndQualifications.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.14em] uppercase text-ink-3"><Award className="w-4 h-4 text-brand-500" /> Skills and Qualifications</h4>
                  <ul className="mt-3 space-y-2.5">
                    {skillsAndQualifications.map((r) => (
                      <li key={r} className="flex gap-2.5 text-sm text-ink-2 leading-relaxed"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" /><span>{r}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {preferredQualifications.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.14em] uppercase text-ink-3"><Star className="w-4 h-4 text-amber-500" /> Preferred Qualifications</h4>
                  <ul className="mt-3 space-y-2.5">
                    {preferredQualifications.map((r) => (
                      <li key={r} className="flex gap-2.5 text-sm text-ink-2 leading-relaxed"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" aria-hidden="true" /><span>{r}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {(c.skillsToDevelop?.length > 0 || c.educationRoutes?.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-line">
                  {c.skillsToDevelop?.length > 0 && (
                    <div className="rounded-xl bg-paper border border-line p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-ink-3">Skills to develop</p>
                      <p className="mt-2 text-sm text-ink-2 leading-relaxed">{c.skillsToDevelop.join(' · ')}</p>
                    </div>
                  )}
                  {c.educationRoutes?.length > 0 && (
                    <div className="rounded-xl bg-paper border border-line p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-ink-3">Education route</p>
                      <p className="mt-2 text-sm text-ink-2 leading-relaxed">{c.educationRoutes[0]}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-line bg-paper flex justify-end gap-2 shrink-0">
              <Button variant="secondary" size="md" onClick={() => setShowDetails(false)}>Close</Button>
              <Button variant="primary" size="md" onClick={() => setShowDetails(false)}>Got it</Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
