/**
 * Central graduation profile resolver — stable IDs, education-level-aware.
 * Preserves all existing degree data; only adds branching logic.
 *
 * This is the SINGLE source of truth for graduation branching.
 * Every question and recommendation must go through resolveGraduationProfile / isRelevantOption.
 */
import graduationDegrees, { getDegreeProfile } from './graduationDegreeConfig.js';

function normalizeId(str) {
  return String(str || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

// Masters-indicating target levels (stable ids)
const MASTERS_TARGETS = new Set(['higher_studies','specialize','research','masters','postgraduate','pg','m_tech','mba','mca','md_ms','m_sc','masters_pg','post_graduate']);

function isMastersTargetLevel(target) {
  const t = normalizeId(target);
  return MASTERS_TARGETS.has(t);
}

// Bachelor keywords — any option containing these is a bachelor-level course
const BACHELOR_KEYWORDS = ['b.pharm','b pharm','b.sc','bsc','bds','bba','bca','b.tech','btech','b.e.','b e ','bachelor','mbbs','nursing','pharm','b.com','bcom','b.a.','ba ','b.ed','b.arch','b.des','bfa'];

/**
 * Resolve full graduation profile from stable IDs + previous answers.
 *
 * Stores explicit:
 *   educationLevel: 'graduation'
 *   currentDegree (label + degreeId stable)
 *   specialization (label + specializationId stable)
 *   targetLevel (masters | bachelor | exploring)
 *   family, profile, interests, skills, etc.
 */
export function resolveGraduationProfile({ degreeId, specializationId, targetLevel, previousAnswers, interests, skills } = {}) {
  const degreeLabel = degreeId || previousAnswers?.currentDegree || previousAnswers?.degree || '';
  const specLabel = specializationId || previousAnswers?.specialization || degreeLabel;
  // targetLevel resolution: explicit param > previousAnswers.targetLevel > direction > targetLevel > educationLevel hint
  const rawTarget = targetLevel
    || previousAnswers?.targetLevel
    || previousAnswers?.intendedNextLevel
    || previousAnswers?.direction
    || previousAnswers?.educationLevelTarget
    || '';
  const target = normalizeId(rawTarget);
  const profile = degreeLabel ? getDegreeProfile(degreeLabel, specLabel) : null;

  const degreeEntry = graduationDegrees.find(d => d.label === degreeLabel) || null;
  const family = degreeEntry?.family || profile?.family || '';

  const degreeIdStable = normalizeId(degreeLabel);
  const specIdStable = normalizeId(specLabel);

  const isMastersTarget = isMastersTargetLevel(target) || isMastersTargetLevel(rawTarget);

  // Determine effective targetLevel stable value
  let effectiveTarget = 'bachelor';
  if (!rawTarget || rawTarget === 'still_exploring' || target === 'still_exploring') effectiveTarget = 'exploring';
  else if (isMastersTarget) effectiveTarget = 'masters';
  else if (target) effectiveTarget = target;

  const eligibleNext = [];
  if (profile?.careers) {
    const levelTag = effectiveTarget === 'masters' ? 'masters' : 'bachelor';
    eligibleNext.push(...profile.careers.map(c => ({ value: c.value, label: c.label, level: levelTag })));
  }

  // Build interests/skills/careers filtered to this degree
  const interestsList = interests || previousAnswers?.interests || [];
  const skillsList = skills || previousAnswers?.skills || [];

  return {
    educationLevel: 'graduation',
    degreeLabel,
    specializationLabel: specLabel,
    currentDegree: degreeLabel,
    specialization: specLabel,
    degreeId: degreeIdStable,
    specializationId: specIdStable,
    targetLevel: effectiveTarget,
    intendedNextLevel: effectiveTarget,
    isMastersTarget,
    family,
    profile,
    eligibleNext,
    interests: interestsList,
    skills: skillsList,
    careerPreferences: previousAnswers?.careerPreferences || previousAnswers?.career || [],
    relevantSkillGroups: profile?.skills ? Object.keys(profile.skills) : [],
    relevantCareerValues: profile?.careers ? profile.careers.map(c => c.value) : [],
    relevantInterests: profile?.interests ? profile.interests.map(i => i.value) : [],
  };
}

/**
 * Detect if a cross-disciplinary option is explicitly triggered by student's interests.
 * Cross only allowed when interests explicitly contain target family keywords.
 */
export function isCrossDisciplinaryTriggered({ interests, targetFamily }) {
  if (!interests || !targetFamily) return false;
  const interestText = (Array.isArray(interests) ? interests.join(' ') : String(interests)).toLowerCase();
  const familyKeywords = {
    'medicine & healthcare': ['medical','clinical','patient','healthcare','medicine','nursing','pharm'],
    'engineering': ['engineering','mechanical','civil','electrical','electronics','aerospace'],
    'computer applications': ['software','programming','computing','computer','technology','data','ai','cybersecurity','cloud'],
    'commerce & finance': ['finance','accounting','commerce','investment','banking','tax'],
    'business & management': ['business','management','marketing','entrepreneur','operations','analytics'],
    'science': ['science','research','physics','chemistry','biology','biotechnology'],
    'arts & humanities': ['arts','humanities','psychology','literature','history','journalism'],
    'law': ['law','legal'],
    'design & creative': ['design','creative','fashion','animation','visual'],
    'agriculture & environment': ['agriculture','farming','environment','horticulture','forestry'],
    'education': ['teaching','education'],
  };
  const keywords = familyKeywords[String(targetFamily).toLowerCase()] || [String(targetFamily).toLowerCase().split(' ')[0]];
  return keywords.some(k => interestText.includes(k));
}

export function isRelevantOption({ currentDegree, specialization, currentLevel, targetLevel, option, interests } = {}) {
  if (!option) return false;
  const degree = String(currentDegree || '').toLowerCase();
  const target = normalizeId(targetLevel || currentLevel || '');
  const optLabel = String(option.label || option.value || option.title || option.name || '').toLowerCase();
  const optFamily = String(option.family || option.category || '').toLowerCase();
  const optValue = String(option.value || option.id || '').toLowerCase();

  const wantsMasters = isMastersTargetLevel(target);
  const isBachelorOpt = BACHELOR_KEYWORDS.some(k => optLabel.includes(k) || optValue.includes(k.replace(/[^a-z0-9]/g,'')));

  // RULE: If target is masters, filter out ALL bachelor-level degree options
  // regardless of family — postgraduate pathway must not show Nursing, B.Pharm, MBBS, B.Sc etc.
  if (wantsMasters && isBachelorOpt) {
    // Even the same degree as current (e.g., MBBS student seeing MBBS again) is irrelevant for masters
    return false;
  }

  // RULE: If target is masters and option is clearly a different family's bachelor course, filter
  // e.g., BBA masters shouldn't see engineering bachelor options
  if (wantsMasters && optFamily) {
    const curEntry = graduationDegrees.find(d => d.label === currentDegree);
    const curFamily = (curEntry?.family || '').toLowerCase();
    if (curFamily && optFamily !== curFamily) {
      // Allow cross only if explicitly triggered
      if (!isCrossDisciplinaryTriggered({ interests, targetFamily: optFamily })) {
        return false;
      }
    }
  }

  // RULE: Degree-family specific filters for masters pathway
  if (wantsMasters) {
    // MBBS masters → only postgraduate medical specialization interests
    if (degree.includes('mbbs')) {
      const medicalMastersKeywords = ['md','ms','specialization','postgraduate','masters','clinical','surgery','internal medicine','pediatrics','radiology','dermatology','psychiatry','anesthesiology','emergency','public health','research','healthcare admin'];
      const crossBachelorKeywords = ['nursing','b.pharm','b.sc','bsc','bds','bpt','bot','pharm.d'];
      if (crossBachelorKeywords.some(k => optLabel.includes(k))) return false;
    }
    // BBA masters → not medical/nursing/engineering bachelor
    if (degree.includes('bba')) {
      if (['nursing','b.pharm','pharm','mbbs','b.sc medical','btech','engineering','bds'].some(k => optLabel.includes(k))) return false;
    }
    // BCA masters → not medical/commerce bachelor
    if (degree.includes('bca') || degree.includes('computer')) {
      if (['nursing','b.pharm','mbbs','b.com','bcom','medical'].some(k => optLabel.includes(k))) return false;
    }
    // B.Tech masters → not medical
    if (degree.includes('b.tech') || degree.includes('btech') || degree.includes('engineering')) {
      if (['nursing','b.pharm','mbbs','bds'].some(k => optLabel.includes(k))) return false;
    }
  }

  // RULE: General degree mismatch without explicit cross interest
  // If option has a clear family mismatch and no cross trigger, filter for any target
  if (degree && optFamily) {
    const curEntry = graduationDegrees.find(d => d.label === currentDegree);
    const curFamily = (curEntry?.family || '').toLowerCase();
    if (curFamily && optFamily && optFamily !== curFamily) {
      // For non-masters, still filter unless explicitly triggered — but be less strict for exploring
      if (target !== 'exploring' && target !== 'still_exploring') {
        if (!isCrossDisciplinaryTriggered({ interests, targetFamily: optFamily })) {
          // For bachelor-target (start_working etc), mismatched bachelor family is also irrelevant
          return false;
        }
      }
    }
  }

  return true;
}

export function filterOptionsForGraduation({ currentDegree, specialization, targetLevel, interests }, options) {
  if (!Array.isArray(options)) return options;
  return options.filter(opt => isRelevantOption({ currentDegree, specialization, targetLevel, option, interests }));
}

/**
 * Dependency-aware state reset: clearing only fields that depend on changed value.
 * Changing BBA→BCA invalidates BBA specialization/interests/skills but NOT name/location.
 */
export function getDependentFieldsToClear(changedField) {
  const deps = {
    family: ['degree','specialization','interests','skills','direction','targetLevel'],
    degree: ['specialization','interests','skills','direction','targetLevel'],
    specialization: ['interests','skills','direction'],
    interests: ['skills','direction'],
    skills: ['direction'],
    direction: [],
    targetLevel: [],
  };
  return deps[changedField] || [];
}

export function clearDependentFields(answers, changedField) {
  const toClear = getDependentFieldsToClear(changedField);
  const next = { ...answers };
  toClear.forEach(k => delete next[k]);
  return next;
}
