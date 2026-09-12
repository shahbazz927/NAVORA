import LegalLayout from '../../components/LegalLayout';
import { useScrollTop } from '../../hooks/useLocalStorage';
import { CONTACT } from '../../config/contact';

export default function Accessibility() {
  useScrollTop();
  return (
    <LegalLayout
      title="Accessibility"
      intro="Our approach to making NAVORA usable and welcoming for more people."
      lastUpdated="September 2026"
    >
      <p>We want students and parents to be able to explore future options without unnecessary barriers.</p>

      <h2>How we support accessibility today</h2>
      <ul>
        <li>Clear, semantic page structure and heading hierarchy.</li>
        <li>Full keyboard navigation for primary navigation and interactive elements.</li>
        <li>Visible focus indicators for keyboard users.</li>
        <li>Readable contrast and responsive layouts that adapt from mobile to desktop.</li>
        <li>Support for reduced-motion preferences.</li>
      </ul>

      <h2>What we are still improving</h2>
      <p>
        NAVORA has not yet completed a formal, independent accessibility audit. We continue to review content, components, and flows for readability, keyboard behavior, and assistive-technology support, and we prioritize fixes where issues are found.
      </p>

      <h2>Feedback</h2>
      <p>
        If you encounter a barrier, please share the page, what you were trying to do, and the technology you were using. Contact us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or <a href={`tel:${CONTACT.phones[0].replace(/\s/g,'')}`}>{CONTACT.phones[0]}</a>.
      </p>
    </LegalLayout>
  );
}
