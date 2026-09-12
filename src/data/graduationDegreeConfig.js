/**
 * Graduation Degree Configuration
 *
 * Two-step Q1 flow:
 *   Step 1 → User selects a degree (e.g. "B.Tech / B.E.")
 *   Step 2 → User selects a specialization (e.g. "Computer Science & Engineering")
 *
 * Each entry maps a degree label to its specializations and the profileId
 * used to look up interests/skills/experience/careers from degreeProfiles.js.
 *
 * Degrees WITHOUT specializations (e.g. MBBS) skip step 2 entirely —
 * the specialization is auto-set to the degree label itself.
 */

import { degreeProfiles } from './degreeProfiles.js';

const graduationDegrees = [
  // ─── MEDICINE & HEALTHCARE ───────────────────────────────────
  {
    label: 'MBBS',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'mbbs',
  },
  {
    label: 'BDS',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bds',
  },
  {
    label: 'BAMS',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bams',
  },
  {
    label: 'BHMS',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bhms',
  },
  {
    label: 'BUMS',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bums',
  },
  {
    label: 'BSMS',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsms',
  },
  {
    label: 'BNYS',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bnys',
  },
  {
    label: 'B.Sc Nursing',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsc_nursing',
  },
  {
    label: 'BPT / Physiotherapy',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bpt',
  },
  {
    label: 'BOT / Occupational Therapy',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bot',
  },
  {
    label: 'B.Pharm',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bpharm',
  },
  {
    label: 'Pharm.D',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'pharmd',
  },
  {
    label: 'B.Sc Medical Laboratory Technology',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsc_medical_lab',
  },
  {
    label: 'B.Sc Radiology / Medical Imaging',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsc_radiology',
  },
  {
    label: 'B.Sc Optometry',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsc_optometry',
  },
  {
    label: 'B.Sc Cardiac Care Technology',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsc_cardiac',
  },
  {
    label: 'B.Sc Anaesthesia Technology',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsc_anaesthesia',
  },
  {
    label: 'B.Sc Operation Theatre Technology',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsc_ot_technology',
  },
  {
    label: 'B.Sc Respiratory Therapy',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsc_respiratory',
  },
  {
    label: 'B.Sc Dialysis Technology',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsc_dialysis',
  },
  {
    label: 'B.Sc Emergency / Trauma Care',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'bsc_emergency',
  },
  {
    label: 'Other Healthcare Degree',
    family: 'Medicine & Healthcare',
    specializations: [],
    profileId: 'other_healthcare',
  },

  // ─── ENGINEERING ─────────────────────────────────────────────
  {
    label: 'B.Tech / B.E.',
    family: 'Engineering',
    specializations: [
      'Computer Science & Engineering',
      'Artificial Intelligence / Machine Learning',
      'Data Science',
      'Information Technology',
      'Cybersecurity',
      'Electronics & Communication',
      'Electrical / EEE',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Biotechnology',
      'Aerospace / Aeronautical',
      'Automobile Engineering',
      'Mechatronics',
      'Robotics',
      'Environmental Engineering',
    ],
    profileMap: {
      'Computer Science & Engineering': 'btech_cse',
      'Artificial Intelligence / Machine Learning': 'btech_ai',
      'Data Science': 'btech_data_science',
      'Information Technology': 'btech_it',
      'Cybersecurity': 'btech_cybersecurity',
      'Electronics & Communication': 'btech_ece',
      'Electrical / EEE': 'btech_electrical',
      'Mechanical Engineering': 'btech_mechanical',
      'Civil Engineering': 'btech_civil',
      'Chemical Engineering': 'btech_chemical',
      'Biotechnology': 'btech_biotech',
      'Aerospace / Aeronautical': 'btech_aerospace',
      'Automobile Engineering': 'btech_automobile',
      'Mechatronics': 'btech_mechatronics',
      'Robotics': 'btech_robotics',
      'Environmental Engineering': 'btech_environmental',
    },
  },

  // ─── COMPUTER APPLICATIONS ───────────────────────────────────
  {
    label: 'BCA',
    family: 'Computer Applications',
    specializations: [],
    profileId: 'bca',
  },
  {
    label: 'B.Sc Computer Science',
    family: 'Computer Applications',
    specializations: [],
    profileId: 'bsc_cs',
  },
  {
    label: 'B.Sc Information Technology',
    family: 'Computer Applications',
    specializations: [],
    profileId: 'bsc_it',
  },
  {
    label: 'B.Sc Data Science',
    family: 'Computer Applications',
    specializations: [],
    profileId: 'bsc_data_science',
  },
  {
    label: 'B.Sc Artificial Intelligence',
    family: 'Computer Applications',
    specializations: [],
    profileId: 'bsc_ai',
  },
  {
    label: 'B.Sc Cybersecurity',
    family: 'Computer Applications',
    specializations: [],
    profileId: 'bsc_cybersecurity',
  },
  {
    label: 'B.Sc Computer Applications',
    family: 'Computer Applications',
    specializations: [],
    profileId: 'bsc_computer_apps',
  },
  {
    label: 'Other Computing Degree',
    family: 'Computer Applications',
    specializations: [],
    profileId: 'other_computing',
  },

  // ─── COMMERCE & FINANCE ──────────────────────────────────────
  {
    label: 'B.Com',
    family: 'Commerce & Finance',
    specializations: [
      'General',
      'Honours',
      'Finance',
      'Business Analytics',
      'Computer Applications',
      'Banking & Finance',
      'Taxation',
      'Accounting',
    ],
    profileMap: {
      General: 'bcom_general',
      Honours: 'bcom_honours',
      Finance: 'bcom_finance',
      'Business Analytics': 'bcom_business_analytics',
      'Computer Applications': 'bcom_computer_apps',
      'Banking & Finance': 'bcom_banking',
      Taxation: 'bcom_taxation',
      Accounting: 'bcom_accounting',
    },
  },

  // ─── BUSINESS & MANAGEMENT ───────────────────────────────────
  {
    label: 'BBA',
    family: 'Business & Management',
    specializations: [
      'General',
      'Finance',
      'Marketing',
      'Human Resources',
      'Business Analytics',
      'Entrepreneurship',
      'International Business',
      'Operations',
      'Logistics',
      'Healthcare Management',
      'E-Commerce',
    ],
    profileMap: {
      General: 'bba',
      Finance: 'bba_finance',
      Marketing: 'bba_marketing',
      'Human Resources': 'bba_hr',
      'Business Analytics': 'bba_analytics',
      Entrepreneurship: 'bba_entrepreneurship',
      'International Business': 'bba_ib',
      Operations: 'bba_operations',
      Logistics: 'bba_logistics',
      'Healthcare Management': 'bba_healthcare',
      'E-Commerce': 'bba_ecommerce',
    },
  },

  // ─── SCIENCE ─────────────────────────────────────────────────
  {
    label: 'B.Sc',
    family: 'Science',
    specializations: [
      'Mathematics',
      'Physics',
      'Chemistry',
      'Statistics',
      'Biology',
      'Biotechnology',
      'Microbiology',
      'Biochemistry',
      'Botany',
      'Zoology',
      'Environmental Science',
      'Forensic Science',
      'Geology',
      'Food Science',
    ],
    profileMap: {
      Mathematics: 'bsc_maths',
      Physics: 'bsc_physics',
      Chemistry: 'bsc_chemistry',
      Statistics: 'bsc_statistics',
      Biology: 'bsc_biology',
      Biotechnology: 'bsc_biotech_science',
      Microbiology: 'bsc_microbiology',
      Biochemistry: 'bsc_biochemistry',
      Botany: 'bsc_botany',
      Zoology: 'bsc_zoology',
      'Environmental Science': 'bsc_env_science',
      'Forensic Science': 'bsc_forensic',
      Geology: 'bsc_geology',
      'Food Science': 'bsc_food_science',
    },
  },

  // ─── ARTS & HUMANITIES ───────────────────────────────────────
  {
    label: 'BA',
    family: 'Arts & Humanities',
    specializations: [
      'Economics',
      'Psychology',
      'Political Science',
      'Sociology',
      'History',
      'English',
      'Journalism',
      'Mass Communication',
      'Public Administration',
      'Philosophy',
      'Geography',
      'Languages',
    ],
    profileMap: {
      Economics: 'ba_economics',
      Psychology: 'ba_psychology',
      'Political Science': 'ba_political_science',
      Sociology: 'ba_sociology',
      History: 'ba_history',
      English: 'ba_english',
      Journalism: 'ba_journalism',
      'Mass Communication': 'ba_mass_comm',
      'Public Administration': 'ba_public_admin',
      Philosophy: 'ba_philosophy',
      Geography: 'ba_geography',
      Languages: 'ba_languages',
    },
  },

  // ─── LAW ─────────────────────────────────────────────────────
  {
    label: 'Law',
    family: 'Law',
    specializations: [
      'LLB',
      'BA LLB',
      'BBA LLB',
      'B.Com LLB',
      'B.Sc LLB',
    ],
    profileMap: {
      LLB: 'llb',
      'BA LLB': 'ba_llb',
      'BBA LLB': 'bba_llb',
      'B.Com LLB': 'bcom_llb',
      'B.Sc LLB': 'bsc_llb',
    },
  },

  // ─── DESIGN & CREATIVE ──────────────────────────────────────
  {
    label: 'Design / Creative',
    family: 'Design & Creative',
    specializations: [
      'B.Des',
      'BFA',
      'Fashion Design',
      'Interior Design',
      'Graphic Design',
      'Animation',
      'Visual Communication',
      'Film / Media',
      'Photography',
      'UX / UI Design',
    ],
    profileMap: {
      'B.Des': 'bdes',
      BFA: 'bfa',
      'Fashion Design': 'fashion_design',
      'Interior Design': 'interior_design',
      'Graphic Design': 'graphic_design',
      Animation: 'animation',
      'Visual Communication': 'visual_comm',
      'Film / Media': 'film_media',
      Photography: 'photography',
      'UX / UI Design': 'ux_ui',
    },
  },

  // ─── AGRICULTURE & ENVIRONMENT ──────────────────────────────
  {
    label: 'Agriculture / Environment',
    family: 'Agriculture & Environment',
    specializations: [
      'B.Sc Agriculture',
      'Horticulture',
      'Forestry',
      'Agricultural Engineering',
      'Food Technology',
      'Dairy Technology',
      'Fisheries',
      'Environmental Science',
    ],
    profileMap: {
      'B.Sc Agriculture': 'bsc_agriculture',
      Horticulture: 'horticulture',
      Forestry: 'forestry',
      'Agricultural Engineering': 'agri_engineering',
      'Food Technology': 'food_technology',
      'Dairy Technology': 'dairy_technology',
      Fisheries: 'fisheries',
      'Environmental Science': 'bsc_env_science_agg',
    },
  },

  // ─── EDUCATION ───────────────────────────────────────────────
  {
    label: 'Education',
    family: 'Education',
    specializations: [
      'B.Ed',
      'BA B.Ed',
      'B.Sc B.Ed',
      'B.El.Ed',
      'Special Education',
    ],
    profileMap: {
      'B.Ed': 'bed',
      'BA B.Ed': 'ba_bed',
      'B.Sc B.Ed': 'bsc_bed',
      'B.El.Ed': 'beled',
      'Special Education': 'special_education',
    },
  },

  // ─── OTHER PROFESSIONAL ─────────────────────────────────────
  {
    label: 'Hotel Management',
    family: 'Other Professional Programs',
    specializations: [],
    profileId: 'hotel_management',
  },
  {
    label: 'Hospitality',
    family: 'Other Professional Programs',
    specializations: [],
    profileId: 'hospitality',
  },
  {
    label: 'Tourism',
    family: 'Other Professional Programs',
    specializations: [],
    profileId: 'tourism',
  },
  {
    label: 'Aviation',
    family: 'Other Professional Programs',
    specializations: [],
    profileId: 'aviation',
  },
  {
    label: 'Logistics',
    family: 'Other Professional Programs',
    specializations: [],
    profileId: 'logistics',
  },
  {
    label: 'Event Management',
    family: 'Other Professional Programs',
    specializations: [],
    profileId: 'event_management',
  },
  {
    label: 'Other',
    family: 'Other Professional Programs',
    specializations: [],
    profileId: 'other',
  },
];

