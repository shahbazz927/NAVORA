import { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  MessageCircle,
  Compass,
  Scale,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  GraduationCap,
  Wrench,
  ClipboardList,
  AlertCircle,
  Camera,
  Pencil,
  Download,
  Share2,
  LogOut,
  Mail,
  BadgeCheck,
  User,
  Calendar,
} from 'lucide-react';
import Button from '../components/Button';
import Swoosh from '../components/Swoosh';
import { FadeIn } from '../components/AnimatedPage';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import { personas } from '../data/personas';
import { getStudentContext } from '../data/streamConfig';
import AICareerAdvisor from '../components/ai/AICareerAdvisor';
import { fetchLatestResult } from '../lib/assessmentResults';
import { unifiedFromCareerEngine } from '../data/resultsAdapters';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  useScrollTop();
  const navigate = useNavigate();
  const { userType: localUserType, answers: localAnswers, onboardingData, comparisonItems, user, setOnboardingData, setUser } = useUser();

  const [remote, setRemote] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(true);
  const [remoteError, setRemoteError] = useState(null);

  // Profile extras: avatar, edit name, share, PDF
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('navora-avatar') || user?.user_metadata?.avatar_url || '');
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
    const stored = localStorage.getItem('navora-avatar');
    if (stored) setAvatarUrl(stored);
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Please choose an image under 2MB.'); return; }
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
    localStorage.setItem('navora-avatar', preview);
    // Try Supabase storage (optional bucket 'avatars'); fallback is local preview
    try {
      if (user?.id) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${user.id}/avatar.${ext}`;
        const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
        if (!error) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(path);
          if (data?.publicUrl) {
            setAvatarUrl(data.publicUrl);
            localStorage.setItem('navora-avatar', data.publicUrl);
            await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } }).catch(()=>{});
          }
        }
      }
    } catch {}
  };

  const handleSaveName = async () => {
    const n = draftName.trim().slice(0, 40);
    if (n.length < 2) return;
    setOnboardingData({ ...onboardingData, name: n });
    setEditingName(false);
    try { await supabase.auth.updateUser({ data: { full_name: n } }).catch(()=>{}); } catch {}
  };

  const handleShare = async () => {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); setShareCopied(true); setTimeout(()=>setShareCopied(false), 2000); } catch { window.prompt('Copy this link:', url); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(()=>{});
    setUser(null);
    navigate('/login');
  };

  const handleDownloadPdf = async (topData, unifiedData) => {
    if (!topData) return;
    setPdfDownloading(true);
    try {
        // Printable window — user can Save as PDF (no extra dependency)
        const w = window.open('', '_blank');
        if (!w) throw new Error('Popup blocked');
        const html = `<!doctype html><html><head><title>NAVORA Result</title><style>body{font-family:Inter,system-ui;padding:32px;color:#0B1E3D}h1{font-size:22px;margin:0}h2{font-size:16px;margin:16px 0 8px}.pill{display:inline-block;background:#0B1E3D;color:#fff;padding:6px 12px;border-radius:999px;font-size:12px}.card{border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin:12px 0}.muted{color:#64748b;font-size:12px}</style></head><body>
          <h1>NAVORA — Your Career Result</h1><p class="muted">Generated ${new Date().toLocaleString()} • NAVORA Guidance</p>
          <h2>${(topData.title||'').replace(/</g,'&lt;')} <span style="font-weight:400;font-size:12px;color:#0ea5e9">${(topData.career?.category||'').replace(/</g,'&lt;')}</span></h2>
          ${topData.score!=null?`<div class="pill">${topData.score} Fit Score · ${topData.band||''}</div>`:''}
          <p>${(topData.career?.description||'').replace(/</g,'&lt;')}</p>
          <div class="card"><b>Recommended degree / course</b><br/>${(topData.degree?.full||topData.degree?.short||'-').replace(/</g,'&lt;')}<br/><span class="muted">${(topData.exams||[]).map(e=>e.name).join(' · ')}</span></div>
          <div class="card"><b>Why it fits</b><ul>${(topData.whyMatches||[]).map(w=>`<li>${w.replace(/</g,'&lt;')}</li>`).join('')}</ul></div>
          <div class="card"><b>Skills to develop</b><br/>${(topData.foundations?.length?topData.foundations:(topData.career?.skillsToDevelop||[])).join(' · ')}</div>
          <div class="card"><b>Alternative paths</b><ul>${(unifiedData||[]).slice(1,4).map(a=>`<li>${a.title} · ${a.band}</li>`).join('')}</ul></div>
          <p class="muted">NAVORA — Guidance, not a prediction. Verify with official sources.</p></body></html>`;
        w.document.write(html); w.document.close(); w.focus(); setTimeout(()=>w.print(), 300);
    } catch(e){ alert('Could not generate PDF. Please try again.'); }
    finally { setPdfDownloading(false); }
  };

  // Fetch authenticated user's latest FINAL result (Supabase) — persists across refresh/login
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingRemote(true);
      setRemoteError(null);
      const res = await fetchLatestResult();
      if (cancelled) return;
      if (res?.error) setRemoteError(res.error);
      else if (res?.data) setRemote(res.data);
      setLoadingRemote(false);
    })();
    return () => { cancelled = true; };
  }, [user?.email]);

  // Prefer Supabase result if present, else local context (keeps offline/guest flows working)
  const effective = useMemo(() => {
    if (remote?.assessment_data && remote?.result_data) {
      const a = remote.assessment_data || {};
      const flow = a.flow || remote.assessment_type || localUserType;
      // Derive userType from flow for context engine
      let ut = localUserType;
      if (flow) {
        if (String(flow).includes('graduation')) ut = flow.includes('parent') ? 'parent' : 'graduate';
        else if (String(flow).includes('class12')) ut = flow.includes('parent') ? 'parent' : 'class12';
        else if (String(flow).includes('class10')) ut = 'parent';
      }
      return {
        userType: ut || localUserType,
        answers: a,
        flow,
        remoteUnified: remote.result_data?.unified || null,
        remoteHeader: remote.result_data?.header || null,
        remoteContext: remote.result_data?.context || null,
        remoteResult: remote.result_data?.result || null,
        source: 'supabase',
        createdAt: remote.created_at,
      };
    }
    return { userType: localUserType, answers: localAnswers, source: 'local', createdAt: localAnswers?.lastSavedAt || null };
  }, [remote, localUserType, localAnswers]);

  const stageUserType = effective.userType === 'graduation' ? 'graduate' : effective.userType;
  const persona = personas[stageUserType];
  const hasProfile = !!effective.userType;
  const answersCount = Object.keys(effective.answers || {}).length;
  const name = onboardingData?.name?.trim();
  const Icon = persona?.icon || Compass;
  const context = hasProfile ? getStudentContext(stageUserType, effective.answers) : null;
  const hasContext = !!(context && (context.stream || context.field || context.selections.length > 0));

  // Real FINAL result — unifiedFromCareerEngine on actual answers (or stored unified)
  const unified = useMemo(() => {
    if (effective.remoteUnified && Array.isArray(effective.remoteUnified) && effective.remoteUnified.length) return effective.remoteUnified;
    if (!hasProfile || answersCount === 0) return [];
    try {
      // Reuse existing engine on REAL answers — never mock data
      const flowKeyForEngine = effective.answers?.flow || (effective.userType === 'class12' ? 'student_class12' : effective.userType === 'graduate' ? 'student_graduation' : effective.userType);
      return unifiedFromCareerEngine(flowKeyForEngine, effective.answers);
    } catch { return []; }
  }, [effective, hasProfile, answersCount]);

  const top = unified[0] || null;

  const steps = [
    { label: 'Tell us who you are', done: !!effective.userType, to: '/get-started' },
    { label: 'Answer the questions', done: answersCount > 0, to: effective.userType ? `/questions/${effective.userType}` : '/get-started' },
    { label: 'See your path', done: !!top, to: effective.userType ? `/recommendations/${effective.userType}` : '/get-started' },
  ];

  const greeting = name
    ? `Good to see you${persona ? ', ' + name : ''}.`
    : 'Good to see you.';

  const nextStep = steps.find((s) => !s.done);

  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : null;
  const isVerified = !!user?.email_confirmed_at;

  return (
    <div className="min-h-screen bg-paper-gradient">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 lg:py-14">
        {/* Profile Header — who is logged in + photo + email + extras */}
        <FadeIn>
          <div className="bg-white border border-line rounded-[1.6rem] p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Avatar */}
              <div className="flex gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-brand-50 border-2 border-brand-100 flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-brand-400" />
                    )}
                  </div>
                  <button onClick={()=>fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-brand border-2 border-white" title="Change photo" aria-label="Change profile photo">
                    <Camera className="w-4 h-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div className="lg:hidden">
                  <button onClick={()=>fileInputRef.current?.click()} className="text-xs font-semibold text-brand-600 hover:text-brand-700">Add / Change photo</button>
                  <p className="text-[0.68rem] text-ink-3">JPG/PNG, max 2MB</p>
                </div>
              </div>

              {/* Name / Gmail / meta */}
              <div className="flex-1 min-w-0">
                {persona && (
                  <span className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1 mb-3" style={{ backgroundColor: persona.accentSoft, color: persona.accentColor }}>
                    <Icon className="w-3.5 h-3.5" /> {persona.title}
                  </span>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input autoFocus value={draftName} onChange={e=>setDraftName(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') handleSaveName(); if(e.key==='Escape') setEditingName(false); }} placeholder="Your name" className="px-3 py-1.5 rounded-lg border border-brand-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-200" />
                      <button onClick={handleSaveName} className="text-xs font-bold bg-brand-600 text-white rounded-full px-3 py-1.5">Save</button>
                      <button onClick={()=>setEditingName(false)} className="text-xs text-ink-3">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <h1 className="font-ui font-bold text-2xl sm:text-3xl text-ink tracking-[-0.03em]">{name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Welcome'}</h1>
                      <button onClick={()=>{ setDraftName(name || ''); setEditingName(true); }} className="w-7 h-7 rounded-full bg-paper border border-line flex items-center justify-center text-ink-3 hover:text-brand-600 hover:border-brand-200" title="Edit name"><Pencil className="w-3.5 h-3.5" /></button>
                    </>
                  )}
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1"><BadgeCheck className="w-3.5 h-3.5" /> Verified</span>
                  )}
                </div>

                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-ink-2"><Mail className="w-3.5 h-3.5 text-ink-3" />{user?.email || 'Not signed in'}</span>
                  {memberSince && <span className="inline-flex items-center gap-1.5 text-ink-3 text-xs"><Calendar className="w-3 h-3" />Member since {memberSince}</span>}
                  {(effective.answers?.lastSavedAt || effective.createdAt) && <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">Last assessment {new Date(effective.answers?.lastSavedAt || effective.createdAt).toLocaleDateString()}</span>}
                </div>

                {/* Education snapshot pills */}
                {hasContext ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-xs font-semibold text-ink-3 mr-1">Snapshot:</span>
                    <span className="text-xs bg-paper border border-line rounded-full px-2.5 py-1">{context.stageLabel}</span>
                    {context.stream && <span className="text-xs bg-paper border border-line rounded-full px-2.5 py-1">{context.stream.emoji} {context.stream.label}</span>}
                    {context.field && <span className="text-xs bg-paper border border-line rounded-full px-2.5 py-1">{context.field.emoji} {context.field.label}</span>}
                    {context.selections.slice(0,3).map(s=>(
                      <span key={s.id} className="text-xs bg-brand-50 border border-brand-100 text-brand-700 rounded-full px-2.5 py-1">{s.emoji} {s.label}</span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-ink-3">Complete your assessment to see your personalized snapshot here.</p>
                )}

                <p className="mt-2 text-xs text-ink-3 hidden lg:block">Add / Change photo · JPG/PNG, max 2MB · Your result stays synced across devices.</p>
              </div>

              {/* Actions: Download PDF + Share + Logout */}
              <div className="flex flex-col gap-2 lg:items-end shrink-0">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={()=>handleDownloadPdf(top, unified)} disabled={!top || pdfDownloading} loading={pdfDownloading} className="bg-brand-600 hover:bg-brand-700">
                    <Download className="w-4 h-4" />
                    {pdfDownloading ? 'Preparing...' : 'Download PDF'}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                    {shareCopied ? 'Copied!' : 'Share'}
                  </Button>
                </div>
                {user?.email ? (
                  <button onClick={handleLogout} className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-3 hover:text-ink mt-1"><LogOut className="w-3.5 h-3.5" /> Log out</button>
                ) : (
                  <Link to="/login" className="text-xs font-semibold text-brand-600 hover:text-brand-700">Sign in to sync →</Link>
                )}
              </div>
            </div>
          </div>

          {/* Sub-greeting */}
          <p className="mt-4 text-sm text-ink-3">
            {hasProfile ? 'Your personal career workspace — built from your latest assessment.' : 'A quiet place to plan your next step.'}
          </p>
        </FadeIn>

        {/* Loading skeleton - existing NAVORA style */}
        {loadingRemote && hasProfile && (
          <FadeIn delay={0.05} className="mt-8">
            <div className="bg-white border border-line rounded-[1.4rem] p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-paper w-32 rounded mb-4" />
              <div className="h-3 bg-paper w-full rounded mb-2" />
              <div className="h-3 bg-paper w-2/3 rounded" />
            </div>
          </FadeIn>
        )}

        {/* Supabase error - clean user-facing, no raw codes */}
        {remoteError && (
          <FadeIn delay={0.05} className="mt-8">
            <div className="bg-amber-50 border border-amber-100 rounded-[1.4rem] p-5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">We couldn&apos;t load your saved result right now</p>
                <p className="text-sm text-amber-800/80 mt-1">Showing what we have on this device. Please check your connection and refresh — your data is safe.</p>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Student context card */}
        {hasContext && (
          <FadeIn delay={0.05} className="mt-8">
            <div className="bg-white border border-line rounded-[1.4rem] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-ink-3 mb-3">Built around your context</p>
                {(effective.answers?.lastSavedAt || effective.createdAt) && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1"
                    title="Your latest saved result"
                  >
                    <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                    Saved {new Date(effective.answers?.lastSavedAt || effective.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    {effective.source === 'supabase' && <span className="text-emerald-600"> · Synced</span>}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink bg-paper border border-line rounded-full px-3 py-1.5">
                  {context.stageLabel}
                </span>
                {context.stream && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 bg-paper border border-line rounded-full px-3 py-1.5">
                    <span aria-hidden="true">{context.stream.emoji}</span>
                    {context.stream.label}
                  </span>
                )}
                {context.field && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 bg-paper border border-line rounded-full px-3 py-1.5">
                    <span aria-hidden="true">{context.field.emoji}</span>
                    {context.field.label}
                  </span>
                )}
                {context.selections.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1.5">
                    <span aria-hidden="true">{s.emoji}</span>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Your NAVORA Result - real data from FINAL assessment, not mock */}
        {hasProfile && top ? (
          <FadeIn delay={0.08} className="mt-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              <p className="eyebrow text-brand-600">Your NAVORA Result</p>
            </div>
            <div className="bg-brand-950 text-white rounded-[1.6rem] p-8 sm:p-9 relative overflow-hidden shadow-card-lg">
              <div className="absolute inset-0 bg-mesh-dark opacity-90" />
              <Swoosh variant="dark" />
              <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-brand-600/35 blur-3xl" />
              <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-purple/20 blur-3xl" />
              <div className="relative">
                {/* Fit Score + Best-fit */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-cyan-300 glow-dot" />
                      <p className="eyebrow text-white/60">Best-fit direction</p>
                      {top.score != null && (
                        <span className="ml-2 inline-flex items-center gap-1.5 text-xs font-bold bg-white text-brand-950 rounded-full px-3 py-1">
                          <Sparkles className="w-3 h-3 text-brand-600" />
                          {top.score} Fit Score · {top.band || top.level}
                        </span>
                      )}
                    </div>
                    <h2 className="font-ui font-bold text-3xl sm:text-4xl tracking-[-0.02em]">
                      {top.title}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-cyan-200">{top.career?.category || ''}</p>
                    <p className="mt-3 text-white/75 leading-relaxed max-w-xl text-[0.95rem]">
                      {top.career?.description || ''}
                    </p>
                  </div>
                  <div className="lg:w-80 w-full shrink-0">
                    <div className="bg-white/[0.07] border border-white/10 rounded-[1.3rem] p-6 backdrop-blur-sm">
                      <p className="eyebrow text-cyan-300 mb-2 flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Recommended degree / course</p>
                      <p className="text-white font-semibold leading-relaxed">{top.degree?.full || top.degree?.short || '—'}</p>
                      {top.exams?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Relevant exams</p>
                          <div className="flex flex-wrap gap-1.5">
                            {top.exams.slice(0,3).map(e => (
                              <span key={e.name} className="text-xs font-medium bg-white/10 border border-white/10 text-white rounded-full px-2.5 py-1">{e.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Why it fits / Skills / Alternatives / Next action - white cards inside same section for hierarchy */}
                <div className="relative mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-[1.2rem] p-5 border border-line">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Why it fits</p>
                    <ul className="space-y-1.5">
                      {(top.whyMatches || []).slice(0,3).map((w,i) => (
                        <li key={i} className="text-sm text-ink-2 leading-relaxed flex gap-2"><span className="text-brand-500 mt-1">•</span><span>{w}</span></li>
                      ))}
                      {(!top.whyMatches || top.whyMatches.length===0) && <li className="text-sm text-ink-3">Based on your stream, interests and strengths.</li>}
                    </ul>
                  </div>
                  <div className="bg-white rounded-[1.2rem] p-5 border border-line">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Skills to develop</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(top.foundations?.length ? top.foundations : (top.career?.skillsToDevelop || []).slice(0,3)).map(s => (
                        <span key={s} className="text-xs font-medium bg-brand-50 border border-brand-100 text-brand-700 rounded-full px-2.5 py-1">{s}</span>
                      ))}
                      {(!top.foundations || top.foundations.length===0) && (!top.career?.skillsToDevelop || top.career.skillsToDevelop.length===0) && <span className="text-xs text-ink-3">Explore after you start.</span>}
                    </div>
                    {(top.considerations?.length>0) && (
                      <p className="mt-3 text-xs text-ink-3 leading-relaxed">{top.considerations[0]}</p>
                    )}
                  </div>
                  <div className="bg-white rounded-[1.2rem] p-5 border border-line sm:col-span-2 lg:col-span-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5" /> Alternative paths</p>
                    <ul className="space-y-1.5">
                      {unified.slice(1,4).map(a => (
                        <li key={a.career.id} className="text-sm text-ink-2 flex gap-2"><span className="text-ink-3">•</span><span><span className="font-semibold text-ink">{a.title}</span> <span className="text-ink-3">· {a.band}</span></span></li>
                      ))}
                      {unified.length<=1 && <li className="text-sm text-ink-3">Your top direction is clear — explore it first.</li>}
                    </ul>
                  </div>
                </div>

                {/* Relevant next action + AI CTA inside result */}
                <div className="relative mt-6 flex flex-col sm:flex-row gap-3">
                  <Link to="/advisor" className="flex-1">
                    <Button className="bg-brand-500 text-white hover:bg-brand-600 shadow-brand" fullWidth>
                      <MessageCircle className="w-4 h-4" />
                      Talk to AI Advisor — knows your profile
                    </Button>
                  </Link>
                  <Link to={effective.answers?.flow ? `/assessment` : '/get-started'} className="flex-1 sm:flex-initial">
                    <Button variant="glass" fullWidth>
                      Explore courses
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <p className="relative mt-3 text-xs text-white/50 text-center">Your final assessment result — newest result is always shown here. Retaking updates this workspace.</p>
              </div>
            </div>
          </FadeIn>
        ) : hasProfile && !loadingRemote ? (
          /* Empty state - no completed assessment yet (NAVORA style) */
          <FadeIn delay={0.08} className="mt-10">
            <div className="bg-white border border-line rounded-[1.6rem] p-8 sm:p-10 text-center shadow-sm">
              <span className="inline-flex w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 items-center justify-center mb-5">
                <Compass className="w-7 h-7" strokeWidth={1.75} />
              </span>
              <h2 className="font-ui font-bold text-2xl sm:text-3xl text-ink tracking-[-0.03em]">Your career direction starts here.</h2>
              <p className="mt-3 text-ink-2 leading-relaxed max-w-xl mx-auto">Complete your assessment to see your NAVORA Fit Score, best-fit direction and personalized next steps — right here on your dashboard.</p>
              <Link to="/get-started" className="inline-block mt-6">
                <Button size="lg" shine>
                  Start Your Assessment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        ) : null}

        {/* Actions - only show when has result; keeps existing design system */}
        {top && (
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            <FadeIn delay={0.15}>
              <Link to={effective.userType ? `/recommendations/${effective.userType}` : '/get-started'} className="block group h-full">
                <div className="h-full bg-white border border-line rounded-[1.4rem] p-6 card-lift group-hover:border-brand-200">
                  <span className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white items-center justify-center mb-4 shadow-brand">
                    <Compass className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-ui font-semibold text-ink">Your path</h3>
                  <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">
                    Revisit your recommendation and the reasoning behind it.
                  </p>
                </div>
              </Link>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link to="/compare" className="block group h-full">
                <div className="h-full bg-white border border-line rounded-[1.4rem] p-6 card-lift group-hover:border-brand-200">
                  <span className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white items-center justify-center mb-4 shadow-brand">
                    <Scale className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-ui font-semibold text-ink">
                    Compare
                    {comparisonItems.length > 0 && (
                      <span className="ml-2 text-xs font-semibold text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">
                        {comparisonItems.length}
                      </span>
                    )}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">
                    Weigh the options you&rsquo;re torn between, side by side.
                  </p>
                </div>
              </Link>
            </FadeIn>
            <FadeIn delay={0.25}>
              <Link to="/advisor" className="block group h-full">
                <div className="h-full bg-white border border-line rounded-[1.4rem] p-6 card-lift group-hover:border-brand-200">
                  <span className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-purple to-cyan text-white items-center justify-center mb-4 shadow-brand">
                    <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-ui font-semibold text-ink">Ask the advisor</h3>
                  <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">
                    Get follow-up answers in plain language — already knows your profile.
                  </p>
                </div>
              </Link>
            </FadeIn>
          </div>
        )}

        {/* If no profile, gentle nudge */}
        {!hasProfile && (
          <FadeIn delay={0.3} className="mt-10">
            <div className="bg-brand-950 text-white rounded-[1.6rem] p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5 relative overflow-hidden shadow-card-lg">
              <div className="absolute inset-0 bg-mesh-dark opacity-80" />
              <Swoosh variant="dark" />
              <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-brand-600/30 blur-3xl" />
              <span className="relative inline-flex w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center shrink-0 shadow-brand">
                <Clock className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <div className="relative flex-1">
                <h3 className="font-ui font-semibold text-lg">About two minutes to a clear path</h3>
                <p className="mt-1 text-sm text-white/70 leading-relaxed">
                  Answer a few honest questions and see your options compared and explained.
                </p>
              </div>
              <Link to="/get-started" className="relative shrink-0">
                <Button className="bg-white text-ink hover:bg-brand-50">
                  Start
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        )}

        {/* AI Career Advisor — one-shot plan + follow-up chat, grounded in the
            user's saved answers for their profile. Only when a profile exists.
            Now uses Supabase single source of truth — same context as Dashboard. */}
        {hasProfile && top && (
          <FadeIn delay={0.25} className="mt-10">
            <AICareerAdvisor userType={stageUserType} answersOverride={effective.answers} />
          </FadeIn>
        )}

        {/* Reset */}
        {hasProfile && (
          <FadeIn delay={0.3} className="mt-10 text-center">
            <Link
              to="/get-started"
              className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start over with a fresh assessment
            </Link>
          </FadeIn>
        )}
      </div>
    </div>
  );
}