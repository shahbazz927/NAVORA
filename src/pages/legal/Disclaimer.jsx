import LegalLayout from '../../components/LegalLayout';
import { useScrollTop } from '../../hooks/useLocalStorage';
import { CONTACT } from '../../config/contact';

export default function Disclaimer() {
  useScrollTop();
  return (
    <LegalLayout
      title="Disclaimer"
      intro="Understanding the role and limits of NAVORA’s guidance."
      lastUpdated="September 2026"
    >
      <p>
        NAVORA is designed to help you explore education and career options with more clarity. It is not a promise of any particular outcome.
      </p>

      <h2>What our guidance is — and is not</h2>
      <ul>
        <li>Recommendations are suggestions to explore, based on the information you provide. They are not guaranteed admission, employment, or salary outcomes.</li>
        <li>They are not professional financial advice and do not replace qualified educational or career professionals where personal evaluation matters.</li>
        <li>Nothing on the platform creates a formal advisor–client relationship.</li>
      </ul>

      <h2>AI-generated responses</h2>
      <p>
        Parts of NAVORA’s guidance are supported by AI, which can occasionally produce incomplete or outdated information. Details about colleges, courses, entrance exams, eligibility, and career paths can change. Please confirm important decisions with current, official sources and, where appropriate, a qualified counselor.
      </p>

      <h2>Use guidance as a starting point</h2>
      <p>We encourage you to treat NAVORA’s suggestions as a way to discover and compare options, then verify the details that matter most before making a final decision.</p>

      <p>
        Found something that looks incorrect? Please let us know via <a href="/support">Support</a> at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
      </p>
    </LegalLayout>
  );
}
