/**
 * NAVORA — Parent Class 12 deterministic scoring layer.
 * Weights: Interest 35 / Stream 20 / Strength 20 / Priority 15 / Access 10.
 * Same answers -> same scores. No randomness, no LLM.
 */

const norm = (s) => String(s || '').toLowerCase().trim();
function tokensOf(s) {
  return norm(s).split(/[^a-z0-9]+/).filter((t) => t.length > 2);
}
function textHaystack(career) {
  return norm(
    [career.title, career.category, ...(career.traits || []),
     ...(career.strengthsAligned || []), ...(career.skillsToDevelop || []),
     career.description].join(' '),
  );
}
function overlapScore(needles, haystack) {
  if (!needles.length) return 0;
  let hits = 0;
  for (const n of needles) {
    const toks = tokensOf(n);
    if (!toks.length) continue;
    if (toks.some((t) => haystack.includes(t))) hits += 1;
  }
  return hits / needles.length;
}
const STREAM_LABEL = { mpc: 'MPC', bipc: 'BiPC', commerce: 'Commerce', arts: 'Arts/Humanities' };
const UNCERTAIN = new Set(['not_sure_yet', 'not_sure', 'other', 'still_exploring', 'confused']);
function interestValues(answers) {
  const out = [];
  if (answers.interest) out.push(answers.interest);
  if (answers.think) out.push(answers.think);
  return out.filter(Boolean);
}
function pretty(v) {
  return String(v || '').replace(/_/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase());
}
export function scoreParentClass12(answers, career) {
  const hay = textHaystack(career);
  const stream = norm(answers.stream);
  const interests = interestValues(answers);
  const skills = Array.isArray(answers.skills) ? answers.skills : [];
  const priority = norm(answers.priority || '');
  const clarity = norm(answers.clarity || '');
  let interest = overlapScore(interests, hay) * 100;
  if (interests.some((v) => UNCERTAIN.has(norm(v)))) interest = Math.min(interest, 45);
  let streamScore = 50;
  const aff = (career.streamAffinity || []).map(norm);
  if (aff.includes(stream)) streamScore = 100;
  else if (stream === 'commerce' && aff.includes('arts')) streamScore = 65;
  else if (stream === 'arts' && aff.includes('commerce')) streamScore = 65;
  else if (stream === 'mpc' && aff.includes('commerce')) streamScore = 55;
  const usableSkills = skills.filter((s) => !UNCERTAIN.has(norm(s)) && norm(s) !== 'other');
  let strength = usableSkills.length ? overlapScore(usableSkills, hay) * 100 : 45;
  if (usableSkills.length && strength < 40) {
    const sh = { mpc: 'mathematics problem solving computers', bipc: 'biology scientific thinking', commerce: 'business analysis', arts: 'writing communication creativity' };
    const hint = sh[stream] || '';
    if (hint && tokensOf(hint).some((t) => hay.includes(t))) strength = Math.max(strength, 40);
  }
  const PH = {
    'good career opportunities': ['technology', 'engineering', 'finance', 'business', 'healthcare'],
    'good earning potential': ['technology', 'finance', 'engineering', 'corporate', 'data'],
    'job stability': ['healthcare', 'government', 'education', 'stable', 'public'],
    "my child's interest": [''],
    'higher studies': ['research', 'science', 'engineering'],
    'government career': ['government', 'public', 'administration', 'civil'],
    'opportunities abroad': ['technology', 'healthcare', 'engineering', 'research'],
    entrepreneurship: ['business', 'entrepreneur', 'startup'],
  };
  let priorityScore = 55;
  const ph = PH[priority];
  if (ph) {
    if (ph.length === 1 && ph[0] === '') priorityScore = 60;
    else priorityScore = ph.some((h) => hay.includes(h)) ? 90 : 40;
  }
  let access = 60;
  if (aff.includes(stream)) access = 95;
  else if (career.id === 'civil-servant') access = 90;
  else if (stream) access = 45;
  const total = Math.round(interest * 0.35 + streamScore * 0.2 + strength * 0.2 + priorityScore * 0.15 + access * 0.1);
  let adjusted = Math.max(32, Math.min(96, total));
  if (clarity.includes('completely confused')) adjusted = Math.min(adjusted, 78);
  if (UNCERTAIN.has(norm(answers.interest)) && UNCERTAIN.has(norm(answers.think))) adjusted = Math.min(adjusted, 72);
  const factors = [
    { key: 'Interest alignment', weight: 35, value: Math.round(interest), why: interests.length ? `Matched against this field` : 'No strong interest signal given' },
    { key: 'Stream compatibility', weight: 20, value: Math.round(streamScore), why: aff.includes(stream) ? 'Direct route from this stream' : 'Reachable via an extra step' },
    { key: 'Strength alignment', weight: 20, value: Math.round(strength), why: usableSkills.length ? 'Checked against needed strengths' : 'No specific strengths selected yet' },
    { key: 'Priority alignment', weight: 15, value: Math.round(priorityScore), why: priority ? 'Weighed against stated priority' : 'No priority selected' },
    { key: 'Path accessibility', weight: 10, value: Math.round(access), why: access >= 90 ? 'Direct education pathway available' : 'Possible, but needs an extra step' },
  ];
  return { score: adjusted, factors };
}
export function fitLevel(score) {
  if (score >= 75) return 'Strong match';
  if (score >= 55) return 'Good match';
  return 'Worth exploring';
}

