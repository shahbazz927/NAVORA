// ============================================================================
// NAVORA AI Career Advisor  OpenRouter backend
// ----------------------------------------------------------------------------
// A tiny, dependency-free Node HTTP server (Node >= 18) that:
//    POST /api/career-advice    structured AI career advice from the student's
//                                 completed questionnaire answers
//    POST /api/advisor/chat     free-form advisor chat (plain-text replies)
//    GET  /api/health, /health  liveness probe
//
// The browser NEVER talks to the AI provider directly. It only ever calls this
// server, the only process that reads OPENROUTER_*and holds the API key.
//
// Env vars (loaded from .env at the project root):
//   OPENROUTER_API_KEY     (required  your OpenRouter API key)
//   OPENROUTER_BASE_URL    (default https://openrouter.ai/api/v1)
//   OPENROUTER_SITE_URL    (default https://navora.in)
//   OPENROUTER_APP_NAME    (default NAVORA)
//   AI_PRIMARY_MODEL       (default meta-llama/llama-3-70b-instruct)
//   AI_FALLBACK_MODELS     (comma-separated fallback models)
//   MAX_MODEL_ATTEMPTS     (default 3)
//   OPENROUTER_TIMEOUT_MS  (default 30000)
//   AI_RATE_LIMIT_PER_MIN  (default 30)
//   PORT                   (default 3001)
// ============================================================================


import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ADVICE_SYSTEM_PROMPT, buildChatSystemPrompt } from './ai/systemPrompt.mjs';
import { buildAdviceUserPrompt, serializeChatContext, buildChatMessages } from './ai/contextBuilder.mjs';
import { isLeakyResponse, RETRY_CORRECTION_INSTRUCTION, SAFE_FALLBACK_MESSAGE, buildSafeFallback } from './ai/responseValidator.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

//  Best-effort local .env loading (so OPENROUTER_* are read even when the
// server is started without --env-file). Runs before config defaults resolve.

try {
  const envPath = join(ROOT, '.env');
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
} catch {
  // No .env present  rely on process.env / defaults.


}

