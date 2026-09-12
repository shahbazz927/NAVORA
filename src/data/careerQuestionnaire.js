/**
 * NAVORA — Class 12 career recommendation questionnaire config.
 *
 * Data-driven, fully conditional architecture:
 *
 *   stream → interest → conditional career direction → work style
 *     → strengths → priority → eligibility → recommendation
 *
 * The selected stream (step 1) gates the interest options (step 2).
 * Each broad interest may declare a `followUp` branch — the direction
 * question (step 3) is only rendered when the chosen interest has one,
 * so a specific interest (e.g. Dentistry) never gets a redundant follow-up.
 * Branches carry recommendation signals (`careers`, `exams`) consumed by
 * src/data/class12Recommendations.js.
 *
 * Adding a new stream or branch = adding data here. No engine changes.
 */

export const MAX_MULTI = 3;

/** Normalise school-specific stream naming to internal ids. */
const STREAM_ALIASES = {
  mpc: 'mpc',
  maths_physics_chemistry: 'mpc',
  bipc: 'bipc',
  biology_physics_chemistry: 'bipc',
  pcb: 'bipc',
  cec: 'cec',
  mec: 'mec',
  commerce: 'commerce',
  arts: 'arts',
  humanities: 'arts',
  diploma: 'diploma',
  polytechnic: 'diploma',
  iti: 'iti',
  vocational: 'iti',
  other: 'not_sure',
  not_sure: 'not_sure',
};

export function normalizeStream(raw) {
  const key = String(raw || '').toLowerCase().trim().replace(/[\s-]+/g, '_');
  return STREAM_ALIASES[key] || null;
}

// ── Shared option vocabulary ──────────────────────────────
const o = (value, label, emoji, extra = {}) => ({ value, label, emoji, ...extra });
const NOT_SURE = o('not_sure', 'Not sure yet', '🤔');
const EXPLORING = () => o('still_exploring', 'Still exploring', '🧭', { exploratory: true });

// ── Reusable direction branches (shared across streams) ───
const LAW_BRANCH = {
  title: 'What kind of legal or public-service career interests you?',
  support: 'Law opens very different doors depending on the route you picture yourself in.',
  options: [
    o('legal_practice', 'Legal Practice', '⚖️', { careers: ['lawyer'], exams: ['CLAT', 'AILET', 'SLAT'] }),
    o('corporate_law', 'Corporate Law', '🏢', { careers: ['lawyer'], exams: ['CLAT', 'AILET'] }),
    o('criminal_law', 'Criminal Law', '🚨', { careers: ['lawyer'], exams: ['CLAT'] }),
    o('public_law', 'Constitutional / Public Law', '📜', { careers: ['lawyer', 'civil-servant'], exams: ['CLAT'] }),
    o('judiciary', 'Judiciary', '🏛️', { careers: ['lawyer'] }),
    o('civil_services', 'Civil Services', '🏛️', { careers: ['civil-servant'], exams: ['UPSC CSE (after graduation)'] }),
    o('public_policy', 'Public Policy', '🧭', { careers: ['civil-servant', 'lawyer'] }),
    NOT_SURE,
  ],
};

const PSYCHOLOGY_BRANCH = {
  title: 'What interests you most about psychology?',
  support: 'Psychology leads to very different working lives — from clinics to companies to labs.',
  options: [
    o('human_behaviour', 'Human Behaviour', '🧠', { careers: ['psychologist'] }),
    o('counselling', 'Counselling', '🤝', { careers: ['psychologist'] }),
    o('organisational_psych', 'Organisational Psychology', '🏢', { careers: ['psychologist', 'business-analyst'] }),
    o('educational_psych', 'Educational Psychology', '🎓', { careers: ['psychologist', 'teacher'] }),
    o('psych_research', 'Research', '🔬', { careers: ['psychologist'] }),
    o('behavioural_science', 'Behavioural Science', '📊', { careers: ['psychologist', 'marketing-manager'] }),
    NOT_SURE,
  ],
};

const ECONOMICS_BRANCH = {
  title: 'Which side of economics pulls you most?',
  support: 'Economics can be academic, quantitative, or applied in business and policy.',
  options: [
    o('econ_research', 'Economics Research', '🔬', { careers: ['business-analyst'] }),
    o('econ_analytics', 'Data & Economic Analytics', '📊', { careers: ['data-scientist', 'business-analyst'] }),
    o('econ_policy', 'Economic Policy', '🏛️', { careers: ['civil-servant'] }),
    o('econ_business', 'Applied / Business Economics', '💼', { careers: ['financial-analyst', 'business-analyst'] }),
    NOT_SURE,
  ],
};

const BUSINESS_MGMT_BRANCH = {
  title: 'Which kind of business work interests you?',
  support: 'This shapes whether we point you at management, consulting or running something of your own.',
  options: [
    o('general_mgmt', 'Management', '💼', { careers: ['business-analyst'], exams: ['IPMAT', 'CUET'] }),
    o('consulting', 'Consulting / Strategy', '📈', { careers: ['business-analyst'] }),
    o('hr_people', 'Human Resources', '👥', { careers: ['business-analyst'] }),
    o('operations', 'Operations & Logistics', '🚚', { careers: ['business-analyst'] }),
    o('own_business', 'Running My Own Business', '🚀', { careers: ['entrepreneur'] }),
    NOT_SURE,
  ],
};

const BANKING_BRANCH = {
  title: 'Which banking direction fits you best?',
  support: 'Banking ranges from public-sector exams to fast-moving private-markets roles.',
  options: [
    o('banking_exams', 'Public-Sector Banking (PO / Clerk)', '🏦', { careers: ['financial-analyst'], exams: ['IBPS PO', 'SBI PO'] }),
    o('investment_banking', 'Investment Banking & Markets', '📈', { careers: ['financial-analyst'] }),
    o('fintech', 'FinTech', '💳', { careers: ['financial-analyst', 'software-engineer'] }),
    o('insurance_actuarial', 'Insurance / Actuarial Work', '🛡️', { careers: ['financial-analyst'] }),
    NOT_SURE,
  ],
};

const MARKETING_BRANCH = {
  title: 'Which marketing path interests you?',
  support: 'Marketing blends creativity with data — the mix you pick shapes your first degree.',
  options: [
    o('digital_marketing', 'Digital Marketing', '📱', { careers: ['marketing-manager'] }),
    o('brand_management', 'Brand Management', '🏷️', { careers: ['marketing-manager'] }),
    o('pr_communication', 'PR & Corporate Communication', '📣', { careers: ['marketing-manager', 'journalist'] }),
    o('market_research', 'Market Research & Analytics', '📊', { careers: ['marketing-manager', 'business-analyst'] }),
    o('sales', 'Sales & Business Development', '🤝', { careers: ['marketing-manager', 'entrepreneur'] }),
    NOT_SURE,
  ],
};

const ANALYTICS_BRANCH = {
  title: 'What kind of analytics work sounds like you?',
  support: 'Analytics overlaps heavily with technology — pick the flavour that feels most natural.',
  options: [
    o('business_analytics', 'Business Analytics', '📊', { careers: ['business-analyst', 'data-scientist'] }),
    o('data_analytics', 'Data Science & Analytics', '🧮', { careers: ['data-scientist'] }),
    o('bi_reporting', 'BI & Reporting', '📋', { careers: ['business-analyst'] }),
    o('quant_analytics', 'Quantitative / Statistical Analytics', '➗', { careers: ['data-scientist', 'financial-analyst'] }),
    NOT_SURE,
  ],
};

const ENTREPRENEURSHIP_BRANCH = {
  title: 'What does entrepreneurship look like for you?',
  support: 'There is no single founder path — this helps us suggest the right preparation.',
  options: [
    o('startup_founder', 'Building a Start-up', '🚀', { careers: ['entrepreneur'] }),
    o('family_business', 'Growing a Family Business', '🏠', { careers: ['entrepreneur'] }),
    o('social_enterprise', 'Social Enterprise', '🌍', { careers: ['entrepreneur'] }),
    o('small_business', 'Small Business / Self-Employment', '🛍️', { careers: ['entrepreneur'] }),
    NOT_SURE,
  ],
};

const TECH_BRANCH = {
  title: 'What kind of technology work interests you most?',
  support: 'Technology careers differ a lot in day-to-day work — this narrows it down.',
  options: [
    o('software_dev', 'Software Development', '💻', { careers: ['software-engineer'] }),
    o('ai_ml', 'AI / Machine Learning', '🤖', { careers: ['ml-engineer', 'data-scientist'] }),
    o('data_science', 'Data Science', '📊', { careers: ['data-scientist'] }),
    o('cybersecurity', 'Cybersecurity', '🛡️', { careers: ['cybersecurity-analyst'] }),
    o('web_app_dev', 'Web / App Development', '📱', { careers: ['software-engineer'] }),
    o('cloud_devops', 'Cloud / DevOps', '☁️', { careers: ['software-engineer'] }),
    o('product_tech', 'Product / Technology Management', '🧭', { careers: ['business-analyst', 'software-engineer'] }),
    NOT_SURE,
  ],
};

const ENGINEERING_BRANCH = {
  title: 'Which engineering direction interests you?',
  support: 'Each engineering branch is a distinct career — pick the one that pulls you most.',
  options: [
    o('eng_cs_it', 'Computer Science / IT', '💻', { careers: ['software-engineer'], exams: ['JEE Main', 'JEE Advanced', 'State EAMCET'] }),
    o('eng_mechanical', 'Mechanical', '⚙️', { careers: ['mechanical-engineer'], exams: ['JEE Main', 'State EAMCET'] }),
    o('eng_civil', 'Civil', '🏗️', { careers: ['civil-engineer'], exams: ['JEE Main', 'State EAMCET'] }),
    o('eng_electrical', 'Electrical', '⚡', { careers: ['mechanical-engineer'], exams: ['JEE Main', 'State EAMCET'] }),
    o('eng_electronics', 'Electronics', '📡', { careers: ['mechanical-engineer'], exams: ['JEE Main', 'State EAMCET'] }),
    o('eng_aerospace', 'Aerospace', '🛰️', { careers: ['mechanical-engineer'], exams: ['JEE Advanced'] }),
    o('eng_chemical', 'Chemical', '🧪', { careers: ['biotech-researcher'], exams: ['JEE Main'] }),
    o('eng_mechatronics', 'Mechatronics / Robotics', '🦾', { careers: ['mechanical-engineer', 'software-engineer'], exams: ['JEE Main'] }),
    o('eng_other', 'Other Engineering', '🛠️', { careers: ['mechanical-engineer'] }),
    NOT_SURE,
  ],
};

