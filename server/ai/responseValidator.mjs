// NAVORA response validation — single source, no aggressive filtering
export const RETRY_CORRECTION_INSTRUCTION =
  'Return ONLY the final student-facing NAVORA answer. Do not include analysis, reasoning, instructions, prompt text, metadata, or word-count discussion.';

export const SAFE_FALLBACK_MESSAGE =
  'Let\u2019s start with your situation rather than jumping to random career options. What are you currently studying, which subjects do you enjoy most, and do you already have a course or career in mind?';

/**
 * Self-description tokens NAVORA can safely use to decide a fallback is
 * contextual WITHOUT reading anything we don't already own. We only match the
 * student's OWN words in the conversation — we never invent profile data.
 */
const SELF_DESCRIPTION_HINTS = [
  'bba', 'bcom', 'b.com', 'finance', 'accounting', 'banking', 'commerce',
  'mpc', 'pcm', 'bipc', 'science', 'biology', 'medicine', 'biotech', 'biotechnology',
  'btech', 'b.tech', 'engineering', 'bsc', 'bca', 'computer', 'technology',
  'class 10', 'class 12', 'class12', 'mec', 'cec', 'hec',
  'ca ', 'cma', 'law', 'graduate', 'graduation', 'postgraduate',
];

/**
 * Gather every bit of profile info NAVORA already holds (resolvedProfile +
 * context + summary). Only non-empty, real values are included — nothing fake.
 */
function extractProfileBits(body = {}) {
  const ctx = body?.context && typeof body.context === 'object' ? body.context : {};
  const rp = (ctx.resolvedProfile && typeof ctx.resolvedProfile === 'object' ? ctx.resolvedProfile : null) ||
    (body?.resolvedProfile && typeof body.resolvedProfile === 'object' ? body.resolvedProfile : null) ||
    {};
  const bits = [];

  const scalarKeys = ['education_level', 'current_stage', 'stream', 'degree', 'specialization'];
  for (const k of scalarKeys) {
    const v = rp[k];
    if (Array.isArray(v)) { if (v.length) bits.push(v.join(', ')); }
    else if (typeof v === 'string' && v.trim()) bits.push(v.trim());
  }
  const listKeys = ['favorite_subjects', 'interests', 'strengths', 'skills', 'career_interests', 'goals', 'work_preferences'];
  for (const k of listKeys) {
    const v = rp[k];
    if (Array.isArray(v) && v.length) bits.push(v.slice(0, 3).join(', '));
    else if (typeof v === 'string' && v.trim()) bits.push(v.trim());
  }

  const stream = ctx.stream?.label || ctx.field?.label || body?.summary?.streamLabel || null;
  if (stream) bits.push(stream);
  const stage = ctx.stageLabel || body?.summary?.stageLabel || rp.education_level || rp.current_stage || null;
  if (stage) bits.push(stage);
  if (Array.isArray(ctx.selections)) {
    const sels = ctx.selections.map((s) => (s && typeof s === 'object' ? s.label : s)).filter(Boolean);
    if (sels.length) bits.push(sels.slice(0, 3).join(', '));
  }
  if (typeof ctx.family === 'string' && ctx.family.trim()) bits.push(ctx.family.trim());

  return bits.filter(Boolean).join(' \u2014 ');
}

/**
 * Last-resort, PII-safe: use ONLY the student's own words from the recent user
 * messages to decide the fallback is contextual (e.g. first message says
 * "I am in Class 12 MPC" with no structured profile yet). Never invent data.
 */
function extractHintsFromMessages(body = {}) {
  const msgs = Array.isArray(body?.messages) ? body.messages : [];
  const lower = msgs
    .filter((m) => m && m.role === 'user' && typeof m.content === 'string')
    .slice(-3)
    .map((m) => m.content)
    .join('\n')
    .toLowerCase();
  if (!lower) return '';
  const found = SELF_DESCRIPTION_HINTS.filter((h) => lower.includes(h));
  return found.join(',');
}

function hasMeaningfulHistory(body) {
  const msgs = Array.isArray(body?.messages) ? body.messages : [];
  // Any prior assistant reply => a real back-and-forth, not a blank slate.
  if (msgs.some((m) => m && m.role === 'assistant')) return true;
  // A single user message that describes the student's own situation counts too.
  return Boolean(extractHintsFromMessages(body));
}

