import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Globe, Compass, GraduationCap, Wallet, Languages, Target, MapPin, ExternalLink, Scale, Info, AlertTriangle, Award, Building2, ChevronDown, X, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import { COUNTRIES, UNIVERSITIES, BUDGET_RANGES, FX, annualCostINR, degreeCostINR } from '../data/studyAbroad.js';
import { rankCountries, getBudgetMax } from '../data/studyAbroadEngine.js';

// ── Step config ──────────────────────────────────────────
const STEPS = [
  { id: 'studyLevel', label: 'PROFILE', title: 'What are you planning to study?' },
  { id: 'academic', label: 'PROFILE', title: 'Your academic background' },
  { id: 'goal', label: 'GOAL', title: 'What do you want this degree to lead to?' },
  { id: 'budget', label: 'BUDGET', title: 'What is your realistic total study budget?' },
  { id: 'priority', label: 'PRIORITY', title: 'What matters most in your decision?' },
  { id: 'language', label: 'LANGUAGE', title: 'How comfortable are you studying in a non-English environment?' },
  { id: 'preferences', label: 'PREFERENCES', title: 'Any preferences to shape your plan?' },
];

const studyLevels = ["Bachelor's after Class 12","Master's after graduation","MBA / Management","Healthcare / Medicine","PhD / Research","I'm still exploring"];
const goals = [
  'Software Engineering','AI / Machine Learning','Data Science','Cybersecurity',
  'Mechanical','Automotive','Electrical / Electronics','Civil','Aerospace',
  'Finance','Consulting','Business Analytics',
  'Medicine','Nursing','Biotechnology',
  'Design','Architecture','Fashion','UX/UI',
  'Renewable Energy / Sustainability','Not sure yet',
];
const prioritiesList = [
  { id:'cost', label:'Lower total cost' },
  { id:'employment', label:'Strong employment opportunities' },
  { id:'post-study', label:'Strong post-study work options' },
  { id:'immigration', label:'Long-term immigration pathway' },
  { id:'reputation', label:'Top university / academic reputation' },
  { id:'scholarship', label:'Scholarships' },
  { id:'research', label:'Research opportunities' },
  { id:'english', label:'English-taught study' },
  { id:'duration', label:'Shorter degree duration' },
];
const languageOpts = [
  { id:'english-only', label:'English only', desc:'Prefer to study and work in English' },
  { id:'comfortable', label:'Comfortable learning the local language', desc:'Willing to learn German / French / etc.' },
  { id:'already', label:'Already know another language', desc:'German, French, Spanish, etc.' },
  { id:'no-pref', label:'No preference', desc:'Language is not a constraint' },
];
const prefOpts = ['Big city','Smaller student city','Research-focused','Industry-focused','Flexible'];

// ── Helpers ───────────────────────────────────────────────
function flagFromCode(code){
  if(!code || code.length!==2) return '🏳️';
  const A = 0x1F1E6;
  return String.fromCodePoint(...[...code.toUpperCase()].map(ch=> A + ch.charCodeAt(0)-65));
}
function flagForCountry(c){ return c?.code ? flagFromCode(c.code) : '🏳️'; }
function FlagLogo({ code, size=20 }){
  if(!code || code.length!==2) return <span aria-hidden="true" className="inline-flex w-5 h-3.5 rounded-sm bg-paper border border-line shrink-0" />;
  const lc = code.toLowerCase();
  return <img src={`https://flagcdn.com/w${size}/${lc}.png`} srcSet={`https://flagcdn.com/w40/${lc}.png 2x`} alt="" aria-hidden="true" width={size} height={Math.round(size*0.75)} className="w-5 h-3.5 rounded-sm object-cover border border-line/60 shrink-0 shadow-sm" loading="lazy" decoding="async" onError={(e)=>{ e.currentTarget.style.display='none'; e.currentTarget.nextSibling && (e.currentTarget.nextSibling.style.display='inline'); }} />;
}
function Pill({ children }) { return <span className="inline-flex items-center rounded-full bg-paper border border-line px-2.5 py-1 text-xs font-medium text-ink-2">{children}</span>; }
function SourceBadge({ url, date }) {
  return <span className="inline-flex items-center gap-1 text-[0.7rem] text-ink-3"><Info className="w-3 h-3"/>{date} · <a href={url} target="_blank" rel="noreferrer" className="underline hover:text-ink">source</a></span>;
}