// ── Stream data: interest lists + conditional direction branches ──
export const streamData = {
  mpc: {
    id: 'mpc',
    name: 'MPC',
    label: 'MPC',
    emoji: '🧮',
    interestTitle: 'Which area are you most interested in exploring?',
    interestSupport:
      "You've chosen MPC — this opens engineering, computing, the physical sciences and quantitative fields. The stream is a filter, not a fence: pick what genuinely pulls you.",
    interestOptions: [
      o('computer_science', 'Computer Science & Technology', '💻', { followUp: TECH_BRANCH }),
      o('ai_data', 'AI, Data & Emerging Technology', '🤖', {
        followUp: {
          title: 'Which emerging-technology area pulls you most?',
          support: 'These fields sit at the research edge of computing — each has a distinct preparation path.',
          options: [
            o('ai_ml', 'AI / Machine Learning', '🤖', { careers: ['ml-engineer'] }),
            o('data_science', 'Data Science', '📊', { careers: ['data-scientist'] }),
            o('robotics_ai', 'Robotics & Intelligent Systems', '🦾', { careers: ['ml-engineer', 'mechanical-engineer'] }),
            o('nlp_genai', 'Generative AI / Language Technology', '💬', { careers: ['ml-engineer', 'data-scientist'] }),
            o('ai_research', 'AI Research', '🔬', { careers: ['ml-engineer', 'data-scientist'] }),
            o('ai_product', 'AI Product & Applications', '🧭', { careers: ['software-engineer', 'business-analyst'] }),
            NOT_SURE,
          ],
        },
      }),
      o('engineering', 'Engineering', '🛠️', { followUp: ENGINEERING_BRANCH }),
      o('electronics_robotics', 'Electronics, Robotics & Automation', '🦾', {
        followUp: {
          title: 'What draws you to electronics and robotics?',
          support: 'This area spans hardware, software and the factory floor.',
          options: [
            o('embedded', 'Embedded Systems', '🔌', { careers: ['software-engineer', 'mechanical-engineer'] }),
            o('robotics', 'Robotics', '🤖', { careers: ['mechanical-engineer', 'ml-engineer'] }),
            o('industrial_automation', 'Industrial Automation', '🏭', { careers: ['mechanical-engineer'] }),
            o('iot', 'IoT & Smart Devices', '📶', { careers: ['software-engineer'] }),
            o('drones', 'Drones & Autonomous Systems', '🚁', { careers: ['mechanical-engineer'] }),
            NOT_SURE,
          ],
        },
      }),
      o('architecture', 'Architecture & Planning', '📐', {
        followUp: {
          title: 'Which side of architecture interests you?',
          support: 'Architecture blends design, engineering and how people live in spaces.',
          options: [
            o('architecture_design', 'Architecture (B.Arch)', '📐', { careers: ['architect'], exams: ['NATA', 'JEE Main Paper 2'] }),
            o('urban_planning', 'Urban Planning', '🏙️', { careers: ['architect', 'civil-engineer'] }),
            o('interior_design', 'Interior Design', '🛋️', { careers: ['ux-designer', 'architect'] }),
            o('landscape', 'Landscape Architecture', '🌳', { careers: ['architect'] }),
            NOT_SURE,
          ],
        },
      }),
      o('math_stats', 'Mathematics, Statistics & Analytics', '➗', {
        followUp: {
          title: 'What would you most like to do with mathematics?',
          support: 'Strong maths leads to surprisingly different careers.',
          options: [
            o('actuarial', 'Actuarial Science & Risk', '🛡️', { careers: ['financial-analyst'] }),
            o('statistics_data', 'Statistics & Data Analytics', '📊', { careers: ['data-scientist'] }),
            o('math_research', 'Pure Mathematics Research', '🔬', { careers: ['data-scientist'], exams: ['IISER Aptitude Test', 'NEST', 'CUET'] }),
            o('quant_finance', 'Quantitative Finance', '📈', { careers: ['financial-analyst', 'data-scientist'] }),
            o('math_teaching', 'Teaching Mathematics', '🎓', { careers: ['teacher'] }),
            NOT_SURE,
          ],
        },
      }),
      o('defence', 'Defence & Technical Services', '🛡️', {
        followUp: {
          title: 'Which defence path interests you?',
          support: 'Defence careers combine discipline with technical depth.',
          options: [
            o('nda', 'Armed Forces (NDA Route)', '🎖️', { careers: ['civil-servant'], exams: ['NDA (UPSC)'] }),
            o('defence_tech', 'Defence Technology (DRDO-type R&D)', '🚀', { careers: ['mechanical-engineer', 'software-engineer'] }),
            o('cyber_defence', 'Cyber Defence', '🛡️', { careers: ['cybersecurity-analyst'] }),
            o('paramilitary', 'Paramilitary / Technical Services', '🧭', { careers: ['civil-servant'] }),
            NOT_SURE,
          ],
        },
      }),
      o('pure_science', 'Pure Science & Research', '🔬', {
        followUp: {
          title: 'Which science would you like to go deep into?',
          support: 'Research careers usually start with a B.Sc via an IISER/IISc-type route.',
          options: [
            o('physics', 'Physics', '⚛️', { careers: ['data-scientist'], exams: ['IISER Aptitude Test', 'NEST', 'CUET'] }),
            o('chemistry', 'Chemistry', '🧪', { careers: ['biotech-researcher'], exams: ['IISER Aptitude Test', 'NEST', 'CUET'] }),
            o('mathematics', 'Mathematics', '➗', { careers: ['data-scientist'], exams: ['IISER Aptitude Test', 'NEST', 'CUET'] }),
            o('interdisciplinary', 'Interdisciplinary Science', '🌐', { careers: ['data-scientist', 'environmental-scientist'], exams: ['IISER Aptitude Test', 'NEST'] }),
            NOT_SURE,
          ],
        },
      }),
      o('economics_finance', 'Economics, Finance & Quantitative Fields', '📈', {
        followUp: {
          title: 'Which quantitative direction appeals to you?',
          support: 'MPC students are welcome in economics and finance — the maths is the doorway.',
          options: [
            o('economics', 'Economics', '🌐', { careers: ['business-analyst'], exams: ['IPMAT', 'CUET'] }),
            o('quant_finance', 'Quantitative Finance', '📈', { careers: ['financial-analyst', 'data-scientist'] }),
            o('actuarial', 'Actuarial Science', '🛡️', { careers: ['financial-analyst'] }),
            o('fintech', 'FinTech', '💳', { careers: ['financial-analyst', 'software-engineer'] }),
            NOT_SURE,
          ],
        },
      }),
      EXPLORING(),
    ],
  },
  bipc: {
    id: 'bipc',
    name: 'BiPC',
    label: 'BiPC',
    emoji: '🧬',
    interestTitle: 'Which area of your BiPC background interests you most?',
    interestSupport:
      "You've chosen BiPC — medicine is one path, but life sciences span research, technology, psychology, agriculture and more. Pick what genuinely pulls you.",
    interestOptions: [
      o('medicine', 'Medicine & Healthcare', '🩺', {
        followUp: {
          title: 'Which healthcare direction interests you most?',
          support: 'Healthcare is much bigger than MBBS — every route here is a real career.',
          options: [
            o('mbbs', 'MBBS / Medicine', '🩺', { careers: ['doctor'], exams: ['NEET UG'] }),
            o('nursing', 'Nursing', '🏥', { careers: ['nurse'] }),
            o('physiotherapy', 'Physiotherapy', '🦵', { careers: ['nurse'] }),
            o('allied_health', 'Allied Health Sciences', '🧠', { careers: ['nurse'] }),
            o('public_health', 'Public Health', '🌍', { careers: ['environmental-scientist'] }),
            o('medical_research', 'Medical Research', '🔬', { careers: ['biotech-researcher'] }),
            o('other_healthcare', 'Other Healthcare Fields', '🧭', { careers: ['nurse'] }),
            NOT_SURE,
          ],
        },
      }),
      o('dentistry', 'Dentistry', '🦷', { careers: ['doctor'], exams: ['NEET UG (for BDS)'] }),
      o('pharmacy', 'Pharmacy & Pharmaceutical Science', '💊', {
        followUp: {
          title: 'Which part of pharmacy interests you?',
          support: 'Pharmacy ranges from patient-facing roles to lab research.',
          options: [
            o('pharm_d', 'Pharm.D (Clinical Pharmacy)', '🏥', { careers: ['pharmacist'] }),
            o('b_pharm', 'B.Pharm', '💊', { careers: ['pharmacist'] }),
            o('pharma_research', 'Pharmaceutical Research', '🔬', { careers: ['biotech-researcher'] }),
            o('regulatory', 'Regulatory Affairs & Quality', '📋', { careers: ['pharmacist'] }),
            NOT_SURE,
          ],
        },
      }),
      o('biotechnology', 'Biotechnology & Life Sciences', '🧬', {
        followUp: {
          title: 'Which part of life sciences interests you most?',
          support: 'This is where biology meets research and technology — very different careers live here.',
          options: [
            o('biotechnology', 'Biotechnology', '🧬', { careers: ['biotech-researcher'] }),
            o('genetics', 'Genetics', '🧫', { careers: ['biotech-researcher'] }),
            o('microbiology', 'Microbiology', '🔬', { careers: ['biotech-researcher'] }),
            o('molecular_biology', 'Molecular Biology', '🧪', { careers: ['biotech-researcher'] }),
            o('bioinformatics', 'Bioinformatics', '💻', { careers: ['biotech-researcher', 'data-scientist'] }),
            o('biomedical_research', 'Biomedical Research', '🏥', { careers: ['biotech-researcher'] }),
            o('pharma_research', 'Pharmaceutical Research', '💊', { careers: ['biotech-researcher', 'pharmacist'] }),
            o('environmental_biology', 'Environmental Biology', '🌱', { careers: ['environmental-scientist'] }),
            NOT_SURE,
          ],
        },
      }),
      o('psychology', 'Psychology & Human Behaviour', '🧠', { followUp: PSYCHOLOGY_BRANCH }),
      o('research_lab', 'Research & Laboratory Science', '🔬', {
        followUp: {
          title: 'Which kind of lab work attracts you?',
          support: 'Lab careers differ by field — pick where you want your bench to be.',
          options: [
            o('bio_research', 'Biology Research', '🧬', { careers: ['biotech-researcher'], exams: ['IISER Aptitude Test', 'CUET'] }),
            o('chem_research', 'Chemistry Research', '🧪', { careers: ['biotech-researcher'], exams: ['IISER Aptitude Test', 'CUET'] }),
            o('biomedical_lab', 'Biomedical / Clinical Lab', '🏥', { careers: ['biotech-researcher', 'nurse'] }),
            o('forensic_lab', 'Forensic Lab Work', '🔍', { careers: ['biotech-researcher'] }),
            NOT_SURE,
          ],
        },
      }),
      o('agriculture_env', 'Agriculture & Environmental Science', '🌱', {
        followUp: {
          title: 'Which area fits you better?',
          support: 'Both feed into sustainability careers with strong public-sector options.',
          options: [
            o('agriculture', 'Agriculture', '🌾', { careers: ['agricultural-scientist'], exams: ['ICAR AIEEA', 'State agricultural entrance'] }),
            o('environmental_science', 'Environmental Science', '🌍', { careers: ['environmental-scientist'] }),
            o('food_tech', 'Food Technology', '🍅', { careers: ['agricultural-scientist'] }),
            o('forestry', 'Forestry & Wildlife', '🌲', { careers: ['environmental-scientist', 'agricultural-scientist'] }),
            o('horticulture', 'Horticulture', '🌷', { careers: ['agricultural-scientist'] }),
            NOT_SURE,
          ],
        },
      }),
      o('food_nutrition', 'Food, Nutrition & Life Sciences', '🥗', {
        followUp: {
          title: 'Which food & nutrition direction interests you?',
          support: 'This space spans hospitals, industry and public health.',
          options: [
            o('nutrition_dietetics', 'Nutrition & Dietetics', '🥗', { careers: ['nurse', 'agricultural-scientist'] }),
            o('food_technology', 'Food Technology', '🏭', { careers: ['agricultural-scientist'] }),
            o('food_science', 'Food Science Research', '🔬', { careers: ['agricultural-scientist'] }),
            NOT_SURE,
          ],
        },
      }),
      o('forensic', 'Forensic Science', '🔍', {
        followUp: {
          title: 'Which forensic direction interests you?',
          support: 'Forensics mixes lab science with investigation.',
          options: [
            o('forensic_science', 'Forensic Science (B.Sc)', '🔬', { careers: ['biotech-researcher'] }),
            o('cyber_forensics', 'Digital / Cyber Forensics', '💻', { careers: ['cybersecurity-analyst'] }),
            o('criminology', 'Criminology', '🚨', { careers: ['lawyer', 'civil-servant'] }),
            NOT_SURE,
          ],
        },
      }),
      o('allied_health', 'Allied Health Sciences', '🩹', {
        followUp: {
          title: 'Which allied-health role interests you?',
          support: 'Allied health professionals are the backbone of modern hospitals.',
          options: [
            o('physiotherapy', 'Physiotherapy', '🦵', { careers: ['nurse'] }),
            o('lab_technology', 'Medical Lab Technology', '🧪', { careers: ['nurse'] }),
            o('radiology_imaging', 'Radiology & Imaging Technology', '🩻', { careers: ['nurse'] }),
            o('optometry', 'Optometry', '👓', { careers: ['nurse'] }),
            NOT_SURE,
          ],
        },
      }),
      o('teaching', 'Teaching & Education', '🎓', { careers: ['teacher'] }),
      EXPLORING(),
    ],
  },
  cec: {
    id: 'cec',
    name: 'CEC',
    label: 'CEC',
    emoji: '⚖️',
    interestTitle: 'Which area interests you most for your future?',
    interestSupport:
      "You've chosen CEC — civics, economics and commerce open law, business, public service and the social sciences. Pick what genuinely pulls you.",
    interestOptions: [
      o('law', 'Law & Legal Studies', '⚖️', { followUp: LAW_BRANCH }),
      o('business', 'Business & Entrepreneurship', '📈', {
        followUp: {
          title: 'What kind of business career interests you?',
          support: 'Business careers differ by whether you build, manage or advise.',
          options: [
            o('management', 'Management', '💼', { careers: ['business-analyst'], exams: ['IPMAT', 'CUET'] }),
            o('entrepreneurship', 'Entrepreneurship', '🚀', { careers: ['entrepreneur'] }),
            o('consulting', 'Consulting / Strategy', '📈', { careers: ['business-analyst'] }),
            o('international_business', 'International Business', '🌍', { careers: ['business-analyst'] }),
            o('family_business', 'Family Business', '🏠', { careers: ['entrepreneur'] }),
            NOT_SURE,
          ],
        },
      }),
      o('accounting_finance', 'Accounting & Finance', '📊', {
        followUp: {
          title: 'Which part of accounting and finance interests you?',
          support: 'This decides whether we point you at professional qualifications or degrees.',
          options: [
            o('accounting', 'Accounting', '📊', { careers: ['chartered-accountant'] }),
            o('audit', 'Audit', '🔍', { careers: ['chartered-accountant'] }),
            o('taxation', 'Taxation', '🧾', { careers: ['chartered-accountant'] }),
            o('corporate_finance', 'Corporate Finance', '💼', { careers: ['financial-analyst'] }),
            o('investment', 'Investment', '📈', { careers: ['financial-analyst'] }),
            NOT_SURE,
          ],
        },
      }),
      o('economics', 'Economics', '🌐', { followUp: ECONOMICS_BRANCH }),
      o('banking', 'Banking & Financial Services', '🏦', { followUp: BANKING_BRANCH }),
      o('management', 'Management', '💼', { followUp: BUSINESS_MGMT_BRANCH }),
      o('marketing_comm', 'Marketing & Communication', '📣', { followUp: MARKETING_BRANCH }),
      o('govt_public', 'Government & Public Service', '🏛️', {
        followUp: {
          title: 'Which public-service path interests you?',
          support: 'Public service has several distinct entry routes.',
          options: [
            o('civil_services', 'Civil Services (UPSC)', '🏛️', { careers: ['civil-servant'], exams: ['UPSC CSE (after graduation)'] }),
            o('state_services', 'State Civil Services', '🏙️', { careers: ['civil-servant'] }),
            o('public_policy', 'Public Policy', '🧭', { careers: ['civil-servant', 'lawyer'] }),
            o('foreign_services', 'Foreign Services', '🌍', { careers: ['civil-servant'] }),
            NOT_SURE,
          ],
        },
      }),
      o('social_sciences', 'Social Sciences', '🌍', {
        followUp: {
          title: 'Which social science pulls you most?',
          support: 'Each social science leads to a different working life.',
          options: [
            o('psychology', 'Psychology', '🧠', { careers: ['psychologist'] }),
            o('sociology', 'Sociology', '👥', { careers: ['psychologist', 'teacher'] }),
            o('political_science', 'Political Science', '🏛️', { careers: ['civil-servant', 'lawyer'] }),
            o('social_work', 'Social Work', '🤝', { careers: ['psychologist'] }),
            NOT_SURE,
          ],
        },
      }),
      EXPLORING(),
    ],
  },
  mec: {
    id: 'mec',
    name: 'MEC',
    label: 'MEC',
    emoji: '🧮',
    interestTitle: 'Which direction interests you most?',
    interestSupport:
      "You've chosen MEC — maths, economics and commerce give you a rare quantitative-plus-business base. Pick what genuinely pulls you.",
    interestOptions: [
      o('finance_investment', 'Finance & Investment', '📈', {
        followUp: {
          title: 'Which finance direction interests you?',
          support: 'Finance splits into markets, corporate and advisory work.',
          options: [
            o('investment', 'Investment & Markets', '📈', { careers: ['financial-analyst'] }),
            o('corporate_finance', 'Corporate Finance', '💼', { careers: ['financial-analyst'] }),
            o('financial_planning', 'Financial Planning & Advisory', '🧭', { careers: ['financial-analyst'] }),
            o('quant_finance', 'Quantitative Finance', '➗', { careers: ['financial-analyst', 'data-scientist'] }),
            NOT_SURE,
          ],
        },
      }),
      o('accounting', 'Accounting', '📊', {
        followUp: {
          title: 'Which part of accounting interests you?',
          support: 'Accounting careers can be professional-qualification or degree led.',
          options: [
            o('accounting', 'Accounting', '📊', { careers: ['chartered-accountant'] }),
            o('audit', 'Audit', '🔍', { careers: ['chartered-accountant'] }),
            o('taxation', 'Taxation', '🧾', { careers: ['chartered-accountant'] }),
            o('financial_reporting', 'Financial Reporting', '📋', { careers: ['chartered-accountant'] }),
            NOT_SURE,
          ],
        },
      }),
      o('economics', 'Economics', '🌐', { followUp: ECONOMICS_BRANCH }),
      o('business_mgmt', 'Business & Management', '💼', { followUp: BUSINESS_MGMT_BRANCH }),
      o('banking', 'Banking', '🏦', { followUp: BANKING_BRANCH }),
      o('business_analytics', 'Business Analytics', '📊', { followUp: ANALYTICS_BRANCH }),
      o('entrepreneurship', 'Entrepreneurship', '🚀', { followUp: ENTREPRENEURSHIP_BRANCH }),
      o('marketing', 'Marketing', '📣', { followUp: MARKETING_BRANCH }),
      o('math_quant', 'Mathematics & Quantitative Fields', '➗', {
        followUp: {
          title: 'What would you most like to do with mathematics?',
          support: 'MEC maths leads into statistics, actuarial work and quantitative finance.',
          options: [
            o('actuarial', 'Actuarial Science & Risk', '🛡️', { careers: ['financial-analyst'] }),
            o('statistics_data', 'Statistics & Data Analytics', '📊', { careers: ['data-scientist'] }),
            o('quant_finance', 'Quantitative Finance', '📈', { careers: ['financial-analyst', 'data-scientist'] }),
            o('math_research', 'Mathematics Research', '🔬', { careers: ['data-scientist'], exams: ['IISER Aptitude Test', 'NEST', 'CUET'] }),
            NOT_SURE,
          ],
        },
      }),
      EXPLORING(),
    ],
  },
  commerce: {
    id: 'commerce',
    name: 'Commerce',
    label: 'Commerce',
    emoji: '💰',
    interestTitle: 'Which area of Commerce interests you most?',
    interestSupport:
      "You've chosen Commerce — accounting, finance, business and analytics all live here. Pick what genuinely pulls you.",
    interestOptions: [
      o('accounting_taxation', 'Accounting & Taxation', '🧾', {
        followUp: {
          title: 'Which part of accounting and finance interests you?',
          support: 'This decides whether we point you at professional qualifications or degrees.',
          options: [
            o('accounting', 'Accounting', '📊', { careers: ['chartered-accountant'], exams: ['CA Foundation'] }),
            o('audit', 'Audit', '🔍', { careers: ['chartered-accountant'], exams: ['CA Foundation'] }),
            o('taxation', 'Taxation', '🧾', { careers: ['chartered-accountant'], exams: ['CA Foundation'] }),
            o('financial_reporting', 'Financial Reporting', '📋', { careers: ['chartered-accountant'] }),
            o('corporate_finance', 'Corporate Finance', '💼', { careers: ['financial-analyst'] }),
            o('investment', 'Investment', '📈', { careers: ['financial-analyst'] }),
            NOT_SURE,
          ],
        },
      }),
      o('finance_investment', 'Finance & Investment', '📈', {
        followUp: {
          title: 'Which finance direction interests you?',
          support: 'Finance splits into markets, corporate and advisory work.',
          options: [
            o('investment', 'Investment & Markets', '📈', { careers: ['financial-analyst'] }),
            o('corporate_finance', 'Corporate Finance', '💼', { careers: ['financial-analyst'] }),
            o('financial_planning', 'Financial Planning & Advisory', '🧭', { careers: ['financial-analyst'] }),
            o('fintech', 'FinTech', '💳', { careers: ['financial-analyst', 'software-engineer'] }),
            NOT_SURE,
          ],
        },
      }),
      o('banking', 'Banking', '🏦', { followUp: BANKING_BRANCH }),
      o('business_mgmt', 'Business & Management', '💼', { followUp: BUSINESS_MGMT_BRANCH }),
      o('marketing_sales', 'Marketing & Sales', '📣', { followUp: MARKETING_BRANCH }),
      o('entrepreneurship', 'Entrepreneurship', '🚀', { followUp: ENTREPRENEURSHIP_BRANCH }),
      o('economics', 'Economics', '🌐', { followUp: ECONOMICS_BRANCH }),
      o('business_analytics', 'Business Analytics', '📊', { followUp: ANALYTICS_BRANCH }),
      o('hr', 'Human Resources', '👥', {
        followUp: {
          title: 'Which people-side role interests you?',
          support: 'HR spans hiring, culture and people strategy.',
          options: [
            o('hr_mgmt', 'HR Management', '👥', { careers: ['business-analyst'] }),
            o('talent', 'Talent Acquisition / Recruitment', '🤝', { careers: ['business-analyst'] }),
            o('people_analytics', 'People Analytics', '📊', { careers: ['business-analyst', 'data-scientist'] }),
            NOT_SURE,
          ],
        },
      }),
      EXPLORING(),
    ],
  },
  arts: {
    id: 'arts',
    name: 'Arts / Humanities',
    label: 'Arts / Humanities',
    emoji: '🎨',
    interestTitle: 'Which area would you most like to explore?',
    interestSupport:
      "You've chosen Arts / Humanities — law, psychology, media, design, public service and the social sciences all grow from here. Pick what genuinely pulls you.",
    interestOptions: [
      o('law', 'Law & Legal Studies', '⚖️', { followUp: LAW_BRANCH }),
      o('psychology', 'Psychology', '🧠', { followUp: PSYCHOLOGY_BRANCH }),
      o('civil_services', 'Civil Services & Public Administration', '🏛️', {
        followUp: {
          title: 'Which public-service path interests you?',
          support: 'Public service has several distinct entry routes.',
          options: [
            o('ias_upsc', 'IAS / UPSC Civil Services', '🏛️', { careers: ['civil-servant'], exams: ['UPSC CSE (after graduation)'] }),
            o('state_services', 'State Civil Services', '🏙️', { careers: ['civil-servant'] }),
            o('foreign_services', 'Foreign Services', '🌍', { careers: ['civil-servant'] }),
            o('public_admin', 'Public Administration & Policy', '🧭', { careers: ['civil-servant'], exams: ['CUET'] }),
            NOT_SURE,
          ],
        },
      }),
      o('journalism_media', 'Journalism & Media', '📰', {
        followUp: {
          title: 'Which media direction interests you?',
          support: 'Media careers range from reporting to production to strategy.',
          options: [
            o('journalism', 'Journalism (Print / Digital / TV)', '📰', { careers: ['journalist'] }),
            o('digital_content', 'Digital Media & Content Creation', '📱', { careers: ['journalist', 'marketing-manager'] }),
            o('film_production', 'Film & TV Production', '🎬', { careers: ['journalist'] }),
            o('advertising', 'Advertising', '📣', { careers: ['marketing-manager'] }),
            o('pr_corp_comm', 'PR & Corporate Communication', '🤝', { careers: ['journalist', 'marketing-manager'] }),
            NOT_SURE,
          ],
        },
      }),
      o('social_sciences', 'Social Sciences', '🌍', {
        followUp: {
          title: 'Which social science pulls you most?',
          support: 'Each social science leads to a different working life.',
          options: [
            o('sociology', 'Sociology', '👥', { careers: ['psychologist', 'teacher'] }),
            o('political_science', 'Political Science', '🏛️', { careers: ['civil-servant', 'lawyer'] }),
            o('history', 'History', '🏺', { careers: ['teacher', 'civil-servant'] }),
            o('geography', 'Geography', '🗺️', { careers: ['environmental-scientist', 'teacher'] }),
            o('social_work', 'Social Work', '🤝', { careers: ['psychologist'] }),
            NOT_SURE,
          ],
        },
      }),
      o('economics', 'Economics', '🌐', { followUp: ECONOMICS_BRANCH }),
      o('literature_languages', 'Literature & Languages', '📚', {
        followUp: {
          title: 'What would you most like to do with language?',
          support: 'Language skills open more careers than most students expect.',
          options: [
            o('writing_publishing', 'Writing & Publishing', '✍️', { careers: ['journalist'] }),
            o('content_strategy', 'Content Strategy & Marketing', '📱', { careers: ['journalist', 'marketing-manager'] }),
            o('translation', 'Translation & Interpretation', '🌍', { careers: ['journalist'] }),
            o('linguistics', 'Linguistics', '🔤', { careers: ['teacher'] }),
            o('lang_teaching', 'Teaching Languages', '🎓', { careers: ['teacher'] }),
            NOT_SURE,
          ],
        },
      }),
      o('education', 'Education', '🎓', { careers: ['teacher'] }),
      o('design', 'Design & Creative Fields', '🎨', {
        followUp: {
          title: 'Which design field pulls you most?',
          support: 'Design is portfolio-driven — the specialisation shapes your degree choice.',
          options: [
            o('ux_ui', 'UX / UI Design', '📱', { careers: ['ux-designer'], exams: ['UCEED', 'NID DAT'] }),
            o('graphic', 'Graphic & Communication Design', '🖼️', { careers: ['ux-designer', 'marketing-manager'], exams: ['NID DAT', 'UCEED'] }),
            o('product_industrial', 'Product / Industrial Design', '🛠️', { careers: ['ux-designer', 'mechanical-engineer'], exams: ['UCEED', 'NID DAT'] }),
            o('fashion', 'Fashion Design', '👗', { careers: ['ux-designer'], exams: ['NIFT Entrance'] }),
            o('animation', 'Animation & Game Design', '🎮', { careers: ['ux-designer', 'software-engineer'] }),
            NOT_SURE,
          ],
        },
      }),
      o('international_relations', 'International Relations', '🌍', {
        followUp: {
          title: 'Which global-careers direction interests you?',
          support: 'IR leads to diplomacy, global policy and international organisations.',
          options: [
            o('diplomacy', 'Diplomacy / Foreign Services', '🏛️', { careers: ['civil-servant'], exams: ['UPSC CSE (after graduation)'] }),
            o('global_policy', 'Global Policy & Think Tanks', '🧭', { careers: ['civil-servant'] }),
            o('international_orgs', 'International Organisations (UN etc.)', '🌐', { careers: ['civil-servant'] }),
            o('area_studies', 'Regional / Area Studies', '🗺️', { careers: ['civil-servant', 'teacher'] }),
            NOT_SURE,
          ],
        },
      }),
      EXPLORING(),
    ],
  },
  diploma: {
    id: 'diploma',
    name: 'Diploma / Polytechnic',
    label: 'Diploma / Polytechnic',
    emoji: '🛠️',
    interestTitle: 'Which area interests you most?',
    interestSupport:
      "You've chosen a Diploma / Polytechnic background — your technical training opens skilled, engineering-adjacent and IT careers. Pick what genuinely pulls you.",
    interestOptions: [
      o('computer_it', 'Computer / IT', '💻', { followUp: TECH_BRANCH }),
      o('mechanical', 'Mechanical', '⚙️', {
        followUp: {
          title: 'Which mechanical direction interests you?',
          support: 'Mechanical diploma holders move into design, production and maintenance roles.',
          options: [
            o('design_cad', 'Design & CAD', '📐', { careers: ['mechanical-engineer'] }),
            o('manufacturing', 'Manufacturing & Production', '🏭', { careers: ['mechanical-engineer'] }),
            o('automotive', 'Automotive', '🚗', { careers: ['mechanical-engineer'] }),
            o('maintenance', 'Plant Maintenance', '🔧', { careers: ['mechanical-engineer'] }),
            o('btech_lateral', 'B.Tech (Lateral Entry)', '🎓', { careers: ['mechanical-engineer'], exams: ['LEET / State lateral-entry test'] }),
            NOT_SURE,
          ],
        },
      }),
      o('civil', 'Civil', '🏗️', {
        followUp: {
          title: 'Which civil direction interests you?',
          support: 'Civil diploma holders are in demand across construction and public works.',
          options: [
            o('construction', 'Construction & Site Management', '🏗️', { careers: ['civil-engineer'] }),
            o('surveying', 'Surveying', '📐', { careers: ['civil-engineer'] }),
            o('structural_drafting', 'Structural Drafting', '📋', { careers: ['civil-engineer'] }),
            o('public_works', 'Public Works / Government Projects', '🏛️', { careers: ['civil-engineer'] }),
            o('btech_lateral', 'B.Tech (Lateral Entry)', '🎓', { careers: ['civil-engineer'], exams: ['LEET / State lateral-entry test'] }),
            NOT_SURE,
          ],
        },
      }),
      o('electrical', 'Electrical', '⚡', {
        followUp: {
          title: 'Which electrical direction interests you?',
          support: 'Electrical work spans power, industry and the growing renewables sector.',
          options: [
            o('power_systems', 'Power Systems & Distribution', '🔌', { careers: ['mechanical-engineer'] }),
            o('industrial_electrician', 'Industrial Electrical Work', '🏭', { careers: ['mechanical-engineer'] }),
            o('renewable_energy', 'Solar & Renewable Energy', '☀️', { careers: ['mechanical-engineer', 'environmental-scientist'] }),
            o('btech_lateral', 'B.Tech (Lateral Entry)', '🎓', { careers: ['mechanical-engineer'], exams: ['LEET / State lateral-entry test'] }),
            NOT_SURE,
          ],
        },
      }),
      o('electronics', 'Electronics', '📡', {
        followUp: {
          title: 'Which electronics direction interests you?',
          support: 'Electronics splits into hardware, communication and consumer devices.',
          options: [
            o('embedded', 'Embedded Systems', '🔌', { careers: ['software-engineer'] }),
            o('telecom', 'Telecom & Networks', '📶', { careers: ['software-engineer'] }),
            o('consumer_electronics', 'Consumer Electronics Repair & Design', '📺', { careers: ['mechanical-engineer'] }),
            o('pcb', 'PCB Design & Fabrication', '🟩', { careers: ['mechanical-engineer'] }),
            NOT_SURE,
          ],
        },
      }),
      o('automobile', 'Automobile', '🚗', {
        followUp: {
          title: 'Which automobile direction interests you?',
          support: 'The auto sector is shifting fast toward EVs — worth factoring in.',
          options: [
            o('service_tech', 'Service & Diagnostics Technician', '🔧', { careers: ['mechanical-engineer'] }),
            o('ev_technology', 'EV Technology', '🔋', { careers: ['mechanical-engineer'] }),
            o('workshop_mgmt', 'Workshop Management', '🏭', { careers: ['mechanical-engineer', 'entrepreneur'] }),
            NOT_SURE,
          ],
        },
      }),
      o('mechatronics', 'Mechatronics / Robotics', '🦾', {
        followUp: {
          title: 'Which automation direction interests you?',
          support: 'Mechatronics sits at the intersection of mechanical, electronics and software.',
          options: [
            o('robotics', 'Robotics', '🤖', { careers: ['mechanical-engineer', 'software-engineer'] }),
            o('plc_automation', 'PLC & Industrial Automation', '🏭', { careers: ['mechanical-engineer'] }),
            o('cnc', 'CNC & Precision Manufacturing', '⚙️', { careers: ['mechanical-engineer'] }),
            NOT_SURE,
          ],
        },
      }),
      o('architecture_fields', 'Architecture-related Fields', '📐', {
        followUp: {
          title: 'Which architecture-adjacent role interests you?',
          support: 'Diploma holders support architects in drafting, estimation and site roles.',
          options: [
            o('arch_drafting', 'Architectural Drafting', '📐', { careers: ['architect'] }),
            o('barch_lateral', 'B.Arch (via lateral routes)', '🎓', { careers: ['architect'], exams: ['NATA'] }),
            o('interior', 'Interior Design', '🛋️', { careers: ['ux-designer'] }),
            o('estimation', 'Estimation & Costing', '📋', { careers: ['civil-engineer'] }),
            NOT_SURE,
          ],
        },
      }),
      o('other_technical', 'Other Technical Fields', '🧭', { careers: ['mechanical-engineer'] }),
      EXPLORING(),
    ],
  },
  iti: {
    id: 'iti',
    name: 'ITI / Vocational',
    label: 'ITI / Vocational',
    emoji: '🔧',
    interestTitle: 'Which direction interests you most?',
    interestSupport:
      "You've chosen an ITI / Vocational background — skilled trades are in real demand and many lead to self-employment or supervisory roles. Pick what genuinely pulls you.",
    interestOptions: [
      o('electrical', 'Electrical', '⚡', { careers: ['mechanical-engineer'] }),
      o('mechanical_fitter', 'Mechanical / Fitter', '⚙️', { careers: ['mechanical-engineer'] }),
      o('automobile', 'Automobile', '🚗', { careers: ['mechanical-engineer'] }),
      o('electronics', 'Electronics', '📡', { careers: ['mechanical-engineer'] }),
      o('computer_it', 'Computer / IT', '💻', {
        followUp: {
          title: 'Which IT direction interests you?',
          support: 'IT careers for vocational students often start with certifications and grow fast.',
          options: [
            o('it_support', 'IT Support & Hardware', '🖥️', { careers: ['software-engineer'] }),
            o('networking', 'Networking', '📶', { careers: ['software-engineer'] }),
            o('web_dev', 'Web Development', '🌐', { careers: ['software-engineer'] }),
            o('data_entry_ops', 'Data & Backend Operations', '📋', { careers: ['business-analyst'] }),
            NOT_SURE,
          ],
        },
      }),
      o('refrigeration', 'Refrigeration & AC', '❄️', { careers: ['mechanical-engineer'] }),
      o('welding', 'Welding / Fabrication', '🔥', { careers: ['mechanical-engineer'] }),
      o('other_trades', 'Other Skilled Trades', '🧭', { careers: ['mechanical-engineer'] }),
      EXPLORING(),
    ],
  },
  not_sure: {
    id: 'not_sure',
    name: 'Not Sure',
    label: 'Other / Not sure yet',
    emoji: '🧭',
    interestTitle: 'Which area interests you most right now?',
    interestSupport:
      "That's completely okay — you don't need a stream decided to start exploring. Pick whichever area feels closest, or choose 'Still exploring'.",
    interestOptions: [
      o('technology_computers', 'Technology & Computers', '💻', { followUp: TECH_BRANCH }),
      o('medicine_healthcare', 'Medicine & Healthcare', '🩺'),
      o('business_finance', 'Business & Finance', '💼', { followUp: BUSINESS_MGMT_BRANCH }),
      o('law_government', 'Law & Government', '⚖️', { followUp: LAW_BRANCH }),
      o('psychology_human', 'Psychology & Human Behaviour', '🧠', { followUp: PSYCHOLOGY_BRANCH }),
      o('science_research', 'Science & Research', '🔬'),
      o('design_creativity', 'Design & Creativity', '🎨'),
      o('media_communication', 'Media & Communication', '📰'),
      o('engineering_tech', 'Engineering & Technology', '🛠️', { followUp: ENGINEERING_BRANCH }),
      o('agriculture_environment', 'Agriculture & Environment', '🌱'),
      o('education', 'Education', '🎓'),
      o('defence_public_service', 'Defence & Public Service', '🛡️'),
      o('help_me_explore', 'Help Me Explore', '🧭', { exploratory: true }),
      EXPLORING(),
    ],
  },
};
// ── Stream choice cards (step 1) ──────────────────────────
export const streamOptions = [
  {
    value: 'mpc', label: 'MPC', description: 'Mathematics, Physics, Chemistry', emoji: '🧮',
    subjects: 'Mathematics, Physics, Chemistry',
    careerAreas: 'Engineering, Technology, AI & Data, Architecture, Analytics, Defence & Pure Sciences',
    blurb: 'Ideal for students drawn to analytical thinking, problem solving, mathematics, software, robotics and quantitative sciences.',
    tags: ['Computer Science & AI', 'Engineering', 'Quantitative Finance'],
  },
  {
    value: 'bipc', label: 'BiPC', description: 'Biology, Physics, Chemistry', emoji: '🧬',
    subjects: 'Biology, Physics, Chemistry',
    careerAreas: 'Medicine, Dentistry, Pharmacy, Biotech, Psychology, Agriculture & Allied Health',
    blurb: 'Designed for students interested in healthcare, life sciences, research, agriculture and the human mind — medicine is only one of many routes.',
    tags: ['MBBS / NEET', 'Biotech & Research', 'Psychology'],
  },
  {
    value: 'cec', label: 'CEC', description: 'Civics, Economics, Commerce', emoji: '⚖️',
    subjects: 'Civics, Economics, Commerce',
    careerAreas: 'Law, Business, Economics, Public Service & Social Sciences',
    blurb: 'Tailored for students interested in legal systems, economics, governance, entrepreneurship and the social sciences.',
    tags: ['Law (CLAT)', 'Civil Services', 'Economics'],
  },
  {
    value: 'mec', label: 'MEC', description: 'Mathematics, Economics, Commerce', emoji: '🧮',
    subjects: 'Mathematics, Economics, Commerce',
    careerAreas: 'Finance, Analytics, Accounting, Economics & Management',
    blurb: 'A quantitative-plus-business base — strong for finance, actuarial work, analytics and economics.',
    tags: ['Finance & Investment', 'Business Analytics', 'Economics'],
  },
  {
    value: 'commerce', label: 'Commerce', description: 'Business, Accounting, Economics', emoji: '💰',
    subjects: 'Commerce, Accountancy, Economics & Business Studies',
    careerAreas: 'Accounting, Finance, Banking, Management, Marketing & Entrepreneurship',
    blurb: 'Tailored for students interested in accounting, capital markets, corporate strategy, fintech and professional certifications.',
    tags: ['CA / CS / CMA', 'Banking & Finance', 'Business Analytics'],
  },
  {
    value: 'arts', label: 'Arts / Humanities', description: 'Humanities, Social Sciences, Languages', emoji: '🎨',
    subjects: 'History, Political Science, Psychology, Sociology & Literature',
    careerAreas: 'Law, Psychology, Media, Design, Civil Services & International Relations',
    blurb: 'Geared towards students interested in human behaviour, legal systems, storytelling, design, governance and global affairs.',
    tags: ['Law & Policy', 'Psychology', 'Media & Design'],
  },
  {
    value: 'diploma', label: 'Diploma / Polytechnic', description: 'Technical diploma after Class 10', emoji: '🛠️',
    subjects: 'Technical trades & engineering fundamentals',
    careerAreas: 'Skilled Technical Roles, IT, Engineering (Lateral Entry) & Supervision',
    blurb: 'Your technical training opens skilled roles, IT careers, and B.Tech/B.Arch lateral-entry routes.',
    tags: ['B.Tech Lateral Entry', 'IT & Electronics', 'Industry Roles'],
  },
  {
    value: 'iti', label: 'ITI / Vocational', description: 'Industrial training / vocational course', emoji: '🔧',
    subjects: 'Trade skills & hands-on training',
    careerAreas: 'Skilled Trades, Electrical, Mechanical, Automobile & IT Support',
    blurb: 'Skilled trades are in real demand — many paths lead to stable jobs, supervisory roles or your own workshop.',
    tags: ['Skilled Trades', 'Electrician / Fitter', 'Own Workshop'],
  },
  {
    value: 'not_sure', label: 'Other / Not sure yet', description: "I haven't decided which stream fits me", emoji: '🧭',
    subjects: 'Explore your options',
    careerAreas: 'Career Discovery & Guidance',
    blurb: "Not sure which stream is right for you? That's okay. We'll explore by interest instead — no stream required.",
    tags: ['Explore Careers', 'Find Your Interests', 'No Pressure'],
  },
];

