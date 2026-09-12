import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ArrowRight, Check, AlertCircle, HelpCircle } from 'lucide-react';
import Button from '../components/Button';
import BackLink from '../components/BackLink';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import {
  TWELVE_STEP_IDS,
  twelveStepLabels,
  getTwelveStepTitle,
  getTwelveStepSupport,
  getTwelveOptions,
  validateTwelveStep,
  twelveInitialAnswers,
  twelveStreamOptions,
  MAX_CAREER_PRIORITIES,
} from '../data/careerQuestionnaire';
import { buildResults } from '../data/class12Recommendations';

function ChoiceCard({ option, selected, multi = false, onClick, disabled = false }) {
  return (
    <button
      type="button"
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selected}
      aria-label={option.description ? `${option.label} — ${option.description}` : option.label}
      onClick={onClick}
      disabled={disabled}
      className={`group w-full text-left px-4 sm:px-5 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-brand-500 bg-brand-500 text-white shadow-brand'
          : 'border-line bg-surface text-ink hover:border-brand-300 hover:shadow-md'
      } ${disabled ? 'opacity-50 cursor-not-allowed hover:border-line hover:shadow-none' : ''}`}
    >
      <span className="flex items-start gap-3 min-w-0">
        <span
          className={`mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center border-2 transition-all ${
            multi ? 'rounded-md' : 'rounded-full'
          } ${selected ? 'border-white bg-white' : 'border-line-strong bg-transparent'}`}
          aria-hidden="true"
        >
          {multi ? (
            selected && <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: '#2563eb' }} />
          ) : (
            selected && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#2563eb' }} />
          )}
        </span>
        <span className="flex flex-col min-w-0">
          <span className="flex items-center gap-2 min-w-0">
            {option.emoji && (
              <span className="text-base leading-none shrink-0" aria-hidden="true">
                {option.emoji}
              </span>
            )}
            <span className={`font-medium text-[0.95rem] leading-snug ${selected ? 'text-white' : 'text-ink'}`}>
              {option.label}
            </span>
          </span>
          {option.description && (
            <span className={`mt-0.5 text-[0.82rem] leading-relaxed ${selected ? 'text-white/85' : 'text-ink-3'}`}>
              {option.description}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

function StreamCard({ option, selected, onClick }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${option.label}. ${option.subjects}`}
      onClick={onClick}
      className={`group relative flex flex-col w-full min-w-0 text-left rounded-2xl border p-5 sm:p-6 transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500 shadow-brand'
          : 'border-line bg-surface hover:border-brand-300 hover:shadow-md'
      }`}
    >
      <span
        className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
          selected ? 'border-brand-500 bg-brand-500' : 'border-line-strong bg-surface group-hover:border-brand-300'
        }`}
        aria-hidden="true"
      >
        {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </span>
      <span className="flex items-center gap-3 pr-8">
        <span
          className={`w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center text-xl transition-colors ${
            selected ? 'border-brand-200 bg-brand-100' : 'border-brand-100 bg-brand-50'
          }`}
          aria-hidden="true"
        >
          {option.emoji}
        </span>
        <span className={`font-ui font-semibold text-lg leading-tight ${selected ? 'text-brand-700' : 'text-ink'}`}>
          {option.label}
        </span>
      </span>
      {option.subjects && (
        <span className="mt-4 block">
          <span className="eyebrow text-ink-3 block mb-1">Subjects</span>
          <span className="block text-sm font-medium text-ink-2">{option.subjects}</span>
        </span>
      )}
      {option.careerAreas && (
        <span className="mt-3 block">
          <span className="eyebrow text-ink-3 block mb-1">Career Areas</span>
          <span className="block text-sm text-ink-2 leading-relaxed">{option.careerAreas}</span>
        </span>
      )}
      {option.blurb && <span className="mt-3 block text-sm text-ink-3 leading-relaxed">{option.blurb}</span>}
      {option.tags && (
        <span className="mt-auto pt-4 flex flex-wrap gap-2">
          {option.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-paper-deep border border-line px-2.5 py-1 text-xs font-medium text-ink-2"
            >
              {tag}
            </span>
          ))}
        </span>
      )}
    </button>
  );
}