/**
 * Family → fallback profile used when an exact or degree-level profile
 * cannot be resolved (resolution priority level 3).
 */
const familyFallbacks = {
  'Medicine & Healthcare': 'other_healthcare',
  'Engineering': 'other_engineering',
  'Computer Applications': 'other_computing',
  'Commerce & Finance': 'other_commerce',
  'Business & Management': 'other_management',
  'Science': 'other_science',
  'Arts & Humanities': 'other_humanities',
  'Law': 'other_law',
  'Design & Creative': 'other_creative',
  'Agriculture & Environment': 'other_agriculture',
  'Education': 'other_education',
  'Other Professional Programs': 'other',
};

const GENERAL_FALLBACK_PROFILE = 'other';

function getDegreeEntry(degreeLabel) {
  return graduationDegrees.find((d) => d.label === degreeLabel) || null;
}

/**
 * CENTRAL PROFILE ENGINE — the single lookup every question and the result
 * engine must use.
 *
 * Resolution priority:
 *   1. Exact degree + specialization profile
 *   2. Degree-level profile (degrees without specializations)
 *   3. Family-level profile
 *   4. Other/general profile
 *
 * Returns { id, family, label, interests, skills, experiences, careers,
 * requiredSkills } or null if even the general fallback is missing.
 */
