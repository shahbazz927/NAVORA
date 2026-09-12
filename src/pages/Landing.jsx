import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Compass,
  Scale,
  MessageCircle,
  BookOpen,
  Check,
  Zap,
  GraduationCap,
  School,
  University,
  Users,
  Target,
  Lightbulb,
  Lock,
  Landmark,
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Swoosh from '../components/Swoosh';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedPage';
import { useScrollTop } from '../hooks/useLocalStorage';
import { personas } from '../data/personas';

const journey = [
  {
    title: 'Confusion',
    copy: 'Every decision — stream, course, college — feels permanent. Lakhs of students choose in the dark every year.',
  },
  {
    title: 'Understanding',
    copy: 'One honest conversation about what you enjoy, how you learn, and what actually matters.',
  },
  {
    title: 'Clarity',
    copy: 'Your options, compared on the things that matter to you — not a generic list of courses.',
  },
  {
    title: 'Confidence',
    copy: 'You move forward knowing the choice is yours, and that it was made well.',
  },
];

const ecosystem = [
  { icon: School, label: 'CBSE', sub: 'Schools & boards' },
  { icon: School, label: 'ICSE', sub: 'Schools & boards' },
  { icon: Landmark, label: 'State Boards', sub: 'Regional streams' },
  { icon: University, label: 'Colleges', sub: 'Courses & campuses' },
  { icon: University, label: 'Universities', sub: 'Degrees & research' },
  { icon: GraduationCap, label: 'Educators', sub: 'Teachers & mentors' },
  { icon: Users, label: 'Students', sub: 'After 10th & 12th' },
  { icon: Users, label: 'Parents', sub: 'Decision partners' },
];

const features = [
  {
    icon: Compass,
    title: 'Choose Your Stream',
    copy: 'MPC, BiPC, Commerce, Arts — see which stream genuinely fits how you think, learn, and what you love. Not a generic list — a reasoned fit.',
    point: 'After 10th',
    tone: 'primary',
  },
  {
    icon: Scale,
    title: 'Compare Options',
    copy: 'Courses, colleges, and careers weighed side by side on fit, growth, and cost. The facts that actually differ — shown plainly.',
    point: 'Decision support',
    tone: 'accent',
  },
  {
    icon: Sparkles,
    title: 'AI Guidance',
    copy: 'An advisor that answers follow-ups in plain language — courses, exams, budgets, timelines — grounded in your situation.',
    point: 'Always available',
    tone: 'ai',
  },
  {
    icon: BookOpen,
    title: 'Entrance & Exams',
    copy: 'The gates that matter — JEE, NEET, CUET, CLAT, and more — mapped to the paths that need them, so nothing creeps up on you.',
    point: 'Class 12',
    tone: 'primary',
  },
  {
    icon: Target,
    title: 'Career Insights',
    copy: 'Honest outlooks on where each path leads — pay, growth, and effort — so you choose with open eyes, not hype.',
    point: 'Any stage',
    tone: 'accent',
  },
  {
    icon: Lock,
    title: '100% Private',
    copy: 'Your answers stay on your device. No account, no tracking, no selling your data. Guidance that respects your privacy.',
    point: 'By design',
    tone: 'primary',
  },
];

const class10Streams = [
  { name: 'MPC', desc: 'Maths, Physics, Chemistry — engineering, tech & research.', tag: 'JEE · NDA · BITSAT' },
  { name: 'BiPC', desc: 'Biology, Physics, Chemistry — medicine, pharmacy & life sciences.', tag: 'NEET · AIIMS' },
  { name: 'Commerce', desc: 'Accounts, Economics, Business — finance, CA, entrepreneurship.', tag: 'CA · CUET' },
  { name: 'Arts / Humanities', desc: 'Literature, History, Pol. Science — law, media, design, psychology.', tag: 'CLAT · CUET' },
  { name: 'Diploma / Polytechnic', desc: 'Hands-on engineering diplomas with lateral-entry doors.', tag: 'JEECUP · State' },
  { name: 'ITI / Vocational', desc: 'Practical, employable trade skills with quick entry.', tag: 'Trades & crafts' },
];

