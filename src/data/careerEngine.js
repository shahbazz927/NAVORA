import { careers } from './careers.js';
import graduationDegrees from './graduationDegreeConfig.js';

// ── Normalized student profile ──────────────────────────
export function buildStudentProfile(answers, flowKey) {
  const profile = {
    educationLevel: flowKey || '',
    stream: (answers.stream || '').toLowerCase(),
    family: answers.family || '',
    degree: answers.currentDegree || answers.degree || '',
    field: answers.field || answers.interest_area || '',
    specialization: answers.specialization || '',
    degreeStage: answers.degreeStage || answers.degree_stage || '',
    interests: [],
    strengths: [],
    workPrefs: [],
    priority: answers.priority || answers.clarity || '',
    direction: answers.direction || '',
    uncertainty: 0,
  };

  // Collect interests from various flows
  if (answers.interest) profile.interests.push(answers.interest);
  if (Array.isArray(answers.interests)) profile.interests.push(...answers.interests);
  if (Array.isArray(answers.enjoy)) profile.interests.push(...answers.enjoy);
  if (answers.future) profile.interests.push(answers.future);

  // Strengths
  if (Array.isArray(answers.skills)) profile.strengths.push(...answers.skills);
  if (Array.isArray(answers.strongest)) profile.strengths.push(...answers.strongest);
  // Normalize: lower + trim
  const norm = (s) => String(s).toLowerCase().trim();
  profile.interests = profile.interests.map(norm).filter(Boolean);
  profile.strengths = profile.strengths.map(norm).filter(Boolean);
  profile.workPrefs = [];
  if (answers.work) profile.workPrefs.push(norm(answers.work));
  if (answers.future) profile.workPrefs.push(norm(answers.future));

  // Graduation direction (Q5) — must influence the outcome, not be cosmetic
  profile.direction = answers.direction || '';

  // Human-readable labels for the result page (original picks, pre-expansion)
  const pretty = (s) => String(s).replace(/_/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase());
  const uniq = (arr) => [...new Set(arr.filter(Boolean).map(norm))];
  profile.interestLabels = uniq([
    ...(Array.isArray(answers.interests) ? answers.interests : []),
    ...(answers.interest ? [answers.interest] : []),
    ...(Array.isArray(answers.enjoy) ? answers.enjoy : []),
  ]).map(pretty);
  profile.strengthLabels = uniq([
    ...(Array.isArray(answers.skills) ? answers.skills : []),
    ...(Array.isArray(answers.strongest) ? answers.strongest : []),
  ]).map(pretty);

  // Token expansion: option values are often ids like 'business_strategy' or
  // 'strategic_thinking', which never match career traits like 'Business
  // Management'. Splitting them into tokens lets the matching actually hit.
  const expand = (arr) => {
    const extra = [];
    for (const s of arr) {
      if (/[\s_]/.test(s)) {
        for (const tok of s.split(/[\s_]+/)) {
          if (tok.length > 2 && !arr.includes(tok)) extra.push(tok);
        }
      }
    }
    return [...new Set([...arr, ...extra])];
  };
  profile.interests = expand(profile.interests);
  profile.strengths = expand(profile.strengths);

  if (profile.direction === 'still_exploring') profile.uncertainty = 1;

  // Uncertainty signals
  const uncertaintyTokens = ['still exploring', 'not sure', "they're still figuring", "we're not sure", "we're completely unsure", 'i want help understanding', "i want help understanding my child"];
  const allTokens = [...profile.interests, ...profile.workPrefs, norm(profile.priority)];
  if (allTokens.some((t) => uncertaintyTokens.some((u) => t.includes(u)))) profile.uncertainty = 1;
  if (profile.interests.includes('still exploring')) profile.uncertainty = 1;

  // Resolve the graduation degree's family (e.g. BBA → Business & Management)
  // so the engine can judge education compatibility for graduate users.
  const degreeLabel = profile.degree;
  const degreeEntry = graduationDegrees.find((d) => d.label === degreeLabel);
  profile.degreeFamily = degreeEntry?.family || '';
  profile.degreeLabel = degreeLabel || '';
  profile.fieldLabel = profile.field ? pretty(profile.field) : '';

  return profile;
}

