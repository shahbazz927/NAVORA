// ============================================================================
// NAVORA AI Career Advisor — frontend API helper
// ----------------------------------------------------------------------------
// The only place the browser calls the NAVORA backend. It sends the student's
// completed questionnaire answers (never touches the AI provider directly).

import { getStudentContext } from '../data/streamConfig';
import { resolveAnswerSummary, resolveTwelveSummary } from '../data/careerQuestionnaire';
import { buildStudentProfile, scoreCareers, diversify, getPrimaryDirection } from '../data/careerEngine';

/** Coerce a questionnaire option/value into a readable label (never raw ids). */
function labelOf(v) {
  if (v == null) return null;
  if (typeof v === 'string') return v.trim() || null;
  if (typeof v === 'object') return labelOf(v.label != null ? v.label : v.value);
  return String(v);
}

function labelList(v) {
  const arr = Array.isArray(v) ? v : v != null ? [v] : [];
  return arr.map(labelOf).filter(Boolean);
}

/**
 * Map the existing questionnaire answers into a clean, human-readable student
 * profile using NAVORA's own labeled resolvers. Only fields that actually
 * exist in the questionnaire are included - nothing is invented.
 */
function buildResolvedProfile(userType, answers = {}, context) {
  let detail = null;
  try {
    if (answers.educationStatus || answers.streamV2) detail = resolveTwelveSummary(answers);
    else if (answers.stream) detail = resolveAnswerSummary(answers);
  } catch {
    detail = null;
  }

  const stageNames = {
    class10: 'Class 10 student',
    class12: 'Class 12 student',
    graduate: 'Graduate / college student',
    parent: 'Parent of a student',
  };

  const profile = {
    education_level: context?.stageLabel || null,
    current_stage: stageNames[userType] || null,
    stream: context?.stream?.label || context?.field?.label || null,
    degree: labelOf(answers.currentDegree || answers.degree),
    specialization: labelOf(answers.specialization),
    favorite_subjects: labelList(detail?.subjectInterests),
    interests: labelList(detail?.interestArea || detail?.interest || (context?.selections || [])),
    strengths: labelList(detail?.strengths),
    skills: labelList(detail?.skills || answers.skills),
    career_interests: labelList(detail?.specificInterest || detail?.direction || detail?.career),
    work_preferences: labelList(detail?.workStyle || detail?.work),
    preferred_environment: labelOf(detail?.workEnvironment),
    goals: labelList(detail?.futureDirection || detail?.future),
    concerns: labelList(detail?.concern || answers.concern),
    location: labelOf(detail?.preference || answers.preference),
    other_information:
      [
        detail?.motivation && 'Motivation: ' + labelOf(detail.motivation),
        detail?.studyCommitment && 'Study commitment: ' + labelOf(detail.studyCommitment),
        detail?.decisionConfidence && 'Decision confidence: ' + labelOf(detail.decisionConfidence),
        detail?.careerPriorities && 'Career priorities: ' + labelOf(detail.careerPriorities),
        detail?.priority && 'Priority: ' + labelOf(detail.priority),
      ]
        .filter(Boolean)
        .join('; ') || null,
  };

  // Drop fields the questionnaire did not provide.
  Object.keys(profile).forEach((k) => {
    const v = profile[k];
    if (v == null || (Array.isArray(v) && v.length === 0) || v === '') delete profile[k];
  });
  return profile;
}

/**
 * Serialize the existing questionnaire answers + derived student context into
 * the payload the backend expects. Reuses NAVORA's own data - we do NOT build
 * a second questionnaire.
 */
export function buildAdvicePayload(userType, answers = {}) {
  const context = userType ? getStudentContext(userType, answers) : null;

  const summary = {
    stageLabel: context?.stageLabel || null,
    streamLabel: context?.stream?.label || context?.field?.label || null,
    selections: (context?.selections || []).map((s) => ({
      id: s.id,
      label: s.label,
      emoji: s.emoji,
    })),
  };

  const resolvedProfile = buildResolvedProfile(userType, answers, context);

  // Run NAVORA's career engine to pre-compute evidence-based career candidates.
  // The backend sends these to the LLM so it explains WHY each fits this student
  // rather than inventing careers from scratch. This grounds every recommendation
  // in the student's actual stream, interests, strengths, and stated goals.
  let engineRecommendations = [];
  let primaryDirection = null;
  try {
    const engineProfile = buildStudentProfile(answers, userType);
    const scored = scoreCareers(engineProfile);
    const ranked = diversify(scored, 5);
    engineRecommendations = ranked
      .filter((r) => r.career && typeof r.career === 'object')
      .map((r) => ({
        career: {
          id: r.career.id,
          title: r.career.title,
          category: r.career.category,
          description: r.career.description,
          traits: r.career.traits,
          strengthsAligned: r.career.strengthsAligned,
          skillsToDevelop: r.career.skillsToDevelop,
          educationRoutes: r.career.educationRoutes,
          experienceIdeas: r.career.experienceIdeas,
        },
        score: r.score,
        band: r.band,
        breakdown: r.breakdown,
      }));
    const dir = getPrimaryDirection(ranked, engineProfile);
    if (dir) {
      primaryDirection = {
        label: dir.label || null,
        description: dir.description || null,
        strengths: dir.strengths || [],
      };
    }
  } catch {
    // Engine computation failed - still proceed; LLM will work from raw answers.
  }

  return {
    userType: userType || null,
    summary,
    resolvedProfile,
    answers,
    engineRecommendations,
    primaryDirection,
  };
};