function Choice({ selected, onClick, label, desc, multi }) {
  return (
    <button type="button" role={multi?'checkbox':'radio'} aria-checked={selected} onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border flex items-start gap-3 transition-all ${selected?'border-brand-500 bg-brand-500 text-white shadow-brand':'border-line bg-surface hover:border-brand-300 hover:shadow-sm text-ink'}`}>
      <span className={`mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center border-2 ${multi?'rounded-md':'rounded-full'} ${selected?'bg-white border-white':'border-line-strong bg-transparent'}`}>
        {selected && (multi ? <Check className="w-3 h-3" style={{color:'#2563eb'}} strokeWidth={3}/> : <span className="w-2.5 h-2.5 rounded-full" style={{background:'#2563eb'}}/>)}
      </span>
      <span className="flex flex-col"><span className={`text-sm font-medium ${selected?'text-white':'text-ink'}`}>{label}</span>{desc && <span className={`text-xs mt-0.5 ${selected?'text-white/80':'text-ink-3'}`}>{desc}</span>}</span>
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function StudyAbroad(){
  useScrollTop();
  const navigate = useNavigate();
  const { answers: navAnswers } = useUser();
  const [view, setView] = useState('landing'); // landing | quiz | results | compare | universities | plan
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState('right');
  const headingRef = useRef(null);
  const [compareIds, setCompareIds] = useState([]);
  const [uniCompare, setUniCompare] = useState([]);

  // Pre-fill from NAVORA profile if exists
  const inferredLevel = useMemo(()=>{
    const s = String(navAnswers?.stream || navAnswers?.streamV2 || '').toLowerCase();
    if(['mpc','bipc','cec','mec','commerce','arts'].includes(s)) return "Bachelor's after Class 12";
    if(navAnswers?.degree || navAnswers?.gradDegree) return "Master's after graduation";
    return '';
  },[navAnswers]);

  const [form, setForm] = useState({
    studyLevel: inferredLevel,
    stream: navAnswers?.stream || navAnswers?.streamV2 || '',
    marks: '',
    degree: '',
    goal: '',
    budgetId: '',
    priorities: [],
    language: '',
    preferences: '',
    optimize: 'Best overall fit',
  });
  const [errors, setErrors] = useState({});

  useEffect(()=>{ window.scrollTo({top:0,behavior:'auto'}); const t=setTimeout(()=>headingRef.current?.focus(),300); return()=>clearTimeout(t); },[step,view]);

  const totalSteps = STEPS.length;
  const current = STEPS[step];

  const results = useMemo(()=>{
    if(view!=='results' && view!=='compare' && view!=='universities' && view!=='plan') return [];
    return rankCountries({ studyLevel: form.studyLevel, goal: form.goal, budgetId: form.budgetId, budgetMaxINR: getBudgetMax(form.budgetId), priorities: form.priorities, language: form.language });
  },[view, form]);

  const validate = ()=>{
    const id = current.id;
    if(id==='studyLevel' && !form.studyLevel) return 'Please select your study level';
    if(id==='academic'){
      // light validation — stream/marks optional but encourage
      if(form.studyLevel==="Bachelor's after Class 12" && !form.stream) return 'Select your stream or choose exploring';
      return null;
    }
    if(id==='goal' && !form.goal) return 'Please choose a direction (or Not sure yet)';
    if(id==='budget' && !form.budgetId) return 'Please select a budget range';
    if(id==='priority' && form.priorities.length===0) return 'Choose 1–3 priorities';
    if(id==='priority' && form.priorities.length>3) return 'Please choose up to 3';
    if(id==='language' && !form.language) return 'Please select a language comfort level';
    return null;
  };

  const next = ()=>{
    const msg = validate();
    if(msg){ setErrors({[current.id]:msg}); return; }
    setErrors({});
    if(step < totalSteps-1){ setDir('right'); setStep(s=>s+1); }
    else setView('results');
  };
  const back = ()=>{
    if(view==='quiz' && step>0){ setDir('left'); setStep(s=>s-1); }
    else if(view==='quiz' && step===0) setView('landing');
    else if(view==='results') { setView('quiz'); setStep(totalSteps-1); }
    else if(view==='compare' || view==='universities' || view==='plan') setView('results');
  };

  const togglePriority = (id)=>{
    setForm(f=>{
      const has=f.priorities.includes(id);
      let next;
      if(has) next=f.priorities.filter(x=>x!==id);
      else {
        if(f.priorities.length>=3) return f;
        next=[...f.priorities,id];
      }
      return {...f, priorities:next};
    });
  };

  // ── Render helpers per step
  const renderStep = ()=>{
    const id=current.id;
    if(id==='studyLevel'){
      return <div className="grid sm:grid-cols-2 gap-2.5">{studyLevels.map(l=><Choice key={l} label={l} selected={form.studyLevel===l} onClick={()=>setForm(f=>({...f,studyLevel:l}))}/>)}</div>;
    }
    if(id==='academic'){
      const isBach = form.studyLevel==="Bachelor's after Class 12";
      return (
        <div className="space-y-5">
          {form.studyLevel && <div className="inline-flex items-center gap-2 text-xs bg-brand-50 border border-brand-100 text-brand-700 rounded-full px-3 py-1.5">Using your NAVORA profile — <button onClick={()=>setForm(f=>({...f,studyLevel:''}))} className="underline font-semibold">Edit</button></div>}
          {isBach ? (
            <>
              <div>
                <p className="text-sm font-medium text-ink mb-2">Current / finished stream</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{['MPC','BiPC','CEC','MEC','Commerce','Arts','Diploma','Not sure'].map(s=><button key={s} onClick={()=>setForm(f=>({...f,stream:s}))} className={`px-3 py-2.5 rounded-xl border text-sm font-medium ${form.stream===s?'bg-brand-500 text-white border-brand-500':'bg-surface border-line hover:border-brand-200'}`}>{s}</button>)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-ink mb-2">Expected / actual performance</p>
                <div className="flex flex-wrap gap-2">{['90%+','75–89%','60–74%','Below 60%','CGPA 8+','CGPA 7–8'].map(m=><button key={m} onClick={()=>setForm(f=>({...f,marks:m}))} className={`px-3 py-2 rounded-full border text-sm ${form.marks===m?'bg-ink text-white border-ink':'bg-surface border-line'}`}>{m}</button>)}</div>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-ink mb-2">Degree & specialization</p>
                <input value={form.degree} onChange={e=>setForm(f=>({...f,degree:e.target.value}))} placeholder="e.g. B.Tech Mechanical, B.Com, BSc CS" className="w-full px-4 py-3 rounded-xl border border-line bg-surface text-sm focus:outline-none focus:border-brand-400"/>
              </div>
              <div>
                <p className="text-sm font-medium text-ink mb-2">CGPA / Percentage</p>
                <div className="flex flex-wrap gap-2">{['8.5+','7.5–8.5','6.5–7.5','Below 6.5','75%+','60–74%'].map(m=><button key={m} onClick={()=>setForm(f=>({...f,marks:m}))} className={`px-3 py-2 rounded-full border text-sm ${form.marks===m?'bg-ink text-white border-ink':'bg-surface border-line'}`}>{m}</button>)}</div>
              </div>
              {form.studyLevel==='Healthcare / Medicine' && <p className="text-xs text-warning flex gap-1.5"><AlertTriangle className="w-4 h-4 shrink-0"/>Medicine requires recognition & licensing checks — we surface this in your matches.</p>}
            </>
          )}
        </div>
      );
    }
    if(id==='goal'){
      return (
        <div>
          <div className="grid sm:grid-cols-2 gap-2.5">{goals.map(g=><Choice key={g} label={g} selected={form.goal===g} onClick={()=>setForm(f=>({...f,goal:g}))}/>)}</div>
          {form.goal==='Not sure yet' && <p className="mt-3 text-sm text-ink-2 bg-paper border border-line rounded-xl px-4 py-3">No problem — we will show a broad fit and route you to course discovery. Your budget and priorities still shape the match.</p>}
        </div>
      );
    }
    if(id==='budget'){
      return (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-2.5">{BUDGET_RANGES.map(b=><Choice key={b.id} label={b.label} desc={b.id==='unsure'?'We estimate from your profile': b.maxINR?`Up to ₹${(b.maxINR/100000).toFixed(0)}L` : ''} selected={form.budgetId===b.id} onClick={()=>setForm(f=>({...f,budgetId:b.id}))}/>)}</div>
          <p className="text-xs text-ink-3">Total cost = tuition + living for the full degree. Ranges, not fee promises.</p>
        </div>
      );
    }
    if(id==='priority'){
      return (
        <div>
          <div className="grid sm:grid-cols-2 gap-2.5">{prioritiesList.map(p=><Choice key={p.id} multi label={p.label} selected={form.priorities.includes(p.id)} onClick={()=>togglePriority(p.id)}/>)}</div>
          <p className="mt-2 text-xs text-ink-3">Selected {form.priorities.length} of 3 — choose the 2–3 that truly drive your decision.</p>
        </div>
      );
    }
    if(id==='language'){
      return <div className="space-y-2.5">{languageOpts.map(o=><Choice key={o.id} label={o.label} desc={o.desc} selected={form.language===o.id} onClick={()=>setForm(f=>({...f,language:o.id}))}/>)}</div>;
    }
    if(id==='preferences'){
      return (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-ink mb-2">Campus / city preference</p>
            <div className="flex flex-wrap gap-2">{prefOpts.map(p=><button key={p} onClick={()=>setForm(f=>({...f,preferences:p}))} className={`px-4 py-2 rounded-full border text-sm font-medium ${form.preferences===p?'bg-brand-500 text-white border-brand-500':'bg-surface border-line hover:border-brand-200'}`}>{p}</button>)}</div>
          </div>
          <div>
            <p className="text-sm font-medium text-ink mb-2">Optimize for (optional)</p>
            <div className="flex flex-wrap gap-2">{['Best overall fit','Best value','Best career opportunity','Lowest financial risk','Strongest post-study opportunity'].map(o=><button key={o} onClick={()=>setForm(f=>({...f,optimize:o}))} className={`px-3 py-2 rounded-full border text-xs font-medium ${form.optimize===o?'bg-ink text-white border-ink':'bg-paper border-line'}`}>{o}</button>)}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  // ── Landing ────────────────────────────────────────────
  if(view==='landing'){
    return (
      <div className="bg-surface">
        {/* Hero — editorial, calm, premium */}
        <section className="relative overflow-hidden bg-paper-gradient border-b border-line">
          <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-brand-400/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -left-40 w-[24rem] h-[24rem] rounded-full bg-brand-200/20 blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-16 lg:pt-14 lg:pb-20">
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-100 px-4 py-1.5 shadow-sm mb-6">
                  <Logo size="sm" />
                  <span className="eyebrow text-brand-700">Global Study · Premium Consultancy</span>
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-ink-3 border border-line rounded-full px-3 py-1 bg-white">LEARN · EXPLORE · DECIDE · GROW</span>
                </div>
                <h1 className="font-ui font-bold text-[2.6rem] sm:text-5xl lg:text-[3.4rem] leading-[1.02] tracking-[-0.03em] text-ink text-balance">
                  Global Study<br/>
                  <span className="font-display italic font-medium text-gradient">with clarity.</span>
                </h1>
                <p className="mt-5 text-[1.05rem] text-ink-2 leading-relaxed max-w-xl">
                  Compare countries, courses, costs, universities and post-study opportunities — based on <em className="text-ink font-medium">your</em> profile. Not a directory. A decision.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button onClick={()=>setView('quiz')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold px-7 py-3.5 shadow-brand transition-all hover:-translate-y-px">
                    Build my study plan <ArrowRight className="w-4 h-4"/>
                  </button>
                  <button onClick={()=>{ setView('results'); setForm(f=>({...f, budgetId: f.budgetId||'25-40', goal: f.goal||'Software Engineering', studyLevel: f.studyLevel||"Master's after graduation", language:'comfortable', priorities:['cost','employment']})); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-line hover:border-brand-200 text-ink font-ui font-semibold px-7 py-3.5 shadow-sm">
                    <Globe className="w-4 h-4"/> Explore countries
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-3">
                  <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success"/> ~6–8 questions</span>
                  <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success"/> Uses your NAVORA profile</span>
                  <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success"/> No spam, no agents</span>
                </div>
              </div>

              {/* Editorial preview card — restrained */}
              <div className="lg:col-span-5">
                <div className="relative bg-white border border-line rounded-[1.5rem] shadow-card-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-paper/60">
                    <span className="eyebrow text-ink-3">Your match preview</span>
                    <span className="text-xs font-medium text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-2.5 py-1">NAVORA Fit Score</span>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { rank:'01', country:'Germany', cat:'BEST OVERALL FIT', score:87, note:'Lower public tuition · Automotive & CS strength' },
                      { rank:'02', country:'Netherlands', cat:'BEST VALUE', score:83, note:'English-taught breadth · 1-yr zoekjaar' },
                      { rank:'03', country:'Canada', cat:'BEST CAREER FIT', score:81, note:'Co-op · PGWP up to 3 years' },
                    ].map(r=>(
                      <div key={r.country} className="flex items-center gap-4 p-3 rounded-xl border border-line hover:border-brand-200 transition-colors">
                        <span className="font-display italic text-ink-3 text-lg w-7">{r.rank}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-ui font-semibold text-ink text-sm">{r.country} <span className="ml-2 text-[0.65rem] font-semibold tracking-wider uppercase text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-2 py-0.5">{r.cat}</span></p>
                          <p className="text-xs text-ink-3 mt-0.5">{r.note}</p>
                        </div>
                        <span className="w-10 h-10 rounded-xl bg-ink text-white flex flex-col items-center justify-center leading-none">
                          <span className="text-sm font-bold">{r.score}</span><span className="text-[0.55rem] opacity-60">/100</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-3 bg-paper border-t border-line flex items-center justify-between text-xs text-ink-3">
                    <span>15 countries · verified sources</span><span className="inline-flex items-center gap-1"><Sparkles className="w-3 h-3"/> Decision support</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-ink-3 text-center">Tuition, living costs & post-study rules from official sources. Last verified 2025-09-01.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works — McKinsey clarity */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-16">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="eyebrow text-brand-600 mb-3">How it works</p>
              <h2 className="font-ui font-bold text-3xl text-ink tracking-[-0.03em]">Seven questions.<br/>One clear plan.</h2>
              <p className="mt-4 text-ink-2 leading-relaxed">Every question changes the recommendation. Nothing generic. If NAVORA already knows your stream or degree, we reuse it.</p>
              <button onClick={()=>setView('quiz')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink text-white font-semibold px-5 py-3 hover:bg-brand-950 transition-colors">Start now <ArrowRight className="w-4 h-4"/></button>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-3 gap-3">
              {[
                { n:'01', k:'PROFILE', d:'Study level & academic background' },
                { n:'02', k:'GOAL', d:'Career direction & course fit' },
                { n:'03', k:'BUDGET', d:'Total cost — tuition + living' },
                { n:'04', k:'PRIORITY', d:'2–3 trade-offs you care about' },
                { n:'05', k:'LANGUAGE', d:'English-only vs open to local' },
                { n:'06', k:'PREFERENCE', d:'City, focus & optimization' },
              ].map(s=>(
                <div key={s.n} className="bg-white border border-line rounded-2xl p-5 card-lift">
                  <span className="font-display italic text-brand-500 text-xl">{s.n}</span>
                  <p className="eyebrow text-ink mt-3">{s.k}</p>
                  <p className="text-sm text-ink-2 mt-1 leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Countries strip */}
        <section className="border-y border-line bg-paper">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-ui font-semibold text-ink">15 countries · one architecture</h3>
              <button onClick={()=>setView('results')} className="text-sm font-medium text-brand-700 hover:text-brand-600">Compare all →</button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-thin pb-2">
              {COUNTRIES.map(c=>(
                <span key={c.id} className="shrink-0 inline-flex items-center gap-2 bg-white border border-line rounded-full px-3.5 py-2 text-sm font-medium text-ink-2">
                  <FlagLogo code={c.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(c)}</span>{c.name}
                </span>
              ))}
            </div>

          </div>
        </section>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
          <p className="text-xs text-ink-3 leading-relaxed text-center max-w-3xl mx-auto">Tuition fees, living costs, admission requirements and immigration rules can change. NAVORA provides decision-support information based on available sources and does not guarantee admission, employment, visa approval or immigration outcomes. Always verify final requirements with the university and relevant government authority.</p>
        </div>
      </div>
    );
  }

  // ── Quiz ───────────────────────────────────────────────
  if(view==='quiz'){
    return (
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen bg-paper-gradient">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 lg:py-10">
            <div className="flex items-center justify-between mb-6">
              <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink"><ArrowLeft className="w-4 h-4"/>Back</button>
              <span className="text-xs font-medium text-ink-3 bg-white border border-line rounded-full px-3 py-1.5">{String(step+1).padStart(2,'0')} / {String(totalSteps).padStart(2,'0')} · {current.label}</span>
            </div>
            <div className="bg-white border border-line rounded-[1.5rem] shadow-card p-6 sm:p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="eyebrow text-ink-3">{current.label}</span>
                  <span className="text-xs text-ink-3">{Math.round(((step+1)/totalSteps)*100)}%</span>
                </div>
                <div className="h-1.5 bg-paper-deep rounded-full overflow-hidden"><div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{width:`${((step+1)/totalSteps)*100}%`}}/></div>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{opacity:0,x:dir==='right'?18:-18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:dir==='right'?-18:18}} transition={{duration:0.28,ease:[0.22,1,0.36,1]}}>
                  <h1 ref={headingRef} tabIndex={-1} className="font-ui font-bold text-[1.6rem] sm:text-[1.9rem] text-ink tracking-[-0.02em] leading-tight outline-none">{current.title}</h1>
                  {current.id==='budget' && <p className="mt-2 text-sm text-ink-3">Total cost for the full degree (tuition + living). We distinguish this from visa financial requirements.</p>}
                  {current.id==='priority' && <p className="mt-2 text-sm text-ink-3">Choose 2–3. This shapes the penalty logic and ranking.</p>}
                  <div className="mt-6">{renderStep()}</div>
                  {errors[current.id] && <p className="mt-3 text-sm font-medium text-error flex gap-1.5"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0"/>{errors[current.id]}</p>}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 pt-6 border-t border-line flex items-center justify-between gap-4">
                <span className="text-xs text-ink-3 hidden sm:inline">An expert is helping you make this decision — not an agent.</span>
                <Button onClick={next} size="lg" shine>{step===totalSteps-1?'See my matches':'Continue'}<ArrowRight className="w-4 h-4"/></Button>
              </div>
            </div>
          </div>
        </div>
      </MotionConfig>
    );
  }

  // ── Results ────────────────────────────────────────────
  const top = results.slice(0,5);
  const budgetINR = getBudgetMax(form.budgetId);

  if(view==='results'){
    return (
      <div className="bg-paper min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink mb-6"><ArrowLeft className="w-4 h-4"/>Back to questionnaire</button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow text-brand-600">Your Global Study Match</p>
              <h1 className="font-ui font-bold text-3xl sm:text-[2.2rem] text-ink tracking-[-0.03em] mt-2">Based on your profile, these deserve serious consideration.</h1>
              <p className="mt-3 text-ink-2 text-sm leading-relaxed max-w-2xl">Ranked by NAVORA Fit Score — transparent, penalty-aware, not hype. {form.goal && <>Goal: <b>{form.goal}</b> ·</>} {form.budgetId && <>Budget: <b>{BUDGET_RANGES.find(b=>b.id===form.budgetId)?.label}</b></>}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={()=>setView('compare')} className="inline-flex items-center gap-2 rounded-xl bg-white border border-line px-4 py-2.5 text-sm font-semibold hover:border-brand-200"><Scale className="w-4 h-4"/>Compare</button>
              <button onClick={()=>setView('universities')} className="inline-flex items-center gap-2 rounded-xl bg-ink text-white px-4 py-2.5 text-sm font-semibold"><GraduationCap className="w-4 h-4"/> Universities</button>
              <button onClick={()=>setView('plan')} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 text-white px-4 py-2.5 text-sm font-semibold shadow-brand"><Compass className="w-4 h-4"/> My Study Plan</button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              {top.map((r, idx)=>(
                <div key={r.country.id} className={`bg-white border rounded-[1.4rem] p-6 sm:p-7 shadow-card ${idx===0?'ring-1 ring-brand-200 border-brand-200': 'border-line'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <span className="hidden sm:flex w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 items-center justify-center font-display italic text-brand-700">{String(idx+1).padStart(2,'0')}</span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-ui font-bold text-xl text-ink inline-flex items-center gap-2"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>{r.country.name}</h3>
                          <span className="text-[0.68rem] font-bold tracking-wider uppercase bg-ink text-white rounded-full px-2.5 py-1">{r.category}</span>
                          <span className="inline-flex items-center gap-1 text-xs text-ink-3"><MapPin className="w-3 h-3"/>{r.country.region}</span>
                        </div>
                        <p className="mt-2 text-sm text-ink-2 leading-relaxed">{r.reasons.join(' · ') || 'Balanced match across your criteria.'}</p>
                      </div>
                    </div>
                    <div className="shrink-0 w-[4.5rem] h-[4.5rem] rounded-2xl bg-ink text-white flex flex-col items-center justify-center leading-none">
                      <span className="text-xl font-bold">{r.fit}</span><span className="text-[0.6rem] tracking-wider uppercase opacity-60">Fit Score</span>
                    </div>
                  </div>

                  <div className="mt-5 grid sm:grid-cols-3 gap-3">
                    <div className="bg-paper border border-line rounded-xl px-4 py-3">
                      <p className="eyebrow text-ink-3">Living</p>
                      <p className="text-sm font-semibold text-ink mt-1">{r.country.currency} {r.country.monthlyLivingCost.min.toLocaleString()}–{r.country.monthlyLivingCost.max.toLocaleString()}/mo</p>
                      <p className="text-xs text-ink-3">≈ ₹{(r.annualINR/12/1000).toFixed(0)}k/mo total with tuition</p>
                    </div>
                    <div className="bg-paper border border-line rounded-xl px-4 py-3">
                      <p className="eyebrow text-ink-3">Post-study</p>
                      <p className="text-sm font-semibold text-ink mt-1">{r.country.postStudyRoute}</p>
                      <p className="text-xs text-ink-3">{r.country.postStudyDuration}</p>
                    </div>
                    <div className="bg-paper border border-line rounded-xl px-4 py-3">
                      <p className="eyebrow text-ink-3">Best courses for you</p>
                      <p className="text-sm font-medium text-ink mt-1">{(r.country.careerStrengths.slice(0,2).join(' · '))}</p>
                      <p className="text-xs text-ink-3">{r.country.studyStrengths[0]}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-brand-50/70 border border-brand-100 px-4 py-3">
                      <p className="text-xs font-semibold text-brand-700 flex items-center gap-1.5"><Award className="w-3.5 h-3.5"/>Why it matches you</p>
                      <ul className="mt-1.5 space-y-1 text-xs text-ink-2 list-disc list-inside">{r.reasons.map(x=><li key={x}>{x}</li>)}{r.reasons.length===0 && <li>Balanced fit</li>}</ul>
                    </div>
                    {r.concerns.length>0 ? (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                        <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/>Why this may NOT be right</p>
                        <ul className="mt-1.5 space-y-1 text-xs text-amber-900 list-disc list-inside">{r.concerns.map(x=><li key={x}>{x}</li>)}</ul>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                        <p className="text-xs font-semibold text-emerald-800">No major concerns for your profile</p>
                        <p className="text-xs text-emerald-900 mt-1">This option aligns well on cost, language and course fit.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <SourceBadge url={r.country.sourceUrl} date={r.country.lastVerified}/>
                    <span className="text-ink-3">Visa requirement ≠ living cost — shown separately above.</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={()=>{
                      setCompareIds(ids=> ids.includes(r.country.id) ? ids.filter(x=>x!==r.country.id) : ids.length<3? [...ids, r.country.id]: ids);
                    }} className={`text-xs font-semibold rounded-full px-3 py-1.5 border ${compareIds.includes(r.country.id)?'bg-ink text-white border-ink':'bg-white border-line hover:border-brand-200'}`}>{compareIds.includes(r.country.id)?'Selected for compare':'Add to compare'}</button>
                    <a href={r.country.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-ink-2 hover:text-ink">Official source <ExternalLink className="w-3 h-3"/></a>
                  </div>
                </div>
              ))}


            </div>

            {/* Right rail — cost sanity + next steps */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-line rounded-2xl p-5 shadow-card">
                <h4 className="font-ui font-semibold text-ink flex items-center gap-2"><Wallet className="w-4 h-4"/>Cost reality</h4>
                <p className="text-xs text-ink-3 mt-1">Tuition + living (mid-range). Degree total assumes 2-year Master.</p>
                <div className="mt-4 space-y-2">
                  {top.slice(0,4).map(r=>{
                    const ann = annualCostINR(r.country);
                    const deg = degreeCostINR(r.country,2);
                    const over = budgetINR && ann > budgetINR;
                    return (
                      <div key={r.country.id} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${over?'border-amber-200 bg-amber-50':'border-line bg-paper'}`}>
                        <span className="text-sm font-medium text-ink inline-flex items-center gap-1.5"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>{r.country.name}</span>
                        <span className={`text-xs font-semibold ${over?'text-amber-800':'text-ink'}`}>₹{(ann/100000).toFixed(1)}L/yr · ₹{(deg/100000).toFixed(0)}L degree</span>
                      </div>
                    );
                  })}
                </div>
                {compareIds.length>0 && <button onClick={()=>setView('compare')} className="mt-4 w-full rounded-xl bg-ink text-white text-sm font-semibold py-2.5">Compare {compareIds.length} countries →</button>}
              </div>

              <div className="bg-ink text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-600/25 blur-2xl"/>
                <h4 className="font-ui font-semibold flex items-center gap-2"><Building2 className="w-4 h-4"/>Next: universities</h4>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">We shortlist 3–6 per recommended country with tuition, entry, scholarships and post-study context.</p>
                <button onClick={()=>setView('universities')} className="mt-4 w-full rounded-xl bg-white text-ink font-semibold py-2.5">View universities</button>
              </div>

              <div className="bg-white border border-line rounded-2xl p-5">
                <p className="text-xs font-semibold text-ink flex items-center gap-2"><Info className="w-3.5 h-3.5"/>Rules can change</p>
                <p className="text-xs text-ink-3 mt-1.5 leading-relaxed">Verify current requirements with the relevant government authority before making an application. Figures are ranges for 2024–25.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Compare ────────────────────────────────────────────
  if(view==='compare'){
    const selected = compareIds.length ? results.filter(r=>compareIds.includes(r.country.id)) : results.slice(0,3);
    return (
      <div className="bg-paper min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink mb-6"><ArrowLeft className="w-4 h-4"/>Back to matches</button>
          <h1 className="font-ui font-bold text-2xl text-ink">Cost & opportunity comparison</h1>
          <p className="text-sm text-ink-3 mt-1">Tuition + living vs post-study vs fit. Living cost is estimated student spend, not the visa maintenance figure.</p>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[720px] w-full bg-white border border-line rounded-2xl overflow-hidden shadow-card">
              <thead className="bg-paper border-b border-line text-xs text-ink-3">
                <tr><th className="text-left px-4 py-3 font-semibold">Country</th><th className="text-left px-4 py-3">Tuition (range)</th><th className="text-left px-4 py-3">Living / mo</th><th className="text-left px-4 py-3">Annual total*</th><th className="text-left px-4 py-3">Degree (2yr)</th><th className="text-left px-4 py-3">Post-study</th><th className="text-left px-4 py-3">Fit</th></tr>
              </thead>
              <tbody className="text-sm">
                {selected.map(r=>{
                  const ann=annualCostINR(r.country);
                  return (
                    <tr key={r.country.id} className="border-t border-line hover:bg-paper/60">
                      <td className="px-4 py-3 font-semibold text-ink"><span className="inline-flex items-center gap-1.5"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>{r.country.name}</span></td>
                      <td className="px-4 py-3 text-ink-2">{r.country.currency} {r.country.tuitionRange.min.toLocaleString()}–{r.country.tuitionRange.max.toLocaleString()}</td>
                      <td className="px-4 py-3 text-ink-2">{r.country.currency} {r.country.monthlyLivingCost.min}–{r.country.monthlyLivingCost.max}</td>
                      <td className="px-4 py-3 font-medium">₹{(ann/100000).toFixed(1)}L</td>
                      <td className="px-4 py-3">₹{(degreeCostINR(r.country)/100000).toFixed(0)}L</td>
                      <td className="px-4 py-3 text-xs leading-tight">{r.country.postStudyDuration}</td>
                      <td className="px-4 py-3"><span className="inline-flex w-9 h-9 rounded-xl bg-ink text-white items-center justify-center text-sm font-bold">{r.fit}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-3">*Annual total = mid tuition + mid living, converted at ~ {Object.entries(FX).slice(0,4).map(([k,v])=>`${k} ₹${v}`).join(' · ')}.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {COUNTRIES.slice(0,8).map(c=>(
              <button key={c.id} onClick={()=>setCompareIds(ids=> ids.includes(c.id) ? ids.filter(x=>x!==c.id) : ids.length<3? [...ids,c.id]: ids)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${compareIds.includes(c.id)?'bg-ink text-white border-ink':'bg-white border-line'}`}><FlagLogo code={c.code} size={20} /><span aria-hidden="true" className="hidden">{flagFromCode(c.code)}</span>{c.name}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Universities ───────────────────────────────────────
  if(view==='universities'){
    const topCountryIds = results.slice(0,3).map(r=>r.country.id);
    const list = UNIVERSITIES.filter(u=> topCountryIds.includes(u.countryId));
    return (
      <div className="bg-paper min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink mb-6"><ArrowLeft className="w-4 h-4"/>Back to matches</button>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-ui font-bold text-2xl text-ink">University shortlist</h1>
              <p className="text-sm text-ink-3 mt-1">3–6 per recommended country. Categories: BEST FIT · AMBITIOUS · VALUE · ALTERNATIVE. Select up to 3 to compare.</p>
            </div>
            {uniCompare.length>0 && <span className="text-xs bg-ink text-white rounded-full px-3 py-1.5">{uniCompare.length}/3 selected</span>}
          </div>

          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map(u=>{
              const c = COUNTRIES.find(x=>x.id===u.countryId);
              const sel = uniCompare.includes(u.id);
              return (
                <div key={u.id} className={`bg-white border rounded-2xl p-5 shadow-card flex flex-col ${sel?'ring-1 ring-brand-400 border-brand-300': 'border-line'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-ui font-semibold text-ink leading-tight flex items-center gap-2"><FlagLogo code={c?.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(c)}</span>{u.name}</h3>
                      <p className="text-xs text-ink-3 flex items-center gap-1.5 mt-1"><FlagLogo code={c?.code} size={16} /><span aria-hidden="true" className="hidden">{flagForCountry(c)}</span><MapPin className="w-3 h-3"/>{u.city}, {c?.name}</p>
                    </div>
                    <span className="text-[0.65rem] font-bold tracking-wider uppercase bg-paper border border-line rounded-full px-2 py-1 shrink-0">{u.type}</span>
                  </div>
                  <p className="mt-3 text-xs text-ink-2"><b>Relevant courses:</b> {u.programs.join(' · ')}</p>
                  <p className="mt-2 text-xs text-ink-2"><b>Tuition:</b> {u.tuitionByProgram}</p>
                  <p className="text-xs text-ink-2"><b>Entry:</b> {u.entryRequirements}</p>
                  <p className="text-xs text-ink-2"><b>English:</b> {u.languageRequirements}</p>
                  <p className="text-xs text-ink-3 mt-2"><b>Strengths:</b> {u.strengths.join(' · ')}</p>
                  {c && <p className="text-xs text-ink-3"><b>Est. living:</b> {c.currency} {c.monthlyLivingCost.min}–{c.monthlyLivingCost.max}/mo · <b>Post-study:</b> {c.postStudyDuration}</p>}
                  <div className="mt-3 flex flex-wrap gap-1.5">{u.scholarships.map(s=><Pill key={s}>{s}</Pill>)}<a href={u.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline">Website <ExternalLink className="w-3 h-3"/></a></div>
                  <button onClick={()=> setUniCompare(ids=> ids.includes(u.id) ? ids.filter(x=>x!==u.id) : ids.length<3 ? [...ids,u.id] : ids)} className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold border ${sel?'bg-ink text-white border-ink':'bg-white border-line hover:border-brand-200'}`}>{sel?'Remove from compare':'Add to compare'}</button>
                  <SourceBadge url={u.sourceUrls[0]} date={u.lastVerified} />
                </div>
              );
            })}
          </div>

          {uniCompare.length>=2 && (
            <div className="mt-8 bg-white border border-line rounded-2xl overflow-hidden shadow-card">
              <div className="px-5 py-3 bg-paper border-b border-line font-ui font-semibold text-ink">University comparison — {uniCompare.length} selected</div>
              <div className="overflow-x-auto">
                <table className="min-w-[640px] w-full text-sm">
                  <thead className="text-xs text-ink-3 border-b border-line"><tr><th className="text-left px-4 py-3">Field</th>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <th key={id} className="text-left px-4 py-3 font-semibold text-ink">{u?.name}</th>})}</tr></thead>
                  <tbody className="divide-y divide-line">
                    <tr><td className="px-4 py-3 text-ink-3">City</td>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <td key={id} className="px-4 py-3">{u?.city}</td>})}</tr>
                    <tr><td className="px-4 py-3 text-ink-3">Tuition</td>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <td key={id} className="px-4 py-3">{u?.tuitionByProgram}</td>})}</tr>
                    <tr><td className="px-4 py-3 text-ink-3">Entry</td>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <td key={id} className="px-4 py-3 text-xs">{u?.entryRequirements}</td>})}</tr>
                    <tr><td className="px-4 py-3 text-ink-3">English</td>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <td key={id} className="px-4 py-3">{u?.languageRequirements}</td>})}</tr>
                    <tr><td className="px-4 py-3 text-ink-3">Strengths</td>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <td key={id} className="px-4 py-3 text-xs">{u?.strengths.join(' · ')}</td>})}</tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={()=>setView('plan')} className="rounded-xl bg-brand-500 text-white font-semibold px-6 py-3 shadow-brand">Generate my study plan →</button>
            <button onClick={()=>setView('results')} className="rounded-xl bg-white border border-line font-semibold px-6 py-3">Back to countries</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Final Plan ─────────────────────────────────────────
  if(view==='plan'){
    const top3 = results.slice(0,3);
    return (
      <div className="bg-surface min-h-screen">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink mb-6"><ArrowLeft className="w-4 h-4"/>Back</button>
          <div className="bg-white border border-line rounded-[1.6rem] shadow-card-lg overflow-hidden">
            <div className="bg-ink text-white px-6 sm:px-8 py-8 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-600/20 blur-3xl"/>
              <p className="eyebrow text-brand-300">My NAVORA Global Study Plan</p>
              <h1 className="font-ui font-bold text-3xl mt-2 tracking-[-0.02em]">Your international education — planned.</h1>
              <p className="text-white/70 text-sm mt-2">Decision support, not a directory. Verify all figures with the university and government before applying.</p>
            </div>
            <div className="px-6 sm:px-8 py-8 space-y-8">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-paper border border-line rounded-xl p-4"><p className="eyebrow text-ink-3">Profile</p><p className="font-medium text-ink mt-1">{form.studyLevel || '—'} {form.stream?`· ${form.stream}`:''} {form.marks?`· ${form.marks}`:''}</p><p className="text-ink-2">Goal: {form.goal || '—'} · Lang: {form.language || '—'}</p></div>
                <div className="bg-paper border border-line rounded-xl p-4"><p className="eyebrow text-ink-3">Budget</p><p className="font-medium text-ink mt-1">{BUDGET_RANGES.find(b=>b.id===form.budgetId)?.label || '—'}</p><p className="text-ink-2">Priorities: {form.priorities.join(' · ') || '—'}</p></div>
              </div>

              <div>
                <h3 className="font-ui font-semibold text-ink">Recommended countries</h3>
                <div className="mt-3 space-y-2">{top3.map((r,i)=><div key={r.country.id} className="flex items-center justify-between border border-line rounded-xl px-4 py-3 bg-white"><span className="font-medium text-ink inline-flex items-center gap-2"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>0{i+1} · {r.country.name} — <span className="text-xs font-bold tracking-wider uppercase text-brand-700">{r.category}</span></span><span className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center text-sm font-bold">{r.fit}</span></div>)}</div>
              </div>

              <div>
                <h3 className="font-ui font-semibold text-ink">Estimated total cost (2-yr Master, mid-range)</h3>
                <div className="mt-3 space-y-2">{top3.map(r=><div key={r.country.id} className="flex justify-between text-sm border border-line rounded-xl px-4 py-2.5 bg-paper"><span className="font-medium text-ink inline-flex items-center gap-1.5"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>{r.country.name}</span><span className="font-semibold">₹{(degreeCostINR(r.country)/100000).toFixed(1)}L</span></div>)}</div>
                <p className="text-xs text-ink-3 mt-2">Ranges for 2024–25; city matters (London ≠ Manchester, Munich ≠ Leipzig). See country cards for breakdown.</p>
              </div>

              <div>
                <h3 className="font-ui font-semibold text-ink">Post-study work — at a glance</h3>
                <div className="mt-3 space-y-2">{top3.map(r=><div key={r.country.id} className="border border-line rounded-xl px-4 py-3 bg-white"><p className="text-sm font-medium text-ink inline-flex items-center gap-1.5"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>{r.country.name}: {r.country.postStudyRoute} — {r.country.postStudyDuration}</p><p className="text-xs text-ink-3">{r.country.postStudyEligibility} · <a href={r.country.sourceUrl} target="_blank" rel="noreferrer" className="underline">verify</a></p></div>)}</div>
                <p className="text-xs text-warning mt-2 flex gap-1.5"><AlertTriangle className="w-4 h-4 shrink-0"/>Rules can change. Verify current requirements with the relevant government authority before making an application.</p>
              </div>

              <div className="bg-paper border border-line rounded-xl p-5">
                <h3 className="font-ui font-semibold text-ink">Suggested timeline</h3>
                <ol className="mt-3 space-y-2 text-sm text-ink-2">
                  <li><b className="text-ink">Phase 01 · Confirm course</b> — lock {form.goal || 'target course'}; if “Not sure”, do course discovery first.</li>
                  <li><b className="text-ink">Phase 02 · Shortlist countries</b> — done ✓</li>
                  <li><b className="text-ink">Phase 03 · Shortlist universities</b> — pick 6–8, categorize Ambitious / Fit / Value.</li>
                  <li><b className="text-ink">Phase 04 · Scholarships</b> — DAAD / Chevening / etc. deadlines often precede admission.</li>
                  <li><b className="text-ink">Phase 05 · Verify visa</b> — blocked account, proof of funds, health cover per country.</li>
                  <li><b className="text-ink">Phase 06 · Prepare applications</b> — SOP, LORs, language tests, portfolio where needed.</li>
                  <li><b className="text-ink">Phase 07 · Apply</b> — intakes vary by country; start 10–12 months before intake.</li>
                </ol>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={()=>window.print()} className="rounded-xl bg-ink text-white font-semibold px-6 py-3">Print / Save PDF</button>
                <button onClick={()=>setView('results')} className="rounded-xl bg-white border border-line font-semibold px-6 py-3">Back to matches</button>
              </div>

              <p className="text-xs text-ink-3 leading-relaxed border-t border-line pt-4">Tuition fees, living costs, admission requirements and immigration rules can change. NAVORA provides decision-support information based on available sources and does not guarantee admission, employment, visa approval or immigration outcomes. Always verify final requirements with the university and relevant government authority.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