// ── Helpers ───────────────────────────────────────────
function interestMatch(profile, career) {
  if (!career.traits?.length) return 0.5;
  const ct = career.traits.map((t) => t.toLowerCase());
  const hits = ct.filter((t) => profile.interests.some((p) => p === t || p.includes(t) || t.includes(p))).length;
  // also check work prefs as interests
  const workHits = ct.filter((t) => profile.workPrefs.some((p) => p === t || p.includes(t) || t.includes(p))).length;
  const totalHits = Math.max(hits, workHits);
  return ct.length ? Math.min(1, totalHits / 2) : 0.5;
  // 0 hits => 0, 1 hit => 0.5, 2+ => 1
}
function strengthMatch(profile, career) {
  if (!career.strengthsAligned?.length) return 0.5;
  const ca = career.strengthsAligned.map((s) => s.toLowerCase());
  const ps = profile.strengths.map((s) => s.toLowerCase());
  // also map skill ids to labels roughly: keep simple token match
  const hits = ca.filter((a) => ps.some((p) => p === a || p.includes(a) || a.includes(p))).length;
  return ca.length ? hits / ca.length : 0.5;
}
function workPrefMatch(profile, career) {
  if (!profile.workPrefs.length) return 0.5;
  return interestMatch(profile, career) * 0.9 + 0.1; // reuse
}
function educationCompatibility(profile, career) {
  const stream = profile.stream; // mpc/bipc/commerce/arts
  const family = (profile.family || '').toLowerCase();
  const degreeFamily = (profile.degreeFamily || '').toLowerCase();
  const degreeLabel = (profile.degreeLabel || '').toLowerCase();
  const specialization = (profile.specialization || '').toLowerCase();

  // ── Strict healthcare degree checks: prevent MBBS ↔ Nursing ↔ Pharmacy leaks ──
  if (degreeLabel || degreeFamily === 'medicine & healthcare') {
    const dl = degreeLabel;
    const isNursing = dl.includes('nursing');
    const isMbbs = dl === 'mbbs';
    const isBds = dl === 'bds';
    const isPharm = dl.includes('pharm');
    const isPhysio = dl.includes('physiotherapy') || dl.includes('bpt');
    const isLab = dl.includes('laboratory') || dl.includes('medical laboratory');
    const isRadio = dl.includes('radiology') || dl.includes('imaging');
    const isBams = dl === 'bams';
    const isBhms = dl === 'bhms';
    const isBums = dl === 'bums';
    const isBsms = dl === 'bsms';
    const isBnys = dl === 'bnys';
    const isOpto = dl.includes('optometry');
    const isCardiac = dl.includes('cardiac');
    const isAnaesth = dl.includes('anaesthesia');
    const isOt = dl.includes('operation theatre');
    const isResp = dl.includes('respiratory');
    const isDial = dl.includes('dialysis');
    const isEmerg = dl.includes('emergency');
    const isBot = dl.includes('occupational') || dl === 'bot';
    // Nursing strictly nursing
    if (isNursing && ['doctor','pharmacist'].includes(career.id)) return 0.25;
    if (isMbbs && career.id === 'nurse') return 0.25;
    if (isPharm && ['doctor','nurse'].includes(career.id)) return 0.25;
    if (isPhysio && ['doctor','pharmacist','nurse'].includes(career.id)) return 0.25;
    if (isBds && ['doctor','pharmacist','nurse'].includes(career.id)) return 0.25;
    if (isLab && ['doctor','nurse','pharmacist'].includes(career.id)) return 0.25;
    if (isRadio && ['doctor','nurse','pharmacist'].includes(career.id)) return 0.25;
    // AYUSH strictly their own
    if ((isBams||isBhms||isBums||isBsms||isBnys) && ['doctor','nurse','pharmacist'].includes(career.id)) return 0.25;
    if (isOpto && ['doctor','nurse','pharmacist'].includes(career.id)) return 0.25;
    if ((isCardiac||isAnaesth||isOt||isResp||isDial||isEmerg||isBot) && ['doctor','nurse','pharmacist'].includes(career.id)) return 0.25;
  }

  // ── Engineering specialization-aware: CSE vs Mechanical shouldn't cross ──
  if (degreeLabel === 'b.tech / b.e.' || degreeFamily === 'engineering') {
    const spec = specialization;
    const isCse = spec.includes('computer') || spec.includes('artificial') || spec.includes('data science') || spec.includes('information') || spec.includes('cybersecurity');
    const isMech = spec.includes('mechanical');
    const isCivil = spec.includes('civil');
    const isEce = spec.includes('electronics') || spec.includes('electrical');
    if (isMech && ['software-engineer','data-scientist','ml-engineer','cybersecurity-analyst'].includes(career.id)) return 0.25;
    if (isCse && ['mechanical-engineer','civil-engineer'].includes(career.id)) return 0.25;
    if (isCivil && ['software-engineer','ml-engineer','cybersecurity-analyst'].includes(career.id)) return 0.25;
    if (isEce && ['mechanical-engineer','civil-engineer'].includes(career.id)) return 0.25;
  }

  // Directly accessible
  if (stream && career.streamAffinity?.includes(stream)) return 1;
  if (degreeFamily && career.familyAffinity?.some((f) => f.toLowerCase() === degreeFamily)) return 1;
  if (family && career.familyAffinity?.some((f) => family.includes(f.toLowerCase()) || f.toLowerCase().includes(family))) return 1;
  // If a degree is known but the career belongs to a different field
  // (e.g. MBBS careers for a BBA student), it's not a viable route — score low
  // so it never surfaces in recommendations.
  if (degreeFamily) return 0.25;
  // If no stream/family info (e.g., parent class10), neutral
  if (!stream && !family) return 0.7;
  // Commerce/Arts overlap etc: allow with preparation
  // If stream exists but career not in affinity, lower but not 0
  if (stream) return 0.45;
  if (family) return 0.6;
  return 0.7;
}

