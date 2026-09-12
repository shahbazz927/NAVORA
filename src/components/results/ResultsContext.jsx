export default function ResultsContext({ items }) {
  if (!items?.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Your context">
      {items.map((t) => (
        <span key={t} className="inline-flex items-center rounded-full bg-paper border border-line px-3 py-1.5 text-xs font-medium text-ink-2">{t}</span>
      ))}
    </div>
  );
}
