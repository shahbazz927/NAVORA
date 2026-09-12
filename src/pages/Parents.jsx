import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Users,
  ShieldCheck,
  Scale,
  GraduationCap,
  Wallet,
  Sparkles,
  Check,
  School,
  University,
  Backpack,
  Briefcase,
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Swoosh from '../components/Swoosh';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedPage';
import { useScrollTop } from '../hooks/useLocalStorage';
import { useUser } from '../context/UserContext';
import { personas } from '../data/personas';

const pillars = [
  {
    icon: GraduationCap,
    title: 'Education pathways',
    copy: 'Streams after 10th, courses and colleges after 12th, career moves after graduation — the real structure of the system, explained without jargon.',
  },
  {
    icon: Scale,
    title: 'Honest comparisons',
    copy: 'Colleges weighed on fees, reputation, placement records, and fit — so you can weigh value, not just rankings.',
  },
  {
    icon: Wallet,
    title: 'Clear on cost',
    copy: 'Budgets, scholarships, and education loans laid out plainly, so financial decisions are made with open eyes.',
  },
  {
    icon: ShieldCheck,
    title: 'Trustworthy guidance',
    copy: 'No pressure, no hype, no sponsored lists. Just honest reasoning you can verify — and share with your child.',
  },
];

const questionsParentsAsk = [
  { q: 'What should my child do after Class 10?', a: 'We map interests and strengths to MPC, BiPC, Commerce, Arts, or vocational paths — with honest trade-offs for each.' },
  { q: 'Which college gives the best return?', a: 'Compare fee, placement record, and alumni outcomes side by side, instead of chasing a single ranking.' },
  { q: 'Is this course future-proof?', a: 'We show real growth outlooks and where each path leads — so you can weigh stability against ambition.' },
  { q: 'What will it really cost?', a: 'Tuition, living costs, scholarships, and loan options — laid out as a plan you can discuss together.' },
];

const stageGrid = [
  { icon: School, label: 'After Class 10', text: 'The stream decision — and why it rarely locks you in forever.' },
  { icon: GraduationCap, label: 'After Class 12', text: 'Courses, entrance exams, and colleges matched to your child\'s stream.' },
  { icon: University, label: 'After Graduation', text: 'Career moves — higher studies, certifications, or a considered switch.' },
];

const parentPaths = [
  {
    id: 'class10',
    title: 'Class 10',
    copy: 'Explore streams, subjects and future career options for your child after Class 10.',
    cta: 'Explore Class 10',
    icon: Backpack,
  },
  {
    id: 'class12',
    title: 'Class 12',
    copy: 'Compare courses, entrance exams, colleges and career opportunities after Class 12.',
    cta: 'Explore Class 12',
    icon: GraduationCap,
  },
  {
    id: 'graduate',
    title: 'Graduation',
    copy: 'Plan higher studies, career options, skills and the next practical step after graduation.',
    cta: 'Explore Graduation',
    icon: Briefcase,
  },
];