function getEducationNote(profile, career, compat) {
  if (compat >= 1) return { label: 'Directly accessible', tone: 'good' };
  if (compat >= 0.6) return { label: 'Accessible', tone: 'light' };
  if (compat >= 0.45) return { label: 'Possible with additional preparation', tone: 'light' };
  return { label: 'Requires a different route', tone: 'light' };
}

// Careers that align with each graduation "direction" answer (Q5).
// Family-aware boosts so BBA Finance + higher_studies doesn't surface unrelated medical/research careers.
const DIRECTION_CAREERS = {
  start_working: ['marketing-manager', 'financial-analyst', 'business-analyst', 'software-engineer', 'nurse', 'pharmacist', 'teacher'],
  higher_studies: ['doctor', 'data-scientist', 'biotech-researcher', 'chartered-accountant', 'lawyer', 'psychologist'],
  specialize: ['doctor', 'chartered-accountant', 'data-scientist', 'ux-designer', 'psychologist', 'ml-engineer'],
  government: ['civil-servant', 'teacher'],
  business: ['entrepreneur', 'marketing-manager', 'financial-analyst'],
  abroad: ['software-engineer', 'data-scientist', 'nurse', 'cybersecurity-analyst'],
  research: ['biotech-researcher', 'data-scientist', 'environmental-scientist', 'agricultural-scientist', 'ml-engineer'],
};

// Higher studies granularity: postgraduate / professional routes that are academically appropriate per family.
// Used to bias direction scoring and to surface via getHigherStudyOptions().
export const HIGHER_STUDIES_BY_FAMILY = {
  'Commerce & Finance': ['M.Com', 'MBA / PGDM', 'MSc Finance', 'CA / CFA / ACCA / FRM (professional)'],
  'Business & Management': ['MBA / PGDM', 'MSc Finance / Business Analytics', 'Professional: CFA / FRM / CA where relevant'],
  'Engineering': ['M.Tech', 'MS (abroad)', 'MBA', 'Specialized M.Tech (AI, Data, VLSI, etc.)'],
  'Computer Applications': ['MCA', 'M.Tech / MS', 'MS abroad', 'Specialized master’s (AI, Data, Cybersecurity)'],
  'Medicine & Healthcare': ['MD / MS / DNB', 'MDS / M.Pharm / MPT as per degree', 'DNB / Diploma specialization'],
  'Science': ['M.Sc', 'M.Tech (for eligible)', 'MS abroad'],
  'Arts & Humanities': ['MA', 'MSW / M.Phil', 'Specialized MA'],
  'Law': ['LL.M', 'LL.M abroad'],
  'Design & Creative': ['M.Des', 'MFA'],
  'Agriculture & Environment': ['M.Sc Agriculture', 'M.Tech Agri / Env'],
  'Education': ['M.Ed', 'B.Ed → M.Ed route'],
  'Other Professional Programs': ['Relevant master’s / PG diploma'],
};

