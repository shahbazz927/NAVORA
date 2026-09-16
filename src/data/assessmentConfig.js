/**
 * NOVERA — Assessment Flow Configuration
 *
 * Single source of truth for the restructured questionnaire architecture:
 *
 *   TOP LEVEL: Class 12 · Graduation · Parent
 *
 *   Class 12   → student_class12   (degree/career direction after Class 12)
 *   Graduation → student_graduation (career/skills from existing degree)
 *   Parent     → parent_class10 | parent_class12 | parent_graduation
 *
 * Class 10 exists ONLY inside the Parent flow (parent_class10). There is no
 * student_class10 and no Class 10 option at the top level.
 *
 * The graduation cascade (family → degree → specialization → interests → skills)
 * reuses the authoritative degree configuration in graduationDegreeConfig.js so
 * MBBS is directly visible and every degree/specialization surfaces only its
 * own relevant interests and skills — never mixed categories.
 */
import graduationDegrees, {
  getSpecializations,
  getDegreeProfile,
} from './graduationDegreeConfig.js';

export const TOP_LEVEL_HEADING = 'What kind of guidance are you looking for?';
export const TOP_LEVEL_SUPPORT =
  "Tell us where you or your child is right now, and we'll guide you from there.";

export const TOP_LEVEL_OPTIONS = [
  {
    value: 'class12',
    title: 'Class 12',
    description:
      "I've completed Class 12 and want help choosing the right degree or career direction.",
    emoji: '🎓',
  },
  {
    value: 'graduation',
    title: 'Graduation',
    description:
      "I'm already pursuing graduation and want guidance on skills, careers and what to do next.",
    emoji: '🎒',
  },
  {
    value: 'parent',
    title: 'Parent',
    description: "I'm looking for education or career guidance for my child.",
    emoji: '👨‍👩‍👧',
  },
];

export const PARENT_STAGE_HEADING = 'Where is your child in their education journey?';
export const PARENT_STAGE_SUPPORT =
  'A few simple questions will help us understand what kind of guidance would be most useful.';

export const PARENT_STAGE_OPTIONS = [
  { value: 'class10', title: 'Class 10', description: 'Your child is completing or has just completed Class 10.', emoji: '🎒' },
  { value: 'class12', title: 'Class 12', description: 'Your child has completed Class 12.', emoji: '🎓' },
  { value: 'graduation', title: 'Graduation', description: 'Your child is already pursuing graduation.', emoji: '🏛️' },
];

export const FLOWS = {
  student_class12: { label: 'Class 12 Guidance', speaks: 'student', resultTitle: 'Your Degree & Career Direction' },
  student_graduation: { label: 'Graduation Career & Skills Guidance', speaks: 'student', resultTitle: 'Your Career Direction' },
  parent_class10: { label: 'Parent · Class 10 Guidance', speaks: 'parent', resultTitle: "Your Child's Academic Direction" },
  parent_class12: { label: 'Parent · Class 12 Guidance', speaks: 'parent', resultTitle: "Your Child's Degree & Career Direction" },
  parent_graduation: { label: 'Parent · Graduation Guidance', speaks: 'parent', resultTitle: "Your Child's Career Direction" },
};

export const GRADUATION_FAMILIES = [
  'Engineering',
  'Medicine & Healthcare',
  'Computer Applications',
  'Commerce & Finance',
  'Business & Management',
  'Science',
  'Arts & Humanities',
  'Law',
  'Design & Creative',
  'Agriculture & Environment',
  'Education',
  'Other Professional Programs',
];

export function degreesForFamily(family) {
  return graduationDegrees.filter((d) => d.family === family);
}

export function degreeHasSpecializations(degreeLabel) {
  const degree = graduationDegrees.find((d) => d.label === degreeLabel);
  return !!degree && Array.isArray(degree.specializations) && degree.specializations.length > 0;
}

export function specOptions(degreeLabel) {
  return getSpecializations(degreeLabel).map((s) => ({ value: s.label, label: s.label }));
}

export function resolveProfile(degree, specialization) {
  return getDegreeProfile(degree, specialization);
}

// ── Graduation degree stage (stable IDs, duration-aware labels) ──
export const GRAD_DEGREE_STAGE_IDS = ['year_1', 'year_2', 'year_3', 'final_year', 'recently_graduated'];
const DEGREE_DURATION_YEARS = {
  'MBBS': 5, 'BDS': 5, 'BAMS': 5, 'BHMS': 5, 'BUMS': 5, 'BSMS': 5, 'BNYS': 5,
  'B.Sc Nursing': 4, 'BPT / Physiotherapy': 4, 'BOT / Occupational Therapy': 4,
  'B.Pharm': 4, 'Pharm.D': 6, 'B.Sc Medical Laboratory Technology': 3, 'B.Sc Radiology / Medical Imaging': 3,
  'B.Sc Optometry': 4, 'B.Sc Cardiac Care Technology': 3, 'B.Sc Anaesthesia Technology': 3, 'B.Sc Operation Theatre Technology': 3,
  'B.Sc Respiratory Therapy': 3, 'B.Sc Dialysis Technology': 3, 'B.Sc Emergency / Trauma Care': 3, 'Other Healthcare Degree': 3,
  'B.Tech / B.E.': 4, 'BCA': 3, 'B.Sc Computer Science': 3, 'B.Sc Information Technology': 3, 'B.Sc Data Science': 3, 'B.Sc Artificial Intelligence': 3, 'B.Sc Cybersecurity': 3, 'B.Sc Computer Applications': 3, 'Other Computing Degree': 3,
  'B.Com': 3, 'BBA': 3, 'B.Sc': 3, 'BA': 3, 'Law': 3, 'Design / Creative': 4, 'Agriculture / Environment': 4,
  'Education': 2, 'Hotel Management': 4, 'Hospitality': 3, 'Tourism': 3, 'Aviation': 3, 'Logistics': 3, 'Event Management': 3, 'Other': 3,
};
export function gradDegreeStageOptions(degreeLabel) {
  const dur = DEGREE_DURATION_YEARS[degreeLabel] || 3;
  const all = [
    { value: 'year_1', label: '1st year' },
    { value: 'year_2', label: '2nd year' },
    { value: 'year_3', label: '3rd year' },
    { value: 'final_year', label: 'Final year' },
    { value: 'recently_graduated', label: 'Recently graduated' },
  ];
  if (dur <= 2) {
    return all.filter((o) => o.value !== 'year_3');
  }
  if (dur === 3) {
    // For 3-year programmes, 3rd year IS final year — hide duplicate 3rd year entry and keep final_year
    return all.filter((o) => o.value !== 'year_3');
  }
  return all;
}
export function gradDegreeStageLabel(stageId) {
  const all = gradDegreeStageOptions('__any__');
  // fallback map covers filtered cases too
  const map = { year_1: '1st year', year_2: '2nd year', year_3: '3rd year', final_year: 'Final year', recently_graduated: 'Recently graduated' };
  return map[stageId] || stageId;
}
// ── Class 12 (student wording) ───────────────────────────────
export const CLASS12_STREAM_HEADING = 'First, what did you study in Class 11 and 12?';
export const CLASS12_STREAMS = [
  { value: 'mpc', label: 'MPC' },
  { value: 'bipc', label: 'BiPC' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'arts', label: 'Arts / Humanities' },
  { value: 'other', label: 'Other' },
  { value: 'not_sure', label: 'Not sure / Exploring' },
];

// Resolve either a stored stream id ('mpc') or a legacy label ('MPC').
export function resolveStreamId(raw) {
  if (!raw) return '';
  if (CLASS12_STREAMS.some((s) => s.value === raw)) return raw;
  return (CLASS12_STREAMS.find((s) => s.label === raw) || {}).value || '';
}

export const CLASS12_SUBJECTS_HEADING = 'Which subjects did you study or enjoy the most?';
export const PARENT_CLASS12_SUBJECTS_HEADING = 'Which subjects did your child study or enjoy the most?';

// Subjects are rendered according to the selected stream — never mixed.
export const CLASS12_SUBJECTS = {
  mpc: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Other'],
  bipc: ['Biology', 'Physics', 'Chemistry', 'Other'],
  commerce: ['Accountancy', 'Economics', 'Business Studies', 'Mathematics', 'Other'],
  arts: ['History', 'Political Science', 'Economics', 'Psychology', 'Sociology', 'Languages / Literature', 'Other'],
  other: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Commerce / Business', 'Humanities', 'Computers', 'Other'],
  not_sure: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Commerce / Business', 'Humanities', 'Computers', 'Other'],
};

