/**
 * NAVORA — Class 12 multi-signal career recommendation engine.
 *
 * Consumes the conditional questionnaire data (careerQuestionnaire.js) and
 * the career catalog (careers.js). Scores careers from overlapping signals:
 *
 *   1. Stream context            (streamAffinity on the career)
 *   2. Interest area             (careers attached to the interest option)
 *   3. Career direction          (careers attached to the direction option)
 *   4. Work preferences          (workStyle ↔ career keywords)
 *   5. Strengths                 (strengths ↔ career keywords)
 *   6. Priorities / goals        (priority ↔ career signal tags)
 *   7. Eligibility               (stream eligibility for the career)
 *   8. Exploratory mode          ("Still exploring" → career clusters)
 *
 * The highest-ranked max-5 recommendations are returned with fit levels
 * ("Strong match" / "Good match" / "Worth exploring") — never certainty.
 * Careers whose pathway is not directly accessible from the stream are
 * still surfaced, but with an explicit extra-pathway note.
 */

import { careers } from './careers.js';
import {
  getInterestOption,
  getDirectionOption,
  isExploring,
  isTwelveExploring,
  getSpecificBranch,
} from './careerQuestionnaire.js';

export const MAX_RECOMMENDATIONS = 5;

// ── Keyword mapping: answer values → recommendation signals ──
const WORK_STYLE_SIGNALS = {
  solving_problems: ['analytical', 'logical', 'problem', 'coding', 'strategy', 'data', 'math'],
  working_with_people: ['people', 'counselling', 'communication', 'teaching', 'empathy', 'client'],
  building_creating: ['building', 'development', 'coding', 'design', 'product', 'hands-on', 'prototype'],
  analysing_information: ['data', 'analysis', 'analytical', 'research', 'finance', 'audit'],
  researching_discovering: ['research', 'science', 'discovery', 'lab', 'curiosity'],
  helping_directly: ['helping', 'care', 'patient', 'health', 'counselling', 'social'],
  leading_managing: ['leadership', 'management', 'strategy', 'influence'],
  designing_creating: ['design', 'creative', 'visual', 'aesthetic', 'ux'],
  working_technology: ['technology', 'software', 'coding', 'ai', 'data', 'digital'],
  hands_on_practical: ['hands-on', 'practical', 'field', 'workshop', 'technical'],
};

const STRENGTH_SIGNALS = {
  logical_thinking: ['logical', 'analytical', 'coding', 'math'],
  problem_solving: ['problem', 'analytical', 'coding', 'strategy'],
  mathematics: ['math', 'quantitative', 'analytical', 'data', 'actuarial'],
  scientific_thinking: ['science', 'research', 'lab', 'biology'],
  communication: ['communication', 'people', 'writing', 'storytelling'],
  creativity: ['creative', 'design', 'visual', 'content'],
  leadership: ['leadership', 'management', 'influence'],
  empathy: ['empathy', 'counselling', 'people', 'care', 'helping'],
  attention_detail: ['detail', 'audit', 'quality', 'precision'],
  research_curiosity: ['research', 'curiosity', 'science', 'discovery'],
  practical_skills: ['hands-on', 'practical', 'technical', 'workshop'],
  business_thinking: ['business', 'strategy', 'finance', 'entrepreneur'],
  working_with_people: ['people', 'communication', 'counselling', 'teaching'],
};

const PRIORITY_SIGNALS = {
  high_earning: ['high-growth', 'earning', 'corporate', 'tech', 'finance'],
  job_stability: ['stable', 'secure', 'government', 'healthcare'],
  helping_people: ['helping', 'care', 'health', 'social', 'counselling'],
  intellectual_challenge: ['research', 'analytical', 'science', 'ai', 'quantitative'],
  creativity: ['creative', 'design', 'media', 'content'],
  work_life_balance: ['balance', 'stable', 'flexible'],
  leadership_influence: ['leadership', 'management', 'influence'],
  entrepreneurship: ['entrepreneur', 'startup', 'business', 'self-employment'],
  working_internationally: ['global', 'international', 'remote'],
  government_service: ['government', 'public', 'civil', 'policy'],
  research_innovation: ['research', 'innovation', 'science', 'ai'],
  not_sure_yet: [],
};