// ── Shared question content (steps 4+) ────────────────────
export const workStyleOptions = [
  o('solving_problems', 'Solving problems', '🧩'),
  o('working_with_people', 'Working with people', '🧑‍🤝‍🧑'),
  o('building_creating', 'Building or creating things', '🛠️'),
  o('analysing_information', 'Analysing information', '📊'),
  o('researching_discovering', 'Researching and discovering', '🔬'),
  o('helping_directly', 'Helping people directly', '🤝'),
  o('leading_managing', 'Leading or managing', '👥'),
  o('designing_creating', 'Designing and creating', '🎨'),
  o('working_technology', 'Working with technology', '💻'),
  o('hands_on_practical', 'Working practically / hands-on', '🔧'),
  o('still_figuring', 'I am still figuring this out', '🧭', { exploratory: true }),
];

export const strengthsOptions = [
  o('logical_thinking', 'Logical thinking', '🧠'),
  o('problem_solving', 'Problem solving', '🧩'),
  o('mathematics', 'Mathematics', '🧮'),
  o('scientific_thinking', 'Scientific thinking', '🔬'),
  o('communication', 'Communication', '💬'),
  o('creativity', 'Creativity', '🎨'),
  o('leadership', 'Leadership', '👥'),
  o('empathy', 'Empathy', '🤝'),
  o('attention_detail', 'Attention to detail', '👀'),
  o('research_curiosity', 'Research / curiosity', '📚'),
  o('practical_skills', 'Practical skills', '🔧'),
  o('business_thinking', 'Business thinking', '💼'),
  o('working_with_people', 'Working with people', '🧑‍🤝‍🧑'),
  o('not_sure_yet', 'Not sure yet', '🤭'),
];

