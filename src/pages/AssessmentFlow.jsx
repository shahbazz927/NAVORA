import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkle, Scale, Compass, Lightbulb, Clock, Eye, X, ExternalLink } from 'lucide-react';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import { buildStudentProfile, scoreCareers, diversify, getPrimaryDirection, buildWhyBullets, buildPersonalizedReason } from '../data/careerEngine';
import { ResultsLayout, RecommendationCard, CompareView } from '../components/results';
import { headerFor, contextFor, nextStepsForResult, unifiedFromCareerEngine, sidebarExamsFrom } from '../data/resultsAdapters';
import {
  PARENT_STAGE_HEADING,
  PARENT_STAGE_SUPPORT,
  PARENT_STAGE_OPTIONS,
  FLOWS,
  GRADUATION_FAMILIES,
  degreesForFamily,
  degreeHasSpecializations,
  specOptions,
  resolveProfile,
  gradDirectionForFamily,
  CLASS12_STREAMS,
  CLASS12_STREAM_DIRECTIONS,
  resolveStreamId,
  CLASS12_SUBJECTS,
  CLASS12_WORK_AREAS,
  attractOptionsFor,
  skillsFor,
  CLASS12_PRIORITIES,
  CLASS12_STREAM_HEADING,
  CLASS12_SUBJECTS_HEADING,
  CLASS12_THINK_HEADING,
  CLASS12_WORK_HEADING,
  CLASS12_ATTRACT_HEADING,
  CLASS12_SKILLS_HEADING,
  CLASS12_PRIORITY_HEADING,
  PARENT_CLASS12_STREAM_HEADING,
  PARENT_CLASS12_SUBJECTS_HEADING,
  PARENT_CLASS12_THINK_HEADING,
  PARENT_CLASS12_WORK_HEADING,
  PARENT_CLASS12_ATTRACT_HEADING,
  PARENT_CLASS12_PRIORITY_HEADING,
  PARENT_CLASS12_CLARITY_HEADING,
  PARENT_CLASS12_CLARITY,
  PARENT_CLASS10_HEADINGS,
  PARENT_CLASS10_ENJOY,
  PARENT_CLASS10_STRONGEST,
  PARENT_CLASS10_LEARNING_STYLE,
  PARENT_CLASS10_INTERESTS,
  PARENT_CLASS10_DIRECTION,
  PARENT_CLASS10_DIRECTION_DETAIL,
  PARENT_CLASS10_PATHWAY,
  PARENT_CLASS10_PRIORITY,
  buildParentClass10Steps,
  buildGraduationResult,
  buildClass12Result,
  buildParentClass10Result,
} from '../data/assessmentConfig';
import { saveAssessmentResult } from '../lib/assessmentResults';

// ── Centralized branching mechanism ───────────────────────────
// Stream is the single source of truth — once chosen it locks the entire
// downstream pool. This helper replaces scattered conditionals.
export function getNextQuestion({ stream, previousAnswers, currentQuestion, profile }) {
  const sid = (stream || '').toLowerCase();
  const answered = new Set(Object.keys(previousAnswers || {}));
  if (profile?.degree && !answered.has('degree')) return 'degree';
  // stream-lock: only return questions whose pool matches sid
  const pool = CLASS12_STREAMS.map(s=>s.value);
  if (sid && !pool.includes(sid) && sid !== 'not_sure') return currentQuestion;
  return currentQuestion;
}

// ── Flow definitions ─────────────────────────────────────────
const STEPS_BY_FLOW = {
  student_class12: ['stream', 'subjects', 'interest', 'work', 'attract', 'skills', 'priority'],
  parent_class12: ['stream', 'subjects', 'interest', 'work', 'attract', 'priority', 'clarity'],
  parent_class10: ['enjoy', 'strongest', 'learningStyle', 'interests', 'direction', 'pathway', 'priority'],
  student_graduation: ['family', 'degree', 'interests', 'skills', 'direction'],
  parent_graduation: ['family', 'degree', 'interests', 'skills', 'direction'],
};

const isMultiKey = (k) => k === 'skills' || k === 'interests' || k === 'enjoy' || k === 'strongest' || k === 'subjects';

// Wide option grids get two columns; long-label lists stay single-column.
const multiGridCols = (k) => (k === 'family' || k === 'degree' ? '' : 'sm:grid-cols-2');

const MAX_PICKS = { skills: 4, interests: 3, enjoy: 3, strongest: 3, subjects: 3 };
// Graduation flow deliberately narrows the focus: max 2 interests and 2 skills.
const GRAD_MAX_PICKS = { skills: 2, interests: 2 };

const PARENT_PRIORITIES = [
  'Good career opportunities',
  'Good earning potential',
  'Job stability',
  "My child's interest",
  'Higher studies',
  'Government career',
  'Opportunities abroad',
  'Entrepreneurship',
  'I want help understanding my child’s options',
];

// Occasional conversational bridges — deliberately sparse, never robotic.
const TRANSITIONS = {
  student_class12: { 1: 'That’s helpful.', 4: 'One last thing we’d like to understand.' },
  parent_class12: { 1: 'That gives us a clearer picture.', 4: 'One last thing.' },
  parent_class10: { 2: 'Let’s understand that a little better.', 4: 'Almost done.' },
  student_graduation: { 2: 'Got it. Now we can make this more specific.', 4: 'One last thing we’d like to understand.' },
  parent_graduation: { 2: 'Got it.', 4: 'One last thing.' },
};

const strOpts = (arr) => (arr || []).map((s) => ({ value: s, label: s }));
// ── Small presentational pieces ──────────────────────────────