export function getHigherStudyOptions(family, degreeLabel = '', specialization = '') {
  // Specialize further for medicine based on exact degree
  if (family === 'Medicine & Healthcare') {
    if (degreeLabel === 'MBBS') return ['MD / MS / DNB', 'Diploma specialization', 'MS abroad (USMLE/PLAB route)'];
    if (degreeLabel === 'BDS') return ['MDS', 'MDS abroad'];
    if (degreeLabel === 'B.Sc Nursing') return ['M.Sc Nursing', 'Post-BSc specialization', 'Nurse Practitioner abroad'];
    if (degreeLabel === 'B.Pharm' || degreeLabel === 'Pharm.D') return ['M.Pharm', 'Pharm.D → PG specialization', 'MS Pharmaceutical Sciences'];
    if (degreeLabel.includes('Physiotherapy') || degreeLabel.includes('BPT')) return ['MPT', 'Specialized physiotherapy master’s'];
    if (degreeLabel.includes('Medical Laboratory')) return ['M.Sc MLT', 'Specialized diagnostics master’s'];
    if (degreeLabel.includes('Radiology')) return ['M.Sc Radiology / Imaging', 'Specialized imaging master’s'];
  }
  if (family === 'Business & Management' && specialization) {
    if (specialization === 'Finance') return ['MBA / PGDM (Finance)', 'MSc Finance', 'CFA / FRM / CA / ACCA'];
    if (specialization === 'Marketing') return ['MBA / PGDM (Marketing)', 'Masters in Marketing / Brand', 'Digital Marketing specialization'];
    if (specialization === 'Human Resources') return ['MBA / PGDM (HR)', 'Masters in HR / Labour Law'];
  }
  if (family === 'Commerce & Finance' && specialization === 'Finance') return ['MBA / PGDM', 'MSc Finance', 'CFA / FRM / CA'];
  if (family === 'Engineering' && specialization) {
    if (specialization.includes('Computer Science') || specialization.includes('AI') || specialization.includes('Data Science') || specialization.includes('Information Technology') || specialization.includes('Cybersecurity')) {
      return ['M.Tech CSE / AI / Data', 'MS Computer Science (abroad)', 'MBA (if switching to product/management)'];
    }
    if (specialization.includes('Mechanical')) return ['M.Tech Mechanical', 'MS Mechanical (abroad)', 'MBA / Specialized MBA'];
  }
  return HIGHER_STUDIES_BY_FAMILY[family] || ['Relevant master’s / PG'];
}

const DIRECTION_FAMILY_BOOST = {
  higher_studies: {
    'Commerce & Finance': ['financial-analyst', 'chartered-accountant', 'business-analyst'],
    'Business & Management': ['financial-analyst', 'business-analyst', 'marketing-manager', 'chartered-accountant'],
    'Engineering': ['software-engineer', 'data-scientist', 'ml-engineer', 'mechanical-engineer', 'civil-engineer'],
    'Computer Applications': ['software-engineer', 'data-scientist', 'ml-engineer', 'cybersecurity-analyst'],
    'Medicine & Healthcare': ['doctor', 'pharmacist', 'nurse', 'biotech-researcher'],
    'Science': ['biotech-researcher', 'data-scientist', 'environmental-scientist', 'agricultural-scientist'],
    'Arts & Humanities': ['psychologist', 'lawyer', 'journalist', 'teacher'],
    'Law': ['lawyer', 'civil-servant'],
    'Design & Creative': ['ux-designer', 'architect'],
    'Agriculture & Environment': ['agricultural-scientist', 'environmental-scientist'],
    'Education': ['teacher', 'psychologist'],
  },
  specialize: {
    'Medicine & Healthcare': ['doctor', 'nurse', 'pharmacist'],
    'Commerce & Finance': ['chartered-accountant', 'financial-analyst'],
    'Business & Management': ['chartered-accountant', 'financial-analyst', 'marketing-manager'],
    'Engineering': ['ml-engineer', 'data-scientist', 'software-engineer', 'mechanical-engineer'],
    'Computer Applications': ['ml-engineer', 'cybersecurity-analyst', 'data-scientist'],
  },
  government: {
    'Medicine & Healthcare': ['doctor', 'nurse', 'pharmacist', 'civil-servant'],
    'Commerce & Finance': ['chartered-accountant', 'civil-servant', 'financial-analyst'],
    'Business & Management': ['civil-servant', 'business-analyst'],
    'Engineering': ['civil-servant', 'mechanical-engineer', 'civil-engineer'],
    'Computer Applications': ['civil-servant', 'software-engineer'],
  },
  abroad: {
    'Engineering': ['software-engineer', 'data-scientist', 'ml-engineer'],
    'Computer Applications': ['software-engineer', 'data-scientist', 'cybersecurity-analyst'],
    'Medicine & Healthcare': ['nurse', 'doctor', 'pharmacist'],
    'Commerce & Finance': ['financial-analyst', 'chartered-accountant'],
    'Business & Management': ['business-analyst', 'marketing-manager'],
  },
};