function StepHeading({ headingRef, eyebrow, title, support }) {
  return (
    <div>
      <p className="eyebrow text-ink-3 mb-3">{eyebrow}</p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-ui font-bold text-[1.9rem] sm:text-[2.3rem] text-ink tracking-[-0.025em] leading-tight text-balance outline-none"
      >
        {title}
      </h1>
      {support && (
        <p className="mt-3 flex items-start gap-2 text-sm text-ink-3 leading-relaxed">
          <HelpCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {support}
        </p>
      )}
    </div>
  );
}

function ErrorNote({ children }) {
  return (
    <p className="mt-3 flex items-start gap-1.5 text-sm font-medium text-error">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      {children}
    </p>
  );
}
function LimitNote({ children }) {
  return (
    <p className="mt-3 flex items-start gap-1.5 text-sm font-medium text-warning">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      {children}
    </p>
  );
}

export default function Class12Questionnaire() {
  useScrollTop();
  const navigate = useNavigate();
  const { setAnswers: saveAnswers } = useUser();
  const [step, setStep] = useState(0);
  const [answers, setAnswersLocal] = useState(twelveInitialAnswers);
  const [direction, setDirection] = useState('right');
  const [errors, setErrors] = useState({});
  const [limitMsgs, setLimitMsgs] = useState({});
  const headingRef = useRef(null);

  const steps = TWELVE_STEP_IDS;
  const totalSteps = steps.length;
  const currentStepId = steps[Math.min(step, totalSteps - 1)];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const t = window.setTimeout(() => headingRef.current?.focus(), 320);
    return () => window.clearTimeout(t);
  }, [step]);

  const setAnswer = useCallback((field, value) => {
    setAnswersLocal((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'streamV2' && value !== prev.streamV2) {
        next.subjectInterests = [];
        next.interestArea = '';
        next.specificInterest = '';
        next.motivation = '';
        next.workEnvironment = '';
      }
      if (field === 'interestArea' && value !== prev.interestArea) {
        next.specificInterest = '';
        next.motivation = '';
        next.workEnvironment = '';
      }
      if (field === 'specificInterest' && value !== prev.specificInterest) {
        next.motivation = '';
      }
      return next;
    });
    setErrors((prev) => {
      const nxt = { ...prev, [field]: undefined };
      if (field === 'streamV2') { nxt.subjectInterests = undefined; nxt.interestArea = undefined; nxt.specificInterest = undefined; nxt.motivation = undefined; }
      if (field === 'interestArea') { nxt.specificInterest = undefined; nxt.motivation = undefined; }
      if (field === 'specificInterest') { nxt.motivation = undefined; }
      return nxt;
    });
    setLimitMsgs({});
  }, []);

  const toggleMulti = useCallback((field, value, max) => {
    const list = answers[field] || [];
    const has = list.includes(value);
    if (!has && list.length >= max) {
      setLimitMsgs((m) => ({ ...m, [field]: `You can select up to ${max} options.` }));
      return;
    }
    const next = has ? list.filter((v) => v !== value) : [...list, value];
    setAnswersLocal((prev) => ({ ...prev, [field]: next }));
    setLimitMsgs((m) => ({ ...m, [field]: '' }));
    if (next.length > 0) setErrors((e) => ({ ...e, [field]: undefined }));
  }, [answers]);

  const validateStep = (stepId) => {
    const msg = validateTwelveStep(stepId, answers);
    return msg ? { [stepId]: msg } : {};
  };

  const handleContinue = () => {
    const errs = validateStep(currentStepId);
    if (Object.values(errs).some(Boolean)) { setErrors(errs); return; }
    setErrors({});
    if (step < totalSteps - 1) { setDirection('right'); setStep(step + 1); }
    else {
      const results = buildResults(answers);
      saveAnswers({ ...answers, completedAt: new Date().toISOString(), recommendations: results.recommendations, clusters: results.clusters, exploring: results.exploring });
      navigate('/path/class12');
    }
  };
  const handleBack = () => {
    if (step === 0) return;
    setDirection('left'); setStep(step - 1); setErrors({});
  };

  const renderStep = () => {
    const title = getTwelveStepTitle(currentStepId, answers);
    const support = getTwelveStepSupport(currentStepId, answers);
    const options = getTwelveOptions(currentStepId, answers);
    const eyebrow = `Question ${step + 1} of ${totalSteps}`;

    if (currentStepId === 'streamV2') {
      return (
        <div>
          <StepHeading headingRef={headingRef} eyebrow={eyebrow} title={title} support="Your stream helps us show only the subjects and careers relevant to you." />
          <div role="radiogroup" aria-label={title} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {twelveStreamOptions.map((option) => (
              <StreamCard key={option.value} option={option} selected={answers.streamV2 === option.value} onClick={() => setAnswer('streamV2', option.value)} />
            ))}
          </div>
          {errors.streamV2 && <ErrorNote>{errors.streamV2}</ErrorNote>}
        </div>
      );
    }
    if (currentStepId === 'subjectInterests') {
      return (
        <div>
          <StepHeading headingRef={headingRef} eyebrow={eyebrow} title={title} support="Select up to 3 subjects you enjoy most." />
          <div role="group" aria-label={title} className="mt-8 space-y-2.5 sm:grid sm:grid-cols-2 sm:space-y-0 sm:gap-2.5">
            {options.map((option) => (
              <ChoiceCard key={option.value} option={option} selected={(answers.subjectInterests||[]).includes(option.value)} multi onClick={() => toggleMulti('subjectInterests', option.value, 3)} />
            ))}
          </div>
          {limitMsgs.subjectInterests && <LimitNote>{limitMsgs.subjectInterests}</LimitNote>}
          {errors.subjectInterests && <ErrorNote>{errors.subjectInterests}</ErrorNote>}
          <p className="mt-2 text-xs text-ink-3">Selected {(answers.subjectInterests||[]).length} of 3</p>
        </div>
      );
    }
    if (currentStepId === 'careerPriorities') {
      return (
        <div>
          <StepHeading headingRef={headingRef} eyebrow={eyebrow} title={title} support="Choose up to 2 that matter most." />
          <div role="group" aria-label={title} className="mt-8 space-y-2.5 sm:grid sm:grid-cols-2 sm:space-y-0 sm:gap-2.5">
            {options.map((option) => (
              <ChoiceCard key={option.value} option={option} selected={(answers.careerPriorities||[]).includes(option.value)} multi onClick={() => toggleMulti('careerPriorities', option.value, MAX_CAREER_PRIORITIES)} />
            ))}
          </div>
          {limitMsgs.careerPriorities && <LimitNote>{limitMsgs.careerPriorities}</LimitNote>}
          {errors.careerPriorities && <ErrorNote>{errors.careerPriorities}</ErrorNote>}
          <p className="mt-2 text-xs text-ink-3">Selected {(answers.careerPriorities||[]).length} of {MAX_CAREER_PRIORITIES}</p>
        </div>
      );
    }
    // generic single-select steps
    const val = answers[currentStepId];
    return (
      <div>
        <StepHeading headingRef={headingRef} eyebrow={eyebrow} title={title} support={support} />
        <div role="radiogroup" aria-label={title} className="mt-8 space-y-2.5 sm:grid sm:grid-cols-2 sm:space-y-0 sm:gap-2.5">
          {options.map((option) => (
            <ChoiceCard key={option.value} option={option} selected={val === option.value} onClick={() => setAnswer(currentStepId, option.value)} />
          ))}
        </div>
        {errors[currentStepId] && <ErrorNote>{errors[currentStepId]}</ErrorNote>}
      </div>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-paper-gradient">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 lg:py-14">
          <div className="flex items-center justify-between mb-8">
            <span aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 text-sm text-ink-3 font-medium bg-white/80 border border-line rounded-full px-3 py-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 glow-dot" />
              {Math.round(((step + 1) / totalSteps) * 100)}% there
            </span>
          </div>
          <div className="bg-white border border-line rounded-[1.6rem] shadow-card p-6 sm:p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3" aria-live="polite">
                <span className="eyebrow text-ink-3">Question {step + 1} <span className="text-ink-4 normal-case">of {totalSteps}</span></span>
                <span className="text-sm font-medium text-ink-2">{twelveStepLabels[currentStepId]}</span>
              </div>
              <div className="relative w-full h-1.5 bg-paper-deep rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
              </div>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: direction === 'right' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 'right' ? -20 : 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
            <div className="mt-10 pt-6 border-t border-line flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {step > 0 && <BackLink onClick={handleBack} />}
                <span className="text-sm text-ink-3">Question {step + 1} of {totalSteps}</span>
              </div>
              <Button onClick={handleContinue} size="lg" shine>
                {step === totalSteps - 1 ? '🚀 See my path' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