export const priorityOptions = [
  o('high_earning', 'High earning potential', '💰'),
  o('job_stability', 'Job stability', '🛡️'),
  o('helping_people', 'Helping people', '❤️'),
  o('intellectual_challenge', 'Intellectual challenge', '🧠'),
  o('creativity', 'Creativity', '🎨'),
  o('work_life_balance', 'Work-life balance', '🕊️'),
  o('leadership_influence', 'Leadership / influence', '👑'),
  o('entrepreneurship', 'Entrepreneurship', '🚀'),
  o('working_internationally', 'Working internationally', '🌍'),
  o('government_service', 'Government / public service', '🏛️'),
  o('research_innovation', 'Research / innovation', '🔬'),
  o('not_sure_yet', 'I am not sure yet', '🤔'),
];

export const roadmapOptions = [
  o('national_exams', 'Top-Tier National Exams', '🎯', { description: 'JEE / NEET / CLAT and similar' }),
  o('universities', 'State / Central Universities', '🏛️', { description: 'CUET and similar university pathways' }),
  o('global', 'Global Universities', '🌍', { description: 'SAT / IELTS and international admissions' }),
  o('direct_admissions', 'Direct / Management Admissions', '📋'),
  o('earn_learn', 'Earn While You Learn / Integrated Path', '💼'),
];

