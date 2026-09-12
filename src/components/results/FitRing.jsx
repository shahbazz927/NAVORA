export default function FitRing({ score }) {
  const v = Math.max(0, Math.min(100, Number(score) || 0));
  const r = 26, c = 2 * Math.PI * r;
  const off = c - (v / 100) * c;
  const color = v >= 75 ? '#0b1e3d' : v >= 55 ? '#0d8f7e' : '#b4751a';
  return (
    <div className="flex flex-col items-center shrink-0" role="img" aria-label={`Fit score ${v} out of 100`}>
      <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
        <circle cx="38" cy="38" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
        <circle cx="38" cy="38" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 38 38)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        <text x="38" y="37" textAnchor="middle" fontSize="19" fontWeight="700" fill="#0b1e3d" fontFamily="Plus Jakarta Sans, Inter, sans-serif">{v}</text>
        <text x="38" y="50" textAnchor="middle" fontSize="8" fontWeight="600" fill="#6b7a94" letterSpacing="0.08em">FIT SCORE</text>
      </svg>
    </div>
  );
}