function pickContextualFallback(knownLower, ctx, rp) {
  // BBA / Commerce / Finance family
  if (knownLower.includes('bba') && knownLower.includes('finance') || knownLower.includes('bcom') && knownLower.includes('finance') || (knownLower.includes('finance') && (knownLower.includes('bba') || knownLower.includes('bcom') || knownLower.includes('commerce')))) {
    return 'Based on your BBA Finance background, focus first on financial analysis, Excel, accounting fundamentals and communication. Start with Excel and financial modelling, then build one practical project to show your skills. Strong BBA Finance directions include Financial Analyst, Investment Banking, Audit & Accounting, and Business Analysis.';
  }
  if (knownLower.includes('bba') || knownLower.includes('commerce') || knownLower.includes('finance') || knownLower.includes('accounting') || knownLower.includes('banking')) {
    return 'Based on your commerce/finance background, build Excel, financial analysis, accounting fundamentals and communication skills. Start with an Excel + financial modelling mini-project, then explore internships in banking, accounting or business analysis.';
  }
  if (knownLower.includes('mpc') || knownLower.includes('pcm') || knownLower.includes('science') || knownLower.includes('computer') || knownLower.includes('technology')) {
    // Check if interest mentions computers
    if (knownLower.includes('computer') || knownLower.includes('technology') || knownLower.includes('pcm') || knownLower.includes('mpc')) {
      return 'Since you\u2019re in Class 12 MPC and interested in computers, focus on programming fundamentals (Python/C), data structures, and maths. Compare B.Tech Computer Science, BCA and related computing paths, check JEE/CUET eligibility, and start building one small coding project.';
    }
  }
  if (knownLower.includes('bipc') || knownLower.includes('biology') || knownLower.includes('medicine') || knownLower.includes('biotech')) {
    return 'Based on your BiPC background, compare medicine, allied health, biotechnology and related life-science routes. Check NEET and other eligibility, then pick one area to research deeply and build relevant lab or science project experience.';
  }
  if (knownLower.includes('b.tech') || knownLower.includes('btech') || knownLower.includes('engineering')) {
    return 'Based on your engineering background, strengthen core technical skills, one programming language, and a hands-on project in your branch. Compare higher studies (GATE/CAT) vs industry roles and build one portfolio project.';
  }
  if (knownLower.includes('bsc') || knownLower.includes('bca') || knownLower.includes('b.com') || knownLower.includes('ba ')) {
    return `Based on what you\u2019ve told me (${ctx.stream?.label || ctx.field?.label || rp.degree || 'your current course'}), focus on core subject fundamentals, communication, and one practical project in your field, then compare realistic next steps like higher studies or entry-level roles.`;
  }
  // Generic contextual fallback when something is known but no specific mapping matched
  return null;
}

/**
 * Context-aware safe fallback. When NAVORA already knows the student's profile
 * (stream, degree, stage), never ask for that information again — acknowledge it
 * and give a practical, honest next step instead. Falls back to the neutral
 * SAFE_FALLBACK_MESSAGE when nothing is known yet.
 *
 * RULE: generic starter question ONLY when genuinely NO profile AND NO meaningful history.
 */
export function buildSafeFallback(body = {}) {
  const ctx = body?.context && typeof body.context === 'object' ? body.context : {};
  const rp = (ctx.resolvedProfile && typeof ctx.resolvedProfile === 'object' ? ctx.resolvedProfile : null) ||
    (body?.resolvedProfile && typeof body.resolvedProfile === 'object' ? body.resolvedProfile : null) ||
    {};

  const profileBits = extractProfileBits(body);
  const historyKnown = hasMeaningfulHistory(body);
  // If there is no structured profile, use the student's own words (if any) as a
  // last resort so a single self-describing message is still treated as known.
  const hints = profileBits ? '' : extractHintsFromMessages(body);
  const allKnownStr = profileBits || hints;
  const knownLower = [profileBits, hints].filter(Boolean).join(' ').toLowerCase();

  // Generic starter ONLY when genuinely NO profile AND NO meaningful history.
  if (!allKnownStr && !historyKnown) return SAFE_FALLBACK_MESSAGE;

  // Known profile OR known context -> specific contextual fallback first.
  const specific = pickContextualFallback(knownLower, ctx, rp);
  if (specific) return specific;

  // Known from structured profile but no exact domain match.
  if (profileBits) {
    return (
      `Based on what you\u2019ve told me (${profileBits}), ` +
      `focus on the core skills for that direction, build one practical project, and compare 2\u20133 realistic next options with their eligibility. Try again in a moment for a detailed personalised answer.`
    );
  }

  // History exists but no usable profile (edge: user chatted before questionnaire).
  if (historyKnown) {
    return 'I couldn\u2019t generate a full answer right now \u2014 but I remember our conversation. Tell me a bit more about what step you want to take next, and I\u2019ll give you specific guidance based on what you\u2019ve already shared.';
  }

  return SAFE_FALLBACK_MESSAGE;
}

const LEAKAGE_PHRASES = [
  'we need to respond',
  'we need to craft',
  'we need to formulate',
  'we need to produce',
  'we need to write',
  'we need to give',
  'let\u2019s craft',
  "let's craft",
  'let\u2019s formulate',
  "let's formulate",
  'let\u2019s produce',
  "let's produce",
  'word count',
  'words, warm',
  'student context:',
  'student: class',
  'according to my instructions',
  'according to policy',
  'thus final answer',
  'system prompt',
  'developer instructions',
  'internal reasoning',
  'chain of thought',
  'based on the instructions',
  'i was instructed to',
  'my instructions say',
  'prompt construction',
  'the student is',
  'the student wants',
  'they want to know',
  'i need to guide',
  'i should confirm',
  'we should ask',
];

export function isLeakyResponse(text) {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  for (const p of LEAKAGE_PHRASES) {
    if (lower.includes(p.toLowerCase())) return true;
  }
  const hasThirdPerson =
    lower.includes('the student') ||
    lower.includes("they're in ") ||
    lower.includes('they have a strong');
  const hasPlanning =
    lower.includes('i need to') ||
    lower.includes('i should') ||
    lower.includes('i will ') ||
    lower.includes('but i need');
  if (hasThirdPerson && hasPlanning) return true;
  if (lower.trim().startsWith('okay,') && hasThirdPerson) return true;
  return false;
}

export function validateResponse(text) {
  if (!text || typeof text !== 'string' || !text.trim()) return { valid: false, reason: 'empty' };
  if (isLeakyResponse(text)) return { valid: false, reason: 'leakage' };
  return { valid: true };
}
