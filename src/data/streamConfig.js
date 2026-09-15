/**
 * NAVORA — centralized, stream-aware education configuration.
 *
 * Single source of truth for every student-facing option:
 *
 *   educationStage → stream/field → subjects/options → pathways → options → emoji
 *
 * Nothing in the app hard-codes its own list of streams, subjects or fields —
 * pages/components derive everything from this structure so options are always
 * gated by (education stage + selected stream/field) and never leak across
 * streams.
 */

import { streamData as class12StreamData } from './careerQuestionnaire';
import { degreeProfiles } from './degreeProfiles';
import { resolveProfileId } from './graduationDegreeConfig';

const after10 = {
  id: 'after10',
  label: 'After Class 10',
  userType: 'class10',
  streamQuestionId: 'stream',
  notDecidedId: 'not_decided',
  fields: {
    mpc: {
      id: 'mpc',
      name: 'MPC',
      label: 'MPC — Maths, Physics, Chemistry',
      emoji: '🧮',
      interests: [
        { id: 'mathematics', label: 'Mathematics', emoji: '➗', stream: 'science' },
        { id: 'physics', label: 'Physics', emoji: '⚛️', stream: 'science' },
        { id: 'chemistry', label: 'Chemistry', emoji: '🧪', stream: 'science' },
        { id: 'computer_science', label: 'Computer Science', emoji: '💻', stream: 'science' },
        { id: 'maths_engineering', label: 'Mathematics & Engineering', emoji: '📐', stream: 'science' },
        { id: 'technology', label: 'Technology', emoji: '🤖', stream: 'science' },
        { id: 'aerospace_space', label: 'Aerospace / Space', emoji: '🛰️', stream: 'science' },
      ],
    },
    bipc: {
      id: 'bipc',
      name: 'BiPC',
      label: 'BiPC — Biology, Physics, Chemistry',
      emoji: '🧬',
      interests: [
        { id: 'biology', label: 'Biology', emoji: '🧬', stream: 'science' },
        { id: 'physics', label: 'Physics', emoji: '⚛️', stream: 'science' },
        { id: 'chemistry', label: 'Chemistry', emoji: '🧪', stream: 'science' },
        { id: 'life_sciences', label: 'Life Sciences', emoji: '🔬', stream: 'science' },
        { id: 'medicine', label: 'Medicine', emoji: '🩺', stream: 'science' },
        { id: 'dental', label: 'Dental', emoji: '🦷', stream: 'science' },
        { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', stream: 'science' },
        { id: 'biotechnology', label: 'Biotechnology', emoji: '🧫', stream: 'science' },
        { id: 'agriculture', label: 'Agriculture', emoji: '🌱', stream: 'science' },
      ],
    },
    commerce: {
      id: 'commerce',
      name: 'Commerce',
      label: 'Commerce',
      emoji: '💰',
      interests: [
        { id: 'finance', label: 'Finance', emoji: '💰', stream: 'commerce' },
        { id: 'accounting', label: 'Accounting', emoji: '📊', stream: 'commerce' },
        { id: 'business', label: 'Business', emoji: '📈', stream: 'commerce' },
        { id: 'banking', label: 'Banking', emoji: '🏦', stream: 'commerce' },
        { id: 'management', label: 'Management', emoji: '💼', stream: 'commerce' },
        { id: 'economics', label: 'Economics', emoji: '🌐', stream: 'commerce' },
      ],
    },
    arts: {
      id: 'arts',
      name: 'Arts / Humanities',
      label: 'Arts / Humanities',
      emoji: '🎨',
      interests: [
        { id: 'literature', label: 'Literature', emoji: '📚', stream: 'arts' },
        { id: 'history', label: 'History', emoji: '🏛️', stream: 'arts' },
        { id: 'geography', label: 'Geography', emoji: '🌍', stream: 'arts' },
        { id: 'law', label: 'Law', emoji: '⚖️', stream: 'arts' },
        { id: 'political_science', label: 'Political Science', emoji: '🗳️', stream: 'arts' },
        { id: 'psychology', label: 'Psychology', emoji: '🧠', stream: 'arts' },
        { id: 'journalism', label: 'Journalism', emoji: '📰', stream: 'arts' },
        { id: 'fine_arts', label: 'Fine Arts', emoji: '🎨', stream: 'arts' },
      ],
    },
    diploma: {
      id: 'diploma',
      name: 'Diploma / Polytechnic',
      label: 'Diploma / Polytechnic',
      emoji: '🎓',
      interests: [
        { id: 'mechanical', label: 'Mechanical', emoji: '⚙️', stream: 'vocational' },
        { id: 'electrical', label: 'Electrical', emoji: '🔌', stream: 'vocational' },
        { id: 'civil', label: 'Civil', emoji: '🏗️', stream: 'vocational' },
        { id: 'computer_engineering', label: 'Computer Engineering', emoji: '💻', stream: 'vocational' },
        { id: 'electronics', label: 'Electronics', emoji: '📡', stream: 'vocational' },
        { id: 'automobile', label: 'Automobile', emoji: '🚗', stream: 'vocational' },
      ],
    },
    iti: {
      id: 'iti',
      name: 'ITI / Vocational',
      label: 'ITI / Vocational',
      emoji: '🔧',
      interests: [
        { id: 'technical_trades', label: 'Technical Trades', emoji: '🔧', stream: 'vocational' },
        { id: 'electrical', label: 'Electrical', emoji: '⚡', stream: 'vocational' },
        { id: 'skilled_trades', label: 'Skilled Trades', emoji: '🛠️', stream: 'vocational' },
        { id: 'automobile', label: 'Automobile', emoji: '🚗', stream: 'vocational' },
        { id: 'it_computer', label: 'IT & Computer', emoji: '💻', stream: 'vocational' },
        { id: 'fitter_mechanical', label: 'Fitter / Mechanical', emoji: '🔩', stream: 'vocational' },
      ],
    },
  },
};

const after12 = {
  id: 'after12',
  label: 'After Class 12',
  userType: 'class12',
  streamQuestionId: 'stream',
  fields: {
    science_pcm: {
      id: 'science_pcm',
      name: 'MPC',
      label: 'MPC — Physics, Chemistry, Mathematics',
      emoji: '🧮',
      interests: [
        { id: 'computer_science', label: 'Computer Science & IT', emoji: '💻', recKey: 'computer_science' },
        { id: 'mechanical_eng', label: 'Mechanical Engineering', emoji: '⚙️', recKey: 'engineering' },
        { id: 'electrical_eng', label: 'Electrical Engineering', emoji: '🔌', recKey: 'engineering' },
        { id: 'civil_eng', label: 'Civil Engineering', emoji: '🏗️', recKey: 'engineering' },
        { id: 'electronics', label: 'Electronics & Communication', emoji: '📡', recKey: 'engineering' },
        { id: 'aerospace', label: 'Aerospace & Defence', emoji: '🛰️', recKey: 'engineering' },
        { id: 'ai_technology', label: 'AI & Technology', emoji: '🤖', recKey: 'computer_science' },
        { id: 'architecture', label: 'Architecture & Planning', emoji: '📐', recKey: 'architecture' },
        { id: 'pure_sciences', label: 'Pure Sciences & Research', emoji: '🔬', recKey: 'physical_sciences' },
        { id: 'mathematics', label: 'Mathematics & Statistics', emoji: '➗', recKey: 'mathematics' },
        { id: 'defence', label: 'Defence & Technical Services', emoji: '🛡️', recKey: 'defence' },
      ],
    },
    science_pcb: {
      id: 'science_pcb',
      name: 'BiPC',
      label: 'BiPC — Physics, Chemistry, Biology',
      emoji: '🧬',
      interests: [
        { id: 'medicine', label: 'Medicine & Healthcare', emoji: '🩺', recKey: 'medicine' },
        { id: 'dentistry', label: 'Dentistry', emoji: '🦷', recKey: 'dentistry' },
        { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', recKey: 'pharmacy' },
        { id: 'biotechnology', label: 'Biotechnology & Life Sciences', emoji: '🧬', recKey: 'biotechnology' },
        { id: 'life_sciences', label: 'Life Sciences & Research', emoji: '🔬', recKey: 'biological_sciences' },
        { id: 'agriculture', label: 'Agriculture & Food Sciences', emoji: '🌱', recKey: 'agriculture' },
        { id: 'biological_sciences', label: 'Biological Sciences & Research', emoji: '🧪', recKey: 'biological_sciences' },
        { id: 'allied_health', label: 'Allied Health Sciences', emoji: '🧠', recKey: 'nursing' },
        { id: 'veterinary', label: 'Veterinary & Animal Sciences', emoji: '🐾', recKey: 'veterinary' },
      ],
    },
    mec: {
      id: 'mec',
      name: 'MEC',
      label: 'MEC — Mathematics, Economics, Commerce',
      emoji: '🧮',
      interests: [
        { id: 'finance', label: 'Finance & Investment', emoji: '💰', recKey: 'finance' },
        { id: 'accounting', label: 'CA / Accounting & Taxation', emoji: '📊', recKey: 'accounting' },
        { id: 'economics', label: 'Economics', emoji: '🌐', recKey: 'economics' },
        { id: 'banking', label: 'Banking & Financial Services', emoji: '🏦', recKey: 'banking' },
        { id: 'business', label: 'Business & Management', emoji: '💼', recKey: 'business' },
        { id: 'investment', label: 'Investment & Financial Markets', emoji: '📈', recKey: 'finance' },
        { id: 'analytics', label: 'Business Analytics', emoji: '📊', recKey: 'business' },
        { id: 'actuarial', label: 'Actuarial / Data & Statistics', emoji: '➗', recKey: 'mathematics' },
        { id: 'entrepreneurship', label: 'Entrepreneurship', emoji: '🚀', recKey: 'business' },
      ],
    },
    cec: {
      id: 'cec',
      name: 'CEC',
      label: 'CEC — Civics, Economics, Commerce',
      emoji: '⚖️',
      interests: [
        { id: 'law', label: 'Law & Legal Studies', emoji: '⚖️', recKey: 'law' },
        { id: 'govt', label: 'Government / Civil Services', emoji: '🏛️', recKey: 'law' },
        { id: 'business', label: 'Business & Management', emoji: '💼', recKey: 'business' },
        { id: 'economics', label: 'Economics', emoji: '🌐', recKey: 'economics' },
        { id: 'media', label: 'Media & Communication', emoji: '📰', recKey: 'journalism' },
        { id: 'social', label: 'Social Sciences', emoji: '🌍', recKey: 'social_sciences' },
        { id: 'policy', label: 'Public Policy', emoji: '🧭', recKey: 'public_policy' },
        { id: 'psychology', label: 'Psychology', emoji: '🧠', recKey: 'psychology' },
      ],
    },
    commerce: {
      id: 'commerce',
      name: 'Commerce',
      label: 'Commerce',
      emoji: '💰',
      interests: [
        { id: 'finance', label: 'Finance & Investment', emoji: '💰', recKey: 'finance' },
        { id: 'accounting', label: 'Accounting & Taxation', emoji: '📊', recKey: 'accounting' },
        { id: 'banking', label: 'Banking & Financial Services', emoji: '🏦', recKey: 'banking' },
        { id: 'business', label: 'Business & Management', emoji: '💼', recKey: 'business' },
        { id: 'management', label: 'Management & Leadership', emoji: '📈', recKey: 'business' },
        { id: 'taxation', label: 'Taxation', emoji: '🧾', recKey: 'accounting' },
        { id: 'economics', label: 'Economics', emoji: '🌐', recKey: 'economics' },
        { id: 'ca', label: 'Chartered Accountancy (CA)', emoji: '🎖️', recKey: 'ca' },
        { id: 'cs', label: 'Company Secretary (CS)', emoji: '🗂️', recKey: 'cs' },
        { id: 'cma', label: 'Cost & Management Accounting (CMA)', emoji: '📉', recKey: 'cma' },
      ],
    },
    arts: {
      id: 'arts',
      name: 'Arts / Humanities',
      label: 'Arts / Humanities',
      emoji: '🎨',
      interests: [
        { id: 'law', label: 'Law & Legal Studies', emoji: '⚖️', recKey: 'law' },
        { id: 'psychology', label: 'Psychology & Human Behaviour', emoji: '🧠', recKey: 'psychology' },
        { id: 'journalism', label: 'Journalism & Mass Communication', emoji: '📰', recKey: 'journalism' },
        { id: 'literature', label: 'Literature & Languages', emoji: '📚', recKey: 'languages' },
        { id: 'history', label: 'History & Heritage Studies', emoji: '🏛️', recKey: 'social_sciences' },
        { id: 'political_science', label: 'Political Science', emoji: '🗳️', recKey: 'social_sciences' },
        { id: 'social_sciences', label: 'Social Sciences', emoji: '🌍', recKey: 'social_sciences' },
        { id: 'public_policy', label: 'Public Policy & Civil Services', emoji: '🏛️', recKey: 'public_policy' },
        { id: 'education', label: 'Education & Teaching', emoji: '🎓', recKey: 'education' },
        { id: 'design', label: 'Design & Creative Arts', emoji: '🎨', recKey: 'design' },
      ],
    },
  },
};

const graduation = {
  id: 'graduation',
  label: 'Graduation / College',
  userType: 'graduate',
  degreeQuestionId: 'degree',
  degrees: [
    { value: 'btech', label: 'B.Tech / Engineering', category: 'engineering', emoji: '⚙️' },
    { value: 'bcom', label: 'B.Com / Commerce', category: 'commerce', emoji: '💰' },
    { value: 'ba', label: 'BA / Arts', category: 'arts', emoji: '🎨' },
    { value: 'bsc', label: 'B.Sc / Science', category: 'science', emoji: '🔬' },
    { value: 'mbbs', label: 'MBBS / Medicine', category: 'medicine', emoji: '🩺' },
    { value: 'other', label: 'Other', category: 'other', emoji: '🌐' },
  ],
  categories: {
    engineering: {
      id: 'engineering',
      label: 'Engineering',
      emoji: '⚙️',
      branches: [
        {
          id: 'cs_it',
          label: 'Computer Science & IT',
          emoji: '💻',
          specializations: [
            { id: 'software_dev', label: 'Software Development', emoji: '💻' },
            { id: 'ai_ml', label: 'AI & Machine Learning', emoji: '🤖' },
            { id: 'data_science', label: 'Data Science', emoji: '📊' },
            { id: 'cybersecurity', label: 'Cybersecurity', emoji: '🔐' },
            { id: 'cloud_computing', label: 'Cloud Computing', emoji: '☁️' },
            { id: 'web_development', label: 'Web Development', emoji: '🌐' },
          ],
        },
        {
          id: 'mechanical',
          label: 'Mechanical Engineering',
          emoji: '⚙️',
          specializations: [
            { id: 'mechanical_design', label: 'Mechanical Design', emoji: '⚙️' },
            { id: 'automation', label: 'Automation & Robotics', emoji: '🤖' },
            { id: 'automotive', label: 'Automotive Engineering', emoji: '🚗' },
            { id: 'manufacturing', label: 'Manufacturing', emoji: '🏭' },
            { id: 'industrial_engineering', label: 'Industrial Engineering', emoji: '🛠️' },
          ],
        },
        {
          id: 'civil',
          label: 'Civil Engineering',
          emoji: '🏗️',
          specializations: [
            { id: 'construction', label: 'Construction', emoji: '🏗️' },
            { id: 'structural', label: 'Structural Engineering', emoji: '🏢' },
            { id: 'infrastructure', label: 'Infrastructure', emoji: '🛣️' },
            { id: 'transportation', label: 'Transportation', emoji: '🌉' },
            { id: 'planning_design', label: 'Planning & Design', emoji: '📐' },
          ],
        },
        {
          id: 'electrical',
          label: 'Electrical & Electronics',
          emoji: '⚡',
          specializations: [
            { id: 'electrical_systems', label: 'Electrical Systems', emoji: '⚡' },
            { id: 'electronics', label: 'Electronics', emoji: '🔌' },
            { id: 'automation_control', label: 'Automation & Control', emoji: '🤖' },
            { id: 'embedded_systems', label: 'Embedded Systems', emoji: '📡' },
            { id: 'energy', label: 'Energy & Power', emoji: '🔋' },
          ],
        },
      ],
    },
    commerce: {
      id: 'commerce',
      label: 'Commerce / Finance',
      emoji: '💰',
      fields: [
        { id: 'finance', label: 'Finance', emoji: '💰' },
        { id: 'accounting', label: 'Accounting', emoji: '📊' },
        { id: 'banking', label: 'Banking', emoji: '🏦' },
        { id: 'investment', label: 'Investment', emoji: '📈' },
        { id: 'taxation', label: 'Taxation', emoji: '🧾' },
        { id: 'business', label: 'Business & Management', emoji: '💼' },
        { id: 'economics', label: 'Economics', emoji: '📉' },
      ],
    },
    arts: {
      id: 'arts',
      label: 'Arts & Humanities',
      emoji: '🎨',
      fields: [
        { id: 'law', label: 'Law', emoji: '⚖️' },
        { id: 'psychology', label: 'Psychology', emoji: '🧠' },
        { id: 'journalism', label: 'Journalism & Media', emoji: '📰' },
        { id: 'literature', label: 'Literature', emoji: '📚' },
        { id: 'history', label: 'History', emoji: '🏛️' },
        { id: 'political_science', label: 'Political Science', emoji: '🗳️' },
        { id: 'social_sciences', label: 'Social Sciences', emoji: '🌍' },
      ],
    },
    science: {
      id: 'science',
      label: 'Science',
      emoji: '🔬',
      fields: [
        { id: 'cs_it', label: 'Computer Science & IT', emoji: '💻' },
        { id: 'physical_sciences', label: 'Physical Sciences', emoji: '🔬' },
        { id: 'life_sciences', label: 'Life Sciences', emoji: '🧬' },
        { id: 'mathematics', label: 'Mathematics & Statistics', emoji: '➗' },
        { id: 'other_science', label: 'Other Science Fields', emoji: '🧪' },
      ],
    },
    medicine: {
      id: 'medicine',
      label: 'Medicine',
      emoji: '🩺',
      fields: [
        { id: 'clinical', label: 'Clinical Medicine', emoji: '🩺' },
        { id: 'research', label: 'Research & Academics', emoji: '🔬' },
        { id: 'public_health', label: 'Public Health', emoji: '🌍' },
        { id: 'other_medicine', label: 'Other Health Fields', emoji: '🏥' },
      ],
    },
    other: {
      id: 'other',
      label: 'Other Background',
      emoji: '🌐',
      fields: [
        { id: 'technology', label: 'Technology & IT', emoji: '💻' },
        { id: 'business', label: 'Business & Management', emoji: '💼' },
        { id: 'creative', label: 'Creative & Design', emoji: '🎨' },
        { id: 'public_service', label: 'Public Service', emoji: '🏛️' },
        { id: 'other_field', label: 'Other', emoji: '🌐' },
      ],
    },
  },
};

export const streamConfig = { after10, after12, graduation };

/** Map a userType (persona id) to its education stage config. */
export function getStage(userType) {
  if (userType === 'class10') return after10;
  if (userType === 'class12') return after12;
  if (userType === 'graduate') return graduation;
  return null;
}

/** The single stream/field object for an After 10th / After 12th selection. */
export function getField(userType, fieldId) {
  const stage = getStage(userType);
  if (!stage || !stage.fields) return null;
  return stage.fields[fieldId] || null;
}

/**
 * Options shown for the After 10th "which subjects do you enjoy" question.
 * Stream-aware: an MPC student only ever sees MPC subjects. When the student
 * hasn't decided a stream yet we fall back to the union of all subjects, each
 * tagged with its stream so the recommendation engine can still score it.
 */
export function getClass10InterestOptions(streamId) {
  const stream = after10.fields[streamId];
  if (stream) {
    return stream.interests.map((interest) => ({
      value: interest.id,
      label: interest.label,
      emoji: interest.emoji,
      stream: interest.stream,
    }));
  }
  const seen = new Set();
  const union = [];
  Object.values(after10.fields).forEach((field) => {
    field.interests.forEach((interest) => {
      if (!seen.has(interest.id)) {
        seen.add(interest.id);
        union.push({
          value: interest.id,
          label: interest.label,
          emoji: interest.emoji,
          stream: interest.stream,
        });
      }
    });
  });
  return union;
}

/** Options shown for the After 12th "which area interests you" question. */
export function getAfter12FieldOptions(streamId) {
  const stream = after12.fields[streamId];
  if (!stream) return [];
  return stream.interests.map((interest) => ({
    value: interest.id,
    label: interest.label,
    emoji: interest.emoji,
    recKey: interest.recKey,
  }));
}

/** Options shown for the Graduation "which field fits you" question. */
export function getGraduateFieldOptions(degreeId) {
  const profile = degreeProfiles[degreeId];
  if (!profile) return [];
  return (profile.interests || []).map((item) => ({
    value: item.value,
    label: item.label,
    emoji: item.emoji,
  }));
}

/** The engineering branch specialisations relevant to a chosen branch (Graduation). */
export function getGraduateSpecializations(branchId) {
  const engineering = graduation.categories.engineering;
  const branch = engineering?.branches?.find((b) => b.id === branchId);
  return branch?.specializations || [];
}

/**
 * Build a compact, human-readable picture of the student's context:
 * stage + stream/field + selected subjects/options, all with emojis.
 * Used by the recommendations page, the dashboard and the AI advisor.
 */
export function getStudentContext(userType, answers = {}) {
  // The assessment stores the normal Graduation journey as "graduation", while
  // the stage/persona engine below speaks "graduate". Normalize so a Graduation
  // student gets their own context and never leaks into parent content.
  if (userType === 'graduation') userType = 'graduate';
  const stage = getStage(userType);
  if (!stage) return null;

  const context = {
    userType,
    stageLabel: stage.label,
    stream: null,
    field: null,
    selections: [],
    specializations: [],
  };

  if (userType === 'class10') {
    const streamId = answers.stream?.[0];
    const stream = after10.fields[streamId];
    if (stream) {
      context.stream = { id: stream.id, label: stream.label, emoji: stream.emoji };
    }
    const all = getClass10InterestOptions('not_decided');
    (answers.interest || []).forEach((id) => {
      const option = all.find((o) => o.value === id);
      if (option) context.selections.push({ id: option.value, label: option.label, emoji: option.emoji });
    });
  } else if (userType === 'class12') {
    const streamId = Array.isArray(answers.stream) ? answers.stream?.[0] : answers.stream;
    if (streamId === 'not_sure') {
      context.stream = { id: 'not_sure', label: 'Exploring stream options', emoji: '🧭' };
    } else {
      const mappedId = streamId === 'mpc' ? 'science_pcm' : streamId === 'bipc' ? 'science_pcb' : streamId;
      const stream = after12.fields[mappedId];
      if (stream) {
        context.stream = { id: stream.id, label: stream.label, emoji: stream.emoji };
      }
    }
    const interestIds = Array.isArray(answers.interest)
      ? answers.interest
      : answers.interest
        ? [answers.interest]
        : answers.interest_area || [];
    const qData = class12StreamData[streamId];
    if (qData) {
      interestIds.forEach((id) => {
        const option = qData.interestOptions.find((o) => o.value === id);
        if (option) context.selections.push({ id: option.value, label: option.label, emoji: option.emoji });
      });
    } else {
      const all = getAfter12FieldOptions(streamId);
      interestIds.forEach((id) => {
        const option = all.find((o) => o.value === id);
        if (option) context.selections.push({ id: option.value, label: option.label, emoji: option.emoji });
      });
    }
  } else if (userType === 'graduate') {
    // The new AssessmentFlow stores the degree as `degree` (a label); the
    // legacy format used `currentDegree`. Support both so the AI/context engine
    // always has the student's real degree.
    const degreeLabel = answers.degree || answers.currentDegree || '';
    const specialization = answers.specialization || '';
    const pid = resolveProfileId(degreeLabel, specialization);
    const profile = pid ? degreeProfiles[pid] : null;
    if (profile) {
      context.field = { id: pid, label: `${degreeLabel}${specialization && specialization !== degreeLabel ? ' \u2014 ' + specialization : ''}`, emoji: '\u{1F393}' };
      context.family = profile.family;
    }
    const interestIds = answers.interests || [];
    if (interestIds.length > 0 && profile) {
      interestIds.forEach((id) => {
        const option = profile.interests.find((o) => o.value === id);
        if (option) context.selections.push({ id: option.value, label: option.label, emoji: option.emoji || '\u{1F4CC}' });
      });
    }
    const skillIds = answers.skills || [];
    if (skillIds.length > 0 && profile) {
      const allSkills = Object.values(profile.skills || {}).flat();
      skillIds.forEach((id) => {
        const option = allSkills.find((o) => o.value === id);
        if (option) context.selections.push({ id: option.value, label: option.label, emoji: '\u{1F6E0}\uFE0F' });
      });
    }
  }

  return context;
}