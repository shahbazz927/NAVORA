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
    const hints = { mpc: 'mathematics problem solving computers', bipc: 'biology scientific thinking', commerce: 'business analysis', arts: 'writing communication creativity' };
    const hint = hints[stream] || '';
    if (hint && tokensOf(hint).some((t) => hay.includes(t))) strength = Math.max(strength, 40);
  }
  const PRIORITY_HINTS = {
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
  const hints = PRIORITY_HINTS[priority];
  if (hints) {
    if (hints.length === 1 && hints[0] === '') priorityScore = 60;
    else priorityScore = hints.some((h) => hay.includes(h)) ? 90 : 40;
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
    { key: 'Interest alignment', weight: 35, value: Math.round(interest), why: interests.length ? `Matched \u201c${interests.map(pretty).join(' \u00b7 ')}\u201d against this field` : 'No strong interest signal given' },
    { key: 'Stream compatibility', weight: 20, value: Math.round(streamScore), why: aff.includes(stream) ? `${STREAM_LABEL[stream] || 'Stream'} gives a direct route` : `Reachable from ${STREAM_LABEL[stream] || 'this stream'} via an extra step` },
    { key: 'Strength alignment', weight: 20, value: Math.round(strength), why: usableSkills.length ? `Checked ${usableSkills.map(pretty).slice(0, 3).join(', ')} against needed strengths` : 'No specific strengths selected yet' },
    { key: 'Priority alignment', weight: 15, value: Math.round(priorityScore), why: priority ? `Weighed against priority \u201c${pretty(answers.priority)}\u201d` : 'No priority selected' },
    { key: 'Path accessibility', weight: 10, value: Math.round(access), why: access >= 90 ? 'Direct education pathway available' : 'Possible, but needs an extra step' },
  ];
  return { score: adjusted, factors };
}
export function fitLevel(score) {
  if (score >= 75) return 'Strong match';
  if (score >= 55) return 'Good match';
  return 'Worth exploring';
}
