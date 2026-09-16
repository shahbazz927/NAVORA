/**
 * NAVORA — Graduation pathway data (single authority for "what comes next").
 *
 * Academic truth for a degree stays in degreeProfiles.js
 * (interests · skills · experiences · careers · requiredSkills).
 * graduationDegreeConfig.js stays the source of truth for
 * family → degree → specialization (+ profileId mapping).
 *
 * This file adds ONLY the forward-looking layer, keyed by the same profileId:
 *
 *   higherStudies → degree-specific postgraduate / professional routes
 *   exams         → entrance exams that actually gate those routes
 *   tracks        → pathway class per career value
 *                   ('pg' | 'practice' | 'employment' | 'research' |
 *                    'teaching' | 'business' | 'government')
 *   directions    → "what are you thinking about next?" options for that degree
 *   guidance      → one counsellor-style line used in the result narrative
 *
 * Nothing here may introduce a pathway that the degree itself cannot reach.
 * FAMILY_* maps are last-resort fallbacks (new/rare degrees only) — they are
 * never used to widen a degree that already has its own data.
 */

/** Universal direction values — every degree uses this value set. */
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
 * Pathway class → the direction answers it serves.
 * Used for ranking; never for eligibility.
 */
export const TRACK_DIRECTIONS = {
  pg: ['higher_studies', 'specialize'],
  practice: ['start_working', 'business', 'abroad'],
  employment: ['start_working', 'abroad'],
  research: ['research', 'higher_studies'],
  teaching: ['research', 'start_working'],
  business: ['business', 'start_working'],
  government: ['government', 'start_working'],
};

/**
 * Keyword rules used when a degree has no explicit track override.
 * Order matters — the first match wins.
 */
export const TRACK_RULES = [
  ['pg', /(specialization|specialisation|higher_studies|mds|md_ms|md_|ms_|mpharm|m_pharm|mtech|mba|pgdm|phd|postgraduate|llm|mcom|msc|med|mdes|masters)/],
  ['research', /(research)/],
  ['teaching', /(education|teaching|academia|academic|teacher|professor)/],
  ['business', /(entrepreneur|entrepreneurship|founder|business_owner|own_practice|agency_owner|startup)/],
  ['government', /(government|public_service|civil_service|judiciary|administrative_service|psu)/],
  ['practice', /(practice|clinical|clinician|litigation|counsel|therapist|therapy)/],
  ['employment', /./],
];

/**
 * Family-level fallback directions for degrees that have no curated list and
 * no derivable pathway classes yet. Values always stay inside GRAD_DIRECTION.
 */
