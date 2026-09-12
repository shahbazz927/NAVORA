import { useState } from 'react';
import { Sparkles, AlertTriangle, GraduationCap, Wrench, ClipboardList, ArrowRight, Check } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getCareerAdvice } from '../../lib/aiAdvisor';
import AIAdvisorChat from './AIAdvisorChat';

function Chip({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-paper border-line text-ink-2',
    skill: 'bg-brand-50 border-brand-100 text-brand-700',
    exam: 'bg-amber-50 border-amber-200 text-amber-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 border ${tones[tone]}`}>
      {children}
    </span>
  );
}

/**
 * NAVORA AI Career Advisor — reusable panel reusing the existing design system.
 * Sends the student's completed questionnaire answers to POST /api/career-advice
 * (via the NAVORA backend → OpenRouter) and renders the structured result.
 */
export default function AICareerAdvisor({ userType }) {
  const { answers } = useUser();
  const [status, setStatus] = useState('idle'); // idle | loading | error | done
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    setStatus('loading');
    setError(null);
    try {
      const result = await getCareerAdvice(userType, answers);
      setAdvice(result);
      setStatus('done');
    } catch (err) {
      setError(err.message || 'The AI advisor could not generate advice. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section id="ai-career-advisor" className="mt-12" aria-live="polite">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 via-purple to-cyan text-white items-center justify-center shadow-brand">
          <Sparkles className="w-4 h-4" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="font-ui font-bold text-xl text-ink leading-tight">AI Career Advisor</h3>
          <p className="text-xs text-ink-3">Real talk from a counsellor who&rsquo;s read your answers &mdash; like a one-on-one session, not a search result.</p>
        </div>
      </div>

      {status === 'done' && advice && (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-ink-2 leading-relaxed">
            Here&rsquo;s what I think &mdash; based entirely on what you told us. Think of this as a counsellor walking you through your options over a conversation.
          </p>

          {advice.profileSummary && (
            <div className="bg-white border border-line rounded-[1.4rem] p-6 sm:p-7">
              <h4 className="font-ui font-semibold text-ink">Let's start with you</h4>
              <p className="text-sm text-ink-2 leading-relaxed mt-2">{advice.profileSummary}</p>
            </div>
          )}

          {Array.isArray(advice.keyObservations) && advice.keyObservations.length > 0 && (
            <div className="bg-white border border-line rounded-[1.4rem] p-6 sm:p-7">
              <h4 className="font-ui font-semibold text-ink">What caught my eye</h4>
              <ul className="mt-3 space-y-2">
                {advice.keyObservations.map((o, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink-2 leading-relaxed">
                    <Check className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(advice.recommendedCareers) &&
            advice.recommendedCareers.map((career, i) => (
              <div
                key={`${career.title}-${i}`}
                className={`bg-white border rounded-[1.4rem] p-6 sm:p-7 card-lift hover:border-brand-200 ${
                  i === 0 ? 'border-brand-500 shadow-brand' : 'border-line'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className={`text-xs font-bold rounded-full px-3 py-1 ${i === 0 ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700 border border-brand-100'}`}>
                    {i + 1}. {career.title}
                  </span>
                </div>

                {career.whySuit && (
                  <p className="text-sm text-ink-2 leading-relaxed mt-2">{career.whySuit}</p>
                )}

                {career.degree && (
                  <div className="mt-4 flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-ink leading-relaxed"><span className="text-xs font-bold uppercase tracking-wider text-ink-3">Degree / course &middot; </span>{career.degree}</p>
                  </div>
                )}

                {Array.isArray(career.skills) && career.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-brand-500" /> Skills to develop
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {career.skills.map((s) => (
                        <Chip key={s} tone="skill"><Check className="w-3 h-3" /> {s}</Chip>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(career.exams) && career.exams.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2">Relevant entrance exams</p>
                    <div className="flex flex-wrap gap-1.5">
                      {career.exams.map((e) => (
                        <Chip key={e} tone="exam">{e}</Chip>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(career.nextSteps) && career.nextSteps.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2 flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-brand-500" /> Short-term next steps
                    </p>
                    <ol className="space-y-1.5">
                      {career.nextSteps.map((step, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-ink-2 leading-relaxed">
                          <ArrowRight className="w-3.5 h-3.5 text-brand-500 mt-1 shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          {advice.strongestRecommendation?.career && (
            <div className="bg-brand-50 border border-brand-200 rounded-[1.4rem] p-6 sm:p-7">
              <h4 className="font-ui font-semibold text-ink">Our strongest recommendation: {advice.strongestRecommendation.career}</h4>
              {advice.strongestRecommendation.reason && (
                <p className="text-sm text-ink-2 leading-relaxed mt-2">{advice.strongestRecommendation.reason}</p>
              )}
            </div>
          )}

{Array.isArray(advice.alternativeCareers) && advice.alternativeCareers.length > 0 && (
            <div className="bg-white border border-line rounded-[1.4rem] p-6 sm:p-7">
              <h4 className="font-ui font-semibold text-ink">Alternative routes to explore</h4>
              <div className="mt-3 space-y-2.5">
                {advice.alternativeCareers.map((alt, i) => (
                  <div key={`${alt.title}-${i}`} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-ink-2 leading-relaxed">
                      <span className="font-semibold text-ink">{alt.title}.</span> {alt.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(advice.actionPlan) && advice.actionPlan.length > 0 && (
            <div className="bg-white border border-line rounded-[1.4rem] p-6 sm:p-7">
              <h4 className="font-ui font-semibold text-ink">Where you can go from here</h4>
              <ol className="mt-3 space-y-2.5">
                {advice.actionPlan.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-ink-2 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {advice.reflectionQuestion && (
            <div className="bg-paper border border-line rounded-[1.4rem] p-6">
              <p className="text-sm text-ink-2 leading-relaxed">
                <span className="font-semibold text-ink">One thing to think about: </span>
                {advice.reflectionQuestion}
              </p>
            </div>
          )}

          <p className="text-[0.68rem] text-ink-3 leading-relaxed">
            Written fresh for your answers by the NAVORA advisor. It&rsquo;s guidance to think with, not a final verdict &mdash; always double-check big decisions with a professional.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-[1.4rem] p-6">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div className="flex-1">
              <p className="font-ui font-semibold text-ink">Hold on, let me try that again</p>
              <p className="text-sm text-ink-2 mt-1 leading-relaxed">{error}</p>
              <button
                onClick={generate}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800"
              >
                <Sparkles className="w-4 h-4" /> Try again
              </button>
            </div>
          </div>
        </div>
      )}
{(status === 'idle' || status === 'error') && (
        <div className="mt-5 bg-white border border-line rounded-[1.4rem] p-6 sm:p-7 card-lift">
          <p className="text-sm text-ink-2 leading-relaxed">
            Let&rsquo;s sit down and figure out what career paths actually make sense for you. I&rsquo;ll look at your answers and walk you through it like a real counselling session.
          </p>
          <button
            onClick={generate}
            className="mt-5 inline-flex items-center gap-2 font-ui font-semibold text-sm bg-gradient-to-r from-brand-500 to-brand-700 text-white rounded-xl px-5 py-3 shadow-brand hover:opacity-95 transition-opacity cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Let&rsquo;s talk about my career
          </button>
        </div>
      )}

      {status === 'loading' && (
        <div className="mt-5 bg-white border border-line rounded-[1.4rem] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 animate-pulse">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <p className="font-ui font-semibold text-ink">Reading your answers&hellip;</p>
            <p className="text-sm text-ink-3 mt-0.5">Give me a few seconds &mdash; I&rsquo;m thinking through what fits you best, just like a counsellor would.</p>
          </div>
        </div>
      )}

      {/* Interactive follow-up chat — available once a plan is generated, so the
          user can keep asking questions grounded in their answers. */}
      {status === 'done' && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <p className="eyebrow text-ink-3">Keep the conversation going</p>
          </div>
          <AIAdvisorChat userType={userType} />
        </div>
      )}
    </section>
  );
}