// ── Eligibility: stream → career pathway access ───────────
// 'direct'      — natural pathway from this stream
// 'pathway'     — possible, but requires an additional qualification/route
// 'restricted'  — not accessible from this academic pathway (explained, not recommended)
const ELIGIBILITY = {
  'software-engineer': { mpc: 'direct', diploma: 'direct', iti: 'pathway', bipc: 'pathway', cec: 'pathway', mec: 'pathway', commerce: 'pathway', arts: 'pathway', not_sure: 'pathway' },
  'data-scientist': { mpc: 'direct', mec: 'direct', diploma: 'pathway', bipc: 'pathway', cec: 'pathway', commerce: 'pathway', arts: 'pathway', iti: 'pathway', not_sure: 'pathway' },
  'ml-engineer': { mpc: 'direct', diploma: 'pathway', bipc: 'pathway', mec: 'pathway', cec: 'pathway', commerce: 'pathway', arts: 'pathway', iti: 'pathway', not_sure: 'pathway' },
  'cybersecurity-analyst': { mpc: 'direct', diploma: 'direct', iti: 'pathway', bipc: 'pathway', mec: 'pathway', cec: 'pathway', commerce: 'pathway', arts: 'pathway', not_sure: 'pathway' },
  'mechanical-engineer': { mpc: 'direct', diploma: 'direct', iti: 'pathway', bipc: 'restricted', mec: 'restricted', cec: 'restricted', commerce: 'restricted', arts: 'restricted', not_sure: 'pathway' },
  'civil-engineer': { mpc: 'direct', diploma: 'direct', iti: 'pathway', bipc: 'restricted', mec: 'restricted', cec: 'restricted', commerce: 'restricted', arts: 'restricted', not_sure: 'pathway' },
  doctor: { bipc: 'direct', not_sure: 'pathway', mpc: 'restricted', diploma: 'restricted', iti: 'restricted', cec: 'restricted', mec: 'restricted', commerce: 'restricted', arts: 'restricted' },
  nurse: { bipc: 'direct', not_sure: 'pathway', mpc: 'pathway', diploma: 'pathway', iti: 'pathway', cec: 'pathway', mec: 'pathway', commerce: 'pathway', arts: 'pathway' },
  pharmacist: { bipc: 'direct', not_sure: 'pathway', mpc: 'pathway', diploma: 'pathway', iti: 'restricted', cec: 'restricted', mec: 'restricted', commerce: 'restricted', arts: 'restricted' },
  'biotech-researcher': { bipc: 'direct', mpc: 'pathway', not_sure: 'pathway', diploma: 'pathway', iti: 'restricted', cec: 'restricted', mec: 'restricted', commerce: 'restricted', arts: 'restricted' },
  'chartered-accountant': { commerce: 'direct', cec: 'direct', mec: 'direct', not_sure: 'pathway', mpc: 'pathway', bipc: 'pathway', diploma: 'pathway', iti: 'pathway', arts: 'pathway' },
  'financial-analyst': { commerce: 'direct', mec: 'direct', cec: 'direct', mpc: 'pathway', not_sure: 'pathway', bipc: 'pathway', diploma: 'pathway', iti: 'pathway', arts: 'pathway' },
  'business-analyst': { commerce: 'direct', mec: 'direct', cec: 'direct', mpc: 'pathway', not_sure: 'pathway', bipc: 'pathway', diploma: 'pathway', iti: 'pathway', arts: 'pathway' },
  entrepreneur: { commerce: 'direct', cec: 'direct', mec: 'direct', mpc: 'direct', bipc: 'direct', arts: 'direct', diploma: 'direct', iti: 'direct', not_sure: 'direct' },
  'ux-designer': { arts: 'direct', mpc: 'direct', bipc: 'direct', cec: 'direct', mec: 'direct', commerce: 'direct', diploma: 'direct', iti: 'pathway', not_sure: 'direct' },
  architect: { mpc: 'direct', diploma: 'direct', arts: 'pathway', bipc: 'pathway', cec: 'restricted', mec: 'restricted', commerce: 'restricted', iti: 'restricted', not_sure: 'pathway' },
  lawyer: { arts: 'direct', cec: 'direct', commerce: 'direct', mec: 'direct', mpc: 'direct', bipc: 'direct', diploma: 'direct', iti: 'direct', not_sure: 'direct' },
  psychologist: { arts: 'direct', bipc: 'direct', cec: 'direct', mpc: 'pathway', mec: 'pathway', commerce: 'pathway', diploma: 'pathway', iti: 'pathway', not_sure: 'direct' },
  journalist: { arts: 'direct', cec: 'direct', mpc: 'pathway', bipc: 'pathway', mec: 'pathway', commerce: 'pathway', diploma: 'pathway', iti: 'pathway', not_sure: 'direct' },
  'civil-servant': { arts: 'direct', cec: 'direct', mpc: 'direct', bipc: 'direct', mec: 'direct', commerce: 'direct', diploma: 'direct', iti: 'direct', not_sure: 'direct' },
  teacher: { arts: 'direct', cec: 'direct', mpc: 'direct', bipc: 'direct', mec: 'direct', commerce: 'direct', diploma: 'direct', iti: 'direct', not_sure: 'direct' },
  'agricultural-scientist': { bipc: 'direct', mpc: 'pathway', not_sure: 'pathway', arts: 'pathway', cec: 'pathway', mec: 'pathway', commerce: 'pathway', diploma: 'pathway', iti: 'restricted' },
  'environmental-scientist': { bipc: 'direct', mpc: 'direct', arts: 'pathway', not_sure: 'pathway', cec: 'pathway', mec: 'pathway', commerce: 'pathway', diploma: 'pathway', iti: 'restricted' },
  'marketing-manager': { commerce: 'direct', cec: 'direct', arts: 'direct', mec: 'direct', mpc: 'pathway', bipc: 'pathway', diploma: 'pathway', iti: 'pathway', not_sure: 'pathway' },
};

