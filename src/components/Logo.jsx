import logoUrl from '../assets/navora-logo.png';

const heights = { sm: 22, md: 28, lg: 36, xl: 46 };

export default function Logo({ size = 'md', tone = 'dark', className = '', onSurface = false }) {
  const h = heights[size];
  return (
    <span
      className={`inline-flex items-center shrink-0 ${className}`}
      aria-label="NAVORA — Navigate your future"
    >
      {tone === 'dark' || onSurface ? (
        <img src={logoUrl} alt="NAVORA" style={{ height: h, width: 'auto' }} />
      ) : (
        <span
          className="inline-flex items-center justify-center rounded-xl bg-white/95 px-3 py-1.5 shadow-card"
        >
          <img src={logoUrl} alt="NAVORA" style={{ height: h - 8, width: 'auto' }} />
        </span>
      )}
    </span>
  );
}