export const CLASS12_THINK_HEADING = 'Now that Class 12 is complete, what are you thinking about?';

export const CLASS12_STREAM_DIRECTIONS = {
  mpc: ['Engineering', 'Computer Science', 'Artificial Intelligence / Data Science', 'Architecture', 'Pure Sciences', 'Mathematics / Statistics', 'Economics', 'Defence', 'Other', 'Still exploring'],
  bipc: ['Medicine', 'Dentistry', 'Pharmacy', 'Nursing', 'Physiotherapy', 'Biotechnology', 'Life Sciences', 'Agriculture', 'Allied Healthcare', 'Other', 'Still exploring'],
  commerce: ['Commerce & Finance', 'Accounting', 'Banking', 'Investment', 'Business Management', 'Economics', 'Business Analytics', 'Professional Finance', 'Entrepreneurship', 'Other', 'Still exploring'],
  arts: ['Psychology', 'Law', 'Journalism / Media', 'Economics', 'Social Sciences', 'Languages', 'Design', 'Public Administration', 'Teaching / Education', 'Other', 'Still exploring'],
};

export const CLASS12_WORK_HEADING = 'What kind of work do you think you would enjoy in the long run?';

// Work areas depend on the selected stream — only relevant categories are shown.
export const CLASS12_WORK_AREAS = {
  mpc: [
    'Computer Science & Software', 'AI & Machine Learning', 'Electronics & Robotics',
    'Engineering', 'Mathematics & Data', 'Architecture & Design',
    'Defence / Government', 'Exploring',
  ],
  bipc: [
    'Medicine & Patient Care', 'Pharmacy & Medicines', 'Biological Sciences & Research',
    'Psychology & Human Behaviour', 'Agriculture & Life Sciences', 'Nutrition & Food Science',
    'Allied Healthcare', 'Exploring',
  ],
  commerce: [
    'Finance & Investment', 'Accounting', 'Business Management', 'Economics',
    'Marketing', 'Banking', 'Entrepreneurship', 'Exploring',
  ],
  arts: [
    'Psychology', 'Law', 'Economics', 'Journalism & Media', 'Political Science / Public Policy',
    'Sociology', 'Languages & Literature', 'Design & Creative Fields', 'Education', 'Exploring',
  ],
  other: [
    'Technology', 'Healthcare', 'Business & Finance', 'Government / Public Service',
    'Design & Creative', 'Skilled trades / Practical work', 'Not sure',
  ],
  not_sure: [
    'Technology', 'Healthcare', 'Business & Finance', 'Government / Public Service',
    'Design & Creative', 'Skilled trades / Practical work', 'Not sure',
  ],
};

// ── Context-aware follow-up: "What attracts you most about this path?" ──────
// The question wording and options depend on BOTH the stream (Step 1) and the
// chosen direction (Step: interest). Falls back to stream-level and then
// generic options so every combination renders something meaningful.
export const CLASS12_ATTRACT_HEADING = 'What attracts you most about this path?';
export const PARENT_CLASS12_ATTRACT_HEADING = 'What seems to attract your child most about this path?';

const CLASS12_ATTRACT_BY_STREAM = {
  mpc: {
    'Computer Science': ['Software development', 'Cybersecurity', 'Data Science', 'Cloud / Systems', 'Application development', 'Not sure'],
    'Artificial Intelligence / Data Science': ['Building intelligent systems', 'Solving complex problems', 'Working with data', 'Creating new technology', 'AI research', 'Still figuring it out'],
    Engineering: ['Designing and building things', 'Solving physical problems', 'Machines & mechanisms', 'Infrastructure & construction', 'Innovation & new products', 'Still figuring it out'],
    Architecture: ['Designing spaces', 'Creativity & aesthetics', 'Blending art with engineering', 'Urban planning', 'Sustainable design', 'Still figuring it out'],
    'Pure Sciences': ['Understanding how nature works', 'Laboratory research', 'Experiments & discovery', 'Space & physics', 'Teaching & academia', 'Still figuring it out'],
    'Mathematics / Statistics': ['Solving abstract problems', 'Patterns & logic', 'Data & probability', 'Quantitative modelling', 'Teaching mathematics', 'Still figuring it out'],
    Economics: ['Understanding markets', 'Analysing data & trends', 'Policy & society', 'Financial reasoning', 'Research', 'Still figuring it out'],
    Defence: ['Serving the nation', 'Discipline & leadership', 'Physical fitness', 'Aviation & technology', 'A structured career', 'Still figuring it out'],
  },
  bipc: {
    Medicine: ['Understanding diseases', 'Diagnosing problems', 'Treating patients', 'Solving complex medical problems', 'Helping people directly', 'Still figuring it out'],
    Dentistry: ['Oral healthcare', 'Precision work', 'Patient interaction', 'Cosmetic dentistry', 'Clinical practice', 'Still figuring it out'],
    Pharmacy: ['Understanding medicines', 'Drug development', 'Helping patients with medication', 'Pharmaceutical industry', 'Research', 'Still figuring it out'],
    Nursing: ['Patient care', 'Working in hospitals', 'Compassionate care', 'Clinical procedures', 'Being part of healthcare teams', 'Still figuring it out'],
    Physiotherapy: ['The human body & movement', 'Rehabilitation', 'Hands-on therapy', 'Sports science', 'Helping recovery', 'Still figuring it out'],
    Biotechnology: ['Lab research', 'Genetic engineering', 'Innovating in healthcare', 'Scientific problem solving', 'Working on new technology', 'Still figuring it out'],
    'Life Sciences': ['Understanding living organisms', 'Research & experiments', 'Lab work', 'Environmental biology', 'Scientific discovery', 'Still figuring it out'],
    Agriculture: ['Farming & food systems', 'Agri research', 'Environment & sustainability', 'Rural development', 'Agri-business', 'Still figuring it out'],
    'Allied Healthcare': ['Diagnostics & lab technology', 'Patient support', 'Medical equipment', 'Healthcare technology', 'Working alongside doctors', 'Still figuring it out'],
  },
  commerce: {
    'Commerce & Finance': ['Understanding markets', 'Analysing companies', 'Managing money', 'Wealth creation', 'Business news & trends', 'Still figuring it out'],
    Accounting: ['Numbers & accuracy', 'Auditing & compliance', 'Financial records', 'Taxation', 'Structured, precise work', 'Still figuring it out'],
    Banking: ['Financial services', 'Customer relationships', 'Loans & credit', 'A stable career', 'Understanding money flows', 'Still figuring it out'],
    Investment: ['Investing & markets', 'Stock analysis', 'Portfolio building', 'Risk & returns', 'Financial research', 'Still figuring it out'],
    'Business Management': ['Leading teams', 'Strategy & planning', 'Organising operations', 'Business growth', 'Entrepreneurial thinking', 'Still figuring it out'],
    Economics: ['Understanding markets & policy', 'Data & trends', 'Solving economic problems', 'Research', 'Global affairs', 'Still figuring it out'],
    'Business Analytics': ['Working with data', 'Business insights', 'Dashboards & tools', 'Better decision-making', 'Problem solving', 'Still figuring it out'],
    'Professional Finance': ['Financial analysis', 'Corporate finance', 'Certifications like CA / CFA', 'Wealth management', 'Precision & rigour', 'Still figuring it out'],
    Entrepreneurship: ['Building something of my own', 'New ideas', 'Taking initiative', 'Solving real problems', 'Independence', 'Still figuring it out'],
  },
  arts: {
    Psychology: ['Understanding human behaviour', 'Helping people', 'Counselling', 'Research on the mind', 'Mental health', 'Still figuring it out'],
    Law: ['Arguing & reasoning', 'Justice & fairness', 'Courtrooms & cases', 'Constitution & rights', 'Corporate law', 'Still figuring it out'],
    'Journalism / Media': ['Storytelling', 'Current affairs', 'Writing & reporting', 'Digital media', 'Public speaking', 'Still figuring it out'],
    Economics: ['Markets & policy', 'Data & analysis', 'Global issues', 'Research', 'Financial reasoning', 'Still figuring it out'],
    'Social Sciences': ['Understanding society', 'People & cultures', 'Research', 'Social change', 'Public issues', 'Still figuring it out'],
    Languages: ['Literature & writing', 'Languages & communication', 'Creative writing', 'Translation', 'Teaching', 'Still figuring it out'],
    Design: ['Creativity & aesthetics', 'Visual expression', 'Designing products', 'Problem solving through design', 'Technology & art', 'Still figuring it out'],
    'Public Administration': ['Governance & policy', 'Serving the public', 'Civil services', 'Administration', 'Social impact', 'Still figuring it out'],
    'Teaching / Education': ['Sharing knowledge', 'Mentoring others', 'Academic depth', 'Shaping young minds', 'A structured career', 'Still figuring it out'],
  },
};

