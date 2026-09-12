import LegalLayout from '../../components/LegalLayout';
import { useScrollTop } from '../../hooks/useLocalStorage';
import { CONTACT } from '../../config/contact';

export default function Security() {
  useScrollTop();
  return (
    <LegalLayout
      title="Security"
      intro="How we approach security for the current NAVORA platform."
      lastUpdated="September 2026"
    >
      <h2>Our approach</h2>
      <ul>
        <li>Account authentication is handled through a dedicated authentication provider; passwords are not stored by the application itself.</li>
        <li>Sensitive service credentials are kept server-side and are not exposed to the browser.</li>
        <li>Usage limits and request handling are in place to protect availability and reduce misuse.</li>
        <li>User input is handled through existing validation and security controls in the application.</li>
      </ul>

      <h2>What we do not claim</h2>
      <p>
        We do not claim specific security certifications or guarantee that any online service is entirely free from risk. If our practices change in a meaningful way, this page will be updated.
      </p>

      <h2>What we do not publish</h2>
      <p>To avoid aiding misuse, we do not disclose internal infrastructure details.</p>

      <h2>Reporting an issue</h2>
      <p>
        If you believe you have found a security issue, please contact us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        {CONTACT.phones.length ? <> or <a href={`tel:${CONTACT.phones[0].replace(/\s/g,'')}`}>{CONTACT.phones[0]}</a></> : null} with a description, steps to reproduce if possible, and your contact details.
        Please avoid accessing other users’ data or disrupting the service while testing.
      </p>
      <p>
        You can also reach us through <a href="/support">Support</a>.
      </p>
    </LegalLayout>
  );
}