export function getDegreeProfile(currentDegree, specialization) {
  const degree = getDegreeEntry(currentDegree);
  if (!degree) {
    console.warn('Missing profile:', currentDegree, specialization);
    const general = degreeProfiles[GENERAL_FALLBACK_PROFILE];
    return general ? { ...general, id: GENERAL_FALLBACK_PROFILE, label: currentDegree || general.label } : null;
  }

  let resolvedId = null;
  let profile = null;

  // Level 1: exact degree + specialization
  if (
    degree.specializations &&
    degree.specializations.length > 0 &&
    specialization &&
    degree.profileMap &&
    degree.profileMap[specialization]
  ) {
    resolvedId = degree.profileMap[specialization];
    profile = degreeProfiles[resolvedId] || null;
  }

  // Level 2: degree-level profile (no specializations — MBBS, BCA, etc.)
  if (!profile && (!degree.specializations || degree.specializations.length === 0)) {
    resolvedId = degree.profileId || null;
    profile = resolvedId ? degreeProfiles[resolvedId] || null : null;
  }

  if (!profile) {
    console.warn(
      'Missing profile:',
      currentDegree,
      specialization,
      '— falling back to family profile',
    );

    // Level 3: family-level fallback
    const familyFallbackId = familyFallbacks[degree.family];
    if (familyFallbackId && degreeProfiles[familyFallbackId]) {
      resolvedId = familyFallbackId;
      profile = degreeProfiles[familyFallbackId];
    } else {
      // Level 4: general fallback
      resolvedId = GENERAL_FALLBACK_PROFILE;
      profile = degreeProfiles[GENERAL_FALLBACK_PROFILE] || null;
    }
  }

  if (!profile) return null;

  return {
    ...profile,
    id: resolvedId,
    // Shared/alias profiles carry the base degree's label — always surface
    // the student's actual specialization/degree instead.
    label:
      specialization && specialization !== currentDegree
        ? specialization
        : currentDegree || profile.label,
  };
}