const DIRECTION_LABELS = {
  start_working: 'starting your career right after graduation',
  higher_studies: 'pursuing higher studies',
  specialize: 'specialising further in your field',
  government: 'a government career',
  business: 'starting your own business',
  abroad: 'working abroad',
  research: 'a research path',
};

// ── Scoring ───────────────────────────────────────────
export function scoreCareers(profile) {
  const scored = careers.map((career) => {
    const iM = interestMatch(profile, career);
    const sM = strengthMatch(profile, career);
    const wM = workPrefMatch(profile, career);
    const eC = educationCompatibility(profile, career);

    // Weights tuned to questionnaire structure: interest most signal, then strengths/work
    // If uncertainty high, lower interest weight
    const uncertainty = profile.uncertainty;
    const wInterest = uncertainty ? 0.2 : 0.3;
    const wStrength = 0.2;
    const wWork = 0.2;
    const wPriority = 0.15; // placeholder for priority alignment
    const wEdu = 0.15;

    // priority alignment: if priority like entrepreneurship and career is entrepreneur, boost
    const priority = (profile.priority || '').toLowerCase();
    let priorityBoost = 0.5;
    if (priority.includes('entrepreneur') && career.id === 'entrepreneur') priorityBoost = 1;
    if (priority.includes('government') && career.id === 'civil-servant') priorityBoost = 1;
    if (priority.includes('abroad') && ['software-engineer', 'nurse'].includes(career.id)) priorityBoost = 0.8;
    if (priority.includes('stable') && ['civil-servant', 'doctor', 'teacher'].includes(career.id)) priorityBoost = 0.9;

    // Q5 direction (graduation flow): the stated goal must steer the outcome — family-aware
    const direction = (profile.direction || '').toLowerCase();
    const familyBoostList = DIRECTION_FAMILY_BOOST[direction]?.[profile.family] || [];
    const genericBoostList = DIRECTION_CAREERS[direction] || [];
    if (familyBoostList.includes(career.id)) {
      priorityBoost = Math.max(priorityBoost, 0.98);
    } else if (genericBoostList.includes(career.id)) {
      // generic boost is weaker if family has its own specific list
      const hasFamilyList = !!DIRECTION_FAMILY_BOOST[direction]?.[profile.family];
      priorityBoost = Math.max(priorityBoost, hasFamilyList ? 0.65 : 0.95);
    }
    // degreeStage influences urgency: final_year/recently_graduated + start_working boosts entry roles
    if (profile.degreeStage === 'final_year' || profile.degreeStage === 'recently_graduated') {
      if (direction === 'start_working' && ['financial-analyst','business-analyst','software-engineer','nurse','pharmacist','marketing-manager','teacher'].includes(career.id)) {
        priorityBoost = Math.max(priorityBoost, 0.9);
      }
    }
    // Stage + higher_studies: early years should still boost academic routes but not over-penalize
    if ((profile.degreeStage === 'year_1' || profile.degreeStage === 'year_2') && direction === 'higher_studies') {
      // keep boost already applied; don't add entry-job bias
    }

    const raw = iM * wInterest + sM * wStrength + wM * wWork + priorityBoost * wPriority + eC * wEdu;
    return { career, raw, breakdown: { interestMatch: iM, strengthMatch: sM, workMatch: wM, eduCompat: eC, priorityBoost } };
  });

  // Calibrate: blend a relative curve (best career ≈ 92) with the absolute
  // raw score, weighted by how strong the profile's best fit actually is.
  // This keeps recommended cards out of "Lower Match" while preventing weak
  // profiles from inflating every career to "Strong Match".
  const topRaw = Math.max(...scored.map((s) => s.raw), 0.01);
  const confidence = Math.min(1, topRaw / 0.8);
  const mapped = scored.map((s) => {
    const relative = s.raw / topRaw;
    const relativeCurve = Math.pow(relative, 0.7) * 92; // gentler curve: mid-range matches stay "Good/Worth Exploring"
    const absolute = s.raw * 100;
    const score = Math.round(Math.min(98, confidence * relativeCurve + (1 - confidence) * absolute));
    const edu = getEducationNote(profile, s.career, s.breakdown.eduCompat);
    return {
      career: s.career,
      score,
      raw: s.raw,
      band: getBand(score),
      breakdown: s.breakdown,
      education: edu,
    };
  });

  // Sort by score desc
  mapped.sort((a, b) => b.score - a.score);
  return mapped;
}

function getBand(score) {
  if (score >= 80) return 'Strong Match';
  if (score >= 65) return 'Good Match';
  if (score >= 50) return 'Worth Exploring';
  return 'Lower Match';
}