// ── Exploratory clusters (for "Still exploring" answers) ──
const EXPLORATORY_CLUSTERS = [
  {
    id: 'cluster_tech_data',
    name: 'Technology & Data cluster',
    why: 'Consistently the largest graduate job market, and it overlaps with almost every stream. Worth a short structured trial (a free coding or data course) before deciding.',
    careers: ['software-engineer', 'data-scientist', 'business-analyst'],
  },
  {
    id: 'cluster_health_life',
    name: 'Healthcare & Life Sciences cluster',
    why: 'Ranges from hands-on clinical work to lab research and public health. Worth exploring if biology or helping people resonates even slightly.',
    careers: ['doctor', 'nurse', 'biotech-researcher'],
  },
  {
    id: 'cluster_business_finance',
    name: 'Business & Finance cluster',
    why: 'Accounting, finance and management careers exist in every industry and offer strong professional-qualification routes (CA, CFA, IPM).',
    careers: ['chartered-accountant', 'financial-analyst', 'business-analyst'],
  },
  {
    id: 'cluster_people_policy',
    name: 'People, Law & Policy cluster',
    why: 'Law, civil services, psychology and teaching all centre on people and society — explore which of these feels most natural to you.',
    careers: ['lawyer', 'psychologist', 'civil-servant'],
  },
  {
    id: 'cluster_design_creative',
    name: 'Design & Communication cluster',
    why: 'Design, media and marketing careers are portfolio-driven — building small projects now is the best way to test your interest.',
    careers: ['ux-designer', 'journalist', 'marketing-manager'],
  },
];

// ── Scoring core ──────────────────────────────────────────

const streamOf = (answers = {}) => String(answers.streamV2 || answers.stream || '').toLowerCase();
const twelveStreamOf = (answers = {}) => String(answers.streamV2 || answers.stream || '').toLowerCase();

