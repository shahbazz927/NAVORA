import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useScrollTop } from '../hooks/useLocalStorage';

const faqs = [
  { q: 'What does NAVORA do?', a: 'NAVORA offers questionnaires for Class 10/12/Graduate/Parent, computes career candidates from your stream/interests/strengths, and explains them. The AI advisor gives additional free-form guidance. See also About.' },
  { q: 'Do I need an account?', a: 'You can start the questionnaire without logging in, but Dashboard and AI Advisor require sign-in (Supabase Auth). Your answers are kept in localStorage (novera-state-v1, 7-day TTL).' },
  { q: 'Is the AI advice definitive?', a: 'No — it is advisory only. Models may be incomplete or outdated. Always verify exams, eligibility, and colleges with official sources. See Disclaimer.' },
  { q: 'How is my data used?', a: 'Email/name for auth; questionnaire answers to generate recommendations; prompts to OpenRouter for AI replies. No payment data is collected. See Privacy and Cookie Policy. Export or clear data in Account Settings.' },
  { q: 'I can’t log in / session expired', a: 'Try Forgot password on the Sign in page, or open /reset-password from your recovery email. If still stuck, contact Support. Deep links preserve your intended destination via ?redirect.' },
  { q: 'How do I delete my data?', a: 'Use Account → Clear local data & sign out. For server-side deletion, contact support per Privacy Policy.' },
];

export default function Help() {
  useScrollTop();
  const [open, setOpen] = useState(0);
  return (
    <div className="bg-paper">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
        <p className="eyebrow text-brand-600">Help Center</p>
        <h1 className="font-ui font-bold text-3xl text-ink mt-2">How can we help?</h1>
        <p className="mt-2 text-sm text-ink-2">Answers reference real features verified in code. No mocked flows.</p>
        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="bg-surface border border-line rounded-2xl overflow-hidden">
              <button onClick={()=>setOpen(open===i? -1 : i)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-ui font-semibold text-sm text-ink pr-4">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-ink-3 transition-transform ${open===i?'rotate-180':''}`} />
              </button>
              {open===i && <div className="px-4 pb-4 text-sm text-ink-2 leading-relaxed">{f.a}</div>}
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-2">Still need help? <Link to="/support" className="text-brand-600 underline font-medium">Contact support</Link></p>
      </div>
    </div>
  );
}
