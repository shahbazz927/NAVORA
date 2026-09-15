import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Sparkles,
  Target,
  Lightbulb,
  BookOpen,
  Scale,
  Users,
  ShieldCheck,
  Heart,
  Zap,
  Check,
  TrendingUp,
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Swoosh from '../components/Swoosh';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedPage';
import { useScrollTop } from '../hooks/useLocalStorage';

const whyQuestions = [
  'What are my options?',
  'What suits me?',
  'What can I do after this course?',
  'Where can this path lead?',
  'What alternatives do I have?',
];

const howWeThink = [
  {
    icon: Users,
    title: 'The student comes first.',
    copy: 'Every student has a different background, different interests, different strengths and different ambitions. So we don\u2019t believe in treating every student the same.',
  },
  {
    icon: Compass,
    title: 'Exploration comes before certainty.',
    copy: 'A student doesn\u2019t need to have their entire future figured out before they start. \u201cI\u2019m not sure\u201d is a perfectly valid place to begin.',
  },
  {
    icon: Lightbulb,
    title: 'Guidance should explain the \u201cwhy.\u201d',
    copy: 'A recommendation is more useful when a student understands why a particular direction may suit them.',
  },
  {
    icon: Users,
    title: 'Parents are part of the journey.',
    copy: 'Parents play an important role in a student\u2019s future. We want to encourage better conversations between students and parents through better information and clearer guidance.',
  },
  {
    icon: Zap,
    title: 'Good guidance begins with good questions.',
    copy: 'NAVORA doesn’t start by telling you what to become. It starts by understanding you — then helps you make sense of your choices. Technology supports the conversation; it doesn’t replace judgement.',
  },
];

const approachSteps = [
  {
    step: '01',
    icon: BookOpen,
    title: 'LEARN',
    copy: 'Understand the student\u2019s academic background, interests, strengths and preferences.',
  },
  {
    step: '02',
    icon: Compass,
    title: 'EXPLORE',
    copy: 'Discover courses, education pathways, specialisations and careers that may be worth considering.',
  },
  {
    step: '03',
    icon: Scale,
    title: 'DECIDE',
    copy: 'Understand the options, compare possibilities and see the reasoning behind recommendations.',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'GROW',
    copy: 'Keep learning and refining the direction as interests, goals and circumstances change.',
  },
];