// ── v2 signal maps ──
const TWELVE_WORK_SIGNALS = {
  solving_complex: ['analytical','logical','problem','coding','strategy','data','math'],
  helping_people: ['helping','care','patient','health','counselling','social','empathy'],
  building_creating: ['building','development','coding','design','product','hands-on','prototype'],
  analysing_data: ['data','analysis','analytical','research','finance','audit'],
  researching: ['research','science','discovery','lab','curiosity'],
  designing: ['design','creative','visual','aesthetic','ux'],
  managing: ['leadership','management','strategy','influence'],
  combination: [],
};
const TWELVE_ENV_SIGNALS = {
  hospital: ['hospital','clinical','patient','health','medical'],
  lab: ['lab','research','science','experiment'],
  office: ['office','corporate','business'],
  tech_env: ['technology','software','coding','ai','data','digital'],
  business_env: ['business','entrepreneur','startup','management'],
  creative: ['creative','design','media','content'],
  field: ['field','outdoors','agriculture','environment'],
  government: ['government','public','civil','policy'],
  mixed: [],
};
const TWELVE_PRIORITY_SIGNALS = {
  strong_interest: [], income: ['earning','corporate','finance','tech'], stability: ['stable','secure','government','healthcare'],
  growth: ['growth','high-growth','corporate'], helping: ['helping','care','health','social'], creativity: ['creative','design','media'],
  prestige: ['prestige','influence','leadership'], global: ['global','international'], entrepreneurship: ['entrepreneur','startup','business'], work_life: ['balance','flexible'],
};
const STUDY_COMMITMENT_PENALTY = {
  // career id -> required commitment level (short=1 ... postgrad=4)
  doctor: 3, pharmacist: 2, 'biotech-researcher': 3, 'software-engineer': 2, 'data-scientist': 2, 'ml-engineer': 2,
  'mechanical-engineer': 2, 'civil-engineer': 2, architect: 3, lawyer: 3, psychologist: 3, journalist: 2, 'civil-servant': 2, teacher: 2,
  'chartered-accountant': 3, 'financial-analyst': 2, 'business-analyst': 2, entrepreneur: 1, 'ux-designer': 2, 'agricultural-scientist': 2, 'environmental-scientist': 2, 'marketing-manager': 2, nurse: 2, 'cybersecurity-analyst': 2,
};
const FUTURE_DIR_SIGNALS = {
  private: ['corporate','private','business'], government: ['government','public','civil'], professional: ['professional','licensed','clinical'],
  research_academia: ['research','academia','science'], entrepreneurship: ['entrepreneur','startup'], abroad: ['global','international'], exploring: [],
};
function getTwelveDirectCareers(answers){
  const ids=new Set();
  const br=getSpecificBranch(answers.interestArea);
  const specOpt=br?.options?.find(o=>o.value===answers.specificInterest);
  (specOpt?.careers||[]).forEach(id=>ids.add(id));
  // also include generic interestArea-level careers if specific is exploratory
  if (ids.size===0 && br) br.options.forEach(o=> (o.careers||[]).forEach(id=> ids.add(id)));
  return ids;
}
export function getTwelveRecommendations(answers={}){
  const stream=twelveStreamOf(answers);
  const directIds=getTwelveDirectCareers(answers);
  const exploring=isTwelveExploring(answers);
  const workVals=answers.workStyle ? [answers.workStyle] : [];
  const envVals=answers.workEnvironment ? [answers.workEnvironment] : [];
  const priorityVals=answers.careerPriorities||[];
  const futureVals=answers.futureDirection ? [answers.futureDirection] : [];
  const scores=new Map();
  for(const career of careers){
    const elig=ELIGIBILITY[career.id]?.[stream];
    if(elig==='restricted') continue;
    let score=0;
    if(directIds.has(career.id)) score+=6;
    if((career.streamAffinity||[]).includes(stream)) score+=3;
    // subject fit
    for(const subj of (answers.subjectInterests||[])){
      if(careerTextFor(career).includes(subj.toLowerCase().replace('_',' '))) score+=0.4;
    }
    const cText=careerTextFor(career);
    score+=keywordScore(workVals, TWELVE_WORK_SIGNALS, cText)*0.6;
    score+=keywordScore(envVals, TWELVE_ENV_SIGNALS, cText)*0.5;
    for(const p of priorityVals) score+=keywordScore([p], TWELVE_PRIORITY_SIGNALS, cText)*0.7;
    score+=keywordScore(futureVals, FUTURE_DIR_SIGNALS, cText)*0.5;
    // motivation small boost
    if(answers.motivation && !['still_figuring','not_sure'].includes(answers.motivation)) score+=0.3;
    // study commitment penalty: if student wants short but career needs long, reduce
    const required=STUDY_COMMITMENT_PENALTY[career.id]||2;
    const prefMap={ short_practical:1, three_four:2, long_professional:3, postgrad_research:4, not_sure:2 };
    const pref=prefMap[answers.studyCommitment]||2;
    if(pref===1 && required>=3) score-=2;
    if(pref===1 && required===2) score-=0.5;
    if(elig==='direct') score+=0.5;
    if(score>0) scores.set(career.id, score);
  }
  if(exploring && scores.size<MAX_RECOMMENDATIONS){
    for(const cluster of EXPLORATORY_CLUSTERS){
      for(const id of cluster.careers){
        const elig=ELIGIBILITY[id]?.[stream];
        if(elig==='restricted') continue;
        scores.set(id, (scores.get(id)||0)+(elig==='direct'?1.5:1));
      }
    }
  }
  const ranked=[...scores.entries()].sort((a,b)=>b[1]-a[1]).slice(0, MAX_RECOMMENDATIONS);
  const maxScore=ranked[0]?.[1]||1;
  return ranked.map(([id,score],index)=>{
    const career=careers.find(c=>c.id===id);
    const elig=ELIGIBILITY[id]?.[stream]||'pathway';
    const ratio=score/maxScore;
    const fit=index===0 && ratio>=0.8 && directIds.has(id) ? 'Strong match' : ratio>=0.6 ? 'Good match' : 'Worth exploring';
    const whyParts=[];
    const br=getSpecificBranch(answers.interestArea);
    const specLabel=br?.options?.find(o=>o.value===answers.specificInterest)?.label;
    if(specLabel) whyParts.push(`You chose ${specLabel.toLowerCase()} within ${br ? br.title.toLowerCase() : answers.interestArea}.`);
    else if(answers.interestArea) whyParts.push(`Your interest in ${answers.interestArea.replace(/_/g,' ')} points here.`);
    if(answers.workStyle) whyParts.push(`Your preference for ${answers.workStyle.replace(/_/g,' ')} aligns with this work.`);
    if(answers.workEnvironment) whyParts.push(`Matches your preferred ${answers.workEnvironment.replace(/_/g,' ')} environment.`);
    if(answers.studyCommitment) whyParts.push(`Fits your ${answers.studyCommitment.replace(/_/g,' ')} study commitment.`);
    if(exploring) whyParts.push('A solid cluster to investigate while you narrow your direction.');
    // study mismatch warning
    const required=STUDY_COMMITMENT_PENALTY[id]||2;
    const prefMap2={ short_practical:1, three_four:2, long_professional:3, postgrad_research:4, not_sure:2 };
    const pref2=prefMap2[answers.studyCommitment]||2;
    let studyNote='';
    if(pref2===1 && required>=3) studyNote='Note: you preferred a shorter pathway, but this career typically needs a longer professional course.';
    return {
      id, title: career.title, description: career.description, fit, confidence: Math.round(Math.min(95,45+ratio*50)),
      eligibility: elig,
      eligibilityNote: elig==='direct' ? 'Directly accessible from your current stream.' : 'Possible from your stream, but requires an additional pathway — see the education route.',
      whyFits: whyParts.join(' ') || 'A reasonable match for your combined answers.',
      studyNote,
      interestMatch: [specLabel && `Your specific interest: ${specLabel}`].filter(Boolean),
      educationPathway: career.educationRoutes||[],
      entranceExams: [...new Set([...(br?.options?.find(o=>o.value===answers.specificInterest)?.exams||[]), ...(career.entranceExams||[])])],
      keySkills: career.skillsToDevelop||[],
      alternatives: (career.relatedCareers||[]).slice(0,3),
      experienceIdeas: career.experienceIdeas||[],
      isExploratory: exploring && !directIds.has(id),
      realityCheck: getRealityCheck(career, answers),
      roadmap: getRoadmap(career, answers),
    };
  });
}
function getRealityCheck(career, _answers){
  const map={
    doctor: 'Think about this: MBBS is 5.5 years plus internship, NEET is highly competitive, clinical workload is demanding and requires sustained discipline.',
    'biotech-researcher': 'Think about this: research roles often need postgraduate study (M.Sc/PhD) and lab patience; funding and timelines can be long.',
    'software-engineer': 'Think about this: portfolio and continuous learning matter more than a single degree; market is competitive and fast-changing.',
    'mechanical-engineer': 'Think about this: core engineering needs 4-year B.Tech and hands-on workshop aptitude; placements vary by specialisation.',
    'chartered-accountant': 'Think about this: CA needs disciplined self-study over several years and high exam rigour alongside graduation.',
    lawyer: 'Think about this: law needs 5-year integrated LLB plus CLAT, plus strong reading, writing and argumentation stamina.',
    psychologist: 'Think about this: licensed practice requires BA → MA → M.Phil/supervision — a longer training path.',
  };
  return map[career.id] || `Think about this: consider the typical study duration (${(career.educationRoutes||[])[0]||'bachelor’s degree'}), work environment and commitment before choosing.`;
}
function getRoadmap(career, answers){
  const status=answers.educationStatus==='completed_class12' ? 'Completed Class 12' : 'Class 12';
  const exam=(career.entranceExams||[])[0] || (career.educationRoutes||[])[0] || 'Relevant entrance / admission';
  return [status, exam, career.educationRoutes?.[0]||'Undergraduate professional course', 'Internship / practical training', career.title];
}