const CLASS12_ATTRACT_GENERIC = {
  mpc: ['Solving interesting problems', 'Building & creating things', 'Working with technology', 'Research & discovery', 'Understanding how things work', 'Still figuring it out'],
  bipc: ['Understanding living things', 'Helping people stay healthy', 'Lab & research work', 'Scientific discovery', 'Working with people', 'Still figuring it out'],
  commerce: ['Understanding business', 'Working with numbers', 'Markets & money', 'Leading & organising', 'Building a career in finance', 'Still figuring it out'],
  arts: ['Understanding people & society', 'Writing & communication', 'Creative expression', 'Research & ideas', 'Making a social impact', 'Still figuring it out'],
  other: ['Solving problems', 'Working with people', 'Creative work', 'Practical, hands-on work', 'Learning new things', 'Still figuring it out'],
  not_sure: ['Solving problems', 'Working with people', 'Creative work', 'Practical, hands-on work', 'Learning new things', 'Still figuring it out'],
};

export function attractOptionsFor(streamId, interest) {
  const byInterest = CLASS12_ATTRACT_BY_STREAM[streamId] || {};
  return byInterest[interest] || CLASS12_ATTRACT_GENERIC[streamId] || CLASS12_ATTRACT_GENERIC.other;
}

export const CLASS12_SKILLS_HEADING = 'What are you already good at?';

// Skills depend on the stream + chosen direction — only relevant strengths
// are shown. Falls back to stream-level and then the generic list.
const CLASS12_SKILLS_BY_STREAM = {
  mpc: {
    'Computer Science': ['Programming basics', 'Problem Solving', 'Mathematics', 'Logical Reasoning', 'Computers & Tools', 'Attention to detail'],
    'Artificial Intelligence / Data Science': ['Mathematics', 'Statistics & Probability', 'Working with data', 'Logical Reasoning', 'Coding fundamentals', 'Analytical thinking'],
    Engineering: ['Physics & Maths fundamentals', 'Problem Solving', 'Practical Work', 'Building & tinkering', 'Logical Reasoning', 'Teamwork'],
    Architecture: ['Drawing & Sketching', 'Creativity', 'Spatial thinking', 'Mathematics', 'Design sense', 'Practical Work'],
    'Pure Sciences': ['Scientific Thinking', 'Physics', 'Chemistry', 'Lab & observation skills', 'Curiosity & questioning', 'Mathematics'],
    'Mathematics / Statistics': ['Mathematics', 'Logical Reasoning', 'Pattern recognition', 'Analytical thinking', 'Problem Solving', 'Attention to detail'],
    Economics: ['Analytical thinking', 'Mathematics', 'Writing', 'Current affairs awareness', 'Data interpretation', 'Communication'],
    Defence: ['Physical fitness', 'Discipline & routine', 'Leadership', 'Teamwork', 'Decision making under pressure', 'Communication'],
  },
  bipc: {
    Medicine: ['Biology', 'Chemistry', 'Memory & recall', 'Empathy & care', 'Scientific Thinking', 'Handling pressure'],
    Dentistry: ['Biology', 'Fine motor precision', 'Patience & care', 'Chemistry', 'Attention to detail', 'Communication'],
    Pharmacy: ['Chemistry', 'Biology', 'Attention to detail', 'Memory & recall', 'Scientific Thinking', 'Communication'],
    Nursing: ['Biology', 'Empathy & care', 'Communication', 'Patience', 'Teamwork', 'Handling pressure'],
    Physiotherapy: ['Biology', 'Anatomy & body mechanics', 'Practical Work', 'Empathy & care', 'Physical fitness', 'Communication'],
    Biotechnology: ['Biology', 'Chemistry', 'Lab skills', 'Scientific Thinking', 'Analytical thinking', 'Research & documentation'],
    'Life Sciences': ['Biology', 'Observation & lab skills', 'Scientific Thinking', 'Curiosity & questioning', 'Writing & documentation', 'Analytical thinking'],
    Agriculture: ['Biology', 'Practical / field work', 'Observation skills', 'Environment awareness', 'Problem Solving', 'Patience'],
    'Allied Healthcare': ['Biology', 'Lab & equipment handling', 'Attention to detail', 'Empathy & care', 'Teamwork', 'Scientific Thinking'],
  },
  commerce: {
    'Commerce & Finance': ['Business Thinking', 'Numbers & accounting basics', 'Current affairs awareness', 'Communication', 'Analysis', 'Excel & data handling'],
    Accounting: ['Numbers & accuracy', 'Accounting basics', 'Attention to detail', 'Excel & data handling', 'Discipline & routine', 'Analysis'],
    Banking: ['Communication', 'Numbers & accounting basics', 'Business Thinking', 'Trust & reliability', 'Current affairs awareness', 'Analysis'],
    Investment: ['Analysis', 'Numbers & accuracy', 'Current affairs / market awareness', 'Mathematics', 'Research & reading', 'Decision making'],
    'Business Management': ['Leadership', 'Communication', 'Organisation & planning', 'Teamwork', 'Business Thinking', 'Problem Solving'],
    Economics: ['Analytical thinking', 'Writing & expression', 'Current affairs awareness', 'Data interpretation', 'Mathematics', 'Communication'],
    'Business Analytics': ['Excel & data handling', 'Analytical thinking', 'Mathematics', 'Computers & Tools', 'Problem Solving', 'Attention to detail'],
    'Professional Finance': ['Numbers & accuracy', 'Accounting basics', 'Analysis', 'Discipline & routine', 'Attention to detail', 'Mathematics'],
    Entrepreneurship: ['Creativity', 'Leadership', 'Communication', 'Risk taking & initiative', 'Problem Solving', 'Business Thinking'],
  },
  arts: {
    Psychology: ['Empathy & listening', 'Understanding people', 'Communication', 'Observation', 'Writing', 'Patience'],
    Law: ['Reading & comprehension', 'Argumentation & reasoning', 'Writing', 'Memory & recall', 'Confidence & speaking', 'Analysis'],
    'Journalism / Media': ['Writing', 'Communication', 'Storytelling', 'Current affairs awareness', 'Creativity', 'Research & interviewing'],
    Economics: ['Analytical thinking', 'Data interpretation', 'Writing & expression', 'Current affairs awareness', 'Mathematics', 'Communication'],
    'Social Sciences': ['Understanding people & society', 'Reading & comprehension', 'Research & writing', 'Empathy & listening', 'Analysis', 'Communication'],
    Languages: ['Writing', 'Reading & comprehension', 'Communication', 'Creativity', 'Memory & recall', 'Storytelling'],
    Design: ['Creativity', 'Drawing & Sketching', 'Visual sense', 'Practical Work', 'Observation', 'Problem Solving'],
    'Public Administration': ['Reading & comprehension', 'Writing', 'Current affairs awareness', 'Leadership', 'Organisation & planning', 'Communication'],
    'Teaching / Education': ['Communication', 'Patience', 'Explanation & clarity', 'Empathy & listening', 'Organisation & planning', 'Leadership'],
  },
};

const CLASS12_SKILLS_GENERIC = {
  mpc: ['Problem Solving', 'Mathematics', 'Physics', 'Chemistry', 'Computers', 'Communication'],
  bipc: ['Biology', 'Chemistry', 'Scientific Thinking', 'Empathy & care', 'Communication', 'Practical Work'],
  commerce: ['Business Thinking', 'Communication', 'Numbers & accounting basics', 'Analysis', 'Leadership', 'Excel & data handling'],
  arts: ['Writing', 'Communication', 'Creativity', 'Understanding people & society', 'Analysis', 'Leadership'],
};