const class10NotDecided = {
  name: 'Not Decided Yet',
  desc: 'Completely fine. Answer a few honest questions and we’ll help you figure it out together.',
};

export default function Landing() {
  useScrollTop();

  return (
    <div className="bg-surface">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-paper-gradient">
        <div className="absolute -top-48 -right-40 w-[36rem] h-[36rem] rounded-full bg-brand-400/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-48 w-[30rem] h-[30rem] rounded-full bg-cyan-300/10 blur-3xl pointer-events-none" />
        <Swoosh variant="light" />

        <div className="glass-premium relative max-w-7xl mx-auto px-6 sm:px-10 pt-10 pb-20 lg:pt-12 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-12 items-center">
            <FadeIn className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-brand-100 px-4 py-1.5 shadow-sm mb-8">
                <Logo size="sm" className="mr-1" />
                <span className="eyebrow text-brand-700">AI-Powered Education Guidance</span>
              </span>

              <h1 className="font-ui font-bold text-[2.7rem] leading-[1.04] sm:text-6xl lg:text-[4rem] text-ink text-balance tracking-[-0.03em]">
                Choosing your future shouldn&rsquo;t feel like a{' '}
                <em className="font-display italic font-medium text-gradient">gamble</em>.
              </h1>

              <p className="mt-7 text-lg text-ink-2 leading-relaxed max-w-xl">
                Stream, course, college, career — every choice feels permanent, and
                everyone has an opinion. NAVORA helps you understand your real options,
                compare them honestly, and decide with confidence.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link to="/get-started">
                  <Button size="lg" shine>
                    Start Your Path
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/advisor">
                  <Button size="lg" variant="secondary">
                    <MessageCircle className="w-4 h-4" />
                    Ask the AI Advisor
                  </Button>
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                {['Free', 'Private', 'Takes about two minutes'].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1.5 text-sm text-ink-2">
                    <span className="w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                    </span>
                    {label}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* Product preview */}
            <FadeIn delay={0.15} className="lg:col-span-6">
              <div className="relative max-w-lg mx-auto lg:ml-auto">
                <div className="absolute -inset-5 bg-gradient-to-br from-brand-200/60 via-brand-100/30 to-cyan-200/50 rounded-[2.6rem] rotate-1 blur-sm pointer-events-none" />
                <div className="absolute -inset-6 rounded-[2.8rem] border border-white/70" />

                <div className="relative bg-white rounded-[1.6rem] shadow-card-lg overflow-hidden">
                  {/* window bar */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper">
                    <div className="flex items-center gap-2">
                      <Logo size="sm" />
                      <span className="text-xs font-medium text-ink-3">YOUR ASSESSMENT</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1">
                      <Zap className="w-3 h-3" />
                      2-minute
                    </span>
                  </div>

                  <div className="px-6 py-6 sm:px-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="eyebrow text-ink-3">QUESTION 2 OF 5</span>
                      <span className="text-xs font-medium text-ink-3">70%</span>
                    </div>
                    <div className="w-full h-1.5 bg-paper-deep rounded-full overflow-hidden mb-7">
                      <div className="h-full bg-gradient-to-r from-brand-500 via-purple to-cyan rounded-full" style={{ width: '70%' }} />
                    </div>

                    <h3 className="font-ui font-semibold text-xl text-ink leading-snug text-balance">
                      How do you prefer to learn new things?
                    </h3>

                    <div className="space-y-2.5 mt-5">
                      {[
                        { label: 'Hands-on experiments and tinkering', state: 'active' },
                        { label: 'Problem-solving and puzzles' },
                        { label: 'Creative projects and stories' },
                        { label: 'Reading and research' },
                      ].map((opt) => (
                        <div
                          key={opt.label}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-colors ${
                            opt.state === 'active'
                              ? 'border-brand-300 bg-brand-50/70 text-ink shadow-sm'
                              : 'border-line text-ink-2'
                          }`}
                        >
                          <span className="font-medium">{opt.label}</span>
                          {opt.state === 'active' ? (
                            <span className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full border-2 border-line-strong shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-5 border-t border-line flex items-center justify-between">
                      <span className="text-xs text-ink-3">Personalized as you go</span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 bg-brand-50 border border-brand-100 rounded-xl px-4 py-2">
                        Continue <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-7 -left-3 sm:-left-8 flex items-center gap-3 bg-white/95 backdrop-blur border border-line rounded-xl shadow-card-lg px-4 py-3 animate-float-slow">
                  <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-indigo text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-ui font-semibold text-ink text-sm leading-none">Matches as you go</p>
                    <p className="text-xs text-ink-3 mt-1">No guesswork, just clarity</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Trust / Education ecosystem ─────────────────── */}
      <section className="border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20">
          <FadeIn className="max-w-2xl mb-10">
            <p className="eyebrow text-brand-600 mb-3">Built for the education ecosystem</p>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
              One platform for every stage of the journey.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0">
            {ecosystem.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.label} delay={0.03 * i}>
                  <div className="flex items-center gap-3 md:border-r md:border-line md:px-6 md:first:pl-0 md:last:pr-0">
                    <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-ui font-semibold text-ink">{item.label}</p>
                      <p className="text-xs text-ink-3">{item.sub}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EXPLORE · COMPARE · DECIDE ──────────────────── */}
      <section className="bg-brand-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-90" />
        <Swoosh variant="dark" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-600/30 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-purple/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <FadeIn className="lg:col-span-7">
              <p className="eyebrow text-brand-300 mb-5">Your method</p>
              <div className="font-ui font-bold tracking-[-0.03em] leading-[1.05]">
                <p className="text-3xl sm:text-5xl">EXPLORE<span className="text-brand-400">.</span></p>
                <p className="text-3xl sm:text-5xl mt-2">COMPARE<span className="text-brand-400">.</span></p>
                <p className="text-3xl sm:text-5xl mt-2 text-gradient">DECIDE<span className="text-brand-400">.</span></p>
              </div>
              <p className="mt-7 text-lg text-white/80 leading-relaxed max-w-xl">
                Everything you need after 10th, 12th &amp; Graduation — in one place.
              </p>
              <div className="mt-9">
                <Link to="/get-started">
                  <Button size="lg" className="bg-brand-500 text-white hover:bg-brand-600" shine>
                    Start exploring
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </FadeIn>

            <div className="lg:col-span-5 space-y-4">
              {[
                { icon: Compass, title: 'Explore', copy: 'See the paths that actually fit who you are.' },
                { icon: Scale, title: 'Compare', copy: 'Weigh options on the things that truly differ.' },
                { icon: Target, title: 'Decide', copy: 'Move forward knowing the choice is yours — and made well.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <FadeIn key={item.title} delay={0.1 * i}>
                    <div className="flex gap-5 bg-white/5 border border-white/10 rounded-[1.4rem] p-6 backdrop-blur-sm">
                      <span className="w-11 h-11 rounded-xl bg-white/10 text-spark-300 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                      </span>
                      <div>
                        <h3 className="font-ui font-semibold text-white">{item.title}</h3>
                        <p className="mt-1 text-sm text-white/70 leading-relaxed">{item.copy}</p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature system ──────────────────────────────── */}
      <section className="bg-paper border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <FadeIn className="max-w-2xl mb-14">
            <p className="eyebrow text-brand-600 mb-3">Everything you need</p>
            <h2 className="font-ui font-bold text-3xl sm:text-5xl text-ink tracking-[-0.03em] text-balance">
              Guidance that works the way decisions do.
            </h2>
            <p className="mt-5 text-lg text-ink-2 leading-relaxed">
              Not a list of features — a complete system for the choices ahead of you.
            </p>
          </FadeIn>

          {/* Large feature block */}
          <FadeIn delay={0.1}>
            <div className="grid lg:grid-cols-2 gap-10 items-center bg-surface border border-line rounded-[1.75rem] p-8 sm:p-12 shadow-card overflow-hidden">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 mb-6">
                  <GraduationCap className="w-3.5 h-3.5" />
                  After 10th
                </span>
                <h3 className="font-ui font-bold text-3xl text-ink tracking-[-0.02em] text-balance">
                  The stream is the first fork. Choose it well.
                </h3>
                <p className="mt-4 text-ink-2 leading-relaxed">
                  From MPC to BiPC, Commerce to Arts, Diploma to vocational skills —
                  NAVORA shows you what each stream really leads to, and which one fits
                  how you think. Still unsure? That&rsquo;s exactly what we&rsquo;re for.
                </p>
                <div className="mt-7">
                  <Link to="/get-started">
                    <Button>
                      Choose my stream
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-brand-100 via-transparent to-cyan-100/60 rounded-[2rem] blur-md pointer-events-none" />
                <div className="relative bg-white border border-line rounded-2xl p-6 shadow-card">
                  <p className="eyebrow text-ink-3 mb-5">Streams after 10th</p>
                  <div className="space-y-2.5">
                    {class10Streams.map((s) => (
                      <div key={s.name} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-line hover:border-brand-200 transition-colors">
                        <span className="font-ui font-semibold text-ink text-sm">{s.name}</span>
                        <span className="hidden sm:inline-flex text-[0.7rem] font-medium text-ink-3 bg-paper border border-line rounded-full px-2.5 py-1">{s.tag}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-dashed border-brand-300 bg-brand-50/50">
                      <span className="font-ui font-semibold text-brand-700 text-sm">{class10NotDecided.name}</span>
                      <span className="text-[0.7rem] font-medium text-brand-700">We help you find it</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Asymmetric grid */}
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const ai = feature.tone === 'ai';
              return (
                <FadeIn key={feature.title} delay={0.05 * i}>
                  <div className={`h-full bg-surface border rounded-[1.4rem] p-7 card-lift ${ai ? 'border-brand-200 premium-card' : 'border-line hover:border-brand-200'}`}>
                    <div className="flex items-start justify-between">
                      <span className={`w-12 h-12 rounded-xl flex items-center justify-center ${ai ? 'bg-gradient-to-br from-brand-500 via-purple to-cyan text-white shadow-brand' : 'bg-brand-50 text-brand-600'}`}>
                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                      </span>
                      <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-3 bg-paper border border-line rounded-full px-2.5 py-1">
                        {feature.point}
                      </span>
                    </div>
                    <h3 className="mt-6 font-ui font-semibold text-lg text-ink">{feature.title}</h3>
                    <p className="mt-2 text-sm text-ink-2 leading-relaxed">{feature.copy}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Who it's for / personas ─────────────────────── */}
      <section className="bg-surface border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <FadeIn className="max-w-2xl mb-12">
            <p className="eyebrow text-brand-600 mb-3">Who it&rsquo;s for</p>
            <h2 className="font-ui font-bold text-3xl sm:text-5xl text-ink tracking-[-0.03em] text-balance">
              Your questions are different. So is your guidance.
            </h2>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 gap-5">
            {Object.values(personas).map((persona) => (
              <StaggerItem key={persona.id}>
                <Link to="/get-started" className="block group h-full">
                  <div className="bg-paper border border-line rounded-[1.4rem] p-8 h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-card-lg group-hover:border-brand-200">
                    <div className="flex items-start justify-end">
                      <span className="w-9 h-9 rounded-full border border-line bg-white flex items-center justify-center group-hover:bg-brand-500 group-hover:border-brand-500 transition-colors">
                        <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-white transition-colors" />
                      </span>
                    </div>
                    <p className="eyebrow mt-6" style={{ color: persona.accentColor }}>
                      {persona.title}
                    </p>
                    <h3 className="mt-2 font-ui font-bold text-2xl text-ink leading-snug text-balance">
                      {persona.tone.heading}
                    </h3>
                    <p className="mt-3 text-sm text-ink-2 leading-relaxed">
                      {persona.tone.intro}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── The journey ─────────────────────────────────── */}
      <section className="bg-paper border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <FadeIn className="max-w-2xl mb-12">
            <p className="eyebrow text-brand-600 mb-3">The problem</p>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
              The future is big. The advice you get shouldn&rsquo;t be vague.
            </h2>
            <p className="mt-4 text-ink-2 leading-relaxed">
              Right now, most guidance is a loud opinion: &ldquo;Do engineering,&rdquo;
              &ldquo;Commerce is safe,&rdquo; &ldquo;Go abroad.&rdquo; But the right answer
              isn&rsquo;t a category — it&rsquo;s a fit. Here&rsquo;s how NAVORA moves
              you forward, one honest step at a time.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-[1.4rem] overflow-hidden shadow-card">
              {journey.map((step, i) => (
                <div key={step.title} className="bg-surface p-8 card-lift">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white font-display italic text-base flex items-center justify-center shadow-brand">
                      {i + 1}
                    </span>
                  <h3 className="mt-5 font-ui font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-2 leading-relaxed">{step.copy}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Why NAVORA ──────────────────────────────────── */}
      <section className="bg-surface border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-brand-600 mb-3">Why NAVORA</p>
              <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
                A guide that treats you like a person, not a demographic.
              </h2>
              <p className="mt-4 text-ink-2 leading-relaxed">
                We don&rsquo;t have a &ldquo;best course&rdquo; to sell you. We have a
                method — built on real decision-making — that helps you
                see your own options clearly.
              </p>
              <Link to="/get-started" className="inline-block mt-6">
                <Button variant="navy" size="lg">
                  Find my path
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </FadeIn>

            <StaggerContainer className="lg:col-span-7 space-y-4">
              {[
                { icon: Lightbulb, title: 'Built around you', copy: 'Your interests, strengths, learning style, and budget — not a one-size-fits-all list.' },
                { icon: Scale, title: 'Compare honestly', copy: 'Weights, trade-offs, and costs shown plainly. No exaggerated promises, no pressure.' },
                { icon: MessageCircle, title: 'Ask when you\'re stuck', copy: 'An AI advisor that answers follow-ups in plain language, whenever questions come up.' },
              ].map((reason) => {
                const Icon = reason.icon;
                return (
                  <StaggerItem key={reason.title}>
                    <div className="flex gap-5 bg-surface border border-line rounded-[1.4rem] p-6 card-lift hover:border-brand-200">
                      <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shrink-0 shadow-brand">
                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                      </span>
                      <div>
                        <h3 className="font-ui font-semibold text-ink">{reason.title}</h3>
                        <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">{reason.copy}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className="bg-brand-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-90" />
        <div className="absolute inset-0 bg-noise opacity-60" />
        <Swoosh variant="dark" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-600/30 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-purple/20 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
          <FadeIn>
            <span className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 via-purple to-cyan shadow-glow items-center justify-center mb-7">
              <Compass className="w-8 h-8 text-white" strokeWidth={1.5} />
            </span>
            <h2 className="font-ui font-bold text-4xl sm:text-5xl tracking-[-0.03em] text-balance">
              You don&rsquo;t need another opinion. You need clarity.
            </h2>
            <p className="mt-5 text-white/80 text-lg leading-relaxed max-w-xl mx-auto">
              Answer a few honest questions and see your path laid out — compared,
              explained, and free of guesswork.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/get-started">
                 <Button size="lg" className="bg-brand-500 text-white hover:bg-brand-600" shine>
                  Start Your Path
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/advisor">
                <Button size="xl" variant="glass">
                  <MessageCircle className="w-5 h-5" />
                  Talk to the advisor
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/70 flex items-center justify-center gap-2">
              <Compass className="w-4 h-4" />
              Free to start · No account needed · Private by design
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
