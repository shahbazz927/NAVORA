export default function ResultsHeader({ eyebrow, title, subtitle }) {
  return (
    <div>
      {eyebrow && <p className="eyebrow text-brand-600 mb-2">{eyebrow}</p>}
      <h1 className="font-ui font-bold text-3xl sm:text-4xl text-ink tracking-[-0.03em] text-balance leading-tight">{title}</h1>
      {subtitle && <p className="mt-3 text-sm sm:text-[0.95rem] text-ink-2 leading-relaxed max-w-2xl">{subtitle}</p>}
    </div>
  );
}