/**
 * Resolve the profileId from a degree label + optional specialization.
 *
 * Kept for backwards compatibility — new code should use getDegreeProfile().
 */
export function resolveProfileId(degreeLabel, specialization) {
  const degree = getDegreeEntry(degreeLabel);
  if (!degree) return null;

  if (!degree.specializations || degree.specializations.length === 0) {
    return degree.profileId || null;
  }

  if (!specialization) return null;
  if (degree.profileMap && degree.profileMap[specialization]) {
    return degree.profileMap[specialization];
  }
  return null;
}

/**
 * Get the specialization options for a given degree label.
 * Returns [] if the degree has no specializations.
 */
export function getSpecializations(degreeLabel) {
  const degree = getDegreeEntry(degreeLabel);
  if (!degree) return [];
  return (degree.specializations || []).map((s) => ({ value: s, label: s }));
}

/**
 * DEV VALIDATION — checks every visible degree path resolves to a complete
 * profile. Returns a list of problem strings (empty = healthy).
 */
export function validateGraduationProfiles() {
  const problems = [];

  for (const degree of graduationDegrees) {
    if (!degree.label) {
      problems.push('Degree entry without a label');
      continue;
    }
    if (!degree.family || !familyFallbacks[degree.family]) {
      problems.push(`${degree.label}: missing/unknown family "${degree.family}"`);
    }

    if (!degree.specializations || degree.specializations.length === 0) {
      if (!degree.profileId) {
        problems.push(`${degree.label}: no profileId`);
        continue;
      }
      problems.push(
        ...validateProfile(degree.profileId, `${degree.label} (${degree.profileId})`),
      );
    } else {
      for (const spec of degree.specializations) {
        const pid = degree.profileMap && degree.profileMap[spec];
        if (!pid) {
          problems.push(`${degree.label} / ${spec}: not mapped in profileMap`);
          continue;
        }
        problems.push(...validateProfile(pid, `${degree.label} / ${spec} (${pid})`));
      }
    }
  }

  return problems;
}