function Chip({ children, tone = 'light' }) {
  const tones = {
    light: 'bg-white text-ink-2 border-line',
    good: 'bg-brand-50 text-brand-700 border-brand-200',
    strong: 'bg-brand-600 text-white border-brand-600',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.85rem] font-medium leading-none ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-8">
      <h3 className="eyebrow text-ink-3 mb-3 tracking-[0.14em]">{title}</h3>
      {children}
    </div>
  );
}

function OptionCard({ label, selected, onClick, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative w-full min-h-[3.75rem] text-left rounded-2xl border px-4 pr-12 py-4 flex items-center transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
        selected
          ? 'border-brand-300 bg-brand-50 text-brand-800 shadow-sm'
          : 'border-line bg-white hover:border-brand-200 hover:bg-brand-50/40 hover:shadow-sm'
      }`}
    >
      <span className={`font-medium leading-snug pr-1 ${compact ? 'text-[0.92rem]' : 'text-[0.95rem]'} ${selected ? 'text-brand-800' : 'text-ink'}`}>
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center shrink-0 rounded-full transition-all duration-200 ${
          compact ? 'w-5 h-5' : 'w-6 h-6'
        } ${selected ? 'bg-brand-600 text-white shadow-sm' : 'border-[1.5px] border-line-strong bg-white group-hover:border-brand-300'}`}
      >
        {selected && <Check className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} strokeWidth={3} />}
      </span>
    </button>
  );
}