export function diversify(scored, count = 4) {
  // Drop careers whose education route doesn't fit the user's degree/stream
  // (e.g. MBBS careers for a BBA student) — they are not relevant options.
  const compatible = scored.filter((s) => (s.breakdown?.eduCompat ?? 1) > 0.25);
  const pool = compatible.length >= 2 ? compatible : scored;
  if (profileIsUncertain(pool)) {
    // For uncertain profiles, intentionally diversify
    return diversifyByCategory(pool, count);
  }
  // If top scores are tightly clustered in one category, diversify
  const topCats = pool.slice(0, 6).map((s) => s.career.category);
  const distinct = new Set(topCats).size;
  if (distinct <= 2 && (pool[3] ? pool[0].score - pool[3].score < 15 : true)) {
    return diversifyByCategory(pool, count);
  }
  // Otherwise just top N
  return pool.slice(0, count);
}

function profileIsUncertain(scored) {
  // Heuristic: if the best raw fit is weak (< 0.62 absolute), uncertain
  return (scored[0]?.raw ?? 0) < 0.62;
}

function diversifyByCategory(scored, count) {
  // Prefer candidates that are at least "Worth Exploring" — if there aren't
  // enough relevant ones, show fewer rather than padding with irrelevant careers.
  const relevant = scored.filter((s) => s.score >= 50);
  const pool = relevant.length ? relevant : scored;
  const picked = [];
  const catCount = {};
  for (const item of pool) {
    const cat = item.career.category;
    catCount[cat] = catCount[cat] || 0;
    if (catCount[cat] >= 1 && picked.length >= 2) {
      // allow at most 1 per category for first picks, then relax
      // skip if we already have this category and we have alternatives
      const hasAlt = scored.some((s) => !picked.includes(s) && (catCount[s.career.category] || 0) === 0);
      if (hasAlt) continue;
    }
    picked.push(item);
    catCount[cat] += 1;
    if (picked.length >= count) break;
  }
  // Fill if needed
  if (picked.length < count) {
    for (const s of scored) if (!picked.includes(s)) { picked.push(s); if (picked.length >= count) break; }
  }
  return picked;
}

// ── Mentor-voiced primary direction ──────────────────────────────────────
// Reads the student's ACTUAL picks (field, degree, interests, strengths,
// post-graduation goal) and writes a specific, experienced-mentor style
// narrative. Never generic — every sentence traces back to an answer.

const MENTOR_FIELD_INSIGHT = {
  Technology: 'Technology is one of the few fields where your portfolio talks louder than your marks — so the smartest move in the next six months is building two or three real things you can point at.',
  'AI & Technology': 'AI rewards people who stay curious after the novelty wears off. If you keep tinkering with datasets and models beyond what a course asks of you, you are already ahead of most graduates.',
  Engineering: 'Engineering is about judgement under constraints — cost, materials, deadlines. Internships and lab or site exposure teach that faster than any textbook, so chase them early.',
  Healthcare: 'Healthcare is demanding in a way few careers are — long training, real stakes, real people. The ones who last are the ones who genuinely find meaning in patient outcomes, not just the title.',
  Research: 'Research pays patience. A good supervisor and an honest daily reading habit will shape your career more than any ranking, so choose where you work as carefully as what you work on.',
  Finance: 'Finance rewards precision and scepticism in equal measure — the analysts who rise are the ones who double-check the numbers everyone else accepted. Start reading markets and annual reports now, not after placement.',
  Business: 'Business is learned by doing. Every club you lead, every small venture you try, every negotiation you sit in teaches you something no case study can.',
  Design: 'Design is a craft business — your eye and your process are the product. Keep a portfolio you actually update, and critique your own work harder than anyone else will.',
  Law: 'Law is a reading and arguing profession. Students who read judgments for pleasure and enjoy building an argument rarely struggle — make that a habit now.',
  Humanities: 'People-centred work compounds: every conversation, every case you handle builds judgement that cannot be crammed. Treat early exposure — volunteering, internships, shadowing — as core work, not extras.',
  Media: 'Media rewards the person who ships. Write, shoot, edit, publish — a real body of work beats any certificate, and your first hundred pieces will be rough. That is how the craft forms.',
  'Public Service': 'Public service is a long game — years of quiet preparation for a role with real leverage. The candidates who succeed treat preparation like a job, not a hobby.',
  Education: 'Teaching looks easy and is not — explaining something so a stranger truly gets it is a hard, learnable craft. Practise it deliberately and it becomes a genuine edge.',
  Agriculture: 'Agri and environment careers sit at a genuine inflection point — food security, climate, rural enterprise. Hands-on field time will teach you what no lecture can.',
};