export function whyMatches(answers, career, factors) {
  const out = [];
  const iv = interestValues(answers);
  if (factors[0].value >= 50 && iv.length) out.push(`Interest aligns — \u201c${iv.map(pretty).join(' \u00b7 ')}\u201d connects to ${String(career.category || 'this field').toLowerCase()} work.`);
  else if (factors[0].value >= 50) out.push('Interest pattern aligns with the core of this field.');
  if (factors[1].value >= 90) out.push(`${STREAM_LABEL[norm(answers.stream)] || 'Current stream'} keeps a direct education route open.`);
  if (factors[2].value >= 50 && Array.isArray(answers.skills) && answers.skills.length) {
    const usable = answers.skills.filter((s) => !UNCERTAIN.has(norm(s))).slice(0, 2).map(pretty);
    if (usable.length) out.push(`Relevant strengths identified — ${usable.join(', ')}.`);
  }
  if (factors[3].value >= 70 && answers.priority) out.push(`Priority match — reflects \u201c${pretty(answers.priority)}\u201d.`);
  if (!out.length) out.push('Balanced option for the overall pattern of answers — worth a closer look.');
  return out.slice(0, 4);
}
export function tradeOffs(answers, career, factors) {
  const out = [];
  const hay = textHaystack(career);
  if (factors[1].value < 90) out.push('Longer or additional education pathway from the current stream — check the route below.');
  if (/neet|jee|clat|upsc|ca\b/.test(hay) || /competitive|entrance/i.test((career.educationRoutes || []).join(' '))) out.push('Competitive entrance process — needs sustained preparation.');
  if (factors[2].value < 50) out.push(`Certain skills need development — e.g. ${(career.skillsToDevelop || []).slice(0, 2).join(', ') || 'field basics'}.`);
  if (norm(answers.priority).includes('stability') && /startup|entrepreneur|media|design/.test(hay)) out.push('May feel less stable early on than the stated priority suggests.');
  if (norm(answers.priority).includes('earning') && /education|social|agriculture/.test(hay)) out.push('Earnings build slowly — early years trade pay for purpose.');
  if (!out.length) out.push('Needs real-world exposure before committing — try the activity below first.');
  return out.slice(0, 3);
}
const EXAM_PERIODS = [
  { match: ['clat'], name: 'CLAT', period: 'Dec \u00b7 Typical' },
  { match: ['cuet'], name: 'CUET-UG', period: 'May \u00b7 Typical' },
  { match: ['ailet'], name: 'AILET', period: 'Dec \u00b7 Typical' },
  { match: ['jee'], name: 'JEE Main', period: 'Jan / Apr \u00b7 Typical' },
  { match: ['neet'], name: 'NEET-UG', period: 'May \u00b7 Typical' },
  { match: ['nata', 'jee paper 2'], name: 'NATA / JEE Paper 2', period: 'Apr onwards \u00b7 Typical' },
  { match: ['ca foundation', 'ca '], name: 'CA Foundation', period: 'May / Nov \u00b7 Typical' },
  { match: ['cs ', 'cma'], name: 'CS / CMA entry', period: 'Jun / Dec \u00b7 Typical' },
  { match: ['nid', 'uceed', 'nift'], name: 'Design entrances (UCEED / NID / NIFT)', period: 'Jan \u00b7 Typical' },
  { match: ['upsc', 'psc'], name: 'UPSC / State PSC (after graduation)', period: 'May onwards \u00b7 Typical' },
  { match: ['tet', 'ctet'], name: 'TET / CTET (after graduation + B.Ed)', period: 'Jul / Dec \u00b7 Typical' },
  { match: ['cat', 'mat', 'xat'], name: 'MBA entrances (after graduation)', period: 'Nov \u00b7 Typical' },
  { match: ['gate'], name: 'GATE (after B.Tech)', period: 'Feb \u00b7 Typical' },
];
export function examsForCareer(career) {
  const blob = norm([...(career.educationRoutes || []), career.title, career.category].join(' | '));
  const found = EXAM_PERIODS.filter((e) => e.match.some((m) => blob.includes(norm(m))));
  if (!found.length) {
    const via = (career.educationRoutes || []).find((r) => /via|\+/i.test(r));
    if (via) return [{ name: via.replace(/^.*via\s*/i, '').slice(0, 42), period: 'Check official notice' }];
    return [{ name: 'Merit / university-level admission', period: 'Varies by college' }];
  }
  return found.slice(0, 4);
}
export function degreeOf(career) {
  const route = (career.educationRoutes || [])[0] || '';
  const short = route.split(/[\(→+]/)[0].trim();
  return { full: route, short: short.length > 46 ? `${short.slice(0, 46)}\u2026` : short };
}
export function nextStepsFor(career) {
  const skill = (career.skillsToDevelop || [])[0] || 'core basics';
  const raw = (career.experienceIdeas || [])[0] || 'Talk to someone doing this work';
  const activity = raw.charAt(0).toUpperCase() + raw.slice(1);
  return {
    month: [`Try: ${activity}`, `Talk to one person working in ${String(career.category || 'the field').toLowerCase()}`, `Strengthen: ${String(skill).toLowerCase()}`],
    quarter: [`Research 3 ${degreeOf(career).short || 'degree'} programs`, 'Compare entrance requirements & timelines', 'Complete one small field-related project'],
    later: ['Compare 2–3 colleges on fees & outcomes', 'Check eligibility for the chosen route', 'Revisit this direction after exploration'],
  };
}
export function headerContext(answers) {
  const bits = [];
  if (answers.interest) bits.push(`Interest: ${pretty(answers.interest)}`);
  if (answers.think && norm(answers.think) !== norm(answers.interest)) bits.push(pretty(answers.think));
  const left = bits.join(' \u00b7 ') || 'Based on your answers';
  const parts = [left];
  if (answers.priority) parts.push(`Priority: ${pretty(answers.priority)}`);
  if (answers.stream && STREAM_LABEL[norm(answers.stream)]) parts.push(`Stream: ${STREAM_LABEL[norm(answers.stream)]}`);
  return parts;
}