export function skillsFor(streamId, interest) {
  const byInterest = CLASS12_SKILLS_BY_STREAM[streamId] || {};
  const list = byInterest[interest] || CLASS12_SKILLS_GENERIC[streamId] || CLASS12_SKILLS;
  return [...new Set([...list, 'Other', 'Not sure yet'])];
}
export const CLASS12_SKILLS = ['Problem Solving', 'Mathematics', 'Communication', 'Writing', 'Biology', 'Scientific Thinking', 'Computers', 'Creativity', 'Leadership', 'Business Thinking', 'Analysis', 'Practical Work', 'Other', 'Not sure yet'];

export const CLASS12_PRIORITY_HEADING = 'What matters most when choosing your next step?';
export const CLASS12_PRIORITIES = ['Good career opportunities', 'Good earning potential', 'Job stability', 'My interest', 'Higher studies', 'Government career', 'Opportunities abroad', 'Entrepreneurship', 'I want help understanding my options'];

// ── Parent Class 12 (parent wording) ─────────────────────────
export const PARENT_CLASS12_STREAM_HEADING = 'What did your child study in Class 11 and 12?';
export const PARENT_CLASS12_THINK_HEADING = 'Now that Class 12 is complete, what are they thinking about?';
export const PARENT_CLASS12_WORK_HEADING = 'What kind of work do you feel would keep your child interested in the long run?';
export const PARENT_CLASS12_PRIORITY_HEADING = 'When choosing a degree, what matters most to you?';
export const PARENT_CLASS12_CLARITY_HEADING = 'How clear is the decision right now?';
export const PARENT_CLASS12_CLARITY = ["We've already decided", 'We have two or three options', 'We know the field but not the degree', "We're completely confused"];

// ── Parent Class 10 (parent wording; ONLY inside parent) ─────
export const PARENT_CLASS10_HEADINGS = {
  enjoy: 'Tell us a little about your child. What do they naturally enjoy?',
  strongest: 'Where do you feel they are strongest at school?',
  future: 'When you imagine their future, what kind of work do you think they might enjoy?',
  clarity: 'How clear is your child about what they want?',
  priority: 'What matters most to you when choosing their direction?',
};

// ── Result builders ──────────────────────────────────────────
export function buildGraduationResult(answers, isParent = false) {
  const degree = answers.degree;
  const family = answers.family || '';
  const specialization = answers.specialization || degree || '';
  const degreeStage = answers.degreeStage || answers.degree_stage || '';
  const profile = degree ? resolveProfile(degree, specialization) : null;
  const subject = isParent ? 'your child' : 'you';
  const subjectPoss = isParent ? "your child's" : 'your';

  if (!profile) {
    return {
      careers: [], strengths: [], strengthen: [],
      nextText: `Choose a degree first — then ${subject} can see a tailored career direction.`,
      profile: null, degreeStage,
    };
  }

  const isOther = degree === 'Other' || specialization === 'Other' || profile.id === 'other' || profile.id?.startsWith('other_');
  const selectedSkillIds = answers.skills || [];
  const selectedInterests = answers.interests || [];
  const skillMap = {};
  (Object.values(profile.skills || {}).flat() || []).forEach((s) => { skillMap[s.value] = s.label; });
  const interestMap = {};
  (profile.interests || []).forEach((i) => { interestMap[i.value] = i.label; });

  const profileLabel = specialization && specialization !== degree ? specialization : degree;
  const stageLabel = degreeStage ? gradDegreeStageLabel(degreeStage) : '';
  const interestLabels = selectedInterests.map((v) => interestMap[v] || v);
  const skillLabels = selectedSkillIds.map((v) => skillMap[v] || v);

  // Score each career using composite signal: interest relevance + skill overlap + direction is handled via filtering/boost outside, but here avoid single-skill strong fit
  const scoredCareers = (profile.careers || []).map((c) => {
    const required = profile.requiredSkills?.[c.value] || [];
    const overlap = required.filter((s) => selectedSkillIds.includes(s)).length;
    const interestOverlap = selectedInterests.filter((i) => {
      // career value often not directly interest, so use required skills as proxy plus name match
      return false;
    }).length;
    // Use skill overlap + interest count jointly for fit; don't let 1 skill give strong
    let score = 0;
    if (required.length) score = overlap / required.length;
    // interest broadens: if any selected interest, give base 0.2 so Worth exploring not empty
    const hasInterestSignal = selectedInterests.length > 0;
    let fit = 'Worth exploring';
    // Need at least 2 matching skills or 60% ratio to be Strong
    if ((overlap >= 2 && score >= 0.5) || overlap >= 3) fit = 'Strong match';
    else if (overlap >= 1 || hasInterestSignal) fit = 'Good match';
    // For Other, cap at Good match to reduce false specificity
    if (isOther && fit === 'Strong match') fit = 'Good match';
    const requiredLabels = required.map((s) => skillMap[s] || s);
    const missing = required.filter((s) => !selectedSkillIds.includes(s));
    // Build why: explain which signals influenced
    const whyParts = [];
    whyParts.push(`${profileLabel} background`);
    if (interestLabels.length) whyParts.push(`interest in ${interestLabels.slice(0, 2).join(', ')}`);
    if (skillLabels.length) whyParts.push(`strength in ${skillLabels.slice(0, 2).join(', ')}`);
    if (degreeStage) whyParts.push(`${stageLabel}`);
    const why = `${whyParts.join(' + ')} points toward this route${isOther ? ' — broaden with family-level guidance' : ''}.`;
    return {
      label: c.label,
      value: c.value,
      fit,
      why,
      missing,
      requiredLabels,
      overlap,
      score,
    };
  });

  // Sort by overlap/score desc but keep deterministic: strong first
  scoredCareers.sort((a, b) => b.overlap - a.overlap || b.score - a.score);
  const careers = scoredCareers.slice(0, 4);

  const topCareers = careers.slice(0, 2);
  const strengthenSet = [];
  topCareers.forEach((c) => c.missing.forEach((s) => {
    if (strengthenSet.indexOf(s) === -1) strengthenSet.push(s);
  }));
  const strengthen = strengthenSet.slice(0, 6).map((s) => skillMap[s] || s);
  const strengths = selectedSkillIds.map((s) => skillMap[s] || s);

  // Build nextText with direction + stage context — stage determines guidance
  let nextText = `Build on the strengths ${isParent ? 'they already' : 'you already'} have and take a concrete step toward ${topCareers[0]?.label || 'your chosen direction'}.`;
  if (answers.direction) {
    const resolved = getGraduationDirections({ family, degree, specialization, degreeStage }).find((d) => d.value === answers.direction) || GRAD_DIRECTION.find((d) => d.value === answers.direction) || gradDirectionForFamily(family).find((d) => d.value === answers.direction);
    const dir = resolved;
    if (dir) {
      let stageHint = '';
      if (degreeStage === 'year_1' || degreeStage === 'year_2') stageHint = ' — focus on foundations, relevant projects, internships and skill building.';
      else if (degreeStage === 'final_year') stageHint = ' — focus on placements, portfolio, internships, applications, interview preparation and higher-study planning.';
      else if (degreeStage === 'recently_graduated') stageHint = ' — focus on job applications, postgraduate applications, professional qualifications, portfolio/resume and relevant entrance exams.';
      else stageHint = '.';
      nextText = `${dir.label} is ${subjectPoss} goal — start by closing the key skill gaps above and getting relevant practical experience${stageHint}`;
      if (isOther) nextText += ' Since the degree was marked as Other, treat this as broad guidance and confirm with family-level options.';
    }
  } else if (isOther) {
    nextText += ' (Broad guidance — degree was marked as Other.)';
  }

  return { careers, strengths, strengthen, nextText, profile: { family, degree, specialization, degreeStage, interests: selectedInterests, skills: selectedSkillIds }, degreeStage, isOther };
}

