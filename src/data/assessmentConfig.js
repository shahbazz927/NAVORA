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
// ── Class 12 (student wording) ───────────────────────────────
export const CLASS12_STREAM_HEADING = 'First, what did you study in Class 11 and 12?';
export const CLASS12_STREAMS = [
  { value: 'mpc', label: 'MPC' },
  { value: 'bipc', label: 'BiPC' },
  { value: 'mec', label: 'MEC' },
  { value: 'cec', label: 'CEC' },
  { value: 'not_sure', label: 'Not Sure / Exploring' },
];

// Backward-compat: commerce→mec, arts→cec, other→not_sure
const LEGACY_STREAM_MAP = { commerce: 'mec', arts: 'cec', other: 'not_sure', science_pcm: 'mpc', science_pcb: 'bipc' };
export function resolveStreamId(raw) {
  if (!raw) return '';
  const norm = String(raw).toLowerCase().trim();
  if (LEGACY_STREAM_MAP[norm]) return LEGACY_STREAM_MAP[norm];
  if (CLASS12_STREAMS.some((s) => s.value === norm)) return norm;
  // also match by label (MPC etc)
  const byLabel = CLASS12_STREAMS.find((s) => s.label.toLowerCase() === norm);
  if (byLabel) return byLabel.value;
  return '';
}

export const CLASS12_SUBJECTS_HEADING = 'Which subjects did you study or enjoy the most?';
export const PARENT_CLASS12_SUBJECTS_HEADING = 'Which subjects did your child study or enjoy the most?';

// Subjects are rendered according to the selected stream — never mixed.
export const CLASS12_SUBJECTS = {
  mpc: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Other'],
  bipc: ['Biology', 'Physics', 'Chemistry', 'Other'],
  mec: ['Mathematics', 'Economics', 'Commerce / Business Studies', 'Accountancy', 'Other'],
  cec: ['Civics / Political Science', 'Economics', 'Commerce / Business Studies', 'History', 'Other'],
  // legacy aliases kept for backward compat
  commerce: ['Mathematics', 'Economics', 'Commerce / Business Studies', 'Accountancy', 'Other'],
  arts: ['Civics / Political Science', 'Economics', 'Commerce / Business Studies', 'History', 'Other'],
  other: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Commerce / Business', 'Humanities', 'Computers', 'Other'],
  not_sure: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Commerce / Business', 'Humanities', 'Computers', 'Other'],
};

export const CLASS12_THINK_HEADING = 'Now that Class 12 is complete, what are you thinking about?';