const normalize = (s) => String(s || '').toLowerCase();

function careerTextFor(career) {
  return normalize(
    [
      career.title,
      career.category,
      career.description,
      ...(career.traits || []),
      ...(career.strengthsAligned || []),
      ...(career.skillsToDevelop || []),
      ...(career.educationRoutes || []),
    ].join(' '),
  );
}

/** Signal score from selected answer values against a career. */
function keywordScore(values, mapping, careerText) {
  let score = 0;
  for (const v of values || []) {
    for (const kw of mapping[v] || []) {
      if (careerText.includes(kw)) score += 1;
    }
  }
  return score;
}

/**
 * Rank careers for a completed questionnaire. Returns at most
 * MAX_RECOMMENDATIONS items, each shaped for the results UI.
 */
export function getRecommendations(answers = {}) {
  const stream = streamOf(answers);
  const interestOpt = getInterestOption(answers);
  const directionOpt = getDirectionOption(answers);
  const exploring = isExploring(answers);

  // Careers explicitly chosen via the interest / direction picks.
  const directIds = new Set([
    ...(interestOpt?.careers || []),
    ...(directionOpt?.careers || []),
  ]);

  const workStyleValues = answers.workStyle || [];
  const strengthValues = answers.strengths || [];
  const priorityKeywords = PRIORITY_SIGNALS[answers.priority] || [];

  const scores = new Map();

  for (const career of careers) {
    const eligibility = ELIGIBILITY[career.id]?.[stream];
    if (eligibility === 'restricted') continue; // never recommend inaccessible paths

    let score = 0;

    // 1. Interest / direction selections — the strongest signal.
    if (directIds.has(career.id)) score += 6;

    // 2. Stream affinity from the catalog (streamAffinity is an id array).
    if ((career.streamAffinity || []).includes(stream)) score += 3;

    // 3–5. Work style, strengths, priorities.
    const cText = careerTextFor(career);
    score += keywordScore(workStyleValues, WORK_STYLE_SIGNALS, cText) * 0.6;
    score += keywordScore(strengthValues, STRENGTH_SIGNALS, cText) * 0.6;
    if (priorityKeywords.some((kw) => cText.includes(kw))) score += 1.2;

    // 6. Small boost for direct pathways so ties break sensibly.
    if (eligibility === 'direct') score += 0.5;

    if (score > 0) scores.set(career.id, score);
  }

  // Exploratory mode: seed cluster careers so students still choosing
  // "Still exploring" get broad clusters, not a forced specialisation.
  if (exploring && scores.size < MAX_RECOMMENDATIONS) {
    for (const cluster of EXPLORATORY_CLUSTERS) {
      for (const id of cluster.careers) {
        const eligibility = ELIGIBILITY[id]?.[stream];
        if (eligibility === 'restricted') continue;
        scores.set(id, (scores.get(id) || 0) + (eligibility === 'direct' ? 1.5 : 1));
      }
    }
  }

  const ranked = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_RECOMMENDATIONS);

  const maxScore = ranked[0]?.[1] || 1;

  return ranked.map(([id, score], index) => {
    const career = careers.find((c) => c.id === id);
    const eligibility = ELIGIBILITY[id]?.[stream] || 'pathway';
    const ratio = score / maxScore;
    const fit =
      index === 0 && ratio >= 0.8 && directIds.has(id)
        ? 'Strong match'
        : ratio >= 0.6
          ? 'Good match'
          : 'Worth exploring';

    const cText = careerTextFor(career);

    return {
      id,
      title: career.title,
      description: career.description,
      fit,
      confidence: Math.round(Math.min(95, 45 + ratio * 50)),
      eligibility,
      eligibilityNote:
        eligibility === 'direct'
          ? 'Directly accessible from your current stream.'
          : 'Possible from your stream, but requires an additional pathway — see the education route.',
      whyFits: buildWhyFits(career, { interestOpt, directionOpt, workStyleValues, exploring }, cText),
      interestMatch: [
        interestOpt && `Your interest in ${interestOpt.label}`,
        directionOpt && `your chosen direction — ${directionOpt.label}`,
      ].filter(Boolean),
      relevantStrengths: strengthValues
        .filter((s) => (STRENGTH_SIGNALS[s] || []).some((kw) => cText.includes(kw)))
        .map((s) => s.replace(/_/g, ' ')),
      educationPathway: career.educationRoutes || [],
      entranceExams: collectExams(interestOpt, directionOpt, career),
      keySkills: career.skillsToDevelop || [],
      alternatives: (career.relatedCareers || []).slice(0, 3),
      experienceIdeas: career.experienceIdeas || [],
      isExploratory: exploring && !directIds.has(id),
    };
  });
}

