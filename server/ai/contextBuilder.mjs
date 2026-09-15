// Builds the combined context: structured profile + conversation history + current message
// Never invents fields. Maps only what actually exists in NAVORA's answers / resolvedProfile.

export const PROFILE_LABELS = {
  education_level: 'Education level',
  current_stage: 'Current stage',
  stream: 'Stream / field',
  degree: 'Degree',
  specialization: 'Specialisation',
  favorite_subjects: 'Favourite subjects',
  interests: 'Interests',
  strengths: 'Strengths',
  skills: 'Skills',
  career_interests: 'Career interests',
  work_preferences: 'Work / study preferences',
  preferred_environment: 'Preferred environment',
  goals: 'Goals',
  concerns: 'Concerns',
  location: 'Location preference',
  other_information: 'Other information',
};

const EXPLICIT_UNDECIDED = new Set([
  'not_sure',
  'still_exploring',
  'still_figuring',
  'exploring',
  'not_sure_yet',
  'help_me_explore',
  'still_unsure',
  'not_decided',
  'not_sure_yet',
  'other_subject',
]);

function normalizeUndecided(raw) {
  if (raw == null) return null;
  const k = String(raw).toLowerCase().trim().replace(/[\s-]+/g, '_');
  if (EXPLICIT_UNDECIDED.has(k)) return 'Not sure / still exploring (user explicitly indicated undecided)';
  if (k.includes('explor') || k === 'not_sure' || k === 'unsure' || k === 'explore') return 'Not sure / still exploring (user explicitly indicated undecided)';
  return null;
}

function fmtAnswerValue(v) {
  const undecided = normalizeUndecided(v);
  if (undecided) return undecided;
  if (Array.isArray(v)) {
    const parts = v.map(fmtAnswerValue).filter(Boolean);
    return parts.length ? parts.join(', ') : '';
  }
  if (v && typeof v === 'object') {
    const s = JSON.stringify(v);
    return s === '{}' || s === '[]' ? '' : s.replace(/"/g, "'");
  }
  return String(v == null ? '' : String(v).trim());
}

function isMeaningfulValue(v) {
  if (normalizeUndecided(v)) return true;
  if (Array.isArray(v)) return v.filter(Boolean).length > 0;
  if (v && typeof v === 'object') return Object.keys(v).length > 0;
  return Boolean(String(v == null ? '' : String(v).trim()));
}

function formatProfileValue(value) {
  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((x) => {
        const n = normalizeUndecided(x);
        return n || String(x).trim();
      })
      .join('; ');
  }
  if (value && typeof value === 'object') return JSON.stringify(value);
  const n = normalizeUndecided(value);
  if (n) return n;
  return String(value == null ? '' : String(value).trim());
}

/**
 * Build the structured user prompt for /api/career-advice (grounded advice).
 * Uses resolvedProfile, summary, answers, and engine recommendations.
 */
