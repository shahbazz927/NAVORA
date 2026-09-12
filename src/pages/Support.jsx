import { Mail, HelpCircle, Shield, FileText, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollTop } from '../hooks/useLocalStorage';
import { CONTACT, LEGAL } from '../config/contact';
export default function Support() {
  useScrollTop();
  return (
    <div className="bg-paper">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
        <p className="eyebrow text-brand-600">Support</p>
        <h1 className="font-ui font-bold text-3xl text-ink mt-2">We’re here to help</h1>
        <p className="mt-3 text-ink-2 text-sm leading-relaxed">{LEGAL.statusNote} For questions about questionnaires, AI advice, or your account, use the channels below.</p>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="bg-surface border border-line rounded-2xl p-5">
            <Mail className="w-5 h-5 text-brand-600 mb-2" />
            <h3 className="font-ui font-semibold">Contact</h3>
            <p className="text-sm text-ink-2 mt-1">Email: <a href={`mailto:${CONTACT.email}`} className="text-brand-600 underline">{CONTACT.email}</a></p>
            <p className="text-sm text-ink-2 mt-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> <a href={`tel:${CONTACT.phones[0].replace(/\s/g,'')}`} className="text-brand-600 underline">{CONTACT.phones[0]}</a> · <a href={`tel:${CONTACT.phones[1].replace(/\s/g,'')}`} className="text-brand-600 underline">{CONTACT.phones[1]}</a></p>
            <p className="text-xs text-ink-3 mt-1">We aim to reply within 2 business days.</p>
          </div>
          <div className="bg-surface border border-line rounded-2xl p-5">
            <HelpCircle className="w-5 h-5 text-brand-600 mb-2" />
            <h3 className="font-ui font-semibold">Help Center</h3>
            <p className="text-sm text-ink-2 mt-1">Browse FAQs about getting started, privacy, and AI.</p>
            <Link to="/help" className="mt-2 inline-flex text-sm font-semibold text-brand-600 underline">Go to Help Center</Link>
          </div>
        </div>
        <div className="mt-6 bg-surface border border-line rounded-2xl p-5 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy" className="inline-flex items-center gap-1.5 text-ink-2 hover:text-ink"><Shield className="w-4 h-4" /> Privacy</Link>
          <Link to="/terms" className="inline-flex items-center gap-1.5 text-ink-2 hover:text-ink"><FileText className="w-4 h-4" /> Terms</Link>
          <Link to="/security" className="inline-flex items-center gap-1.5 text-ink-2 hover:text-ink"><Shield className="w-4 h-4" /> Security</Link>
        </div>
      </div>
    </div>
  );
}