const DIRECTION_SENTENCE = {
  start_working: 'Because you want to start earning right after graduation, everything below is weighted toward roles with a real entry door — and the fastest skills to close whatever gap remains.',
  business: 'Because you want to build something of your own, the paths below are chosen for how well they teach you how a business actually runs before you bet your own money on one.',
  government: 'Because a government career is your goal, stability and a clear exam path matter more than a flashy first salary — the preparation route is laid out honestly below.',
  research: 'Because research attracts you, the path runs through deeper study — a masters, then possibly a PhD — so the real question is where you could stay curious for years.',
  abroad: 'Because working abroad is on your mind, global mobility has been factored in — some of these paths travel far better than others, and that changes the calculus.',
  higher_studies: 'Because you are leaning toward higher studies, choose the next degree as deliberately as a first job — the options below are ranked by how well they feed strong postgraduate programmes.',
  still_exploring: 'You are still figuring the direction out — and that is a perfectly fine place to be at your stage. What follows is a spread of options worth genuinely testing, not a single verdict.',
};

const INTEREST_LINE = {
  'Business Strategy': 'an instinct for how businesses win and lose',
  'Marketing': 'the pull toward understanding what makes people buy',
  'Finance': 'a real pull toward markets, money and how it moves',
  'Accounting': 'a comfort with structure, records and getting numbers right',
  'Technology': 'a genuine curiosity about how things get built',
  'Data': 'a taste for finding the story inside numbers',
  'Design': 'an eye for how things look and feel',
  'Communication': 'a natural way with words and people',
  'People': 'a genuine interest in how people think and work together',
  'Law': 'a mind that likes rules, evidence and argument',
  'Healthcare': 'a pull toward work that directly helps people',
  'Research': 'a curiosity that does not settle for the first answer',
};

const STRENGTH_READING = {
  'Communication': 'you can put a complicated idea into words people actually follow — that is rarer than it sounds and every field pays for it',
  'Strategic Thinking': 'you instinctively look past the immediate problem to the pattern behind it — that is the raw material of planning and leadership',
  'Analytical Thinking': 'you break messy problems into parts instead of panicking at the mess — analysts, managers and engineers are all paid for exactly this',
  'Problem Solving': 'you do not stall when something breaks — you poke at it until it works. Every employer on earth is short of people like that',
  'Creativity': 'you bring options instead of obstacles — in a room full of "cannot be done", you find the way through',
  'Leadership': 'you are comfortable taking responsibility when a group needs direction — watch that it grows into judgement, not just confidence',
  'Organisation': 'you notice what will slip before it slips — operations, projects and teams quietly run on people like you',
  'Attention to Detail': 'you catch the small things others wave through — in finance, law, medicine and code, that habit is the whole job',
  'Empathy': 'you read how people actually feel, not just what they say — that is the foundation of every people-facing career worth doing',
  'Numeracy': 'numbers do not intimidate you — pair that with scepticism and you have the core skill of finance and analytics',
  'Writing': 'you can argue on paper — exams, applications, reports, proposals: writing well quietly decides who gets taken seriously',
  'Memory': 'you retain what you learn — under exam pressure and in viva rooms, that is a genuine, underpriced advantage',
  'Physical Stamina': 'you can put in sustained hard effort — in field roles, medicine and services, resilience matters as much as intellect',
};

function interestPhrase(labels = []) {
  for (const l of labels) {
    for (const key of Object.keys(INTEREST_LINE)) {
      if (l.toLowerCase().includes(key.toLowerCase())) return { label: l, phrase: INTEREST_LINE[key] };
    }
  }
  return labels[0] ? { label: labels[0], phrase: `a clear interest in ${labels[0].toLowerCase()}` } : null;
}

function strengthReadings(labels = []) {
  const out = [];
  for (const l of labels) {
    for (const key of Object.keys(STRENGTH_READING)) {
      if (l.toLowerCase().includes(key.toLowerCase())) { out.push({ label: l, reading: STRENGTH_READING[key] }); break; }
    }
  }
  return out;
}