export const CLASS12_STREAM_DIRECTIONS = {
  mpc: ['Engineering', 'Computer Science', 'Artificial Intelligence / Data Science', 'Architecture', 'Pure Sciences', 'Mathematics / Statistics', 'Economics', 'Defence', 'Other', 'Still exploring'],
  bipc: ['Medicine', 'Dentistry', 'Pharmacy', 'Nursing', 'Physiotherapy', 'Biotechnology', 'Life Sciences', 'Agriculture', 'Allied Healthcare', 'Other', 'Still exploring'],
  mec: ['CA / Accounting', 'Finance', 'Economics', 'Banking', 'Business & Management', 'Investment & Financial Markets', 'Business Analytics', 'Actuarial / Data', 'Entrepreneurship', 'Other', 'Still exploring'],
  cec: ['Law', 'Government / Civil Services', 'Business & Management', 'Economics', 'Media & Communication', 'Social Sciences', 'Public Policy', 'Psychology', 'Other', 'Still exploring'],
  // legacy
  commerce: ['CA / Accounting', 'Finance', 'Economics', 'Banking', 'Business & Management', 'Investment & Financial Markets', 'Business Analytics', 'Actuarial / Data', 'Entrepreneurship', 'Other', 'Still exploring'],
  arts: ['Law', 'Government / Civil Services', 'Business & Management', 'Economics', 'Media & Communication', 'Social Sciences', 'Public Policy', 'Psychology', 'Other', 'Still exploring'],
  other: ['Technology', 'Healthcare', 'Business Management', 'Design', 'Education', 'Agriculture', 'Other', 'Still exploring'],
  not_sure: ['Technology', 'Medicine or healthcare', 'Business', 'Science or research', 'Design', 'Media or communication', 'Law or public service', 'Building or creating things', 'Agriculture or environment', 'Other', 'Still exploring'],
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
  mec: [
    'Finance & Investment', 'Accounting & Audit', 'Business Management & Analytics',
    'Banking', 'Economics & Policy', 'Investment & Markets', 'Entrepreneurship', 'Exploring',
  ],
  cec: [
    'Law & Legal Services', 'Government & Civil Services', 'Business & Management',
    'Economics & Policy', 'Media & Communication', 'Social Sciences & Public Policy',
    'Psychology & Human Behaviour', 'Exploring',
  ],
  // legacy
  commerce: [
    'Finance & Investment', 'Accounting & Audit', 'Business Management & Analytics',
    'Banking', 'Economics & Policy', 'Investment & Markets', 'Entrepreneurship', 'Exploring',
  ],
  arts: [
    'Law & Legal Services', 'Government & Civil Services', 'Business & Management',
    'Economics & Policy', 'Media & Communication', 'Social Sciences & Public Policy',
    'Psychology & Human Behaviour', 'Exploring',
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
  // MEC uses commerce logic but with maths emphasis; CEC uses arts/humanities logic
  mec: {
    'CA / Accounting': ['Numbers & accuracy', 'Auditing & compliance', 'Financial records', 'Taxation', 'Structured, precise work', 'Still figuring it out'],
    Finance: ['Investing & markets', 'Stock analysis', 'Portfolio building', 'Risk & returns', 'Financial research', 'Still figuring it out'],
    Economics: ['Understanding markets & policy', 'Data & trends', 'Solving economic problems', 'Research', 'Global affairs', 'Still figuring it out'],
    Banking: ['Financial services', 'Customer relationships', 'Loans & credit', 'A stable career', 'Understanding money flows', 'Still figuring it out'],
    'Business & Management': ['Leading teams', 'Strategy & planning', 'Organising operations', 'Business growth', 'Entrepreneurial thinking', 'Still figuring it out'],
    'Investment & Financial Markets': ['Investing & markets', 'Stock analysis', 'Portfolio building', 'Risk & returns', 'Financial research', 'Still figuring it out'],
    'Business Analytics': ['Working with data', 'Business insights', 'Dashboards & tools', 'Better decision-making', 'Problem solving', 'Still figuring it out'],
    'Actuarial / Data': ['Solving abstract problems', 'Patterns & logic', 'Data & probability', 'Quantitative modelling', 'Research', 'Still figuring it out'],
    Entrepreneurship: ['Building something of my own', 'New ideas', 'Taking initiative', 'Solving real problems', 'Independence', 'Still figuring it out'],
  },
  cec: {
    Law: ['Arguing & reasoning', 'Justice & fairness', 'Courtrooms & cases', 'Constitution & rights', 'Corporate law', 'Still figuring it out'],
    'Government / Civil Services': ['Governance & policy', 'Serving the public', 'Civil services', 'Administration', 'Social impact', 'Still figuring it out'],
    'Business & Management': ['Leading teams', 'Strategy & planning', 'Organising operations', 'Business growth', 'Entrepreneurial thinking', 'Still figuring it out'],
    Economics: ['Markets & policy', 'Data & analysis', 'Global issues', 'Research', 'Financial reasoning', 'Still figuring it out'],
    'Media & Communication': ['Storytelling', 'Current affairs', 'Writing & reporting', 'Digital media', 'Public speaking', 'Still figuring it out'],
    'Social Sciences': ['Understanding society', 'People & cultures', 'Research', 'Social change', 'Public issues', 'Still figuring it out'],
    'Public Policy': ['Governance & policy', 'Serving the public', 'Civil services', 'Administration', 'Social impact', 'Still figuring it out'],
    Psychology: ['Understanding human behaviour', 'Helping people', 'Counselling', 'Research on the mind', 'Mental health', 'Still figuring it out'],
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
  mec: ['Understanding business', 'Working with numbers', 'Markets & money', 'Leading & organising', 'Building a career in finance', 'Still figuring it out'],
  cec: ['Understanding people & society', 'Writing & communication', 'Creative expression', 'Research & ideas', 'Making a social impact', 'Still figuring it out'],
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

const MEC_SKILLS = {
  'CA / Accounting': ['Numbers & accuracy', 'Accounting basics', 'Attention to detail', 'Excel & data handling', 'Discipline & routine', 'Analysis'],
  Finance: ['Analysis', 'Numbers & accuracy', 'Current affairs / market awareness', 'Mathematics', 'Research & reading', 'Decision making'],
  Economics: ['Analytical thinking', 'Writing & expression', 'Current affairs awareness', 'Data interpretation', 'Mathematics', 'Communication'],
  Banking: ['Communication', 'Numbers & accounting basics', 'Business Thinking', 'Trust & reliability', 'Current affairs awareness', 'Analysis'],
  'Business & Management': ['Leadership', 'Communication', 'Organisation & planning', 'Teamwork', 'Business Thinking', 'Problem Solving'],
  'Investment & Financial Markets': ['Analysis', 'Mathematics', 'Current affairs / market awareness', 'Research & reading', 'Decision making', 'Numbers & accuracy'],
  'Business Analytics': ['Excel & data handling', 'Analytical thinking', 'Mathematics', 'Computers & Tools', 'Problem Solving', 'Attention to detail'],
  'Actuarial / Data': ['Mathematics', 'Statistics & Probability', 'Analytical thinking', 'Problem Solving', 'Attention to detail', 'Computers & Tools'],
  Entrepreneurship: ['Creativity', 'Leadership', 'Communication', 'Risk taking & initiative', 'Problem Solving', 'Business Thinking'],
};
const CEC_SKILLS = {
  Law: ['Reading & comprehension', 'Argumentation & reasoning', 'Writing', 'Memory & recall', 'Confidence & speaking', 'Analysis'],
  'Government / Civil Services': ['Reading & comprehension', 'Writing', 'Current affairs awareness', 'Leadership', 'Organisation & planning', 'Communication'],
  'Business & Management': ['Leadership', 'Communication', 'Organisation & planning', 'Teamwork', 'Business Thinking', 'Problem Solving'],
  Economics: ['Analytical thinking', 'Data interpretation', 'Writing & expression', 'Current affairs awareness', 'Mathematics', 'Communication'],
  'Media & Communication': ['Writing', 'Communication', 'Storytelling', 'Current affairs awareness', 'Creativity', 'Research & interviewing'],
  'Social Sciences': ['Understanding people & society', 'Reading & comprehension', 'Research & writing', 'Empathy & listening', 'Analysis', 'Communication'],
  'Public Policy': ['Reading & comprehension', 'Writing', 'Current affairs awareness', 'Leadership', 'Organisation & planning', 'Communication'],
  Psychology: ['Empathy & listening', 'Understanding people', 'Communication', 'Observation', 'Writing', 'Patience'],
};

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
  mec: MEC_SKILLS,
  cec: CEC_SKILLS,
};

const CLASS12_SKILLS_GENERIC = {
  mpc: ['Problem Solving', 'Mathematics', 'Physics', 'Chemistry', 'Computers', 'Communication'],
  bipc: ['Biology', 'Chemistry', 'Scientific Thinking', 'Empathy & care', 'Communication', 'Practical Work'],
  mec: ['Business Thinking', 'Numbers & accuracy', 'Mathematics', 'Analysis', 'Excel & data handling', 'Communication'],
  cec: ['Writing', 'Reading & comprehension', 'Communication', 'Analysis', 'Understanding people & society', 'Leadership'],
  commerce: ['Business Thinking', 'Communication', 'Numbers & accounting basics', 'Analysis', 'Leadership', 'Excel & data handling'],
  arts: ['Writing', 'Communication', 'Creativity', 'Understanding people & society', 'Analysis', 'Leadership'],
};

// (detailed MEC/CEC skills defined above — see MEC_SKILLS / CEC_SKILLS)

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
// Education decision point — recommends NEXT EDUCATION PATH after Class 10, NOT a career/job.
export const PARENT_CLASS10_HEADINGS = {
  enjoy: 'What subjects does your child enjoy most?',
  strongest: 'Which subjects does your child generally feel most comfortable learning?',
  learningStyle: 'How does your child prefer to learn?',
  interests: 'Which areas naturally attract your child’s attention?',
  direction: 'Does your child already have an idea about what they want to study after Class 10?',
  directionDetail: 'What are they currently considering?',
  pathway: 'Which type of path would suit your child better right now?',
  priority: 'What matters most when choosing the next step?',
};

// ── Result builders ──────────────────────────────────────────
export function buildGraduationResult(answers, isParent = false) {
  const degree = answers.degree;
  const specialization = answers.specialization || degree || '';
  const profile = degree ? resolveProfile(degree, specialization) : null;
  const subject = isParent ? 'your child' : 'you';

  if (!profile) {
    return {
      careers: [], strengths: [], strengthen: [],
      nextText: `Choose a degree first — then ${subject} can see a tailored career direction.`,
    };
  }

  const selectedSkillIds = answers.skills || [];
  const skillMap = {};
  (Object.values(profile.skills || {}).flat() || []).forEach((s) => { skillMap[s.value] = s.label; });

  const profileLabel = specialization && specialization !== degree ? specialization : degree;
  const interests = (answers.interests || []).slice(0, 3);

  const careers = (profile.careers || []).slice(0, 4).map((c) => {
    const required = profile.requiredSkills?.[c.value] || [];
    const overlap = required.filter((s) => selectedSkillIds.includes(s)).length;
    const ratio = required.length ? overlap / required.length : 0;
    let fit = 'Worth exploring';
    if (ratio >= 0.6 || overlap >= 3) fit = 'Strong fit';
    else if (overlap >= 1) fit = 'Good option';
    return {
      label: c.label,
      value: c.value,
      fit,
      why: `A natural next move for ${profileLabel}${interests.length ? `, matching the areas that interest ${subject} most` : ''}.`,
      missing: required.filter((s) => !selectedSkillIds.includes(s)),
    };
  });

  const topCareers = careers.slice(0, 2);
  const strengthenSet = [];
  topCareers.forEach((c) => c.missing.forEach((s) => {
    if (strengthenSet.indexOf(s) === -1) strengthenSet.push(s);
  }));
  const strengthen = strengthenSet.slice(0, 6).map((s) => skillMap[s] || s);
  const strengths = selectedSkillIds.map((s) => skillMap[s] || s);

  let nextText = `Build on the strengths ${isParent ? 'they already' : 'you already'} have and take a concrete step toward ${topCareers[0]?.label || 'your chosen direction'}.`;
  if (answers.direction) {
    const dir = gradDirectionForFamily(answers.family).find((d) => d.value === answers.direction)
      || GRAD_DIRECTION.find((d) => d.value === answers.direction);
    if (dir) nextText = `${dir.label} is ${isParent ? 'your child’s' : 'your'} goal — start by closing the key skill gaps above and getting relevant practical experience.`;
  }

  return { careers, strengths, strengthen, nextText };
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
  mec: {
    'Finance & Investment': 'Finance',
    'Accounting & Audit': 'CA / Accounting',
    'Business Management & Analytics': 'Business & Management',
    Banking: 'Banking',
    'Economics & Policy': 'Economics',
    'Investment & Markets': 'Investment & Financial Markets',
    Entrepreneurship: 'Entrepreneurship',
  },
  cec: {
    'Law & Legal Services': 'Law',
    'Government & Civil Services': 'Government / Civil Services',
    'Business & Management': 'Business & Management',
    'Economics & Policy': 'Economics',
    'Media & Communication': 'Media & Communication',
    'Social Sciences & Public Policy': 'Social Sciences',
    'Psychology & Human Behaviour': 'Psychology',
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
  mec: {
    base: {
      degree: 'B.Com (Hons) / BBA — MEC pathway',
      why: ['MEC combines mathematics with commerce — ideal for quantitative finance, analytics and economics.', 'Your priorities align with a path that rewards accuracy and analytical thinking.'],
      alternatives: ['B.Com + CA / CMA', 'BBA Business Analytics', 'BA Economics / B.Sc Statistics'],
      careers: ['Chartered Accountant', 'Financial Analyst', 'Business Analyst', 'Actuary'],
    },
    interestDegree: {
      'CA / Accounting': { degree: 'B.Com + CA / CMA', careers: ['Chartered Accountant', 'Auditor'] },
      Finance: { degree: 'B.Com (Finance) / BBA Finance', careers: ['Financial Analyst', 'Investment Banker'] },
      Economics: { degree: 'BA Economics / B.Sc Statistics', careers: ['Economist', 'Data Analyst'] },
      Banking: { degree: 'B.Com (Banking & Finance)', careers: ['Bank Officer', 'Relationship Manager'] },
      'Business & Management': { degree: 'BBA + MBA', careers: ['Business Manager', 'Consultant'] },
      'Investment & Financial Markets': { degree: 'B.Com Finance / CFA path', careers: ['Investment Analyst', 'Portfolio Manager'] },
      'Business Analytics': { degree: 'BBA Business Analytics / B.Sc Data', careers: ['Business Analyst', 'Data Analyst'] },
      'Actuarial / Data': { degree: 'B.Sc Actuarial / Statistics', careers: ['Actuary', 'Data Scientist'] },
      Entrepreneurship: { degree: 'BBA Entrepreneurship', careers: ['Entrepreneur', 'Startup Founder'] },
    },
    exams: ['CUET', 'CA Foundation', 'IPMAT', 'NPAT'],
    skills: ['Accounting basics', 'Mathematics & analytics', 'Excel & data handling'],
  },
  cec: {
    base: {
      degree: 'BA / BBA — CEC pathway',
      why: ['CEC blends civics and commerce — strong for law, governance, business and the social sciences.', 'Your interests point toward people, systems and ideas.'],
      alternatives: ['BA LLB (Law)', 'BBA (Management)', 'BA Political Science / Economics'],
      careers: ['Lawyer', 'Civil Servant', 'Business Manager', 'Policy Analyst'],
    },
    interestDegree: {
      Law: { degree: 'BA LLB / Bachelor of Law', careers: ['Lawyer', 'Corporate Counsel'] },
      'Government / Civil Services': { degree: 'BA Public Administration / Civil Services prep', careers: ['Civil Servant', 'Administrator'] },
      'Business & Management': { degree: 'BBA + MBA', careers: ['Business Manager', 'Consultant'] },
      Economics: { degree: 'BA Economics', careers: ['Economist', 'Policy Analyst'] },
      'Media & Communication': { degree: 'BA Journalism / Mass Communication', careers: ['Journalist', 'Content Strategist'] },
      'Social Sciences': { degree: 'BA Social Sciences', careers: ['Social Worker', 'Researcher'] },
      'Public Policy': { degree: 'BA Public Policy / Political Science', careers: ['Policy Analyst', 'Civil Servant'] },
      Psychology: { degree: 'BA Psychology', careers: ['Psychologist', 'Counsellor'] },
    },
    exams: ['CUET', 'CLAT', 'IPMAT'],
    skills: ['Reading & comprehension', 'Writing & reasoning', 'Critical thinking'],
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
  // Dedicated Not Sure discovery — don't force a stream
  const sidRaw = resolveStreamId(answers.stream || '');
  if (sidRaw === 'not_sure') {
    const priority = answers.priority || '';
    const work = answers.work || '';
    const interest = answers.interest || '';
    const subject = isParent ? 'your child' : 'you';
    const picks = [interest, work, priority].filter(Boolean).join(', ');
    return {
      headline: 'Exploring directions',
      degrees: ['B.Com / BBA', 'BA — choose by interest', 'B.Sc / Professional course — explore fit'],
      why: [
        `Since you are still exploring, we looked at what you enjoy and what matters to you${picks ? ` (${picks.toLowerCase()})` : ''} rather than assuming a stream.`,
        'Good guidance starts by understanding you — these directions are starting points to test, not a final verdict.',
      ],
      alternatives: ['Try a short project or shadowing in one of these areas', 'Compare 2–3 options on effort, cost and growth'],
      careers: ['Explore broadly — then narrow with the advisor'],
      exams: ['CUET', 'Stream-specific entrances — shortlist after you narrow'],
      skills: ['Curiosity', 'Communication', 'Analytical thinking'],
      next: `Based on your answers, these are areas worth exploring. Try a small, real-world exposure in one direction and revisit — ${subject} can refine this together with the advisor.`,
    };
  }
  // Accept either stored ids ('mpc') or legacy label values ('MPC').
  const streamIdByLabel = {};
  (CLASS12_STREAMS || []).forEach((s) => { streamIdByLabel[s.label] = s.value; });
  const raw = answers.stream || '';
  const rawNorm = resolveStreamId(raw) || raw;
  const stream = CLASS12_REC[rawNorm] ? rawNorm : (streamIdByLabel[raw] ? resolveStreamId(streamIdByLabel[raw]) : 'other');
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

/**
 * Class 10 Parent — EDUCATION DIRECTION engine.
 * Recommends NEXT EDUCATION PATH after Class 10 (stream / pathway), NOT a final career/job.
 * Stage-aware: recommendationType = NEXT_EDUCATION_PATH
 */
export function buildParentClass10Result(answers) {
  const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  const asString = (v) => (Array.isArray(v) ? v[0] || '' : typeof v === 'string' ? v : '');
  const enjoy = asList(answers.enjoy);
  const strongest = asList(answers.strongest);
  const learningStyle = asString(answers.learningStyle);
  const interests = asList(answers.interests);
  const direction = asString(answers.direction);
  const directionDetail = asString(answers.directionDetail);
  const pathway = asString(answers.pathway);
  const priority = asString(answers.priority);

  const score = { mpc: 0, bipc: 0, mec: 0, cec: 0, humanities: 0, diploma: 0, vocational: 0 };
  let uncertainSignals = 0;

  // Q1 enjoy — evidence, not auto-career
  enjoy.forEach((e) => {
    if (e === 'Mathematics') { score.mpc += 1; score.mec += 1; }
    if (e === 'Physics / Physical Science') { score.mpc += 1; }
    if (e === 'Biology / Life Science') { score.bipc += 1; }
    if (e === 'Social Studies') { score.cec += 1; score.humanities += 1; }
    if (e === 'Languages') { score.humanities += 1; score.cec += 0.5; }
    if (e === 'Computers / Technology') { score.mpc += 1; score.diploma += 0.5; }
    if (e === 'Commerce / Business') { score.mec += 1; score.cec += 1; }
    if (e === 'Creative subjects') { score.humanities += 1; score.vocational += 0.5; }
    if (e === "They're still figuring it out" || e === 'Other') uncertainSignals += 1;
  });
  // Q2 strongest — academic comfort
  strongest.forEach((s) => {
    if (s === 'Mathematics / problem solving') { score.mpc += 1; score.mec += 0.5; }
    if (s === 'Science / experiments') { score.bipc += 1; score.mpc += 0.5; }
    if (s === 'Biology / living systems') { score.bipc += 1; }
    if (s === 'Business / money / economics') { score.mec += 1; score.cec += 0.5; }
    if (s === 'Social sciences / current affairs') { score.cec += 1; score.humanities += 0.5; }
    if (s === 'Languages / communication') { score.humanities += 1; }
    if (s === 'Computers / technology') { score.mpc += 0.7; score.diploma += 0.5; }
    if (s === 'Creative / practical work') { score.vocational += 0.8; score.humanities += 0.5; score.diploma += 0.5; }
    if (s === 'Still unsure') uncertainSignals += 1;
  });
  // Q3 learning style — critical for academic vs practical
  if (learningStyle === 'Understanding concepts and solving problems') { score.mpc += 1; score.mec += 0.5; }
  if (learningStyle === 'Experiments and scientific learning') { score.bipc += 1; }
  if (learningStyle === 'Reading, discussion and explanation') { score.humanities += 1; score.cec += 0.7; }
  if (learningStyle === 'Practical / hands-on work') { score.diploma += 1; score.vocational += 1; }
  if (learningStyle === 'Building or working with technology') { score.mpc += 0.7; score.diploma += 1; }
  if (learningStyle === 'Business / real-world applications') { score.mec += 1; score.cec += 0.7; }
  if (learningStyle === 'A mix / not sure') uncertainSignals += 1;

  // Q4 interests — up to 3, NOT jobs
  interests.forEach((it) => {
    if (it === 'Technology') { score.mpc += 1; }
    if (it === 'Science') { score.mpc += 0.5; score.bipc += 0.5; }
    if (it === 'Healthcare') { score.bipc += 1; }
    if (it === 'Business') { score.mec += 0.7; score.cec += 0.5; }
    if (it === 'Finance') { score.mec += 1; }
    if (it === 'Law / social issues') { score.cec += 1; score.humanities += 0.5; }
    if (it === 'Design / creative work') { score.humanities += 1; }
    if (it === 'Government / public service') { score.cec += 0.7; score.humanities += 0.5; }
    if (it === 'Practical / technical work') { score.diploma += 1; score.vocational += 0.8; }
    if (it === 'Not sure') uncertainSignals += 1;
  });

  // Q5 direction — clarity, not forced career
  if (direction === 'Completely unsure') uncertainSignals += 1;
  // follow-up detail boosts that path modestly (but not overriding evidence)
  if (directionDetail) {
    const detailMap = {
      'MPC': 'mpc', 'BiPC': 'bipc', 'MEC': 'mec', 'CEC': 'cec',
      'Humanities': 'humanities', 'Diploma / Polytechnic': 'diploma', 'Vocational / Skill-based': 'vocational',
    };
    const k = detailMap[directionDetail];
    if (k) score[k] += 1.2;
  }

  // Q6 pathway — explicit academic vs practical preference
  if (pathway === 'Traditional academic route → Intermediate / 11th–12th → degree') {
    // slight nudge to academic streams, penalize vocational if no other signal
    if (score.vocational > 0) score.vocational -= 0.3;
    if (score.diploma > 0) score.diploma -= 0.3;
  }
  if (pathway === 'Practical / technical learning') { score.diploma += 1; score.vocational += 0.7; }
  if (pathway === 'Diploma / Polytechnic') { score.diploma += 2; }
  if (pathway === 'Vocational / skill-based route') { score.vocational += 2; }

  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const top = sorted[0] && sorted[0][1] > 0.5 ? sorted[0][0] : null;
  const topScore = sorted[0] ? sorted[0][1] : 0;

  // Education direction catalog — describes PATH, not job
  const catalog = {
    mpc: { name: 'MPC', detail: 'Mathematics, Physics, Chemistry — 11th–12th MPC stream', keepsOpen: 'MPC keeps engineering, technology, architecture and several science degree routes open.', check: 'Comfort with Mathematics, analytical workload, and availability of MPC at your preferred school/college.' },
    bipc: { name: 'BiPC', detail: 'Biology, Physics, Chemistry — 11th–12th BiPC stream', keepsOpen: 'BiPC keeps medicine, pharmacy, biotechnology, agriculture and life-sciences degree routes open.', check: 'Genuine interest in Biology and the commitment biPC subjects require.' },
    mec: { name: 'MEC', detail: 'Mathematics, Economics, Commerce — 11th–12th MEC stream', keepsOpen: 'MEC keeps finance, economics, business analytics and commerce degree routes open.', check: 'Enjoyment of Mathematics alongside economics/business curiosity.' },
    cec: { name: 'CEC', detail: 'Civics, Economics, Commerce — 11th–12th CEC stream', keepsOpen: 'CEC keeps law, governance, business, social sciences and media degree routes open.', check: 'Interest in commerce, social subjects, communication and governance.' },
    humanities: { name: 'Humanities', detail: 'Humanities / Arts — 11th–12th Humanities stream', keepsOpen: 'Humanities keeps arts, social sciences, psychology, languages, design and civil-services preparation open.', check: 'Strength in reading, writing, social understanding and creative/practical expression.' },
    diploma: { name: 'Diploma / Polytechnic', detail: 'Hands-on technical education after Class 10', keepsOpen: 'Diploma can lead to lateral entry into engineering or skilled technical roles.', check: 'Preference for practical learning and earlier specialization versus a traditional Intermediate year.' },
    vocational: { name: 'Vocational / Skill-based', detail: 'Skill-focused education after Class 10', keepsOpen: 'Vocational keeps skill-based roles, entrepreneurship and further specialized study open.', check: 'Whether skill-focused, hands-on learning suits your child better than a conventional classroom-heavy route.' },
  };

  const allPaths = Object.values(catalog).map((c) => ({ name: c.name, detail: c.detail, keepsOpen: c.keepsOpen, check: c.check }));

  const fitLabel = topScore >= 3 ? 'Strong fit' : topScore >= 1.8 ? 'Good option' : 'Worth exploring';
  const primary = top ? catalog[top] : null;

  // Alternatives: next 2 that scored >0
  const alternatives = sorted.filter(([k]) => k !== top && score[k] > 0.5).slice(0, 2).map(([k]) => catalog[k]);

  // Mismatch warning — parent wants one path but child signals point elsewhere
  let mismatchWarning = null;
  if (directionDetail && top) {
    const detailKey = { 'MPC':'mpc','BiPC':'bipc','MEC':'mec','CEC':'cec','Humanities':'humanities','Diploma / Polytechnic':'diploma','Vocational / Skill-based':'vocational'}[directionDetail];
    if (detailKey && detailKey !== top && (score[top] - score[detailKey] >= 1.2)) {
      mismatchWarning = `There is a difference between the current consideration (${directionDetail}) and your child’s stated interests and comfort. Before choosing, it would be useful to compare your child’s comfort with ${detailKey === 'mpc' ? 'Mathematics' : detailKey === 'bipc' ? 'Biology' : detailKey === 'mec' ? 'Mathematics/Economics' : 'that stream’s subjects'} against the demands of ${catalog[top].name}.`;
    }
  }
  // Also check learning style vs academic path mismatch
  if (!mismatchWarning && pathway === 'Traditional academic route → Intermediate / 11th–12th → degree' && (top === 'diploma' || top === 'vocational')) {
    mismatchWarning = 'Your child’s strongest signals point toward a practical/hands-on path, while the selected pathway is traditional academic. Consider whether a Diploma/Polytechnic or vocational route deserves a closer comparison before deciding.';
  }

  // WHY — grounded in actual answers, education-focused
  const whyParts = [];
  if (enjoy.length) whyParts.push(`Your child enjoys ${enjoy.slice(0, 3).join(', ')}${enjoy.length > 3 ? ' and related areas' : ''}.`);
  if (strongest.length && !strongest.includes('Still unsure')) whyParts.push(`They feel most comfortable with ${strongest.slice(0, 3).join(', ')}.`);
  if (learningStyle && learningStyle !== 'A mix / not sure') whyParts.push(`Their preferred way of learning is ${learningStyle.toLowerCase()}.`);
  if (interests.length && !interests.includes('Not sure')) whyParts.push(`Areas that naturally attract them include ${interests.slice(0, 3).join(', ')}.`);
  if (direction && direction !== 'Completely unsure') whyParts.push(`Current direction: ${direction.toLowerCase()}${directionDetail ? ` (${directionDetail})` : ''}.`);
  const why = whyParts.length ? whyParts : ['We’ll keep options flexible so nothing is locked in too early.'];
  if (priority) why.push(`What matters most to you — ${priority.toLowerCase()} — is reflected in how we compared the options.`);
  // KeepOpen & next for education context
  const keepsOpen = primary ? primary.keepsOpen : 'Exploring a few directions with light exposure before choosing is a sensible next step.';
  const whatToCheck = primary ? primary.check : 'Subject comfort, school/college availability, workload and your child’s genuine interest.';
  const next = primary
    ? `Compare ${[primary.name, ...alternatives.map((a) => a.name)].slice(0, 3).join(' vs ')} on subjects, workload and available colleges before making the final choice.`
    : 'Give a few streams a light try — projects, olympiads or hobby classes — and let us refine this together as things become clearer.';

  // Backward-compatible shape + new stage-aware fields
  const recommended = primary
    ? [{ name: primary.name, detail: primary.detail, keepsOpen: primary.keepsOpen, paths: [] }, ...alternatives.map((a) => ({ name: a.name, detail: a.detail, keepsOpen: a.keepsOpen, paths: [] }))]
    : allPaths.slice(0, 3).map((p) => ({ name: p.name, detail: p.detail, keepsOpen: p.keepsOpen, paths: [] }));

  return {
    recommendationType: 'NEXT_EDUCATION_PATH',
    headline: primary ? primary.name : 'Exploring paths',
    recommended,
    alternatives,
    primary,
    fitLabel,
    why,
    keepsOpen,
    whatToCheck,
    next,
    mismatchWarning,
    // legacy fields for any older renderer
    educationPaths: recommended,
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

// Real steps for Parent → Class 10 (education decision point, NOT career)
export const PARENT_CLASS10_STEPS = [
  { key: 'enjoy', multi: true, max: 3 },
  { key: 'strongest', multi: true, max: 3 },
  { key: 'learningStyle', single: true },
  { key: 'interests', multi: true, max: 3 },
  { key: 'direction', single: true },
  { key: 'pathway', single: true },
  { key: 'priority', single: true },
];

// Dynamic step list — inserts directionDetail only when Q5 is fairly clear
export function buildParentClass10Steps(answers = {}) {
  const base = ['enjoy', 'strongest', 'learningStyle', 'interests', 'direction'];
  if (answers.direction === 'Yes, fairly clear' || answers.direction === 'I have a few options in mind') base.push('directionDetail');
  base.push('pathway', 'priority');
  return base;
}

export const PARENT_CLASS10_ENJOY = ['Mathematics', 'Physics / Physical Science', 'Biology / Life Science', 'Social Studies', 'Languages', 'Computers / Technology', 'Commerce / Business', 'Creative subjects', 'Other', "They're still figuring it out"];

export const PARENT_CLASS10_STRONGEST = ['Mathematics / problem solving', 'Science / experiments', 'Biology / living systems', 'Business / money / economics', 'Social sciences / current affairs', 'Languages / communication', 'Computers / technology', 'Creative / practical work', 'Still unsure'];

export const PARENT_CLASS10_LEARNING_STYLE = ['Understanding concepts and solving problems', 'Experiments and scientific learning', 'Reading, discussion and explanation', 'Practical / hands-on work', 'Building or working with technology', 'Business / real-world applications', 'A mix / not sure'];

export const PARENT_CLASS10_INTERESTS = ['Technology', 'Science', 'Healthcare', 'Business', 'Finance', 'Law / social issues', 'Design / creative work', 'Government / public service', 'Practical / technical work', 'Not sure'];

export const PARENT_CLASS10_DIRECTION = ['Yes, fairly clear', 'I have a few options in mind', 'My child has some interest but is unsure', 'Completely unsure'];

export const PARENT_CLASS10_DIRECTION_DETAIL = ['MPC', 'BiPC', 'MEC', 'CEC', 'Humanities', 'Diploma / Polytechnic', 'Vocational / Skill-based', 'Not decided'];

export const PARENT_CLASS10_PATHWAY = ['Traditional academic route → Intermediate / 11th–12th → degree', 'Practical / technical learning', 'Diploma / Polytechnic', 'Vocational / skill-based route', 'Not sure yet'];

// Legacy aliases — keep for backward compatibility where older code imports these names
export const PARENT_CLASS10_FUTURE = PARENT_CLASS10_INTERESTS;
export const PARENT_CLASS10_CLARITY = PARENT_CLASS10_DIRECTION;
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