export const budgetOptions = [
  o('gov_subsidized', 'Government / Subsidized Fees', '🏛️', { description: 'Under ₹4 lakh' }),
  o('moderate_private', 'Moderate Private Budget', '💳', { description: '₹5–15 lakh' }),
  o('premium_abroad', 'Premium Private / Abroad', '✈️', { description: '₹25 lakh+' }),
  o('digital_hybrid', 'Digital / Hybrid / Correspondence', '💻'),
];

export const stepLabels = {
  stream: 'Your stream',
  interest: 'Area of interest',
  direction: 'Career direction',
  profile: 'Work style & strengths',
  roadmap: 'Higher education',
  budget: 'Financial strategy',
};

export const initialAnswers = {
  stream: '',
  interest: '',
  direction: '',
  workStyle: [],
  strengths: [],
  priority: '',
  roadmap: '',
  budget: '',
};

// ── Engine helpers ────────────────────────────────────────

/** Find a single option by value within a list. */
export function findOption(options, value) {
  return options?.find((x) => x.value === value) || null;
}

export function getStreamData(streamId) {
  return streamData[normalizeStream(streamId)] || null;
}

export function getStreamOption(streamId) {
  return findOption(streamOptions, normalizeStream(streamId));
}

/** Resolve the chosen interest option for the current answers. */
export function getInterestOption(answers = {}) {
  const data = getStreamData(answers.stream);
  if (!data || !answers.interest) return null;
  return findOption(data.interestOptions, answers.interest);
}

/** Resolve the direction branch for the chosen interest, if it has one. */
export function getDirectionBranch(answers = {}) {
  const interestOpt = getInterestOption(answers);
  return interestOpt?.followUp || null;
}

export function getDirectionOption(answers = {}) {
  const branch = getDirectionBranch(answers);
  if (!branch || !answers.direction) return null;
  return findOption(branch.options, answers.direction);
}

/**
 * Build the dynamic step list. The direction step only exists when the
 * chosen interest actually has a follow-up branch — specific interests
 * (e.g. Dentistry) skip it entirely.
 */
export function buildStepList(answers = {}) {
  const steps = ['stream', 'interest'];
  if (getDirectionBranch(answers)) steps.push('direction');
  steps.push('profile', 'roadmap', 'budget');
  return steps;
}

/** Maximum possible steps (stream + interest + direction + profile + roadmap + budget). */
export const TOTAL_STEPS = 6;

/** Work-style options for the current context (branch may tailor them). */
export function getWorkStyleOptions(answers = {}) {
  const branch = getDirectionBranch(answers);
  const interestOpt = getInterestOption(answers);
  return branch?.workStyles || interestOpt?.workStyles || workStyleOptions;
}

/** True when the student signalled uncertainty ("Still exploring" style answers). */
export function isExploring(answers = {}) {
  const interestOpt = getInterestOption(answers);
  const directionOpt = getDirectionOption(answers);
  return Boolean(
    interestOpt?.exploratory ||
      directionOpt?.exploratory ||
      answers.interest === 'still_exploring' ||
      answers.interest === 'help_me_explore' ||
      (answers.workStyle || []).includes('still_figuring'),
  );
}

/**
 * Build a display-ready summary of the collected answers.
 * Returns null if the questionnaire was never completed (no stream chosen).
 */
export function resolveAnswerSummary(answers = {}) {
  if (!answers.stream && !answers.streamV2) return null;
  // v2 12-step answers take precedence
  if (answers.streamV2 || answers.educationStatus) return resolveTwelveSummary(answers);
  const streamOpt = getStreamOption(answers.stream);
  const interestOpt = getInterestOption(answers);
  const branch = getDirectionBranch(answers);
  const directionOpt = getDirectionOption(answers);

  const pick = (list, values) =>
    (values || []).map((v) => findOption(list, v)?.label || v);

  return {
    stream: { id: answers.stream, label: streamOpt?.label || answers.stream },
    interest: { id: answers.interest, label: interestOpt?.label || '' },
    direction: {
      id: answers.direction,
      label: directionOpt?.label || (branch ? '' : '—'),
    },
    workStyle: pick(workStyleOptions, answers.workStyle),
    strengths: pick(strengthsOptions, answers.strengths),
    priority: { id: answers.priority, label: findOption(priorityOptions, answers.priority)?.label || '' },
    roadmap: { id: answers.roadmap, label: findOption(roadmapOptions, answers.roadmap)?.label || '' },
    budget: { id: answers.budget, label: findOption(budgetOptions, answers.budget)?.label || '' },
  };
}

// ═══════════════════════════════════════════════════════════════
// 12-STEP CLASS 12 QUESTIONNAIRE (v2) — spec-compliant
// ═══════════════════════════════════════════════════════════════
// educationStatus → stream → subjectInterests → interestArea
//   → specificInterest → motivation → workStyle → workEnvironment
//   → careerPriorities → studyCommitment → futureDirection → decisionConfidence

export const TWELVE_STEP_IDS = [
  'educationStatus','streamV2','subjectInterests','interestArea','specificInterest',
  'motivation','workStyle','workEnvironment','careerPriorities','studyCommitment','futureDirection','decisionConfidence',
];

export const twelveStepLabels = {
  educationStatus: 'Education status',
  streamV2: 'Your stream',
  subjectInterests: 'Subject interests',
  interestArea: 'Interest area',
  specificInterest: 'Specific interest',
  motivation: 'What draws you',
  workStyle: 'Work style',
  workEnvironment: 'Work environment',
  careerPriorities: 'Career priorities',
  studyCommitment: 'Study commitment',
  futureDirection: 'Future direction',
  decisionConfidence: 'Decision confidence',
};

export const twelveStepTitles = {
  educationStatus: 'Where are you in your Class 12 journey?',
  streamV2: 'What stream are you studying?',
  subjectInterests: 'Which subjects interest you most?',
  interestArea: '',
  specificInterest: '',
  motivation: '',
  workStyle: 'What type of work would suit you best?',
  workEnvironment: 'Where would you feel most comfortable working?',
  careerPriorities: 'What matters most to you when choosing a career?',
  studyCommitment: 'How much study are you comfortable committing to?',
  futureDirection: 'Which future direction sounds closest to what you want?',
  decisionConfidence: 'How clear are you about your career direction right now?',
};