// When a student is still exploring (no specific interest), their answer to
// "what kind of work would you enjoy" points us toward a concrete direction
// within the stream. Keys must match CLASS12_WORK values; values must match a
// key in CLASS12_REC[stream].interestDegree so no degrees are invented.
const CLASS12_WORK_TO_INTEREST = {
  mpc: {
    'Computer Science & Software': 'Computer Science',
    'AI & Machine Learning': 'Artificial Intelligence / Data Science',
    'Electronics & Robotics': 'Pure Sciences',
    Engineering: 'Pure Sciences',
    'Mathematics & Data': 'Mathematics / Statistics',
    'Architecture & Design': 'Architecture',
    'Defence / Government': 'Defence',
  },
  bipc: {
    'Medicine & Patient Care': 'Medicine',
    'Pharmacy & Medicines': 'Pharmacy',
    'Biological Sciences & Research': 'Life Sciences',
    'Psychology & Human Behaviour': 'Psychology',
    'Agriculture & Life Sciences': 'Agriculture',
    'Nutrition & Food Science': 'Allied Healthcare',
    'Allied Healthcare': 'Allied Healthcare',
  },
  commerce: {
    'Finance & Investment': 'Investment',
    Accounting: 'Accounting',
    'Business Management': 'Business Management',
    Economics: 'Commerce & Finance',
    Marketing: 'Business Management',
    Banking: 'Banking',
    Entrepreneurship: 'Entrepreneurship',
  },
  arts: {
    Psychology: 'Psychology',
    Law: 'Law',
    Economics: 'Economics',
    'Journalism & Media': 'Journalism / Media',
    'Political Science / Public Policy': 'Public Administration',
    Sociology: 'Sociology',
    'Design & Creative Fields': 'Design',
    Education: 'Teaching / Education',
  },
};

const CLASS12_REC = {
  mpc: {
    base: {
      degree: 'B.Tech (Engineering)',
      why: ['MPC is the direct feeder for engineering, technology and quantitative degrees.', 'Your interests and priorities point to a technical, problem-solving foundation.'],
      alternatives: ['B.Sc Computer Science / Data Science', 'B.Sc Mathematics & Statistics', 'B.Arch'],
      careers: ['Software Engineer', 'Data Scientist', 'Electronics Engineer', 'Research Scientist'],
    },
    interestDegree: {
      'Computer Science': { degree: 'B.Tech CS / B.Sc Computer Science', careers: ['Software Engineer', 'Full-stack Developer', 'Systems Engineer'] },
      'Artificial Intelligence / Data Science': { degree: 'B.Tech AI / B.Sc Data Science', careers: ['AI Engineer', 'Data Scientist', 'ML Engineer'] },
      'Pure Sciences': { degree: 'B.Sc (Pure Sciences)', careers: ['Research Scientist', 'Scientist (ISRO/DRDO)'] },
      'Mathematics / Statistics': { degree: 'B.Sc Mathematics / Statistics', careers: ['Actuary', 'Data Analyst', 'Statistician'] },
      'Architecture': { degree: 'B.Arch', careers: ['Architect', 'Urban Planner'] },
      'Economics': { degree: 'BA/B.Sc Economics', careers: ['Economist', 'Financial Analyst'] },
      'Defence': { degree: 'NDA / B.Tech + Armed Forces', careers: ['Defence Officer', 'Aeronautical Engineer'] },
    },
    exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'NDA'],
    skills: ['Physics & Maths fundamentals', 'Problem solving', 'Coding fundamentals'],
  },
  bipc: {
    base: {
      degree: 'MBBS / Medicine',
      why: ['BiPC is the standard route into medicine and the health sciences.', 'Your choices favour a people-focused, scientific career in healthcare.'],
      alternatives: ['BDS (Dentistry)', 'B.Pharm (Pharmacy)', 'B.Sc Biotechnology / Life Sciences'],
      careers: ['Doctor (MBBS → MD/MS)', 'Pharmacist', 'Biotechnologist', 'Clinical Researcher'],
    },
    interestDegree: {
      'Medicine': { degree: 'MBBS / Medicine', careers: ['Doctor', 'Surgeon', 'Medical Researcher'] },
      'Dentistry': { degree: 'BDS (Dentistry)', careers: ['Dentist', 'Orthodontist'] },
      'Pharmacy': { degree: 'B.Pharm / Pharm.D', careers: ['Pharmacist', 'Clinical Pharmacologist'] },
      'Nursing': { degree: 'B.Sc Nursing', careers: ['Registered Nurse', 'Nurse Practitioner'] },
      'Physiotherapy': { degree: 'BPT (Physiotherapy)', careers: ['Physiotherapist', 'Rehabilitation Specialist'] },
      'Biotechnology': { degree: 'B.Sc / B.Tech Biotechnology', careers: ['Biotechnologist', 'Research Associate'] },
      'Life Sciences': { degree: 'B.Sc Life Sciences', careers: ['Research Assistant', 'Lab Scientist'] },
      'Agriculture': { degree: 'B.Sc Agriculture', careers: ['Agri Scientist', 'Agri-business Officer'] },
      'Allied Healthcare': { degree: 'B.Sc Allied Health Sciences', careers: ['Lab Technologist', 'Radiology Technologist'] },
      'Psychology': { degree: 'BA Psychology', careers: ['Psychologist', 'Counsellor'] },
    },
    exams: ['NEET UG'],
    skills: ['Biology & Chemistry depth', 'Scientific reasoning', 'Patient empathy'],
  },
  commerce: {
    base: {
      degree: 'B.Com (Hons) / BBA',
      why: ['Commerce is the natural entry into business, accounting and finance.', 'Your priorities align with a stable, growth-oriented career track.'],
      alternatives: ['B.Com + CA / CS', 'BBA (Management)', 'BA Economics'],
      careers: ['Accountant', 'Financial Analyst', 'Banking Professional', 'Business Manager'],
    },
    interestDegree: {
      'Accounting': { degree: 'B.Com + CA / ACCA', careers: ['Chartered Accountant', 'Auditor'] },
      'Commerce & Finance': { degree: 'B.Com (Finance)', careers: ['Financial Analyst', 'Investment Banker'] },
      'Banking': { degree: 'B.Com (Banking)', careers: ['Bank Officer', 'Relationship Manager'] },
      'Investment': { degree: 'B.Com Finance / CFA path', careers: ['Investment Analyst', 'Portfolio Manager'] },
      'Business Management': { degree: 'BBA + MBA', careers: ['Business Manager', 'Consultant'] },
      'Entrepreneurship': { degree: 'BBA (Entrepreneurship)', careers: ['Entrepreneur', 'Startup Founder'] },
    },
    exams: ['CUET', 'CA Foundation', 'IPMAT', 'NPAT'],
    skills: ['Accounting basics', 'Excel & data analysis', 'Business communication'],
  },
  arts: {
    base: {
      degree: 'BA (your chosen discipline)',
      why: ['Arts offers flexible, people- and idea-driven pathways.', 'Your interests point toward a career built on thinking, empathy and communication.'],
      alternatives: ['BA LLB (Law)', 'BA Psychology', 'B.Des (Design)'],
      careers: ['Content / Media Professional', 'HR Specialist', 'Political Analyst', 'Journalist'],
    },
    interestDegree: {
      'Law': { degree: 'BA LLB / Bachelor of Law', careers: ['Lawyer', 'Corporate Counsel'] },
      'Psychology': { degree: 'BA Psychology', careers: ['Psychologist', 'Counsellor'] },
      'Design': { degree: 'B.Des (Design)', careers: ['Product Designer', 'UX Designer'] },
      'Journalism / Media': { degree: 'BA Journalism / Mass Communication', careers: ['Journalist', 'Content Strategist'] },
      'Teaching / Education': { degree: 'BA + B.Ed', careers: ['Teacher', 'Education Consultant'] },
      'Public Administration': { degree: 'BA Public Administration', careers: ['Civil Services', 'Administrator'] },
      'Economics': { degree: 'BA Economics', careers: ['Economist', 'Policy Analyst'] },
      'Sociology': { degree: 'BA Sociology / Social Work', careers: ['Sociologist', 'Social Worker'] },
    },
    exams: ['CUET', 'CLAT', 'NID / UCEED'],
    skills: ['Reading & writing', 'Critical thinking', 'Communication'],
  },
};

