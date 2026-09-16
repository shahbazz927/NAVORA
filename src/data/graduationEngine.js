/**
 * NAVORA — Graduation recommendation engine (ONE engine for every graduation
 * stream, degree and specialization, for both students and parents).
 *
 * Order of reasoning — deliberately ELIGIBILITY FIRST:
 *
 *   degree (id) → specialization (id) → stage → interests → skills → direction
 *     → eligible pathways (only those the degree itself leads to)
 *     → relevance ranking inside that eligible set
 *     → final result
 *
 * Nothing here is keyed on a single degree: the engine reads the selected
 * degree's own profile from degreeProfiles.js and the degree's own pathway data
 * from graduationPathwayData.js. Family only narrows the degree list and acts
 * as a last-resort fallback for degrees with no profile yet — it can never
 * widen eligibility.
 *
 * Consumers: AssessmentFlow (student + parent graduation), Dashboard,
 * resultsAdapters.unifiedFromCareerEngine.
 */

import graduationDegrees, {
  getDegreeByRef,
  getDegreeProfile,
  getSpecializations,
  toId,
} from './graduationDegreeConfig.js';
import {
  EXAM_RULES,
  FAMILY_GUIDANCE,
  FAMILY_HIGHER_STUDIES,
  GRAD_DIRECTION,
  GRAD_DIRECTION_BY_FAMILY,
  GRAD_DIRECTIONS_BY_PROFILE,
  GRADUATION_PATHWAYS,
  TRACK_DIRECTIONS,
  TRACK_RULES,
} from './graduationPathwayData.js';

// ── Small text helpers ───────────────────────────────────────
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const tokens = (s) => norm(s).split(' ').filter((t) => t.length > 2);
const STOPWORDS = new Set(['and', 'the', 'for', 'with', 'career', 'careers', 'role', 'roles', 'job', 'jobs']);

/** Token equality with prefix tolerance — 'psychologist' ≈ 'psychology'. */
function tokenMatches(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= 5 && b.length >= 5) return a.startsWith(b) || b.startsWith(a);
  return false;
}

function tokenListOverlap(as, bs) {
  const hits = [];
  for (const a of as) {
    if (STOPWORDS.has(a)) continue;
    for (const b of bs) {
      if (STOPWORDS.has(b)) continue;
      if (tokenMatches(a, b)) hits.push(b);
    }
  }
  return [...new Set(hits)];
}

// ── Stage model ──────────────────────────────────────────────
export const GRAD_STAGE_IDS = ['year_1', 'year_2', 'year_3', 'final_year', 'recently_graduated'];
export const GRAD_STAGE_LABELS = {
  year_1: '1st year',
  year_2: '2nd year',
  year_3: '3rd year',
  final_year: 'Final year',
  recently_graduated: 'Recently graduated',
};

/**
 * Stage context — drives wording and the practical emphasis of the result.
 * A recently graduated student is NEVER treated as still studying.
 */
export function getGraduationStageState(stageId) {
  const id = GRAD_STAGE_IDS.includes(stageId) ? stageId : null;
  const graduated = id === 'recently_graduated';
  const early = id === 'year_1' || id === 'year_2';
  const nearEnd = id === 'year_3' || id === 'final_year' || graduated;
  return {
    id,
    label: id ? GRAD_STAGE_LABELS[id] : '',
    graduated,
    early,
    nearEnd,
    /** Which pathway classes this stage should emphasise. */
    emphasis: graduated
      ? ['practice', 'employment', 'pg', 'government', 'business']
      : early
        ? ['pg', 'research', 'employment']
        : nearEnd
          ? ['employment', 'practice', 'pg', 'government']
          : ['employment', 'pg'],
    /** Wording helper — never says "you will study" to a graduate. */
    subject: graduated ? 'completed' : 'current',
  };
}

// ── Track + direction derivation ─────────────────────────────
function careerTrack(profileId, careerValue) {
  const pathway = GRADUATION_PATHWAYS[profileId];
  const override = pathway?.tracks?.[careerValue];
  if (override) return override;
  const key = String(careerValue || '').toLowerCase();
  for (const [track, re] of TRACK_RULES) {
    if (re.test(key)) return track;
  }
  return 'employment';
}

/** Unique pathway classes present in a degree's own career list. */
function classesFor(profile) {
  const set = new Set();
  for (const c of profile.careers || []) set.add(careerTrack(profile.profileId, c.value));
  return [...set];
}