const successStatements = [
  'A student discovering an option they didn\u2019t know existed.',
  'A student understanding why a particular path suits them.',
  'A parent having a better conversation with their child.',
  'A student making a decision with confidence instead of pressure.',
];
export default function About() {
  useScrollTop();

  return (
    <div className="bg-surface">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-paper-gradient">
        <div className="absolute -top-48 -right-40 w-[36rem] h-[36rem] rounded-full bg-brand-400/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-48 w-[30rem] h-[30rem] rounded-full bg-cyan-300/10 blur-3xl pointer-events-none" />
        <Swoosh variant="light" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-24 lg:pt-24 lg:pb-28">
          <FadeIn className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-brand-100 px-4 py-1.5 shadow-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-500 glow-dot" />
              <span className="eyebrow text-brand-700">About NAVORA</span>
            </span>

            <h1 className="font-ui font-bold text-[2.7rem] leading-[1.04] sm:text-6xl lg:text-[4rem] text-ink text-balance tracking-[-0.03em]">
              Navigate <em className="font-display italic font-medium text-gradient">your future.</em>
            </h1>

            <p className="mt-7 text-lg text-ink-2 leading-relaxed max-w-2xl">
              NAVORA is a personalized education and career guidance platform built to
              help students make better-informed decisions about their future. The
              assessment comes first — AI is a supporting capability that helps explain
              results and answer follow-up questions.
            </p>
            <p className="eyebrow text-brand-600 mt-4 tracking-[0.14em]">Personalized Education &amp; Career Guidance</p>
            <p className="mt-4 text-ink-2 leading-relaxed max-w-2xl">
              We believe choosing what to study and what to pursue as a career should
              not be based only on marks, trends, pressure, or the opinions of people
              around us. Students deserve the opportunity to understand themselves,
              explore their options, and make decisions with clarity.
            </p>


          </FadeIn>
        </div>
      </section>

      {/* ── Why NAVORA Exists ───────────────────────────── */}
      <section className="border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-brand-600 mb-3">Why NAVORA exists</p>
              <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
                We experienced the problem before we decided to solve it.
              </h2>
              <p className="mt-5 text-ink-2 leading-relaxed">
                When we were students, there was no proper platform that could give us
                structured, personalised guidance about education and career choices. Like
                many students, we depended on parents, teachers, friends, seniors and
                relatives for advice.
              </p>
              <p className="mt-4 text-ink-2 leading-relaxed">
                Their intentions were good. But advice was often shaped by personal
                experiences, limited awareness, or what was considered a good career at
                that time. There was no simple place where we could understand:
              </p>
              <div className="mt-7 p-6 rounded-2xl bg-brand-50 border border-brand-100">
                <p className="font-ui font-semibold text-ink text-sm">
                  Why shouldn&rsquo;t students have better guidance than we had?
                </p>
                <p className="mt-2 text-sm text-ink-2">
                  That question became the beginning of NAVORA.
                </p>
              </div>
            </FadeIn>

            <div className="lg:col-span-7">
              <StaggerContainer className="grid sm:grid-cols-2 gap-4">
                {whyQuestions.map((q) => (
                  <StaggerItem key={q}>
                    <div className="h-full flex gap-5 bg-surface border border-line rounded-[1.4rem] p-6 card-lift hover:border-brand-200">
                      <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shrink-0 shadow-brand">
                        <Check className="w-5 h-5" strokeWidth={2.5} />
                      </span>
                      <div>
                        <h3 className="font-ui font-semibold text-ink">{q}</h3>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>
{/* ── What We Are Building ─────────────────────────── */}
      <section className="bg-paper border-t border-line">
        <div className="container-narrow max-w-3xl mx-auto px-5 sm:px-8 py-20 lg:py-24 text-center">
          <FadeIn>
            <span className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 via-purple to-cyan shadow-glow items-center justify-center mb-7">
              <Compass className="w-8 h-8 text-white" strokeWidth={1.5} />
            </span>
            <p className="eyebrow text-brand-600 mb-3">What we are building</p>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
              Bringing the pieces of decision-making together.
            </h2>
            <p className="mt-5 text-ink-2 leading-relaxed">
              NAVORA is designed to bring the different pieces of education and career
              decision-making together. Instead of simply giving a student a career name,
              we want to help them understand the journey behind the decision.
            </p>
            <p className="mt-4 text-ink-2 leading-relaxed">
              From understanding their interests and strengths to exploring education
              pathways, courses, specialisations and career possibilities, NAVORA is built
              around one idea:
            </p>
            <p className="mt-7 font-ui font-semibold text-xl sm:text-2xl text-ink text-balance">
              Better decisions begin with <span className="text-gradient">better understanding.</span>
            </p>
            <p className="mt-5 text-ink-2 leading-relaxed">
              We are building an experience where students can explore their future step by
              step — rather than being expected to know the answer immediately.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Vision & Mission ───────────────────────────── */}
      <section className="bg-surface border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn className="flex">
              <div className="w-full flex flex-col gap-5 bg-paper border border-line rounded-[1.4rem] p-8 card-lift hover:border-brand-200">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shrink-0 shadow-brand">
                  <Target className="w-6 h-6" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="eyebrow text-brand-600 mb-3">Our Vision</p>
                  <h3 className="font-ui font-bold text-2xl text-ink tracking-[-0.02em]">
                    A future where every student can make an informed decision about their future.
                  </h3>
                  <p className="mt-4 text-ink-2 leading-relaxed">
                    We want to create a world where students are not limited by the
                    information they happen to receive or the people they happen to know.
                  </p>
                  <p className="mt-4 text-ink-2 leading-relaxed">
                    Our vision is to make meaningful, personalised guidance accessible to
                    students at the moments when their educational and career decisions
                    matter most.
                  </p>
                </div>
                <div className="mt-2 p-5 rounded-2xl bg-brand-50 border border-brand-100">
                  <p className="font-ui font-semibold text-ink text-sm">
                    No student should have to choose a future simply because they didn&rsquo;t
                    know their options.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="flex">
              <div className="w-full flex flex-col gap-5 bg-paper border border-line rounded-[1.4rem] p-8 card-lift hover:border-brand-200">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shrink-0 shadow-brand">
                  <Sparkles className="w-6 h-6" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="eyebrow text-brand-600 mb-3">Our Mission</p>
                  <h3 className="font-ui font-bold text-2xl text-ink tracking-[-0.02em]">
                    To make education and career guidance more personal, accessible and useful.
                  </h3>
                  <p className="mt-4 text-ink-2 leading-relaxed">
                    NAVORA uses AI and technology to help students understand themselves,
                    discover possibilities, compare directions and make better-informed
                    decisions.
                  </p>
                  <p className="mt-4 text-ink-2 leading-relaxed">
                    We don&rsquo;t want to tell students who they should become.
                  </p>
                </div>
                <div className="mt-2 p-5 rounded-2xl bg-brand-50 border border-brand-100">
                  <p className="font-ui font-semibold text-ink text-sm">
                    We want to help them discover what could be possible.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
{/* ── How We Think ─────────────────────────────────── */}
      <section className="bg-paper border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <div className="max-w-2xl mb-12">
            <FadeIn>
              <p className="eyebrow text-brand-600 mb-3">How we think</p>
              <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
                Principles that shape every recommendation.
              </h2>
            </FadeIn>
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {howWeThink.map((principle) => {
              const Icon = principle.icon;
              return (
                <StaggerItem key={principle.title}>
                  <div className="h-full flex gap-5 bg-surface border border-line rounded-[1.4rem] p-6 card-lift hover:border-brand-200">
                    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shrink-0 shadow-brand">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="font-ui font-semibold text-ink">{principle.title}</h3>
                      <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">{principle.copy}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Our Approach ───────────────────────────────── */}
      <section className="bg-surface border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <div className="max-w-2xl mb-12">
            <FadeIn>
              <p className="eyebrow text-brand-600 mb-3">Our approach</p>
              <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
                A clear way forward, step by step.
              </h2>
            </FadeIn>
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {approachSteps.map((step) => {
              const Icon = step.icon;
              return (
                <StaggerItem key={step.title}>
                  <div className="relative h-full flex flex-col gap-4 bg-surface border border-line rounded-[1.4rem] p-6 card-lift hover:border-brand-200 overflow-hidden">
                    <span className="absolute top-4 right-5 font-display italic text-4xl text-brand-100 select-none">
                      {step.step}
                    </span>
                    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shrink-0 shadow-brand">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="font-ui font-bold text-lg text-ink tracking-[-0.01em]">{step.title}</h3>
                      <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">{step.copy}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <FadeIn className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-5 px-6 rounded-2xl bg-brand-50 border border-brand-100">
              {['Learn', 'Explore', 'Decide', 'Grow'].map((word, i) => (
                <span key={word} className="flex items-center gap-4">
                  {i > 0 && <span className="text-brand-300">·</span>}
                  <span className="font-ui font-semibold text-ink text-lg tracking-[-0.01em]">{word}</span>
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
{/* ── Where We Are Going ──────────────────────────── */}
      <section className="bg-paper border-t border-line">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-brand-100 px-4 py-1.5 shadow-sm mb-7">
              <span className="w-2 h-2 rounded-full bg-brand-500 glow-dot" />
              <span className="eyebrow text-brand-700">Where we are going</span>
            </span>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
              Guidance that grows with the student.
            </h2>
            <p className="mt-5 text-ink-2 leading-relaxed">
              NAVORA is starting with education and career guidance. But our long-term
              ambition is bigger.
            </p>
            <p className="mt-4 text-ink-2 leading-relaxed">
              We want to build an intelligent guidance ecosystem that can support a student
              across different stages of their journey — from important education decisions
              to higher studies, skills, careers and professional growth.
            </p>
            <p className="mt-4 text-ink-2 leading-relaxed">
              The future of guidance should not be a single recommendation delivered at one
              point in a student&rsquo;s life.
            </p>
            <p className="mt-7 font-ui font-semibold text-xl sm:text-2xl text-ink text-balance">
              It should <span className="text-gradient">evolve with the person.</span>
            </p>
            <p className="mt-5 text-ink-2 leading-relaxed">
              Our long-term goal is to make NAVORA a trusted companion throughout that journey.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── What Success Means to Us ─────────────────── */}
      <section className="bg-surface border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <FadeIn className="lg:col-span-5">
              <p className="eyebrow text-brand-600 mb-3">What success means to us</p>
              <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
                Not just numbers. Real impact.
              </h2>
              <p className="mt-5 text-ink-2 leading-relaxed">
                Success isn&rsquo;t simply the number of students using NAVORA. It is a
                student discovering an option they didn&rsquo;t know existed, or understanding
                why a particular path suits them. It is a parent having a better conversation
                with their child, and a student making a decision with confidence instead of
                pressure.
              </p>
            </FadeIn>

            <div className="lg:col-span-7">
              <StaggerContainer className="space-y-4">
                {successStatements.map((s) => (
                  <StaggerItem key={s}>
                    <div className="flex gap-5 bg-surface border border-line rounded-[1.4rem] p-6 card-lift hover:border-brand-200">
                      <span className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-brand mt-0.5">
                        <Check className="w-5 h-5" strokeWidth={2.5} />
                      </span>
                      <p className="font-ui font-medium text-ink leading-relaxed">{s}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <FadeIn className="mt-6"></FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Founders ─────────────────────────────── */}
      <section className="bg-paper border-t border-line">
        <div className="container-narrow max-w-3xl mx-auto px-5 sm:px-8 py-20 lg:py-24 text-center">
          <FadeIn>
            <span className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 via-purple to-cyan shadow-glow items-center justify-center mb-7">
              <Heart className="w-8 h-8 text-white" strokeWidth={1.5} />
            </span>
            <p className="eyebrow text-brand-600 mb-3">Our founders</p>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance">
              Built by two co-founders who experienced the problem firsthand.
            </h2>
            <p className="mt-6 text-ink-2 leading-relaxed">
              We experienced the lack of proper education and career guidance during our own
              student years — and that experience became the reason we decided to build
              NAVORA.
            </p>
            <div className="mt-7 p-6 rounded-2xl bg-brand-50 border border-brand-100">
              <p className="font-ui font-semibold text-ink">
                Two founders. One shared belief: every student deserves better guidance.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Our Promise ───────────────────────────────── */}
      <section className="bg-surface border-t border-line">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 lg:py-24 text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-brand-100 px-4 py-1.5 shadow-sm mb-7">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span className="eyebrow text-brand-700">Our promise</span>
            </span>
            <p className="text-ink-2 leading-relaxed">
              We won&rsquo;t pretend that an algorithm can predict someone&rsquo;s entire future.
              We won&rsquo;t tell every student there is only one right answer. And we won&rsquo;t
              replace the people who genuinely care about a student&rsquo;s future.
            </p>
            <p className="mt-6 text-ink-2 leading-relaxed">
              Instead, we want to give students something that can make those decisions better:
            </p>
            <h2 className="mt-7 font-ui font-bold">
              <span className="text-gradient font-display italic font-bold text-6xl sm:text-7xl">Clarity.</span>
            </h2>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Understand', 'Explore', 'Question', 'Decide'].map((word) => (
                <div
                  key={word}
                  className="py-4 px-3 rounded-2xl bg-brand-50 border border-brand-100"
                >
                  <p className="font-ui font-semibold text-ink text-lg tracking-[-0.01em]">Clarity to {word.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
{/* ── Final CTA ─────────────────────────────────── */}
      <section className="bg-brand-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-90" />
        <div className="absolute inset-0 bg-noise opacity-60" />
        <Swoosh variant="dark" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-600/30 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-purple/20 blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
          <FadeIn>
            <Logo size="md" tone="light" onSurface className="mb-7 inline-flex" />
            <h2 className="font-ui font-bold text-4xl sm:text-5xl tracking-[-0.03em] text-balance">
              Navigate your future.
            </h2>
            <p className="mt-5 text-white/80 text-lg leading-relaxed max-w-xl mx-auto">
              Learn. Explore. Decide. Grow. — Guidance that helps you understand your
              choices before you choose your path.
            </p>

          </FadeIn>
        </div>
      </section>
    </div>
  );
}