//  Configuration -----------------------------------------------------------
// The browser NEVER talks to OpenRouter directly; only this server process
// holds the API key (read from the environment / .env at the project root).
const OPENROUTER_API_KEY = (process.env.OPENROUTER_API_KEY || '').trim();
const OPENROUTER_BASE_URL = (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
const OPENROUTER_SITE_URL = (process.env.OPENROUTER_SITE_URL || 'https://navora.in').replace(/\/+$/, '');
const OPENROUTER_APP_NAME = (process.env.OPENROUTER_APP_NAME || 'NAVORA').trim();
const PORT = Number(process.env.PORT) || 3001;
const MAX_BODY_BYTES = 1024 * 512; // 512 KB

// Centralised model roster. The primary model is tried first; on transient
// provider failures (HTTP 429 / 5xx / timeout / network) the request is
// retried against each fallback in turn, so a single rate-limited or flaky
// provider never breaks the AI Advisor. OPENROUTER_MODEL is still honoured
// for backwards compatibility and is treated as the primary model.
const DEFAULT_PRIMARY_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';
const AI_PRIMARY_MODEL = (process.env.AI_PRIMARY_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_PRIMARY_MODEL).trim();
const DEFAULT_FALLBACK_MODELS = [
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'openrouter/free',
];
const AI_FALLBACK_MODELS = (process.env.AI_FALLBACK_MODELS || DEFAULT_FALLBACK_MODELS.join(','))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Maximum number of distinct models to attempt before giving up entirely.
const MAX_MODEL_ATTEMPTS = Math.max(1, Number(process.env.MAX_MODEL_ATTEMPTS) || 3);

// De-duplicate (primary first) while preserving order, then cap to the limit.
const AI_MODELS = Array.from(new Set([AI_PRIMARY_MODEL, ...AI_FALLBACK_MODELS])).slice(0, MAX_MODEL_ATTEMPTS);

// Per-request timeout (ms). A single model gets this long before it is treated
// as a temporary failure and we move on to the next model.
const OPENROUTER_TIMEOUT_MS = Math.max(1000, Number(process.env.OPENROUTER_TIMEOUT_MS) || 30000);

// In-memory per-IP rate limit for the AI endpoints (requests per minute).
const AI_RATE_LIMIT_PER_MIN = Number(process.env.AI_RATE_LIMIT_PER_MIN) || 30;

// Hard token cap used ONLY as a safety net for the free-form advisor chat.
// Words are not tokens, so the chat system prompt is the primary length
// control; this just stops a reply from running away into a long essay.
const CHAT_MAX_TOKENS = Number(process.env.CHAT_MAX_TOKENS) || 160;

function missingApiKey() {
  return !OPENROUTER_API_KEY;
}

//  Lightweight server-side logging (never logs secrets or student PII) -------
const log = {
  info: (...a) => console.log('[AI]', ...a),
  warn: (...a) => console.warn('[AI]', ...a),
  err: (...a) => console.error('[AI]', ...a),
};

//  Small helpers ------------------------------------------------------------
function isRetryableHttpStatus(status) {
  // 429 (rate limit), 408/529 (transient) and 5xx are worth retrying.
  return status === 429 || status === 408 || status === 529 || (status >= 500 && status < 600);
}

function parseRetryAfter(header) {
  if (!header) return null;
  const trimmed = String(header).trim();
  const asSeconds = Number(trimmed);
  if (!Number.isNaN(asSeconds) && asSeconds >= 0) return Math.min(asSeconds, 60) * 1000; // seconds -> ms, capped at 60s
  const asDate = Date.parse(trimmed);
  if (!Number.isNaN(asDate)) {
    const ms = asDate - Date.now();
    return ms > 0 ? Math.min(ms, 60000) : 0;
  }
  return null;
}

function jitter(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//  In-memory per-IP rate limiter (fixed window) -----------------------------
const _rateLimitStore = new Map();
function rateLimitClient(ip) {
  const now = Date.now();
  const entry = _rateLimitStore.get(ip);
  if (!entry || now >= entry.resetAt) {
    const fresh = { count: 1, resetAt: now + 60000 };
    _rateLimitStore.set(ip, fresh);
    return { limited: false };
  }
  entry.count += 1;
  if (entry.count > AI_RATE_LIMIT_PER_MIN) {
    return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { limited: false };
}

// ADVICE_SYSTEM_PROMPT, buildAdviceUserPrompt, PROFILE_LABELS and fmtAnswerValue
// now live in server/ai/ — single source of truth via NAVORA_AI_RULES.md
// Aliased here for backwards-compat within this file where needed:
function buildUserPrompt(body) { return buildAdviceUserPrompt(body); }

//  Helpers ------------------------------------------------------------------
function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        reject(Object.assign(new Error('Invalid JSON body'), { code: 'INVALID_JSON' }));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Single attempt against OpenRouter for ONE model, with an AbortController
 * timeout and the OpenRouter-recommended attribution headers
 * (HTTP-Referer / X-Title). Resolves with { content, model }.
 *
 * Rejects with a typed Error whose `.code` is one of:
 *   HTTP_<status>   provider returned non-2xx (401, 402, 429, 5xx...)
 *   TIMEOUT         request exceeded OPENROUTER_TIMEOUT_MS
 *   NETWORK_ERROR   fetch threw (DNS / connection refused / ECONNRESET...)
 *   EMPTY_RESPONSE  provider returned no usable content
 * Each error also carries `.status` (HTTP-ish), `.retryable` (bool) and
 * `.retryAfter` (ms, when the provider supplied a Retry-After header).
 */
async function callOpenRouterOnce(model, messages, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error('OPENROUTER_TIMEOUT')), OPENROUTER_TIMEOUT_MS);
  try {
    const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': OPENROUTER_SITE_URL,
        'X-Title': OPENROUTER_APP_NAME,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        // Disable provider reasoning/thinking fields — we only want final content
        reasoning: { exclude: true },
        // Hard token cap only for requests that opt in (the free-form advisor
        // chat) so a reply can't run away into a long essay. Omitted for
        // /api/career-advice, which needs room for its JSON output. (Words !=
        // tokens, so the chat system prompt is the primary length control.)
        ...(opts.maxTokens ? { max_tokens: opts.maxTokens } : {}),
      }),
      signal: controller.signal,
    });

    const retryAfter = parseRetryAfter(res.headers?.get('retry-after'));

    if (!res.ok) {
      let detail = '';
      try {
        detail = await res.text();
      } catch {
        /* ignore */
      }
      const err = new Error(`OpenRouter responded with HTTP ${res.status}`);
      err.code = `HTTP_${res.status}`;
      err.status = res.status;
      err.detail = detail;
      err.retryable = isRetryableHttpStatus(res.status);
      err.retryAfter = retryAfter;
      throw err;
    }

    const data = await res.json();
    const content = String(data?.choices?.[0]?.message?.content || '').trim();
    if (!content) {
      throw Object.assign(new Error('Empty response from OpenRouter'), {
        code: 'EMPTY_RESPONSE', status: 502, retryable: true, retryAfter: null,
      });
    }
    return { content, model: data?.model || model };
  } catch (err) {
    // Timeout / AbortError -> a single, consistent TIMEOUT error.
    if (controller.signal.aborted || err?.name === 'AbortError' || err?.message?.includes('OPENROUTER_TIMEOUT')) {
      throw Object.assign(new Error('OPENROUTER_TIMEOUT'), {
        code: 'TIMEOUT', status: 408, retryable: true, retryAfter: null,
      });
    }
    // Already a typed error (HTTP_* / EMPTY_RESPONSE) -> rethrow unchanged.
    if (err?.code && typeof err.code === 'string') throw err;
    // Underlying fetch/network failure (DNS, connection refused, ECONNRESET...).
    throw Object.assign(new Error(`OpenRouter request failed: ${err.message}`), {
      code: 'NETWORK_ERROR', status: 502, retryable: true, retryAfter: null, raw: err,
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Request generation from OpenRouter with transparent model fallback.
 *
 * Strategy (429-aware):
 *   - For each model in AI_MODELS (capped at MAX_MODEL_ATTEMPTS):
 *       * attempt the request once
 *       * on HTTP 429 (rate limit) -> DO NOT retry same model, immediately switch to next model
 *       * on other transient errors (5xx / 408 / 529 / timeout / network / empty) -> retry SAME model once after backoff
 *       * if it still fails, fall through to next fallback model
 *   - non-retryable errors (401 auth, 402 credits, 400/422 malformed,
 *     404/403 model/route problems) abort immediately across ALL models
 *   - if every model is exhausted:
 *       * if all failures were 429 -> throw ALL_RATE_LIMITED (caller returns safe fallback)
 *       * otherwise -> throw SERVICE_UNAVAILABLE
 *
 * Resolves with { content, model } or rejects with a classified Error.
 */
async function requestWithFallback(messages, opts = {}) {
  const models = AI_MODELS;
  let lastError = null;
  let rateLimitedCount = 0;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    log.info(`Trying model: ${model} (attempt ${i + 1}/${models.length})`);

    let modelFailedWith429 = false;

    // One attempt, plus one retry only for non-429 transient errors.
    for (let retry = 0; retry < 2; retry++) {
      try {
        return await callOpenRouterOnce(model, messages, opts);
      } catch (err) {
        lastError = err;
        if (!err?.retryable) {
          // Non-retryable (auth, credits, bad request) -> give up across ALL models.
          log.warn(`Model ${model} -> non-retryable error ${err.code}`);
          throw err;
        }
        const is429 = err.status === 429 || err.code === 'HTTP_429';
        if (is429) {
          // 429: never retry same model — immediately switch to next fallback.
          log.warn(`Model ${model} -> rate-limited ${err.code} (HTTP 429), switching immediately`);
          modelFailedWith429 = true;
          break;
        }
        log.warn(`Model ${model} -> retryable ${err.code}${err.status ? ' (HTTP ' + err.status + ')' : ''}`);
        if (retry === 1) break; // already retried once; move on to next model

        const wait = (err.retryAfter != null && err.retryAfter > 0) ? err.retryAfter : jitter(500, 1000);
        log.info(`Retrying same model after ${wait}ms`);
        await sleep(wait);
      }
    }

    if (modelFailedWith429) rateLimitedCount += 1;

    if (i < models.length - 1) {
      const gap = jitter(300, 700);
      log.info(`Switching to fallback model: ${models[i + 1]} (after ${gap}ms)`);
      await sleep(gap);
    }
  }

  // If every attempted model failed with 429, signal a dedicated code so callers
  // can return the safe student-facing fallback instead of SERVICE_UNAVAILABLE.
  if (rateLimitedCount === models.length && lastError && (lastError.status === 429 || lastError.code === 'HTTP_429')) {
    log.warn(`All ${models.length} models rate-limited (429), returning safe fallback`);
    throw Object.assign(new Error('All models rate-limited'), {
      code: 'ALL_RATE_LIMITED',
      status: 429,
      retryable: false,
      detail: lastError?.detail,
    });
  }

  log.err('All models failed', lastError?.code || 'UNKNOWN');
  throw Object.assign(new Error('AI Advisor unavailable'), {
    code: 'SERVICE_UNAVAILABLE',
    status: 503,
    retryable: false,
    detail: lastError?.detail,
  });
}

/**
 * Robustly extract a JSON object from a model reply string (strips markdown
 * fences and any surrounding prose, then parses the first {...} block).
 */
function parseModelJson(raw) {
  let text = (typeof raw === 'string' ? raw : (raw && typeof raw === 'object' ? JSON.stringify(raw) : String(raw || ''))).trim();
  text = text.replace(/^\s*```(?:json)?\s*|\s*```\s*$/gi, '');
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) text = text.slice(start,end + 1);
  try {
    return JSON.parse(text);
  } catch {
    throw Object.assign(new Error('AI response was not valid JSON'), { code: 'INVALID_AI_RESPONSE' });
  }
}

/**
 * Wrap raw model content into the structured advice contract.
 * Produces the rich NAVORA schema ANDthe backwards-compatible shape
 * (recommendedCareers / alternativeCareers) the existing frontend renders.

 */
function normalizeAdvice(raw) {
  const parsed = parseModelJson(raw);
  const str = (v, fallback = '') => {
    if (typeof v === 'string') return v.trim();
    if (v && typeof v === 'object' && typeof v.label === 'string') return v.label.trim();
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return v != null ? String(v .trim()) : fallback;
  };
  const strArray = (v, max) => {
    const limit = typeof max === 'number' ? max : 6;
    if (Array.isArray(v)) return v.map(str).filter(Boolean).slice(0, limit);
    if (typeof v === 'string' && v.trim()) return [str(v)];
    if (v && typeof v === 'object' && typeof v.label === 'string') return [str(v)];
    return [];
  };

  const profileSummary = str(parsed.profile_summary || parsed.profileSummary) || null;
  const keyObservations = strArray(parsed.key_observations || parsed.keyObservations, 6);
   const reflectionQuestion = str(parsed.reflection_question || parsed.reflectionQuestion) || null;
   const actionPlan = strArray(parsed.action_plan || parsed.actionPlan, 8);

  const careers = (parsed.recommended_careers || parsed.recommendedCareers) || [];
   const alternativesRaw = (parsed.alternatives || parsed.alternativeCareers) || [];

 // Backwards-compatible shape the UI already renders.
 const recommendedCareers = careers
    .filter((c) => c && typeof c === 'object' && str(c.career || c.title))
    .map((c) => {
      const next = c.next_step || (Array.isArray(c.nextSteps) ? c.nextSteps[0] : null);
      return {
        title: str(c.career || c.title),
        whySuit: str(c.why_it_fits || c.whySuit || str(c.reason)),
        degree: str(c.study_route || c.degree),
        skills: strArray(c.skills),
        exams: strArray(c.exams, 8),
        nextSteps: next ? [str(next)] : [],
      };
    });

  if (recommendedCareers.length === 0) {
    throw Object.assign(new Error('AI response contained no careers'), { code: 'INVALID_AI_RESPONSE' });
  }

  const alternativeCareers = alternativesRaw
    .filter((a) => a && typeof a === 'object' && str(a.career || a.title))
    .map((a) => ({ title: str(a.career || a.title), note: str(a.note || str(a.why_it_fits)) }));

  const strongestRaw = parsed.strongest_recommendation || parsed.strongestRecommendation || {};
   const strongestName = str(strongestRaw.career || strongestRaw.title);
   const strongestRecommendation = strongestName
    ? { career: strongestName, reason: str(strongestRaw.reason || strongestRaw.why) }
    : null;

  return {
    recommendedCareers,             // backwards-compatible
    alternativeCareers,            // backwards-compatible
    profileSummary: profileSummary || null,
    keyObservations: keyObservations || null,
    strongestRecommendation: strongestRecommendation || null,
    actionPlan: actionPlan.length ? actionPlan : null,
    reflectionQuestion: reflectionQuestion || null,
  };
}

//  Input validation for career advice ---------------------------------------
function validateAdviceRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw Object.assign(new Error('Request body must be a JSON object'), { code: 'INVALID_ANSWERS' });
  }

  const hasAnswers =
    body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers)
      ? Object.keys(body.answers).length > 0
      : false;

  const summary = body.summary && typeof body.summary === 'object' ? body.summary : {};
  const hasContext =
    Boolean(summary.stageLabel) ||
    Boolean(summary.streamLabel) ||
    (Array.isArray(summary.selections) && summary.selections.length > 0);

  if (!hasAnswers && !hasContext) {
    throw Object.assign(
      new Error('No completed questionnaire answers were provided'),
      { code: 'INVALID_ANSWERS' },
    );
  }
}
// buildChatSystemPrompt, serializeChatContext, isLeakyResponse, RETRY_CORRECTION_INSTRUCTION, SAFE_FALLBACK_MESSAGE
// now live in server/ai/ — single source of truth via NAVORA_AI_RULES.md

