import { COUNTRIES, FIELD_MATRIX, annualCostINR, FX } from './studyAbroad.js';

const WEIGHTS = {
  academic: 0.20,
  course: 0.20,
  budget: 0.20,
  career: 0.15,
  postStudy: 0.10,
  language: 0.05,
  university: 0.05,
  risk: 0.05,
};

/**
 * Transparent scoring — not random. Every penalty is explainable.
 * Returns ranked countries with NAVORA Fit Score + breakdown + why/whyNot.
 */
export function rankCountries(profile) {
  const { studyLevel, goal, budgetId, priorities = [], language, budgetMaxINR } = profile;

  return COUNTRIES.map((c) => {
    let scores = {};
    let penalties = [];
    let reasons = [];
    let concerns = [];

    // Course fit: from FIELD_MATRIX
    const affinity = (FIELD_MATRIX[goal] && FIELD_MATRIX[goal][c.id]) ?? 5;
    scores.course = (affinity / 10) * 100;
    if (affinity >= 8) reasons.push(`Strong ${goal} ecosystem`);
    if (c.studyStrengths.some(s => goal && s.toLowerCase().includes(goal.split('/')[0].trim().toLowerCase().slice(0,4)))) reasons.push(c.studyStrengths[0]);

    // Academic fit — simplified: graduate-level countries with strong reputation get boost for Masters/MBA/PhD
    let academic = 70;
    if (studyLevel === "Master's" || studyLevel === 'MBA / Management' || studyLevel === 'PhD / Research') {
      if (['usa','uk','germany','netherlands','sweden'].includes(c.id)) academic = 85;
    }
    if (studyLevel === "Bachelor's" && ['usa','uk','canada','australia'].includes(c.id)) academic = 82;
    if (goal === 'Medicine' && ['germany','france','spain','poland','latvia'].includes(c.id)) {
      concerns.push('Medicine requires licensing & language checks — verify recognition in your practice country');
      academic -= 10;
    }
    scores.academic = Math.max(0, Math.min(100, academic));

    // Budget fit — core penalty logic
    const annualINR = annualCostINR(c);
    const max = budgetMaxINR;
    if (max != null && isFinite(max)) {
      const ratio = annualINR / max;
      if (ratio <= 0.75) { scores.budget = 95; reasons.push('Comfortably within stated budget'); }
      else if (ratio <= 1.0) { scores.budget = 80; reasons.push('Within stated budget (tight)'); }
      else if (ratio <= 1.35) { scores.budget = 55; concerns.push(`Annual cost ~₹${(annualINR/100000).toFixed(1)}L may exceed your ₹${(max/100000).toFixed(0)}L budget`); penalties.push('budget overrun'); }
      else { scores.budget = 30; concerns.push(`Total cost likely exceeds budget by >35% — funding gap risk`); penalties.push('high budget risk'); }
      // Germany/Belgium/Poland/Latvia/Spain bonus for budget-conscious
      if (max <= 2500000 && ['germany','poland','latvia','spain','italy','belgium'].includes(c.id)) scores.budget = Math.min(95, scores.budget + 15);
      // USA/UK/Australia penalty for low budget
      if (max <= 2500000 && ['usa','uk','australia'].includes(c.id)) { scores.budget = Math.max(20, scores.budget - 20); }
    } else {
      scores.budget = 65; // unsure
    }

    // Career fit
    const careerHit = c.careerStrengths.includes(goal) || c.careerStrengths.some(s => goal && s.toLowerCase().includes(goal.toLowerCase().slice(0,4)));
    scores.career = careerHit ? 88 : (affinity >= 7 ? 75 : 60);
    if (careerHit) reasons.push(`Relevant employers in ${goal}`);

    // Post-study
    const postMap = { usa:75, uk:80, canada:85, australia:78, germany:82, netherlands:80, ireland:82, sweden:70, norway:65, france:68, italy:60, belgium:70, spain:62, poland:60, latvia:55 };
    scores.postStudy = postMap[c.id] ?? 65;
    if (priorities.includes('post-study') || priorities.includes('immigration')) {
      if (scores.postStudy < 70) concerns.push('Post-study route shorter / more restricted than your priority suggests');
    }

    // Language
    const englishOnly = language === 'english-only';
    const needsLocal = ['germany','france','spain','italy','poland','latvia','norway','belgium'].includes(c.id);
    if (englishOnly && needsLocal) { scores.language = 50; concerns.push('Local language may matter for employment'); }
    else if (language === 'comfortable' && needsLocal) { scores.language = 85; reasons.push('You are open to learning the local language — strong advantage here'); }
    else scores.language = 85;

    // University fit (proxy by reputation breadth)
    const uniCount = { usa:10, uk:10, germany:9, canada:8, australia:8, netherlands:8, france:7, italy:7, sweden:7, ireland:7 }[c.id] || 6;
    scores.university = uniCount * 9;

    // Risk adjustment
    let risk = 75;
    if (penalties.includes('high budget risk')) risk -= 25;
    if (concerns.length >= 2) risk -= 10;
    if (goal === 'Medicine') risk -= 10;
    scores.risk = Math.max(20, risk);

    // Weighted total
    const total =
      scores.academic * WEIGHTS.academic +
      scores.course * WEIGHTS.course +
      scores.budget * WEIGHTS.budget +
      scores.career * WEIGHTS.career +
      scores.postStudy * WEIGHTS.postStudy +
      scores.language * WEIGHTS.language +
      scores.university * WEIGHTS.university +
      scores.risk * WEIGHTS.risk;

    const fit = Math.round(Math.max(22, Math.min(97, total)));

    // Category
    let category = 'ALTERNATIVE OPTION';
    // will be assigned after sorting

    return {
      country: c,
      fit,
      scores,
      reasons: [...new Set(reasons)].slice(0,3),
      concerns: [...new Set(concerns)].slice(0,2),
      annualINR,
    };
  })
  .sort((a,b) => b.fit - a.fit)
  .map((r, idx, arr) => {
    // Assign categories by rank + fit gaps
    if (idx === 0) r.category = 'BEST OVERALL FIT';
    else if (idx === 1) {
      // best value = highest budget score among top 5
      const top5 = arr.slice(0,5);
      const bestValue = [...top5].sort((a,b)=>b.scores.budget - a.scores.budget)[0];
      r.category = r.country.id === bestValue.country.id ? 'BEST VALUE' : 'BEST CAREER FIT';
    }
    else if (idx === 2) r.category = 'BEST CAREER FIT';
    else if (r.fit >= 72) r.category = 'ALTERNATIVE OPTION';
    else r.category = 'AMBITIOUS OPTION';
    // Fix duplicate BEST VALUE — ensure only one
    return r;
  })
  // ensure exactly one BEST VALUE (highest budget score in top 4 not already best overall)
  .map((r,i,arr)=>{
    const bestOverallId = arr[0].country.id;
    if(r.category==='BEST VALUE' && r.country.id===bestOverallId){
      // shift BEST VALUE to next best budget in top4
      const candidate = arr.slice(1,5).sort((a,b)=>b.scores.budget-a.scores.budget)[0];
      if(candidate) candidate.category='BEST VALUE';
      r.category='BEST OVERALL FIT';
    }
    return r;
  });
}

export function getBudgetMax(budgetId){
  const m = { under15:1500000, '15-25':2500000, '25-40':4000000, '40-60':6000000, '60-100':10000000, above100:15000000, scholarship:2000000, unsure:null };
  return m[budgetId] ?? null;
}

export { WEIGHTS };
