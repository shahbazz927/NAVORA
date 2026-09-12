import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import BackLink from '../components/BackLink';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import { personas } from '../data/personas';

export default function Onboarding() {
  useScrollTop();
  const { userType } = useParams();
  const navigate = useNavigate();
  const { setOnboardingData } = useUser();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const persona = personas[userType] || personas.class10;
  const Icon = persona.icon;
  const isParent = userType === 'parent';

  const sanitizeName = (v) => String(v || '').trim().slice(0, 40).replace(/[<>"'`]/g, '').replace(/\s+/g, ' ');
  const validateName = (v) => {
    if (!v) return '';
    if (v.length < 2) return 'Please enter at least 2 characters.';
    if (!/^[A-Za-zÀ-ÿ' -]+$/.test(v)) return 'Use letters, spaces, hyphens and apostrophes only.';
    return '';
  };

  const handleContinue = () => {
    const clean = sanitizeName(name);
    const err = validateName(clean);
    if (err) { setNameError(err); return; }
    setNameError('');
    setOnboardingData({ name: clean });
    navigate(`/questions/${userType}`);
  };

  const handleSkip = () => {
    setOnboardingData({ name: '' });
    navigate(`/questions/${userType}`);
  };

  return (
    <div className="min-h-screen bg-paper-gradient flex items-center justify-center relative overflow-hidden">
      <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-brand-400/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-cyan-300/10 blur-3xl pointer-events-none" />
      <div className="relative w-full max-w-lg px-5 sm:px-8 py-16">
        <BackLink className="mb-10" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-7 shadow-sm"
            style={{ backgroundColor: persona.accentSoft, color: persona.accentColor }}
          >
            <Icon className="w-7 h-7" strokeWidth={1.75} />
          </span>

          <p className="eyebrow mb-3" style={{ color: persona.accentColor }}>
            {persona.title} · NAVORA
          </p>

          <h1 className="font-ui font-bold text-3xl sm:text-[2.6rem] text-ink tracking-[-0.03em] leading-[1.1] text-balance">
            {isParent
              ? 'Great — let\u2019s help your child.'
              : 'Let\u2019s figure this out together.'}
          </h1>

          <p className="mt-4 text-ink-2 leading-relaxed">
            {persona.tone.intro}
          </p>

          <div className="mt-9">
            <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
              {isParent ? 'What\u2019s your name?' : 'What\u2019s your name? (optional)'}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              placeholder={isParent ? 'Your name' : 'First name'}
              autoComplete="name"
              maxLength={40}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? 'name-error' : undefined}
              className={`w-full px-5 py-3.5 rounded-xl border bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 transition-all shadow-sm ${nameError ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-line focus:ring-brand-200 focus:border-brand-300'}`}
            />
            {nameError && <p id="name-error" className="mt-2 text-sm text-red-600">{nameError}</p>}
            {isParent && (
              <p className="mt-2 text-sm text-ink-3">
                We&rsquo;ll use it to address you as we explain your child&rsquo;s options.
              </p>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm font-medium text-ink-3 hover:text-ink transition-colors"
            >
              Skip for now
            </button>
            <Button onClick={handleContinue} shine>
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <p className="mt-8 text-xs text-ink-3 leading-relaxed border-t border-line pt-5">
            {persona.tone.promise}
          </p>
        </motion.div>
      </div>
    </div>
  );
}