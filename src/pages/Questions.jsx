import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/Button';
import BackLink from '../components/BackLink';
import StepIndicator from '../components/StepIndicator';
import { useUser } from '../context/UserContext';
import { questions } from '../data/questions';
import {
  getAfter12FieldOptions,
  getClass10InterestOptions,
} from '../data/streamConfig';
import graduationDegrees, {
  getDegreeProfile,
  getSpecializations,
} from '../data/graduationDegreeConfig';
import { useScrollTop } from '../hooks/useLocalStorage';
import { personas } from '../data/personas';

const hints = {
  class10: {
    stream: 'Pick the direction you\u2019re leaning \u2014 or none. We\u2019ll tailor everything that follows to it.',
    interest: 'Pick everything you genuinely like \u2014 there\u2019s no wrong answer here.',
    learning_style: 'Think about how you understand things fastest, not what looks most impressive.',
    career_goal: 'This is about what excites you, not what pays the most. We\u2019ll factor money in later.',
    work_style: 'Both are great. Choose how you feel most like yourself.',
    strengths: 'Ask yourself: what do people come to you for?',
  },
  class12: {
    stream: 'Your stream shapes which courses are realistically on the table.',
    interest_area: 'This will help us narrow down courses, colleges and entrance exams that fit your stream and interests.',
    priority: 'There\u2019s no ideal answer \u2014 be honest about what matters most to you.',
    higher_education: 'Your answer changes the weight we give to exams, rankings, and budget.',
    budget: 'Be realistic. We\u2019ll match options that respect it.',
    interest: 'Pick everything you genuinely like \u2014 there\u2019s no wrong answer here.',
    strengths: 'Ask yourself: what do people come to you for?',
    work_style: 'Think about how you work at your best, not what sounds impressive.',
    career_goal: 'This is about what excites you, not what pays the most. We\u2019ll factor money in later.',
  },
  graduate: {
    degree: 'Your starting point matters more than you\u2019d think for the next move.',
    interests: 'Pick the areas that genuinely excite you \u2014 we\u2019ll match skills and careers to them.',
    skills: 'Select skills you actually have, not what you think you should say.',
    experience: 'This helps us time your next steps realistically.',
    career: 'The right path looks very different for a switch vs. a promotion.',
  },
  parent: {
    child_class: 'This sets the stage for the decisions ahead of you.',
    concern: 'Be honest \u2014 we\u2019ll address the real worry, not a generic list.',
    budget: 'A realistic budget means realistic, useful options.',
    preference: 'Location is a real factor in fees, safety, and peace of mind.',
    child_interest: 'Your child\u2019s genuine interests are the best compass you have.',
  },
};

const graduateCategoryMap = {
  'Medicine & Healthcare': { emoji: '\u{1FA7A}', degreeLabels: [
    'MBBS','BDS','BAMS','BHMS','BUMS','BSMS','BNYS','B.Sc Nursing',
    'BPT / Physiotherapy','BOT / Occupational Therapy','B.Pharm','Pharm.D',
    'B.Sc Medical Laboratory Technology','B.Sc Radiology / Medical Imaging',
    'B.Sc Optometry','B.Sc Cardiac Care Technology','B.Sc Anaesthesia Technology',
    'B.Sc Operation Theatre Technology','B.Sc Respiratory Therapy',
    'B.Sc Dialysis Technology','B.Sc Emergency / Trauma Care','Other Healthcare Degree',
  ]},
  'Engineering': { emoji: '\u2699\uFE0F', degreeLabels: [
    'B.Tech / B.E.',
  ]},
  'Computer Applications': { emoji: '\u{1F4BB}', degreeLabels: [
    'BCA','B.Sc Computer Science','B.Sc Information Technology',
    'B.Sc Data Science','B.Sc Artificial Intelligence','B.Sc Cybersecurity',
    'B.Sc Computer Applications','Other Computing Degree',
  ]},
  'Commerce & Finance': { emoji: '\u{1F4B0}', degreeLabels: [
    'B.Com',
  ]},
  'Business & Management': { emoji: '\u{1F4C8}', degreeLabels: [
    'BBA',
  ]},
  'Science': { emoji: '\u{1F52C}', degreeLabels: [
    'B.Sc',
  ]},
  'Arts & Humanities': { emoji: '\u{1F3A8}', degreeLabels: [
    'BA',
  ]},
  'Law': { emoji: '\u2696\uFE0F', degreeLabels: [
    'Law',
  ]},
  'Design & Creative': { emoji: '\u{1F3A8}', degreeLabels: [
    'Design / Creative',
  ]},
  'Agriculture & Environment': { emoji: '\u{1F331}', degreeLabels: [
    'Agriculture / Environment',
  ]},
  'Education': { emoji: '\u{1F393}', degreeLabels: [
    'Education',
  ]},
  'Other Professional': { emoji: '\u{1F310}', degreeLabels: [
    'Hotel Management','Hospitality','Tourism','Aviation',
    'Logistics','Event Management','Other',
  ]},
};

