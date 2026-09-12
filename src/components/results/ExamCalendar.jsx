import { CalendarDays } from 'lucide-react';
export default function ExamCalendar({ exams }) {
  if (!exams?.length) return null;
  return (
    <section aria-labelledby="exam-cal" className="bg-white border border-line rounded-[14px] p-5 shadow-card">
      <h2 id="exam-cal" className="flex items-center gap-2 text-[0.72rem] font-bold uppercase text-ink-3"><CalendarDays className="w-4 h-4"/>Entrance exam calendar</h2>
      <ul className="mt-3 divide-y divide-line">
        {exams.slice(0,4).map(e=> (<li key={e.name} className="py-2.5 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-ink">{e.name}</span><span className="text-xs text-ink-3 shrink-0">{e.period}</span></li>))}
      </ul>
      <p className="mt-2 text-[0.72rem] text-ink-3">Typical periods only — verify official notices.</p>
    </section>
  );
}
