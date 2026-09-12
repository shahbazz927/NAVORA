import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MessageCircle,
  Compass,
  Scale,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import Button from '../components/Button';
import Swoosh from '../components/Swoosh';
import { FadeIn } from '../components/AnimatedPage';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import { personas } from '../data/personas';
import { recommendationDescriptions, getRecommendation } from '../data/recommendations';
import { getStudentContext } from '../data/streamConfig';
import AICareerAdvisor from '../components/ai/AICareerAdvisor';

export default function Dashboard() {
  useScrollTop();
  const { userType, answers, onboardingData, comparisonItems } = useUser();

  // The assessment stores the student Graduation journey as "graduation", but
  // the persona / description / recommendation engine speaks "graduate". Map it
  // so a normal Graduation student gets graduation-appropriate content and never
  // the parent default ("A Clear Plan for Your Child's Education"). Parent
  // journeys keep userType "parent" and are left untouched here.
  const stageUserType = userType === 'graduation' ? 'graduate' : userType;
  const persona = personas[stageUserType];
  const hasProfile = !!userType;
  const answersCount = Object.keys(answers || {}).length;
  const name = onboardingData?.name?.trim();
  const Icon = persona?.icon || Compass;
  const rec = hasProfile ? getRecommendation(stageUserType, answers) : null;
  const context = hasProfile ? getStudentContext(stageUserType, answers) : null;
  const hasContext = !!(context && (context.stream || context.field || context.selections.length > 0));

  const steps = [
    { label: 'Tell us who you are', done: !!userType, to: '/get-started' },
    { label: 'Answer the questions', done: answersCount > 0, to: userType ? `/questions/${userType}` : '/get-started' },
    { label: 'See your path', done: false, to: userType ? `/recommendations/${userType}` : '/get-started' },
  ];

  const greeting = name
    ? `Good to see you${persona ? ', ' + name : ''}.`
    : 'Good to see you.';

  const nextStep = steps.find((s) => !s.done);

  return (
    <div className="min-h-screen bg-paper-gradient">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 lg:py-14">
        {/* Header */}
        <FadeIn>
          {persona && (
            <span
              className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-4 py-1.5 mb-5"
              style={{ backgroundColor: persona.accentSoft, color: persona.accentColor }}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              {persona.title}
            </span>
          )}
          <h1 className="font-ui font-bold text-4xl sm:text-5xl text-ink tracking-[-0.03em] text-balance">
            {greeting}
          </h1>
          <p className="mt-4 text-lg text-ink-2 leading-relaxed max-w-xl">
            {hasProfile
              ? (recommendationDescriptions[stageUserType] || 'Your guidance, in one place.')
              : 'A quiet place to plan your next step. Start by telling us where you are.'}
          </p>
        </FadeIn>

        {/* Student context card */}
        {hasContext && (
          <FadeIn delay={0.05} className="mt-8">
            <div className="bg-white border border-line rounded-[1.4rem] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-ink-3 mb-3">Built around your context</p>
                {answers.lastSavedAt && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1"
                    title="Your latest saved answer"
                  >
                    <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                    Saved {new Date(answers.lastSavedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
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

        {/* Recommended pathway / next action */}
        {hasProfile && rec && (
          <FadeIn delay={0.08} className="mt-10">
            <div className="bg-brand-950 text-white rounded-[1.6rem] p-8 sm:p-9 relative overflow-hidden shadow-card-lg">
              <div className="absolute inset-0 bg-mesh-dark opacity-90" />
              <Swoosh variant="dark" />
              <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-brand-600/35 blur-3xl" />
              <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-purple/20 blur-3xl" />
              <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-cyan-300 glow-dot" />
                    <p className="eyebrow text-white/60">Your recommended pathway</p>
                  </div>
                  <h2 className="font-ui font-bold text-3xl sm:text-4xl tracking-[-0.02em]">
                    {rec.title}
                  </h2>
                  <p className="mt-3 text-white/75 leading-relaxed max-w-md">
                    {rec.description}
                  </p>
                  {rec.fitSummary && (
                    <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/90 bg-white/10 border border-white/10 rounded-full px-4 py-2">
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      {rec.fitSummary}
                    </p>
                  )}
                </div>
                <div className="lg:justify-self-end w-full max-w-sm">
                  <div className="bg-white/[0.07] border border-white/10 rounded-[1.3rem] p-6 backdrop-blur-sm">
                    <p className="eyebrow text-cyan-300 mb-3">What should I do next?</p>
                    <p className="text-white/90 leading-relaxed">
                      {nextStep
                        ? nextStep.label
                        : 'Review your recommendations, then ask the advisor anything.'}
                    </p>
                    <div className="mt-5">
                      <Link to={nextStep ? nextStep.to : `/recommendations/${userType}`} className="w-full">
                        <Button className="bg-brand-500 text-white hover:bg-brand-600 shadow-brand" fullWidth>
                          {nextStep ? (nextStep.done ? 'Continue' : 'Start') : 'Review my path'}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Actions */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          <FadeIn delay={0.15}>
            <Link to={userType ? `/recommendations/${userType}` : '/get-started'} className="block group h-full">
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
                  Get follow-up answers in plain language, any time.
                </p>
              </div>
            </Link>
          </FadeIn>
        </div>

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
            user's saved answers for their profile. Only when a profile exists. */}
        {hasProfile && (
          <FadeIn delay={0.25} className="mt-10">
            <AICareerAdvisor userType={stageUserType} />
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