export default function LoadingState({ message = 'Loading…', fullPage = false }) {
  const inner = (
    <div className="flex flex-col items-center justify-center gap-4 py-16" role="status" aria-live="polite" aria-label={message}>
      <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-600 rounded-full animate-spin" aria-hidden />
      <p className="text-sm text-ink-2">{message}</p>
    </div>
  );
  if (fullPage) return <div className="min-h-[60vh] flex items-center justify-center">{inner}</div>;
  return inner;
}