export function getPrimaryDirection(ranked, profile = {}) {
  if (!ranked?.length) {
    return {
      label: 'Explore broadly',
      description: 'Your responses are still open — worth trying a few different areas before narrowing.',
      strengths: [],
    };
  }
  const top = ranked[0].career;
  const cat = top.category;
  const field = profile.fieldLabel || (typeof profile.field === 'string' ? profile.field.replace(/_/g, ' ') : '');
  const degree = profile.degreeLabel || (typeof profile.degree === 'string' ? profile.degree.replace(/_/g, ' ') : '');
  const dir = profile.direction || '';
  const interest = interestPhrase(profile.interestLabels);
  const strengths = strengthReadings(profile.strengthLabels);

  // Paragraph 1 — reflect their actual picks back, mentor to student
  let p1;
  if (degree || field) {
    const who = degree ? `You are doing your ${degree}` : `You are studying ${field}`;
    p1 = interest
      ? `${who}, and you told me ${interest.label.toLowerCase()} is what genuinely pulls you. That combination matters more than students usually realise, because ${interest.phrase} — and it shows in how you answered.`
      : `${who}, and the parts of the field you picked tell me where your head naturally goes.`;
  } else {
    p1 = interest
      ? `You told me ${interest.label.toLowerCase()} is what genuinely pulls you — that is the first honest signal in any career conversation, and ${interest.phrase}.`
      : 'Looking at your answers, your direction is still open — which is completely normal at your stage.';
  }

  // Paragraph 2 — the verdict, tied to their top-ranked direction
  const s0 = strengths[0];
  let p2 = `Everything you answered points the same way: ${cat} is where your strongest signals line up. The careers below are not guesses — each one is scored against your field, your degree, what you enjoy and what you are already good at.`;
  if (s0) p2 += ` And notice what you listed as a strength: ${s0.reading} — that sits right at the centre of this direction.`;

  // Paragraph 3 — their post-graduation goal, honestly woven in
  const p3 = DIRECTION_SENTENCE[dir] || '';

  // Paragraph 4 — one experienced, field-specific piece of advice
  const p4 = MENTOR_FIELD_INSIGHT[cat] || 'Whatever you choose, test it early — one internship, one project or one honest conversation with someone doing the job will tell you more than months of thinking.';

  return { label: cat, description: [p1, p2, p3, p4].filter(Boolean).join('\n\n'), strengths };
}

export function buildWhyBullets(profile, career) {
  const bullets = [];
  // Interest
  const im = interestMatch(profile, career);
  if (im >= 0.5) {
    const matched = career.traits.find((t) => profile.interests.some((p) => p.includes(t.toLowerCase()) || t.toLowerCase().includes(p)));
    if (matched) bullets.push(`You showed interest in ${matched.toLowerCase()}`);
    else bullets.push(`Your interests align with the core of this career`);
  }
  // Strengths
  const sm = strengthMatch(profile, career);
  if (sm >= 0.3) {
    const matchedS = career.strengthsAligned.find((s) => profile.strengths.some((p) => p.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(p.toLowerCase())));
    if (matchedS) bullets.push(`${matchedS} is one of your stronger areas`);
  }
  // Work pref
  if (profile.workPrefs.length) {
    const wm = workPrefMatch(profile, career);
    if (wm >= 0.5) bullets.push(`You prefer ${profile.workPrefs[0]}-type work, which fits this field`);
  }
  // Priority
  if (profile.priority && career.category.toLowerCase().includes(profile.priority.toLowerCase().split(' ')[0])) {
    bullets.push(`You said “${profile.priority}” matters most — this path reflects that`);
  }
  // Direction (graduation Q5)
  const direction = (profile.direction || '').toLowerCase();
  if (DIRECTION_CAREERS[direction]?.includes(career.id)) {
    bullets.push(`Your goal of ${DIRECTION_LABELS[direction] || direction} fits this path`);
  }
  // Education
  if (educationCompatibility(profile, career) >= 1) bullets.push(`Your current path gives you a direct route`);
  if (bullets.length === 0) bullets.push(`Based on your overall pattern, this is a balanced option worth exploring`);
  // Ensure at least 2 bullets, add generic if needed
  return bullets.slice(0, 4);
}

export function buildPersonalizedReason(profile, career, score) {
  const interests = profile.interests.slice(0, 2).join(' and ');
  const strengths = career.strengthsAligned.slice(0, 2).join(' and ').toLowerCase();
  if (score >= 75) return `You showed interest in ${interests || 'areas related to ' + career.category.toLowerCase()} and strength in ${strengths} — core to this career.`;
  if (score >= 55) return `Your pattern around ${interests || career.category.toLowerCase()} and ${strengths} makes this a good path to try.`;
  return `This combines ${strengths} with interests like ${interests || career.category.toLowerCase()} — worth exploring with a small project.`;
}
