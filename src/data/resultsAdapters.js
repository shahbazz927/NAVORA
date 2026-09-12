import { scoreParentClass12, fitLevel, whyMatches, tradeOffs, examsForCareer, degreeOf } from './parentClass12Scoring.js';
import { buildStudentProfile, scoreCareers, diversify, getPrimaryDirection } from './careerEngine.js';

const pretty = (s)=> String(s||'').replace(/_/g,' ').trim().replace(/\b\w/g,c=>c.toUpperCase());

export function contextFor(flowKey, answers){
  const out=[];
  const sid = String(answers.stream||'').toUpperCase();
  const subjects = Array.isArray(answers.subjects) ? answers.subjects.join(' · ') : Array.isArray(answers.subjectInterests) ? answers.subjectInterests.join(' · ') : '';
  if(flowKey?.includes('class12')){
    if(sid) out.push(`Stream: ${pretty(answers.stream)}`);
    if(answers.interest) out.push(`Interest: ${pretty(answers.interest)}`);
    if(subjects) out.push(`Subjects: ${subjects}`);
    if(answers.priority) out.push(`Priority: ${pretty(answers.priority)}`);
  } else if(flowKey?.includes('graduation')){
    if(answers.family) out.push(`Field: ${answers.family}`);
    if(answers.degree) out.push(`Degree: ${answers.degree}`);
    if(answers.specialization && answers.specialization!==answers.degree) out.push(`Specialization: ${answers.specialization}`);
    if(Array.isArray(answers.interests) && answers.interests.length) out.push(`Interests: ${answers.interests.slice(0,2).map(pretty).join(' · ')}`);
    if(answers.direction) out.push(`Goal: ${pretty(answers.direction)}`);
  } else if(flowKey==='parent_class10'){
    const enjoy = Array.isArray(answers.enjoy) ? answers.enjoy.slice(0,2).join(' · ') : '';
    if(enjoy) out.push(`Enjoys: ${enjoy}`);
    const strongest = Array.isArray(answers.strongest) ? answers.strongest.slice(0,2).join(' · ') : '';
    if(strongest) out.push(`Strong in: ${strongest}`);
    if(answers.future) out.push(`Future: ${answers.future}`);
    if(answers.priority) out.push(`Priority: ${pretty(answers.priority)}`);
  }
  // student/parent prefix
  const stage = flowKey?.startsWith('parent_') ? 'Stage: Parent · ' : 'Stage: Student · ';
  const label = flowKey?.replace('student_','').replace('parent_','').replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase());
  if(label) out.unshift(`${stage}${label}`);
  return out.filter(Boolean);
}

export function headerFor(flowKey){
  if(flowKey==='student_class12') return { eyebrow:'Your career direction match', title:'Your Career Direction', subtitle:'Based on your stream, interests, strengths and priorities, here are the paths worth considering.' };
  if(flowKey==='parent_class12') return { eyebrow:'Your career direction match', title:"Your Child's Degree & Career Direction", subtitle:"Based on what you shared about your child's background, interests and priorities, here are the paths worth considering." };
  if(flowKey==='student_graduation') return { eyebrow:'Your career direction match', title:'Your Career Direction', subtitle:'Based on your degree, skills, interests and goals, here are the career directions worth exploring.' };
  if(flowKey==='parent_graduation') return { eyebrow:'Your career direction match', title:"Your Child's Career Direction", subtitle:"Based on your child's degree and aspirations, here are the directions worth exploring." };
  if(flowKey==='parent_class10') return { eyebrow:'Your academic direction match', title:"Your Child's Stream Direction", subtitle:"Based on what you shared about your child's interests and strengths, here's the stream direction that fits best — with alternatives." };
  return { eyebrow:'Your results', title:'Your Direction', subtitle:'Based on your answers, here are the paths worth considering.' };
}

export function nextStepsForResult(flowKey, primaryCareer, gradProfile){
  // Contextual next steps — not generic
  if(flowKey==='parent_class10'){
    return { month: ['Explore the recommended stream subjects together','Try a small project in that stream','Talk to a Class 11–12 student in that stream'], quarter:['Compare MPC / BiPC / Commerce / Arts subjects','Research future career areas for that stream','Visit an open day or lab / studio'], later:['Shortlist target subjects for Classes 11–12','Check entrance paths after Class 12','Revisit after a term of exploration'] };
  }
  if(flowKey?.endsWith('graduation')){
    const role = primaryCareer?.title || 'your top direction';
    return { month:[`Research entry-level requirements for ${role}`, `Strengthen one missing skill for ${role}`, `Talk to one person working as ${role}`], quarter:['Build a small, relevant project','Apply to 3–5 internships or trainee roles','Get feedback on your CV from a mentor'], later:['Compare specialization vs higher-study routes','Plan a 6-month skill + experience roadmap','Revisit this guidance after real exposure'] };
  }
  // class12 default — adapt to stream/interest
  const top = primaryCareer?.title || 'your top career';
  return { month:[`Try: ${(primaryCareer?.experienceIdeas||['Talk to someone doing this work'])[0]}`, `Research ${top} entry routes for one hour`, `Check the entrance exams in the sidebar`], quarter:[`Start building ${(primaryCareer?.skillsToDevelop||['foundations'])[0]}`, 'Complete one small field-related project','Compare 2–3 colleges offering the recommended degree'], later:['Compare final degree options on fees & outcomes','Check eligibility & timelines','Revisit after trying one recommendation'] };
}