/** Short display form of a higher-study option ("MDS — …" → "MDS"). */
function shortRoute(route) {
  const s = String(route || '');
  const cut = s.split(/[—(–]/)[0].trim();
  return cut.length > 3 ? cut : s.split(' ').slice(0, 4).join(' ');
}

/**
 * Generate a degree-anchored direction list from the degree's own pathway
 * classes — used for degrees with no curated list, so every degree still gets
 * a specific "what next" question instead of a generic one.
 */
function deriveDirections(profileId, family, classes) {
  const pathway = GRADUATION_PATHWAYS[profileId] || {};
  const hs = pathway.higherStudies || FAMILY_HIGHER_STUDIES[family] || [];
  const field = family || 'your field';
  const out = [];
  const has = (t) => classes.includes(t);
  if (has('practice') || has('employment')) {
    out.push({ value: 'start_working', label: `Start working in ${field}` });
  }
  if (has('pg')) out.push({ value: 'specialize', label: 'Prepare for the next academic specialization in your field' });
  if (hs.length) out.push({ value: 'higher_studies', label: `Higher studies — ${shortRoute(hs[0])}` });
  if (has('research')) out.push({ value: 'research', label: 'Research / academic path' });
  if (has('business')) out.push({ value: 'business', label: 'Start your own practice / business' });
  out.push({ value: 'government', label: `Government or public-sector roles in ${field}` });
  out.push({ value: 'abroad', label: 'Work or study abroad' });
  out.push({ value: 'still_exploring', label: 'Still exploring' });
  return out;
}

function directionListFor(profileId, family, classes) {
  if (GRAD_DIRECTIONS_BY_PROFILE[profileId]?.length) return GRAD_DIRECTIONS_BY_PROFILE[profileId];
  if (classes && classes.length) return deriveDirections(profileId, family, classes);
  if (GRAD_DIRECTION_BY_FAMILY[family]?.length) return GRAD_DIRECTION_BY_FAMILY[family];
  return GRAD_DIRECTION;
}

function deriveExams(higherStudies) {
  const blob = (higherStudies || []).join(' | ');
  const out = [];
  const seen = new Set();
  for (const [re, exam] of EXAM_RULES) {
    if (re.test(blob) && !seen.has(exam.name)) {
      seen.add(exam.name);
      out.push(exam);
    }
  }
  return out.slice(0, 4);
}

/** Resolve a specialization label from a label or a stable id. */
function resolveSpecLabel(degree, specRef) {
  if (!specRef) return '';
  const list = degree.specializations || [];
  const match = list.find((s) => s === specRef || toId(s) === toId(specRef));
  return match || '';
}

/**
 * NORMALIZED DEGREE PROFILE — the single structure every graduation question
 * and result is derived from:
 *
 *   degreeId · specializationId · family · interests · skills · experiences
 *   careers (eligibleCareerIds) · higherStudies · exams · directions · guidance
 *
 * Returns null when the degree cannot be resolved at all.
 */
export function getGraduationProfile(degreeRef, specRef) {
  const degree = getDegreeByRef(degreeRef);
  if (!degree) return null;

  const specLabel = resolveSpecLabel(degree, specRef);
  const hasSpecializations = (degree.specializations || []).length > 0;
  const profile = getDegreeProfile(degree.id, specLabel);
  if (!profile || !Array.isArray(profile.careers) || profile.careers.length === 0) return null;

  const profileId = profile.profileId || profile.id;
  const pathway = GRADUATION_PATHWAYS[profileId] || {};
  const expected = hasSpecializations ? degree.profileMap?.[specLabel] : degree.profileId;
  const classes = classesFor({ ...profile, profileId });
  const higherStudies =
    pathway.higherStudies && pathway.higherStudies.length
      ? pathway.higherStudies
      : FAMILY_HIGHER_STUDIES[profile.family] || [];

  return {
    id: profileId,
    profileId,
    degreeId: degree.id,
    degreeLabel: degree.label,
    family: degree.family || profile.family,
    profileFamily: profile.family,
    specialization: specLabel,
    specializationId: specLabel ? toId(specLabel) : null,
    hasSpecializations,
    label: profile.label,
    displayName: specLabel ? `${degree.label} — ${specLabel}` : degree.label,
    interests: profile.interests || [],
    skills: profile.skills || {},
    experiences: profile.experiences || [],
    careers: profile.careers || [],
    requiredSkills: profile.requiredSkills || {},
    classes,
    higherStudies,
    exams: deriveExams(higherStudies),
    directions: directionListFor(profileId, degree.family || profile.family, classes),
    guidance: pathway.guidance || FAMILY_GUIDANCE[profile.family] || '',
    /** 'Other' degree — recommendations stay deliberately broad. */
    isBroad: profileId === 'other' || degree.id === 'other',
    /** True when the family/general fallback profile was used (rare). */
    isFallback: Boolean(expected) && expected !== profileId,
  };
}

/** Resolve the profile straight from stored answers (ids first, labels second). */
export function resolveGraduationProfile(answers = {}) {
  const degreeRef = answers.degreeId || answers.degree || answers.currentDegree || '';
  const specRef =
    answers.specializationId ||
    (answers.specialization && answers.specialization !== answers.degree ? answers.specialization : '') ||
    '';
  return getGraduationProfile(degreeRef, specRef);
}

export function getGraduationInterests(profile) {
  return profile?.interests || [];
}

export function getGraduationSkills(profile) {
  return profile?.skills || {};
}

/**
 * Direction options for a degree. Accepts either a resolved profile or a raw
 * answers object ({ degreeId, degree, specialization, degreeStage }).
 */
export function getGraduationDirections(input, _stage) {
  const resolved =
    input && Array.isArray(input.directions) ? input : resolveGraduationProfile(input || {});
  if (!resolved) return GRAD_DIRECTION;
  return resolved.directions?.length ? resolved.directions : GRAD_DIRECTION;
}

export function gradDirectionForFamily(family = '') {
  return GRAD_DIRECTION_BY_FAMILY[family] || GRAD_DIRECTION;
}

/** Degree-specific higher-study routes, ordered for the selected direction. */
export function getHigherStudyOptions(profile, direction) {
  const all = profile?.higherStudies || [];
  if (!all.length) return [];
  const weight = (route) => {
    const s = route.toLowerCase();
    if (direction === 'abroad') return s.includes('abroad') || s.includes('ms ') ? 0 : 1;
    if (direction === 'research') return s.includes('research') || s.includes('phd') ? 0 : 1;
    if (direction === 'business') return s.includes('mba') || s.includes('management') ? 0 : 1;
    return s.includes('abroad') ? 1 : 0;
  };
  return [...all].sort((a, b) => weight(a) - weight(b));
}

/** Specialization picker options (stable ids + labels) for a degree. */
export function getGraduationSpecializationOptions(degreeRef) {
  return getSpecializations(degreeRef);
}

// ── Pathway outcomes + ELIGIBILITY ───────────────────────────
function skillIndex(profile) {
  const map = new Map();
  Object.values(profile.skills || {}).forEach((group) => {
    (group || []).forEach((s) => map.set(s.value, s.label));
  });
  return map;
}

const TRACK_PHRASE = {
  pg: 'a postgraduate study route',
  practice: 'a practice-based route',
  employment: 'a working route',
  research: 'a research route',
  teaching: 'a teaching route',
  business: 'a self-employment route',
  government: 'a public-service route',
};

/**
 * ELIGIBILITY STEP — the ONLY source of pathways is the selected degree's own
 * `careers` list (from degreeProfiles.js). Nothing outside this list can ever
 * reach the result, so no amount of skill overlap can leak an unrelated career.
 */
export function getEligibleCareers(profile, _direction) {
  if (!profile) return [];
  const skillLabels = skillIndex(profile);
  const interestTokens = (profile.interests || []).map((i) => ({
    id: i.value,
    label: i.label,
    toks: [...tokens(i.value), ...tokens(i.label)],
  }));

  return (profile.careers || []).map((career) => {
    const track = careerTrack(profile.id, career.value);
    const requiredSkillIds = profile.requiredSkills?.[career.value] || [];
    const requiredSkillLabels = requiredSkillIds.map((id) => skillLabels.get(id) || id);
    const jobToks = [...tokens(career.value), ...tokens(career.label)];
    const matched = interestTokens.filter((i) => tokenListOverlap(jobToks, i.toks).length);
    return {
      id: `${profile.id}:${career.value}`,
      value: career.value,
      title: career.label,
      track,
      trackPhrase: TRACK_PHRASE[track] || TRACK_PHRASE.employment,
      category: profile.family,
      profileId: profile.id,
      profileLabel: profile.label,
      displayName: profile.displayName,
      matchedInterestIds: matched.map((m) => m.id),
      matchedInterestLabels: matched.map((m) => m.label),
      requiredSkillIds,
      requiredSkillLabels,
      directionIds: TRACK_DIRECTIONS[track] || [],
      higherStudies: profile.higherStudies || [],
      experienceIdeas: (profile.experiences || []).map((e) => e.label),
    };
  });
}

/**
 * RELEVANCE + RANKING STEP — only among already-eligible pathways.
 * Direction is a first-class sort key (not a cosmetic bonus) so a stated
 * direction genuinely changes the recommendation; interests and skills then
 * order the options inside that tier.
 */
export function scoreEligibleCareers(profile, outcomes, context = {}) {
  const { interests = [], skills = [], direction = '', stage = '' } = context;
  const stageState = getGraduationStageState(stage);
  const exploring = direction === 'still_exploring' || !direction;

  const scored = (outcomes || []).map((outcome) => {
    const interestHits = (outcome.matchedInterestIds || []).filter((id) => interests.includes(id));
    const skillHits = (outcome.requiredSkillIds || []).filter((id) => skills.includes(id));
    const interestScore = interests.length ? Math.min(1, interestHits.length / interests.length) : 0;
    const skillScore = Math.min(1, skillHits.length / 3);
    const directionHit = !exploring && outcome.directionIds.includes(direction);
    const stageHit = stageState.emphasis.includes(outcome.track);
    const score = Math.round(interestScore * 40 + skillScore * 30 + (directionHit ? 30 : exploring ? 12 : 0) + (stageHit ? 8 : 0));

    const interestLabels = (outcome.matchedInterestIds || [])
      .filter((id) => interests.includes(id))
      .map((id) => (profile.interests || []).find((i) => i.value === id)?.label || id);
    const skillLabels = skillHits.map(
      (id) => (outcome.requiredSkillLabels || [])[outcome.requiredSkillIds.indexOf(id)] || id,
    );

    return {
      outcome,
      score,
      signals: {
        interestScore,
        skillScore,
        directionHit,
        exploring,
        stageHit,
        interestLabels,
        skillLabels,
      },
    };
  });

  scored.sort((a, b) => {
    if (a.signals.directionHit !== b.signals.directionHit) return a.signals.directionHit ? -1 : 1;
    if (b.score !== a.score) return b.score - a.score;
    return a.outcome.title.localeCompare(b.outcome.title);
  });

  return scored;
}

/** Honest qualitative banding — never a calibrated-looking percentage. */
export function bandForIndex(index, score, exploring) {
  if (exploring) return 'Worth exploring';
  if (index === 0 && score >= 50) return 'Strong match';
  if (score >= 30) return 'Good match';
  return 'Worth exploring';
}

// ── Result construction ─────────────────────────────────────
const MAX_RESULTS = 4;

function describeOutcome(profile, outcome, signals) {
  const bits = [`${outcome.title} is ${outcome.trackPhrase} that a ${profile.displayName} background genuinely leads to.`];
  if (signals.interestLabels.length) {
    bits.push(`It lines up with your interest in ${signals.interestLabels.slice(0, 2).join(' and ')}.`);
  }
  if (signals.skillLabels.length) {
    bits.push(`You already bring ${signals.skillLabels.slice(0, 2).join(' and ')} to it.`);
  } else if (outcome.requiredSkillLabels.length) {
    bits.push(`It is built on ${outcome.requiredSkillLabels.slice(0, 2).join(' and ')}, which is where your preparation should go.`);
  }
  return bits.join(' ');
}

function considerationsFor(profile, outcome, signals, stageState, direction) {
  const cons = [];
  if (outcome.track === 'pg') {
    cons.push(`This needs a postgraduate step first — ${profile.higherStudies[0] || 'check the entrance requirement'}.`);
  }
  if (stageState.graduated) {
    cons.push('Your degree is already complete, so the next move is applications, an entrance exam or building practice — not further coursework in the same degree.');
  } else if (stageState.early) {
    cons.push(`You still have ${stageState.label} and beyond on this degree — use that time for depth, one strong project and an internship.`);
  } else if (stageState.id) {
    cons.push('You are close to finishing, so decisions this year carry more weight — start the application or exam preparation now.');
  }
  if (profile.isBroad) {
    cons.push('We do not hold a detailed profile for this exact degree yet, so this is broad field-level guidance rather than a precise pathway.');
  }
  if (!signals.skillLabels.length && outcome.requiredSkillLabels.length) {
    cons.push(`${outcome.requiredSkillLabels.slice(0, 2).join(' and ')} would need to be built deliberately.`);
  }
  if (direction === 'abroad') {
    cons.push('Working or studying abroad needs licensing, visa or test requirements planned well in advance.');
  }
  if (outcome.track === 'government') {
    cons.push('Public-service routes mean exam preparation alongside everything else — plan a realistic study calendar.');
  }
  if (outcome.track === 'business') {
    cons.push('A venture route needs funding, licences and clients — test the idea at small scale before committing fully.');
  }
  if (outcome.track === 'research') {
    cons.push('Research routes usually need a NET/JRF-style qualification and a postgraduate degree.');
  }
  return cons.slice(0, 3);
}

function whyFor(profile, outcome, signals, stageState, directionLabel) {
  const why = [`${profile.degreeLabel} students can directly enter this pathway`];
  if (signals.interestLabels.length) why.push(`It matches your interest in ${signals.interestLabels.slice(0, 2).join(' and ')}`);
  if (signals.skillLabels.length) why.push(`You already have ${signals.skillLabels.slice(0, 2).join(' and ')}`);
  if (directionLabel) why.push(`It fits your stated direction: ${directionLabel.toLowerCase()}`);
  if (stageState.graduated) why.push('It is an immediate next step now that the degree is complete');
  else if (stageState.label) why.push(`It is realistic to prepare for by ${stageState.label} level`);
  return why.slice(0, 4);
}

function factorsFor(outcome, signals) {
  return [
    {
      key: 'Interest alignment',
      weight: 40,
      value: Math.round(signals.interestScore * 100),
      why: signals.interestLabels.length
        ? `Matched to ${signals.interestLabels.slice(0, 2).join(', ')}`
        : 'No interest you selected maps directly to this pathway',
    },
    {
      key: 'Skill overlap',
      weight: 30,
      value: Math.round(signals.skillScore * 100),
      why: signals.skillLabels.length
        ? `You have ${signals.skillLabels.slice(0, 2).join(', ')}`
        : `Build ${outcome.requiredSkillLabels.slice(0, 2).join(' and ') || 'the core skills'}`,
    },
    {
      key: 'Direction fit',
      weight: 20,
      value: signals.directionHit ? 100 : signals.exploring ? 50 : 20,
      why: signals.directionHit
        ? 'This pathway answers the direction you chose'
        : signals.exploring
          ? 'You are still exploring, so this is shown as an option to test'
          : 'Your chosen direction points more strongly elsewhere',
    },
    {
      key: 'Stage fit',
      weight: 10,
      value: signals.stageHit ? 100 : 45,
      why: signals.stageHit ? 'Fits your current stage' : 'Timing may need planning',
    },
  ];
}

function unifiedFromOutcome(profile, scored, level, isParent) {
  const outcome = scored.outcome;
  const signals = scored.signals;
  const requiredSkills = outcome.requiredSkillLabels.slice(0, 4);
  const ideas = outcome.experienceIdeas;
  const activity = ideas.length
    ? ideas[scored.rank % Math.min(3, ideas.length)]
    : 'Talk to two people already doing this work.';
  return {
    career: {
      id: outcome.id,
      title: outcome.title,
      category: outcome.category,
      description: describeOutcome(profile, outcome, signals),
      skillsToDevelop: requiredSkills,
      educationRoutes: outcome.isPg && outcome.higherStudies.length
        ? [outcome.higherStudies[0], ...outcome.higherStudies.slice(1, 2)]
        : [outcome.higherStudies[0] || `${profile.degreeLabel} → ${outcome.title}`],
      experienceIdeas: ideas.slice(0, 3),
      roles: [],
    },
    title: outcome.title,
    category: outcome.category,
    level,
    band: level,
    // No percentage is shown for graduation: the bands are relative to the
    // eligible set only (no fake fit scores).
    score: null,
    degree: {
      short: profile.displayName,
      full: outcome.isPg ? outcome.higherStudies[0] || profile.displayName : profile.degreeLabel,
    },
    exams: profile.exams,
    foundations: requiredSkills.slice(0, 3),
    whyMatches: whyFor(profile, outcome, signals, scored.stageState, scored.directionLabel),
    considerations: considerationsFor(profile, outcome, signals, scored.stageState, scored.directionId),
    factors: factorsFor(outcome, signals),
    activity,
    raw: scored.score,
    profileId: profile.id,
    degreeId: profile.degreeId,
    isParent: Boolean(isParent),
  };
}

function buildNextSteps(profile, stageState, topOutcome, exams) {
  const skill = topOutcome?.requiredSkillLabels?.[0] || 'a core skill for this field';
  const second = topOutcome?.requiredSkillLabels?.[1];
  const role = topOutcome?.title || 'this pathway';
  const exam = exams[0]?.name;
  const examLine = exam
    ? `Start preparing ${exam} — check eligibility and dates on the official site.`
    : 'Check the entrance or licensing requirement for this route.';
  const familyLower = String(profile.family || 'your field').toLowerCase();

  if (stageState.graduated) {
    return {
      month: [
        `Shortlist 8–10 ${role} openings or postgraduate programmes that accept ${profile.displayName}.`,
        examLine,
      ],
      quarter: [
        `Build ${skill}${second ? ` and ${second}` : ''} through one real project, internship or shadowing week.`,
        `Talk to two people already working in ${familyLower} about how they entered.`,
      ],
      later: [
        'Reassess after three months of applications or study — keep what is working, drop what is not.',
      ],
    };
  }
  if (stageState.early) {
    return {
      month: [
        `Strengthen ${skill} through coursework and one small self-driven project.`,
        exams.length
          ? `Note the entrance exams this degree eventually needs: ${exams.map((e) => e.name).join(', ')}.`
          : 'Note the entrance or licensing requirements this degree eventually needs.',
      ],
      quarter: [
        `Get one internship, lab placement or field exposure inside ${familyLower}.`,
      ],
      later: [
        `By final year, choose between ${role} and the higher-study route with real evidence behind the choice.`,
        'Keep the academic record strong — most of these routes filter on it.',
      ],
    };
  }
  return {
    month: [
      `Begin ${role} preparation: applications, portfolio or exam registration.`,
      examLine,
    ],
    quarter: [`Complete one internship or substantial project that demonstrates ${skill}.`],
    later: [
      'Decide between the first job and the higher-study route using real interview or exam feedback.',
    ],
  };
}

/** Counsellor-style narrative — why this fits, in plain language. */
export function buildGraduationNarrative({
  profile,
  stageState,
  directionLabel,
  top,
  higherStudies,
  isParent = false,
  exploring = false,
  interestLabels = [],
  skillLabels = [],
}) {
  const isYou = !isParent;
  const subject = isYou ? 'You' : 'Your child';
  const they = isYou ? 'you' : 'they';
  const have = isYou ? 'have' : 'has';
  const be = isYou ? 'are' : 'is';
  const list = (arr) => arr.slice(0, 2).join(' and ');

  const bits = [];
  if (interestLabels.length) bits.push(`an interest in ${list(interestLabels)}`);
  if (skillLabels.length) bits.push(`strengths in ${list(skillLabels)}`);
  const plural = bits.length > 1 || interestLabels.length > 1 || skillLabels.length > 1;
  const stageLabel = stageState.label
    ? stageState.label.charAt(0).toLowerCase() + stageState.label.slice(1)
    : '';
  const degreePhrase = stageState.graduated
    ? `${have} completed ${profile.displayName}`
    : `${be} in the ${stageLabel} of ${profile.displayName}`;

  const clauseText = bits.length
    ? `${plural ? 'Together, ' : ''}${bits.join(' and ')} ${plural ? 'point' : 'points'} toward ${top?.title || 'the options below'}.`
    : `The clearest next step from here is ${top?.title || 'the options below'}.`;
  const clause = clauseText.charAt(0).toUpperCase() + clauseText.slice(1);

  const p1 = `${subject} ${degreePhrase}. ${clause}`;

  let p2 = '';
  if (exploring) {
    p2 = `${isYou ? "You're" : "They're"} still exploring, so NAVORA will not pretend there is one perfect career. These are the pathways a ${profile.displayName} genuinely opens — worth testing with small, real steps rather than committing on paper.`;
  } else {
    p2 = `Because ${they} said ${directionLabel ? `"${directionLabel}"` : 'a clear direction'}, the options below are ordered around that goal — each one is a pathway this exact degree leads to, not a general career list.`;
  }

  let p3 = '';
  if (higherStudies.length) {
    p3 = `Higher studies are directly relevant here: ${higherStudies[0]}. ${
      higherStudies[1]
        ? `The real decision is between that and ${higherStudies[1]} — compare fees, duration and what each unlocks before committing.`
        : ''
    }`.trim();
  }

  const p4 = profile.guidance || '';

  return [p1, p2, p3, p4].filter(Boolean).join('\n\n');
}

/**
 * FINAL RESULT — ELIGIBILITY first, RELEVANCE second, RANKING third.
 * Returns null only when nothing can be resolved (UI falls back to the
 * questionnaire rather than showing an unrelated result).
 */
export function buildGraduationResult(answers = {}, isParent = false) {
  const profile = resolveGraduationProfile(answers);
  if (!profile) return null;

  const stageState = getGraduationStageState(answers.degreeStage);
  const interests = Array.isArray(answers.interests) ? answers.interests : [];
  const skills = Array.isArray(answers.skills) ? answers.skills : [];
  const directionId = answers.direction || '';
  const exploring = !directionId || directionId === 'still_exploring';
  const directionOption = profile.directions.find((d) => d.value === directionId) || null;
  const directionLabel = directionOption?.label || '';

  // STEP 1 — eligibility (degree-scoped only). STEP 2 — ranking inside it.
  const eligible = getEligibleCareers(profile);
  const scored = scoreEligibleCareers(profile, eligible, {
    interests,
    skills,
    direction: directionId,
    stage: answers.degreeStage,
  });
  const decorated = scored.map((entry, index) => ({
    ...entry,
    rank: index,
    stageState,
    directionId,
    directionLabel,
    direction: answers.direction || '',
  }));
  const take = Math.max(2, Math.min(MAX_RESULTS, decorated.length));
  const ranked = decorated.slice(0, take);
  const items = ranked.map((entry, index) =>
    unifiedFromOutcome(profile, entry, bandForIndex(index, entry.score, exploring), isParent),
  );

  const higherStudies = getHigherStudyOptions(profile, directionId);
  const topOutcome = ranked[0]?.outcome || null;
  const interestLabels = [...new Set(ranked.flatMap((r) => r.signals.interestLabels))];
  const skillLabels = [...new Set(ranked.flatMap((r) => r.signals.skillLabels))];
  const narrative = buildGraduationNarrative({
    profile,
    stageState,
    directionLabel,
    top: topOutcome,
    higherStudies,
    isParent,
    exploring,
    interestLabels,
    skillLabels,
  });

  return {
    flow: isParent ? 'parent_graduation' : 'student_graduation',
    profile,
    stage: stageState,
    direction: { id: directionId, label: directionLabel },
    exploring,
    ranked,
    items,
    higherStudies,
    exams: profile.exams,
    skillsToBuild: topOutcome?.requiredSkillLabels.slice(0, 4) || [],
    nextSteps: buildNextSteps(profile, stageState, topOutcome, profile.exams),
    narrative,
    guidance: profile.guidance,
    isBroad: profile.isBroad,
    isFallbackProfile: profile.isFallback,
    eligibleCount: eligible.length,
  };
}

// ── Public adapters (shared by AssessmentFlow + Dashboard) ───
export function graduationUnifiedItems(answers = {}, isParent = false) {
  const result = buildGraduationResult(answers, isParent);
  return result ? result.items : [];
}

export function graduationNextSteps(answers = {}, isParent = false) {
  const result = buildGraduationResult(answers, isParent);
  return result ? result.nextSteps : null;
}

export function graduationHigherStudies(answers = {}) {
  const result = buildGraduationResult(answers);
  return result ? result.higherStudies : [];
}

/** Everything the results page shows besides the cards themselves. */
export function graduationSummary(answers = {}, isParent = false) {
  const result = buildGraduationResult(answers, isParent);
  if (!result) return null;
  return {
    narrative: result.narrative,
    primaryDirection: result.direction,
    higherStudies: result.higherStudies,
    exams: result.exams,
    skillsToBuild: result.skillsToBuild,
    stage: result.stage,
    exploring: result.exploring,
    isBroad: result.isBroad,
    profile: result.profile,
  };
}

// ── Dependent-answer hygiene (cross-degree contamination) ────
/**
 * Guarantees an answer set can never carry data over from a previous degree:
 *   • interests not in the resolved profile are dropped
 *   • skills not in the resolved profile are dropped
 *   • a direction the degree no longer offers is dropped
 *   • a specialization that does not belong to the degree is dropped
 *   • family is re-derived from the degree (family never overrides the degree)
 *
 * Returns { answers, changed, profile }; callers write the cleaned answers back
 * so stale values can never reach the result.
 */
export function sanitizeGraduationAnswers(answers = {}, validStageIds = null) {
  const next = { ...answers };
  let changed = false;

  const clear = (key) => {
    if (next[key] === undefined) return;
    delete next[key];
    changed = true;
  };

  const degree = getDegreeByRef(next.degreeId || next.degree);
  if (!degree) return { answers: next, changed: false, profile: null };

  // Family is derived from the degree — never a separate source of truth.
  if (next.family !== degree.family) { next.family = degree.family; changed = true; }
  if (next.degreeId !== degree.id) { next.degreeId = degree.id; changed = true; }
  if (next.degree !== degree.label) { next.degree = degree.label; changed = true; }

  const hasSpecs = (degree.specializations || []).length > 0;
  if (hasSpecs) {
    const specLabel = resolveSpecLabel(degree, next.specializationId || next.specialization);
    if (!specLabel) {
      clear('specialization');
      clear('specializationId');
    } else {
      if (next.specialization !== specLabel) { next.specialization = specLabel; changed = true; }
      const specId = toId(specLabel);
      if (next.specializationId !== specId) { next.specializationId = specId; changed = true; }
    }
  } else {
    clear('specialization');
    clear('specializationId');
  }

  const profile = getGraduationProfile(degree.id, next.specializationId || next.specialization);
  if (!profile) return { answers: next, changed, profile: null };

  const validInterests = new Set(profile.interests.map((i) => i.value));
  const validSkills = new Set(Object.values(profile.skills).flat().map((s) => s.value));
  const validDirections = new Set(profile.directions.map((d) => d.value));
  const stages = validStageIds && validStageIds.length ? validStageIds : GRAD_STAGE_IDS;

  if (Array.isArray(next.interests)) {
    const kept = next.interests.filter((id) => validInterests.has(id));
    if (kept.length !== next.interests.length) { next.interests = kept; changed = true; }
  }
  if (Array.isArray(next.skills)) {
    const kept = next.skills.filter((id) => validSkills.has(id));
    if (kept.length !== next.skills.length) { next.skills = kept; changed = true; }
  }
  if (next.direction && !validDirections.has(next.direction)) clear('direction');
  if (next.degreeStage && !stages.includes(next.degreeStage)) clear('degreeStage');

  return { answers: next, changed, profile };
}

// ── Data validation (QA / dev) ───────────────────────────────
/**
 * Audits the graduation data set and returns problem strings ([] = healthy):
 * unresolved profiles, missing interests/skills/careers, missing pathway data.
 */
export function validateGraduationData() {
  const problems = [];
  for (const degree of graduationDegrees) {
    const specs = degree.specializations || [];
    const pairs = specs.length
      ? specs.map((s) => [s, degree.profileMap?.[s]])
      : [['', degree.profileId]];
    for (const [spec, pid] of pairs) {
      const profile = getGraduationProfile(degree.id, spec);
      if (!profile) {
        problems.push(`${degree.label}${spec ? ` / ${spec}` : ''}: profile "${pid}" did not resolve`);
        continue;
      }
      if (pid && profile.id !== pid) problems.push(`${degree.label}${spec ? ` / ${spec}` : ''}: expected ${pid}, resolved ${profile.id}`);
      if (!profile.interests.length) problems.push(`${degree.label}${spec ? ` / ${spec}` : ''}: no interests`);
      if (!Object.keys(profile.skills).length) problems.push(`${degree.label}${spec ? ` / ${spec}` : ''}: no skills`);
      if (!profile.careers.length) problems.push(`${degree.label}${spec ? ` / ${spec}` : ''}: no careers`);
      if (!profile.higherStudies.length) problems.push(`${degree.label}${spec ? ` / ${spec}` : ''}: no higher-study data`);
      if (!profile.directions.length) problems.push(`${degree.label}${spec ? ` / ${spec}` : ''}: no directions`);
    }
  }
  return problems;
}