export default function StepIndicator({ currentStep, totalSteps, labels = [], accentClass = 'bg-brand-500' }) {
  const pct = totalSteps === 0 ? 0 : (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <span className="eyebrow text-ink-3">
          Step {currentStep + 1} <span className="text-ink-4 normal-case">of {totalSteps}</span>
        </span>
        {labels[currentStep] && (
          <span className="text-sm font-medium text-ink-2">{labels[currentStep]}</span>
        )}
      </div>
      <div className="relative w-full h-1.5 bg-paper-deep rounded-full overflow-hidden">
        <div
          className={`h-full ${accentClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
