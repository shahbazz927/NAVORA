import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import { resolveTwelveSummary, resolveAnswerSummary } from '../data/careerQuestionnaire';
import { ResultsLayout, RecommendationCard } from '../components/results';
import AICareerAdvisor from '../components/ai/AICareerAdvisor';

export default function PathResults() {
  useScrollTop();
  const { answers, setAnswers } = useUser();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [openId, setOpenId] = useState(null);
  const [toast, setToast] = useState('');
  const [stepsChecked, setStepsChecked] = useState({});
  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const isV2 = Boolean(answers.educationStatus || answers.streamV2 || answers.interestArea);
  const summary = isV2 ? (answers.streamV2 ? resolveTwelveSummary(answers) : null) : resolveAnswerSummary(answers);

  if (!summary) {
    return (
      <div className="min-h-screen bg-paper-gradient">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 lg:py-14">
          <div className="bg-white border border-line rounded-[1.6rem] shadow-card p-8 sm:p-10 text-center">
            <span className="inline-flex w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 items-center justify-center mb-6"><Compass className="w-7 h-7" strokeWidth={1.75} /></span>
            <h1 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em]">Your NAVORA Path</h1>
            <p className="mt-3 text-ink-2 leading-relaxed">You haven&apos;t taken the career questionnaire yet.</p>
            <div className="mt-8"><Link to="/questions/class12"><Button size="lg" shine>Take the questionnaire<ArrowRight className="w-4 h-4" /></Button></Link></div>
          </div>
        </div>
      </div>
    );
  }

  const rawRecs = answers.recommendations || [];
  // Map to unified shape that RecommendationCard expects
  const unified = useMemo(() => rawRecs.map(rec => {
    const lvl = rec.fit || 'Worth exploring';
    const normalizedLevel = lvl.includes('Strong') ? 'Strong match' : lvl.includes('Good') ? 'Good match' : 'Worth exploring';
    return {
      career: { id: rec.id, title: rec.title, category: rec.educationPathway?.[0] || rec.eligibilityNote || '', description: rec.description, skillsToDevelop: rec.keySkills || [], experienceIdeas: rec.experienceIdeas || [], educationRoutes: rec.educationPathway || [] },
      title: rec.title, score: rec.confidence, level: normalizedLevel, band: normalizedLevel,
      degree: { short: (rec.educationPathway?.[0]||'').split(/[\(→+]/)[0].trim() || 'See route', full: rec.educationPathway?.[0]||'' },
      exams: (rec.entranceExams||[]).slice(0,2).map(n=>({ name:n, period:'Typical period — check notice' })),
      foundations: (rec.keySkills||[]).slice(0,2),
      whyMatches: rec.whyFits ? [rec.whyFits] : (rec.interestMatch||[]),
      considerations: rec.studyNote ? [rec.studyNote, rec.realityCheck].filter(Boolean) : [rec.realityCheck].filter(Boolean),
      factors: [
        { key:'Interest alignment', weight:30, value: Math.min(95, 55+ (rec.confidence? rec.confidence-55:0)), why: rec.whyFits || 'Based on your interest selections' },
        { key:'Stream compatibility', weight:20, value: rec.eligibility==='direct'? 92:60, why: rec.eligibilityNote||'' },
        { key:'Strength alignment', weight:20, value: 65, why:'Checked against your profile' },
        { key:'Priority alignment', weight:15, value: 60, why:'Weighed against your priorities' },
        { key:'Path accessibility', weight:15, value: rec.eligibility==='direct'? 90:55, why: rec.eligibility==='direct'? 'Direct route':'Requires an extra step' },
      ],
      activity: rec.experienceIdeas?.[0] || 'Talk to someone doing this work.',
    };
  }), [rawRecs]);

  const counts = { All: unified.length, 'Strong match': unified.filter(u=>u.level==='Strong match').length, 'Good match': unified.filter(u=>u.level==='Good match').length, 'Worth exploring': unified.filter(u=>u.level==='Worth exploring').length };
  const visible = filter==='All' ? unified : unified.filter(u=>u.level===filter);
  const header = { eyebrow:'Your career direction match', title:'Your Career Direction', subtitle:'Based on your stream, interests, strengths and priorities, here are the paths worth considering.' };
  const context = [];
  if (summary.stream?.label) context.push(`Stream: ${summary.stream.label}`);
  if (Array.isArray(summary.subjectInterests) && summary.subjectInterests.length) context.push(`Subjects: ${summary.subjectInterests.join(' \u00b7 ')}`);
  if (summary.specificInterest?.label) context.push(`Interest: ${summary.specificInterest.label}`);
  if (summary.interestArea?.label) context.push(summary.interestArea.label);
  if (summary.careerPriorities?.length) context.push(`Priority: ${summary.careerPriorities.join(' \u00b7 ')}`);
  else if (summary.priority?.label) context.push(`Priority: ${summary.priority.label}`);
  context.unshift('Stage: Student \u00b7 Class 12');

  const exams = useMemo(()=>{ const seen=new Map(); unified.slice(0,3).forEach(u=> (u.exams||[]).forEach(e=>{ if(!seen.has(e.name)) seen.set(e.name,e);})); return [...seen.values()].slice(0,4); },[unified]);
  const primary = unified[0];
  const steps = primary ? { month:[`Try: ${primary.activity}`, `Research ${primary.title} entry routes`, 'Check the entrance exams in the sidebar'], quarter:[`Start building ${primary.foundations[0]||'foundations'}`, 'Complete one small field-related project','Compare 2–3 colleges'], later:['Compare final degree options','Check eligibility & timelines','Revisit after trying one recommendation'] } : null;

  useEffect(()=>{ if(!toast) return; const t=setTimeout(()=>setToast(''),2600); return()=>clearTimeout(t); },[toast]);
  const toggleCompare = (id)=> {
    if(compareIds.includes(id)){ setCompareIds(compareIds.filter(x=>x!==id)); return; }
    if(compareIds.length>=3){ setToast('You can compare up to 3 options at a time.'); return; }
    setCompareIds([...compareIds, id]);
  };
  const compareItems = compareIds.map(id=> unified.find(u=>u.career.id===id)).filter(Boolean);
  const rows = [['Fit Score', r=> String(r.score)+' / 100'], ['Degree', r=> r.degree.short], ['Entrance exams', r=> r.exams.map(e=>e.name).join(' \u00b7 ')], ['Skills', r=> (r.career.skillsToDevelop||[]).slice(0,3).join(', ')], ['Why it matches', r=> (r.whyMatches[0]||'-')], ['Considerations', r=> (r.considerations[0]||'-')]];

  return (
    <>
    <ResultsLayout
      onBack={()=> navigate(-1)}
      header={header}
      context={context}
      filters={['All','Strong match','Good match','Worth exploring']}
      counts={counts}
      activeFilter={filter}
      onFilter={setFilter}
      compareCount={compareIds.length}
      onCompare={()=> setCompareOpen(true)}
      onClearCompare={()=> setCompareIds([])}
      items={visible}
      renderCard={(item)=> (
        <RecommendationCard key={item.career.id} item={item} rank={unified.indexOf(item)} compared={compareIds.includes(item.career.id)} cantAdd={compareIds.length>=3} onToggleCompare={()=> toggleCompare(item.career.id)} open={openId===item.career.id} onToggleDetail={()=> setOpenId(openId===item.career.id? null: item.career.id)} onSave={()=> setToast('Saved \u2713')} />
      )}
      sidebarExams={exams}
      sidebarNextColleges={<section className="rounded-[14px] p-5 text-white shadow-card" style={{background:'linear-gradient(135deg,#0f1f4d,#0a1638)'}}><h2 className="flex items-center gap-2 text-[0.72rem] font-bold uppercase text-white/70">Next: colleges</h2><p className="mt-2 text-sm text-white/85">Shortlist colleges for the recommended degree.</p><div className="mt-4"><Button size="md" className="bg-white text-ink hover:bg-brand-50 w-full" onClick={()=> navigate('/recommendations/graduate')}>View colleges</Button></div></section>}
      nextSteps={steps}
      stepsChecked={stepsChecked}
      onToggleStep={(k)=> setStepsChecked(s=> ({...s, [k]: !s[k]}))}
      onRetake={()=> navigate('/questions/class12')}
      onSave={()=> { setAnswers({ ...answers, lastSavedAt: new Date().toISOString() }); setToast('Saved \u2713'); navigate('/dashboard'); }}
      toast={toast}
      setToast={setToast}
      compareOpen={compareOpen}
      setCompareOpen={setCompareOpen}
      compareItems={compareItems.length? compareItems: unified.slice(0,3)}
      compareRows={rows}
    />
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-10"><AICareerAdvisor userType="class12" /></div>
    </>
  );
}
