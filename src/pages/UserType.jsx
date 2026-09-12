import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../components/AnimatedPage';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import {
  TOP_LEVEL_HEADING,
  TOP_LEVEL_SUPPORT,
  TOP_LEVEL_OPTIONS,
} from '../data/assessmentConfig';

export default function UserType() {
  useScrollTop();
  const navigate = useNavigate();
  const { setUserType } = useUser();

  const handleSelect = (value) => {
    setUserType(value);
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-paper-gradient">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 lg:py-24">
        <FadeIn className="max-w-2xl mx-auto text-center mb-12">
          <p className="inline-flex items-center gap-2 eyebrow text-brand-600 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 glow-dot" />
            Novera Guidance
          </p>
          <h1 className="font-ui font-bold text-4xl sm:text-5xl lg:text-6xl text-ink tracking-[-0.03em] text-balance">
            {TOP_LEVEL_HEADING}
          </h1>
          <p className="mt-6 text-lg text-ink-2 leading-relaxed">{TOP_LEVEL_SUPPORT}</p>
        </FadeIn>

        <div className="grid sm:grid-cols-3 gap-5 lg:gap-6">
          {TOP_LEVEL_OPTIONS.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleSelect(option.value)}
              className="group w-full text-left bg-white border border-line rounded-2xl p-7 sm:p-8 hover:shadow-card hover:border-brand-200 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-xl shrink-0" aria-hidden="true">{option.emoji}</span>
                <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold tracking-wide uppercase text-ink-3 group-hover:text-brand-700 transition-colors">
                  Start
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
              <h2 className="mt-5 font-ui font-bold text-[1.35rem] text-ink leading-tight tracking-[-0.015em]">{option.title}</h2>
              <p className="mt-2.5 text-[0.9rem] text-ink-2 leading-relaxed text-balance">{option.description}</p>
            </motion.button>
          ))}
        </div>

        <FadeIn delay={0.35} className="text-center mt-12">
          <p className="text-sm text-ink-3">
            Already explored before?{' '}
            <button
              onClick={() => navigate('/dashboard')}
              className="font-medium text-brand-700 hover:text-brand-800 link-underline"
            >
              Go to your dashboard
            </button>
          </p>
        </FadeIn>
      </div>
    </div>
  );
}