/**
 * Human-readable, friendly messages mapped from the backend's error codes.
 */
const ERROR_MESSAGES = {
  CONFIG_ERROR:
    'The AI advisor is not configured. Please set the OPENROUTER_API_KEY in the backend .env and restart the server.',
  AUTH_ERROR:
    'The AI advisor could not authenticate with OpenRouter. Please check the backend OPENROUTER_API_KEY.',
  INSUFFICIENT_CREDITS:
    'OpenRouter credits are exhausted. Please add credits to continue using the AI advisor.',
  RATE_LIMIT:
    'Too many requests right now. Please wait a moment and try again.',
  PROVIDER_ERROR:
    'The AI provider returned an error while generating advice. Please try again.',
  SERVICE_UNAVAILABLE:
    'AI Advisor is temporarily unavailable. Please try again shortly.',
  TIMEOUT:
    'The AI advisor took too long to respond. Please wait a moment and try again.',
  INVALID_ANSWERS:
    'It looks like the questionnaire answers weren’t captured. Please complete the questionnaire first, then try again.',
  EMPTY_RESPONSE:
    'The AI advisor returned an empty reply. Please try again.',
  INVALID_AI_RESPONSE:
    'The AI advisor returned an unexpected reply. Please try again.',
  INVALID_REQUEST:
    'The request could not be processed. Please try again.',
  BACKEND_UNREACHABLE:
    'Could not reach the AI advisor backend. Make sure the backend server is started (npm run server) and try again.',
  DEFAULT:
    'Something went wrong while contacting the AI advisor. Please try again.',
};

function toFriendlyError(status, payload) {
  // New clean contract: {success:false, message:"..."} — use directly if present
  if (payload && typeof payload.message === 'string' && payload.message.trim()) {
    // If backend returned generic clean message, use it unless we have a more specific mapping
    const code = payload?.error?.code || null;
    const mapped = code && ERROR_MESSAGES[code];
    const err = new Error(mapped || payload.message);
    err.code = code;
    err.status = status;
    return err;
  }
  const code = payload?.error?.code || null;
  const message =
    (code && ERROR_MESSAGES[code]) ||
    (status === 504 && ERROR_MESSAGES.TIMEOUT) ||
    (status === 429 && ERROR_MESSAGES.RATE_LIMIT) ||
    (status === 401 && ERROR_MESSAGES.AUTH_ERROR) ||
    (status === 400 && ERROR_MESSAGES.INVALID_ANSWERS) ||
    ERROR_MESSAGES.DEFAULT;

  const err = new Error(message);
  err.code = code;
  err.status = status;
  return err;
}

async function postJson(path, payload, signal) {
  let res;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (e) {
    if (e.name === 'AbortError') throw toFriendlyError(504, { error: { code: 'TIMEOUT' } });
    // Browser could not reach the backend at all.
    const err = toFriendlyError(503, { error: { code: 'BACKEND_UNREACHABLE' } });
    err.isNetworkError = true;
    err.raw = e;
    throw err;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* ignore non-JSON bodies */
  }

  if (!res.ok) throw toFriendlyError(res.status, data);
  return data;
}

function normalizeChatResponse(data) {
  if (!data) return null;
  // Clean contract: {success:true, message:"..."}
  if (typeof data.message === 'string' && data.message.trim()) return { content: data.message.trim() };
  // Legacy: {content:"..."}
  if (typeof data.content === 'string' && data.content.trim()) return { content: data.content.trim() };
  return data;
}

/**
 * Request structured AI career advice for the student's questionnaire.
 * Returns { recommendedCareers, alternativeCareers } (legacy) or {success,message}. Throws a friendly Error.
 */
export async function getCareerAdvice(userType, answers = {}, options = {}) {
  const payload = buildAdvicePayload(userType, answers);
  const controller = options.signal ? null : new AbortController();
  const signal = options.signal || controller?.signal;

  // Client-side guard: don't even attempt without any answers/context (mirrors
  // the backend's INVALID_ANSWERS check so the user gets fast, clear feedback).
  const hasAnswers = answers && typeof answers === 'object' && Object.keys(answers).length > 0;
  const hasContext = payload.summary.stageLabel || payload.summary.streamLabel || payload.summary.selections.length > 0;
  if (!hasAnswers && !hasContext) {
    throw toFriendlyError(400, { error: { code: 'INVALID_ANSWERS' } });
  }

  try {
    const data = await postJson('/api/career-advice', payload, signal);
    // If backend returned clean {success,message} (chat-style), pass through
    if (data && data.success === true && typeof data.message === 'string') return data;
    return data;
  } finally {
    controller?.abort();
  }
}

/**
 * Free-form advisor chat used by the /advisor page.
 * Returns a plain-text { content }. Throws a friendly Error.
 * Handles both new {success,message} and legacy {content} contracts.
 */
export async function sendAdvisorChat(messages, userType = null, context = null, signal) {
  const data = await postJson(
    '/api/advisor/chat',
    { messages, userType, context },
    signal,
  );
  const normalized = normalizeChatResponse(data);
  if (normalized && normalized.content) return normalized;
  // Fallback to raw data if normalization fails
  if (data && typeof data.message === 'string') return { content: data.message };
  return data;
}

export { ERROR_MESSAGES };