//  Route handlers -------------------------------------------------------------
async function handleCareerAdvice(req, res) {
  let body;
  try {
    body = await readBody(req);
  } catch {
    return sendJson(res, 400, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
  }

  // Unified path: if caller sent chat messages (frontend chat via /api/career-advice), handle as chat
  if (Array.isArray(body?.messages) && body.messages.length) {
    // Reuse advisor chat logic via internal delegation — keeps ONE authoritative path
    req.url = '/api/advisor/chat';
    return handleAdvisorChat(req, res);
  }

  try {
    validateAdviceRequest(body);
  } catch (err) {
    return sendJson(res, 400, {
      success: false, message: 'I’m having trouble responding right now. Please try again.',
    });
  }

  if (missingApiKey()) {
    return sendConfigError(res);
  }

  const userPrompt = buildUserPrompt(body);
  let response = null;
  let advice = null;
  log.info('Career advice request received');
  // One retry when the model returns unparseable JSON (free models sometimes
  // ignore the format). Model fallback / timeout / retry is handled
  // transparently inside requestWithFallback().
  for (let attempt = 0; attempt < 2 && !advice; attempt++) {
    const messages = [
      { role: 'system', content: ADVICE_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];
    if (attempt > 0) {
      messages.push({ role: 'assistant', content: response ? response.content : '' });
      messages.push({ role: 'user', content: 'Your previous reply was not valid JSON. Reply again with ONLY the raw JSON object matching the schema. No markdown fences, no explanation.' });
    }
    try {
      response = await requestWithFallback(messages);
    } catch (err) {
      // All models 429 -> safe fallback, not SERVICE_UNAVAILABLE
      if (err?.code === 'ALL_RATE_LIMITED' || err?.status === 429) {
        log.warn('Career-advice: all models 429, returning safe fallback');
        return sendJson(res, 200, { success: true, message: buildSafeFallback(body) });
      }
      return mapOpenRouterError(res, err, body);
    }

    // Leakage check before parsing — if JSON contains internal reasoning leakage, retry
    if (isLeakyResponse(response.content)) {
      log.warn('Leakage detected in career-advice raw response');
      if (attempt === 0) continue; // will retry with JSON correction instruction
      return sendJson(res, 200, { success: true, message: buildSafeFallback(body) });
    }

    try {
      advice = normalizeAdvice(response.content);
    } catch (err) {
      if (err.code !== 'INVALID_AI_RESPONSE' || attempt === 1) {
        log.err('model returned unparseable JSON', err.message);
        return sendJson(res, 502, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
      }
    }
  }
  log.info('Advice generated', response.model);
  // Return legacy structured shape for existing Recommendations page, but also ensure clean contract is available
  // New clients should use /api/advisor/chat with {success, message}
  return sendJson(res, 200, { ...advice, model: response.model, success: true });
}


async function handleAdvisorChat(req, res) {
  let body;
  try {
    body = await readBody(req);
  } catch {
    return sendJson(res, 400, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
  }

  const history = Array.isArray(body?.messages) ? body.messages : [];
  const last = history[history.length - 1];
  if (!last || typeof last.content !== 'string' || !last.content.trim()) {
    return sendJson(res, 400, { success: false, message: 'I’m having trouble responding right now. Please try again.' });
  }

  if (missingApiKey()) {
    return sendConfigError(res);
  }

  // --- Debug logging (structural, no PII) before OpenRouter call ---
  const ctxDbg = body?.context && typeof body.context === 'object' ? body.context : {};
  const rpDbg = ctxDbg.resolvedProfile || body?.resolvedProfile || null;
  const hasContext = Boolean(ctxDbg && (ctxDbg.stageLabel || ctxDbg.stream || ctxDbg.field || (Array.isArray(ctxDbg.selections) && ctxDbg.selections.length)));
  const hasResolvedProfile = Boolean(rpDbg && typeof rpDbg === 'object' && Object.keys(rpDbg).length > 0);
  const profileFields = hasResolvedProfile ? Object.keys(rpDbg).filter(k => {
    const v = rpDbg[k];
    if (Array.isArray(v)) return v.length > 0;
    return Boolean(v);
  }) : [];
  log.info(`Chat history messages: ${history.length}`);
  log.info(`Has context: ${hasContext}`);
  log.info(`Has resolved profile: ${hasResolvedProfile}`);
  log.info(`Stage: ${ctxDbg.stageLabel || rpDbg?.education_level || rpDbg?.current_stage || 'none'}`);
  log.info(`Stream: ${(ctxDbg.stream?.label || ctxDbg.field?.label || rpDbg?.stream || rpDbg?.degree || 'none')}`);
  log.info(`Profile fields: ${profileFields.length ? profileFields.join(',') : 'none'}`);

  // Cap history to 20 turns — delegates to contextBuilder (profile+history+current preserved)
  const messages = buildChatMessages(history);

  const systemPrompt = buildChatSystemPrompt(serializeChatContext(body));
  log.info('Advisor chat request received');

  let response;
  try {
    response = await requestWithFallback(
      [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      { maxTokens: CHAT_MAX_TOKENS },
    );
  } catch (err) {
    // All models 429 -> contextual safe fallback, not generic onboarding
    if (err?.code === 'ALL_RATE_LIMITED') {
      log.warn('FALLBACK USED: all models rate-limited (429) -> contextual fallback');
      const fb = buildSafeFallback(body);
      log.info(`Chat response generated by: fallback`);
      log.info(`Response length: ${fb.length}`);
      log.info(`Used fallback: true`);
      return sendJson(res, 200, { success: true, message: fb });
    }
    // Other provider errors -> map but also log fallback if needed
    return mapOpenRouterError(res, err, body);
  }

  // Server-side leakage validation + ONE retry — only genuine leakage triggers fallback
  let finalContent = String(response.content || '').trim();
  // VALID responses must be returned directly; only leaky/invalid triggers retry/fallback
  if (isLeakyResponse(finalContent)) {
    log.warn('Leakage detected in first response, retrying with correction');
    try {
      const retryResponse = await requestWithFallback(
        [
          { role: 'system', content: systemPrompt },
          ...messages,
          { role: 'assistant', content: finalContent },
          { role: 'user', content: RETRY_CORRECTION_INSTRUCTION },
        ],
        { maxTokens: CHAT_MAX_TOKENS },
      );
      const retryContent = String(retryResponse.content || '').trim();
      if (isLeakyResponse(retryContent)) {
        log.warn('FALLBACK USED: leakage after retry');
        finalContent = buildSafeFallback(body);
        log.info(`Chat response generated by: fallback`);
        log.info(`Response length: ${finalContent.length}`);
        log.info(`Used fallback: true`);
        return sendJson(res, 200, { success: true, message: finalContent });
      }
      finalContent = retryContent;
      // Log retry success as normal response
      log.info(`Chat response generated by: ${retryResponse.model}`);
      log.info(`Response length: ${finalContent.length}`);
      log.info(`Used fallback: false`);
      return sendJson(res, 200, { success: true, message: finalContent });
    } catch (e) {
      log.warn('FALLBACK USED: retry failed');
      finalContent = buildSafeFallback(body);
      log.info(`Chat response generated by: fallback`);
      log.info(`Response length: ${finalContent.length}`);
      log.info(`Used fallback: true`);
      return sendJson(res, 200, { success: true, message: finalContent });
    }
  }

  log.info(`Chat response generated by: ${response.model}`);
  log.info(`Response length: ${finalContent.length}`);
  log.info(`Used fallback: false`);
  return sendJson(res, 200, { success: true, message: finalContent });
}

function handleHealth(req, res) {
  return sendJson(res, 200, {
    ok: true,
    status: 'up',
    provider: 'openrouter',
    apiKeyConfigured: !missingApiKey(),
    models: AI_MODELS,
    primaryModel: AI_PRIMARY_MODEL,
    maxModelAttempts: MAX_MODEL_ATTEMPTS,
    timeoutMs: OPENROUTER_TIMEOUT_MS,
    rateLimitPerMin: AI_RATE_LIMIT_PER_MIN,
  });
}

function sendConfigError(res) {
  // Do not expose internal config details to client — generic user-facing message, details logged server-side only
  log.err('CONFIG_ERROR: OPENROUTER_API_KEY missing');
  return sendJson(res, 500, {
    success: false,
    message: 'I’m having trouble responding right now. Please try again.',
  });
}

function mapOpenRouterError(res, err, body) {
  const code = err?.code || 'UNKNOWN';
  // All models 429 is handled as safe fallback at call-site, but keep here as safety net
  if (code === 'ALL_RATE_LIMITED') {
    log.warn('mapOpenRouterError: ALL_RATE_LIMITED -> safe fallback');
    return sendJson(res, 200, { success: true, message: buildSafeFallback(body) });
  }
  if (err?.message && code !== 'TIMEOUT') log.err('provider error', err.message, code);
  // Generic user-facing message — never expose raw provider errors, stack traces, or metadata
  const generic = 'I’m having trouble responding right now. Please try again.';

  if (code === 'SERVICE_UNAVAILABLE') {
    return sendJson(res, 503, { success: false, message: generic });
  }
  if (
    err?.name === 'AbortError' ||
    err?.message === 'OPENROUTER_TIMEOUT' ||
    err?.cause?.message === 'OPENROUTER_TIMEOUT' ||
    code === 'TIMEOUT' ||
    code === 'OPENROUTER_TIMEOUT'
  ) {
    return sendJson(res, 504, { success: false, message: generic });
  }
  if (code === 'EMPTY_RESPONSE') {
    return sendJson(res, 502, { success: false, message: generic });
  }
  if (code === 'NETWORK_ERROR') {
    return sendJson(res, 502, { success: false, message: generic });
  }
  if (code === 'HTTP_401') {
    return sendJson(res, 401, { success: false, message: generic });
  }
  if (code === 'HTTP_402') {
    return sendJson(res, 402, { success: false, message: generic });
  }
  if (code === 'HTTP_429') {
    return sendJson(res, 429, { success: false, message: generic });
  }
  if (code === 'HTTP_400') {
    return sendJson(res, 400, { success: false, message: generic });
  }
  if (typeof code === 'string' && code.startsWith('HTTP_')) {
    return sendJson(res, 502, { success: false, message: generic });
  }
  return sendJson(res, 502, { success: false, message: generic });
}

//  HTTP server ---------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const path = (url || '/').split('?')[0];

  // CORS sa non-proxied setup (direct frontend  backend) also works.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	 if (method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Basic per-IP throttling on the AI endpoints (protects the OpenRouter key
  // from abuse). Health checks are exempt.
  if (method === 'POST' && (path === '/api/career-advice' || path === '/api/advisor/chat')) {
    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();
    const rl = rateLimitClient(clientIp || 'unknown');
    if (rl.limited) {
      return sendJson(res, 429, {
        success: false, message: 'I’m having trouble responding right now. Please try again.',
      });
    }
  }

  if (path === '/api/health' && method === 'GET') return handleHealth(req, res);
  if (path === '/health' && method === 'GET') return handleHealth(req, res);
  if (path === '/api/career-advice' && method === 'POST') return handleCareerAdvice(req, res);
  if (path === '/api/advisor/chat' && method === 'POST') return handleAdvisorChat(req, res);

	 return sendJson(res, 404, { success: false, message: 'I’m having trouble responding right now. Please try again.' } );
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[AI] NAVORA AI Career Advisor backend listening on http://localhost:${PORT}`);
  console.log(`[AI] Provider       : OpenRouter`);
  console.log(`[AI] Base URL       : ${OPENROUTER_BASE_URL}`);
  console.log(`[AI] Models         : ${AI_MODELS.join(', ')}`);
  console.log(`[AI] Primary model  : ${AI_PRIMARY_MODEL}`);
  console.log(`[AI] Max attempts   : ${MAX_MODEL_ATTEMPTS}`);
  console.log(`[AI] Timeout (ms)   : ${OPENROUTER_TIMEOUT_MS}`);
  console.log(`[AI] Rate limit     : ${AI_RATE_LIMIT_PER_MIN} req/min per IP`);
  console.log(`[AI] API key set    : ${!missingApiKey()}`);
});