export const GRAD_DIRECTION_BY_FAMILY = {
  'Engineering': [
    { value: 'higher_studies', label: 'Higher studies (M.Tech / MS in your branch)' },
    { value: 'start_working', label: 'Start at an entry-level engineering role' },
    { value: 'specialize', label: 'Specialize within your branch' },
    { value: 'government', label: 'Government / PSU roles (GATE, PSC, DRDO)' },
    { value: 'research', label: 'R&D / research path (PhD)' },
    { value: 'abroad', label: 'Work or study abroad' },
    { value: 'business', label: 'Start your own firm / consultancy' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Medicine & Healthcare': [
    { value: 'specialize', label: 'Postgraduate specialization in your healthcare field' },
    { value: 'higher_studies', label: 'Higher studies in your healthcare field' },
    { value: 'start_working', label: 'Start practicing / clinical work' },
    { value: 'government', label: 'Government hospitals / public health' },
    { value: 'research', label: 'Clinical / lab research' },
    { value: 'abroad', label: 'Practice or study abroad' },
    { value: 'business', label: 'Own clinic / healthcare venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Computer Applications': [
    { value: 'start_working', label: 'Start as a software / IT professional' },
    { value: 'higher_studies', label: 'Higher studies (MCA / M.Sc CS / M.Tech)' },
    { value: 'specialize', label: 'Specialize (AI, data, cloud, security)' },
    { value: 'government', label: 'Government IT / PSU roles' },
    { value: 'research', label: 'Research (PhD in CS / AI)' },
    { value: 'abroad', label: 'Work or study abroad (tech hubs)' },
    { value: 'business', label: 'Found a startup / freelance' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Commerce & Finance': [
    { value: 'start_working', label: 'Start a finance / accounting job' },
    { value: 'specialize', label: 'Specialize (CA, CFA, FRM, actuary)' },
    { value: 'higher_studies', label: 'Higher studies (M.Com / MBA / M.Sc Finance)' },
    { value: 'government', label: 'Banking / government finance roles' },
    { value: 'research', label: 'Research / academia / analytics' },
    { value: 'abroad', label: 'Finance roles or studies abroad' },
    { value: 'business', label: 'Start your own business / consultancy' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Business & Management': [
    { value: 'start_working', label: 'Start a management / operations role' },
    { value: 'business', label: 'Start your own venture' },
    { value: 'higher_studies', label: 'Higher studies (MBA / PGDM)' },
    { value: 'specialize', label: 'Specialize in your functional area' },
    { value: 'government', label: 'Government / public administration' },
    { value: 'abroad', label: 'Management roles or studies abroad' },
    { value: 'research', label: 'Research / academia (PhD in management)' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Science': [
    { value: 'higher_studies', label: 'Higher studies (M.Sc in your subject)' },
    { value: 'research', label: 'Research (PhD / lab / academia)' },
    { value: 'specialize', label: 'Specialize in a science domain' },
    { value: 'start_working', label: 'Start a science-based job (lab, industry, analytics)' },
    { value: 'government', label: 'Government research / scientist roles' },
    { value: 'abroad', label: 'Research or studies abroad' },
    { value: 'business', label: 'Start a science-based venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Arts & Humanities': [
    { value: 'higher_studies', label: 'Higher studies (MA in your subject)' },
    { value: 'start_working', label: 'Start working (content, media, admin)' },
    { value: 'specialize', label: 'Specialize (journalism, policy, psychology…)' },
    { value: 'government', label: 'Civil services / government exams' },
    { value: 'research', label: 'Research / academia' },
    { value: 'abroad', label: 'Study or work abroad' },
    { value: 'business', label: 'Freelance / creative venture' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Law': [
    { value: 'start_working', label: 'Start practice / litigation' },
    { value: 'specialize', label: 'Specialize (corporate, criminal, IP, taxation…)' },
    { value: 'higher_studies', label: 'Higher studies (LL.M)' },
    { value: 'government', label: 'Judiciary / legal advisory / government exams' },
    { value: 'business', label: 'Corporate counsel / legal consultancy' },
    { value: 'abroad', label: 'Practice or LL.M abroad' },
    { value: 'research', label: 'Legal research / academia' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Design & Creative': [
    { value: 'start_working', label: 'Start as a design / creative professional' },
    { value: 'specialize', label: 'Specialize (UX/UI, product, graphic, animation…)' },
    { value: 'higher_studies', label: 'Higher studies (M.Des / MFA)' },
    { value: 'business', label: 'Freelance / start your own studio' },
    { value: 'abroad', label: 'Creative roles or studies abroad' },
    { value: 'government', label: 'Government / public-sector creative roles' },
    { value: 'research', label: 'Design research / academia' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Agriculture & Environment': [
    { value: 'start_working', label: 'Start in agriculture / food / environment roles' },
    { value: 'higher_studies', label: 'Higher studies (M.Sc / M.Tech in your area)' },
    { value: 'research', label: 'Research (agri-science, climate, biodiversity)' },
    { value: 'government', label: 'Government agriculture / environment roles' },
    { value: 'business', label: 'Agri-business / agritech venture' },
    { value: 'abroad', label: 'Work or study abroad' },
    { value: 'specialize', label: 'Specialize (horticulture, forestry, environment management)' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Education': [
    { value: 'start_working', label: 'Start teaching / training' },
    { value: 'higher_studies', label: 'Higher studies (M.Ed / MA in your subject)' },
    { value: 'specialize', label: 'Specialize (special education, ed-tech, curriculum)' },
    { value: 'government', label: 'Teacher eligibility / government education roles' },
    { value: 'research', label: 'Education research / academia' },
    { value: 'business', label: 'Ed-tech / start your own institute' },
    { value: 'abroad', label: 'Teach or study abroad' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
  'Other Professional': [
    { value: 'start_working', label: 'Start working in your field' },
    { value: 'higher_studies', label: 'Higher studies in your field' },
    { value: 'specialize', label: 'Specialize in your functional area' },
    { value: 'business', label: 'Start your own venture' },
    { value: 'government', label: 'Government / public-sector roles' },
    { value: 'abroad', label: 'Work or study abroad' },
    { value: 'research', label: 'Research / academia' },
    { value: 'still_exploring', label: 'Still exploring' },
  ],
};

/** Compact direction-list helper: [value, label] rows → option objects. */
const D = (rows) => rows.map(([value, label]) => ({ value, label }));

/**
 * Degree-specific direction lists. This is the FIRST resolver level —
 * a Navy/degree name is matched before any family list is considered so a
 * nursing student never sees "MD / MS" and a law student never sees "GATE".
 */
export const GRAD_DIRECTIONS_BY_PROFILE = {
  // ── Medicine & Healthcare — every degree keeps its own postgraduate route
  mbbs: D([
    ['start_working', 'Start clinical practice (internship → house officer)'],
    ['specialize', 'Prepare for postgraduate medical specialization (MD / MS / DNB)'],
    ['higher_studies', 'Higher studies in medicine (MD / MS / DNB, MPH, hospital administration)'],
    ['research', 'Medical research'],
    ['government', 'Government hospital / public health service'],
    ['abroad', 'Practice or study abroad (USMLE / PLAB / AMC)'],
    ['business', 'Healthcare administration / own clinic venture'],
    ['still_exploring', 'Still exploring'],
  ]),
  bds: D([
    ['start_working', 'Start dental practice (associateship / own clinic)'],
    ['specialize', 'Prepare for MDS — Master of Dental Surgery (NEET-MDS)'],
    ['higher_studies', 'Higher studies — MDS / dental postgraduate / public health'],
    ['research', 'Dental research'],
    ['government', 'Dental public-health / government dental service'],
    ['abroad', 'Work or study abroad in dentistry (INBDE / university route)'],
    ['business', 'Start your own dental practice or dental venture'],
    ['still_exploring', 'Still exploring'],
  ]),
  bams: D([
    ['start_working', 'Start Ayurvedic practice'],
    ['specialize', 'Postgraduate specialization (MD / MS Ayurveda)'],
    ['higher_studies', 'Higher studies — MD Ayurveda / integrative medicine'],
    ['research', 'Ayurvedic research'],
    ['government', 'Government AYUSH service'],
    ['abroad', 'Work or study abroad (Ayurveda / wellness)'],
    ['business', 'Wellness centre / own practice'],
    ['still_exploring', 'Still exploring'],
  ]),
  bhms: D([
    ['start_working', 'Start homeopathic practice'],
    ['specialize', 'Postgraduate specialization (MD Homeopathy)'],
    ['higher_studies', 'Higher studies — MD Homeopathy'],
    ['research', 'Homeopathic research'],
    ['government', 'Government AYUSH service'],
    ['abroad', 'Work or study abroad'],
    ['business', 'Own clinic / wellness practice'],
    ['still_exploring', 'Still exploring'],
  ]),
  bums: D([
    ['start_working', 'Start Unani practice'],
    ['specialize', 'Postgraduate specialization (MD Unani)'],
    ['higher_studies', 'Higher studies — MD Unani'],
    ['research', 'Unani research'],
    ['government', 'Government AYUSH service'],
    ['abroad', 'Work or study abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsms: D([
    ['start_working', 'Start Siddha practice'],
    ['specialize', 'Postgraduate specialization (MD Siddha)'],
    ['higher_studies', 'Higher studies — MD Siddha'],
    ['research', 'Siddha research'],
    ['government', 'Government AYUSH service'],
    ['still_exploring', 'Still exploring'],
  ]),
  bnys: D([
    ['start_working', 'Start naturopathy / yoga practice'],
    ['specialize', 'Postgraduate specialization (MD Naturopathy / Yoga)'],
    ['higher_studies', 'Higher studies — MD Naturopathy'],
    ['research', 'Naturopathy / yoga research'],
    ['business', 'Wellness centre / own practice'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_nursing: D([
    ['start_working', 'Start nursing practice (staff nurse roles)'],
    ['specialize', 'Postgraduate nursing specialization (M.Sc Nursing)'],
    ['higher_studies', 'Higher studies — M.Sc Nursing / MHA / MPH'],
    ['research', 'Nursing research'],
    ['government', 'Government / public-health nursing'],
    ['abroad', 'Work or study abroad in nursing (NCLEX / OET route)'],
    ['still_exploring', 'Still exploring'],
  ]),
  bpt: D([
    ['start_working', 'Start physiotherapy practice'],
    ['specialize', 'Postgraduate physiotherapy specialization (MPT)'],
    ['higher_studies', 'Higher studies — MPT'],
    ['research', 'Physiotherapy / rehabilitation research'],
    ['abroad', 'Work or study abroad in physiotherapy'],
    ['business', 'Own physiotherapy clinic'],
    ['still_exploring', 'Still exploring'],
  ]),
  bot: D([
    ['start_working', 'Start occupational therapy practice'],
    ['specialize', 'Postgraduate specialization (MOT)'],
    ['higher_studies', 'Higher studies — MOT'],
    ['research', 'Occupational therapy research'],
    ['abroad', 'Work or study abroad in OT'],
    ['still_exploring', 'Still exploring'],
  ]),
  bpharm: D([
    ['start_working', 'Start in pharmacy practice / community pharmacy'],
    ['higher_studies', 'Higher studies — M.Pharm (pharmacology, pharmaceutics, analysis)'],
    ['specialize', 'Specialize — clinical pharmacy, regulatory affairs, pharmacovigilance'],
    ['research', 'Pharmaceutical / clinical research'],
    ['government', 'Drug regulatory / government pharmacy roles'],
    ['abroad', 'Work or study abroad (pharmacy / pharma industry)'],
    ['business', 'Own pharmacy or pharma venture'],
    ['still_exploring', 'Still exploring'],
  ]),
  pharmd: D([
    ['start_working', 'Start clinical pharmacy practice'],
    ['specialize', 'Specialize in clinical pharmacy / pharmacovigilance'],
    ['higher_studies', 'Higher studies — PhD / fellowship in pharmaceutical sciences'],
    ['research', 'Clinical research / pharmacovigilance'],
    ['government', 'Government / hospital pharmacy roles'],
    ['abroad', 'Clinical pharmacy roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Allied health technology degrees — each with its own PG route
  bsc_medical_lab: D([
    ['start_working', 'Start as a medical laboratory technologist'],
    ['specialize', 'M.Sc / PG diploma in your lab specialization (haematology, microbiology…)'],
    ['higher_studies', 'Higher studies — M.Sc Medical Lab Technology'],
    ['research', 'Diagnostic / laboratory research'],
    ['government', 'Government / hospital laboratory roles'],
    ['abroad', 'Lab technologist roles / studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_radiology: D([
    ['start_working', 'Start as a radiology / imaging technologist'],
    ['specialize', 'PG diploma in CT, MRI or interventional imaging'],
    ['higher_studies', 'Higher studies — M.Sc Medical Imaging / Radiology Technology'],
    ['research', 'Imaging research'],
    ['government', 'Government hospital imaging roles'],
    ['abroad', 'Imaging roles / studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_optometry: D([
    ['start_working', 'Start optometry practice / optical clinical work'],
    ['specialize', 'Specialize — contact lens, low vision, paediatric optometry'],
    ['higher_studies', 'Higher studies — M.Optom'],
    ['research', 'Vision science research'],
    ['business', 'Own optometry clinic / optical practice'],
    ['abroad', 'Optometry practice or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_cardiac: D([
    ['start_working', 'Start as a cardiac care / cath-lab technologist'],
    ['specialize', 'PG diploma in echocardiography / cardiac catheterization'],
    ['higher_studies', 'Higher studies in cardiac care technology'],
    ['research', 'Cardiac research / clinical trials'],
    ['government', 'Government hospital cardiology roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_anaesthesia: D([
    ['start_working', 'Start as an anaesthesia / OT technologist'],
    ['specialize', 'PG diploma / certification in critical care technology'],
    ['higher_studies', 'Higher studies in anaesthesia technology'],
    ['research', 'Critical-care research'],
    ['government', 'Government hospital OT / ICU roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_ot_technology: D([
    ['start_working', 'Start as an operation theatre technologist'],
    ['specialize', 'PG diploma in surgical assistance / endoscopy technology'],
    ['higher_studies', 'Higher studies in OT technology'],
    ['research', 'Surgical technology research'],
    ['government', 'Government hospital surgical services'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_respiratory: D([
    ['start_working', 'Start as a respiratory therapist'],
    ['specialize', 'PG diploma in pulmonary function testing / sleep studies'],
    ['higher_studies', 'Higher studies in respiratory care'],
    ['research', 'Pulmonary research'],
    ['government', 'Government hospital respiratory services'],
    ['abroad', 'Respiratory therapy roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_dialysis: D([
    ['start_working', 'Start as a dialysis technologist'],
    ['specialize', 'PG diploma in renal / dialysis technology'],
    ['higher_studies', 'Higher studies in dialysis / renal technology'],
    ['government', 'Government hospital dialysis units'],
    ['abroad', 'Dialysis / renal technology roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_emergency: D([
    ['start_working', 'Start in emergency & trauma care'],
    ['specialize', 'PG diploma in paramedicine / emergency technology'],
    ['higher_studies', 'Higher studies in emergency & trauma care'],
    ['government', 'Government emergency services'],
    ['still_exploring', 'Still exploring'],
  ]),
  other_healthcare: D([
    ['start_working', 'Start in your healthcare field'],
    ['specialize', 'Postgraduate specialization in your clinical area'],
    ['higher_studies', 'Higher studies — M.Sc / PG diploma in your healthcare field'],
    ['government', 'Government health service roles'],
    ['abroad', 'Healthcare roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Engineering — each branch keeps its own PG and employment routes
  btech_cse: D([
    ['start_working', 'Start a software / IT role'],
    ['specialize', 'Specialize — AI/ML, cloud, cybersecurity, full-stack'],
    ['higher_studies', 'Higher studies — M.Tech / MS in Computer Science (GATE)'],
    ['research', 'Research (PhD in CS / AI)'],
    ['government', 'Government / PSU technology roles'],
    ['abroad', 'Work or study abroad (tech hubs)'],
    ['business', 'Start a technology venture'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_ai: D([
    ['start_working', 'Start in an AI / ML engineering role'],
    ['specialize', 'Specialize — deep learning, MLOps, computer vision, NLP'],
    ['higher_studies', 'Higher studies — M.Tech / MS in AI or Machine Learning (GATE)'],
    ['research', 'AI research (PhD / research labs)'],
    ['abroad', 'Work or study abroad in AI'],
    ['business', 'Start an AI product venture'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_data_science: D([
    ['start_working', 'Start as a data scientist / analyst'],
    ['specialize', 'Specialize — analytics engineering, ML, business intelligence'],
    ['higher_studies', 'Higher studies — M.Tech / MS in Data Science (GATE)'],
    ['research', 'Data science research'],
    ['abroad', 'Data roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_it: D([
    ['start_working', 'Start an IT / software role'],
    ['specialize', 'Specialize — cloud, DevOps, networking, security'],
    ['higher_studies', 'Higher studies — M.Tech / MS in IT or CSE (GATE)'],
    ['research', 'Research in computing'],
    ['government', 'Government / PSU IT roles'],
    ['abroad', 'IT roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_cybersecurity: D([
    ['start_working', 'Start as a security analyst'],
    ['specialize', 'Specialize — SOC, penetration testing, cloud security'],
    ['higher_studies', 'Higher studies — M.Tech / MS in cybersecurity (GATE)'],
    ['research', 'Cybersecurity research'],
    ['government', 'Government / defence security roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_ece: D([
    ['start_working', 'Start as an electronics / embedded engineer'],
    ['specialize', 'Specialize — VLSI, embedded systems, RF, IoT, semiconductor'],
    ['higher_studies', 'Higher studies — M.Tech / MS in ECE (VLSI, communication, signal processing)'],
    ['research', 'Electronics research (PhD)'],
    ['government', 'Government / PSU electronics roles (ISRO, DRDO, BEL…)'],
    ['abroad', 'Work or study abroad (electronics / semiconductors)'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_electrical: D([
    ['start_working', 'Start as an electrical engineer'],
    ['specialize', 'Specialize — power systems, drives, control, EV technology'],
    ['higher_studies', 'Higher studies — M.Tech / MS in electrical engineering (GATE)'],
    ['research', 'Electrical engineering research'],
    ['government', 'Power-sector / PSU roles (PGCIL, NTPC, state boards)'],
    ['abroad', 'Work or study abroad (energy / power)'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_mechanical: D([
    ['start_working', 'Start as a mechanical / design engineer'],
    ['specialize', 'Specialize — EV, robotics, CAD-CAM, HVAC, manufacturing'],
    ['higher_studies', 'Higher studies — M.Tech / MS in Mechanical (design, thermal, manufacturing)'],
    ['research', 'Mechanical engineering research'],
    ['government', 'Government / PSU roles (GATE, DRDO, PSC)'],
    ['abroad', 'Work or study abroad (automotive / aerospace)'],
    ['business', 'Start your own firm / consultancy'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_civil: D([
    ['start_working', 'Start as a site / design civil engineer'],
    ['specialize', 'Specialize — structural, geotechnical, transportation, water resources'],
    ['higher_studies', 'Higher studies — M.Tech / MS in Civil or M.Plan (GATE)'],
    ['research', 'Civil engineering research'],
    ['government', 'Government / PSU infrastructure roles (PWD, NHAI, railways)'],
    ['abroad', 'Work or study abroad in civil engineering'],
    ['business', 'Own construction / consultancy firm'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_chemical: D([
    ['start_working', 'Start as a process / production engineer'],
    ['specialize', 'Specialize — process design, petrochemicals, process safety'],
    ['higher_studies', 'Higher studies — M.Tech / MS in Chemical Engineering (GATE)'],
    ['research', 'Chemical engineering research'],
    ['government', 'PSU / refinery / government roles'],
    ['abroad', 'Work or study abroad (process industry)'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_biotech: D([
    ['start_working', 'Start in biotech / bioprocess industry or a lab'],
    ['specialize', 'Specialize — bioprocess, bioinformatics, clinical research'],
    ['higher_studies', 'Higher studies — M.Tech / M.Sc in Biotechnology (GATE)'],
    ['research', 'Biotechnology research (PhD / DBT-JRF)'],
    ['abroad', 'Work or study abroad in biotechnology'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_aerospace: D([
    ['start_working', 'Start in aerospace / aviation engineering'],
    ['specialize', 'Specialize — aerodynamics, propulsion, avionics, space systems'],
    ['higher_studies', 'Higher studies — M.Tech / MS in Aerospace Engineering (GATE)'],
    ['research', 'Aerospace research (ISRO / DRDO / PhD)'],
    ['government', 'Government aerospace / defence roles'],
    ['abroad', 'Work or study abroad in aerospace'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_automobile: D([
    ['start_working', 'Start in automotive / EV engineering'],
    ['specialize', 'Specialize — EV & battery, vehicle dynamics, NVH'],
    ['higher_studies', 'Higher studies — M.Tech / MS in Automotive Engineering (GATE)'],
    ['research', 'Automotive research'],
    ['abroad', 'Work or study abroad in automotive engineering'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_mechatronics: D([
    ['start_working', 'Start in automation / mechatronics engineering'],
    ['specialize', 'Specialize — industrial automation, PLC/SCADA, robotics'],
    ['higher_studies', 'Higher studies — M.Tech / MS in Mechatronics or Control (GATE)'],
    ['research', 'Mechatronics research'],
    ['abroad', 'Work or study abroad in automation'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_robotics: D([
    ['start_working', 'Start in robotics / automation engineering'],
    ['specialize', 'Specialize — ROS, industrial robotics, autonomous systems'],
    ['higher_studies', 'Higher studies — M.Tech / MS in Robotics (GATE)'],
    ['research', 'Robotics research'],
    ['abroad', 'Robotics roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  btech_environmental: D([
    ['start_working', 'Start in environmental engineering / EHS roles'],
    ['specialize', 'Specialize — water & wastewater, air quality, EIA, sustainability'],
    ['higher_studies', 'Higher studies — M.Tech / M.Sc in Environmental Engineering (GATE)'],
    ['research', 'Environmental research'],
    ['government', 'Pollution control boards / government environment roles'],
    ['abroad', 'Work or study abroad in environmental engineering'],
    ['still_exploring', 'Still exploring'],
  ]),
  other_engineering: D([
    ['start_working', 'Start in your engineering branch'],
    ['specialize', 'Specialize within your branch'],
    ['higher_studies', 'Higher studies — M.Tech / MS in your discipline (GATE)'],
    ['research', 'Engineering research'],
    ['government', 'Government / PSU engineering roles'],
    ['abroad', 'Work or study abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Computer Applications
  bca: D([
    ['start_working', 'Start as a software developer / IT support professional'],
    ['specialize', 'Specialize — web, cloud, data, cybersecurity, QA automation'],
    ['higher_studies', 'Higher studies — MCA (NIMCET) / M.Sc Computer Science'],
    ['research', 'Research in computing'],
    ['government', 'Government IT roles (NIC, PSU, banking IT)'],
    ['abroad', 'IT roles or studies abroad'],
    ['business', 'Freelance / start a software venture'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_cs: D([
    ['start_working', 'Start as a software developer'],
    ['specialize', 'Specialize — AI/ML, cloud, data engineering, security'],
    ['higher_studies', 'Higher studies — M.Sc Computer Science / MCA / M.Tech (CUET-PG)'],
    ['research', 'Computing research (M.Sc + PhD)'],
    ['government', 'Government IT / research roles'],
    ['abroad', 'Computing roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_it: D([
    ['start_working', 'Start in IT services / systems roles'],
    ['specialize', 'Specialize — cloud, networking, DevOps, security'],
    ['higher_studies', 'Higher studies — M.Sc IT / MCA (CUET-PG)'],
    ['government', 'Government IT roles'],
    ['abroad', 'IT roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_data_science: D([
    ['start_working', 'Start as a data analyst / junior data scientist'],
    ['specialize', 'Specialize — machine learning, analytics engineering, BI'],
    ['higher_studies', 'Higher studies — M.Sc Data Science / AI (CUET-PG)'],
    ['research', 'Data science research'],
    ['abroad', 'Analytics roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_ai: D([
    ['start_working', 'Start in an AI / ML role'],
    ['specialize', 'Specialize — deep learning, NLP, computer vision, MLOps'],
    ['higher_studies', 'Higher studies — M.Sc AI / Machine Learning (CUET-PG)'],
    ['research', 'AI research'],
    ['abroad', 'AI roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_cybersecurity: D([
    ['start_working', 'Start as a security analyst / SOC engineer'],
    ['specialize', 'Specialize — pen testing, cloud security, digital forensics'],
    ['higher_studies', 'Higher studies — M.Sc Cybersecurity / M.Tech (CUET-PG)'],
    ['government', 'Government / defence cybersecurity roles'],
    ['abroad', 'Security roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_computer_apps: D([
    ['start_working', 'Start in software / IT applications roles'],
    ['specialize', 'Specialize — application development, database, cloud'],
    ['higher_studies', 'Higher studies — MCA / M.Sc IT (CUET-PG)'],
    ['government', 'Government IT roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  other_computing: D([
    ['start_working', 'Start in a computing / IT role'],
    ['specialize', 'Specialize in your computing area'],
    ['higher_studies', 'Higher studies — MCA / M.Sc in computing (CUET-PG)'],
    ['abroad', 'Computing roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Commerce & Finance
  bcom_general: D([
    ['start_working', 'Start in accounting, taxation or finance operations'],
    ['specialize', 'Specialize — CA, CMA, CS, CFA, ACCA, GST/taxation'],
    ['higher_studies', 'Higher studies — M.Com / MBA (CAT) / M.Sc Finance'],
    ['government', 'Banking / government finance roles (IBPS, RBI, SSC)'],
    ['research', 'Research / academia in commerce'],
    ['abroad', 'Finance roles or studies abroad'],
    ['business', 'Start your own practice / business'],
    ['still_exploring', 'Still exploring'],
  ]),
  bcom_finance: D([
    ['start_working', 'Start in financial analysis, banking or corporate finance'],
    ['specialize', 'Specialize — CFA, FRM, CA, financial modelling, analytics'],
    ['higher_studies', 'Higher studies — M.Com Finance / MBA (Finance) / M.Sc Finance'],
    ['government', 'Banking / government finance roles (IBPS, RBI, SSC)'],
    ['research', 'Finance research / academia'],
    ['abroad', 'Finance roles or studies abroad (MS Finance / MBA)'],
    ['business', 'Wealth advisory / own finance practice'],
    ['still_exploring', 'Still exploring'],
  ]),
  bcom_business_analytics: D([
    ['start_working', 'Start as a business / data analyst'],
    ['specialize', 'Specialize — SQL, Power BI, Python, financial analytics'],
    ['higher_studies', 'Higher studies — M.Sc Business Analytics / MBA Analytics / M.Com'],
    ['research', 'Analytics research'],
    ['abroad', 'Analytics roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bcom_computer_apps: D([
    ['start_working', 'Start in commerce-tech roles (ERP, finance systems, audit tech)'],
    ['specialize', 'Specialize — accounting software, ERP, data analytics'],
    ['higher_studies', 'Higher studies — MCA / M.Com (Computer Applications) / MBA'],
    ['government', 'Banking / government finance roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  bcom_banking: D([
    ['start_working', 'Start in banking operations / credit / wealth desks'],
    ['specialize', 'Specialize — banking certifications (IIBF, JAIIB, NISM), credit analysis'],
    ['higher_studies', 'Higher studies — MBA (Banking & Finance) / M.Com'],
    ['government', 'Public-sector banking exams (IBPS, SBI, RBI)'],
    ['abroad', 'Banking / finance roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  other_commerce: D([
    ['start_working', 'Start in a commerce / finance role'],
    ['specialize', 'Specialize — CA, CMA, CS, analytics or taxation'],
    ['higher_studies', 'Higher studies — M.Com / MBA / professional qualifications'],
    ['government', 'Banking / government commerce roles'],
    ['abroad', 'Commerce roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Business & Management — each specialization keeps its own next step
  bba: D([
    ['start_working', 'Start in a management / operations / sales role'],
    ['higher_studies', 'Higher studies — MBA / PGDM (CAT / XAT / CMAT)'],
    ['specialize', 'Specialize — marketing, finance, HR, operations, analytics'],
    ['business', 'Start your own venture / family business'],
    ['government', 'Government / public administration roles'],
    ['abroad', 'Management roles or studies abroad (GMAT)'],
    ['still_exploring', 'Still exploring'],
  ]),
  bba_finance: D([
    ['start_working', 'Start in finance / banking / corporate finance roles'],
    ['higher_studies', 'Higher studies — MBA / PGDM (Finance) / M.Sc Finance / MS Finance abroad'],
    ['specialize', 'Specialize — CFA, FRM, financial modelling, investment analysis'],
    ['government', 'Banking / government finance roles (IBPS, RBI, SSC)'],
    ['abroad', 'Finance roles or studies abroad'],
    ['business', 'Start a finance consultancy / venture'],
    ['still_exploring', 'Still exploring'],
  ]),
  bba_marketing: D([
    ['start_working', 'Start in brand, digital marketing or sales roles'],
    ['higher_studies', 'Higher studies — MBA / PGDM (Marketing)'],
    ['specialize', 'Specialize — digital marketing, brand strategy, consumer research'],
    ['abroad', 'Marketing roles or studies abroad'],
    ['business', 'Start your own brand / agency'],
    ['still_exploring', 'Still exploring'],
  ]),
  bba_hr: D([
    ['start_working', 'Start in HR operations / recruitment / HRBP roles'],
    ['higher_studies', 'Higher studies — MBA / PGDM (HR) / MA HRM / labour law'],
    ['specialize', 'Specialize — talent analytics, L&D, labour law, HR business partnering'],
    ['government', 'Government HR / public administration roles'],
    ['abroad', 'HR roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bba_analytics: D([
    ['start_working', 'Start as a business analyst / MIS analyst'],
    ['higher_studies', 'Higher studies — MBA (Business Analytics) / M.Sc Analytics'],
    ['specialize', 'Specialize — SQL, Python, Power BI, product analytics'],
    ['abroad', 'Analytics roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bba_entrepreneurship: D([
    ['start_working', 'Start in a startup / growth role while building your own idea'],
    ['business', 'Start or scale your own venture'],
    ['specialize', 'Specialize — startup finance, product, growth, family-business management'],
    ['higher_studies', 'Higher studies — MBA (Entrepreneurship / strategy)'],
    ['abroad', 'Startup ecosystems or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bba_ib: D([
    ['start_working', 'Start in international business / export-import / trade roles'],
    ['higher_studies', 'Higher studies — MBA (International Business) / MA Global Trade'],
    ['specialize', 'Specialize — global trade compliance, EXIM, cross-border marketing'],
    ['abroad', 'International roles or studies abroad'],
    ['government', 'Government trade / commerce roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  bba_operations: D([
    ['start_working', 'Start in operations / process / project coordination roles'],
    ['higher_studies', 'Higher studies — MBA (Operations) / PG diploma in operations'],
    ['specialize', 'Specialize — lean six sigma, process excellence, project management'],
    ['abroad', 'Operations roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bba_logistics: D([
    ['start_working', 'Start in supply chain / logistics / procurement roles'],
    ['higher_studies', 'Higher studies — MBA (Supply Chain) / PG diploma in logistics'],
    ['specialize', 'Specialize — CSCP, CILT, SAP, warehouse & inventory management'],
    ['government', 'Government logistics / defence supply roles'],
    ['abroad', 'Supply-chain roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bba_healthcare: D([
    ['start_working', 'Start in hospital administration / health insurance operations'],
    ['higher_studies', 'Higher studies — MHA (Master of Hospital Administration) / MPH / MBA (Healthcare)'],
    ['specialize', 'Specialize — health informatics, quality & accreditation (NABH), insurance'],
    ['government', 'Government health administration roles'],
    ['abroad', 'Healthcare management roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bba_ecommerce: D([
    ['start_working', 'Start in e-commerce operations, category or digital roles'],
    ['higher_studies', 'Higher studies — MBA (Marketing / Operations / analytics)'],
    ['specialize', 'Specialize — marketplace ads, category management, e-commerce analytics'],
    ['business', 'Start your own online venture / D2C brand'],
    ['abroad', 'E-commerce roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  other_management: D([
    ['start_working', 'Start in a management role in your area'],
    ['higher_studies', 'Higher studies — MBA / PGDM'],
    ['specialize', 'Specialize in your functional area'],
    ['business', 'Start your own venture'],
    ['abroad', 'Management roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Science — PG routes differ per subject; never a generic "Master's"
  bsc_maths: D([
    ['higher_studies', 'Higher studies — M.Sc Mathematics / Applied Mathematics (IIT JAM / CUET-PG)'],
    ['specialize', 'Specialize — statistics, data science, actuarial science'],
    ['research', 'Research (CSIR-NET / NBHM / PhD in mathematics)'],
    ['start_working', 'Start in analytics / teaching / banking roles'],
    ['government', 'Government research / statistical service roles (ISS, RBI)'],
    ['abroad', 'Mathematics research or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_physics: D([
    ['higher_studies', 'Higher studies — M.Sc Physics (IIT JAM / CUET-PG)'],
    ['specialize', 'Specialize — astrophysics, materials science, applied physics, electronics'],
    ['research', 'Research (CSIR-NET / JEST / PhD in physics)'],
    ['start_working', 'Start in lab, semiconductor or analytics roles'],
    ['government', 'Government research / scientific service roles (ISRO, BARC, DRDO)'],
    ['abroad', 'Physics research or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_chemistry: D([
    ['higher_studies', 'Higher studies — M.Sc Chemistry (IIT JAM / CUET-PG)'],
    ['specialize', 'Specialize — analytical, organic, polymer, pharmaceutical chemistry'],
    ['research', 'Research (CSIR-NET / PhD in chemistry)'],
    ['start_working', 'Start in pharma, QC, chemical or materials industry'],
    ['government', 'Government lab / scientific service roles'],
    ['abroad', 'Chemistry research or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_statistics: D([
    ['higher_studies', 'Higher studies — M.Sc Statistics (ISI / CUET-PG)'],
    ['specialize', 'Specialize — data science, actuarial science, biostatistics'],
    ['research', 'Statistics research'],
    ['start_working', 'Start as an analyst / data scientist / actuary trainee'],
    ['government', 'Indian Statistical Service / government analytics roles'],
    ['abroad', 'Statistics / data science studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_biology: D([
    ['higher_studies', 'Higher studies — M.Sc Zoology / Botany / Genetics / Life Sciences (CUET-PG)'],
    ['specialize', 'Specialize — genetics, ecology, molecular biology, biotechnology'],
    ['research', 'Research (CSIR-NET / PhD in life sciences)'],
    ['start_working', 'Start in labs, biotech or education roles'],
    ['government', 'Government research / environment / education roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_biotech_science: D([
    ['higher_studies', 'Higher studies — M.Sc Biotechnology / Molecular Biology (GAT-B / CUET-PG)'],
    ['specialize', 'Specialize — genomics, bioinformatics, bioprocess, clinical research'],
    ['research', 'Research (DBT-JRF / CSIR-NET / PhD in biotechnology)'],
    ['start_working', 'Start in biotech, pharma or diagnostic labs'],
    ['government', 'Government biotech / research institute roles'],
    ['abroad', 'Biotechnology research or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_microbiology: D([
    ['higher_studies', 'Higher studies — M.Sc Microbiology / Medical Microbiology (CUET-PG)'],
    ['specialize', 'Specialize — clinical microbiology, infection control, industrial microbiology'],
    ['research', 'Microbiology research'],
    ['start_working', 'Start in diagnostic labs, pharma QC or food safety'],
    ['government', 'Government lab / public health roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_biochemistry: D([
    ['higher_studies', 'Higher studies — M.Sc Biochemistry / Clinical Biochemistry (CUET-PG)'],
    ['specialize', 'Specialize — clinical biochemistry, molecular biology, nutrition science'],
    ['research', 'Biochemistry research'],
    ['start_working', 'Start in diagnostic labs, pharma or nutrition industry'],
    ['government', 'Government hospital lab / research roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_botany: D([
    ['higher_studies', 'Higher studies — M.Sc Botany / Plant Sciences (CUET-PG)'],
    ['specialize', 'Specialize — plant biotechnology, ecology, ethnobotany'],
    ['research', 'Botanical / plant science research'],
    ['start_working', 'Start in agri-biotech, horticulture or education'],
    ['government', 'Botanical survey / forest / environment roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_zoology: D([
    ['higher_studies', 'Higher studies — M.Sc Zoology / Wildlife / Life Sciences (CUET-PG)'],
    ['specialize', 'Specialize — wildlife biology, genetics, conservation, toxicology'],
    ['research', 'Zoology / ecology research'],
    ['start_working', 'Start in environment, conservation or education roles'],
    ['government', 'Forest / wildlife / environment service exams'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_env_science: D([
    ['higher_studies', 'Higher studies — M.Sc Environmental Science / Climate Studies'],
    ['specialize', 'Specialize — EIA, water resources, sustainability, GIS & remote sensing'],
    ['research', 'Environmental research'],
    ['start_working', 'Start in EHS / sustainability / consultancy roles'],
    ['government', 'Pollution control / environment department roles'],
    ['abroad', 'Sustainability studies or roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_forensic: D([
    ['higher_studies', 'Higher studies — M.Sc Forensic Science (CUET-PG / university entrance)'],
    ['specialize', 'Specialize — cyber forensics, toxicology, DNA fingerprinting, questioned documents'],
    ['research', 'Forensic science research'],
    ['start_working', 'Start in forensic labs / private investigation / cyber forensics'],
    ['government', 'Forensic Science Laboratory / police scientific service exams'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_geology: D([
    ['higher_studies', 'Higher studies — M.Sc Geology / Applied Geology (IIT JAM / CUET-PG)'],
    ['specialize', 'Specialize — hydrogeology, mineral exploration, petroleum geology, GIS'],
    ['research', 'Geological research'],
    ['start_working', 'Start in mining, exploration, groundwater or environment roles'],
    ['government', 'Geological Survey / PSU geologist recruitment'],
    ['still_exploring', 'Still exploring'],
  ]),
  bsc_food_science: D([
    ['higher_studies', 'Higher studies — M.Sc / M.Tech Food Technology (GATE / ICAR AIEEA)'],
    ['specialize', 'Specialize — food safety (HACCP, FSSC), QA, food product development'],
    ['research', 'Food science research'],
    ['start_working', 'Start in food industry QA / production / product development'],
    ['government', 'FSSAI / food safety government roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  other_science: D([
    ['higher_studies', 'Higher studies — M.Sc in your science subject'],
    ['specialize', 'Specialize in an applied area of your subject'],
    ['research', 'Research / PhD route (CSIR-NET)'],
    ['start_working', 'Start in lab, industry or analytics roles'],
    ['government', 'Government research / scientific roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Arts & Humanities — MA route changes per subject
  ba_economics: D([
    ['higher_studies', 'Higher studies — MA Economics (CUET-PG / IIT / DSE entrance)'],
    ['specialize', 'Specialize — public policy, development studies, econometrics, finance'],
    ['start_working', 'Start as an analyst (policy, finance, consulting, research)'],
    ['research', 'Economics research (MA + PhD, UGC-NET / JRF)'],
    ['government', 'Civil services (IES / RBI / government economist roles)'],
    ['abroad', 'MA / MS Economics abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_psychology: D([
    ['higher_studies', 'Higher studies — MA / M.Sc Clinical or Counselling Psychology (CUET-PG)'],
    ['specialize', 'Specialize — clinical, counselling, organisational, child psychology'],
    ['start_working', 'Start in HR, counselling support, special education or research assistant roles'],
    ['research', 'Psychology research (MA + PhD, UGC-NET)'],
    ['business', 'Own counselling / therapy practice (after required qualifications)'],
    ['abroad', 'Psychology studies or practice abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_political_science: D([
    ['higher_studies', 'Higher studies — MA Political Science / International Relations (CUET-PG)'],
    ['specialize', 'Specialize — public policy, diplomacy, electoral & legislative studies'],
    ['start_working', 'Start in policy research, NGOs, think tanks or media'],
    ['government', 'Civil services / state public service exams'],
    ['research', 'Political science research (UGC-NET / PhD)'],
    ['abroad', 'IR / public policy studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_sociology: D([
    ['higher_studies', 'Higher studies — MA Sociology (CUET-PG)'],
    ['specialize', 'Specialize — MSW (social work), development studies, HR, urban studies'],
    ['start_working', 'Start in NGOs, CSR, HR or social research roles'],
    ['government', 'Civil services / social welfare department roles'],
    ['research', 'Sociology research (UGC-NET / PhD)'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_history: D([
    ['higher_studies', 'Higher studies — MA History / Archaeology (CUET-PG)'],
    ['specialize', 'Specialize — museology, archaeology, heritage management, archives'],
    ['start_working', 'Start in museums, heritage tourism, content or civil-services prep'],
    ['government', 'Civil services / archaeology / archives service'],
    ['research', 'History research (UGC-NET / PhD)'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_english: D([
    ['higher_studies', 'Higher studies — MA English Literature / Linguistics (CUET-PG)'],
    ['specialize', 'Specialize — content & copywriting, publishing, ELT, journalism'],
    ['start_working', 'Start in content, media, publishing or BPO/communications'],
    ['government', 'Teaching eligibility (B.Ed / NET) / government communication roles'],
    ['research', 'Literature research (UGC-NET / PhD)'],
    ['abroad', 'Literature / linguistics studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_journalism: D([
    ['higher_studies', 'Higher studies — MA Journalism / Mass Communication (CUET-PG)'],
    ['specialize', 'Specialize — digital media, data journalism, broadcast, PR'],
    ['start_working', 'Start in newsrooms, digital media, PR or content studios'],
    ['government', 'Government media / information service roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_mass_comm: D([
    ['higher_studies', 'Higher studies — MA Mass Communication / Media Studies (CUET-PG)'],
    ['specialize', 'Specialize — advertising, PR, film & video production, digital media'],
    ['start_working', 'Start in agencies, production houses, OTT or corporate comms'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_public_admin: D([
    ['higher_studies', 'Higher studies — MA Public Administration (CUET-PG)'],
    ['specialize', 'Specialize — public policy, governance, municipal administration'],
    ['start_working', 'Start in policy, NGO, CSR or government project roles'],
    ['government', 'Civil services / state public service exams'],
    ['research', 'Public administration research'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_philosophy: D([
    ['higher_studies', 'Higher studies — MA Philosophy / Applied Ethics (CUET-PG)'],
    ['specialize', 'Specialize — applied ethics, logic, bioethics, civilizational studies'],
    ['start_working', 'Start in content, policy research, education or civil-services prep'],
    ['research', 'Philosophy research (UGC-NET / PhD)'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_geography: D([
    ['higher_studies', 'Higher studies — MA / M.Sc Geography (CUET-PG)'],
    ['specialize', 'Specialize — GIS & remote sensing, urban planning, disaster management'],
    ['start_working', 'Start in GIS, planning, environment or government projects'],
    ['government', 'Civil services / survey & planning department roles'],
    ['research', 'Geography research'],
    ['still_exploring', 'Still exploring'],
  ]),
  ba_languages: D([
    ['higher_studies', 'Higher studies — MA in your language / linguistics or translation studies'],
    ['specialize', 'Specialize — translation, interpretation, language teaching, content'],
    ['start_working', 'Start in translation, BPO/global services, content or teaching'],
    ['government', 'Government language service / teaching eligibility'],
    ['research', 'Language / literature research (UGC-NET)'],
    ['still_exploring', 'Still exploring'],
  ]),
  other_humanities: D([
    ['higher_studies', 'Higher studies — MA in your subject (CUET-PG)'],
    ['specialize', 'Specialize in an applied area of your subject'],
    ['start_working', 'Start in content, research, admin or social-sector roles'],
    ['government', 'Civil services / government roles in your area'],
    ['research', 'Research / academia (UGC-NET)'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Law
  llb: D([
    ['start_working', 'Start legal practice / join a law firm (enrol with the Bar)'],
    ['specialize', 'Specialize — corporate, criminal, constitutional, IP, taxation, arbitration'],
    ['higher_studies', 'Higher studies — LL.M (corporate / criminal / IP) via CLAT-PG'],
    ['government', 'Judiciary preparation / public prosecutor / legal advisory'],
    ['business', 'Independent practice, legal consultancy or compliance venture'],
    ['abroad', 'LL.M or practice abroad'],
    ['research', 'Legal research / academia'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Design & Creative
  bdes: D([
    ['start_working', 'Start as a designer (product, UX, graphic or industrial)'],
    ['specialize', 'Specialize — interaction design, UX research, industrial design, design systems'],
    ['higher_studies', 'Higher studies — M.Des (CEED / NID) / MA design abroad'],
    ['business', 'Freelance / start your own studio'],
    ['abroad', 'Design roles or studies abroad'],
    ['research', 'Design research / academia'],
    ['still_exploring', 'Still exploring'],
  ]),
  fashion_design: D([
    ['start_working', 'Start with a fashion house / label / styling role'],
    ['specialize', 'Specialize — fashion merchandising, sustainable fashion, textile design'],
    ['higher_studies', 'Higher studies — M.Des / MA Fashion (NIFT / NID / abroad)'],
    ['business', 'Start your own label / boutique'],
    ['abroad', 'Fashion studies or roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  interior_design: D([
    ['start_working', 'Start with a design studio / turnkey interiors firm'],
    ['specialize', 'Specialize — residential, commercial, lighting or sustainable interiors'],
    ['higher_studies', 'Higher studies — M.Des / MA Interior or spatial design'],
    ['business', 'Own interior design practice / turnkey venture'],
    ['abroad', 'Interior design studies or roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  graphic_design: D([
    ['start_working', 'Start in an agency / studio as a graphic or visual designer'],
    ['specialize', 'Specialize — branding, motion graphics, typography, illustration'],
    ['higher_studies', 'Higher studies — M.Des / MFA in communication design'],
    ['business', 'Freelance practice / own design studio'],
    ['abroad', 'Design roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  ux_ui: D([
    ['start_working', 'Start as a UI/UX designer'],
    ['specialize', 'Specialize — UX research, interaction design, design systems, accessibility'],
    ['higher_studies', 'Higher studies — M.Des / MA in HCI or interaction design'],
    ['business', 'Freelance / product-design consultancy'],
    ['abroad', 'HCI / design studies or roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Agriculture & Environment
  bsc_agriculture: D([
    ['start_working', 'Start in agri-business, agri-input, food processing or field advisory roles'],
    ['specialize', 'Specialize — agronomy, horticulture, plant pathology, soil science, agri-engineering'],
    ['higher_studies', 'Higher studies — M.Sc Agriculture / PG diploma in Agri-Business Management (ICAR AIEEA PG)'],
    ['research', 'Agricultural research (ICAR / PhD)'],
    ['government', 'Agriculture officer / banking (agri) / state service exams'],
    ['business', 'Agri-business / agritech / farm venture'],
    ['abroad', 'Agriculture studies or roles abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  food_technology: D([
    ['start_working', 'Start in food processing, QA or product development'],
    ['specialize', 'Specialize — food safety (HACCP, FSSC), dairy technology, product development'],
    ['higher_studies', 'Higher studies — M.Tech / M.Sc Food Technology (GATE / ICAR AIEEA)'],
    ['research', 'Food science research'],
    ['government', 'FSSAI / food safety and standards roles'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Education
  bed: D([
    ['start_working', 'Start teaching (school / coaching / training roles)'],
    ['specialize', 'Specialize — special education, early childhood, ed-tech, curriculum design'],
    ['higher_studies', 'Higher studies — M.Ed (CUET-PG) / MA in your teaching subject'],
    ['government', 'CTET / TET and government teaching positions'],
    ['research', 'Education research / academia (NET / PhD)'],
    ['business', 'Start a learning centre / ed-tech venture'],
    ['abroad', 'Teach or study abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  // ── Other Professional Programmes
  hotel_management: D([
    ['start_working', 'Start in hotel operations (front office, F&B, kitchen management)'],
    ['specialize', 'Specialize — revenue management, F&B management, hospitality analytics'],
    ['higher_studies', 'Higher studies — MBA / PG diploma in Hospitality or Hotel Administration'],
    ['business', 'Own restaurant / hospitality venture'],
    ['abroad', 'Hospitality roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  hospitality: D([
    ['start_working', 'Start in hospitality operations / guest services'],
    ['specialize', 'Specialize — F&B, front office, revenue management, guest experience'],
    ['higher_studies', 'Higher studies — MBA / PG diploma in Hospitality or Service Management'],
    ['business', 'Own hospitality venture'],
    ['abroad', 'Hospitality roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  tourism: D([
    ['start_working', 'Start in travel operations, tour management or destination marketing'],
    ['specialize', 'Specialize — sustainable tourism, destination management, travel tech'],
    ['higher_studies', 'Higher studies — MBA / MA in Tourism Management'],
    ['government', 'State tourism department / government tourism roles'],
    ['business', 'Own travel / tourism venture'],
    ['abroad', 'Tourism roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  aviation: D([
    ['start_working', 'Start in airline / airport operations or ground services'],
    ['specialize', 'Specialize — airport management, aviation safety, cargo & logistics'],
    ['higher_studies', 'Higher studies — PG diploma in Aviation / Airport Management or MBA (Aviation)'],
    ['government', 'AAI / DGCA-route government aviation roles'],
    ['abroad', 'Aviation roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  logistics: D([
    ['start_working', 'Start in supply chain, warehousing or transport coordination'],
    ['specialize', 'Specialize — CSCP, CILT, SAP, inventory & demand planning'],
    ['higher_studies', 'Higher studies — MBA / PG diploma in Supply Chain & Logistics'],
    ['government', 'Government logistics / defence supply roles'],
    ['abroad', 'Supply-chain roles or studies abroad'],
    ['business', 'Own logistics / transport venture'],
    ['still_exploring', 'Still exploring'],
  ]),
  event_management: D([
    ['start_working', 'Start with an event agency / production house'],
    ['specialize', 'Specialize — corporate events, weddings, entertainment production, event marketing'],
    ['higher_studies', 'Higher studies — PG diploma / MBA in Event Management'],
    ['business', 'Start your own event agency'],
    ['abroad', 'Events roles or studies abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
  other: D([
    ['start_working', 'Start working in your field'],
    ['higher_studies', 'Higher studies in your field'],
    ['specialize', 'Specialize in your functional area'],
    ['business', 'Start your own venture'],
    ['government', 'Government / public-sector roles'],
    ['abroad', 'Work or study abroad'],
    ['still_exploring', 'Still exploring'],
  ]),
};

/**
 * Entrance-exam detection for higher-study routes. The exam list shown to a
 * student is derived from the degree's OWN higher-study options, so a BDS
 * student never sees GATE and a mechanical student never sees NEET-MDS.
 */
export const EXAM_RULES = [
  [/neet-mds/i, { name: 'NEET-MDS', period: 'Typically Mar–Apr · verify official dates' }],
  [/neet-pg/i, { name: 'NEET-PG', period: 'Typically May–Jun · verify official dates' }],
  [/gat-b/i, { name: 'GAT-B', period: 'Typically Apr · verify official dates' }],
  [/icar|aieea/i, { name: 'ICAR AIEEA (PG)', period: 'Typically Jun · verify official dates' }],
  [/nimcet/i, { name: 'NIMCET', period: 'Typically May–Jun · verify official dates' }],
  [/gate/i, { name: 'GATE', period: 'Typically Feb · verify official dates' }],
  [/cat\b|xat\b|pgdm/i, { name: 'CAT / XAT / CMAT', period: 'Typically Nov–Jan · verify official dates' }],
  [/clat-pg|ll\.m/i, { name: 'CLAT-PG / university LL.M entrance', period: 'Typically Dec–May · verify official dates' }],
  [/ceed|nid/i, { name: 'CEED / NID entrance', period: 'Typically Jan · verify official dates' }],
  [/cuet-pg/i, { name: 'CUET-PG (university dependent)', period: 'Typically Jun · verify official dates' }],
  [/iit jam/i, { name: 'IIT JAM', period: 'Typically Feb · verify official dates' }],
  [/csir-net|ugc-net|jest/i, { name: 'CSIR / UGC NET (JRF)', period: 'Typically Jun & Dec · verify official dates' }],
  [/gpat/i, { name: 'GPAT', period: 'Typically May · verify official dates' }],
  [/ctet|\btet\b/i, { name: 'CTET / State TET', period: 'Typically twice a year · verify official dates' }],
  [/nclex|usmle|plab|inbde|oet/i, { name: 'Overseas licensing (USMLE / PLAB / NCLEX / INBDE)', period: 'Rolling — verify with the licensing body' }],
  [/gre|gmat|abroad/i, { name: 'GRE / GMAT / IELTS (for study abroad)', period: 'Rolling — verify with the institution' }],
];

/**
 * Degree-level higher-study options. Keyed by profileId so the option list can
 * never be shared across unrelated degrees. Written from the degree's own
 * postgraduate reality (MDS for BDS, M.Tech for B.Tech, and so on).
 */
export const GRADUATION_PATHWAYS = {
  // ── Medicine & Healthcare
  mbbs: {
    higherStudies: [
      'MD / MS — postgraduate clinical specialization (NEET-PG)',
      'DNB / diploma specialties through the NEET-PG route',
      'Fellowship after MD/MS (cardiology, critical care, endocrinology…)',
      'MPH / MBA in Hospital Administration (public health or management)',
      'Postgraduate study abroad (USMLE / PLAB / AMC pathways)',
    ],
    tracks: {
      md_ms_specialization: 'pg', general_practice: 'practice', surgery_career: 'practice',
      internal_medicine_career: 'practice', pediatrics_career: 'practice', obgyn_career: 'practice',
      radiology_career: 'practice', dermatology_career: 'practice', psychiatry_career: 'practice',
      anesthesiology_career: 'practice', emergency_medicine_career: 'practice',
      public_health_career: 'pg', medical_research_career: 'research',
      medical_education_career: 'teaching', healthcare_admin: 'employment',
      healthcare_entrepreneur: 'business',
    },
    guidance: 'Medicine is a long training path: after MBBS the real fork is whether you want a clinical specialization through NEET-PG or a non-clinical route such as public health, administration or research.',
  },
  bds: {
    higherStudies: [
      'MDS — Master of Dental Surgery (NEET-MDS)',
      'Fellowship / certificate programmes (implantology, endodontics, orthodontics…)',
      'MDS or postgraduate dentistry abroad (INBDE / university route)',
      'MPH / hospital administration for dental public health',
    ],
    tracks: {
      mds_specialization: 'pg', general_dentistry_practice: 'practice', orthodontics_career: 'practice',
      oral_surgery_career: 'practice', prosthodontics_career: 'practice', periodontics_career: 'practice',
      pediatric_dentistry_career: 'practice', dental_research_career: 'research',
      dental_education: 'teaching', dental_entrepreneur: 'business',
    },
    guidance: 'Dentistry rewards early clinical hours. MDS makes sense if you want a specialist practice or teaching — general dentistry with strong clinical volume and a practice build-out is an equally valid route.',
  },
  bams: {
    higherStudies: [
      'MD / MS (Ayurveda) through NEET-PG (Ayurveda)',
      'MD in Kayachikitsa, Shalya Tantra, Panchakarma or similar specializations',
      'Certificate courses in Panchakarma, nutrition or integrative medicine',
      'MPH / healthcare management for public-health roles',
    ],
    guidance: 'AYUSH degrees have their own postgraduate ecosystem — plan for the Ayush PG entrance rather than the modern-medicine NEET-PG.',
  },
  bhms: {
    higherStudies: [
      'MD (Homeopathy) through the AYUSH PG entrance',
      'Certificate courses in clinical homeopathy or paediatric practice',
      'MPH / healthcare management',
    ],
  },
  bums: {
    higherStudies: [
      'MD (Unani) through the AYUSH PG entrance',
      'Certificate courses in Unani clinical practice',
      'MPH / healthcare management',
    ],
  },
  bsms: {
    higherStudies: [
      'MD (Siddha) through the AYUSH PG entrance',
      'Certificate courses in Siddha clinical practice',
      'MPH / healthcare management',
    ],
  },
  bnys: {
    higherStudies: [
      'MD (Naturopathy / Yoga) through the AYUSH PG entrance',
      'Certified yoga therapy / wellness programmes',
      'MPH / healthcare management',
    ],
  },
  bsc_nursing: {
    higherStudies: [
      'M.Sc Nursing — clinical specialization (medical-surgical, paediatric, psychiatric, community)',
      'MHA (hospital administration) or MPH (public health)',
      'Nurse practitioner / critical-care certification programmes',
      'Overseas registration route (NCLEX / OET) for nursing abroad',
    ],
    guidance: 'Nursing has a clear ladder: bedside specialization plus M.Sc Nursing (or an MHA/MPH if you want management) unlocks teaching, leadership and overseas registration.',
  },
  bpt: {
    higherStudies: [
      'MPT — Master of Physiotherapy (orthopaedics, neurology, sports, cardiopulmonary)',
      'Manual therapy / sports physiotherapy certifications',
      'MPT or clinical fellowship abroad',
    ],
    guidance: 'Physiotherapy grows through hands-on case volume and a recognized specialization — MPT in orthopaedics or sports is the most direct route to higher-value practice.',
  },
  bot: {
    higherStudies: [
      'MOT — Master of Occupational Therapy',
      'Paediatric / hand-therapy certification programmes',
      'MPH or rehabilitation management',
    ],
    guidance: 'Occupational therapy opens paediatric, neuro-rehab and hand-therapy niches — MOT plus a focused clinical niche is the fastest way to specialize.',
  },
  bpharm: {
    higherStudies: [
      'M.Pharm — pharmacology, pharmaceutics, pharmaceutical analysis or regulatory affairs (GPAT)',
      'Pharm.D / clinical pharmacy programmes',
      'PG diploma in pharmacovigilance, regulatory affairs or clinical research',
      'MBA in pharmaceutical management',
    ],
    guidance: 'Pharmacy splits into industry, clinical and regulatory tracks — M.Pharm plus a certified niche (regulatory affairs, pharmacovigilance) is what actually changes your role and pay band.',
  },
  pharmd: {
    higherStudies: [
      'PhD / fellowship in pharmaceutical sciences or clinical pharmacy',
      'PG certification in pharmacovigilance, regulatory affairs or clinical research',
      'Hospital clinical pharmacy specialization',
    ],
  },
  bsc_medical_lab: {
    higherStudies: [
      'M.Sc Medical Laboratory Technology (university entrance)',
      'PG diploma in haematology, microbiology or clinical biochemistry',
      'NABL / lab quality and accreditation certification',
    ],
  },
  bsc_radiology: {
    higherStudies: [
      'M.Sc Medical Imaging / Radiology Technology',
      'PG diploma in CT, MRI or interventional imaging technology',
      'Radiology informatics / PACS specialization',
    ],
  },
  bsc_optometry: {
    higherStudies: [
      'M.Optom — Master of Optometry',
      'Certification in contact lens, low vision or paediatric optometry',
      'Optometry abroad (OD bridging programme)',
    ],
  },
  bsc_cardiac: {
    higherStudies: [
      'M.Sc Cardiac Care / Perfusion Technology',
      'PG diploma in echocardiography or cardiac catheterization technology',
      'Cardiac rehabilitation and critical-care certification',
    ],
  },
  bsc_anaesthesia: {
    higherStudies: [
      'M.Sc Anaesthesia & Operation Theatre Technology',
      'PG diploma / certification in critical care technology',
      'Anaesthesia technology specialization abroad',
    ],
  },
  bsc_ot_technology: {
    higherStudies: [
      'M.Sc Operation Theatre Technology',
      'PG diploma in surgical assistance or endoscopy technology',
      'CSSD and surgical quality certification',
    ],
  },
  bsc_respiratory: {
    higherStudies: [
      'M.Sc Respiratory Therapy',
      'PG diploma in pulmonary function testing or sleep studies',
      'Respiratory therapy abroad (certification route)',
    ],
  },
  bsc_dialysis: {
    higherStudies: [
      'M.Sc Dialysis / Renal Technology',
      'PG diploma in nephrology technology',
      'Renal transplant coordination and dialysis quality certification',
    ],
  },
  bsc_emergency: {
    higherStudies: [
      'M.Sc Emergency & Trauma Care Technology',
      'PG diploma in paramedicine or emergency care',
      'Emergency management and disaster-response certification',
    ],
  },
  other_healthcare: {
    higherStudies: [
      'M.Sc / postgraduate specialization in your healthcare field',
      'PG diploma or certification in your clinical area',
      'MHA (hospital administration) or MPH (public health)',
    ],
  },
  // ── Engineering
  btech_cse: {
    higherStudies: [
      'M.Tech / MS in Computer Science or related specialization (GATE)',
      'M.Tech in AI/ML, data science or cybersecurity (GATE)',
      'MS abroad in computer science (GRE / university requirements)',
      'Industry specialization certifications (cloud, systems, full-stack)',
    ],
    guidance: 'For CSE, a master’s pays off if you want research, core systems or a specific specialization — otherwise two years of strong product engineering experience usually compounds faster.',
  },
  btech_ai: {
    higherStudies: [
      'M.Tech / MS in AI or Machine Learning (GATE)',
      'M.Sc / MS in data science or cognitive systems',
      'Research programmes (PhD) in AI / ML',
      'Specialized ML engineering certifications',
    ],
  },
  btech_data_science: {
    higherStudies: [
      'M.Tech / M.Sc in Data Science or Analytics (GATE / university entrance)',
      'MS abroad in data science or statistics',
      'PG diploma in business analytics',
    ],
  },
  btech_it: {
    higherStudies: [
      'M.Tech / MS in IT, CSE or information security (GATE)',
      'MCA / M.Sc IT (if you want a broader computing base)',
      'Cloud / DevOps / networking specialization certifications',
    ],
  },
  btech_cybersecurity: {
    higherStudies: [
      'M.Tech / MS in cybersecurity or information security (GATE)',
      'PG diploma in digital forensics or cyber law',
      'Security certifications (OSCP, CISSP track)',
    ],
  },
  btech_ece: {
    higherStudies: [
      'M.Tech / MS in VLSI, embedded systems or communication engineering (GATE)',
      'MS abroad in electronics, RF or signal processing',
      'Specialized certifications (embedded, RF, IoT, semiconductor design)',
    ],
    guidance: 'ECE splits early — VLSI and embedded roles value a master’s and hands-on lab work far more than a generic degree average.',
  },
  btech_electrical: {
    higherStudies: [
      'M.Tech / ME in power systems, electrical machines or control (GATE)',
      'MS abroad in electrical or energy systems',
      'Power-sector certifications (switchgear, relay protection, SCADA)',
    ],
  },
  btech_mechanical: {
    higherStudies: [
      'M.Tech / ME in design, thermal, manufacturing or CAD-CAM (GATE)',
      'MS abroad in mechanical, automotive or aerospace engineering',
      'Certifications in CAD/FEA, lean manufacturing, HVAC or mechatronics',
    ],
    guidance: 'Mechanical careers branch by domain — design, thermal, manufacturing or EV. Pick the domain first, then decide whether M.Tech (GATE) or 2 years of shop-floor/design experience serves you better.',
  },
  btech_civil: {
    higherStudies: [
      'M.Tech in structural, geotechnical, transportation or water resources (GATE)',
      'M.Plan / construction management / M.Tech environmental',
      'MS abroad in civil or structural engineering',
    ],
  },
  btech_chemical: {
    higherStudies: [
      'M.Tech / MS in chemical engineering, process design or petroleum (GATE)',
      'MS abroad in chemical or process engineering',
      'Process-safety and plant-design certifications',
    ],
  },
  btech_biotech: {
    higherStudies: [
      'M.Tech / M.Sc in biotechnology, bioinformatics or bioprocess (GATE / GAT-B)',
      'MS abroad in biotechnology or biomedical engineering',
      'PG diploma in clinical research or bioprocess quality',
    ],
  },
  btech_aerospace: {
    higherStudies: [
      'M.Tech / MS in aerodynamics, propulsion or space engineering (GATE)',
      'MS abroad in aerospace or space systems',
      'Industry certifications (CATIA, ANSYS, avionics)',
    ],
  },
  btech_automobile: {
    higherStudies: [
      'M.Tech / MS in automotive, IC engine or EV technology (GATE)',
      'MS abroad in automotive engineering',
      'EV & battery, vehicle-dynamics and CAD certifications',
    ],
  },
  btech_mechatronics: {
    higherStudies: [
      'M.Tech / MS in mechatronics, robotics or control systems (GATE)',
      'MS abroad in robotics or automation',
      'Industrial automation and PLC/SCADA certifications',
    ],
  },
  btech_robotics: {
    higherStudies: [
      'M.Tech / MS in robotics or automation (GATE)',
      'Research programmes in robotics and AI',
      'ROS / industrial robotics certifications',
    ],
  },
  btech_environmental: {
    higherStudies: [
      'M.Tech / M.Sc in environmental engineering (GATE)',
      'PG diploma in environmental management, EIA or sustainability',
      'MS abroad in environmental or sustainability engineering',
    ],
  },
  other_engineering: {
    higherStudies: [
      'M.Tech / ME in your engineering discipline (GATE)',
      'MS abroad in a related engineering specialization',
      'Domain certifications and project management (PMP) that fit your branch',
    ],
  },
  // ── Computer Applications
  bca: {
    higherStudies: [
      'MCA (NIMCET / university entrance)',
      'M.Sc Computer Science / Data Science (CUET-PG)',
      'MBA in IT or business analytics',
      'Cloud, data or security certifications (AWS, Azure, Google)',
    ],
    guidance: 'For BCA, MCA is the classic route into the same roles B.Tech CSE graduates get — pair it with internships or certifications so your portfolio does the talking.',
  },
  bsc_cs: {
    higherStudies: [
      'M.Sc Computer Science (CUET-PG / university entrance)',
      'MCA (NIMCET) or M.Tech CSE (GATE)',
      'M.Sc in AI, data science or information security',
    ],
  },
  bsc_it: {
    higherStudies: [
      'M.Sc IT / MCA (CUET-PG / NIMCET)',
      'PG diploma in cloud computing, cybersecurity or data engineering',
    ],
  },
  bsc_data_science: {
    higherStudies: [
      'M.Sc Data Science / AI / Statistics (CUET-PG)',
      'PG diploma in business analytics or big data',
    ],
  },
  bsc_ai: {
    higherStudies: [
      'M.Sc Artificial Intelligence / Machine Learning (CUET-PG)',
      'M.Tech AI (GATE) or MS AI abroad',
    ],
  },
  bsc_cybersecurity: {
    higherStudies: [
      'M.Sc Cybersecurity / Information Security (CUET-PG)',
      'PG diploma in digital forensics or cyber law',
    ],
  },
  bsc_computer_apps: {
    higherStudies: [
      'MCA (NIMCET) / M.Sc Computer Applications or IT',
      'PG diploma in application development or database systems',
    ],
  },
  other_computing: {
    higherStudies: [
      'MCA (NIMCET) or M.Sc in your computing subject',
      'PG diploma / certifications in your computing area',
    ],
  },
  // ── Commerce & Finance
  bcom_general: {
    higherStudies: [
      'M.Com — Master of Commerce (CUET-PG)',
      'MBA / PGDM — general management or finance (CAT / XAT / CMAT)',
      'Professional qualifications: CA, CMA, CS, CFA, ACCA',
      'PG diploma in taxation, banking or financial analytics',
    ],
    guidance: 'In commerce the professional qualification usually beats another degree: CA/CMA/CS or CFA changes the roles you can apply for far more than a generic master’s does.',
  },
  bcom_finance: {
    higherStudies: [
      'M.Com Finance / MBA (Finance) — CAT / CUET-PG',
      'M.Sc Finance / MS Finance abroad',
      'CFA, FRM, CA or financial-modelling certification tracks',
    ],
    tracks: { bank_officer: 'government', financial_planner: 'practice', investment_banker: 'practice' },
    guidance: 'B.Com Finance plus CFA or an MBA (Finance) is the strongest pairing for investment and corporate finance roles — decide whether you want the qualification-first or degree-first route.',
  },
  bcom_business_analytics: {
    higherStudies: [
      'M.Sc Business Analytics / MBA (Business Analytics)',
      'PG diploma in data analytics or business intelligence',
    ],
  },
  bcom_computer_apps: {
    higherStudies: [
      'M.Com (Computer Applications) / MCA / MBA',
      'PG diploma in ERP, audit automation or data analytics',
    ],
  },
  bcom_banking: {
    higherStudies: [
      'MBA (Banking & Finance) / M.Com',
      'Banking certifications (IIBF, JAIIB, CAIIB, NISM)',
    ],
  },
  other_commerce: {
    higherStudies: [
      'M.Com (CUET-PG) or MBA / PGDM',
      'Professional qualifications: CA, CMA, CS, CFA, ACCA',
    ],
  },
  // ── Business & Management
  bba: {
    higherStudies: [
      'MBA / PGDM — general management or your functional area (CAT / XAT / CMAT / GMAT)',
      'PG diploma in a functional specialization (analytics, operations, marketing)',
      'Master’s abroad in management or a specialized field (GMAT / GRE)',
    ],
    guidance: 'For a general BBA, work experience before an MBA is usually the winning sequence — 2 years of real responsibility makes both the MBA and the post-MBA role far stronger.',
  },
  bba_finance: {
    higherStudies: [
      'MBA / PGDM in Finance (CAT / XAT / CMAT)',
      'M.Sc Finance / MS Finance abroad (GRE / GMAT)',
      'CFA, FRM or financial-modelling certification tracks',
      'PG diploma in investment banking or financial analytics',
    ],
    tracks: { bank_officer: 'government', financial_planner: 'practice', investment_banker: 'practice' },
    guidance: 'Your BBA Finance plus CFA or an MBA (Finance) keeps you on the finance track — the real decision is whether you want the qualification route (CFA/FRM) first or the degree route (MBA) first.',
  },
  bba_marketing: {
    higherStudies: [
      'MBA / PGDM in Marketing (CAT / XAT / CMAT)',
      'PG diploma in digital marketing, brand management or consumer research',
      'Master’s abroad in marketing or business analytics',
    ],
  },
  bba_hr: {
    higherStudies: [
      'MBA / PGDM in Human Resources (CAT / XAT / CMAT)',
      'MA in HRM / labour law or PG diploma in HR analytics',
    ],
  },
  bba_analytics: {
    higherStudies: [
      'MBA (Business Analytics) / M.Sc Analytics (CAT / CUET-PG)',
      'PG diploma in data analytics or product analytics',
    ],
  },
  bba_entrepreneurship: {
    higherStudies: [
      'MBA in entrepreneurship, strategy or family-business management',
      'Startup/incubation programmes and accelerator tracks',
    ],
  },
  bba_ib: {
    higherStudies: [
      'MBA / PGDM in International Business (CAT / GMAT)',
      'MA in global trade, EXIM or international relations',
    ],
  },
  bba_operations: {
    higherStudies: [
      'MBA / PGDM in Operations or Project Management',
      'PG diploma in operations excellence, lean six sigma or supply chain',
    ],
  },
  bba_logistics: {
    higherStudies: [
      'MBA / PGDM in Supply Chain & Logistics',
      'Certifications: CSCP, CILT, SAP MM/WM',
    ],
  },
  bba_healthcare: {
    higherStudies: [
      'MHA — Master of Hospital Administration',
      'MPH — Master of Public Health',
      'MBA / PGDM in Healthcare Management',
    ],
  },
  bba_ecommerce: {
    higherStudies: [
      'MBA / PGDM in Marketing, Operations or Business Analytics',
      'PG diploma in e-commerce, digital business or category management',
    ],
  },
  other_management: {
    higherStudies: [
      'MBA / PGDM in your functional area (CAT / XAT / CMAT)',
      'PG diploma or certification in your specialization',
    ],
  },
  // ── Science
  bsc_maths: {
    higherStudies: [
      'M.Sc Mathematics / Applied Mathematics (IIT JAM / CUET-PG)',
      'M.Sc Statistics / Data Science or MCA',
      'Research programmes (CSIR-NET / NBHM / PhD)',
      'B.Ed if teaching appeals to you',
    ],
    guidance: 'A B.Sc Mathematics is a launchpad: M.Sc Maths, statistics, data science or actuarial work all open from here — pick based on whether you enjoy proof-based maths or applied modelling.',
  },
  bsc_physics: {
    higherStudies: [
      'M.Sc Physics (IIT JAM / CUET-PG)',
      'M.Sc in astrophysics, materials science or applied physics',
      'Research programmes (CSIR-NET / JEST / PhD)',
      'PG route into electronics, instrumentation or data analysis',
    ],
    guidance: 'Physics rewards the research route: M.Sc plus a NET/JEST qualification is the standard path into national labs, ISRO/BARC and PhD programmes.',
  },
  bsc_chemistry: {
    higherStudies: [
      'M.Sc Chemistry (IIT JAM / CUET-PG)',
      'M.Sc in analytical, organic, polymer or pharmaceutical chemistry',
      'Research programmes (CSIR-NET / PhD in chemistry)',
      'Pharma / QC industry PG diplomas',
    ],
  },
  bsc_statistics: {
    higherStudies: [
      'M.Sc Statistics (ISI / CUET-PG)',
      'M.Sc Data Science / Actuarial Science',
      'Actuarial exams (IAI / IFoA) or analytics PG diploma',
    ],
  },
  bsc_biology: {
    higherStudies: [
      'M.Sc in zoology, botany, genetics or life sciences (CUET-PG)',
      'M.Sc Microbiology, Biotechnology or Biochemistry',
      'Research programmes (CSIR-NET / PhD in life sciences)',
      'B.Ed / M.Sc B.Ed for teaching',
    ],
  },
  bsc_biotech_science: {
    higherStudies: [
      'M.Sc Biotechnology / Molecular Biology (GAT-B / CUET-PG)',
      'M.Sc in genomics, bioinformatics or clinical research',
      'M.Tech bioprocess or biomedical engineering (GATE)',
      'Research programmes (DBT-JRF / CSIR-NET) leading to a PhD',
    ],
    guidance: 'Biotechnology works best with a lab-centric master’s plus hands-on projects — decide early between industrial bioprocess roles, diagnostics and research.',
  },
  bsc_microbiology: {
    higherStudies: [
      'M.Sc Microbiology / Medical Microbiology (CUET-PG)',
      'M.Sc in infection control, immunology or biotechnology',
      'PG diploma in clinical research or lab quality (NABL)',
    ],
  },
  bsc_biochemistry: {
    higherStudies: [
      'M.Sc Biochemistry / Clinical Biochemistry (CUET-PG)',
      'M.Sc in molecular biology, genomics or nutrition science',
      'PG diploma in clinical research or medical lab quality',
    ],
  },
  bsc_botany: {
    higherStudies: [
      'M.Sc Botany / Plant Sciences (CUET-PG)',
      'M.Sc in plant biotechnology, ecology or environmental science',
      'Research programmes (CSIR-NET / PhD)',
    ],
  },
  bsc_zoology: {
    higherStudies: [
      'M.Sc Zoology / Wildlife Biology (CUET-PG)',
      'M.Sc in genetics, ecology, conservation or toxicology',
      'Research programmes (CSIR-NET / PhD in zoology)',
    ],
  },
  bsc_env_science: {
    higherStudies: [
      'M.Sc Environmental Science / Climate Studies',
      'M.Tech / M.Plan in environmental engineering or planning (GATE)',
      'PG diploma in EIA, GIS & remote sensing or sustainability',
    ],
  },
  bsc_forensic: {
    higherStudies: [
      'M.Sc Forensic Science (CUET-PG / university entrance)',
      'PG diploma in cyber forensics or questioned documents',
      'Forensic lab internships and certification tracks',
    ],
  },
  bsc_geology: {
    higherStudies: [
      'M.Sc Geology / Applied Geology (IIT JAM / CUET-PG)',
      'PG diploma in hydrogeology, mining or petroleum exploration',
      'Research programmes (CSIR-NET / PhD)',
    ],
  },
  bsc_food_science: {
    higherStudies: [
      'M.Sc / M.Tech Food Technology (GATE / ICAR AIEEA)',
      'PG diploma in food safety, QA or dairy technology',
      'Industry certifications (HACCP, FSSC 22000, Six Sigma)',
    ],
  },
  other_science: {
    higherStudies: [
      'Relevant M.Sc in your science subject (CUET-PG / university entrance)',
      'PG diploma or applied specialization in your subject',
      'Research route (CSIR-NET) or B.Ed for teaching',
    ],
  },
  // ─ Arts & Humanities
  ba_economics: {
    higherStudies: [
      'MA Economics (CUET-PG / DSE / IIT entrance)',
      'MA / M.Sc in public policy, development studies or quantitative economics',
      'MBA or MA Finance for the applied finance route',
      'Research route: MA + PhD (UGC-NET / JRF)',
    ],
    guidance: 'Economics pays off fastest when it is quantified — MA Economics with econometrics and data skills opens analyst, policy and finance roles, not just academia.',
  },
  ba_psychology: {
    higherStudies: [
      'MA / M.Sc Clinical or Counselling Psychology (CUET-PG)',
      'MA in organisational, child or applied psychology',
      'PG diploma in counselling skills or therapy (RCI-recognised where required)',
      'Research route: MA + PhD / UGC-NET',
    ],
    guidance: 'Clinical and counselling practice in India requires a postgraduate degree (and often an RCI-recognised qualification) — an MA/M.Sc is the gate, not an optional upgrade.',
  },
  ba_political_science: {
    higherStudies: [
      'MA Political Science / International Relations (CUET-PG)',
      'PG diploma in public policy, diplomacy or legislative studies',
      'Research route (UGC-NET / PhD)',
      'Civil services preparation alongside',
    ],
  },
  ba_sociology: {
    higherStudies: [
      'MA Sociology (CUET-PG)',
      'MSW — Master of Social Work (specialization route)',
      'PG diploma in development studies, NGO management or HR',
    ],
  },
  ba_history: {
    higherStudies: [
      'MA History / Archaeology (CUET-PG)',
      'PG diploma in museology, archival studies or heritage management',
      'B.Ed / NET-PhD for teaching and research',
    ],
  },
  ba_english: {
    higherStudies: [
      'MA English Literature / Linguistics (CUET-PG)',
      'PG diploma in content, publishing, ELT or journalism',
      'B.Ed / NET-PhD for teaching and research',
    ],
  },
  ba_journalism: {
    higherStudies: [
      'MA Journalism / Mass Communication (CUET-PG)',
      'PG diploma in digital media, data journalism or PR',
      'Portfolio-based specialization certifications',
    ],
  },
  ba_mass_comm: {
    higherStudies: [
      'MA Mass Communication / Media Studies (CUET-PG)',
      'PG diploma in advertising, PR, film production or digital media',
    ],
  },
  ba_public_admin: {
    higherStudies: [
      'MA Public Administration / Public Policy (CUET-PG)',
      'PG diploma in governance, urban management or public policy',
    ],
  },
  ba_philosophy: {
    higherStudies: [
      'MA Philosophy / Applied Ethics (CUET-PG)',
      'PG diploma in bioethics, logic or civilizational studies',
      'Research route (UGC-NET / PhD)',
    ],
  },
  ba_geography: {
    higherStudies: [
      'MA / M.Sc Geography (CUET-PG)',
      'PG diploma in GIS & remote sensing or urban planning',
    ],
  },
  ba_languages: {
    higherStudies: [
      'MA in your language / linguistics or translation studies',
      'PG diploma in translation, interpretation or language teaching',
    ],
  },
  other_humanities: {
    higherStudies: [
      'Relevant MA in your subject (CUET-PG)',
      'PG diploma in an applied area of your subject',
      'B.Ed or research route (UGC-NET)',
    ],
  },
  // ── Law
  llb: {
    higherStudies: [
      'LL.M — Master of Laws (CLAT-PG / university entrance): corporate, criminal, constitutional or IP',
      'PG diploma in corporate law, IPR, arbitration or cyber law',
      'Judiciary preparation (state judicial services) after enrolment',
      'LL.M or practice abroad (bar requirements vary by country)',
    ],
    guidance: 'After an LLB the two decisive moves are enrolment and direction — litigation builds slowly through court exposure, while corporate law favours LL.M plus internships.',
  },
  // ── Design & Creative
  bdes: {
    higherStudies: [
      'M.Des (CEED / NID / IIT entrance)',
      'MA in design, design management or interaction design',
      'Specialized PG programmes in UX, industrial design or design strategy',
      'Design studies abroad (portfolio-led admission)',
    ],
    guidance: 'In design, the portfolio outranks the degree. M.Des is worth it for specialization and teaching; otherwise strong shipped work and a focused internship history move you faster.',
  },
  fashion_design: {
    higherStudies: [
      'M.Des / MA Fashion Design or Textile Design (NIFT / NID)',
      'PG diploma in fashion merchandising, buying or sustainable fashion',
      'Fashion business / design management programmes abroad',
    ],
  },
  interior_design: {
    higherStudies: [
      'M.Des / MA Interior or Spatial Design',
      'PG diploma in sustainable design, lighting design or construction management',
    ],
  },
  graphic_design: {
    higherStudies: [
      'M.Des / MFA in Graphic or Communication Design',
      'PG diploma in branding, motion graphics or typography',
    ],
  },
  ux_ui: {
    higherStudies: [
      'M.Des / MA in Interaction Design or HCI',
      'PG certificate in UX research or product design',
      'Master’s abroad in HCI / design informatics',
    ],
  },
  // ── Agriculture & Environment
  bsc_agriculture: {
    higherStudies: [
      'M.Sc Agriculture — agronomy, plant pathology, horticulture, soil science (ICAR AIEEA PG)',
      'PG diploma in Agri-Business Management (ABM)',
      'M.Tech / M.Sc in agricultural engineering or agri-biotechnology',
      'Research programmes (ICAR / ARS-NET / PhD)',
    ],
    guidance: 'Agriculture splits into field science, agri-business and public service — ICAR PG, ABM or the agriculture-officer exams each lead somewhere genuinely different, so choose the destination first.',
  },
  food_technology: {
    higherStudies: [
      'M.Tech / M.Sc Food Technology (GATE / ICAR AIEEA PG)',
      'PG diploma in food safety, QA or dairy technology',
      'Industry certifications (HACCP, FSSC 22000, Six Sigma)',
    ],
  },
  // ── Education
  bed: {
    higherStudies: [
      'M.Ed — Master of Education (CUET-PG)',
      'MA in your teaching subject plus NET/PhD for college teaching',
      'PG diploma in special education, educational leadership or ed-tech',
    ],
    guidance: 'B.Ed is a licence to teach, not the ceiling — M.Ed, a subject master’s or a special-education specialization is what opens senior, leadership and college-level roles.',
  },
  // ── Other Professional Programmes
  hotel_management: {
    higherStudies: [
      'MBA / PG diploma in Hospitality or Hotel Administration',
      'PG diploma in revenue management, F&B management or event operations',
      'International hospitality certifications (IHM / hotel-school PG routes)',
    ],
  },
  hospitality: {
    higherStudies: [
      'PG diploma in hospitality management or hotel administration',
      'MBA in tourism / service management',
      'Specialized certifications (F&B, front office, revenue management)',
    ],
  },
  tourism: {
    higherStudies: [
      'MBA / MA in Tourism Management',
      'PG diploma in travel & tourism, destination management or travel tech',
      'IATA / sustainable tourism certifications',
    ],
  },
  aviation: {
    higherStudies: [
      'PG diploma in aviation or airport management',
      'MBA in aviation business, logistics or operations',
      'DGCA-route technical certifications (if you take the technical track)',
    ],
  },
  logistics: {
    higherStudies: [
      'MBA / PG diploma in Supply Chain & Logistics',
      'Certifications: CILT, CSCP, SAP MM/WM',
      'Analytics specialization in supply chain',
    ],
  },
  event_management: {
    higherStudies: [
      'PG diploma / MBA in Event Management',
      'Certifications in event design, marketing or production',
    ],
  },
  other: {
    higherStudies: [
      'A postgraduate degree in your field (if one exists)',
      'A PG diploma or certification aligned to your work area',
      'Professional development courses and industry certifications',
    ],
  },
};

/**
 * Family-level higher studies — last resort only, for degrees that have no
 * pathway entry yet. Still academically scoped to the family (never "MBA /
 * Master's / PhD" for everyone).
 */
export const FAMILY_HIGHER_STUDIES = {
  'Engineering': ['M.Tech / ME in your branch (GATE)', 'MS abroad in a related engineering specialization', 'PG diploma or certifications in your domain'],
  'Medicine & Healthcare': ['Relevant postgraduate specialization in your healthcare field', 'PG diploma / certification in your clinical area', 'MHA (hospital administration) or MPH (public health)'],
  'Computer Applications': ['MCA (NIMCET) or M.Sc in your computing subject', 'M.Tech CSE / IT (GATE) if you want the engineering route', 'Cloud / data / security certifications'],
  'Commerce & Finance': ['M.Com (CUET-PG) or MBA / PGDM', 'Professional qualifications: CA, CMA, CS, CFA, ACCA', 'PG diploma in taxation, banking or financial analytics'],
  'Business & Management': ['MBA / PGDM in your functional area (CAT / XAT / CMAT)', 'PG diploma in a specialization (analytics, operations, marketing, HR)', 'Master’s abroad in management (GMAT / GRE)'],
  'Science': ['M.Sc in your science subject (CUET-PG / university entrance)', 'PG diploma or applied specialization in your subject', 'Research route (CSIR-NET) or B.Ed for teaching'],
  'Arts & Humanities': ['Relevant MA in your subject (CUET-PG)', 'PG diploma in an applied area of your subject', 'B.Ed or research route (UGC-NET)'],
  'Law': ['LL.M (CLAT-PG / university entrance)', 'PG diploma in corporate law, IPR or arbitration', 'Judiciary preparation after enrolment'],
  'Design & Creative': ['M.Des (CEED / NID) or MA in your design field', 'PG diploma in a design specialization', 'Design studies abroad (portfolio-led)'],
  'Agriculture & Environment': ['M.Sc Agriculture / Environmental Science (ICAR AIEEA PG / CUET-PG)', 'PG diploma in Agri-Business Management (ABM)', 'Research programmes (ICAR / ARS-NET / PhD)'],
  'Education': ['M.Ed (CUET-PG)', 'MA in your teaching subject plus NET/PhD', 'PG diploma in special education or educational leadership'],
  'Other Professional': ['A postgraduate degree in your field (if one exists)', 'A PG diploma or certification aligned to your work', 'Professional development courses and industry certifications'],
};

/** Family-level counsellor note — used only when the degree has no note. */
export const FAMILY_GUIDANCE = {
  'Engineering': 'Engineering decisions are made by domain: pick design, core, software or management first, then choose between a master’s and real project experience.',
  'Medicine & Healthcare': 'Healthcare careers are credential-driven — the postgraduate route you choose defines the practice you build, so plan it early.',
  'Computer Applications': 'In computing, demonstrated work (projects, internships, certifications) usually matters more than which master’s you take.',
  'Commerce & Finance': 'In commerce and finance, a professional qualification (CA/CFA/CMA) or an MBA usually changes your role more than an additional general degree.',
  'Business & Management': 'Management careers reward ownership of outcomes — two years of strong execution plus a focused MBA beats stacking degrees without responsibility.',
  'Science': 'Science degrees branch into research, applied industry and teaching. Decide which of the three you want, because each needs a different postgraduate route.',
  'Arts & Humanities': 'Humanities degrees convert well when you pair them with a practical specialization — a master’s, a policy/psychology/journalism route or a professional skill.',
  'Law': 'Law rewards direction: litigation, corporate practice, judiciary and legal research each need different preparation from the same LLB.',
  'Design & Creative': 'In design the portfolio is the qualification — specialize, ship real work and let internships carry more weight than certificates.',
  'Agriculture & Environment': 'Agriculture and environment careers split into field science, business and public service — the exams and postgraduate routes differ sharply for each.',
  'Education': 'Education careers grow through a subject or special-education specialization, and government teaching needs the relevant TET/CTET qualification.',
  'Other Professional': 'For professional programmes, pick a functional specialization early — that is what recruiters and postgraduate admissions respond to.',
};