export const MAX_CAREER_PRIORITIES = 2;

export const educationStatusOptions = [
  o('in_class12', 'Currently in Class 12', '📚', { description: 'I am studying in Class 12 now' }),
  o('completed_class12', 'Completed Class 12', '🎓', { description: 'I have finished Class 12 and am exploring next steps' }),
];

export const twelveStreamOptions = [
  { value: 'mpc', label: 'MPC', description: 'Mathematics, Physics, Chemistry', emoji: '🧮', subjects: 'Mathematics, Physics, Chemistry', careerAreas: 'Engineering, Technology, AI, Architecture', blurb: 'Analytical and quantitative foundation.', tags: ['Engineering','Technology'] },
  { value: 'bipc', label: 'BiPC', description: 'Biology, Physics, Chemistry', emoji: '🧬', subjects: 'Biology, Physics, Chemistry', careerAreas: 'Medicine, Pharmacy, Biotech, Agriculture', blurb: 'Life sciences and healthcare foundation.', tags: ['Medicine','Life Sciences'] },
  { value: 'commerce', label: 'Commerce', description: 'Commerce & Business', emoji: '💰', subjects: 'Accountancy, Business Studies, Economics', careerAreas: 'Finance, Accounting, Business, Banking', blurb: 'Business and finance foundation.', tags: ['Finance','Business'] },
  { value: 'arts', label: 'Arts / Humanities', description: 'Arts & Humanities', emoji: '🎨', subjects: 'History, Political Science, Psychology, Languages', careerAreas: 'Law, Psychology, Media, Design', blurb: 'Human behaviour, society and creativity.', tags: ['Law','Psychology'] },
  { value: 'other', label: 'Other', description: 'Another stream or combination', emoji: '🧭', subjects: 'Your stream subjects', careerAreas: 'We will tailor by your interests', blurb: 'Pick your closest interests and we will adapt.', tags: ['Explore'] },
  { value: 'not_sure', label: 'Not sure / Exploring', description: "I haven't decided or am still exploring", emoji: '🤔', subjects: 'Explore your options', careerAreas: 'Career Discovery', blurb: "That's okay — we'll discover together.", tags: ['Discovery'] },
];

const TWELVE_STREAM_ALIASES = { ...STREAM_ALIASES, cec: 'commerce', mec: 'commerce', other: 'other', commerce: 'commerce', arts: 'arts' };
export function normalizeTwelveStream(raw){
  const key = String(raw||'').toLowerCase().trim().replace(/[\s-]+/g,'_');
  return TWELVE_STREAM_ALIASES[key] || null;
}

// ── Step 3: Subject interests per stream ──
export const subjectOptionsByStream = {
  mpc: [
    o('mathematics','Mathematics','➗'), o('physics','Physics','⚛️'), o('chemistry','Chemistry','🧪'),
    o('computer_science','Computer Science','💻'), o('other_subject','Other','🧭'),
  ],
  bipc: [
    o('biology','Biology','🧬'), o('physics','Physics','⚛️'), o('chemistry','Chemistry','🧪'), o('other_subject','Other','🧭'),
  ],
  commerce: [
    o('accountancy','Accountancy','📊'), o('economics','Economics','🌐'), o('business_studies','Business Studies','💼'),
    o('mathematics','Mathematics','➗'), o('other_subject','Other','🧭'),
  ],
  arts: [
    o('history','History','🏛️'), o('political_science','Political Science','🗳️'), o('economics','Economics','🌐'),
    o('psychology','Psychology','🧠'), o('sociology','Sociology','👥'), o('languages','Languages / Literature','📚'), o('other_subject','Other','🧭'),
  ],
  other: [
    o('mathematics','Mathematics','➗'), o('science','Science','🔬'), o('commerce_subject','Commerce / Business','💰'),
    o('humanities','Humanities','🎨'), o('other_subject','Other','🧭'),
  ],
  not_sure: [
    o('mathematics','Mathematics','➗'), o('biology','Biology','🧬'), o('physics','Physics','⚛️'),
    o('economics','Economics','🌐'), o('psychology','Psychology','🧠'), o('languages','Languages','📚'), o('other_subject','Other / Not sure','🧭'),
  ],
};
export function getTwelveSubjectOptions(stream){ return subjectOptionsByStream[normalizeTwelveStream(stream)] || subjectOptionsByStream.not_sure; }

// ── Step 4: Broad interest area per stream ──
export const interestAreaByStream = {
  mpc: [
    o('cs_software','Computer Science & Software','💻'), o('ai_ml','AI & Machine Learning','🤖'),
    o('electronics_robotics','Electronics & Robotics','🦾'), o('engineering','Engineering','🛠️'),
    o('math_data','Mathematics & Data','➗'), o('architecture_design','Architecture & Design','📐'),
    o('defence_gov','Defence / Government','🛡️'), o('exploring','Exploring','🧭',{exploratory:true}),
  ],
  bipc: [
    o('medicine_care','Medicine & Patient Care','🩺'), o('pharmacy_meds','Pharmacy & Medicines','💊'),
    o('bio_research','Biological Sciences & Research','🧬'), o('psychology_human','Psychology & Human Behaviour','🧠'),
    o('agri_life','Agriculture & Life Sciences','🌱'), o('nutrition_food','Nutrition & Food Science','🥗'),
    o('allied_health','Allied Healthcare','🩹'), o('exploring','Exploring','🧭',{exploratory:true}),
  ],
  commerce: [
    o('finance_invest','Finance & Investment','📈'), o('accounting','Accounting','📊'),
    o('business_mgmt','Business Management','💼'), o('economics','Economics','🌐'),
    o('marketing','Marketing','📣'), o('banking','Banking','🏦'),
    o('entrepreneurship','Entrepreneurship','🚀'), o('exploring','Exploring','🧭',{exploratory:true}),
  ],
  arts: [
    o('psychology','Psychology','🧠'), o('law','Law','⚖️'), o('economics','Economics','🌐'),
    o('journalism_media','Journalism & Media','📰'), o('poli_policy','Political Science / Public Policy','🏛️'),
    o('sociology','Sociology','👥'), o('languages_lit','Languages & Literature','📚'),
    o('design_creative','Design & Creative Fields','🎨'), o('education','Education','🎓'),
    o('exploring','Exploring','🧭',{exploratory:true}),
  ],
  other: [
    o('technology','Technology & Computers','💻'), o('healthcare','Healthcare & Life Sciences','🩺'),
    o('business_finance','Business & Finance','💼'), o('law_gov','Law & Governance','⚖️'),
    o('design_creative','Design & Creativity','🎨'), o('exploring','Exploring','🧭',{exploratory:true}),
  ],
  not_sure: [
    o('technology','Technology & Computers','💻'), o('healthcare','Healthcare & Life Sciences','🩺'),
    o('business_finance','Business & Finance','💼'), o('law_gov','Law & Governance','⚖️'),
    o('psychology_human','Psychology & Human Behaviour','🧠'), o('design_creative','Design & Creativity','🎨'),
    o('exploring','Exploring','🧭',{exploratory:true}),
  ],
};
export function getInterestAreaOptions(stream){ return interestAreaByStream[normalizeTwelveStream(stream)] || interestAreaByStream.not_sure; }
export function getInterestAreaMeta(stream, interestArea){
  const list = getInterestAreaOptions(stream);
  return findOption(list, interestArea) || null;
}

