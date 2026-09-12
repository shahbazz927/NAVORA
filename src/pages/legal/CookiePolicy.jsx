import LegalLayout from '../../components/LegalLayout';
import { useScrollTop } from '../../hooks/useLocalStorage';
import { CONTACT } from '../../config/contact';

export default function CookiePolicy() {
  useScrollTop();
  return (
    <LegalLayout
      title="Cookie Policy"
      intro="Which browser technologies NAVORA actually uses — and which it does not."
      lastUpdated="September 2026"
    >
      <p>NAVORA keeps its use of cookies and browser storage minimal.</p>

      <h2>Essential only</h2>
      <p>We use only what is needed for the platform to work:</p>
      <ul>
        <li><strong>Authentication and session</strong> — keeps you signed in and supports account recovery. Without this, sign-in and protected areas like your dashboard cannot function.</li>
        <li><strong>Application preferences</strong> — remembers your recent questionnaire progress and advisor conversations locally in your browser so you can continue where you left off.</li>
      </ul>

      <h2>What we do not use</h2>
      <p>There are currently no advertising cookies, no cross-site tracking, and no third-party analytics cookies.</p>

      <h2>Managing storage</h2>
      <p>
        You can clear browser storage at any time through your browser settings or via <a href="/account">Account settings</a> on NAVORA. Blocking essential storage will prevent sign-in and personalization from working as expected.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><br />
        {CONTACT.phones.join(' · ')}
      </p>
    </LegalLayout>
  );
}