export function buildClass12Result(answers, isParent = false) {
  // Accept either stored ids ('mpc') or legacy label values ('MPC').
  const streamIdByLabel = {};
  (CLASS12_STREAMS || []).forEach((s) => { streamIdByLabel[s.label] = s.value; });
  const raw = answers.stream || '';
  const stream = CLASS12_REC[raw] ? raw : streamIdByLabel[raw] || 'other';
  const rec = CLASS12_REC[stream];
  const subject = isParent ? 'your child' : 'you';
  const their = isParent ? 'their' : 'your';

  if (!rec) {
    return {
      headline: 'General degree direction',
      degrees: ['Speak to a counsellor to shortlist the right degree'],
      why: [], alternatives: [], careers: [], exams: [], skills: [],
      next: 'Explore stream-aligned degrees and talk through your options.',
    };
  }

  const interest = answers.interest || '';
  const work = answers.work || '';
  const skills = answers.skills || [];
  const priority = answers.priority || '';
  const clarity = answers.clarity || '';

  const exploring = !interest || interest === 'Still exploring';

  // If no specific interest yet, use the kind of work they enjoy to land on a
  // concrete direction within the stream (never invents a degree).
  let targetInterest = interest;
  if (exploring && work && CLASS12_WORK_TO_INTEREST[stream]?.[work]) {
    targetInterest = CLASS12_WORK_TO_INTEREST[stream][work];
  }

  const over = targetInterest ? rec.interestDegree[targetInterest] : null;
  const degree = over ? over.degree : rec.base.degree;
  const careers = over ? over.careers : rec.base.careers;

  const why = [rec.base.why[0]];

  if (over && !exploring) {
    why.push(`${degree} is a strong match for ${their} interest in ${targetInterest.toLowerCase()} and the ${stream.toUpperCase()} stream.`);
  } else if (over && exploring) {
    why.push(`Since ${subject} is still exploring, we used ${their} interest in ${work.toLowerCase()} to point toward ${degree}.`);
  } else if (exploring) {
    why.push(`Since ${subject} is still exploring, we’ve started with the most common path from the ${stream.toUpperCase()} stream — we can narrow it down together.`);
  }

  if (priority) {
    why.push(`You said “${priority.toLowerCase()}” matters most, so we’ve kept that in view while shortlisting.`);
  }

  const nextParts = [
    `Shortlist colleges offering ${degree}, and start building the foundations listed above while ${subject} prepares for ${rec.exams.join(', ')}.`,
  ];
  if (skills && skills.length) {
    nextParts.push(`Build on ${subject}'s strengths in ${skills.slice(0, 3).join(', ').toLowerCase()}.`);
  }
  if (isParent && clarity) {
    nextParts.push(`Because ${subject} ${clarity.toLowerCase()}, revisit this once the decision settles a little.`);
  }

  return {
    headline: degree,
    degrees: [degree, ...rec.base.alternatives],
    why,
    alternatives: rec.base.alternatives,
    careers,
    exams: rec.exams,
    skills: rec.skills,
    next: nextParts.join(' '),
  };
}

export function buildParentClass10Result(answers) {
  const asString = (v) => (Array.isArray(v) ? v[0] || '' : typeof v === 'string' ? v : '');
  const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  const enjoy = asList(answers.enjoy);
  const strongest = asList(answers.strongest);
  const future = asString(answers.future);
  const priority = asString(answers.priority);
  const streamNames = { mpc: 'MPC', bipc: 'BiPC', commerce: 'Commerce', arts: 'Arts / Humanities' };
  const score = { mpc: 0, bipc: 0, commerce: 0, arts: 0 };

  enjoy.forEach((e) => {
    if (e === 'Solving maths problems' || e === 'Understanding science' || e === 'Computers & technology') score.mpc += 1;
    if (e === 'Biology & healthcare' || e === 'Understanding science') score.bipc += 1;
    if (e === 'Business & money' || e === 'Understanding people & society') score.commerce += 1;
    if (e === 'Reading & writing' || e === 'Design & creativity' || e === 'Understanding people & society') score.arts += 1;
  });

  // Subjects they are strong in corroborate the interest signals above.
  strongest.forEach((s) => {
    if (s === 'Mathematics' || s === 'Computer Science') score.mpc += 1;
    if (s === 'Physics') { score.mpc += 1; score.bipc += 1; }
    if (s === 'Chemistry') { score.mpc += 0.5; score.bipc += 1; }
    if (s === 'Biology') score.bipc += 1;
    if (s === 'Social Studies' || s === 'Languages') score.arts += 1;
    if (s === 'Commerce / Business') score.commerce += 1;
  });

  const futureMap = {
    Technology: 'mpc', 'Medicine or healthcare': 'bipc', Business: 'commerce', 'Science or research': 'mpc',
    Design: 'arts', 'Media or communication': 'arts', 'Law or public service': 'arts',
    'Building or creating things': 'mpc', 'Agriculture or environment': 'bipc',
  };
  if (futureMap[future]) score[futureMap[future]] += 2;

  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const top = sorted[0] && sorted[0][1] > 0 ? sorted[0][0] : null;
  const fitLabel = sorted[0] && sorted[0][1] >= 3 ? 'Strong fit' : sorted[0] && sorted[0][1] >= 2 ? 'Good option' : 'Worth exploring';

  const allPaths = [
    { name: 'MPC', detail: 'Engineering, technology & quantitative careers.', paths: ['JEE Main', 'BITSAT', 'NDA'] },
    { name: 'BiPC', detail: 'Medicine, health & life sciences.', paths: ['NEET UG'] },
    { name: 'Commerce', detail: 'Business, accounting & finance.', paths: ['CUET', 'CA Foundation'] },
    { name: 'Arts / Humanities', detail: 'Design, law, media & social sciences.', paths: ['CLAT', 'NID', 'CUET'] },
    { name: 'Diploma / Polytechnic', detail: 'Hands-on technical careers after Class 10.', paths: ['Polytechnic entry'] },
    { name: 'ITI / Vocational', detail: 'Practical, skill-based trades.', paths: ['ITI admission'] },
  ];

  const recommended = top
    ? allPaths.filter((d) => d.name === streamNames[top]).concat(allPaths.filter((d) => d.name !== streamNames[top]).slice(0, 2))
    : allPaths.slice(0, 3);

  return {
    headline: top ? streamNames[top] : 'Exploring paths',
    recommended,
    fitLabel,
    why: [
      `Your child’s interests${future ? ` and the kind of work you imagine for them (${future.toLowerCase()})` : ''} align most closely with ${top ? streamNames[top] : 'an open, exploratory path'}.`,
      priority ? `Your priority — ${priority.toLowerCase()} — is reflected in the options suggested.` : 'We’ll keep options flexible so nothing is locked in too early.',
    ],
    next: top
      ? `Begin by exploring ${streamNames[top]}-linked subjects and giving ${streamNames[top]} a gentle try through projects, olympiads or hobby classes before a firm choice.`
      : 'Give a few streams a light try and let us refine this together as things become clearer.',
  };
}

export const CLASS12_STEPS = [
  { key: 'stream', single: true },
  { key: 'subjects', streamDep: true, multi: true, max: 3 },
  { key: 'interest', streamDep: true, single: true },
  { key: 'work', streamDep: true, single: true },
  { key: 'attract', streamDep: true, single: true },
  { key: 'skills', multi: true, max: 4 },
  { key: 'priority', single: true },
];

export const CLASS10_STEPS = [
  { key: 'enjoy', multi: true, max: 3 },
  { key: 'strongest', multi: true, max: 3 },
  { key: 'future', single: true },
  { key: 'clarity', single: true },
  { key: 'priority', single: true },
];

export const PARENT_CLASS10_ENJOY = ['Solving maths problems', 'Understanding science', 'Computers & technology', 'Business & money', 'Biology & healthcare', 'Reading & writing', 'Design & creativity', 'Understanding people & society', 'Practical / hands-on activities', "They're still figuring it out"];

export const PARENT_CLASS10_STRONGEST = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Social Studies', 'Languages', 'Commerce / Business', 'Multiple subjects equally', 'Not sure'];

export const PARENT_CLASS10_FUTURE = ['Building or creating things', 'Technology', 'Medicine or healthcare', 'Business', 'Science or research', 'Design', 'Law or public service', 'Media or communication', 'Agriculture or environment', 'Practical or field-based work', "We're not sure yet"];

export const PARENT_CLASS10_CLARITY = ['They already have a clear idea', 'They have a few ideas', 'They keep changing their mind', "They haven't thought much about it", "We're completely unsure"];

export const PARENT_CLASS10_PRIORITY = ['A stable career', 'Good earning potential', 'Their interest and happiness', 'Strong future opportunities', 'Government career opportunities', 'Opportunities abroad', 'A balance between interest and career prospects', 'I mainly want to understand what suits them'];

export const GRAD_DIRECTION = [
  { value: 'start_working', label: 'Start working' },
  { value: 'higher_studies', label: 'Higher studies' },
  { value: 'specialize', label: 'Specialize further' },
  { value: 'government', label: 'Government career' },
  { value: 'business', label: 'Start a business' },
  { value: 'abroad', label: 'Work abroad' },
  { value: 'research', label: 'Research' },
  { value: 'still_exploring', label: 'Still exploring' },
];