export default function Parents() {
  useScrollTop();
  const navigate = useNavigate();
  const { setUserType } = useUser();

  const startFlow = () => {
    setUserType('parent');
    navigate('/assessment');
  };

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden bg-paper-gradient">
        <div className="absolute -top-40 -right-32 w-[32rem] h-[32rem] rounded-full bg-brand-400/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-[28rem] h-[28rem] rounded-full bg-cyan-300/10 blur-3xl pointer-events-none" />
        <Swoosh variant="light" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <FadeIn className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-brand-100 px-4 py-1.5 shadow-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-brand-500 glow-dot" />
                <span className="eyebrow text-brand-700">For parents &amp; guardians</span>
              </span>

              <h1 className="font-ui font-bold text-[2.6rem] leading-[1.06] sm:text-6xl text-ink text-balance tracking-[-0.03em]">
                You want the best for them. Let&rsquo;s make it{' '}
                <em className="font-display italic font-medium text-gradient">clear</em>.
              </h1>

              <p className="mt-7 text-lg text-ink-2 leading-relaxed max-w-xl">
                Fees, rankings, safety, future-proof careers — you&rsquo;re balancing a
                lot. NAVORA lays the options out transparently, so you can guide your
                child with confidence, not guesswork.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link to="/assessment" onClick={() => setUserType('parent')}>
                  <Button size="lg" shine>
                    Guide with confidence
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/advisor">
                  <Button size="lg" variant="secondary">
                    <Sparkles className="w-4 h-4" />
                    Ask a question
                  </Button>
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                {['Transparent costs', 'No pressure', 'Private by design'].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1.5 text-sm text-ink-2">
                    <span className="w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                    </span>
                    {label}
                  </span>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15} className="lg:col-span-5">
              <div className="relative max-w-md mx-auto lg:ml-auto">
                <div className="absolute -inset-5 bg-gradient-to-br from-brand-200/60 via-transparent to-purple/20 rounded-[2.6rem] rotate-1 blur-sm pointer-events-none" />
                <div className="relative bg-white rounded-[1.6rem] border border-line shadow-card-lg p-7">
                  <div className="flex items-center gap-3 pb-5 border-b border-line">
                    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-indigo text-white flex items-center justify-center">
                      <Users className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-ui font-semibold text-ink">A parent&rsquo;s guide</p>
                      <p className="text-xs text-ink-3">The decisions ahead, in order</p>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {questionsParentsAsk.map((item, i) => (
                      <li key={item.q} className="flex gap-3.5">
                        <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 font-ui font-semibold text-xs">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-ui font-semibold text-sm text-ink">{item.q}</p>
                          <p className="mt-0.5 text-[0.83rem] text-ink-2 leading-relaxed">{item.a}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Choose a path */}
      <section className="bg-paper border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <FadeIn className="max-w-2xl mb-12">
            <p className="eyebrow text-brand-600 mb-3">Choose your child&rsquo;s path</p>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
              Where is your child right now?
            </h2>
            <p className="mt-4 text-ink-2 leading-relaxed">
              Pick the stage that fits — the questions, comparisons, and recommendations change for each.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {parentPaths.map((item, index) => {
              const Icon = item.icon;
              const persona = personas[item.id];
              return (
                <FadeIn key={item.id} delay={0.06 * index} className="h-full">
                  <motion.button
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={startFlow}
                    className="group text-left w-full h-full bg-white border border-line rounded-[1.4rem] p-8 sm:p-9 hover:shadow-card-lg hover:border-brand-200 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: persona.accentSoft, color: persona.accentColor }}
                      >
                        <Icon className="w-7 h-7" strokeWidth={1.75} />
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
                        style={{ color: persona.accentColor }}
                      >
                        {item.cta}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                    <h3 className="mt-7 font-ui font-bold text-[1.75rem] text-ink leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-[0.95rem] text-ink-2 leading-relaxed">
                      {item.copy}
                    </p>
                  </motion.button>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-surface border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <FadeIn className="max-w-2xl mb-12">
            <p className="eyebrow text-brand-600 mb-3">What parents get</p>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
              Decision support, built for the whole family.
            </h2>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 gap-5">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <StaggerItem key={p.title}>
                  <div className="h-full bg-paper border border-line rounded-[1.4rem] p-8 card-lift hover:border-brand-200">
                    <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-5 font-ui font-semibold text-lg text-ink">{p.title}</h3>
                    <p className="mt-2 text-sm text-ink-2 leading-relaxed">{p.copy}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Stage context */}
      <section className="bg-paper border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-brand-600 mb-3">Where your child is</p>
              <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
                Guidance changes with each stage — and so does ours.
              </h2>
              <p className="mt-4 text-ink-2 leading-relaxed">
                NAVORA tailors every recommendation to your child&rsquo;s current stage,
                interests, and your priorities — not a one-size-fits-all list.
              </p>
              <div className="mt-7">
                <Link to="/assessment" onClick={() => setUserType('parent')}>
                  <Button variant="navy" size="lg">
                    Start for your child
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </FadeIn>

            <div className="lg:col-span-7 space-y-4">
              {stageGrid.map((item, i) => {
                const Icon = item.icon;
                return (
                  <FadeIn key={item.label} delay={0.06 * i}>
                    <div className="flex gap-5 bg-surface border border-line rounded-[1.4rem] p-6 card-lift hover:border-brand-200">
                      <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shrink-0 shadow-brand">
                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="eyebrow text-brand-600 mb-1">{item.label}</p>
                        <p className="text-ink-2 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-90" />
        <Swoosh variant="dark" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-600/30 blur-3xl animate-pulse-glow" />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center">
          <FadeIn>
            <Logo size="md" tone="light" onSurface className="mb-6" />
            <h2 className="font-ui font-bold text-4xl sm:text-5xl tracking-[-0.03em] text-balance">
              Help them choose with confidence.
            </h2>
            <p className="mt-5 text-white/80 text-lg leading-relaxed max-w-xl mx-auto">
              A few honest questions about your child&rsquo;s stage and priorities — and
              you&rsquo;ll have a clear, transparent plan for the decisions ahead.
            </p>
            <div className="mt-9">
              <Link to="/assessment" onClick={() => setUserType('parent')}>
                <Button size="xl" className="bg-brand-500 text-white hover:bg-brand-600 shadow-brand" shine>
                  Start the parent journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
