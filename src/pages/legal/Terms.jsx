import LegalLayout from '../../components/LegalLayout';
import { useScrollTop } from '../../hooks/useLocalStorage';
import { CONTACT } from '../../config/contact';

export default function Terms() {
  useScrollTop();
  return (
    <LegalLayout
      title="Terms of Service"
      intro="The basic rules for using NAVORA’s education and career guidance platform."
      lastUpdated="September 2026"
    >
      <h2>Using NAVORA</h2>
      <p>
        By creating an account or using the platform, you agree to these terms. If you do not agree, please do not use the service.
      </p>

      <h2>What NAVORA offers</h2>
      <p>
        NAVORA provides questionnaires, guidance based on your answers, and an AI Advisor that explains why a particular direction might be worth exploring. All guidance is informational. It is not a guarantee of any outcome. See our <a href="/disclaimer">Disclaimer</a> for details.
      </p>
      <p>NAVORA is currently available without paid subscriptions or purchase requirements.</p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Provide accurate information when creating an account.</li>
        <li>Keep your sign-in details private and notify us if you suspect unauthorized use of your account.</li>
        <li>Use the platform responsibly and respect the guidance and resources provided to you.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>To keep NAVORA useful and safe, please do not:</p>
      <ul>
        <li>Attempt to misuse the AI Advisor or generate harmful content.</li>
        <li>Scrape, reverse-engineer, or attempt to bypass technical limits or authentication.</li>
        <li>Impersonate others or submit false information.</li>
        <li>Use the service for anything unlawful or that infringes on the rights of others.</li>
      </ul>
      <p>
        More detail is in our <a href="/acceptable-use">Acceptable Use</a> note and <a href="/security">Security</a> overview. Where needed, we may limit or suspend access that violates these terms.
      </p>

      <h2>Intellectual property</h2>
      <p>You keep the rights to what you submit. NAVORA and its licensors retain the rights to the platform, its design, and its content.</p>

      <h2>Availability</h2>
      <p>
        We work to keep NAVORA available and accurate, but guidance draws on information that can change, and AI responses can be incomplete. The service is provided on an “as is” basis without guarantees beyond what applicable law requires.
      </p>

      <h2>Changes to the service and these terms</h2>
      <p>As the platform evolves, features and these terms may be updated. Significant changes will be noted in the product.</p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><br />
        {CONTACT.phones.join(' · ')}
      </p>
    </LegalLayout>
  );
}
