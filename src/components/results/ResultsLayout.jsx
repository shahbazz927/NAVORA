import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import Button from '../Button';
import ResultsHeader from './ResultsHeader';
import ResultsContext from './ResultsContext';
import ResultsFilters from './ResultsFilters';
import CompareBar from './CompareBar';
import CompareView from './CompareView';
import ExamCalendar from './ExamCalendar';
import NextSteps from './NextSteps';

export default function ResultsLayout({
  onBack, header, context, filters, counts, activeFilter, onFilter,
  compareCount, onCompare, onClearCompare,
  items, renderCard,
  sidebarExams, sidebarNextColleges,
  nextSteps, stepsChecked, onToggleStep,
  onRetake, onSave, toast, setToast,
  compareOpen, setCompareOpen, compareItems, compareRows,
}) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 lg:py-10">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink"><ArrowLeft className="w-4 h-4"/>Back to questionnaire</button>
        <div className="mt-6">
          <ResultsHeader {...header} />
          <ResultsContext items={context} />
        </div>
        {filters && <ResultsFilters filters={filters} active={activeFilter} counts={counts} onChange={onFilter} />}
        <CompareBar count={compareCount} onCompare={onCompare} onClear={onClearCompare} />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-4 min-w-0">
            {items.map((it, idx)=> renderCard(it, idx))}
            {nextSteps && <NextSteps steps={nextSteps} checked={stepsChecked||{}} onToggle={onToggleStep||(()=>{})} />}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onRetake && <Button variant="secondary" size="lg" onClick={onRetake}>Retake this flow</Button>}
              {onSave && <Button variant="primary" size="lg" shine onClick={onSave}>Save to dashboard ✓</Button>}
            </div>
            <p className="text-center text-xs text-ink-3 max-w-2xl mx-auto leading-relaxed">Guidance, not a prediction. Verify eligibility, fees and dates with official sources. Scores are deterministic from your answers — same answers → same result.</p>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24">
            {sidebarExams && <ExamCalendar exams={sidebarExams} />}
            {sidebarNextColleges}
            <section className="bg-brand-950 border border-white/10 rounded-[14px] p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-mesh-dark opacity-40 pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-600/20 blur-2xl pointer-events-none" />
              <p className="relative text-sm font-semibold text-white">Not fully convinced?</p>
              <p className="relative mt-1 text-sm text-white/70 leading-relaxed">That&apos;s completely okay. Let&apos;s talk it through 1-on-1 with a career counselor.</p>
              <Link to="/support" className="relative mt-3 inline-flex">
                <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white border-0">
                  Talk to a Career Counselor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </section>
          </aside>
        </div>
      </div>
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-brand-950 text-white text-sm font-medium rounded-full pl-4 pr-3 py-2.5 max-w-[92vw]">
          <Check className="w-4 h-4 shrink-0"/><span className="truncate">{toast}</span>
          <button type="button" onClick={()=> setToast('')} aria-label="Dismiss" className="p-1 rounded-full hover:bg-white/15"><X className="w-3.5 h-3.5"/></button>
        </div>
      )}
      <CompareView open={compareOpen} onClose={()=> setCompareOpen(false)} items={compareItems||[]} rows={compareRows||[]} />
    </div>
  );
}
