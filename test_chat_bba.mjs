// Live HTTP test for the BBA Finance chat path.
// Requires a server running on the PORT in BASE. Start one (e.g. PORT=3101) then
// run: node test_chat_bba.mjs
// Asserts the reply for a known BBA Finance student is NEVER the generic
// onboarding starter question — regardless of whether OpenRouter answers, falls
// back, or errors.
const BASE = process.env.BASE || 'http://127.0.0.1:3101';
const STARTER_MARKERS = ['What are you currently studying', 'which subjects do you enjoy'.toLowerCase().slice(0, 30)];

async function main() {
  const res = await fetch(`${BASE}/api/advisor/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userType: 'graduate',
      context: {
        stageLabel: 'Graduation / College',
        stream: { id: 'bba', label: 'BBA — Finance' },
        selections: [],
        resolvedProfile: {
          degree: 'BBA',
          specialization: 'Finance',
          interests: ['Finance'],
          skills: ['Accounting'],
          career_interests: ['Investment Banking'],
        },
      },
      messages: [
        { role: 'user', content: 'How do I get started?' },
        { role: 'assistant', content: 'Based on your BBA Finance, start with accounting basics.' },
        { role: 'user', content: 'What skills do I need to develop?' },
      ],
    }),
  });
  const data = await res.json().catch(() => ({}));
  const msg = (data && typeof data.message === 'string' ? data.message : '') || '';
  const lower = msg.toLowerCase();

  console.log(`Status: ${res.status}`);
  console.log(`Reply: ${msg.slice(0, 600)}`);

  const genericStarter =
    lower.includes('what are you currently studying') ||
    lower.includes('which subjects do you enjoy most');

  console.log(genericStarter ? 'RESULT: FAIL — returned the generic starter question' : 'RESULT: OK — did NOT return the generic starter question');
  if (genericStarter) process.exit(1);
}

main().catch((e) => { console.error('ERROR', e.message); console.log('RESULT: TEST-ERROR'); process.exit(1); });