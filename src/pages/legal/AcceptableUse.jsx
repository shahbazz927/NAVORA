import LegalLayout from '../../components/LegalLayout';
import { useScrollTop } from '../../hooks/useLocalStorage';
import { CONTACT } from '../../config/contact';

export default function AcceptableUse() {
  useScrollTop();
  return (
    <LegalLayout
      title="Acceptable Use"
      intro="Keeping NAVORA helpful, respectful, and safe for everyone exploring their next step."
      lastUpdated="September 2026"
    >
      <p>To keep the platform useful and safe, please do not:</p>
      <ul>
        <li>Attempt to misuse the AI Advisor or generate harmful, misleading, or harassing content.</li>
        <li>Try to scrape, reverse-engineer, or bypass usage limits and authentication.</li>
        <li>Submit false information, impersonate others, or upload malicious content.</li>
        <li>Use the service for anything unlawful or that infringes on the rights of others.</li>
      </ul>
      <p>
        Where needed we may limit or suspend access that violates these expectations. To report misuse, contact <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or visit <a href="/support">Support</a>.
      </p>
    </LegalLayout>
  );
}