function SkillGroup({ group, skills, selected, onToggle }) {
  const selectedCount = skills.filter((s) => selected.includes(s.value)).length;
  return (
    <div className="bg-white border border-line rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <p className="text-[0.75rem] font-bold tracking-[0.14em] uppercase text-ink-3">{group}</p>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums shrink-0 ${
            selectedCount > 0 ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-paper text-ink-3 border-line'
          }`}
        >
          {selectedCount} selected
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" data-testid="skill-chip-list">
        {skills.map((s) => {
          const active = selected.includes(s.value);
          return (
            <button
              key={s.value}
              type="button"
              data-testid="skill-chip"
              aria-pressed={active}
              onClick={() => onToggle(s.value)}
              className={`group flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border-2 text-[0.9rem] font-medium leading-snug transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 ${
                active
                  ? 'bg-brand-500 text-white border-brand-500 shadow-brand'
                  : 'bg-surface text-ink border-line hover:border-brand-200 hover:shadow-sm hover:bg-white'
              }`}
            >
              <span
                className={`w-5 h-5 shrink-0 flex items-center justify-center rounded-md border-2 transition-colors ${
                  active ? 'bg-white border-white' : 'bg-white border-line-strong group-hover:border-brand-300'
                }`}
                aria-hidden="true"
              >
                {active && <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: '#2563eb' }} />}
              </span>
              <span className={active ? 'text-white' : 'text-ink'}>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
// ── Main component ───────────────────────────────────────────

export default function AssessmentFlow() {
  useScrollTop();
  const navigate = useNavigate();
  const { userType, answers: savedContextAnswers, setAnswers: saveAnswers } = useUser();

  const [parentStage, setParentStage] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const flowKey = userType === 'class12' ? 'student_class12'
    : userType === 'graduation' ? 'student_graduation'
    : userType === 'parent' && parentStage ? `parent_${parentStage}`
    : null;

  const steps = useMemo(() => {
    if (!flowKey) return [];
    if (flowKey === 'parent_class10') return buildParentClass10Steps(answers);
    return STEPS_BY_FLOW[flowKey] || [];
  }, [flowKey, answers.stream, answers.direction, answers.directionDetail]);
  const total = steps.length;
  const currentKey = steps[step];
  const speaksParent = Boolean(flowKey && FLOWS[flowKey]?.speaks === 'parent');
  const flowMeta = flowKey ? FLOWS[flowKey] : null;

  // Graduation flow narrows the focus to max 2 picks for interests/skills.
  const isGraduationFlow = Boolean(flowKey && flowKey.endsWith('graduation'));
  const isClass10Flow = Boolean(flowKey && flowKey === 'parent_class10');
  const maxPicksFor = (key) => (isGraduationFlow && GRAD_MAX_PICKS[key]) || MAX_PICKS[key];

  // Direct visits without a chosen type go back to the entry screen.
  useEffect(() => {
    if (!userType) navigate('/get-started', { replace: true });
  }, [userType, navigate]);

  // Changing journey resets everything downstream of it.
  useEffect(() => {
    setStep(0);
    // Reuse valid prior answers for same flow — don't re-ask what we already know
    if (savedContextAnswers?.flow === flowKey && Object.keys(savedContextAnswers).length > 1) {
      const { flow, lastSavedAt, ...rest } = savedContextAnswers;
      setAnswers(rest);
    } else {
      setAnswers({});
    }
    setShowResult(false);
  }, [flowKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, showResult]);

  const gradProfile = useMemo(() => {
    if (!flowKey || !flowKey.endsWith('graduation') || !answers.degree) return null;
    return resolveProfile(answers.degree, answers.specialization || answers.degree);
  }, [flowKey, answers.degree, answers.specialization]);

  // Question 2 has an inline second phase when the degree needs a specialization.
  const specPhase =
    currentKey === 'degree' &&
    Boolean(answers.degree) &&
    degreeHasSpecializations(answers.degree);
  const specPending = specPhase && !answers.specialization;

  /* ── Answer mutations (with dependent-field cleanup) ──────── */

  const orderIndex = (k) => {
    const i = steps.indexOf(k);
    if (i !== -1) return i;
    if (k === 'specialization') return steps.indexOf('degree'); // shares slot 2
    return -1;
  };

  const commitCleaned = (key, value) => {
    if (value === undefined || value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
      // Answer cleared — drop it and everything after it.
      setAnswers((prev) => {
        const next = {};
        const cutoff = orderIndex(key);
        for (const [k, v] of Object.entries(prev)) {
          if (orderIndex(k) < cutoff) next[k] = v;
        }
        return next;
      });
      return;
    }
    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      const cutoff = orderIndex(key);
      for (const k of Object.keys(next)) {
        if (k !== key && orderIndex(k) > cutoff) delete next[k];
      }
      return next;
    });
  };

  const handleSingle = (key, value) => {
    setAnswers((prev) => {
      if (prev[key] === value) return prev;
      const next = { ...prev, [key]: value };
      // A new family invalidates the chosen degree and its specialization.
      if (key === 'family') {
        delete next.degree;
        delete next.specialization;
      }
      // Re-derive the specialization whenever the degree changes so a stale
      // one (from a previously chosen degree) can never contaminate the result.
      if (key === 'degree') {
        if (degreeHasSpecializations(value)) delete next.specialization;
        else next.specialization = value;
      }
      const cutoff = orderIndex(key);
      for (const k of Object.keys(next)) {
        if (k !== key && orderIndex(k) > cutoff) delete next[k];
      }
      return next;
    });
  };

  const handleMulti = (key, value) => {
    setAnswers((prev) => {
      const cur = prev[key] || [];
      let nextArr;
      if (cur.includes(value)) nextArr = cur.filter((v) => v !== value);
      else nextArr = [...cur, value].slice(-maxPicksFor(key));
      // Multi answers keep sibling answers; only later-step answers survive,
      // stale entries further down are dropped so results stay coherent.
      const next = { ...prev, [key]: nextArr };
      const cutoff = orderIndex(key);
      for (const k of Object.keys(next)) {
        if (k !== key && orderIndex(k) >= cutoff + 1) delete next[k];
      }
      return next;
    });
  };
  /* ── Prompts & options ────────────────────────────────────── */

  const promptFor = (k) => {
    if (flowKey === 'parent_class10') {
      const subs = {
        enjoy: 'Choose up to 3 subjects your child enjoys. Select what they naturally gravitate toward, not what they score highest in.',
        strongest: 'Choose up to 3. Think about where they feel comfortable, not just marks.',
        interests: 'Choose up to 3 areas that naturally attract their attention — not jobs, just curiosities.',
        directionDetail: 'Select the stream/pathway they are currently considering, if any.',
      };
      return { text: PARENT_CLASS10_HEADINGS[k] || '', sub: subs[k] || '' };
    }
    if (flowKey === 'student_class12') {
      const texts = {
        stream: CLASS12_STREAM_HEADING,
        subjects: CLASS12_SUBJECTS_HEADING,
        interest: CLASS12_THINK_HEADING,
        work: CLASS12_WORK_HEADING,
        attract: answers.interest && answers.interest !== 'Still exploring'
          ? `What attracts you most about ${answers.interest}?`
          : CLASS12_ATTRACT_HEADING,
        skills: CLASS12_SKILLS_HEADING,
        priority: CLASS12_PRIORITY_HEADING,
      };
      return { text: texts[k] || '', sub: '' };
    }
    if (flowKey === 'parent_class12') {
      const texts = {
        stream: PARENT_CLASS12_STREAM_HEADING,
        subjects: PARENT_CLASS12_SUBJECTS_HEADING,
        interest: PARENT_CLASS12_THINK_HEADING,
        work: PARENT_CLASS12_WORK_HEADING,
        attract: answers.interest && answers.interest !== 'Still exploring'
          ? `What seems to attract your child most about ${answers.interest}?`
          : PARENT_CLASS12_ATTRACT_HEADING,
        priority: PARENT_CLASS12_PRIORITY_HEADING,
        clarity: PARENT_CLASS12_CLARITY_HEADING,
      };
      return { text: texts[k] || '', sub: '' };
    }
    // Graduation flows share their structure, wording differs by audience.
    const p = speaksParent
      ? {
          family: 'Got it. Your child is already in graduation. What are they studying?',
          familySub: 'Pick the broad field first — we’ll narrow it down together.',
          degree: 'What degree are they pursuing?',
          degreeSub: 'Only degrees within this field are shown.',
          interests: 'Which area of their field seems to interest them most?',
          interestsSub: 'Pick up to 2 areas that seem to interest your child.',
          skills: 'What would you say your child is already good at?',
          skillsSub: 'Think about what your child has developed through classes, projects or practice.',
          direction: 'After graduation, what would you ideally like to see your child doing?',
        }
      : {
          family: 'What are you currently studying?',
          familySub: 'Pick the broad field first — we’ll narrow it down together.',
          degree: 'What degree are you pursuing?',
          degreeSub: 'Only degrees within your chosen field are shown.',
          interests: 'Now that we know what you’re studying, which part of your field interests you most?',
          interestsSub: 'Pick up to 2 areas that genuinely interest you.',
          skills: 'What would you say you’re already good at?',
          skillsSub: 'Think about what you’ve developed through classes, projects, internships or personal work.',
          direction: 'After graduation, what direction are you considering?',
        };
    if (k === 'family') return { text: p.family, sub: p.familySub };
    if (k === 'degree') return { text: p.degree, sub: p.degreeSub };
    if (k === 'interests') return { text: p.interests, sub: p.interestsSub };
    if (k === 'skills') return { text: p.skills, sub: p.skillsSub };
    if (k === 'direction') return { text: p.direction, sub: '' };
    return { text: '', sub: '' };
  };

  const getOptions = (k) => {
    switch (k) {
      case 'stream':
        return CLASS12_STREAMS.map((s) => ({ value: s.value ?? s.label, label: s.label }));
      case 'subjects': {
        const sid = resolveStreamId(answers.stream);
        return strOpts((CLASS12_SUBJECTS[sid] || CLASS12_SUBJECTS.other));
      }
      case 'interest': {
        const dirs = CLASS12_STREAM_DIRECTIONS[resolveStreamId(answers.stream)] || [];
        return strOpts(dirs);
      }
      case 'work': {
        const sid = resolveStreamId(answers.stream);
        return strOpts(CLASS12_WORK_AREAS[sid] || CLASS12_WORK_AREAS.other);
      }
      case 'attract': {
        const sid = resolveStreamId(answers.stream);
        return strOpts(attractOptionsFor(sid, answers.interest));
      }
      case 'skills': {
        if (flowKey === 'student_class12') {
          return strOpts(skillsFor(resolveStreamId(answers.stream), answers.interest)); // stream + direction aware
        }
        if (flowKey === 'parent_class12') return null; // unused step in this flow
        return null; // graduation skills rendered separately (grouped)
      }
      case 'priority':
        if (flowKey === 'parent_class10') return strOpts(PARENT_CLASS10_PRIORITY);
        return strOpts(speaksParent ? PARENT_PRIORITIES : CLASS12_PRIORITIES);
      case 'clarity':
        return strOpts(flowKey === 'parent_class10' ? PARENT_CLASS10_CLARITY : PARENT_CLASS12_CLARITY);
      case 'enjoy':
        return strOpts(PARENT_CLASS10_ENJOY);
      case 'strongest':
        return strOpts(PARENT_CLASS10_STRONGEST);
      case 'learningStyle':
        return strOpts(PARENT_CLASS10_LEARNING_STYLE);
      case 'interests':
        if (flowKey === 'parent_class10') return strOpts(PARENT_CLASS10_INTERESTS);
        return (gradProfile?.interests || []);
      case 'direction':
        if (flowKey === 'parent_class10') return strOpts(PARENT_CLASS10_DIRECTION);
        return gradDirectionForFamily(answers.family || '');
      case 'directionDetail':
        return strOpts(PARENT_CLASS10_DIRECTION_DETAIL);
      case 'pathway':
        return strOpts(PARENT_CLASS10_PATHWAY);
      case 'future':
        return strOpts(PARENT_CLASS10_FUTURE);
      case 'family':
        return strOpts(GRADUATION_FAMILIES);
      case 'degree':
        return degreesForFamily(answers.family || '').map((d) => ({ value: d.label, label: d.label }));
      case 'specialization':
        return specOptions(answers.degree || '');
      default:
        return [];
    }
  };
  /* ── Validation & navigation ─────────────────────────────── */

  const canContinue = (() => {
    if (!currentKey || showResult) return false;
    if (specPending) return false; // need a specialization before moving on
    const v = answers[currentKey];
    if (isMultiKey(currentKey)) return Array.isArray(v) && v.length > 0;
    return Boolean(v);
  })();

  const handleNext = () => {
    if (!canContinue) return;
    if (step === total - 1) {
      try {
        saveAnswers({ flow: flowKey, ...answers });
      } catch {
        /* persistence is best-effort */
      }
      setShowResult(true);
      return;
    }
    setStep((s) => Math.min(total - 1, s + 1));
  };

  const handleBack = () => {
    setShowResult(false);
    // Inside the specialization phase of question 2 → back to the degree list
    // (keeps family/degree-level context, drops the unconfirmed degree choice).
    if (specPending) {
      commitCleaned('degree', '');
      return;
    }
    if (specPhase && answers.specialization) {
      commitCleaned('specialization', '');
      return;
    }
    if (step === 0) {
      navigate('/get-started');
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const retakeFlow = () => {
    setShowResult(false);
    setStep(0);
    setAnswers({});
    setCompareIds([]);
    setDetailId(null);
  };

  const startOverAll = () => {
    setShowResult(false);
    setStep(0);
    setAnswers({});
    setParentStage(null);
    setCompareIds([]);
    setDetailId(null);
    navigate('/get-started');
  };

  /* ── Results ──────────────────────────────────────────────── */

  const [compareIds, setCompareIds] = useState([]);
  const [detailId, setDetailId] = useState(null);

  const result = useMemo(() => {
    if (!showResult || !flowKey) return null;
    if (flowKey.endsWith('graduation')) return buildGraduationResult(answers, speaksParent);
    if (flowKey.endsWith('class12')) return buildClass12Result(answers, flowKey === 'parent_class12');
    if (flowKey === 'parent_class10') return buildParentClass10Result(answers);
    return null;
  }, [showResult, flowKey, answers, speaksParent]);

  const careerEngine = useMemo(() => {
    if (!showResult || !flowKey) return null;
    if (flowKey === 'parent_class10') return null; // stage-aware: Class 10 Parent must NOT use career/job engine
    const profile = buildStudentProfile(answers, flowKey);
    const scored = scoreCareers(profile);
    const ranked = diversify(scored, 4);
    const primary = getPrimaryDirection(ranked, profile);
    // Only surface genuinely relevant options — never show a "Lower Match" card
    const exploreMore = scored.filter((s) => s.score >= 50 && !ranked.some((r) => r.career.id === s.career.id)).slice(0, 4);
    return { profile, scored, ranked, primary, exploreMore };
  }, [showResult, flowKey, answers]);

  const gradExperiences = useMemo(
    () => ((gradProfile?.experiences || []).slice(0, 4)).map((e) => e.label),
    [gradProfile],
  );

  const toggleCompare = (id) => {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev));
  };

  /* ── Render: parent stage chooser ─────────────────────────── */

  if (!userType) return null;

  if (!flowKey) {
    return (
      <div className="min-h-screen bg-paper-gradient">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 lg:py-24">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="inline-flex items-center gap-2 eyebrow text-brand-600 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 glow-dot" />
              Parent Guidance
            </p>
            <h1 className="font-ui font-bold text-4xl sm:text-5xl text-ink tracking-[-0.02em] text-balance">
              {PARENT_STAGE_HEADING}
            </h1>
            <p className="mt-6 text-lg text-ink-2 leading-relaxed">{PARENT_STAGE_SUPPORT}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 lg:gap-6">
            {PARENT_STAGE_OPTIONS.map((opt, i) => (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => setParentStage(opt.value)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985 }}
                className="group w-full text-left bg-white border border-line rounded-2xl p-7 sm:p-8 hover:shadow-card hover:border-brand-200 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-xl" aria-hidden="true">{opt.emoji}</span>
                <h2 className="mt-5 font-ui font-bold text-[1.35rem] text-ink leading-tight tracking-[-0.015em]">{opt.title}</h2>
                <p className="mt-2.5 text-[0.9rem] text-ink-2 leading-relaxed">{opt.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-ink-3 group-hover:text-brand-700 transition-colors">
                  Continue
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </motion.button>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={startOverAll}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to guidance types
            </button>
          </div>
        </div>
      </div>
    );
  }
function UnifiedResults({ flowKey, answers, result, unified, header, context, onBack, onRetake, onSaveDashboard, compareIds, setCompareIds, detailId, setDetailId }){
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState('');
  const [openId, setOpenId] = useState(null);
  const [stepsChecked, setStepsChecked] = useState({});
  const [compareOpen, setCompareOpen] = useState(false);
  const counts = { All: unified.length, 'Strong match': unified.filter(u=>u.level==='Strong match').length, 'Good match': unified.filter(u=>u.level==='Good match').length, 'Worth exploring': unified.filter(u=>u.level==='Worth exploring').length };
  const visible = filter==='All' ? unified : unified.filter(u=>u.level===filter);
  const primaryCareer = unified[0]?.career || null;
  const exams = sidebarExamsFrom(unified);
  const steps = nextStepsForResult(flowKey, primaryCareer, null);
  const toggleCompare = (career)=> {
    const id = career.id;
    if(compareIds.includes(id)){ setCompareIds(compareIds.filter(x=>x!==id)); return; }
    if(compareIds.length>=3){ setToast('You can compare up to 3 options at a time.'); setTimeout(()=>setToast(''),2600); return; }
    setCompareIds([...compareIds, id]);
  };
  const compareItems = compareIds.map(id=> unified.find(u=>u.career.id===id)).filter(Boolean);
  const rows = [['Fit Score', r=> String(r.score)+' / 100'], ['Degree', r=> r.degree.short], ['Entrance exams', r=> r.exams.map(e=>e.name).join(' \u00b7 ')], ['Skills', r=> (r.career.skillsToDevelop||[]).slice(0,3).join(', ')], ['Why it matches', r=> (r.whyMatches[0]||'-')], ['Considerations', r=> (r.considerations[0]||'-')]];
  useEffect(()=>{ if(!toast) return; const tt=setTimeout(()=>setToast(''),2600); return()=>clearTimeout(tt); },[toast]);
  return (
    <ResultsLayout
      onBack={onBack} header={header} context={context}
      filters={['All','Strong match','Good match','Worth exploring']} counts={counts} activeFilter={filter} onFilter={setFilter}
      compareCount={compareIds.length} onCompare={()=> setCompareOpen(true)} onClearCompare={()=> setCompareIds([])}
      items={visible} renderCard={(item)=> (
        <RecommendationCard key={item.career.id} item={item} rank={unified.indexOf(item)} compared={compareIds.includes(item.career.id)} cantAdd={compareIds.length>=3} onToggleCompare={()=> toggleCompare(item.career)} open={openId===item.career.id} onToggleDetail={()=> setOpenId(openId===item.career.id? null: item.career.id)} onSave={()=> { setToast('Saved \u2713'); }} />
      )}
      sidebarExams={exams}
      sidebarNextColleges={<section className="rounded-[14px] p-5 text-white shadow-card" style={{background:'linear-gradient(135deg,#0f1f4d,#0a1638)'}}><h2 className="flex items-center gap-2 text-[0.72rem] font-bold uppercase text-white/70">Next: colleges</h2><p className="mt-2 text-sm text-white/85">Shortlist colleges for the recommended degree with eligibility and fees.</p><div className="mt-4"><Button size="md" className="w-full" onClick={onSaveDashboard}>View colleges</Button></div></section>}
      nextSteps={steps} stepsChecked={stepsChecked} onToggleStep={(k)=> setStepsChecked(s=> ({...s, [k]: !s[k]}))}
      onRetake={onRetake} onSave={onSaveDashboard} toast={toast} setToast={setToast}
      compareOpen={compareOpen} setCompareOpen={setCompareOpen} compareItems={compareItems.length? compareItems: unified.slice(0,3)} compareRows={rows}
    />
  );
}

function EducationDirectionCard({ item, rank, compared, cantAdd, onToggleCompare, open, onToggleDetail }) {
  const isFirst = rank === 0;
  return (
    <article className={`bg-white border rounded-[14px] p-5 sm:p-6 ${isFirst ? 'border-[#c9d6ff] shadow-card' : 'border-line shadow-card'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${item.level === 'Strong fit' ? 'bg-brand-50 text-brand-700 border-brand-200' : item.level === 'Good option' ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-paper text-ink-3 border-line'}`}>
              {item.level}
            </span>
            {isFirst && <span className="inline-flex items-center rounded-full bg-brand-600 text-white px-2.5 py-1 text-xs font-semibold">Top suggestion</span>}
          </div>
          <h3 id={`edu-t-${item.id}`} className="mt-3 font-ui font-bold text-[1.15rem] sm:text-[1.25rem] text-ink leading-tight">{item.title}</h3>
          <p className="mt-1 text-sm text-ink-2 leading-relaxed">{item.detail}</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-medium text-ink-3 shrink-0 cursor-pointer">
          <input type="checkbox" checked={compared} disabled={cantAdd && !compared} onChange={onToggleCompare} className="w-4 h-4 rounded border-line text-brand-600 focus:ring-brand-500" />
          Compare
        </label>
      </div>
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1">Why this fits</p>
          <ul className="space-y-1">
            {(item.whyMatches || []).slice(0, 2).map((w, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-2 leading-relaxed"><span className="mt-1.5 w-1 h-1 rounded-full bg-brand-500 shrink-0" />{w}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-paper border border-line p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1">What this keeps open</p>
          <p className="text-sm text-ink-2 leading-relaxed">{item.keepsOpen}</p>
        </div>
        {open && (
          <div className="rounded-xl border border-line bg-paper p-3 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-3">What to check before choosing</p>
            <p className="text-sm text-ink-2 leading-relaxed">{item.whatToCheck}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mt-3">Note</p>
            <p className="text-sm text-ink-2 leading-relaxed">NAVORA recommends the next education path, not a final career. Career exploration comes later.</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="button" onClick={onToggleDetail} className="text-xs font-semibold text-brand-700 hover:text-brand-800">
          {open ? 'Show less' : 'Show more'}
        </button>
        <span className="text-xs text-ink-3">Stream • 11th–12th decision</span>
      </div>
    </article>
  );
}

function ParentClass10Result({ result, answers, onBack, onRetake, onSaveDashboard }) {
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState('');
  const [stepsChecked, setStepsChecked] = useState({});
  const [compareOpen, setCompareOpen] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);

  // Identical 12th dashboard — RecommendationCard shape (Option 2) + subjects in Learn More
  const educationItems = useMemo(() => {
    const subjectsByStream = {
      MPC: ['Mathematics', 'Physics', 'Chemistry'],
      BiPC: ['Biology', 'Physics', 'Chemistry'],
      MEC: ['Mathematics', 'Economics', 'Commerce'],
      CEC: ['Civics', 'Economics', 'Commerce'],
      Humanities: ['History', 'Political Science', 'Economics', 'Psychology', 'Languages'],
      'Diploma / Polytechnic': ['Applied Mathematics', 'Applied Physics', 'Engineering Drawing', 'Workshop Practice'],
      'Vocational / Skill-based': ['Trade Theory', 'Workshop Practice', 'Employability Skills', 'Practical Labs'],
      'Arts / Humanities': ['History', 'Political Science', 'Economics', 'Psychology', 'Languages'],
      Commerce: ['Commerce', 'Economics', 'Business Studies'],
    };
    const recs = result.recommended || [];
    return recs.map((r, idx) => {
      const level = idx === 0 ? result.fitLabel : idx === 1 ? 'Good option' : 'Worth exploring';
      const normalized = ['Strong fit', 'Good option', 'Worth exploring'].includes(level) ? level : 'Worth exploring';
      const score = normalized === 'Strong fit' ? 88 : normalized === 'Good option' ? 72 : 58;
      const why = idx === 0 ? (result.why || []).slice(0, 2) : [r.detail];
      const subjects = subjectsByStream[r.name] || subjectsByStream[r.name.trim()] || [];
      return {
        career: {
          id: r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: r.name,
          category: '11th–12th Stream',
          description: r.detail,
          subjects,
          skillsToDevelop: [],
          experienceIdeas: [r.keepsOpen || result.keepsOpen],
          educationRoutes: [r.detail],
          roles: [],
          responsibilities: [],
          objectives: [],
          skillsAndQualifications: [],
          preferredQualifications: [],
        },
        title: r.name,
        score,
        level: normalized,
        band: normalized,
        degree: { short: r.name, full: r.detail },
        exams: [],
        foundations: [],
        whyMatches: why,
        considerations: [r.whatToCheck || result.whatToCheck],
        factors: [
          { key: 'Interest alignment', weight: 30, value: score, why: why[0] || 'Matched to your answers' },
          { key: 'Stream compatibility', weight: 20, value: normalized === 'Strong fit' ? 90 : 60, why: 'Education path fit' },
          { key: 'What this keeps open', weight: 20, value: 75, why: r.keepsOpen || result.keepsOpen },
          { key: 'What to check', weight: 15, value: 70, why: 'Check before choosing' },
          { key: 'Next step', weight: 15, value: 65, why: result.next },
        ],
        activity: r.keepsOpen || result.keepsOpen,
        detail: r.detail,
        keepsOpen: r.keepsOpen || result.keepsOpen,
        whatToCheck: r.whatToCheck || result.whatToCheck,
      };
    });
  }, [result]);

  const counts = useMemo(() => ({
    All: educationItems.length,
    'Strong fit': educationItems.filter((u) => u.level === 'Strong fit').length,
    'Good option': educationItems.filter((u) => u.level === 'Good option').length,
    'Worth exploring': educationItems.filter((u) => u.level === 'Worth exploring').length,
  }), [educationItems]);

  const visible = useMemo(() => (filter === 'All' ? educationItems : educationItems.filter((u) => u.level === filter)), [educationItems, filter]);

  const header = useMemo(() => ({
    eyebrow: 'Your Child’s Next Education Direction',
    title: result.primary ? result.primary.name : 'Exploring paths',
    subtitle: result.primary ? result.primary.detail : 'Let’s keep options open and compare before choosing.',
  }), [result]);

  const context = useMemo(() => {
    const c = [];
    if (Array.isArray(answers.enjoy) && answers.enjoy.length) c.push(`Enjoys: ${answers.enjoy.slice(0, 3).join(' · ')}`);
    if (Array.isArray(answers.strongest) && answers.strongest.length) c.push(`Comfort: ${answers.strongest.slice(0, 3).join(' · ')}`);
    if (answers.learningStyle) c.push(`Learning: ${answers.learningStyle}`);
    if (Array.isArray(answers.interests) && answers.interests.length) c.push(`Interests: ${answers.interests.slice(0, 3).join(' · ')}`);
    if (answers.direction) c.push(`Direction: ${answers.direction}${answers.directionDetail ? ` (${answers.directionDetail})` : ''}`);
    if (answers.pathway) c.push(`Pathway: ${answers.pathway}`);
    c.unshift('Stage: Parent · Class 10');
    return c;
  }, [answers]);

  const nextSteps = useMemo(() => nextStepsForResult('parent_class10', { title: result.primary?.name || 'your top direction' }, null), [result]);
  const compareItems = useMemo(() => compareIds.map((id) => educationItems.find((u) => u.career.id === id)).filter(Boolean), [compareIds, educationItems]);
  const compareRows = useMemo(() => [
    ['Fit Score', (r) => String(r.score) + ' / 100'],
    ['Stream', (r) => r.title],
    ['Detail', (r) => r.detail],
    ['What this keeps open', (r) => r.keepsOpen],
    ['What to check', (r) => r.whatToCheck],
    ['Why it fits', (r) => (r.whyMatches?.[0] || '-')],
  ], []);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t); }, [toast]);

  const toggleCompare = (id) => {
    if (compareIds.includes(id)) { setCompareIds(compareIds.filter((x) => x !== id)); return; }
    if (compareIds.length >= 3) { setToast('You can compare up to 3 options at a time.'); return; }
    setCompareIds([...compareIds, id]);
  };

  const mismatchBanner = result.mismatchWarning ? (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        <p className="font-semibold">Heads up</p>
        <p className="mt-1">{result.mismatchWarning}</p>
      </div>
    </div>
  ) : null;

  return (
    <>
      {mismatchBanner}
      <ResultsLayout
        onBack={onBack}
        header={header}
        context={context}
        filters={['All', 'Strong fit', 'Good option', 'Worth exploring']}
        counts={counts}
        activeFilter={filter}
        onFilter={setFilter}
        compareCount={compareIds.length}
        onCompare={() => setCompareOpen(true)}
        onClearCompare={() => setCompareIds([])}
        items={visible}
        renderCard={(item) => (
          <RecommendationCard
            key={item.career.id}
            item={item}
            rank={educationItems.indexOf(item)}
            compared={compareIds.includes(item.career.id)}
            cantAdd={compareIds.length >= 3}
            onToggleCompare={() => toggleCompare(item.career.id)}
            open={openId === item.career.id}
            onToggleDetail={() => setOpenId(openId === item.career.id ? null : item.career.id)}
            onSave={() => setToast('Saved \u2713')}
          />
        )}
        sidebarExams={[]}
        sidebarNextColleges={
          <section className="rounded-[14px] p-5 text-white shadow-card" style={{ background: 'linear-gradient(135deg,#0f1f4d,#0a1638)' }}>
            <h2 className="flex items-center gap-2 text-[0.72rem] font-bold uppercase text-white/70">Next: what to check</h2>
            <p className="mt-2 text-sm text-white/85">{result.whatToCheck}</p>
            <div className="mt-4"><Button size="md" className="w-full" onClick={onSaveDashboard}>Save to dashboard</Button></div>
          </section>
        }
        nextSteps={nextSteps}
        stepsChecked={stepsChecked}
        onToggleStep={(k) => setStepsChecked((s) => ({ ...s, [k]: !s[k] }))}
        onRetake={onRetake}
        onSave={onSaveDashboard}
        toast={toast}
        setToast={setToast}
        compareOpen={compareOpen}
        setCompareOpen={setCompareOpen}
        compareItems={compareItems.length ? compareItems : educationItems.slice(0, 3)}
        compareRows={compareRows}
      />
    </>
  );
}

  /* ── Render: results — unified shared system (all flows) ─────────── */
  if (showResult && result) {
    if (flowKey === 'parent_class10') {
      return <ParentClass10Result result={result} answers={answers} onBack={handleBack} onRetake={retakeFlow} onSaveDashboard={()=>{
        const stamped = { flow: flowKey, ...answers, lastSavedAt: new Date().toISOString() };
        saveAnswers(stamped);
        // Persist FINAL result to Supabase (Dashboard + AI Advisor reuse same data)
        saveAssessmentResult({
          assessmentType: flowKey,
          educationStage: answers.stream || 'parent_class10',
          assessmentData: stamped,
          resultData: { result, flowKey }
        });
        navigate('/dashboard');
      }} />;
    }
    // Use deterministic career engine for every flow so the shared UI has scores/whys
    const unified = unifiedFromCareerEngine(flowKey, answers);
    // ParentClass12 keeps compatibility but now renders via shared system too
    // Filtering + compare + steps live here so every flow shares identical UX
    const _header = headerFor(flowKey);
    const _context = contextFor(flowKey, answers);
    // Render via UnifiedResults helper defined below
    return <UnifiedResults flowKey={flowKey} answers={answers} result={result} unified={unified} header={_header} context={_context} onBack={handleBack} onRetake={retakeFlow} onSaveDashboard={()=>{
      const stamped = { flow: flowKey, ...answers, lastSavedAt: new Date().toISOString() };
      saveAnswers(stamped);
      saveAssessmentResult({
        assessmentType: flowKey,
        educationStage: answers.stream || answers.family || flowKey,
        assessmentData: stamped,
        resultData: { unified, header: _header, context: _context, result, flowKey }
      });
      navigate('/dashboard');
    }} compareIds={compareIds} setCompareIds={setCompareIds} detailId={detailId} setDetailId={setDetailId} />;
  }

  /* ── Render: question screens ─────────────────────────────── */

  const prompt = promptFor(currentKey);
  const isGradSkills =
    currentKey === 'skills' &&
    (flowKey === 'student_graduation' || flowKey === 'parent_graduation');

  const activeOptions = specPending ? getOptions('specialization') : getOptions(currentKey);
  const multi = !specPending && isMultiKey(currentKey);
  const picked = multi ? answers[currentKey] || [] : [];
  const cap = maxPicksFor(currentKey);
  const bridgeLine = TRANSITIONS[flowKey]?.[step];
  const emptyOptions = Array.isArray(activeOptions) && activeOptions.length === 0 && !isGradSkills;

  return (
    <div className="min-h-screen bg-paper-gradient">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 lg:py-16">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              {flowMeta?.label}
            </span>
            <span className="text-xs font-medium text-ink-3 tabular-nums">
              Step {step + 1} of {total}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i < step ? 'w-6 bg-brand-500' : i === step ? 'w-8 bg-brand-600' : 'w-6 bg-brand-100'}`}
                />
              ))}
            </div>
            <div
              className="flex-1 h-1.5 rounded-full bg-brand-100 overflow-hidden hidden sm:block"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={total}
              aria-valuenow={step + 1}
              aria-label={`Step ${step + 1} of ${total}`}
            >
              <motion.div
                className="h-full bg-brand-600 rounded-full"
                animate={{ width: `${((step + 1) / total) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${flowKey}-${currentKey}-${specPending ? 'spec' : 'main'}`}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Occasional educator bridge — calm, not salesy */}
            {bridgeLine && (
              <p className="mb-3 text-sm font-medium text-ink-3">{bridgeLine}</p>
            )}

            {/* Specialization phase lives inside question 2 */}
            {specPending ? (
              <>
                <h1 className="font-ui font-bold text-[1.55rem] sm:text-[1.75rem] text-ink tracking-[-0.015em] leading-tight text-balance">
                  {answers.degree} — which specialization?
                </h1>
                <p className="mt-2.5 text-[0.92rem] text-ink-2 leading-relaxed max-w-xl">
                  Only specializations within {answers.degree} are shown.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-ui font-bold text-[1.55rem] sm:text-[1.75rem] text-ink tracking-[-0.015em] leading-tight text-balance">
                  {prompt.text}
                </h1>
                {prompt.sub && (
                  <p className="mt-2.5 text-[0.92rem] text-ink-2 leading-relaxed max-w-xl">{prompt.sub}</p>
                )}
              </>
            )}

            {/* Graduation skills — grouped by category from the degree profile */}
                        {isGradSkills ? (
              gradProfile ? (
                <div className="mt-8 space-y-4" data-testid="skill-chip-list">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-ink-3">
                      <span className="font-bold text-brand-600">{picked.length}</span> / {cap} selected
                    </p>
                    {picked.length >= cap && <span className="text-xs font-medium text-warning">Maximum reached</span>}
                  </div>
                  {Object.entries(gradProfile?.skills || {}).map(([group, list]) => (
                    <SkillGroup
                      key={group}
                      group={group}
                      skills={list}
                      selected={picked}
                      onToggle={(v) => handleMulti('skills', v)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 bg-paper border border-line rounded-xl p-6 text-sm text-ink-2 leading-relaxed">
                  Choose your degree and specialization first so we can show skills that fit it. Go back and pick a degree to continue.
                </div>
              )
            ) : emptyOptions ? (
              <div className="mt-8 bg-paper border border-line rounded-xl p-6 text-sm text-ink-2 leading-relaxed">
                No options available for this choice — please go back and pick a different stream or select “Still exploring” to continue.
              </div>
            ) : (
              Array.isArray(activeOptions) && activeOptions.length > 0 && (
                <div
                  className={`mt-8 grid gap-3 ${multiGridCols(specPending ? 'specialization' : currentKey)}`}
                  data-testid="options-grid"
                  data-qkey={specPending ? 'specialization' : currentKey}
                >
                  {activeOptions.map((o) => (
                    <OptionCard
                      key={o.value}
                      label={o.label}
                      compact={multi}
                      selected={
                        multi
                          ? picked.includes(o.value)
                          : specPending
                            ? answers.specialization === o.value
                            : answers[currentKey] === o.value
                      }
                      onClick={() =>
                        multi
                          ? handleMulti(currentKey, o.value)
                          : specPending
                            ? handleSingle('specialization', o.value)
                            : handleSingle(currentKey, o.value)
                      }
                    />
                  ))}
                </div>
              )
            )}

            {/* Selection counter for multi questions */}
            {multi && (
              <div className="mt-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${picked.length > 0 ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-line text-ink-3'}`}>
                  {picked.length > 0 ? `${picked.length} selected` : 'Select up to ' + cap}
                  {cap ? ` · max ${cap}` : ''}
                </span>
                {picked.length > 0 && picked.length < cap && (
                  <span className="text-xs text-ink-3">Tap to add or remove.</span>
                )}
              </div>
            )}

            {/* Navigation — hierarchy: Continue primary, Back secondary, sticky on mobile */}
            <div className="mt-10 pt-6 border-t border-line flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink transition-colors cursor-pointer py-2.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
                <Button onClick={handleNext} disabled={!canContinue} shine size="lg" className="w-full sm:w-auto">
                  {step === total - 1 ? 'See Guidance' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                {!canContinue && (
                  <span className="text-xs text-ink-3 text-center sm:text-right">
                    {multi ? 'Select at least one to continue.' : 'Choose an option to continue.'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
