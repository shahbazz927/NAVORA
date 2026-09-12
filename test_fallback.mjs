// Offline unit tests for the NAVORA contextual safe fallback (no network).
// Run: node test_fallback.mjs
import assert from 'node:assert';
import { buildSafeFallback, SAFE_FALLBACK_MESSAGE } from './server/ai/responseValidator.mjs';

let passes = 0;
let total = 0;
function run(name, fn) {
  total++;
  try { fn(); passes++; console.log(`PASS: ${name}`); }
  catch (e) { console.log(`FAIL: ${name} -> ${e.message}`); }
}

const BBA = {
  userType: 'graduate',
  context: {
    stageLabel: 'Graduation / College',
    stream: { id: 'bba', label: 'BBA — Finance' },
    selections: [],
    resolvedProfile: { degree: 'BBA', specialization: 'Finance', interests: ['Finance'], skills: ['Accounting'], career_interests: ['Investment Banking'] },
  },
};

const MPC_PC = {
  userType: 'class12',
  context: {
    stageLabel: 'After Class 12',
    stream: { id: 'science_pcm', label: 'MPC — Physics, Chemistry, Mathematics' },
    selections: [{ label: 'Computer Science & IT' }],
    resolvedProfile: { education_level: 'Class 12', stream: 'MPC', interests: ['Computers'], favorite_subjects: ['Mathematics'] },
  },
};

// Test A — BBA Finance, "What skills do I need to develop?", with prior history.
run('Test A: BBA Finance + history -> skills guidance, NOT generic starter', () => {
  const body = {
    ...BBA,
    messages: [
      { role: 'user', content: 'How do I get started?' },
      { role: 'assistant', content: 'Based on your BBA Finance, start with accounting basics.' },
      { role: 'user', content: 'What skills do I need to develop?' },
    ],
  };
  const out = buildSafeFallback(body);
  assert.notEqual(out, SAFE_FALLBACK_MESSAGE, 'must not be the generic starter');
  assert.ok(!/currently studying/.test(out), 'must not re-ask the questionnaire');
  assert.ok(/excel|accounting|financial analysis|finance/i.test(out), 'should mention BBA Finance skills');
});

// Test A2 — BBA Finance, single first message only (no prior assistant turn).
run('Test A2: BBA Finance + single ask -> contextual skills, NOT generic', () => {
  const body = { ...BBA, messages: [{ role: 'user', content: 'What skills do I need to develop?' }] };
  const out = buildSafeFallback(body);
  assert.notEqual(out, SAFE_FALLBACK_MESSAGE);
  assert.ok(!/currently studying/.test(out));
});

// Test B — Class 12 MPC + computers.
run('Test B: Class 12 MPC + computers -> computing guidance, NOT generic', () => {
  const body = { ...MPC_PC, messages: [{ role: 'user', content: 'What should I learn?' }] };
  const out = buildSafeFallback(body);
  assert.notEqual(out, SAFE_FALLBACK_MESSAGE);
  assert.ok(!/currently studying/.test(out));
  assert.ok(/B\.Tech|computer|MPC|programming/i.test(out), 'should reference the computing direction');
});

// Test C — BBA Finance "What is the best career?" -> relevant careers, not a generic career dump.
run('Test C: BBA Finance best career -> BBA-relevant career options', () => {
  const body = { ...BBA, messages: [{ role: 'user', content: 'What is the best career?' }] };
  const out = buildSafeFallback(body);
  assert.notEqual(out, SAFE_FALLBACK_MESSAGE);
  assert.ok(/bba finance/i.test(out), 'should anchor on BBA Finance');
  assert.ok(/financial analyst|investment banking|audit|accounting|business analysis/i.test(out), 'should list BBA Finance careers');
  assert.ok(!/engineering, medicine, design, defence/.test(out), 'must not be a generic all-careers dump');
});

// Test D — No profile, "How do I get started?" -> the generic starter question is correct here.
run('Test D: No profile -> generic starter ONCE', () => {
  const body = { messages: [{ role: 'user', content: 'How do I get started?' }] };
  assert.equal(buildSafeFallback(body), SAFE_FALLBACK_MESSAGE);
});

// Test E — Profile exists + OpenRouter unavailable (simulating a fallback trigger).
run('Test E: BBA Finance profile (provider down) -> contextual, NOT generic', () => {
  const body = { ...BBA, messages: [{ role: 'user', content: 'How do I get started?' }] };
  const out = buildSafeFallback(body);
  assert.notEqual(out, SAFE_FALLBACK_MESSAGE);
  assert.ok(!/currently studying/.test(out));
});

// Edge robustness — no structured profile but the student self-describes in their
// single message. Must NOT restart the questionnaire.
run('Edge: no profile but message says "I am in Class 12 MPC" -> contextual, NOT generic', () => {
  const body = { userType: 'class12', context: {}, messages: [{ role: 'user', content: 'I am in Class 12 MPC and I like computers. What should I do?' }] };
  const out = buildSafeFallback(body);
  assert.notEqual(out, SAFE_FALLBACK_MESSAGE);
  assert.ok(!/currently studying/.test(out));
});

// Edge — prior back-and-forth but empty profile.
run('Edge: prior history no profile -> never restarts questionnaire', () => {
  const body = {
    messages: [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'Hello! How can I help?' },
      { role: 'user', content: 'What next?' },
    ],
  };
  const out = buildSafeFallback(body);
  assert.notEqual(out, SAFE_FALLBACK_MESSAGE);
  assert.ok(!/currently studying/.test(out), 'history exists, must not restart');
});

console.log(`\n=== ${passes}/${total} fallback tests passed ===`);
if (passes !== total) process.exit(1);