/**
 * DEV VALIDATION — verifies one profile id resolves through
 * getDegreeProfile and carries interests, skills, experiences and careers.
 *
 * Usage: validateProfile('bcom_finance'); validateProfile('cse'); etc.
 */
function validateProfile(profileId, labelOverride = null) {
  const profile = profileId ? degreeProfiles[profileId] : null;
  if (!profile) return [`Missing profile: ${profileId}`];

  const label =
    labelOverride ||
    `${profile.family || '?'} — ${profile.label || profileId}`;
  const problems = [];

  if (!profile.interests || profile.interests.length === 0) problems.push(`${label}: no interests (Q2 broken)`);
  if (!profile.skills || Object.keys(profile.skills).length === 0) problems.push(`${label}: no skills (Q3 broken)`);
  else if (
    Object.values(profile.skills).some((g) => !Array.isArray(g) || g.length === 0)
  ) {
    problems.push(`${label}: empty skill group`);
  }
  if (!profile.experiences || profile.experiences.length === 0) problems.push(`${label}: no experiences (Q4 broken)`);
  if (!profile.careers || profile.careers.length === 0) problems.push(`${label}: no careers (Q5 broken)`);

  for (const career of profile.careers || []) {
    if (!career.value || !career.label) problems.push(`${label}: malformed career entry`);
    else if (!profile.requiredSkills || !profile.requiredSkills[career.value]) {
      problems.push(`${label}: career "${career.value}" has no requiredSkills`);
    }
  }

  return problems;
}

export default graduationDegrees;