/**
 * Degree-aware direction resolver — the authoritative source for what a
 * graduate can do next. Profile/degree is checked first; family is only a
 * fallback. Values stay within GRAD_DIRECTION so scoring keeps working —
 * only labels are contextualized.
 */
const GRAD_DIRECTIONS_BY_PROFILE = {
  // ── Medicine & Healthcare — strictly separated
  'mbbs': [
    { value: 'start_working', label: 'Start clinical practice' },
    { value: 'specialize', label: 'Prepare for postgraduate medical specialization (MD / MS / DNB)' },
    { value: 'higher_studies', label: 'Higher studies in medicine (MD / MS / DNB)' },
    { value: 'research', label: 'Medical research' },
    { value: 'government', label: 'Government hospital / public health' },
    { value: 'abroad', label: 'Practice or study abroad (USMLE / PLAB…)' },
    { value: 'business', label: 'Healthcare administration / venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bds': [
    { value: 'start_working', label: 'Start dental practice' },
    { value: 'specialize', label: 'Prepare for postgraduate dental specialization (MDS)' },
    { value: 'higher_studies', label: 'Higher studies — MDS / dental postgraduate' },
    { value: 'research', label: 'Dental research' },
    { value: 'government', label: 'Dental public-health / government' },
    { value: 'abroad', label: 'Work or study abroad in dentistry' },
    { value: 'business', label: 'Start your own dental practice / venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bams': [
    { value: 'start_working', label: 'Start Ayurvedic practice' },
    { value: 'specialize', label: 'Postgraduate specialization (MD Ayurveda)' },
    { value: 'higher_studies', label: 'Higher studies — MD Ayurveda' },
    { value: 'research', label: 'Ayurvedic research' },
    { value: 'abroad', label: 'Work or study abroad (Ayurveda / wellness)' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bhms': [
    { value: 'start_working', label: 'Start homeopathic practice' },
    { value: 'specialize', label: 'Postgraduate specialization (MD Homeopathy)' },
    { value: 'higher_studies', label: 'Higher studies — MD Homeopathy' },
    { value: 'research', label: 'Homeopathic research' },
    { value: 'abroad', label: 'Work or study abroad' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bums': [
    { value: 'start_working', label: 'Start Unani practice' },
    { value: 'specialize', label: 'Postgraduate specialization (MD Unani)' },
    { value: 'higher_studies', label: 'Higher studies — MD Unani' },
    { value: 'research', label: 'Unani research' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsms': [
    { value: 'start_working', label: 'Start Siddha practice' },
    { value: 'specialize', label: 'Postgraduate specialization (MD Siddha)' },
    { value: 'higher_studies', label: 'Higher studies — MD Siddha' },
    { value: 'research', label: 'Siddha research' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bnys': [
    { value: 'start_working', label: 'Start naturopathy / yoga practice' },
    { value: 'specialize', label: 'Postgraduate specialization (MD Naturopathy)' },
    { value: 'higher_studies', label: 'Higher studies — MD Naturopathy' },
    { value: 'research', label: 'Naturopathy research' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsc_nursing': [
    { value: 'start_working', label: 'Start nursing practice' },
    { value: 'specialize', label: 'Postgraduate nursing specialization (M.Sc Nursing)' },
    { value: 'higher_studies', label: 'Higher studies — M.Sc Nursing' },
    { value: 'government', label: 'Government / public-health nursing' },
    { value: 'research', label: 'Nursing research' },
    { value: 'abroad', label: 'Work or study abroad in nursing' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bpt': [
    { value: 'start_working', label: 'Start physiotherapy practice' },
    { value: 'specialize', label: 'Postgraduate physiotherapy specialization (MPT)' },
    { value: 'higher_studies', label: 'Higher studies — MPT' },
    { value: 'research', label: 'Physiotherapy / rehabilitation research' },
    { value: 'abroad', label: 'Work or study abroad in physiotherapy' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bot': [
    { value: 'start_working', label: 'Start occupational therapy practice' },
    { value: 'specialize', label: 'Postgraduate OT specialization' },
    { value: 'higher_studies', label: 'Higher studies — MOT' },
    { value: 'research', label: 'OT research' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bpharm': [
    { value: 'start_working', label: 'Start in pharmacy practice' },
    { value: 'higher_studies', label: 'Higher studies — M.Pharm' },
    { value: 'specialize', label: 'Pharmaceutical specialization / industry' },
    { value: 'research', label: 'Clinical / pharma research' },
    { value: 'government', label: 'Regulatory / government pharmacy roles' },
    { value: 'abroad', label: 'Work or study abroad (pharmacy / pharma)' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'pharmd': [
    { value: 'start_working', label: 'Start clinical pharmacy practice' },
    { value: 'higher_studies', label: 'Higher studies — M.Pharm / specialization' },
    { value: 'research', label: 'Clinical research / pharmacovigilance' },
    { value: 'abroad', label: 'Work or study abroad' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsc_medical_lab': [
    { value: 'start_working', label: 'Start as medical laboratory technologist' },
    { value: 'higher_studies', label: 'Higher studies — M.Sc MLT' },
    { value: 'research', label: 'Diagnostic / lab research' },
    { value: 'government', label: 'Government / hospital lab roles' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsc_radiology': [
    { value: 'start_working', label: 'Start as radiology / imaging technologist' },
    { value: 'higher_studies', label: 'Higher studies — M.Sc Radiology / Imaging' },
    { value: 'research', label: 'Imaging research' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsc_optometry': [
    { value: 'start_working', label: 'Start optometry practice' },
    { value: 'higher_studies', label: 'Higher studies — M.Optom' },
    { value: 'specialize', label: 'Specialize (low vision, contact lens, etc.)' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsc_cardiac': [
    { value: 'start_working', label: 'Start as cardiac care technologist' },
    { value: 'higher_studies', label: 'Higher studies in cardiac technology' },
    { value: 'research', label: 'Cardiac research' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsc_anaesthesia': [
    { value: 'start_working', label: 'Start as anaesthesia technologist' },
    { value: 'higher_studies', label: 'Higher studies in anaesthesia technology' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsc_ot_technology': [
    { value: 'start_working', label: 'Start as operation theatre technologist' },
    { value: 'higher_studies', label: 'Higher studies in OT technology' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsc_respiratory': [
    { value: 'start_working', label: 'Start as respiratory therapist' },
    { value: 'higher_studies', label: 'Higher studies in respiratory care' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsc_dialysis': [
    { value: 'start_working', label: 'Start as dialysis technologist' },
    { value: 'higher_studies', label: 'Higher studies in dialysis technology' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bsc_emergency': [
    { value: 'start_working', label: 'Start as emergency / trauma care specialist' },
    { value: 'higher_studies', label: 'Higher studies in emergency medicine' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  // ── Engineering profiles
  'btech_cse': [
    { value: 'start_working', label: 'Start a software / IT career' },
    { value: 'specialize', label: 'Specialize in AI / Data / Cloud / Security' },
    { value: 'higher_studies', label: 'Higher studies — M.Tech / MS (CSE)' },
    { value: 'research', label: 'Research (PhD in CS / AI)' },
    { value: 'government', label: 'Government / PSU technology roles' },
    { value: 'abroad', label: 'Work or study abroad (tech hubs)' },
    { value: 'business', label: 'Start a technology venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'btech_mechanical': [
    { value: 'start_working', label: 'Start as mechanical / design engineer' },
    { value: 'specialize', label: 'Specialize in EV / Robotics / Manufacturing' },
    { value: 'higher_studies', label: 'Higher studies — M.Tech Mechanical' },
    { value: 'government', label: 'Government / PSU (GATE / DRDO / PSC)' },
    { value: 'abroad', label: 'Work or study abroad' },
    { value: 'business', label: 'Start your own firm / consultancy' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  // ── Business & Commerce
  'bba_finance': [
    { value: 'start_working', label: 'Start a finance / business role' },
    { value: 'higher_studies', label: 'Higher studies — MBA / PGDM (Finance)' },
    { value: 'specialize', label: 'Specialize — CFA / FRM / CA' },
    { value: 'government', label: 'Banking / govt finance (IBPS, RBI, SSC)' },
    { value: 'abroad', label: 'Work or study abroad (finance)' },
    { value: 'business', label: 'Start a business / venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'bba_marketing': [
    { value: 'start_working', label: 'Start a marketing / brand role' },
    { value: 'higher_studies', label: 'Higher studies — MBA / PGDM (Marketing)' },
    { value: 'specialize', label: 'Specialize in digital / brand / consumer' },
    { value: 'abroad', label: 'Work or study abroad (marketing)' },
    { value: 'business', label: 'Start your own venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
};

/**
 * Graduation "career direction" options are tailored to the student's field, so
 * a Mechanical Engineering student and a Law student never see the same list.
 *
 * The option VALUES stay within the exact set used by GRAD_DIRECTION so the
 * scoring engine (careerEngine.js) and result builders keep working unchanged —
 * only the labels are made specific to each family. Any family without a
 * dedicated list falls back to the generic GRAD_DIRECTION.
 */
export const GRAD_DIRECTION_BY_FAMILY = {
  'Engineering': [
    { value: 'higher_studies', label: 'Higher studies (M.Tech / M.S. / MBA)' },
    { value: 'start_working', label: 'Start at an entry-level engineering role' },
    { value: 'specialize', label: 'Specialize (AI, Data, VLSI, EV, Robotics…)' },
    { value: 'government', label: 'Government / PSU jobs (GATE, PSC, DRDO)' },
    { value: 'research', label: 'R&D / Research path (PhD)' },
    { value: 'abroad', label: 'Work or study abroad' },
    { value: 'business', label: 'Start your own firm / consultancy' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Medicine & Healthcare': [
    { value: 'specialize', label: 'Post-graduate specialization (MD / MS / DNB)' },
    { value: 'higher_studies', label: 'Higher studies in your medical field' },
    { value: 'start_working', label: 'Start practicing / clinical work' },
    { value: 'government', label: 'Government hospitals / public health' },
    { value: 'research', label: 'Medical / clinical / lab research' },
    { value: 'abroad', label: 'Practice or study abroad (USMLE / PLAB…)' },
    { value: 'business', label: 'Open / run your own clinic or venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Computer Applications': [
    { value: 'start_working', label: 'Start as a software / IT professional' },
    { value: 'higher_studies', label: 'Higher studies (M.Tech CSE / MCA / M.S.)' },
    { value: 'specialize', label: 'Specialize (AI, Data Science, Cloud, Security)' },
    { value: 'government', label: 'Government IT / PSU roles' },
    { value: 'research', label: 'Research (PhD in CS / AI)' },
    { value: 'abroad', label: 'Work or study abroad (tech hubs)' },
    { value: 'business', label: 'Found a startup / freelance' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Commerce & Finance': [
    { value: 'start_working', label: 'Start a finance / accounting job' },
    { value: 'specialize', label: 'Specialize (CA, CFA, FRM, Actuary…)' },
    { value: 'higher_studies', label: 'Higher studies (M.Com / MBA / MSc Finance)' },
    { value: 'government', label: 'Banking / govt finance (IBPS, RBI, SSC)' },
    { value: 'research', label: 'Research / academia / data analysis' },
    { value: 'abroad', label: 'Finance roles or studies abroad' },
    { value: 'business', label: 'Start your own business / consultancy' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Business & Management': [
    { value: 'start_working', label: 'Start a management / operations role' },
    { value: 'business', label: 'Start your own venture' },
    { value: 'higher_studies', label: 'Higher studies (MBA / PGDM)' },
    { value: 'specialize', label: 'Specialize (Marketing, HR, Finance, Operations)' },
    { value: 'government', label: 'Government / public administration' },
    { value: 'abroad', label: 'Management roles or studies abroad' },
    { value: 'research', label: 'Research / academia (PhD in Management)' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Science': [
    { value: 'higher_studies', label: 'Higher studies (M.Sc / M.Tech)' },
    { value: 'research', label: 'Research (PhD / lab / academia)' },
    { value: 'specialize', label: 'Specialize in a science domain' },
    { value: 'start_working', label: 'Start a science-based job (analyst, lab, industry)' },
    { value: 'government', label: 'Govt research / scientist roles' },
    { value: 'abroad', label: 'Research or studies abroad' },
    { value: 'business', label: 'Start a science-based venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Arts & Humanities': [
    { value: 'higher_studies', label: 'Higher studies (MA / MSW / M.Phil)' },
    { value: 'start_working', label: 'Start working (content, media, admin)' },
    { value: 'specialize', label: 'Specialize (journalism, policy, psychology…)' },
    { value: 'government', label: 'Civil services / government exams' },
    { value: 'research', label: 'Research / academia' },
    { value: 'abroad', label: 'Study or work abroad' },
    { value: 'business', label: 'Freelance / creative venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Law': [
    { value: 'specialize', label: 'Specialize (corporate, criminal, IP, taxation…)' },
    { value: 'start_working', label: 'Start practice / litigation' },
    { value: 'higher_studies', label: 'Higher studies (LL.M)' },
    { value: 'government', label: 'Judiciary / legal advisory / govt exams' },
    { value: 'business', label: 'Corporate counsel / legal consultancy' },
    { value: 'abroad', label: 'Practice or LL.M abroad' },
    { value: 'research', label: 'Legal research / academia' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Design & Creative': [
    { value: 'start_working', label: 'Start as a design / creative professional' },
    { value: 'specialize', label: 'Specialize (UX/UI, Product, Graphic, Animation…)' },
    { value: 'higher_studies', label: 'Higher studies (M.Des / MFA)' },
    { value: 'business', label: 'Freelance / start your own studio' },
    { value: 'abroad', label: 'Creative roles or studies abroad' },
    { value: 'government', label: 'Govt / public sector creative roles' },
    { value: 'research', label: 'Design research / academia' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Agriculture & Environment': [
    { value: 'start_working', label: 'Start in agri / food / environmental roles' },
    { value: 'higher_studies', label: 'Higher studies (M.Sc / M.Tech agri)' },
    { value: 'research', label: 'Research (agri-science, climate, biodiversity)' },
    { value: 'government', label: 'Govt agri / environmental roles' },
    { value: 'business', label: 'Agri-business / agritech venture' },
    { value: 'abroad', label: 'Work or study abroad in agri / env' },
    { value: 'specialize', label: 'Specialize (horticulture, forestry, env mgmt)' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Education': [
    { value: 'start_working', label: 'Start teaching / training' },
    { value: 'higher_studies', label: 'Higher studies (M.Ed / B.Ed route)' },
    { value: 'specialize', label: 'Specialize (special ed, ed-tech, curriculum)' },
    { value: 'government', label: 'Teacher eligibility / govt education roles' },
    { value: 'research', label: 'Education research / academia' },
    { value: 'business', label: 'Ed-tech / start your own institute' },
    { value: 'abroad', label: 'Teach or study abroad' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  //__FAMILIES_MORE__
};

/**
 * Resolve the career direction options to show for a graduation student,
 * based on the broad field (family) they selected. Falls back to the generic
 * list when no tailored set exists.
 */
export function gradDirectionForFamily(family = '') {
  return GRAD_DIRECTION_BY_FAMILY[family] || GRAD_DIRECTION;
}
export function getGraduationDirections({ family = '', degree = '', specialization = '', degreeStage = '' } = {}) {
  const profile = degree ? resolveProfile(degree, specialization || degree) : null;
  if (profile?.id && GRAD_DIRECTIONS_BY_PROFILE[profile.id]) return GRAD_DIRECTIONS_BY_PROFILE[profile.id];
  // Spec-specific fallbacks not covered above
  if (degree === 'B.Tech / B.E.' && specialization) {
    const spec = specialization.toLowerCase();
    if (spec.includes('computer') || spec.includes('ai') || spec.includes('data') || spec.includes('cybersecurity') || spec.includes('information')) return GRAD_DIRECTIONS_BY_PROFILE['btech_cse'];
    if (spec.includes('mechanical')) return GRAD_DIRECTIONS_BY_PROFILE['btech_mechanical'];
  }
  if (degree === 'BBA' && specialization) {
    if (specialization === 'Finance') return GRAD_DIRECTIONS_BY_PROFILE['bba_finance'];
    if (specialization === 'Marketing') return GRAD_DIRECTIONS_BY_PROFILE['bba_marketing'];
  }
  // Family fallback
  if (family && GRAD_DIRECTION_BY_FAMILY[family]) return GRAD_DIRECTION_BY_FAMILY[family];
  return GRAD_DIRECTION;
}