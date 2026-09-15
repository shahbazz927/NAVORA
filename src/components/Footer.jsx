import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock, Heart, Compass, Mail, Phone } from 'lucide-react';
import Logo from './Logo';
import Swoosh from './Swoosh';
import { CONTACT } from '../config/contact';

const columns = [
  {
    heading: 'Explore',
    links: [
      { label: 'Get started', to: '/get-started' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Advisor', to: '/advisor' },
      { label: 'Help Center', to: '/help' },
      { label: 'Support', to: '/support' },
    ],
  },
  {
    heading: 'Guidance',
    links: [
      { label: 'After Class 12', to: '/get-started' },
      { label: 'Graduation guidance', to: '/get-started' },
      { label: 'For parents', to: '/parents' },
      { label: 'Account', to: '/account' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
      { label: 'Cookies', to: '/cookies' },
      { label: 'Disclaimer', to: '/disclaimer' },
      { label: 'Accessibility', to: '/accessibility' },
      { label: 'Security', to: '/security' },
    ],
  },
];

const trustItems = [
  { icon: Lock, label: 'Private by design' },
  { icon: ShieldCheck, label: 'No account needed' },
  { icon: Heart, label: 'Honest, not hype' },
];

export default function Footer() {
  return (
    <footer className="relative bg-brand-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-mesh-dark opacity-90" />
      <Swoosh variant="dark" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
      <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-spark-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Logo size="md" tone="light" onSurface className="mb-5" />
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              NAVORA helps students and parents move from confusion to confidence —
              with clear, honest guidance on the decisions that shape their future.
            </p>
            <p className="mt-5 font-ui text-sm font-semibold tracking-[0.18em] uppercase text-brand-200">
              Navigate your future.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-white/55">
              <Compass className="w-3.5 h-3.5 text-spark-300" />
              <span>PERSONALIZED EDUCATION &amp; CAREER GUIDANCE</span>
            </div>
            <div className="flex items-center gap-2 mt-5 text-[0.7rem] font-ui font-semibold tracking-[0.22em] text-white/45">
              <span>LEARN</span><span className="text-white/25">·</span>
              <span>EXPLORE</span><span className="text-white/25">·</span>
              <span>DECIDE</span><span className="text-white/25">·</span>
              <span>GROW</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-7">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white/85 bg-white/10 border border-white/10 rounded-full px-3 py-1.5"
                  >
                    <Icon className="w-3.5 h-3.5 text-brand-300" />
                    {item.label}
                  </span>
                );
              })}
            </div>
            <div className="mt-6 space-y-1.5 text-sm">
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-brand-300" /> {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phones[0].replace(/\s/g,'')}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand-300" /> {CONTACT.phones[0]}
              </a>
              <a href={`tel:${CONTACT.phones[1].replace(/\s/g,'')}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand-300" /> {CONTACT.phones[1]}
              </a>
            </div>
            <p className="mt-3 text-xs text-white/40">Prototype / pre-incorporation — no registered entity.</p>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="md:col-span-2">
              <h4 className="eyebrow text-brand-300 mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3">
            <h4 className="eyebrow text-brand-300 mb-4">Not sure where to begin?</h4>
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl px-4 py-2.5 shadow-brand transition-all"
            >
              Take the 2-minute assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-xs text-white/50 leading-relaxed">
              Free to start. Private by design. No account needed.
            </p>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} NAVORA. All rights reserved. · <a href={`mailto:${CONTACT.email}`} className="underline hover:text-white">{CONTACT.email}</a>
          </p>
          <p className="text-xs text-white/50 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Navigate your future.
          </p>
        </div>
      </div>
    </footer>
  );
}