export function unifiedFromCareerEngine(flowKey, answers){
  const profile = buildStudentProfile(answers, flowKey);
  const scored = scoreCareers(profile);
  const ranked = diversify(scored, 4);
  // enrich with why/considerations deterministic
  return ranked.map(s=>{
    const c=s.career;
    const why = [];
    if(s.breakdown.interestMatch>=0.5) why.push(`Interest connects to ${c.category.toLowerCase()} work.`);
    if(s.breakdown.strengthMatch>=0.3) why.push(`Your strengths overlap with ${c.strengthsAligned.slice(0,2).join(', ')}.`);
    if(s.breakdown.eduCompat>=1) why.push('Direct education route from your current background.');
    if(!why.length) why.push('Balanced option for your overall pattern — worth a closer look.');
    const cons=[];
    if(s.breakdown.eduCompat<1) cons.push('Reachable via an extra step — check the education route below.');
    if(s.breakdown.strengthMatch<0.3) cons.push(`Key skills to build: ${(c.skillsToDevelop||[]).slice(0,2).join(', ')}.`);
    if(!cons.length) cons.push('Needs real-world exposure before committing — try the activity below.');
    return {
      career: c,
      title: c.title, category: c.category, score: s.score, level: s.band, band: s.band,
      degree: { short: (c.educationRoutes?.[0]||'').split(/[\(→+]/)[0].trim()||'See route', full: c.educationRoutes?.[0]||'' },
      exams: (()=>{ const blob=(c.educationRoutes||[]).join(' ').toLowerCase(); const list=[]; if(blob.includes('jee')) list.push({name:'JEE Main', period:'Jan / Apr · Typical'}); if(blob.includes('neet')) list.push({name:'NEET-UG', period:'May · Typical'}); if(blob.includes('clat')) list.push({name:'CLAT', period:'Dec · Typical'}); if(blob.includes('cuet')) list.push({name:'CUET-UG', period:'May · Typical'}); if(blob.includes('nata')) list.push({name:'NATA / JEE Paper 2', period:'Apr onwards · Typical'}); if(!list.length) list.push({name:'Merit / university admission', period:'Varies by college'}); return list.slice(0,2); })(),
      foundations: (c.skillsToDevelop||[]).slice(0,2),
      whyMatches: why.slice(0,3), considerations: cons.slice(0,3),
      factors: [
        { key:'Interest alignment', weight:30, value: Math.round(s.breakdown.interestMatch*100), why: s.breakdown.interestMatch>=0.5?'Matched to your interests':'Limited signal from interests' },
        { key:'Strength alignment', weight:20, value: Math.round(s.breakdown.strengthMatch*100), why: s.breakdown.strengthMatch>=0.3?'Overlaps with your strengths':'Some skills need building' },
        { key:'Stream / degree compatibility', weight:20, value: Math.round(s.breakdown.eduCompat*100), why: s.breakdown.eduCompat>=1?'Direct route':'Requires an extra step' },
        { key:'Priority & direction', weight:15, value: Math.round(s.breakdown.priorityBoost*100), why:'Weighed against your stated priority' },
        { key:'Preparation accessibility', weight:15, value: Math.round((s.breakdown.eduCompat>=1?90:55)), why: s.breakdown.eduCompat>=1?'Accessible with preparation':'Needs planning' },
      ],
      activity: c.experienceIdeas?.[0] || 'Talk to someone doing this work.',
      raw: s.raw,
    };
  });
}

export function unifiedFromParentClass12(answers, result){
  // result from buildClass12Result already has degrees; but for premium cards we use scoring
  // Use scoreParentClass12 for deterministic scoring
  const careers = result?.careers || [];
  // If parent_class12, prefer scoring all careers via careerEngine would be wrong — use assessmentConfig's built result + supplement with scoring for display
  // Instead map careers from assessmentConfig to unified shape, synthesizing scores deterministically via simple hash of answers
  // Actually parent_class12 in AssessmentFlow used separate engine: we will use careerEngine unified for consistency
  return unifiedFromCareerEngine('parent_class12', answers);
}

export function sidebarExamsFrom(items){
  const seen=new Map();
  items.slice(0,3).forEach(it=> (it.exams||[]).forEach(e=> { if(!seen.has(e.name)) seen.set(e.name,e); }));
  return [...seen.values()].slice(0,4);
}
