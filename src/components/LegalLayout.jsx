import { Link, useLocation } from 'react-router-dom';

const legalLinks = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Cookies', to: '/cookies' },
  { label: 'Disclaimer', to: '/disclaimer' },
  { label: 'Accessibility', to: '/accessibility' },
  { label: 'Security', to: '/security' },
];

export default function LegalLayout({ title, intro, lastUpdated, children }) {
  const { pathname } = useLocation();
  return (
    <div className="bg-paper">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <p className="eyebrow text-brand-600">Legal</p>
        <h1 className="mt-2 font-ui font-bold text-3xl sm:text-[2.2rem] text-ink tracking-[-0.03em] text-balance">{title}</h1>
        {intro && <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-2 max-w-2xl">{intro}</p>}
        {lastUpdated && <p className="mt-3 text-xs text-ink-3">Last updated: {lastUpdated}</p>}

        <div className="mt-8 pt-8 border-t border-line">
          <article className="text-[0.94rem] leading-7 text-ink-2 [&_h2]:font-ui [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:text-[1.05rem] [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-ui [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-700">
            {children}
          </article>
        </div>

        <nav aria-label="Legal pages" className="mt-12 pt-6 border-t border-line">
          <p className="eyebrow text-ink-3 mb-3">Explore legal</p>
          <ul className="flex flex-wrap gap-2">
            {legalLinks.map((l) => {
              const active = pathname === l.to;
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex px-3.5 py-1.5 rounded-full text-sm border transition-colors ${active ? 'bg-ink text-white border-ink' : 'bg-surface text-ink-2 border-line hover:border-line-strong hover:text-ink'}`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