function buildWhyFits(career, ctx, cText) {
  const parts = [];
  if (ctx.directionOpt) {
    parts.push(`Aligns with the ${ctx.directionOpt.label.toLowerCase()} direction you selected.`);
  } else if (ctx.interestOpt) {
    parts.push(`Connects to your interest in ${ctx.interestOpt.label.toLowerCase()}.`);
  }
  const styleHits = (ctx.workStyleValues || []).filter((v) =>
    (WORK_STYLE_SIGNALS[v] || []).some((kw) => cText.includes(kw)),
  );
  if (styleHits.length) {
    parts.push(`Suits how you like to work (${styleHits.slice(0, 2).map((v) => v.replace(/_/g, ' ')).join(', ')}).`);
  }
  if (ctx.exploring) {
    parts.push('A solid cluster to investigate while you narrow down your direction.');
  }
  if (!parts.length) {
    parts.push('A reasonable match for the combination of stream, interests and preferences you shared.');
  }
  return parts.join(' ');
}

function collectExams(interestOpt, directionOpt, career) {
  return [...new Set([
    ...(interestOpt?.exams || []),
    ...(directionOpt?.exams || []),
    ...(career.entranceExams || []),
  ])];
}

/**
 * Exploratory mode output — clusters, not forced careers.
 * Used when the student kept choosing "Still exploring" / "Not sure yet".
 */
export function getExploratoryClusters(answers = {}) {
  const stream = streamOf(answers);
  return EXPLORATORY_CLUSTERS.map((cluster) => ({
    ...cluster,
    careers: cluster.careers
      .filter((id) => (ELIGIBILITY[id]?.[stream] || 'pathway') !== 'restricted')
      .map((id) => careers.find((c) => c.id === id)?.title || id),
  }));
}

/** Convenience: full result payload for the results page. */
export function buildResults(answers = {}) {
  const isV2 = Boolean(answers.educationStatus || answers.streamV2 || answers.interestArea);
  if (isV2) {
    const exploring = isTwelveExploring(answers);
    return {
      exploring,
      recommendations: getTwelveRecommendations(answers),
      clusters: exploring ? getExploratoryClusters(answers) : [],
    };
  }
  const exploring = isExploring(answers);
  return {
    exploring,
    recommendations: getRecommendations(answers),
    clusters: exploring ? getExploratoryClusters(answers) : [],
  };
}