// ── Step 5: Specific interest per interestArea ──
export const specificBranches = {
  // MPC
  cs_software: { title: 'Which area of Computer Science interests you most?', support: 'Each path leads to a distinct career.', options:[
    o('software_dev','Software development','💻',{careers:['software-engineer']}), o('cybersecurity','Cybersecurity','🛡️',{careers:['cybersecurity-analyst']}),
    o('data_science','Data Science','📊',{careers:['data-scientist']}), o('cloud_systems','Cloud / Systems','☁️',{careers:['software-engineer']}),
    o('app_dev','Application development','📱',{careers:['software-engineer']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  ai_ml: { title: 'Which AI direction interests you most?', support:'AI careers differ by research vs application.', options:[
    o('ai_building','Building intelligent systems','🤖',{careers:['ml-engineer']}), o('ml_data','Machine Learning with data','📊',{careers:['ml-engineer','data-scientist']}),
    o('ai_research','AI research','🔬',{careers:['ml-engineer']}), o('ai_apps','AI applications','📱',{careers:['software-engineer']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  electronics_robotics: { title:'Which electronics & robotics area pulls you?', support:'Hardware, software and automation intersect here.', options:[
    o('embedded','Embedded systems','🔌',{careers:['software-engineer','mechanical-engineer']}), o('robotics','Robotics','🤖',{careers:['mechanical-engineer']}),
    o('iot','IoT & smart devices','📶',{careers:['software-engineer']}), o('automation','Automation','🏭',{careers:['mechanical-engineer']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  engineering: { title:'Which engineering direction interests you?', support:'Each branch is a distinct career.', options:[
    o('eng_cs','Computer / IT Engineering','💻',{careers:['software-engineer'],exams:['JEE Main']}), o('eng_mech','Mechanical','⚙️',{careers:['mechanical-engineer'],exams:['JEE Main']}),
    o('eng_civil','Civil','🏗️',{careers:['civil-engineer'],exams:['JEE Main']}), o('eng_electrical','Electrical','⚡',{careers:['mechanical-engineer'],exams:['JEE Main']}),
    o('eng_electronics','Electronics','📡',{careers:['mechanical-engineer']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  math_data: { title:'Which mathematics & data direction fits you?', support:'Strong maths opens many doors.', options:[
    o('data_analytics','Data analytics','📊',{careers:['data-scientist']}), o('statistics','Statistics','➗',{careers:['data-scientist']}),
    o('quant','Quantitative fields','📈',{careers:['financial-analyst']}), o('math_research','Mathematics research','🔬',{careers:['data-scientist']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  architecture_design: { title:'Which architecture & design direction?', support:'Design blends creativity with precision.', options:[
    o('architecture','Architecture (B.Arch)','📐',{careers:['architect'],exams:['NATA','JEE Paper 2']}), o('urban_planning','Urban planning','🏙️',{careers:['architect']}),
    o('interior','Interior design','🛋️',{careers:['ux-designer']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  defence_gov: { title:'Which defence / government direction?', support:'Discipline plus technical depth.', options:[
    o('nda','Armed forces (NDA)','🎖️',{careers:['civil-servant'],exams:['NDA']}), o('defence_tech','Defence technology','🚀',{careers:['mechanical-engineer']}),
    o('gov_tech','Government technical services','🏛️',{careers:['civil-servant']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  // BiPC
  medicine_care: { title:'Which healthcare direction interests you most?', support:'Healthcare is much bigger than MBBS — every route here is a real career.', options:[
    o('diagnosing_treating','Diagnosing and treating patients','🩺',{careers:['doctor'],exams:['NEET UG']}), o('dentistry','Dentistry','🦷',{careers:['doctor'],exams:['NEET UG']}),
    o('patient_care','Patient care','🏥',{careers:['nurse']}), o('medical_research','Medical research','🔬',{careers:['biotech-researcher']}),
    o('healthcare_tech','Healthcare technology','💻',{careers:['biotech-researcher']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  pharmacy_meds: { title:'Which pharmacy direction interests you?', support:'From patient-facing to lab research.', options:[
    o('pharm_d','Pharm.D / Clinical pharmacy','🏥',{careers:['pharmacist']}), o('b_pharm','B.Pharm','💊',{careers:['pharmacist']}),
    o('pharma_research','Pharmaceutical research','🔬',{careers:['biotech-researcher']}), o('regulatory','Regulatory & quality','📋',{careers:['pharmacist']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  bio_research: { title:'Which biological sciences area interests you?', support:'Where biology meets technology.', options:[
    o('biotechnology','Biotechnology','🧬',{careers:['biotech-researcher']}), o('genetics','Genetics','🧫',{careers:['biotech-researcher']}),
    o('microbiology','Microbiology','🔬',{careers:['biotech-researcher']}), o('bioinformatics','Bioinformatics','💻',{careers:['biotech-researcher','data-scientist']}),
    o('environmental_bio','Environmental biology','🌱',{careers:['environmental-scientist']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  psychology_human: { title:'Which psychology direction interests you?', support:'Clinics, companies and labs differ a lot.', options:[
    o('human_behaviour','Human behaviour','🧠',{careers:['psychologist']}), o('counselling','Counselling','🤝',{careers:['psychologist']}),
    o('organisational_psych','Organisational psychology','🏢',{careers:['psychologist']}), o('psych_research','Research','🔬',{careers:['psychologist']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  agri_life: { title:'Which agriculture & life sciences direction?', support:'Sustainability with strong public-sector options.', options:[
    o('agriculture','Agriculture','🌾',{careers:['agricultural-scientist'],exams:['ICAR AIEEA']}), o('environmental_sci','Environmental science','🌍',{careers:['environmental-scientist']}),
    o('food_tech','Food technology','🍅',{careers:['agricultural-scientist']}), o('forestry','Forestry & wildlife','🌲',{careers:['environmental-scientist']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  nutrition_food: { title:'Which nutrition & food science direction?', support:'Hospitals, industry and public health.', options:[
    o('nutrition_diet','Nutrition & dietetics','🥗',{careers:['nurse','agricultural-scientist']}), o('food_tech2','Food technology','🏭',{careers:['agricultural-scientist']}),
    o('food_research','Food science research','🔬',{careers:['agricultural-scientist']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  allied_health: { title:'Which allied-health role interests you?', support:'Backbone of modern hospitals.', options:[
    o('physiotherapy','Physiotherapy','🦵',{careers:['nurse']}), o('lab_tech','Medical lab technology','🧪',{careers:['nurse']}),
    o('radiology','Radiology & imaging','🩻',{careers:['nurse']}), o('optometry','Optometry','👓',{careers:['nurse']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  // Commerce
  finance_invest: { title:'Which finance & investment direction?', support:'Markets, corporate and advisory differ.', options:[
    o('investment','Investment','📈',{careers:['financial-analyst']}), o('banking_f','Banking','🏦',{careers:['financial-analyst']}),
    o('financial_analysis','Financial analysis','📊',{careers:['financial-analyst']}), o('risk_mgmt','Risk management','🛡️',{careers:['financial-analyst']}),
    o('financial_planning','Financial planning','🧭',{careers:['financial-analyst']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  accounting: { title:'Which accounting direction?', support:'Professional qualification or degree led.', options:[
    o('accounting_gen','Accounting','📊',{careers:['chartered-accountant']}), o('audit','Audit','🔍',{careers:['chartered-accountant']}),
    o('taxation','Taxation','🧾',{careers:['chartered-accountant']}), o('reporting','Financial reporting','📋',{careers:['chartered-accountant']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  business_mgmt: { title:'Which business direction interests you?', support:'Build, manage or advise.', options:[
    o('management','Management','💼',{careers:['business-analyst']}), o('consulting','Consulting','📈',{careers:['business-analyst']}),
    o('entrepreneurship_b','Entrepreneurship','🚀',{careers:['entrepreneur']}), o('operations','Operations','🚚',{careers:['business-analyst']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  economics: { title:'Which side of economics pulls you?', support:'Academic, quantitative or applied.', options:[
    o('econ_research','Economics research','🔬',{careers:['business-analyst']}), o('econ_analytics','Data & economic analytics','📊',{careers:['data-scientist']}),
    o('econ_policy','Economic policy','🏛️',{careers:['civil-servant']}), o('econ_business','Applied economics','💼',{careers:['financial-analyst']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  marketing: { title:'Which marketing path interests you?', support:'Creativity with data.', options:[
    o('digital_marketing','Digital marketing','📱',{careers:['marketing-manager']}), o('brand_mgmt','Brand management','🏷️',{careers:['marketing-manager']}),
    o('market_research','Market research','📊',{careers:['marketing-manager']}), o('sales','Sales','🤝',{careers:['marketing-manager']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  banking: { title:'Which banking direction?', support:'Public-sector exams to private markets.', options:[
    o('banking_exams','Public-sector banking','🏦',{careers:['financial-analyst'],exams:['IBPS PO']}), o('investment_banking','Investment banking','📈',{careers:['financial-analyst']}),
    o('fintech','FinTech','💳',{careers:['financial-analyst','software-engineer']}), o('insurance','Insurance / actuarial','🛡️',{careers:['financial-analyst']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  entrepreneurship: { title:'What does entrepreneurship look like for you?', support:'No single founder path.', options:[
    o('startup','Building a start-up','🚀',{careers:['entrepreneur']}), o('family_biz','Family business','🏠',{careers:['entrepreneur']}),
    o('social_ent','Social enterprise','🌍',{careers:['entrepreneur']}), o('small_biz','Small business','🛍️',{careers:['entrepreneur']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  // Arts — reuse with arts-specific keys; alias to same branches above where shared
  psychology: { title:'What interests you most about psychology?', support:'Very different working lives.', options:[
    o('human_behaviour','Human behaviour','🧠',{careers:['psychologist']}), o('counselling','Counselling','🤝',{careers:['psychologist']}),
    o('organisational_psych','Organisational psychology','🏢',{careers:['psychologist']}), o('psych_research','Research','🔬',{careers:['psychologist']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  law: { title:'What kind of legal career interests you?', support:'Law opens different doors.', options:[
    o('legal_practice','Legal practice','⚖️',{careers:['lawyer'],exams:['CLAT']}), o('corporate_law','Corporate law','🏢',{careers:['lawyer']}),
    o('criminal_law','Criminal law','🚨',{careers:['lawyer']}), o('public_law','Constitutional / public law','📜',{careers:['lawyer']}),
    o('judiciary','Judiciary','🏛️',{careers:['lawyer']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  journalism_media: { title:'Which media direction interests you?', support:'Reporting to production to strategy.', options:[
    o('journalism','Journalism','📰',{careers:['journalist']}), o('digital_content','Digital media & content','📱',{careers:['journalist']}),
    o('film_tv','Film & TV production','🎬',{careers:['journalist']}), o('advertising','Advertising','📣',{careers:['marketing-manager']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  poli_policy: { title:'Which political science / policy direction?', support:'Each leads to a different life.', options:[
    o('political_science','Political science','🏛️',{careers:['civil-servant']}), o('public_policy','Public policy','🧭',{careers:['civil-servant']}),
    o('civil_services','Civil services','🏛️',{careers:['civil-servant']}), o('social_work','Social work','🤝',{careers:['psychologist']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  sociology: { title:'Which sociology direction?', support:'People and society.', options:[
    o('sociology_gen','Sociology','👥',{careers:['psychologist']}), o('social_work','Social work','🤝',{careers:['psychologist']}),
    o('research_soc','Research','🔬',{careers:['psychologist']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  languages_lit: { title:'What would you like to do with language?', support:'More careers than expected.', options:[
    o('writing','Writing & publishing','✍️',{careers:['journalist']}), o('translation','Translation','🌍',{careers:['journalist']}),
    o('linguistics','Linguistics','🔤',{careers:['teacher']}), o('teaching_lang','Teaching languages','🎓',{careers:['teacher']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  design_creative: { title:'Which design field pulls you?', support:'Portfolio-driven specialisation.', options:[
    o('ux_ui','UX / UI design','📱',{careers:['ux-designer'],exams:['UCEED']}), o('graphic','Graphic design','🖼️',{careers:['ux-designer']}),
    o('product_design','Product design','🛠️',{careers:['ux-designer']}), o('fashion','Fashion design','👗',{careers:['ux-designer']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  education: { title:'Which education direction?', support:'Teaching and learning.', options:[
    o('school_teaching','School teaching','🎓',{careers:['teacher']}), o('edu_research','Education research','🔬',{careers:['teacher']}),
    o('edtech','EdTech / curriculum','💻',{careers:['teacher']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  // generic fallbacks for other / not_sure interest areas
  technology: { title:'Which technology direction?', support:'Different day-to-day work.', options:[
    o('software_dev','Software development','💻',{careers:['software-engineer']}), o('ai_ml','AI / Machine Learning','🤖',{careers:['ml-engineer']}),
    o('data_science','Data Science','📊',{careers:['data-scientist']}), o('cybersecurity','Cybersecurity','🛡️',{careers:['cybersecurity-analyst']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  healthcare: { title:'Which healthcare direction?', support:'Clinical to research.', options:[
    o('diagnosing_treating','Diagnosing and treating','🩺',{careers:['doctor'],exams:['NEET UG']}), o('nursing','Nursing','🏥',{careers:['nurse']}),
    o('pharmacy','Pharmacy','💊',{careers:['pharmacist']}), o('research','Research','🔬',{careers:['biotech-researcher']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  business_finance: { title:'Which business & finance direction?', support:'Finance to entrepreneurship.', options:[
    o('finance','Finance','📈',{careers:['financial-analyst']}), o('business','Business','💼',{careers:['business-analyst']}),
    o('entrepreneurship_b','Entrepreneurship','🚀',{careers:['entrepreneur']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  law_gov: { title:'Which law & governance direction?', support:'Courtroom to policy.', options:[
    o('legal_practice','Legal practice','⚖️',{careers:['lawyer']}), o('civil_services','Civil services','🏛️',{careers:['civil-servant']}), o('not_sure','Not sure','🤔',{exploratory:true}),
  ]},
  exploring: { title:'Which of these sounds most interesting to you?', support:"Pick the closest — we'll narrow from there.", options:[
    o('understanding_body','Understanding the human body','🩺',{careers:['doctor']}), o('helping_people','Helping people','🤝',{careers:['nurse','psychologist']}),
    o('living_organisms','Studying living organisms','🧬',{careers:['biotech-researcher']}), o('lab_work','Working in laboratories','🔬',{careers:['biotech-researcher']}),
    o('human_behaviour','Understanding human behaviour','🧠',{careers:['psychologist']}), o('nature','Working with nature','🌱',{careers:['agricultural-scientist']}),
    o('still_unsure','I’m still unsure','🤔',{exploratory:true}),
  ]},
};
export function getSpecificBranch(interestArea){
  return specificBranches[interestArea] || null;
}

// ── Step 6: Motivation per specificInterest ──
export const motivationBranches = {
  diagnosing_treating: { title:'What attracts you most about this path?', support:'Medicine rewards different motivations differently.', options:[
    o('understanding_diseases','Understanding diseases','🔬'), o('diagnosing','Diagnosing problems','🩺'), o('treating','Treating patients','❤️'),
    o('complex_medical','Solving complex medical problems','🧩'), o('helping_directly','Helping people directly','🤝'), o('still_figuring','Still figuring it out','🧭',{exploratory:true}),
  ]},
  dentistry: { title:'What attracts you most about dentistry?', support:'Hands-on precision meets patient care.', options:[
    o('precision','Precision & hands-on work','🔧'), o('patient_care','Patient care','🤝'), o('surgery','Surgical work','🩺'),
    o('aesthetics','Aesthetics & restoration','✨'), o('still_figuring','Still figuring it out','🧭',{exploratory:true}),
  ]},
  software_dev: { title:'What attracts you most about software development?', support:'Software has many flavours.', options:[
    o('building_systems','Building systems','🛠️'), o('problem_solving','Solving complex problems','🧩'), o('creating_products','Creating products people use','📱'),
    o('tech_innovation','Creating new technology','💡'), o('still_figuring','Still figuring it out','🧭',{exploratory:true}),
  ]},
  ai_building: { title:'What attracts you most about this area?', support:'AI blends research and building.', options:[
    o('building_intelligent','Building intelligent systems','🤖'), o('complex_problems','Solving complex problems','🧩'), o('working_data','Working with data','📊'),
    o('new_tech','Creating new technology','💡'), o('ai_research','AI research','🔬'), o('still_figuring','Still figuring it out','🧭',{exploratory:true}),
  ]},
  // Generic fallbacks — all specificInterests without an explicit branch use this shape
  _default_tech: { title:'What attracts you most about this area?', support:'Each motivation points to a slightly different preparation.', options:[
    o('building_systems','Building intelligent systems','🛠️'), o('complex_problems','Solving complex problems','🧩'), o('working_data','Working with data','📊'),
    o('new_tech','Creating new technology','💡'), o('research','Research','🔬'), o('still_figuring','Still figuring it out','🧭',{exploratory:true}),
  ]},
  _default_health: { title:'What attracts you most about this path?', support:'Healthcare rewards different motivations differently.', options:[
    o('understanding_diseases','Understanding diseases','🔬'), o('diagnosing','Diagnosing problems','🩺'), o('treating','Treating patients','❤️'),
    o('complex_medical','Solving complex medical problems','🧩'), o('helping_directly','Helping people directly','🤝'), o('still_figuring','Still figuring it out','🧭',{exploratory:true}),
  ]},
  _default_business: { title:'What attracts you most about this direction?', support:'Business rewards different drives.', options:[
    o('leading','Leading & organising','👥'), o('analysing','Analysing markets','📊'), o('creating','Creating & growing','🚀'),
    o('helping_biz','Helping organisations','🤝'), o('still_figuring','Still figuring it out','🧭',{exploratory:true}),
  ]},
  _default_human: { title:'What attracts you most about this area?', support:'People-focused work has many flavours.', options:[
    o('understanding_people','Understanding people','🧠'), o('helping_directly','Helping people directly','🤝'), o('research','Research','🔬'),
    o('creativity','Creativity','🎨'), o('still_figuring','Still figuring it out','🧭',{exploratory:true}),
  ]},
};
const MOTIVATION_FALLBACK = {
  diagnosing_treating: 'diagnosing_treating', dentistry: 'dentistry', patient_care: '_default_health', medical_research: '_default_health',
  healthcare_tech: '_default_health', software_dev: 'software_dev', ai_building: 'ai_building', ml_data: 'ai_building', ai_research: 'ai_building',
};
export function getMotivationBranch(specificInterest, interestArea){
  if (motivationBranches[specificInterest]) return motivationBranches[specificInterest];
  const key = MOTIVATION_FALLBACK[specificInterest];
  if (key && motivationBranches[key]) return motivationBranches[key];
  // heuristic by interestArea family
  const health = ['medicine_care','pharmacy_meds','bio_research','allied_health','nutrition_food','healthcare'];
  const tech = ['cs_software','ai_ml','electronics_robotics','engineering','math_data','technology'];
  const biz = ['finance_invest','accounting','business_mgmt','economics','marketing','banking','entrepreneurship','business_finance'];
  if (health.includes(interestArea)) return motivationBranches._default_health;
  if (tech.includes(interestArea)) return motivationBranches._default_tech;
  if (biz.includes(interestArea)) return motivationBranches._default_business;
  return motivationBranches._default_human;
}

// ── Steps 7-12 shared options ──
export const twelveWorkStyleOptions = [
  o('solving_complex','Solving complex problems','🧩'), o('helping_people','Helping people directly','🤝'),
  o('building_creating','Building / creating things','🛠️'), o('analysing_data','Analysing data and information','📊'),
  o('researching','Researching and experimenting','🔬'), o('designing','Designing and creating','🎨'),
  o('managing','Managing / leading','👥'), o('combination','A combination','🌟'),
];
export const twelveEnvironmentOptions = [
  o('hospital','Hospital / Clinical','🏥'), o('lab','Laboratory / Research','🔬'), o('office','Office / Corporate','🏢'),
  o('tech_env','Technology environment','💻'), o('business_env','Business / Entrepreneurial','💼'), o('creative','Creative environment','🎨'),
  o('field','Field / Outdoors','🌱'), o('government','Government / Public sector','🏛️'), o('mixed','Mixed environment','🌐'),
];
export function getFilteredEnvironments(answers={}){
  const ia = answers.interestArea;
  const si = answers.specificInterest;
  // Hard exclusions for irrelevant combos
  const techIAs = ['cs_software','ai_ml','electronics_robotics','engineering','math_data','technology'];
  const healthIAs = ['medicine_care','pharmacy_meds','bio_research','allied_health','nutrition_food','healthcare'];
  const bizIAs = ['finance_invest','accounting','business_mgmt','economics','marketing','banking','entrepreneurship','business_finance'];
  if (techIAs.includes(ia)) return twelveEnvironmentOptions.filter(e=> !['hospital','field'].includes(e.value));
  if (healthIAs.includes(ia)) return twelveEnvironmentOptions.filter(e=> !['tech_env'].includes(e.value));
  if (bizIAs.includes(ia)) return twelveEnvironmentOptions.filter(e=> !['hospital','lab','field'].includes(e.value));
  if (ia==='law' || ia==='poli_policy') return twelveEnvironmentOptions.filter(e=> !['hospital','lab','tech_env','field'].includes(e.value));
  if (ia==='psychology' || ia==='psychology_human') return twelveEnvironmentOptions.filter(e=> !['field','tech_env'].includes(e.value));
  if (si==='diagnosing_treating' || si==='dentistry') return [findOption(twelveEnvironmentOptions,'hospital'), findOption(twelveEnvironmentOptions,'lab'), findOption(twelveEnvironmentOptions,'mixed')].filter(Boolean);
  return twelveEnvironmentOptions;
}
export const careerPriorityOptions = [
  o('strong_interest','Strong interest','❤️'), o('income','Income potential','💰'), o('stability','Job stability','🛡️'),
  o('growth','Career growth','📈'), o('helping','Helping people','🤝'), o('creativity','Creativity','🎨'),
  o('prestige','Prestige','🏆'), o('global','Global opportunities','🌍'), o('entrepreneurship','Entrepreneurship','🚀'), o('work_life','Work-life balance','⚖️'),
];
export const studyCommitmentOptions = [
  o('short_practical','I prefer a shorter/practical pathway','⚡',{description:'1–2 years, hands-on'}), o('three_four','Around 3–4 years is comfortable','📚',{description:'Bachelor’s degree'}), 
  o('long_professional','I’m comfortable with a longer professional course','🎓',{description:'5+ years (MBBS, Law, Architecture)'}), o('postgrad_research','I’m interested in postgraduate study/research','🔬',{description:'Master’s / PhD'}), o('not_sure','I’m not sure yet','🤔'),
];
export const futureDirectionOptions = [
  o('private','Private-sector career','🏢'), o('government','Government career','🏛️'), o('professional','Professional career','⚖️'),
  o('research_academia','Research / Academia','🔬'), o('entrepreneurship','Entrepreneurship','🚀'), o('abroad','Opportunities abroad','🌍'), o('exploring','I’m still exploring','🧭',{exploratory:true}),
];
export const decisionConfidenceOptions = [
  o('know','I already know what I want','🎯'), o('two_three','I have 2–3 careers in mind','🤔'), o('general_area','I know the general area but not the career','🧭'),
  o('unsure','I am completely unsure','😕'), o('explore','I want NAVORA to explore options for me','✨',{exploratory:true}),
];

export const twelveInitialAnswers = {
  educationStatus: '', streamV2: '', subjectInterests: [], interestArea: '', specificInterest: '', motivation: '',
  workStyle: '', workEnvironment: '', careerPriorities: [], studyCommitment: '', futureDirection: '', decisionConfidence: '',
  // legacy compat aliases
  stream: '', interest: '', direction: '', workStyleLegacy: [], strengths: [], priority: '', roadmap: '', budget: '',
};

export function getTwelveStepTitle(stepId, answers={}){
  if (stepId==='interestArea'){
    const s = normalizeTwelveStream(answers.streamV2);
    const map={ mpc:'Which broad area interests you most?', bipc:'Which area of your BiPC background interests you most?', commerce:'Which business area interests you most?', arts:'Which area would you most like to explore?', other:'Which area interests you most?', not_sure:'Which area interests you most right now?'};
    return map[s] || 'Which area interests you most?';
  }
  if (stepId==='specificInterest'){ return getSpecificBranch(answers.interestArea)?.title || 'Which specific direction interests you?'; }
  if (stepId==='motivation'){ return getMotivationBranch(answers.specificInterest, answers.interestArea)?.title || 'What attracts you most about this path?'; }
  if (stepId==='subjectInterests'){ return `Which subjects interest you most?`; }
  return twelveStepTitles[stepId] || stepId;
}
export function getTwelveStepSupport(stepId, answers={}){
  if (stepId==='specificInterest') return getSpecificBranch(answers.interestArea)?.support || '';
  if (stepId==='motivation') return getMotivationBranch(answers.specificInterest, answers.interestArea)?.support || '';
  return '';
}
export function getTwelveOptions(stepId, answers={}){
  switch(stepId){
    case 'educationStatus': return educationStatusOptions;
    case 'streamV2': return twelveStreamOptions;
    case 'subjectInterests': return getTwelveSubjectOptions(answers.streamV2);
    case 'interestArea': return getInterestAreaOptions(answers.streamV2);
    case 'specificInterest': return getSpecificBranch(answers.interestArea)?.options || [];
    case 'motivation': return getMotivationBranch(answers.specificInterest, answers.interestArea)?.options || [];
    case 'workStyle': return twelveWorkStyleOptions;
    case 'workEnvironment': return getFilteredEnvironments(answers);
    case 'careerPriorities': return careerPriorityOptions;
    case 'studyCommitment': return studyCommitmentOptions;
    case 'futureDirection': return futureDirectionOptions;
    case 'decisionConfidence': return decisionConfidenceOptions;
    default: return [];
  }
}
export function isTwelveExploring(answers={}){
  return Boolean(
    answers.interestArea==='exploring' || answers.specificInterest==='not_sure' || answers.specificInterest==='still_unsure' ||
    answers.motivation==='still_figuring' || answers.futureDirection==='exploring' || answers.decisionConfidence==='explore' ||
    answers.streamV2==='not_sure' ||
    (Array.isArray(answers.careerPriorities) && answers.careerPriorities.length===0)
  );
}
export function validateTwelveStep(stepId, answers={}){
  switch(stepId){
    case 'educationStatus': return answers.educationStatus ? '' : 'Please select your education status.';
    case 'streamV2': return answers.streamV2 ? '' : 'Please select a stream.';
    case 'subjectInterests': return (answers.subjectInterests||[]).length ? '' : 'Select at least one subject.';
    case 'interestArea': return answers.interestArea ? '' : 'Please choose an area.';
    case 'specificInterest': return answers.specificInterest ? '' : 'Please choose a specific direction.';
    case 'motivation': return answers.motivation ? '' : 'Please select what attracts you.';
    case 'workStyle': return answers.workStyle ? '' : 'Please select a work style.';
    case 'workEnvironment': return answers.workEnvironment ? '' : 'Please choose a work environment.';
    case 'careerPriorities': return (answers.careerPriorities||[]).length ? '' : 'Select up to 2 priorities.';
    case 'studyCommitment': return answers.studyCommitment ? '' : 'Please choose a study commitment.';
    case 'futureDirection': return answers.futureDirection ? '' : 'Please choose a future direction.';
    case 'decisionConfidence': return answers.decisionConfidence ? '' : 'Please select your confidence level.';
    default: return '';
  }
}
export function resolveTwelveSummary(answers={}){
  const pick = (list, val) => findOption(list, val)?.label || val || '';
  const picks = (list, vals) => (vals||[]).map(v=> findOption(list, v)?.label || v);
  return {
    educationStatus: { id: answers.educationStatus, label: pick(educationStatusOptions, answers.educationStatus) },
    stream: { id: answers.streamV2, label: findOption(twelveStreamOptions, normalizeTwelveStream(answers.streamV2))?.label || answers.streamV2 },
    subjectInterests: picks(getTwelveSubjectOptions(answers.streamV2), answers.subjectInterests),
    interestArea: { id: answers.interestArea, label: getInterestAreaMeta(answers.streamV2, answers.interestArea)?.label || answers.interestArea },
    specificInterest: { id: answers.specificInterest, label: findOption(getSpecificBranch(answers.interestArea)?.options||[], answers.specificInterest)?.label || answers.specificInterest },
    motivation: { id: answers.motivation, label: findOption(getMotivationBranch(answers.specificInterest, answers.interestArea)?.options||[], answers.motivation)?.label || answers.motivation },
    workStyle: { id: answers.workStyle, label: pick(twelveWorkStyleOptions, answers.workStyle) },
    workEnvironment: { id: answers.workEnvironment, label: pick(getFilteredEnvironments(answers), answers.workEnvironment) },
    careerPriorities: picks(careerPriorityOptions, answers.careerPriorities),
    studyCommitment: { id: answers.studyCommitment, label: pick(studyCommitmentOptions, answers.studyCommitment) },
    futureDirection: { id: answers.futureDirection, label: pick(futureDirectionOptions, answers.futureDirection) },
    decisionConfidence: { id: answers.decisionConfidence, label: pick(decisionConfidenceOptions, answers.decisionConfidence) },
  };
}