export function buildAdviceUserPrompt(body) {
  const lines = [];
  if (body?.userType) lines.push(`Student type: ${body.userType}`);

  const profile = body?.resolvedProfile && typeof body.resolvedProfile === 'object' ? body.resolvedProfile : {};
  const profileEntries = Object.entries(profile).filter(([, v]) => isMeaningfulValue(v));
  if (profileEntries.length) {
    lines.push('');
    lines.push('STRUCTURED STUDENT PROFILE:');
    for (const [key, value] of profileEntries) {
      const label = PROFILE_LABELS[key] || key;
      const val = formatProfileValue(value);
      if (val) lines.push(`- ${label}: ${val}`);
    }
  }

  const summary = body?.summary || {};
  const selections = Array.isArray(summary.selections)
    ? summary.selections.map((s) => s?.label || s?.id || s?.value || (typeof s === 'string' ? s : null)).filter(Boolean)
    : [];
  if (selections.length) {
    lines.push('');
    lines.push('Selected subjects/interests (as readable labels):');
    selections.forEach((s) => lines.push(`- ${s}`));
  }

  const answers = body?.answers && typeof body.answers === 'object' && !Array.isArray(body.answers) ? body.answers : {};
  const rawEntries = Object.entries(answers)
    .map(([k, v]) => [k, fmtAnswerValue(v)])
    .filter(([, v]) => Boolean(String(v).trim()));
  if (rawEntries.length) {
    lines.push('');
    lines.push('Additional questionnaire answers (field: value):');
    for (const [k, v] of rawEntries) lines.push(`- ${k}: ${v}`);
  }

  const engineRecs = body?.engineRecommendations;
  if (Array.isArray(engineRecs) && engineRecs.length) {
    lines.push('');
    lines.push('PRE-COMPUTED CAREER RECOMMENDATIONS (from NAVORA career engine, scored against this student profile):');
    engineRecs.forEach((rec, i) => {
      const career = rec.career || {};
      lines.push('');
      lines.push(`${i + 1}. ${career.title || career.id || '?'} (category: ${career.category || 'N/A'}, score: ${rec.score || 0}/100, band: ${rec.band || 'N/A'})`);
      const bd = rec.breakdown || {};
      const parts = [];
      if (bd.interestMatch !== undefined) parts.push(`interest=${Math.round(bd.interestMatch * 100)}%`);
      if (bd.strengthMatch !== undefined) parts.push(`strength=${Math.round(bd.strengthMatch * 100)}%`);
      if (bd.workMatch !== undefined) parts.push(`work=${Math.round(bd.workMatch * 100)}%`);
      if (bd.eduCompat !== undefined) parts.push(`education=${Math.round(bd.eduCompat * 100)}%`);
      if (bd.priorityBoost !== undefined) parts.push(`priority=${Math.round(bd.priorityBoost * 100)}%`);
      if (parts.length) lines.push(`   Match breakdown: ${parts.join(', ')}`);
      if (career.description) lines.push(`   Description: ${career.description}`);
      if (career.traits?.length) lines.push(`   Relevant traits/interests: ${career.traits.join(', ')}`);
      if (career.strengthsAligned?.length) lines.push(`   Relevant strengths: ${career.strengthsAligned.join(', ')}`);
      if (career.skillsToDevelop?.length) lines.push(`   Skills to develop: ${career.skillsToDevelop.join(', ')}`);
      if (career.educationRoutes?.length) lines.push(`   Education routes: ${career.educationRoutes.join('; ')}`);
      if (career.experienceIdeas?.length) lines.push(`   Experience ideas: ${career.experienceIdeas.join('; ')}`);
    });
  }

  if (body?.primaryDirection) {
    lines.push('');
    lines.push(`PRIMARY DIRECTION (${body.primaryDirection.label || 'General'}):`);
    if (body.primaryDirection.description) lines.push(body.primaryDirection.description);
    if (body.primaryDirection.strengths?.length) lines.push(`Strengths identified: ${body.primaryDirection.strengths.join(', ')}`);
  }

  lines.push('');
  lines.push('Produce the career direction JSON now. Ground every recommendation in this student actual answers and the pre-computed career engine recommendations. Explain WHY each career fits this specific student. Do not invent careers that are not in the pre-computed list.');
  return lines.join('\n');
}

/**
 * Serialize structured profile + lightweight context for the free-form advisor chat.
 * This string is injected into the system prompt alongside conversation history.
 * Format: "stage=... | stream=... | interests=... | profile=key:val | ..."
 */
export function serializeChatContext(body) {
  const bits = [];
  if (body?.userType) bits.push(`type=${body.userType}`);
  if (body?.context?.stageLabel) bits.push(`stage=${body.context.stageLabel}`);
  const s = body?.context?.stream || body?.context?.field;
  if (s) bits.push(`stream=${s.id || s.label || s}`);
  if (Array.isArray(body?.context?.selections) && body.context.selections.length) {
    bits.push(`interests=${body.context.selections.map((x) => x.label || x).join(',')}`);
  }
  if (body?.context?.resolvedProfile) {
    const rp = body.context.resolvedProfile;
    const entries = Object.entries(rp).filter(([, v]) => isMeaningfulValue(v));
    if (entries.length) {
      bits.push('profile=' + entries.map(([k, v]) => `${k}:${Array.isArray(v) ? v.map((x) => normalizeUndecided(x) || x).join(',') : (normalizeUndecided(v) || v)}`).join(' | '));
    }
  }
  // Also support top-level resolvedProfile (some callers send it there)
  if (body?.resolvedProfile && !body?.context?.resolvedProfile) {
    const rp = body.resolvedProfile;
    const entries = Object.entries(rp).filter(([, v]) => isMeaningfulValue(v));
    if (entries.length) {
      bits.push('profile=' + entries.map(([k, v]) => `${k}:${Array.isArray(v) ? v.map((x) => normalizeUndecided(x) || x).join(',') : (normalizeUndecided(v) || v)}`).join(' | '));
    }
  }
  return bits.join(' | ') || 'new student (no questionnaire yet)';
}

/**
 * Normalize and cap conversation history for the chat endpoint.
 * Ensures: at most 20 messages, role is user/assistant, content is string, current message included.
 */
export function buildChatMessages(rawMessages) {
  const history = Array.isArray(rawMessages) ? rawMessages : [];
  return history.slice(-20).map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: String(m.content ?? ''),
  }));
}