function getDegreeByLabel(label) {
  return graduationDegrees.find((d) => d.label === label);
}

function SkillGroupSection({ groupName, skills, selected, onToggle, disabled }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2 px-1">{groupName}</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => {
          const isSelected = selected.includes(skill.value);
          return (
            <button
              key={skill.value}
              type="button"
              onClick={() => onToggle(skill.value)}
              disabled={!isSelected && disabled}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                isSelected
                  ? 'bg-brand-500 text-white border-brand-500 shadow-brand'
                  : disabled
                    ? 'bg-gray-50 text-ink-3 border-line cursor-not-allowed opacity-50'
                    : 'bg-white text-ink border-line hover:border-brand-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                {skill.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Questions() {
  useScrollTop();
  const { userType } = useParams();
  const navigate = useNavigate();
  const { setAnswers } = useUser();

  const persona = personas[userType] || personas.class10;
  const accent = persona.accent;
  const accentClass = accent === 'p10' ? 'bg-p10' : accent === 'p12' ? 'bg-p12' : accent === 'grad' ? 'bg-grad' : 'bg-pt';

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswersLocal] = useState({});
  const [selected, setSelected] = useState([]);
  const [direction, setDirection] = useState('right');
  const [discoveryMode, setDiscoveryMode] = useState(false);

  const [q1Phase, setQ1Phase] = useState('degree');
  const [q1SelectedDegree, setQ1SelectedDegree] = useState('');
  const [q1SelectedSpecialization, setQ1SelectedSpecialization] = useState('');

  const questionSet = useMemo(() => {
    if (discoveryMode) return questions.class12_discovery;
    return questions[userType] || questions.class10;
  }, [discoveryMode, userType]);

  const question = questionSet[currentQ];
  const total = questionSet.length;
  const hint = hints[userType]?.[question?.id];

  const isGraduate = userType === 'graduate';
  const isQ1 = isGraduate && question?.id === 'degree';
  const isClass10Interest = userType === 'class10' && question?.id === 'interest';
  const isClass12Interest = userType === 'class12' && question?.id === 'interest_area';

  const currentDegreeLabel = answers.currentDegree || '';
  const currentSpecialization = answers.specialization || '';

  // Single central profile lookup — same engine used by Q2–Q5 and results.
  const currentProfile = useMemo(() => {
    if (!isGraduate || !currentDegreeLabel) return null;
    return getDegreeProfile(currentDegreeLabel, currentSpecialization);
  }, [isGraduate, currentDegreeLabel, currentSpecialization]);

  const dynamicOptions = useMemo(() => {
    if (isClass10Interest) return getClass10InterestOptions(answers.stream?.[0]);
    if (isClass12Interest) return getAfter12FieldOptions(answers.stream?.[0]);

    if (isGraduate && question?.id === 'interests' && currentProfile) {
      return currentProfile.interests || [];
    }
    if (isGraduate && question?.id === 'skills' && currentProfile) {
      const all = [];
      if (currentProfile.skills) {
        Object.values(currentProfile.skills).forEach((group) => {
          group.forEach((s) => all.push(s));
        });
      }
      return all;
    }
    if (isGraduate && question?.id === 'experience' && currentProfile) {
      return currentProfile.experiences || [];
    }
    if (isGraduate && question?.id === 'career' && currentProfile) {
      return currentProfile.careers || [];
    }
    return null;
  }, [isClass10Interest, isClass12Interest, isGraduate, question, answers, currentProfile]);

  const effectiveOptions = useMemo(
    () => dynamicOptions || question?.options || [],
    [dynamicOptions, question],
  );

  const skillGroups = useMemo(() => {
    if (isGraduate && question?.id === 'skills' && currentProfile?.skills) {
      return currentProfile.skills;
    }
    return null;
  }, [isGraduate, question, currentProfile]);

  const maxSelect = question?.maxSelect || (question?.type === 'multiple' ? Infinity : 1);

  const q1HasSpecializations = useMemo(() => {
    if (!isQ1 || !q1SelectedDegree) return false;
    const deg = getDegreeByLabel(q1SelectedDegree);
    return deg && deg.specializations && deg.specializations.length > 0;
  }, [isQ1, q1SelectedDegree]);

  const q1Ready = isQ1 && q1SelectedDegree && (
    !q1HasSpecializations || q1SelectedSpecialization
  );

  const missingContext = isGraduate
    && !isQ1
    && question?.id !== 'degree'
    && (!currentDegreeLabel || !currentSpecialization || !currentProfile);

  const handleSelect = useCallback((value) => {
    if (question.type === 'multiple') {
      setSelected((prev) => {
        if (prev.includes(value)) return prev.filter((v) => v !== value);
        if (prev.length >= maxSelect) return prev;
        return [...prev, value];
      });
    } else {
      setSelected([value]);
    }
  }, [question, maxSelect]);

  const handleQ1DegreeSelect = useCallback((degreeLabel) => {
    setQ1SelectedDegree(degreeLabel);
    setQ1SelectedSpecialization('');
    const deg = getDegreeByLabel(degreeLabel);
    const hasSpecs = deg && deg.specializations && deg.specializations.length > 0;
    // Degrees with specializations advance to the specialization step;
    // degrees without them stay here (specialization auto-set via effect).
    setQ1Phase(hasSpecs ? 'specialization' : 'degree');
  }, []);

  const handleQ1SpecializationSelect = useCallback((spec) => {
    setQ1SelectedSpecialization(spec);
  }, []);

  const handleNext = useCallback(() => {
    if (isQ1) {
      if (!q1SelectedDegree) return;
      if (q1HasSpecializations && !q1SelectedSpecialization) return;

      const specialization = q1HasSpecializations
        ? q1SelectedSpecialization
        : q1SelectedDegree;

      // If the degree (or specialization) changed, every dependent answer
      // is no longer valid — clear interests, skills, experience and goal.
      const degreeChanged =
        answers.currentDegree !== q1SelectedDegree ||
        answers.specialization !== specialization;

      const newAnswers = {
        ...answers,
        currentDegree: q1SelectedDegree,
        specialization,
        ...(degreeChanged
          ? { interests: [], skills: [], experience: [], career: [] }
          : {}),
      };
      setAnswersLocal(newAnswers);

      if (currentQ < total - 1) {
        const nextQ = questionSet[currentQ + 1];
        setSelected(nextQ ? (newAnswers[nextQ.id] || []) : []);
        setDirection('right');
        setCurrentQ(currentQ + 1);
      }
      return;
    }

    let newAnswers = { ...answers, [question.id]: selected };

    if (isGraduate && question.id === 'interests') {
      newAnswers.skills = [];
      newAnswers.experience = [];
      newAnswers.career = [];
    }

    setAnswersLocal(newAnswers);

    if (currentQ < total - 1) {
      const nextQ = questionSet[currentQ + 1];
      setSelected(nextQ ? (newAnswers[nextQ.id] || []) : []);
      setDirection('right');
      setCurrentQ(currentQ + 1);
    } else {
      setAnswers(newAnswers);
      navigate(`/recommendations/${userType}`);
    }
  }, [
    isQ1, q1SelectedDegree, q1SelectedSpecialization, q1HasSpecializations,
    answers, question, currentQ, total, questionSet, isGraduate,
    navigate, userType, setAnswers, selected,
  ]);

  const handleBack = useCallback(() => {
    if (discoveryMode && currentQ === 0) {
      setDiscoveryMode(false);
      setSelected(answers.stream || []);
      setDirection('left');
      setCurrentQ(0);
      return;
    }

    if (isQ1 && q1Phase === 'specialization') {
      setQ1Phase('degree');
      setQ1SelectedSpecialization('');
      return;
    }

    if (currentQ > 0) {
      const prevQ = questionSet[currentQ - 1];

      if (isGraduate && prevQ?.id === 'degree') {
        setCurrentQ(currentQ - 1);
        setDirection('left');
        setQ1SelectedDegree(answers.currentDegree || '');
        setQ1SelectedSpecialization(answers.specialization || '');
        const deg = getDegreeByLabel(answers.currentDegree || '');
        const hasSpecs = deg && deg.specializations && deg.specializations.length > 0;
        setQ1Phase(hasSpecs && answers.specialization ? 'specialization' : 'degree');
        setSelected([]);
        return;
      }

      setSelected(answers[prevQ.id] || []);
      setDirection('left');
      setCurrentQ(currentQ - 1);
    } else {
      navigate(-1);
    }
  }, [discoveryMode, currentQ, answers, questionSet, navigate, isQ1, q1Phase, isGraduate]);

  const selectedLabels = useMemo(() => {
    return selected
      .map((v) => effectiveOptions.find((o) => o.value === v)?.label)
      .filter(Boolean);
  }, [selected, effectiveOptions]);

  const canContinue = isQ1
    ? q1Ready
    : selected.length > 0 && !missingContext;

  useEffect(() => {
    if (isQ1 && q1SelectedDegree && !q1SelectedSpecialization) {
      const deg = getDegreeByLabel(q1SelectedDegree);
      if (deg && (!deg.specializations || deg.specializations.length === 0)) {
        setQ1SelectedSpecialization(q1SelectedDegree);
      }
    }
  }, [isQ1, q1SelectedDegree, q1SelectedSpecialization]);

  const renderGraduateQ1 = () => {
    if (q1Phase === 'degree') {
      const grouped = {};
      Object.entries(graduateCategoryMap).forEach(([catName, cat]) => {
        grouped[catName] = {
          emoji: cat.emoji,
          degrees: cat.degreeLabels.map((label) => {
            const deg = getDegreeByLabel(label);
            return { label, hasSpecs: deg && deg.specializations && deg.specializations.length > 0 };
          }),
        };
      });

      return (
        <div className="mt-8 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {Object.entries(grouped).map(([catName, { emoji, degrees }]) => (
            <GraduateDegreeGroup
              key={catName}
              category={catName}
              emoji={emoji}
              degrees={degrees}
              selectedDegree={q1SelectedDegree}
              onSelect={handleQ1DegreeSelect}
            />
          ))}
        </div>
      );
    }

    if (q1Phase === 'specialization') {
      const specs = getSpecializations(q1SelectedDegree);
      return (
        <div className="mt-8">
          <p className="text-sm text-ink-3 mb-4">
            Select your specialization within <span className="font-semibold text-ink">{q1SelectedDegree}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {specs.map((spec) => {
              const isSelected = q1SelectedSpecialization === spec.value;
              return (
                <motion.button
                  key={spec.value}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleQ1SpecializationSelect(spec.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500 text-white shadow-brand'
                      : 'border-line bg-surface text-ink hover:border-brand-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-5 h-5 shrink-0 flex items-center justify-center border-2 rounded-md ${
                      isSelected ? 'border-white bg-white' : 'border-line-strong'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: '#2563eb' }} />}
                    </span>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-ink'}`}>
                      {spec.label}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSkillGroups = () => {
    if (!skillGroups) return null;
    const atMax = selected.length >= maxSelect;
    return (
      <div className="mt-8 max-h-[60vh] overflow-y-auto pr-1">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-ink-3">
            <span className="font-semibold text-brand-600">{selected.length}</span> / {maxSelect} selected
          </p>
          {atMax && <p className="text-xs text-ink-3">Maximum reached</p>}
        </div>
        {Object.entries(skillGroups).map(([groupName, skills]) => (
          <SkillGroupSection
            key={groupName}
            groupName={groupName}
            skills={skills}
            selected={selected}
            onToggle={handleSelect}
            disabled={atMax}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-paper-gradient">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 lg:py-14">
        <div className="flex items-center justify-between mb-8">
          <BackLink onClick={handleBack} />
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-3 font-medium bg-white/80 border border-line rounded-full px-3 py-1.5 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${accentClass} glow-dot`} />
            {Math.round(((currentQ + 1) / total) * 100)}% there
          </span>
        </div>

        <div className="bg-white border border-line rounded-[1.6rem] shadow-card p-6 sm:p-8">
          <StepIndicator currentStep={currentQ} totalSteps={total} accentClass={accentClass} />

          <div className="mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={isQ1 ? `q1-${q1Phase}` : currentQ}
                initial={{ opacity: 0, x: direction === 'right' ? 24 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 'right' ? -24 : 24 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="eyebrow text-ink-3 mb-3">
                      {isQ1 && q1Phase === 'specialization'
                        ? 'Select your specialization'
                        : question.type === 'multiple'
                          ? `Choose${maxSelect < Infinity ? ` up to ${maxSelect}` : ' all that apply'}`
                          : 'Choose one'}
                    </p>
                    <h1 className="font-ui font-bold text-[1.9rem] sm:text-[2.3rem] text-ink tracking-[-0.025em] leading-tight text-balance">
                      {isQ1 && q1Phase === 'specialization'
                        ? `What is your specialization in ${q1SelectedDegree}?`
                        : question.question}
                    </h1>
                    {question.subtitle && !isQ1 && (
                      <p className="mt-2 text-sm text-ink-3">{question.subtitle}</p>
                    )}
                    {hint && (
                      <p className="mt-3 flex items-start gap-2 text-sm text-ink-3 leading-relaxed">
                        <HelpCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {hint}
                      </p>
                    )}
                  </div>
                </div>

                {missingContext ? (
                  <div className="mt-8 bg-paper border border-line rounded-xl p-6">
                    <p className="text-sm text-ink-2 leading-relaxed">
                      Choose your degree first so we can show options that fit it. Go back and pick a degree to continue.
                    </p>
                  </div>
                ) : isQ1 ? (
                  renderGraduateQ1()
                ) : skillGroups ? (
                  renderSkillGroups()
                ) : (
                  <div className={`mt-8 space-y-2.5 ${question.type === 'multiple' ? '' : 'sm:grid sm:grid-cols-2 sm:space-y-0 sm:gap-2.5'}`}>
                    {effectiveOptions.map((option, i) => {
                      const isSelected = selected.includes(option.value);
                      return (
                        <motion.button
                          key={option.value}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: 0.04 * Math.min(i, 20) }}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelect(option.value)}
                          aria-pressed={isSelected}
                          className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'border-brand-500 bg-brand-500 text-white shadow-brand'
                              : 'border-line bg-surface text-ink hover:border-brand-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span
                              className={`w-5 h-5 shrink-0 flex items-center justify-center border-2 transition-all ${
                                question.type === 'multiple' ? 'rounded-md' : 'rounded-full'
                              } ${
                                isSelected ? 'border-white bg-white' : 'border-line-strong'
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: '#2563eb' }} />
                              )}
                            </span>
                            <span className="flex items-center gap-3 min-w-0">
                              {option.emoji && (
                                <span className="text-[1.1rem] leading-none shrink-0" aria-hidden="true">
                                  {option.emoji}
                                </span>
                              )}
                              <span className={`font-medium ${isSelected ? 'text-white' : 'text-ink'}`}>
                                {option.label}
                              </span>
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 pt-6 border-t border-line">
            {selectedLabels.length > 0 && question.type === 'multiple' && !isQ1 && (
              <p className="mb-4 text-sm text-ink-3">
                Selected: <span className="text-ink font-medium">{selectedLabels.join(', ')}</span>
              </p>
            )}
            {isQ1 && q1Phase === 'degree' && q1SelectedDegree && (
              <p className="mb-4 text-sm text-ink-3">
                Selected: <span className="text-ink font-medium">{q1SelectedDegree}</span>
              </p>
            )}
            {isQ1 && q1Phase === 'specialization' && q1SelectedSpecialization && (
              <p className="mb-4 text-sm text-ink-3">
                Selected: <span className="text-ink font-medium">{q1SelectedDegree}</span> &rsaquo; <span className="text-ink font-medium">{q1SelectedSpecialization}</span>
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-3">
                Question {currentQ + 1} of {total}
              </span>
              <Button
                onClick={handleNext}
                disabled={!canContinue}
                shine
              >
                {currentQ === total - 1 ? 'See my path' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GraduateDegreeGroup({ category, emoji, degrees, selectedDegree, onSelect }) {
  const [expanded, setExpanded] = useState(true);
  const hasSelected = degrees.some((d) => d.label === selectedDegree);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${hasSelected ? 'border-brand-300 bg-brand-50/30' : 'border-line bg-white'}`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-paper/50 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-lg">{emoji}</span>
          <span className="font-semibold text-ink text-sm">{category}</span>
          {hasSelected && (
            <span className="text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full">
              {selectedDegree}
            </span>
          )}
        </span>
        {expanded ? <ChevronUp className="w-4 h-4 text-ink-3" /> : <ChevronDown className="w-4 h-4 text-ink-3" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {degrees.map((deg) => {
                const isSelected = selectedDegree === deg.label;
                return (
                  <button
                    key={deg.label}
                    type="button"
                    onClick={() => onSelect(deg.label)}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-brand-500 text-white shadow-brand'
                        : 'bg-paper hover:bg-brand-50 text-ink hover:text-brand-700 border border-transparent hover:border-brand-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={3} />}
                      <span>{deg.label}</span>
                      {!isSelected && (
                        <span className="text-xs text-ink-3 ml-auto">{'\u203A'}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
