import LegalLayout from '../../components/LegalLayout';
import { useScrollTop } from '../../hooks/useLocalStorage';
import { CONTACT } from '../../config/contact';

export default function Privacy() {
  useScrollTop();
  return (
    <LegalLayout
      title="Privacy Policy"
      intro="How NAVORA handles the information you share while exploring education and career options."
      lastUpdated="September 2026"
    >
      <p>
        NAVORA helps students and parents explore streams, courses, and career directions. We collect only what is needed to provide that guidance and keep your account working.
      </p>

      <h2>Information you provide</h2>
      <ul>
        <li><strong>Account information</strong> — email address and display name when you create an account or sign in. If you use Google, GitHub, or Apple sign-in, we receive only what the authentication provider shares.</li>
        <li><strong>Questionnaire information</strong> — answers about your education stage, stream, subjects, interests, strengths, and preferences that you enter in the onboarding and guidance flows.</li>
        <li><strong>Advisor context</strong> — when you request personalized guidance, the answers relevant to your question are sent to our server to generate a response. The server does not keep a separate copy of your questionnaire.</li>
      </ul>

      <h2>Information stored in your browser</h2>
      <p>
        To keep your progress without requiring repeated entry, your recent answers and chat history are saved locally in your browser. This data stays on your device and is removed when you clear site data or use the clear option in your account settings. It automatically expires after a short period of inactivity.
      </p>

      <h2>Why we use this information</h2>
      <ul>
        <li>To create and maintain your account and keep you signed in.</li>
        <li>To generate personalized education and career recommendations and advisor replies based on your assessment.</li>
        <li>To troubleshoot issues and improve the quality of guidance during this early stage of the product.</li>
      </ul>

      <h2>Services we rely on</h2>
      <ul>
        <li><strong>Authentication provider</strong> — manages sign-in, session handling, and account recovery.</li>
        <li><strong>External AI provider</strong> — processes the guidance request and returns a response. Only the information needed for that response is shared.</li>
      </ul>
      <p>No advertising or analytics services are currently used.</p>

      <h2>Managing your information</h2>
      <ul>
        <li>View and manage your local progress in <a href="/account">Account settings</a>, where you can export or clear locally stored data.</li>
        <li>Update your password or sign out from the same account area.</li>
        <li>For other requests, contact us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</li>
      </ul>

      <h2>Younger users</h2>
      <p>
        NAVORA is often used around Class 10 and Class 12 decisions, sometimes with help from a parent or guardian. If you are under the age where independent consent is expected in your region, please use the platform together with a parent or guardian.
      </p>

      <h2>Security</h2>
      <p>
        Authentication is handled by a dedicated provider, and sensitive credentials are kept server-side. No online service can be guaranteed to be completely secure, and we do not claim otherwise. You can read more in our <a href="/security">Security overview</a>.
      </p>

      <h2>Changes to this policy</h2>
      <p>As NAVORA evolves, this policy may be updated and the date above will be revised.</p>

      <h2>Contact</h2>
      <p>
        Questions about privacy: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><br />
        Phone: <a href={`tel:${CONTACT.phones[0].replace(/\s/g,'')}`}>{CONTACT.phones[0]}</a> · <a href={`tel:${CONTACT.phones[1].replace(/\s/g,'')}`}>{CONTACT.phones[1]}</a>
      </p>
    </LegalLayout>
  );
}
