import { getAfter12FieldOptions, getClass10InterestOptions, getStudentContext } from './streamConfig';
import { streamData as class12StreamData } from './careerQuestionnaire';
import { questions } from './questions';
import { getDegreeProfile } from './graduationDegreeConfig';

export const recommendations = {
  class10: {
    mpc: {
      title: 'MPC — Maths, Physics, Chemistry',
      description: 'The engineering and technology track — maths and physics lead to some of the most competitive and fastest-growing careers.',
      fitSummary: 'You picked the MPC track — we\u2019ve built the pathway around engineering, tech, and quantitative careers.',
      whyFits: [
        { label: 'The MPC track', copy: 'Maths, physics, and chemistry are the exact foundation for engineering, computing, and data careers.' },
        { label: 'Your strengths', copy: 'Analytical and problem-solving strengths map directly onto this track.' },
        { label: 'What it unlocks', copy: 'JEE, NDA, and BITSAT routes — with lateral options into science and research.' },
      ],
      alternatives: [
        { title: 'BiPC', betterFor: 'If biology excites you as much as maths, medicine and life sciences may fit better.', tradeoff: 'You\u2019d trade maths-heavy engineering doors for the medical and life-science track.' },
        { title: 'Commerce', betterFor: 'If how money, markets, and businesses work pulls you harder than equations.', tradeoff: 'You\u2019d swap advanced maths for economics, accounts, and business maths.' },
      ],
      topCourses: [
        { name: 'B.Tech (Engineering)', duration: '4 years', fit: 92, growth: '22%', salary: '\u20b96-15 LPA', note: 'Strong fit if maths is your strength.' },
        { name: 'B.Sc (Computer Science)', duration: '3 years', fit: 88, growth: '25%', salary: '\u20b96-15 LPA', note: 'The fastest-growing lane in tech today.' },
        { name: 'NDA (Technical Entry)', duration: '3 years + training', fit: 84, growth: 'Service-linked', salary: '\u20b956K+ / month', note: 'A disciplined, respected route for PCM students.' },
      ],
      topColleges: ['IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad'],
      entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'NDA'],
      tips: [
        'Build strong fundamentals in maths and physics — they compound across every branch.',
        'Start JEE or NDA prep with consistency over intensity; daily practice beats cramming.',
        'Try science fairs and olympiads to test if you love the subject or just tolerate it.',
        'Start light coding early — it\u2019s valuable across every tech career.',
      ],
    },
    bipc: {
      title: 'BiPC — Biology, Physics, Chemistry',
      description: 'The medicine and life-sciences track — biology pairs with chemistry and physics for healthcare, research, and allied science careers.',
      fitSummary: 'You picked the BiPC track — we\u2019ve built the pathway around medicine, health sciences, and research.',
      whyFits: [
        { label: 'The BiPC track', copy: 'Biology, chemistry, and physics are the exact foundation for medicine and the health sciences.' },
        { label: 'Your strengths', copy: 'A scientific, detail-oriented way of working maps straight onto clinical and lab careers.' },
        { label: 'What it unlocks', copy: 'NEET, AIIMS, and allied-health routes — with strong research alternatives.' },
      ],
      alternatives: [
        { title: 'MPC', betterFor: 'If maths and technology excite you more than biology, engineering may be the better fit.', tradeoff: 'You\u2019d trade medical doors for the maths-heavy engineering track.' },
        { title: 'Biotechnology / Life Sciences', betterFor: 'If research and lab work excite you more than the clinic.', tradeoff: 'A different rhythm and career curve than clinical medicine.' },
      ],
      topCourses: [
        { name: 'MBBS (Medicine)', duration: '5.5 years', fit: 91, growth: '14%', salary: '\u20b910-25 LPA', note: 'The flagship clinical route.' },
        { name: 'BDS (Dentistry)', duration: '5 years', fit: 86, growth: '12%', salary: '\u20b95-12 LPA', note: 'A respected clinical path with flexibility.' },
        { name: 'B.Sc (Biotechnology)', duration: '3 years', fit: 84, growth: '18%', salary: '\u20b93-8 LPA', note: 'A research-forward alternative to clinical medicine.' },
      ],
      topColleges: ['AIIMS Delhi', 'JIPMER', 'CMC Vellore', 'MAMC', 'KGMU'],
      entranceExams: ['NEET UG', 'AIIMS', 'JIPMER'],
      tips: [
        'Give physics and chemistry equal weight to biology — most students over-index on biology.',
        'Mock tests and previous-year papers are the real teacher for NEET.',
        'Keep allied health sciences as a genuine plan B; they\u2019re not a downgrade.',
        'Start light coding early — it\u2019s increasingly valuable in research and healthcare data.',
      ],
    },
    science: {
      title: 'Science',
      description: 'Physics, chemistry, maths and biology — a stream built around how things work, with the widest range of career doors.',
      fitSummary: 'Your answers point toward curiosity, analysis, and a hands-on way of learning.',
      whyFits: [
        { label: 'Subjects you enjoy', copy: 'You picked physics, maths, or biology as subjects you genuinely like — science is where those come alive.' },
        { label: 'How you learn', copy: 'Experiments, problem-solving, and figuring things out from first principles match the science classroom.' },
        { label: 'Your ambitions', copy: 'Careers in technology, medicine, and research are direct extensions of this stream.' },
      ],
      alternatives: [
        { title: 'Commerce', betterFor: 'If you\u2019re equally drawn to how money, markets, and businesses work.', tradeoff: 'You\u2019d trade deep science for economics, accounts, and business maths.' },
        { title: 'Arts / Humanities', betterFor: 'If people, ideas, history, and expression pull you just as hard as equations.', tradeoff: 'You\u2019d keep maths light and gain a lot of reading, writing, and critical thinking.' },
      ],
      topCourses: [
        { name: 'B.Tech (Engineering)', duration: '4 years', fit: 92, growth: '22%', salary: '\u20b96-15 LPA', note: 'Strong fit if maths is your strength.' },
        { name: 'MBBS (Medicine)', duration: '5.5 years', fit: 88, growth: '14%', salary: '\u20b910-25 LPA', note: 'Best if biology is where you shine.' },
        { name: 'B.Sc (Pure Sciences)', duration: '3 years', fit: 85, growth: '18%', salary: '\u20b93-8 LPA', note: 'Keep research doors open; many add a masters.' },
      ],
      topCareers: ['Software Engineer', 'Doctor', 'Data Scientist', 'Research Scientist', 'AI Engineer'],
      skills: ['Analytical thinking', 'Problem solving', 'Scientific temper', 'Data analysis'],
      tips: [
        'Build strong fundamentals in physics, chemistry, and maths \u2014 they compound.',
        'Try science fairs and olympiads to test if you love it or just tolerate it.',
        'JEE, NEET, or KVPY are the common gates; know which fits your goal before you train.',
        'Start light coding early \u2014 it\u2019s valuable across every science career.',
      ],
    },
    commerce: {
      title: 'Commerce',
      description: 'Business, economics, accounting and finance — a stream for how the world of money and markets works.',
      fitSummary: 'Your answers point toward practicality, numbers, and a clear-eyed view of how things are run.',
      whyFits: [
        { label: 'Subjects you enjoy', copy: 'Economics and accountancy stood out for you — commerce is their natural home.' },
        { label: 'How you learn', copy: 'You gravitate toward structured, real-world, applied learning rather than abstract theory.' },
        { label: 'Your ambitions', copy: 'Business, finance, and building things fit directly onto this stream.' },
      ],
      alternatives: [
        { title: 'Science', betterFor: 'If you\u2019re pulled by how things work and the widest career spread, including tech.', tradeoff: 'You\u2019d trade accounting and economics for heavy physics, chemistry, and maths.' },
        { title: 'Arts / Humanities', betterFor: 'If writing, people, and ideas interest you as much as numbers.', tradeoff: 'You\u2019d lose the business-focused subjects but gain more freedom in essays and analysis.' },
      ],
      topCourses: [
        { name: 'B.Com (Honours)', duration: '3 years', fit: 90, growth: '16%', salary: '\u20b93-8 LPA', note: 'The versatile all-rounder of commerce.' },
        { name: 'BBA (Business Administration)', duration: '3 years', fit: 88, growth: '20%', salary: '\u20b94-10 LPA', note: 'Good if you see yourself managing teams early.' },
        { name: 'CA (Chartered Accountancy)', duration: '4-5 years', fit: 85, growth: '15%', salary: '\u20b97-20 LPA', note: 'Demanding but respected; discipline required.' },
      ],
      topCareers: ['Chartered Accountant', 'Financial Analyst', 'Business Consultant', 'Marketing Manager', 'Investment Banker'],
      skills: ['Numerical ability', 'Business acumen', 'Communication', 'Analytical skills'],
      tips: [
        'Get strong in accounting and economics fundamentals \u2014 everything builds on them.',
        'Professional certifications (CA, CS, CFA) are worth researching early; they change your trajectory.',
        'Digital marketing and analytics skills are a huge edge over your peers.',
        'Try business competitions and internships; theory alone won\u2019t teach you business.',
      ],
    },
    arts: {
      title: 'Arts & Humanities',
      description: 'Literature, history, psychology, law and design — a stream for understanding people and ideas.',
      fitSummary: 'Your answers point toward empathy, expression, and thinking deeply about the human world.',
      whyFits: [
        { label: 'Subjects you enjoy', copy: 'English and history drew you — arts is where ideas and people take centre stage.' },
        { label: 'How you learn', copy: 'Creative projects, writing, and discussion energise you more than rote formulas.' },
        { label: 'Your ambitions', copy: 'Careers in media, law, design, and psychology are direct extensions of this stream.' },
      ],
      alternatives: [
        { title: 'Science', betterFor: 'If you\u2019re equally curious about how the physical world works.', tradeoff: 'You\u2019d trade writing and reading for lab work and mathematics.' },
        { title: 'Commerce', betterFor: 'If you\u2019re drawn to how money and markets shape the world you write about.', tradeoff: 'You\u2019d keep more options in business while keeping the humanities light.' },
      ],
      topCourses: [
        { name: 'BA (Liberal Arts)', duration: '3 years', fit: 88, growth: '18%', salary: '\u20b93-8 LPA', note: 'Broad foundation; pair it with skills to specialise.' },
        { name: 'BJMC (Journalism)', duration: '3 years', fit: 85, growth: '20%', salary: '\u20b93-10 LPA', note: 'For storytelling and media careers.' },
        { name: 'Law (Integrated BA LLB)', duration: '5 years', fit: 82, growth: '14%', salary: '\u20b95-15 LPA', note: 'A rigorous, respected, high-reward path.' },
      ],
      topCareers: ['Content Strategist', 'Psychologist', 'Lawyer', 'UI/UX Designer', 'Journalist'],
      skills: ['Communication', 'Critical thinking', 'Creativity', 'Empathy'],
      tips: [
        'Build a portfolio of your work early \u2014 it matters more than marks in creative fields.',
        'Writing and communication skills transfer to every career you could choose.',
        'Internships in media, NGOs, or legal firms will teach you what the classroom can\u2019t.',
        'Learn digital tools for design and content; they make your work visible.',
      ],
    },
    diploma: {
      title: 'Diploma / Polytechnic',
      description: 'A hands-on technical route into engineering and industry \u2014 shorter, practical, and with a lateral-entry door into a degree later.',
      fitSummary: 'You chose the Diploma / Polytechnic track \u2014 we\u2019ve built the pathway around practical technical skills and early employability.',
      whyFits: [
        { label: 'The diploma track', copy: 'Polytechnic diplomas (mechanical, civil, electrical, computer) get you into industry-ready technical roles sooner.' },
        { label: 'How you learn', copy: 'A hands-on, applied way of learning is exactly what polytechnic education rewards.' },
        { label: 'What it unlocks', copy: 'Direct employment after 3 years, plus lateral entry into B.Tech for students who want the degree later.' },
      ],
      alternatives: [
        { title: 'MPC', betterFor: 'If you want the full degree route and a broader academic base.', tradeoff: 'Longer path with heavier theory; the diploma is the faster, applied alternative.' },
        { title: 'ITI / Vocational', betterFor: 'If you want the fastest entry into a specific trade with the least theory.', tradeoff: 'Narrower scope than a diploma; less upward academic mobility.' },
      ],
      topCourses: [
        { name: 'Diploma (Mechanical)', duration: '3 years', fit: 90, growth: '16%', salary: '\u20b92.5-6 LPA', note: 'Strong demand across manufacturing and industry.' },
        { name: 'Diploma (Civil)', duration: '3 years', fit: 88, growth: '15%', salary: '\u20b92.5-6 LPA', note: 'Infrastructure and construction are always hiring.' },
        { name: 'Diploma (Computer Science)', duration: '3 years', fit: 86, growth: '20%', salary: '\u20b93-8 LPA', note: 'Pairs hands-on skill with the fastest-growing sector.' },
      ],
      topColleges: ['Government Polytechnic (state-wise)', 'Regional polytechnics', 'Private engineering institutes'],
      entranceExams: ['State polytechnic entrance exams', 'Lateral entry to B.Tech (after diploma)'],
      tips: [
        'A diploma is not a dead end \u2014 lateral entry into B.Tech keeps the degree door open.',
        'Pick a branch tied to a real industry cluster; placements follow the sector.',
        'Treat workshop and lab work as your portfolio \u2014 it\u2019s what employers actually check.',
      ],
    },
    iti: {
      title: 'ITI / Vocational',
      description: 'Practical trade skills with the fastest route into employment \u2014 electricians, welders, fitters, and modern trades in real demand.',
      fitSummary: 'You chose the ITI / Vocational track \u2014 we\u2019ve built the pathway around skills, apprenticeship, and getting to work sooner.',
      whyFits: [
        { label: 'The vocational track', copy: 'ITI trades (electrician, fitter, welder, computer operator) turn practical skill into employability fast.' },
        { label: 'How you learn', copy: 'Trade-based, hands-on learning matches how you described yourself working.' },
        { label: 'What it unlocks', copy: 'Early income, apprenticeship routes, and a strong base if you later specialise further.' },
      ],
      alternatives: [
        { title: 'Diploma / Polytechnic', betterFor: 'If you want broader technical training with more academic room to grow.', tradeoff: 'Longer than an ITI trade; more theory, but wider options.' },
        { title: 'Commerce', betterFor: 'If business, finance, and entrepreneurship interest you more than trade skills.', tradeoff: 'You\u2019d trade immediate practical skills for a longer academic runway.' },
      ],
      topCourses: [
        { name: 'Electrician', duration: '1-2 years', fit: 90, growth: '14%', salary: '\u20b92-5 LPA', note: 'Consistent demand across every region.' },
        { name: 'Fitter / Turner', duration: '1-2 years', fit: 88, growth: '14%', salary: '\u20b92-5 LPA', note: 'Core manufacturing trades with steady work.' },
        { name: 'Computer Operator / Programming', duration: '1 year', fit: 86, growth: '18%', salary: '\u20b92.5-6 LPA', note: 'A low-theory on-ramp into office and IT-adjacent roles.' },
      ],
      topColleges: ['Government ITIs', 'State vocational training institutes', 'Industrial Training Centres'],
      entranceExams: ['State ITI admission (merit-based)'],
      tips: [
        'ITI is a fast, honest on-ramp \u2014 combine the trade with an apprenticeship for real experience.',
        'Specialising in a high-demand trade beats a generic one every time.',
        'Digital skills on top of a trade (readings, invoicing, CAD) widen your options.',
      ],
    },
  },
  class12: {
    science_pcm: {
      title: 'Engineering & Technology',
      description: 'With PCM, the engineering and technology doors are wide open \u2014 from core branches to AI and data.',
      fitSummary: 'Your maths and physics background gives you access to the most competitive and fastest-growing tech careers.',
      whyFits: [
        { label: 'Your stream', copy: 'PCM is the direct feeder for engineering and computer science degrees.' },
        { label: 'Your priorities', copy: 'You weigh growth and salary seriously \u2014 tech delivers on both right now.' },
        { label: 'Your interests', copy: 'Technology and innovation were high on your list.' },
      ],
      alternatives: [
        { title: 'Pure Sciences (B.Sc)', betterFor: 'If research and academia interest you more than industry.', tradeoff: 'Lower starting pay, but unmatched depth and the option to specialise later.' },
        { title: 'Integrated/Entrepreneurial paths', betterFor: 'If you want to build your own thing rather than join one.', tradeoff: 'More risk, but a steeper learning curve in business on top of tech.' },
      ],
      interests: {
        engineering: {
          title: 'Engineering & Technology',
          description: 'Core engineering branches \u2014 mechanical, civil, electrical, and beyond \u2014 built on your PCM foundation.',
          fitSummary: 'Your PCM background is the exact feeder for core engineering degrees.',
          whyFits: [
            { label: 'Your stream', copy: 'PCM maps directly onto core engineering \u2014 the most established high-salary path.' },
            { label: 'Your interest', copy: 'You chose Engineering & Technology, so we\u2019ve ranked the core branches that fit it.' },
            { label: 'Your priorities', copy: 'Growth and stability both point the same way here.' },
          ],
          topCourses: [
            { name: 'B.Tech (Mechanical)', duration: '4 years', fit: 93, growth: '18%', salary: '\u20b96-14 LPA', note: 'Widest branch; strong in manufacturing and core sectors.' },
            { name: 'B.Tech (Electrical)', duration: '4 years', fit: 91, growth: '20%', salary: '\u20b96-15 LPA', note: 'Power, electronics, and automation crossover roles.' },
            { name: 'B.Tech (Civil)', duration: '4 years', fit: 88, growth: '15%', salary: '\u20b95-12 LPA', note: 'Infrastructure and construction careers.' },
          ],
          topColleges: ['IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'NIT Trichy'],
          entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'],
          tips: [
            'Pick a branch by interest, not just rank \u2014 mechanical and electrical have strong long-term curves.',
            'Core branches reward domain skills; pair yours with coding or data to stay ahead.',
            'Internships in core sectors during the summer matter more than extra theory.',
          ],
        },
        computer_science: {
          title: 'Computer Science & IT',
          description: 'Software, AI, data, and cybersecurity \u2014 the fastest-growing lane for a PCM student.',
          fitSummary: 'Your maths strength is exactly what CS degrees reward most.',
          whyFits: [
            { label: 'Your stream', copy: 'PCM + strong maths is the classic CS feeder combination.' },
            { label: 'Your interest', copy: 'You chose Computer Science & IT, the highest-growth tech direction today.' },
            { label: 'Your priorities', copy: 'Salary and growth are front and centre \u2014 CS delivers on both.' },
          ],
          topCourses: [
            { name: 'B.Tech (Computer Science)', duration: '4 years', fit: 96, growth: '25%', salary: '\u20b98-20 LPA', note: 'The safest high-growth bet in tech today.' },
            { name: 'B.Tech (IT)', duration: '4 years', fit: 92, growth: '22%', salary: '\u20b97-18 LPA', note: 'Slightly more applied; great placement record.' },
            { name: 'B.Sc (Data Science)', duration: '3 years', fit: 90, growth: '36%', salary: '\u20b96-15 LPA', note: 'Specialist path; strong with a masters.' },
          ],
          topColleges: ['IIT Delhi', 'IIT Bombay', 'IIIT Hyderabad', 'NIT Trichy'],
          entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'],
          tips: [
            'Start coding now \u2014 DSA practice is the single biggest lever for CS placements.',
            'Build small projects; they matter in interviews more than ranks eventually.',
            'Keep an eye on AI, data, and cybersecurity \u2014 the field is shifting fast.',
          ],
        },
        mathematics: {
          title: 'Mathematics & Statistics',
          description: 'Pure and applied maths \u2014 feeding data science, finance, and quantitative research.',
          fitSummary: 'Your PCM background and maths strength align with the most quantitative careers.',
          whyFits: [
            { label: 'Your stream', copy: 'PCM is the natural home for deep mathematics and statistics.' },
            { label: 'Your interest', copy: 'You chose Mathematics & Statistics \u2014 we\u2019ve matched it to quant-heavy careers.' },
            { label: 'Your priorities', copy: 'This path rewards problem-solving skill over rote memory.' },
          ],
          topCourses: [
            { name: 'B.Sc (Mathematics)', duration: '3 years', fit: 94, growth: '18%', salary: '\u20b94-10 LPA', note: 'Foundation for actuarial, finance, and data roles.' },
            { name: 'B.Stat (Statistics)', duration: '3 years', fit: 93, growth: '20%', salary: '\u20b96-15 LPA', note: 'Elite ISI programme; exceptional data careers.' },
            { name: 'Integrated M.Sc (Maths)', duration: '5 years', fit: 90, growth: '22%', salary: '\u20b95-14 LPA', note: 'Deep research path into academia or quant.' },
          ],
          topColleges: ['ISI Kolkata', 'CMI Chennai', 'IIT Bombay', 'St. Stephen\u2019s'],
          entranceExams: ['ISI Admission', 'CMI Entrance', 'JEE Main', 'NEST'],
          tips: [
            'Actuarial, data science, and quantitative finance all reward strong maths.',
            'Olympiads and competitions sharpen the exact skills this path rewards.',
            'Pair maths with coding \u2014 the combination is rare and valuable.',
          ],
        },
        architecture: {
          title: 'Architecture & Planning',
          description: 'Designing spaces \u2014 from buildings to cities \u2014 where maths meets creativity.',
          fitSummary: 'PCM plus an eye for design is exactly what architecture schools look for.',
          whyFits: [
            { label: 'Your stream', copy: 'PCM is a required entry for most architecture programmes.' },
            { label: 'Your interest', copy: 'You chose Architecture & Planning \u2014 a rare mix of science and creativity.' },
            { label: 'Your priorities', copy: 'This path rewards portfolio and visual thinking as much as grades.' },
          ],
          topCourses: [
            { name: 'B.Arch', duration: '5 years', fit: 92, growth: '15%', salary: '\u20b94-12 LPA', note: 'The flagship architecture degree.' },
            { name: 'B.Planning', duration: '4 years', fit: 88, growth: '16%', salary: '\u20b94-10 LPA', note: 'Urban planning and policy careers.' },
            { name: 'B.Des (Interior/Product)', duration: '4 years', fit: 86, growth: '18%', salary: '\u20b94-12 LPA', note: 'Design-focused alternative with a market.' },
          ],
          topColleges: ['IIT Roorkee', 'SPA Delhi', 'CEPT Ahmedabad', 'NIT Trichy'],
          entranceExams: ['NATA', 'JEE Main (Paper 2)', 'CEPT Aptitude', 'UCEED'],
          tips: [
            'Build a portfolio early \u2014 it decides admissions more than marks.',
            'Drawing, model-making, and software (AutoCAD, Revit) are core skills.',
            'Visit real sites and document them; observation is the architect\u2019s raw material.',
          ],
        },
        physical_sciences: {
          title: 'Physical Sciences & Research',
          description: 'Physics and chemistry in depth \u2014 for research, academia, and R&D careers.',
          fitSummary: 'PCM is the natural route into serious physics and chemistry.',
          whyFits: [
            { label: 'Your stream', copy: 'PCM is the direct path into physical sciences research.' },
            { label: 'Your interest', copy: 'You chose Physical Sciences & Research \u2014 we\u2019ve matched it to research-led paths.' },
            { label: 'Your priorities', copy: 'This is a patience-heavy path; the payoff is depth and intellectual freedom.' },
          ],
          topCourses: [
            { name: 'Integrated M.Sc (Physics)', duration: '5 years', fit: 93, growth: '18%', salary: '\u20b95-14 LPA', note: 'Fast track into research and academia.' },
            { name: 'B.Sc (Chemistry)', duration: '3 years', fit: 91, growth: '16%', salary: '\u20b93-8 LPA', note: 'Foundation for pharma, materials, and R&D.' },
            { name: 'BS-MS (Research)', duration: '5 years', fit: 90, growth: '20%', salary: '\u20b95-15 LPA', note: 'IISER-style programme built for research.' },
          ],
          topColleges: ['IISc Bangalore', 'IISER Pune', 'IIT Bombay', 'NISER'],
          entranceExams: ['NEST', 'IISER Aptitude', 'JEE Advanced', 'KVPY'],
          tips: [
            'Research institutes value aptitude and curiosity more than rote marks.',
            'Pursue olympiads and research internships to build a serious profile.',
            'Keep programming skills \u2014 computational science is a huge edge.',
          ],
        },
        defence: {
          title: 'Defence & Technical Services',
          description: 'NDA, technical entries, and armed forces careers \u2014 discipline plus technical skill.',
          fitSummary: 'PCM is exactly the background the technical wings of the forces need.',
          whyFits: [
            { label: 'Your stream', copy: 'PCM is the feeder for technical entries into the armed forces.' },
            { label: 'Your interest', copy: 'You chose Defence & Technical Services \u2014 a path few consider and fewer pursue well.' },
            { label: 'Your priorities', copy: 'Stability, respect, and national service all define this route.' },
          ],
          topCourses: [
            { name: 'NDA (Army/Navy/Air Force)', duration: '3 years + training', fit: 94, growth: 'Service-linked', salary: '\u20b956K+ / month (starting)', note: 'The classic officer entry; PCM helps a lot.' },
            { name: 'TES (Technical Entry)', duration: '5 years', fit: 92, growth: 'Service-linked', salary: '\u20b960K+ / month', note: 'Direct technical entry after Class 12 for PCM students.' },
            { name: 'B.Tech + Defence (MNS/Technical)', duration: '4-5 years', fit: 88, growth: 'Service-linked', salary: '\u20b950K+ / month', note: 'Commissioned officer routes for engineering graduates.' },
          ],
          topColleges: ['NDA Khadakwasla', 'IMA Dehradun', 'AFA Hyderabad', 'INA Ezhimala'],
          entranceExams: ['NDA Exam', 'AFCAT', 'TES Entry', 'CDS (later)'],
          tips: [
            'Physical fitness and SSB interview preparation are as important as academics.',
            'PCM clears the technical entry bar \u2014 keep maths strong.',
            'Start early; defence entry timelines and medical standards need planning.',
          ],
        },
      },
      topCourses: [
        { name: 'B.Tech (Computer Science)', duration: '4 years', fit: 95, growth: '25%', salary: '\u20b98-20 LPA', note: 'The safest high-growth bet in tech today.' },
        { name: 'B.Tech (Electronics)', duration: '4 years', fit: 90, growth: '20%', salary: '\u20b96-15 LPA', note: 'Great for hardware-software crossover roles.' },
        { name: 'B.Sc (Data Science)', duration: '3 years', fit: 88, growth: '36%', salary: '\u20b96-15 LPA', note: 'Specialist path; strong with a masters.' },
      ],
      topColleges: ['IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad'],
      entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'],
      tips: [
        'Start JEE prep with consistency over intensity; daily practice beats cramming.',
        'Work on problem-solving speed \u2014 accuracy follows routine.',
        'Build small projects; they matter in interviews more than ranks eventually.',
        'Keep an eye on AI, data, and cybersecurity \u2014 the field is shifting fast.',
      ],
    },
    science_pcb: {
      title: 'Medical & Healthcare',
      description: 'With PCB, medicine and healthcare are your core path \u2014 from MBBS to allied sciences.',
      fitSummary: 'Your biology-centric stream lines up directly with careers that combine science with caring.',
      whyFits: [
        { label: 'Your stream', copy: 'PCB is built for medicine, dentistry, and the allied health sciences.' },
        { label: 'Your interests', copy: 'Healthcare and service scored highly in your answers.' },
        { label: 'Your priorities', copy: 'Stability and making an impact are both served by clinical careers.' },
      ],
      alternatives: [
        { title: 'Biotechnology / Life Sciences', betterFor: 'If research and lab work excite you more than the clinic.', tradeoff: 'Different rhythm and career curve than clinical medicine.' },
        { title: 'Allied health (Nursing, Physio, Pharmacy)', betterFor: 'If you want to be in healthcare sooner with less exam pressure.', tradeoff: 'Lower earnings ceiling than MBBS, but faster entry.' },
      ],
      interests: {
        medicine: {
          title: 'Medicine & Healthcare',
          description: 'MBBS and the clinical route \u2014 the most established, respected career in the health sciences.',
          fitSummary: 'Your PCB background is the direct entry into clinical medicine.',
          whyFits: [
            { label: 'Your stream', copy: 'PCB is the exact feeder for MBBS and clinical medicine.' },
            { label: 'Your interest', copy: 'You chose Medicine & Healthcare \u2014 the flagship clinical path.' },
            { label: 'Your priorities', copy: 'Stability, respect, and impact are all at the core of medicine.' },
          ],
          topCourses: [
            { name: 'MBBS', duration: '5.5 years', fit: 96, growth: '14%', salary: '\u20b910-25 LPA', note: 'The flagship clinical route.' },
            { name: 'BDS (Dentistry)', duration: '5 years', fit: 90, growth: '12%', salary: '\u20b95-12 LPA', note: 'Respected clinical path with flexibility.' },
            { name: 'BAMS / BHMS', duration: '5.5 years', fit: 84, growth: '10%', salary: '\u20b94-10 LPA', note: 'Traditional medicine with growing acceptance.' },
          ],
          topColleges: ['AIIMS Delhi', 'JIPMER', 'CMC Vellore', 'MAMC', 'KGMU'],
          entranceExams: ['NEET UG'],
          tips: [
            'Physics and chemistry for NEET need as much attention as biology.',
            'Mock tests and previous-year papers are the real teacher.',
            'Clinical experience and communication skills set great doctors apart.',
          ],
        },
        dentistry: {
          title: 'Dentistry',
          description: 'Oral health and surgical practice \u2014 a focused clinical career with strong demand.',
          fitSummary: 'Your PCB stream is the direct feeder into dentistry.',
          whyFits: [
            { label: 'Your stream', copy: 'PCB is exactly what dental colleges require.' },
            { label: 'Your interest', copy: 'You chose Dentistry \u2014 we\u2019ve matched it to the dental clinical route.' },
            { label: 'Your priorities', copy: 'Stability with a self-employment option makes dentistry attractive.' },
          ],
          topCourses: [
            { name: 'BDS', duration: '5 years', fit: 94, growth: '12%', salary: '\u20b95-15 LPA', note: 'The core dental degree; strong practice potential.' },
            { name: 'MDS (Specialisation)', duration: '3 years (after BDS)', fit: 90, growth: '14%', salary: '\u20b910-25 LPA', note: 'Specialist earning power; orthodontics is prized.' },
          ],
          topColleges: ['Maulana Azad Institute', 'Manipal College of Dental Sciences', 'Saveetha Dental College', 'King George\u2019s'],
          entranceExams: ['NEET UG', 'NEET PG (for MDS)'],
          tips: [
            'NEET is the only gate \u2014 same preparation as MBBS aspirants.',
            'Practical skill and patient rapport grow your practice over time.',
            'Specialisation (MDS) meaningfully raises earning ceiling.',
          ],
        },
        pharmacy: {
          title: 'Pharmacy',
          description: 'Drugs, formulation, and pharma science \u2014 clinical and industry-facing careers.',
          fitSummary: 'PCB is a clean feeder into pharmacy and pharmaceutical sciences.',
          whyFits: [
            { label: 'Your stream', copy: 'PCB gives you the chemistry and biology pharmacy degrees build on.' },
            { label: 'Your interest', copy: 'You chose Pharmacy \u2014 a stable, growing healthcare-industry path.' },
            { label: 'Your priorities', copy: 'Faster entry than MBBS with steady industry demand.' },
          ],
          topCourses: [
            { name: 'B.Pharm', duration: '4 years', fit: 93, growth: '15%', salary: '\u20b93-8 LPA', note: 'The standard pharmacy degree.' },
            { name: 'Pharm.D', duration: '6 years', fit: 90, growth: '18%', salary: '\u20b95-12 LPA', note: 'Clinical pharmacy; growing hospital demand.' },
            { name: 'B.Pharm + MBA', duration: '5-6 years', fit: 88, growth: '20%', salary: '\u20b96-15 LPA', note: 'Leadership roles in pharma companies.' },
          ],
          topColleges: ['Jamia Hamdard', 'NIPER (PG)', 'BITS Pilani', 'Manipal'],
          entranceExams: ['CUET', 'GPAT (PG)', 'BITSAT'],
          tips: [
            'Chemistry fundamentals carry this degree \u2014 keep them strong.',
            'Pharma industry roles (QA, R&D, regulatory) are the growth areas.',
            'Consider Pharm.D if clinical pharmacy interests you more than industry.',
          ],
        },
        nursing: {
          title: 'Nursing & Allied Health',
          description: 'Direct patient care and allied sciences \u2014 fast entry with strong global demand.',
          fitSummary: 'Your PCB stream supports a range of allied health careers.',
          whyFits: [
            { label: 'Your stream', copy: 'PCB is the standard entry for nursing and allied health.' },
            { label: 'Your interest', copy: 'You chose Nursing & Allied Health \u2014 a high-demand, people-first path.' },
            { label: 'Your priorities', copy: 'Stability, quick entry, and global mobility define this route.' },
          ],
          topCourses: [
            { name: 'B.Sc Nursing', duration: '4 years', fit: 95, growth: '18%', salary: '\u20b93-7 LPA', note: 'Fast entry, strong global demand.' },
            { name: 'BPT (Physiotherapy)', duration: '4.5 years', fit: 90, growth: '16%', salary: '\u20b93-8 LPA', note: 'Rehabilitation and sports therapy careers.' },
            { name: 'B.Sc (Radiology/Medical Lab)', duration: '3-4 years', fit: 88, growth: '15%', salary: '\u20b93-8 LPA', note: 'Behind-the-scenes clinical roles in demand.' },
          ],
          topColleges: ['AIIMS', 'CMC Vellore', 'Christian Medical College', 'Armed Forces Medical College'],
          entranceExams: ['NEET UG', 'CUET', 'State University Entrances'],
          tips: [
            'Allied health is genuinely not a downgrade \u2014 it has fast entry and mobility.',
            'Nursing certification is internationally portable \u2014 a huge option.',
            'Clinical placements matter; pick colleges with hospital exposure.',
          ],
        },
        veterinary: {
          title: 'Veterinary & Animal Sciences',
          description: 'Animal health, food safety, and wildlife science \u2014 a specialised and rewarding path.',
          fitSummary: 'PCB is the standard entry into veterinary science.',
          whyFits: [
            { label: 'Your stream', copy: 'PCB is exactly what veterinary colleges require.' },
            { label: 'Your interest', copy: 'You chose Veterinary & Animal Sciences \u2014 a niche with real demand.' },
            { label: 'Your priorities', copy: 'Stability with a strong service ethos; government and practice roles exist.' },
          ],
          topCourses: [
            { name: 'B.V.Sc & A.H', duration: '5 years', fit: 94, growth: '14%', salary: '\u20b94-12 LPA', note: 'The core veterinary degree.' },
            { name: 'M.V.Sc (Specialisation)', duration: '2-3 years', fit: 90, growth: '16%', salary: '\u20b96-15 LPA', note: 'Surgery, pathology, and research specialisations.' },
          ],
          topColleges: ['IVRI Bareilly', 'Madras Veterinary College', 'GADVASU Ludhiana', 'Karnataka Veterinary College'],
          entranceExams: ['NEET UG', 'ICAR AIEEA', 'State Veterinary Entrances'],
          tips: [
            'Companion-animal practice is growing fast in cities.',
            'Government (ICAR) roles offer strong stability and benefits.',
            'Wildlife and food-safety niches are rare and rewarding specialisations.',
          ],
        },
        agriculture: {
          title: 'Agriculture & Food Sciences',
          description: 'Farming science, agribusiness, and food technology \u2014 a growing, applied sector.',
          fitSummary: 'PCB gives you the biology foundation agriculture degrees need.',
          whyFits: [
            { label: 'Your stream', copy: 'PCB supports agriculture, food science, and agribusiness degrees.' },
            { label: 'Your interest', copy: 'You chose Agriculture & Food Sciences \u2014 one of the most future-proof sectors.' },
            { label: 'Your priorities', copy: 'Stability and impact both fit an applied science path.' },
          ],
          topCourses: [
            { name: 'B.Sc Agriculture', duration: '4 years', fit: 93, growth: '18%', salary: '\u20b93-8 LPA', note: 'The standard agri degree; strong government intake.' },
            { name: 'B.Tech (Food Technology)', duration: '4 years', fit: 91, growth: '20%', salary: '\u20b94-10 LPA', note: 'Processed-food industry is booming.' },
            { name: 'B.Sc (Horticulture)', duration: '4 years', fit: 88, growth: '16%', salary: '\u20b93-8 LPA', note: 'Specialist plant science with commercial value.' },
          ],
          topColleges: ['IARI', 'TNAU Coimbatore', 'PAU Ludhiana', 'GBPUAT'],
          entranceExams: ['ICAR AIEEA', 'CUET', 'State Agri Entrances'],
          tips: [
            'ICAR and state agri universities have strong placement and government routes.',
            'Agritech startups and food processing are the modern growth lanes.',
            'Practical fieldwork distinguishes strong agri graduates.',
          ],
        },
        biotechnology: {
          title: 'Biotechnology & Life Sciences',
          description: 'Molecular science, bioengineering, and lab research \u2014 the frontier of life sciences.',
          fitSummary: 'PCB is the natural base for biotech and life-science degrees.',
          whyFits: [
            { label: 'Your stream', copy: 'PCB directly supports biotechnology and life sciences degrees.' },
            { label: 'Your interest', copy: 'You chose Biotechnology & Life Sciences \u2014 a research-forward path.' },
            { label: 'Your priorities', copy: 'This rewards curiosity and lab skill; careers grow with specialisation.' },
          ],
          topCourses: [
            { name: 'B.Tech (Biotechnology)', duration: '4 years', fit: 94, growth: '20%', salary: '\u20b94-10 LPA', note: 'Engineering-grade biotech with strong pharma links.' },
            { name: 'B.Sc (Biotechnology)', duration: '3 years', fit: 91, growth: '18%', salary: '\u20b93-8 LPA', note: 'Research and academic path; pair with a masters.' },
            { name: 'Integrated M.Sc (Life Sciences)', duration: '5 years', fit: 90, growth: '20%', salary: '\u20b94-12 LPA', note: 'Research fast track; strong for PhD ambitions.' },
          ],
          topColleges: ['IIT Delhi', 'JNU', 'Banaras Hindu University', 'University of Hyderabad'],
          entranceExams: ['JEE Main', 'CUET', 'NEST', 'University Entrances'],
          tips: [
            'Research labs value genuine lab experience \u2014 get into a good one early.',
            'Bioinformatics and data skills are the modern biotech edge.',
            'Consider combined degrees; pure B.Sc often needs a masters to monetise.',
          ],
        },
        biological_sciences: {
          title: 'Biological Sciences & Research',
          description: 'Zoology, botany, and the life sciences in depth \u2014 for research and academia.',
          fitSummary: 'Your PCB background is the foundation for deep life-science study.',
          whyFits: [
            { label: 'Your stream', copy: 'PCB is the standard entry into biological sciences.' },
            { label: 'Your interest', copy: 'You chose Biological Sciences & Research \u2014 a path for genuine curiosity.' },
            { label: 'Your priorities', copy: 'Academic and research careers reward depth over speed.' },
          ],
          topCourses: [
            { name: 'B.Sc (Zoology)', duration: '3 years', fit: 93, growth: '15%', salary: '\u20b93-7 LPA', note: 'Core life science; foundation for research.' },
            { name: 'B.Sc (Botany)', duration: '3 years', fit: 92, growth: '15%', salary: '\u20b93-7 LPA', note: 'Plant science; strong with ecology or agri links.' },
            { name: 'Integrated M.Sc (Biology)', duration: '5 years', fit: 90, growth: '18%', salary: '\u20b94-10 LPA', note: 'Research path into academia or industry R&D.' },
          ],
          topColleges: ['DU (Hindu, Miranda)', 'Banaras Hindu University', 'JNU', 'University of Hyderabad'],
          entranceExams: ['CUET', 'NEST', 'IISER Aptitude', 'University Entrances'],
          tips: [
            'Pair a B.Sc with research internships or a masters to unlock the real jobs.',
            'Ecology, genomics, and computational biology are the growing niches.',
            'Academia rewards publication \u2014 start lab work in your first year.',
          ],
        },
      },
      topCourses: [
        { name: 'MBBS', duration: '5.5 years', fit: 95, growth: '14%', salary: '\u20b910-25 LPA', note: 'The flagship clinical route.' },
        { name: 'BDS (Dentistry)', duration: '5 years', fit: 88, growth: '12%', salary: '\u20b95-12 LPA', note: 'Respected clinical path with flexibility.' },
        { name: 'B.Sc Nursing', duration: '4 years', fit: 85, growth: '18%', salary: '\u20b93-7 LPA', note: 'Fast entry, strong global demand.' },
      ],
      topColleges: ['AIIMS Delhi', 'JIPMER', 'CMC Vellore', 'MAMC', 'KGMU'],
      entranceExams: ['NEET UG', 'AIIMS MBBS', 'JIPMER'],
      tips: [
        'Biology, physics, and chemistry for NEET need equal attention \u2014 don\u2019t under-rate physics.',
        'Mock tests and previous-year papers are the real teacher.',
        'Keep allied health sciences as a genuine plan B; they\u2019re not a downgrade.',
        'Clinical and communication skills are what separate great doctors.',
      ],
    },
    commerce: {
      title: 'Business & Finance',
      description: 'Commerce opens finance, business, and entrepreneurship \u2014 with certifications that can rival degrees.',
      fitSummary: 'Your commerce background and interest in business align with high-growth finance and management careers.',
      whyFits: [
        { label: 'Your stream', copy: 'Commerce is the direct path into business, accounting, and finance.' },
        { label: 'Your interests', copy: 'Business and finance topped your interest areas.' },
        { label: 'Your priorities', copy: 'You value growth and financial security \u2014 commerce delivers both.' },
      ],
      alternatives: [
        { title: 'Economics (BA/B.Sc)', betterFor: 'If you love the analytical side of money more than the applied side.', tradeoff: 'More theory; often needs a masters or analytics skills to monetise.' },
        { title: 'Direct certifications (CA, CS, CFA)', betterFor: 'If you want a credential that outranks a degree in the market.', tradeoff: 'Demanding exams; commitment matters more than the degree.' },
      ],
      interests: {
        accounting: {
          title: 'Accounting & Taxation',
          description: 'The language of business \u2014 accounts, audit, and tax \u2014 with credentials that outrank degrees.',
          fitSummary: 'Your commerce base and accounting interest line up with a credentialed, stable career.',
          whyFits: [
            { label: 'Your stream', copy: 'Commerce is the exact feeder for accounting and taxation careers.' },
            { label: 'Your interest', copy: 'You chose Accounting & Taxation \u2014 we\u2019ve matched it to the credential-led route.' },
            { label: 'Your priorities', copy: 'Stability and respect are core to this path.' },
          ],
          topCourses: [
            { name: 'B.Com (Honours)', duration: '3 years', fit: 93, growth: '16%', salary: '\u20b93-8 LPA', note: 'The versatile all-rounder of commerce.' },
            { name: 'CA (Chartered Accountancy)', duration: '4-5 years', fit: 94, growth: '15%', salary: '\u20b97-20 LPA', note: 'Elite credential; intense commitment.' },
            { name: 'B.Com + ACCA (International)', duration: '3-4 years', fit: 90, growth: '18%', salary: '\u20b96-18 LPA', note: 'Global accounting route with strong mobility.' },
          ],
          topColleges: ['SRCC Delhi', 'St. Xavier\u2019s Mumbai', 'Christ Bangalore', 'Symbiosis Pune'],
          entranceExams: ['CA Foundation', 'DU Entrance', 'NPAT', 'CUET'],
          tips: [
            'Start CA Foundation during Class 12 if you\u2019re serious \u2014 it saves a year.',
            'Taxation and audit specialisation raise your ceiling over general accounting.',
            'ACCA adds international mobility to an Indian accounting base.',
          ],
        },
        finance: {
          title: 'Finance & Investment',
          description: 'Markets, investing, and corporate finance \u2014 high-growth and numbers-driven.',
          fitSummary: 'Your commerce background and finance interest align with the highest-paying finance roles.',
          whyFits: [
            { label: 'Your stream', copy: 'Commerce is the natural entry into finance and investment.' },
            { label: 'Your interest', copy: 'You chose Finance & Investment \u2014 the strongest earnings path in commerce.' },
            { label: 'Your priorities', copy: 'Growth and salary are at the top of your list \u2014 finance rewards both.' },
          ],
          topCourses: [
            { name: 'B.Com (Finance)', duration: '3 years', fit: 94, growth: '20%', salary: '\u20b94-10 LPA', note: 'Direct feeder into financial services.' },
            { name: 'BBA + MBA (Finance)', duration: '5 years', fit: 92, growth: '22%', salary: '\u20b96-18 LPA', note: 'Fast-track to investment banking and research.' },
            { name: 'CFA (Chartered Financial Analyst)', duration: '2-3 years', fit: 93, growth: '20%', salary: '\u20b98-25 LPA', note: 'The gold-standard finance credential.' },
          ],
          topColleges: ['SRCC Delhi', 'NMIMS Mumbai', 'St. Xavier\u2019s Mumbai', 'Christ Bangalore'],
          entranceExams: ['CFA Level 1', 'DU Entrance', 'IPMAT', 'NPAT'],
          tips: [
            'Quantitative skill (maths + Excel + Python) is the modern finance edge.',
            'CFA during/after B.Com beats most BBA placements for finance roles.',
            'Internships in broking or research firms early matter a lot.',
          ],
        },
        banking: {
          title: 'Banking & Financial Services',
          description: 'Retail and corporate banking, wealth management, and the wider financial services.',
          fitSummary: 'Your commerce background is the classic entry into banking careers.',
          whyFits: [
            { label: 'Your stream', copy: 'Commerce is the standard feeder into banking and financial services.' },
            { label: 'Your interest', copy: 'You chose Banking & Financial Services \u2014 a stable, structured career.' },
            { label: 'Your priorities', copy: 'Job stability and a clear growth ladder fit banking perfectly.' },
          ],
          topCourses: [
            { name: 'B.Com (Banking & Finance)', duration: '3 years', fit: 93, growth: '15%', salary: '\u20b94-9 LPA', note: 'Purpose-built for banking careers.' },
            { name: 'BBA (Banking & Insurance)', duration: '3 years', fit: 91, growth: '16%', salary: '\u20b94-10 LPA', note: 'Private and international banking routes.' },
            { name: 'B.Sc (Economics)', duration: '3 years', fit: 89, growth: '17%', salary: '\u20b94-10 LPA', note: 'Strong for analyst-track banking roles.' },
          ],
          topColleges: ['Christ Bangalore', 'Symbiosis Pune', 'NMIMS Mumbai', 'Madras Christian College'],
          entranceExams: ['CUET', 'NPAT', 'SET', 'IBPS (after grad)'],
          tips: [
            'Public-sector banking (IBPS/SBI PO) is the stability route \u2014 prepare alongside your degree.',
            'Wealth management and private banking pay far more than retail.',
            'Analytical and data skills are increasingly required for the best banking roles.',
          ],
        },
        business: {
          title: 'Business & Management',
          description: 'Management, entrepreneurship, and operations \u2014 leading teams and building things.',
          fitSummary: 'Your commerce base and management interest line up with leadership careers.',
          whyFits: [
            { label: 'Your stream', copy: 'Commerce is the practical base for management and entrepreneurship.' },
            { label: 'Your interest', copy: 'You chose Business & Management \u2014 a path that values people and strategy.' },
            { label: 'Your priorities', copy: 'Growth and leadership are at the heart of this route.' },
          ],
          topCourses: [
            { name: 'BBA', duration: '3 years', fit: 94, growth: '20%', salary: '\u20b94-10 LPA', note: 'General management foundation.' },
            { name: 'BBA + MBA (Integrated)', duration: '5 years', fit: 93, growth: '22%', salary: '\u20b96-18 LPA', note: 'Fast-track to manager roles.' },
            { name: 'BMS / BBM', duration: '3 years', fit: 90, growth: '18%', salary: '\u20b94-9 LPA', note: 'Focused business studies alternative.' },
          ],
          topColleges: ['NMIMS Mumbai', 'Symbiosis Pune', 'Christ Bangalore', 'MDI Gurgaon'],
          entranceExams: ['IPMAT', 'NPAT', 'SET', 'CUET'],
          tips: [
            'Management is learned on the job \u2014 internships during your degree are essential.',
            'A BBA without an MBA or strong internships limits you; plan the next step early.',
            'Data and analytics skills make you a stronger manager candidate.',
          ],
        },
        economics: {
          title: 'Economics',
          description: 'The analytical core of finance, policy, and markets \u2014 respected and flexible.',
          fitSummary: 'Your commerce base and economics interest align with analytical, well-respected careers.',
          whyFits: [
            { label: 'Your stream', copy: 'Commerce students are the standard cohort for economics degrees.' },
            { label: 'Your interest', copy: 'You chose Economics \u2014 a degree that stays valuable across sectors.' },
            { label: 'Your priorities', copy: 'This path rewards analytical thinking and keeps doors open.' },
          ],
          topCourses: [
            { name: 'BA/B.Sc Economics (Hons)', duration: '3 years', fit: 95, growth: '18%', salary: '\u20b94-12 LPA', note: 'The flagship economics degree; strong analytical rigour.' },
            { name: 'B.A. Economics + Statistics', duration: '3 years', fit: 92, growth: '20%', salary: '\u20b94-12 LPA', note: 'Quant-heavy variant with strong data careers.' },
            { name: 'Economics + CA/CFA combo', duration: '3-5 years', fit: 90, growth: '20%', salary: '\u20b97-20 LPA', note: 'Unlocks finance roles with an analytical edge.' },
          ],
          topColleges: ['Delhi School of Economics', 'St. Stephen\u2019s', 'SRCC', 'Christ Bangalore'],
          entranceExams: ['CUET', 'DU Entrance', 'ISI (for stats)'],
          tips: [
            'Maths strength is the real differentiator in economics admissions and jobs.',
            'Pair economics with data/statistics skills to unlock the modern analyst roles.',
            'Economics + a professional credential (CA/CFA) is a very strong combination.',
          ],
        },
        ca: {
          title: 'Chartered Accountancy (CA)',
          description: 'The elite accounting credential \u2014 demanding, respected, and market-defining.',
          fitSummary: 'Your commerce base and interest in CA line up with a high-status career.',
          whyFits: [
            { label: 'Your stream', copy: 'Commerce is the standard path into the CA programme.' },
            { label: 'Your interest', copy: 'You chose Chartered Accountancy \u2014 the single most respected commerce credential.' },
            { label: 'Your priorities', copy: 'This path trades short-term intensity for long-term status and security.' },
          ],
          topCourses: [
            { name: 'CA (Foundation to Final)', duration: '4-5 years', fit: 96, growth: '15%', salary: '\u20b97-20 LPA', note: 'The complete CA route.' },
            { name: 'B.Com + CA (Combined)', duration: '4-5 years', fit: 94, growth: '16%', salary: '\u20b98-22 LPA', note: 'Degree plus credential; best of both.' },
            { name: 'CA + ACCA (International)', duration: '5-6 years', fit: 90, growth: '18%', salary: '\u20b910-25 LPA', note: 'Adds global mobility to an Indian CA.' },
          ],
          topColleges: ['ICAI (pan-India)', 'SRCC (with B.Com)', 'Christ Bangalore'],
          entranceExams: ['CA Foundation'],
          tips: [
            'Start CA Foundation in Class 12 itself \u2014 the head start is decisive.',
            'Consistency beats cramming \u2014 CA rewards sustained daily study.',
            'Articleship quality determines your career more than your rank.',
          ],
        },
        cs: {
          title: 'Company Secretary (CS)',
          description: 'Corporate governance, compliance, and legal secretarial work \u2014 a specialist corporate career.',
          fitSummary: 'Your commerce base and CS interest align with a structured, respected corporate role.',
          whyFits: [
            { label: 'Your stream', copy: 'Commerce is the standard feeder for the CS programme.' },
            { label: 'Your interest', copy: 'You chose Company Secretary \u2014 a niche credential with steady demand.' },
            { label: 'Your priorities', copy: 'Stability and a clear corporate path define this role.' },
          ],
          topCourses: [
            { name: 'CS (Executive + Professional)', duration: '3-4 years', fit: 95, growth: '14%', salary: '\u20b95-15 LPA', note: 'The complete CS route.' },
            { name: 'B.Com + CS (Combined)', duration: '3-4 years', fit: 93, growth: '15%', salary: '\u20b96-16 LPA', note: 'Degree plus credential.' },
            { name: 'CS + LLB (Combined)', duration: '5-6 years', fit: 90, growth: '16%', salary: '\u20b97-18 LPA', note: 'Rare and valuable legal-corporate combination.' },
          ],
          topColleges: ['ICSI (pan-India)', 'SRCC (with B.Com)', 'MCC Chennai'],
          entranceExams: ['CS CSEET'],
          tips: [
            'CS is smaller cohort than CA \u2014 competition is lower, demand is steady.',
            'Corporate governance and compliance expertise is increasingly prized.',
            'Combining CS with law or MBA widens your career significantly.',
          ],
        },
        cma: {
          title: 'Cost & Management Accounting (CMA)',
          description: 'Cost control, budgeting, and management accounting \u2014 the numbers that steer decisions.',
          fitSummary: 'Your commerce base and CMA interest align with a solid management-accounting career.',
          whyFits: [
            { label: 'Your stream', copy: 'Commerce is the standard path into the CMA programme.' },
            { label: 'Your interest', copy: 'You chose Cost & Management Accounting \u2014 the decision-focused credential.' },
            { label: 'Your priorities', copy: 'Stability with a management-accounting angle fits you well.' },
          ],
          topCourses: [
            { name: 'CMA (Foundation to Final)', duration: '3-4 years', fit: 95, growth: '14%', salary: '\u20b95-15 LPA', note: 'The complete CMA route.' },
            { name: 'B.Com + CMA (Combined)', duration: '3-4 years', fit: 93, growth: '15%', salary: '\u20b96-16 LPA', note: 'Degree plus credential.' },
            { name: 'CMA + MBA (Finance)', duration: '5 years', fit: 90, growth: '18%', salary: '\u20b98-20 LPA', note: 'Management-accounting plus leadership.' },
          ],
          topColleges: ['ICMAI (pan-India)', 'SRCC (with B.Com)', 'Symbiosis Pune'],
          entranceExams: ['CMA Foundation'],
          tips: [
            'CMA has a lower entry bar than CA with a similar management-accounting career.',
            'Cost and budgeting skills are evergreen in every industry.',
            'Combining CMA with analytics/data skills is a strong modern profile.',
          ],
        },
      },
      topCourses: [
        { name: 'B.Com (Honours)', duration: '3 years', fit: 92, growth: '16%', salary: '\u20b93-8 LPA', note: 'Flexible and respected across finance.' },
        { name: 'BBA + MBA (Integrated)', duration: '5 years', fit: 90, growth: '20%', salary: '\u20b96-15 LPA', note: 'Fast-track to management roles.' },
        { name: 'CA (Chartered Accountancy)', duration: '4-5 years', fit: 88, growth: '15%', salary: '\u20b97-20 LPA', note: 'Elite credential; intense commitment.' },
      ],
      topColleges: ['SRCC Delhi', 'St. Xavier\u2019s Mumbai', 'Christ Bangalore', 'Symbiosis Pune'],
      entranceExams: ['DU Entrance', 'NPAT', 'IPMAT', 'CA Foundation'],
      tips: [
        'Strong accounting and analytics are the foundation of every commerce career.',
        'Professional courses (CA, CS, CMA) can out-earn degrees \u2014 research them now.',
        'Digital literacy and data skills are your edge in a numbers-heavy field.',
        'Internships in finance or startups teach more than textbooks here.',
      ],
    },
    arts: {
      title: 'Creative & Social Sciences',
      description: 'Arts opens media, law, psychology, design, and social impact \u2014 broad and deeply human.',
      fitSummary: 'Your arts background and creative interests align with careers where insight and expression matter.',
      whyFits: [
        { label: 'Your stream', copy: 'Arts is the platform for law, media, design, and the social sciences.' },
        { label: 'Your interests', copy: 'Creative and social impact both appeared high in your answers.' },
        { label: 'Your priorities', copy: 'You care about the work itself \u2014 and that\u2019s exactly what arts rewards.' },
      ],
      alternatives: [
        { title: 'Commerce + media crossover', betterFor: 'If you want journalism/design careers with business grounding.', tradeoff: 'More maths, but a wider safety net.' },
        { title: 'Design (NID/NIFT route)', betterFor: 'If visual creation is your real love.', tradeoff: 'Portfolio-driven; different entrance exams (NID, UCEED).' },
      ],
      interests: {
        law: {
          title: 'Law & Legal Studies',
          description: 'Legal reasoning, advocacy, and policy \u2014 a respected, high-reward, high-growth path.',
          fitSummary: 'Your arts base and legal interest align with one of the most respected careers in India.',
          whyFits: [
            { label: 'Your stream', copy: 'Arts is the classic feeder into five-year law programmes.' },
            { label: 'Your interest', copy: 'You chose Law & Legal Studies \u2014 a rigorous, respected, high-reward path.' },
            { label: 'Your priorities', copy: 'This path rewards reading, reasoning, and conviction.' },
          ],
          topCourses: [
            { name: 'BA LLB (Integrated)', duration: '5 years', fit: 96, growth: '14%', salary: '\u20b95-15 LPA', note: 'The flagship law degree; NLU route.' },
            { name: 'BBA LLB (Integrated)', duration: '5 years', fit: 93, growth: '15%', salary: '\u20b95-16 LPA', note: 'Corporate-law focus; strong placements.' },
            { name: 'LLB (3-year, after degree)', duration: '3 years', fit: 90, growth: '14%', salary: '\u20b95-15 LPA', note: 'Second-degree route for late starters.' },
          ],
          topColleges: ['NLU Delhi', 'NALSAR Hyderabad', 'NUJS Kolkata', 'NLU Bangalore'],
          entranceExams: ['CLAT', 'AILET', 'SLAT', 'MH-CET Law'],
          tips: [
            'CLAT is a single, scoreable exam \u2014 consistent practice is decisive.',
            'Moot courts and internships separate strong law students.',
            'Corporate law and litigation are different worlds; pick deliberately.',
          ],
        },
        psychology: {
          title: 'Psychology & Human Behaviour',
          description: 'The science of mind and behaviour \u2014 clinical, counselling, and organisational careers.',
          fitSummary: 'Your arts base and psychology interest align with a growing, deeply human field.',
          whyFits: [
            { label: 'Your stream', copy: 'Arts is the standard entry into psychology degrees.' },
            { label: 'Your interest', copy: 'You chose Psychology & Human Behaviour \u2014 empathy as a professional skill.' },
            { label: 'Your priorities', copy: 'This field rewards insight and patience.' },
          ],
          topCourses: [
            { name: 'BA (Psychology)', duration: '3 years', fit: 95, growth: '18%', salary: '\u20b93-8 LPA', note: 'Foundation; most go on to a masters.' },
            { name: 'BA + MA (Integrated)', duration: '5 years', fit: 93, growth: '20%', salary: '\u20b94-10 LPA', note: 'Clinical/counselling track; required for practice.' },
            { name: 'B.Sc (Psychology)', duration: '3 years', fit: 91, growth: '18%', salary: '\u20b93-8 LPA', note: 'Research-oriented variant with strong stats.' },
          ],
          topColleges: ['DU (Lady Shri Ram)', 'Christ Bangalore', 'Ashoka University', 'TISS'],
          entranceExams: ['CUET', 'Christ Entrance', 'Ashoka Aptitude'],
          tips: [
            'Clinical practice requires a masters and licensure \u2014 plan for the long haul.',
            'Organisational psychology (HR) is the fastest-growing commercial niche.',
            'Research experience and counselling internships matter most.',
          ],
        },
        journalism: {
          title: 'Journalism & Mass Communication',
          description: 'Reporting, media, and storytelling \u2014 fast-moving and widely applicable.',
          fitSummary: 'Your arts base and journalism interest align with a story-driven, visible career.',
          whyFits: [
            { label: 'Your stream', copy: 'Arts is the natural entry into journalism and media degrees.' },
            { label: 'Your interest', copy: 'You chose Journalism & Mass Communication \u2014 writing and truth as a career.' },
            { label: 'Your priorities', copy: 'This path rewards curiosity, speed, and communication.' },
          ],
          topCourses: [
            { name: 'BA (Journalism)', duration: '3 years', fit: 94, growth: '20%', salary: '\u20b93-8 LPA', note: 'Core journalism; pair with digital skills.' },
            { name: 'BJMC', duration: '3 years', fit: 93, growth: '20%', salary: '\u20b94-10 LPA', note: 'Mass communication with media craft.' },
            { name: 'BA (Media & Communication)', duration: '3 years', fit: 90, growth: '22%', salary: '\u20b94-10 LPA', note: 'Digital-first media studies.' },
          ],
          topColleges: ['IIMC Delhi', 'Symbiosis Pune', 'XIC Mumbai', 'Lady Shri Ram'],
          entranceExams: ['IIMC Entrance', 'CUET', 'Symbiosis SET', 'XIC Entrance'],
          tips: [
            'A portfolio of published work beats a high CGPA in journalism.',
            'Digital, video, and data skills are the modern journalist\u2019s edge.',
            'Internships at real newsrooms are non-negotiable.',
          ],
        },
        social_sciences: {
          title: 'Social Sciences',
          description: 'Sociology, political science, and anthropology \u2014 understanding how societies work.',
          fitSummary: 'Your arts base and social-science interest align with analytical, people-centred careers.',
          whyFits: [
            { label: 'Your stream', copy: 'Arts is the home of the social sciences.' },
            { label: 'Your interest', copy: 'You chose Social Sciences \u2014 a foundation for policy, research, and academia.' },
            { label: 'Your priorities', copy: 'This path rewards curiosity about how the world actually works.' },
          ],
          topCourses: [
            { name: 'BA (Political Science)', duration: '3 years', fit: 94, growth: '15%', salary: '\u20b93-8 LPA', note: 'Strong for civil services and policy.' },
            { name: 'BA (Sociology)', duration: '3 years', fit: 92, growth: '15%', salary: '\u20b93-8 LPA', note: 'Research, NGO, and policy careers.' },
            { name: 'BA (Social Work / MSW)', duration: '3+2 years', fit: 90, growth: '18%', salary: '\u20b93-8 LPA', note: 'TISS route into development sector.' },
          ],
          topColleges: ['JNU', 'DU (Hindu, LSR)', 'TISS', 'Ashoka University'],
          entranceExams: ['CUET', 'TISS Entrance', 'Ashoka Aptitude'],
          tips: [
            'Pair social sciences with data/research skills \u2014 modern policy jobs require it.',
            'Civil services prep and development-sector work are the main paths; choose early.',
            'Research internships define the strongest graduates.',
          ],
        },
        languages: {
          title: 'Languages & Literature',
          description: 'Writing, translation, and the study of literature \u2014 transferable and deeply human.',
          fitSummary: 'Your arts base and language interest align with writing-led, flexible careers.',
          whyFits: [
            { label: 'Your stream', copy: 'Arts is the natural home for language and literature degrees.' },
            { label: 'Your interest', copy: 'You chose Languages & Literature \u2014 the skill that transfers everywhere.' },
            { label: 'Your priorities', copy: 'This path rewards craft, reading, and expression.' },
          ],
          topCourses: [
            { name: 'BA (English Hons)', duration: '3 years', fit: 95, growth: '18%', salary: '\u20b93-8 LPA', note: 'Sharpens writing; pair with digital skills.' },
            { name: 'BA (Modern Languages)', duration: '3 years', fit: 91, growth: '16%', salary: '\u20b93-8 LPA', note: 'Translation, diplomacy, and global careers.' },
            { name: 'MA (English/Applied)', duration: '2 years', fit: 90, growth: '18%', salary: '\u20b94-10 LPA', note: 'Teaching, publishing, and content leadership.' },
          ],
          topColleges: ['St. Stephen\u2019s', 'Lady Shri Ram', 'JNU', 'EFL University'],
          entranceExams: ['CUET', 'JNU Entrance', 'EFL Entrance'],
          tips: [
            'Writing and critical thinking transfer to every career \u2014 don\u2019t undervalue them.',
            'Add a digital skill (content, SEO, editing) to make the degree practical.',
            'Publishing, education, and content strategy are the main employment lanes.',
          ],
        },
        public_policy: {
          title: 'Public Policy & Civil Services',
          description: 'Policy analysis, governance, and civil services \u2014 a mission-driven, respected path.',
          fitSummary: 'Your arts base and policy interest align with careers shaping how society is run.',
          whyFits: [
            { label: 'Your stream', copy: 'Arts and social sciences are the classic feeder into policy and civil services.' },
            { label: 'Your interest', copy: 'You chose Public Policy & Civil Services \u2014 impact at scale.' },
            { label: 'Your priorities', copy: 'This path rewards patience, discipline, and a public-service mindset.' },
          ],
          topCourses: [
            { name: 'BA (Political Science Hons)', duration: '3 years', fit: 95, growth: '15%', salary: '\u20b93-8 LPA', note: 'The classic civil-services foundation.' },
            { name: 'BA (Economics) + Policy', duration: '3-4 years', fit: 93, growth: '18%', salary: '\u20b94-10 LPA', note: 'Quant policy track; strong for UPSC and think tanks.' },
            { name: 'MPA / Policy (after degree)', duration: '2 years', fit: 91, growth: '20%', salary: '\u20b96-15 LPA', note: 'TISS, IIM, or international policy programmes.' },
          ],
          topColleges: ['JNU', 'DU (Hindu, SRCC)', 'Ashoka University', 'TISS'],
          entranceExams: ['CUET', 'UPSC CSE (after graduation)', 'TISS Entrance'],
          tips: [
            'Civil services is a marathon \u2014 consistency over a single burst.',
            'Current affairs and answer-writing are skills; start early and practice daily.',
            'Policy analyst roles in think tanks and consulting are strong non-UPSC paths.',
          ],
        },
        education: {
          title: 'Education & Teaching',
          description: 'Teaching, curriculum, and education leadership \u2014 shaping how others learn.',
          fitSummary: 'Your arts base and education interest align with a meaningful, stable career.',
          whyFits: [
            { label: 'Your stream', copy: 'Arts is a standard feeder into teaching and education degrees.' },
            { label: 'Your interest', copy: 'You chose Education & Teaching \u2014 impact through others\u2019 growth.' },
            { label: 'Your priorities', copy: 'Stability and purpose both define this path.' },
          ],
          topCourses: [
            { name: 'B.El.Ed', duration: '4 years', fit: 95, growth: '15%', salary: '\u20b93-7 LPA', note: 'Elite elementary-teaching degree (DU).' },
            { name: 'BA + B.Ed (Integrated)', duration: '4 years', fit: 93, growth: '15%', salary: '\u20b93-8 LPA', note: 'Subject expertise plus teaching credential.' },
            { name: 'BA (Education)', duration: '3 years', fit: 91, growth: '16%', salary: '\u20b93-8 LPA', note: 'Ed-policy and edtech career base.' },
          ],
          topColleges: ['DU (Lady Irwin)', 'Christ Bangalore', 'TISS', 'Azim Premji University'],
          entranceExams: ['CUET', 'Christ Entrance', 'Azim Premji Entrance'],
          tips: [
            'International schools and edtech pay well above average \u2014 keep both in view.',
            'A masters in education opens policy and leadership roles.',
            'Teaching credentials are globally portable; keep them in mind for mobility.',
          ],
        },
        design: {
          title: 'Design & Creative Arts',
          description: 'Visual, product, and digital design \u2014 portfolio-driven careers with a real market.',
          fitSummary: 'Your arts base and design interest align with creative careers that reward craft.',
          whyFits: [
            { label: 'Your stream', copy: 'Arts is the common feeder into design and creative arts degrees.' },
            { label: 'Your interest', copy: 'You chose Design & Creative Arts \u2014 portfolio-driven and visible.' },
            { label: 'Your priorities', copy: 'This path rewards originality and craft over rote marks.' },
          ],
          topCourses: [
            { name: 'B.Des (Product/Industrial)', duration: '4 years', fit: 94, growth: '20%', salary: '\u20b94-12 LPA', note: 'Strong product-design careers.' },
            { name: 'B.Des (Communication/UI-UX)', duration: '4 years', fit: 93, growth: '22%', salary: '\u20b95-15 LPA', note: 'Digital design; the fastest-growing design lane.' },
            { name: 'B.FA / BA (Applied Arts)', duration: '3-4 years', fit: 90, growth: '18%', salary: '\u20b93-8 LPA', note: 'Traditional arts with commercial applications.' },
          ],
          topColleges: ['NID Ahmedabad', 'NIFT Delhi', 'IIT Bombay (IDC)', 'Pearl Academy'],
          entranceExams: ['NID DAT', 'UCEED', 'NIFT Entrance', 'CUET'],
          tips: [
            'A visible portfolio is your real resume \u2014 build it from year one.',
            'UI/UX and digital design have the strongest employment market today.',
            'Design schools test thinking as much as drawing \u2014 practise visual reasoning.',
          ],
        },
      },
      topCourses: [
        { name: 'BA (Hons) English', duration: '3 years', fit: 90, growth: '18%', salary: '\u20b93-8 LPA', note: 'Sharpens writing; pair with digital skills.' },
        { name: 'BJMC (Journalism)', duration: '3 years', fit: 88, growth: '20%', salary: '\u20b94-10 LPA', note: 'Storytelling with a market.' },
        { name: 'BA LLB (Integrated)', duration: '5 years', fit: 85, growth: '14%', salary: '\u20b95-15 LPA', note: 'Demanding, respected, high-reward.' },
      ],
      topColleges: ['Lady Shri Ram', 'Miranda House', 'NLU Delhi', 'NALSAR', 'IIMC'],
      entranceExams: ['DU Entrance', 'CLAT', 'NID Entrance', 'IIMC Entrance'],
      tips: [
        'A visible portfolio is your real resume in creative fields.',
        'Writing and critical thinking transfer to every path here.',
        'Law is a high-growth, respected route worth researching seriously.',
        'Emerging fields like UX design and content strategy reward humanities grads who add digital skills.',
      ],
    },
  },
  graduate: {
    engineering: {
      title: 'Tech Career Advancement',
      description: 'Your engineering base is a launchpad \u2014 the question is which direction gives you the best leverage.',
      fitSummary: 'Given your background and goals, we\u2019ve ranked moves by effort, timeline, and return.',
      whyFits: [
        { label: 'Your background', copy: 'Engineering gives you a technical base that most career switchers don\u2019t have.' },
        { label: 'Your goal', copy: 'Your stated goal maps well onto specialisation and leadership moves.' },
        { label: 'Market demand', copy: 'Cloud, data, and product roles are hiring aggressively right now.' },
      ],
      recommendations: [
        { title: 'M.Tech / MS', description: 'Specialise in emerging technology for depth and a pay jump.', timeline: '1-2 years', investment: '\u20b95-30 Lakh', tag: 'Depth' },
        { title: 'MBA (Technology)', description: 'Move toward tech leadership and business-of-product roles.', timeline: '1-2 years', investment: '\u20b910-25 Lakh', tag: 'Leadership' },
        { title: 'Product Management', description: 'Transition from building to deciding what gets built.', timeline: '3-6 months', investment: '\u20b91-3 Lakh', tag: 'Fastest' },
        { title: 'Cloud Certifications', description: 'AWS / Azure / GCP \u2014 cheap, fast, and very marketable.', timeline: '3-6 months', investment: '\u20b950K-1 Lakh', tag: 'Low risk' },
      ],
      skills: ['System design', 'Cloud architecture', 'Leadership', 'Agile'],
      tips: [
        'A strong GitHub profile is your resume for tech moves.',
        'Open-source contributions are the fastest way to prove yourself.',
        'Cloud certs are cheap leverage while you decide the bigger move.',
        'Network with people in the roles you want \u2014 not the ones you\u2019re in.',
      ],
    },
    management: {
      title: 'Management Career Growth',
      description: 'Your path forward is about leadership, credentials, and moving up \u2014 methodically.',
      fitSummary: 'Your experience and goals point toward structured credential + network growth.',
      whyFits: [
        { label: 'Your experience', copy: 'Your years in the workforce mean credentials compound faster for you now.' },
        { label: 'Your goal', copy: 'Promotion and leadership are best served by these moves.' },
        { label: 'The market', copy: 'Companies reward formal leadership signals at your stage.' },
      ],
      recommendations: [
        { title: 'Executive MBA', description: 'Fast-track to senior leadership while working.', timeline: '1 year', investment: '\u20b915-30 Lakh', tag: 'Big move' },
        { title: 'PMP Certification', description: 'A globally recognised project-management credential.', timeline: '3-6 months', investment: '\u20b950K-1 Lakh', tag: 'Credential' },
        { title: 'Strategy Consulting', description: 'Move into advisory roles with broader exposure.', timeline: '6 months', investment: '\u20b92-5 Lakh', tag: 'Pivot' },
        { title: 'Digital Transformation', description: 'Lead the change initiatives companies are scrambling for.', timeline: '3-6 months', investment: '\u20b91-3 Lakh', tag: 'Emerging' },
      ],
      skills: ['Strategic thinking', 'Team leadership', 'Financial acumen', 'Change management'],
      tips: [
        'Cross-functional experience is the currency of leadership moves.',
        'Your network is your real job-search asset \u2014 invest in it deliberately.',
        'Industry-specific certifications beat generic ones for speed of promotion.',
        'Data-driven decision making is the skill managers get noticed for.',
      ],
    },
    default: {
      title: 'Career Advancement',
      description: 'A clear, honest set of next moves built around your background and goals.',
      fitSummary: 'Here\u2019s a balanced plan \u2014 ranked by what gives you the most control over your next step.',
      whyFits: [
        { label: 'Your background', copy: 'We\u2019ve matched this plan to what you told us about your current situation.' },
        { label: 'Your goal', copy: 'These moves keep every one of your stated goals reachable.' },
        { label: 'Timing', copy: 'Options are ordered so you can act within your timeline.' },
      ],
      recommendations: [
        { title: 'Higher Education', description: 'Pursue an MBA, MS, or specialised course for a structural leap.', timeline: '1-2 years', investment: '\u20b95-30 Lakh', tag: 'Structural' },
        { title: 'Professional Certifications', description: 'Industry-recognised credentials that move you faster.', timeline: '3-6 months', investment: '\u20b950K-3 Lakh', tag: 'Fast' },
        { title: 'Career Switch', description: 'Transition to a growing industry with transferable skills.', timeline: '6-12 months', investment: '\u20b92-10 Lakh', tag: 'Pivot' },
        { title: 'Entrepreneurship', description: 'Start a venture if building your own thing is the goal.', timeline: '1+ year', investment: 'Variable', tag: 'Risk' },
      ],
      skills: ['Adaptability', 'Continuous learning', 'Networking', 'Personal branding'],
      tips: [
        'Map your transferable skills \u2014 most career switches reuse 60% of what you know.',
        'A strong LinkedIn presence opens doors before you need them.',
        'Find mentors who are 3-5 years ahead, not 20 \u2014 they\u2019re more relatable.',
        'Track industry trends; timing matters as much as direction.',
      ],
    },
  },
  parent: {
    default: {
      title: 'A Clear Plan for Your Child\u2019s Education',
      description: 'Based on what you shared about your child\u2019s stage, interests, and your priorities.',
      fitSummary: 'This is a transparent look at the decisions ahead \u2014 what matters, what it costs, and what to watch out for.',
      whyFits: [
        { label: 'Your child\u2019s stage', copy: 'The plan is framed around exactly where your child is right now.' },
        { label: 'Your priorities', copy: 'We\u2019ve ordered recommendations around the concerns you ranked highest.' },
        { label: 'Your budget', copy: 'Every suggestion respects the budget range you gave us.' },
      ],
      recommendations: [
        { title: 'Stream Selection', description: 'Choosing the right academic stream is the single highest-leverage decision now.', importance: 'High' },
        { title: 'College Selection', description: 'Find colleges that fit your budget, priorities, and your child\u2019s strengths.', importance: 'High' },
        { title: 'Career Counseling', description: 'Professional guidance helps when family opinions conflict.', importance: 'Medium' },
        { title: 'Skill Development', description: 'Add career-relevant skills alongside academics for a stronger start.', importance: 'Medium' },
      ],
      tips: [
        'Let your child explore interests before locking a stream \u2014 it saves costly changes later.',
        'Look at placement records and alumni networks, not just rankings.',
        'Weigh campus culture and academic reputation together, not separately.',
        'Plan finances early \u2014 scholarships and education loans are easier to line up in advance.',
        'Protect your child\u2019s mental health during these transitions; pressure backfires.',
      ],
    },
  },
};

export const aiAdvisorResponses = {
  greeting: 'Hello! I\u2019m your NAVORA education advisor. To help you better, let me know what you\u2019re looking for:\n\n\u2022 Career guidance \u2014 "What career suits me?"\n\u2022 Course selection \u2014 "What should I study?"\n\u2022 College advice \u2014 "Which college is best for me?"\n\u2022 Exam planning \u2014 "How do I prepare for [exam]?"\n\nWhat would you like help with today?',
  prompts: [
    'What should I study after 12th?',
    'Which engineering college for Computer Science?',
    'How do I prepare for NEET?',
    'Is an MBA worth it after B.Tech?',
    'Best career options for commerce students?',
    'IIT vs NIT \u2014 how do I choose?',
    'Scholarships for studying abroad?',
    'Study in India or abroad?',
  ],
};

export const recommendationDescriptions = {
  class10: 'Streams that match how you think and what you love.',
  class12: 'Courses and colleges matched to your stream and priorities.',
  graduate: 'Career moves ranked by effort, timeline, and return.',
  parent: 'A transparent plan for the decisions ahead.',
};

const class10StreamMap = {
  mpc: 'mpc',
  bipc: 'bipc',
  commerce: 'commerce',
  arts: 'arts',
  diploma: 'diploma',
  iti: 'iti',
};

const streamNames = {
  science_pcm: 'MPC',
  science_pcb: 'BiPC',
  commerce: 'Commerce',
  arts: 'Arts / Humanities',
};

const streamAltCopy = {
  science_pcm: {
    betterFor: 'If maths, technology, engineering, and problem-solving pull you harder than anything else.',
    tradeoff: 'The most maths-heavy route \u2014 you\u2019ll carry physics and chemistry through to JEE, BITSAT, or NDA.',
  },
  science_pcb: {
    betterFor: 'If biology, medicine, healthcare, and the life sciences excite you the most.',
    tradeoff: 'A science-heavy path without advanced maths \u2014 built around NEET and the health sciences.',
  },
  commerce: {
    betterFor: 'If business, markets, money, and management genuinely interest you.',
    tradeoff: 'You\u2019ll study applied maths and economics rather than physics and chemistry.',
  },
  arts: {
    betterFor: 'If people, ideas, writing, law, and creative work drive you.',
    tradeoff: 'You\u2019ll keep maths light and build around humanities subjects instead.',
  },
};

const discoveryKeySubjects = {
  science_pcm: ['Mathematics', 'Physics', 'Chemistry'],
  science_pcb: ['Biology', 'Physics', 'Chemistry'],
  commerce: ['Accountancy', 'Economics', 'Business Studies'],
  arts: ['History', 'Literature', 'Political Science', 'Psychology'],
};

const discoveryCareers = {
  science_pcm: ['Software Engineer', 'Data Scientist', 'Aerospace Engineer', 'AI Engineer', 'Quantitative Analyst'],
  science_pcb: ['Doctor', 'Biotech Researcher', 'Pharmacist', 'Life-Sciences Scientist', 'Veterinarian'],
  commerce: ['Chartered Accountant', 'Financial Analyst', 'Investment Banker', 'Business Consultant', 'Marketing Manager'],
  arts: ['Lawyer', 'Psychologist', 'Journalist', 'Content Strategist', 'Designer'],
};

const class10StreamRecMap = {
  science_pcm: 'mpc',
  science_pcb: 'bipc',
  commerce: 'commerce',
  arts: 'arts',
};

const discoveryAnswers = ['interest', 'strengths', 'work_style', 'career_goal'];
const discoveryWeight = { interest: 2, strengths: 2, work_style: 1, career_goal: 2 };

function getStreamDiscoveryRecommendation(answers = {}) {
  const scores = { science_pcm: 0, science_pcb: 0, commerce: 0, arts: 0 };
  const reasons = { science_pcm: [], science_pcb: [], commerce: [], arts: [] };

  const optionMap = {};
  (questions.class12_discovery || []).forEach((q) =>
    (q.options || []).forEach((o) => {
      optionMap[o.value] = o;
    }),
  );

  discoveryAnswers.forEach((qid) => {
    const weight = discoveryWeight[qid] || 1;
    (answers[qid] || []).forEach((val) => {
      const option = optionMap[val];
      if (option?.stream && option.stream in scores) {
        scores[option.stream] += weight;
        if (reasons[option.stream].length < 3) reasons[option.stream].push(option.label);
      }
    });
  });

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topKey, topScore] = ranked[0];
  const totalScore = ranked.reduce((sum, [, v]) => sum + v, 0) || 1;
  const confidence = Math.min(96, Math.max(58, Math.round((topScore / totalScore) * 100)));

  const base = recommendations.class10[class10StreamRecMap[topKey]] || recommendations.class10.science;
  const topReasons = reasons[topKey];
  const description =
    topReasons.length > 0
      ? `Based on your interest in ${topReasons.join(', ')}, ${streamNames[topKey]} appears to be a strong fit for you.`
      : `${streamNames[topKey]} appears to be a strong fit for the way you described yourself.`;

  return {
    ...base,
    description,
    fitSummary: `Your interests, strengths, and career goals point most strongly toward ${streamNames[topKey]}.`,
    confidence,
    alternatives: ranked
      .slice(1)
      .map(([key]) => ({
        title: streamNames[key],
        betterFor: streamAltCopy[key].betterFor,
        tradeoff: streamAltCopy[key].tradeoff,
      })),
    keySubjects: discoveryKeySubjects[topKey],
    futureCareers: discoveryCareers[topKey],
  };
}

/**
 * Detect whether answers come from the new conversational questionnaire
 * (has `enjoy`, `strongest`, `future_work` for class10; `thinking_about`
 * for class12; `degree_family` for graduation).
 */
function isConversationalFormat(answers) {
  return Boolean(
    answers.enjoy || answers.strongest || answers.future_work ||
    answers.thinking_about || answers.kind_of_work ||
    answers.degree_family || answers.field_interest ||
    // New AssessmentFlow graduation stores degree/family (not the legacy
    // currentDegree). Recognizing these lets normalizeAnswers populate
    // currentDegree so the AI + context engine have the student's real degree.
    answers.degree || answers.family,
  );
}

/**
 * Map new conversational answers to the legacy format the recommendation
 * engine expects. Only transforms fields that exist in the new format.
 */
function normalizeAnswers(userType, answers) {
  if (!isConversationalFormat(answers)) return answers;

  const out = { ...answers };

  if (userType === 'class10') {
    if (answers.enjoy && !answers.interest) {
      out.interest = Array.isArray(answers.enjoy) ? answers.enjoy : [answers.enjoy];
    }
    if (answers.strongest && !answers.interest) {
      out.interest = Array.isArray(answers.strongest) ? answers.strongest : [answers.strongest];
    }
    if (answers.future_work && !answers.career_goal) {
      out.career_goal = answers.future_work;
    }
    if (answers.clarity && !answers.work_style) {
      out.work_style = answers.clarity;
    }
    if (answers.parent_priority && !answers.strengths) {
      out.strengths = Array.isArray(answers.parent_priority) ? answers.parent_priority : [answers.parent_priority];
    }
  }

  if (userType === 'class12') {
    if (answers.thinking_about && !answers.interest_area) {
      out.interest_area = answers.thinking_about;
    }
    if (answers.thinking_about && !answers.interest) {
      out.interest = answers.thinking_about;
    }
    if (answers.concern && !answers.priority) {
      out.priority = answers.concern;
    }
    if (answers.decision_clarity && !answers.higher_education) {
      out.higher_education = answers.decision_clarity;
    }
  }

  if (userType === 'graduate') {
    const degreeLabel = answers.degree || '';
    const specialization = answers.specialization || '';

    const degreeNameMap = {
      btech: 'B.Tech / B.E.',
      be: 'B.Tech / B.E.',
      mbbs: 'MBBS',
      bds: 'BDS',
      bams: 'BAMS',
      bhms: 'BHMS',
      bums: 'BUMS',
      bsms: 'BSMS',
      bnys: 'BNYS',
      bpharm: 'B.Pharm',
      pharmd: 'Pharm.D',
      bsc_nursing: 'B.Sc Nursing',
      bpt: 'BPT / Physiotherapy',
      bot: 'BOT / Occupational Therapy',
      bsc_medical_lab: 'B.Sc Medical Laboratory Technology',
      bsc_radiology: 'B.Sc Radiology / Medical Imaging',
      bsc_optometry: 'B.Sc Optometry',
      bsc_cardiac: 'B.Sc Cardiac Care Technology',
      bsc_anaesthesia: 'B.Sc Anaesthesia Technology',
      bsc_ot: 'B.Sc Operation Theatre Technology',
      bsc_respiratory: 'B.Sc Respiratory Therapy',
      bsc_dialysis: 'B.Sc Dialysis Technology',
      bsc_emergency: 'B.Sc Emergency / Trauma Care',
      other_healthcare: 'Other Healthcare Degree',
      bca: 'BCA',
      bsc_cs: 'B.Sc Computer Science',
      bsc_it: 'B.Sc Information Technology',
      bsc_data_science: 'B.Sc Data Science',
      bsc_ai: 'B.Sc Artificial Intelligence',
      bsc_cybersecurity: 'B.Sc Cybersecurity',
      bsc_computer_apps: 'B.Sc Computer Applications',
      other_computing: 'Other Computing Degree',
      bcom: 'B.Com',
      bba: 'BBA',
      bsc: 'B.Sc',
      ba: 'BA',
      llb: 'LLB',
      ba_llb: 'BA LLB',
      bba_llb: 'BBA LLB',
      bcom_llb: 'B.Com LLB',
      bsc_llb: 'B.Sc LLB',
      bdes: 'B.Des',
      bfa: 'BFA',
      fashion_design: 'Fashion Design',
      interior_design: 'Interior Design',
      graphic_design: 'Graphic Design',
      animation: 'Animation',
      visual_comm: 'Visual Communication',
      film_media: 'Film / Media',
      photography: 'Photography',
      ux_ui: 'UX / UI Design',
      bsc_agriculture: 'B.Sc Agriculture',
      horticulture: 'Horticulture',
      forestry: 'Forestry',
      agri_engineering: 'Agricultural Engineering',
      food_technology: 'Food Technology',
      dairy_technology: 'Dairy Technology',
      fisheries: 'Fisheries',
      bsc_env_science: 'Environmental Science',
      bed: 'B.Ed',
      ba_bed: 'BA B.Ed',
      bsc_bed: 'B.Sc B.Ed',
      beled: 'B.El.Ed',
      special_education: 'Special Education',
      hotel_management: 'Hotel Management',
      hospitality: 'Hospitality',
      tourism: 'Tourism',
      aviation: 'Aviation',
      logistics: 'Logistics',
      event_management: 'Event Management',
      other: 'Other',
      other_engineering: 'Other Engineering',
      other_management: 'Other Management Degree',
      other_science: 'Other Science Degree',
      other_humanities: 'Other Humanities Degree',
      other_law: 'Other Law Degree',
      other_creative: 'Other Creative Degree',
      other_agriculture: 'Other Agriculture Degree',
      other_education: 'Other Education Degree',
    };

    const specNameMap = {
      cse: 'Computer Science & Engineering',
      ai_ml: 'Artificial Intelligence / Machine Learning',
      data_science: 'Data Science',
      it: 'Information Technology',
      cybersecurity: 'Cybersecurity',
      ece: 'Electronics & Communication',
      electrical: 'Electrical / EEE',
      mechanical: 'Mechanical Engineering',
      civil: 'Civil Engineering',
      chemical: 'Chemical Engineering',
      biotech: 'Biotechnology',
      aerospace: 'Aerospace / Aeronautical',
      automobile: 'Automobile Engineering',
      mechatronics: 'Mechatronics',
      robotics: 'Robotics',
      environmental: 'Environmental Engineering',
      other: 'Other',
      general: 'General',
      honours: 'Honours',
      finance: 'Finance',
      business_analytics: 'Business Analytics',
      computer_apps: 'Computer Applications',
      banking_finance: 'Banking & Finance',
      taxation: 'Taxation',
      accounting: 'Accounting',
      marketing: 'Marketing',
      hr: 'Human Resources',
      analytics: 'Business Analytics',
      entrepreneurship: 'Entrepreneurship',
      ib: 'International Business',
      operations: 'Operations',
      logistics_spec: 'Logistics',
      healthcare: 'Healthcare Management',
      ecommerce: 'E-Commerce',
      mathematics: 'Mathematics',
      physics: 'Physics',
      chemistry: 'Chemistry',
      statistics: 'Statistics',
      biology: 'Biology',
      biotechnology: 'Biotechnology',
      microbiology: 'Microbiology',
      biochemistry: 'Biochemistry',
      botany: 'Botany',
      zoology: 'Zoology',
      env_science: 'Environmental Science',
      forensic: 'Forensic Science',
      geology: 'Geology',
      food_science: 'Food Science',
      economics: 'Economics',
      psychology: 'Psychology',
      political_science: 'Political Science',
      sociology: 'Sociology',
      history: 'History',
      english: 'English',
      journalism: 'Journalism',
      mass_comm: 'Mass Communication',
      public_admin: 'Public Administration',
      philosophy: 'Philosophy',
      geography: 'Geography',
      languages: 'Languages',
    };

    const resolvedDegree = degreeNameMap[degreeLabel] || degreeLabel;
    const resolvedSpec = specNameMap[specialization] || specialization;

    if (resolvedDegree) out.currentDegree = resolvedDegree;
    // Only keep a specialization when it actually differs from the degree
    // (degrees without specializations store the degree value as a fallback,
    // which must not surface as "B.Tech in btech").
    if (resolvedSpec && resolvedSpec !== resolvedDegree) {
      out.specialization = resolvedSpec;
    } else {
      out.specialization = '';
    }

    if (answers.field_interest && !answers.interests) {
      out.interests = Array.isArray(answers.field_interest) ? answers.field_interest : [answers.field_interest];
    }
    if (answers.future_goal && !answers.career) {
      const goalCareerMap = {
        start_working: [],
        higher_studies: [],
        specialize: [],
        government: [],
        start_business: [],
        work_abroad: [],
        research: [],
        still_exploring: [],
      };
      out.career = goalCareerMap[answers.future_goal] || [];
    }
  }

  return out;
}

export function getRecommendation(userType, answers = {}) {
  // The assessment stores the normal Graduation journey as "graduation", while
  // this engine's branches speak "graduate". Map it so a Graduation student
  // gets graduate career recommendations and never falls through to the parent
  // default ("A Clear Plan for Your Child's Education").
  if (userType === 'graduation') userType = 'graduate';
  const normalized = normalizeAnswers(userType, answers);
  const context = getStudentContext(userType, normalized);

  if (userType === 'class10') {
    const chosenStream = normalized.stream?.[0];
    if (chosenStream && class10StreamMap[chosenStream]) {
      return { ...recommendations.class10[chosenStream], context };
    }

    const enjoyStreamMap = {
      maths_problems: 'science', understanding_science: 'science',
      computers_tech: 'science', biology_healthcare: 'science',
      business_money: 'commerce', reading_writing: 'arts',
      design_creativity: 'arts', people_society: 'arts',
      practical_hands_on: 'science', still_figuring: 'science',
    };
    const futureWorkStreamMap = {
      building_creating: 'science', technology: 'science',
      medicine_healthcare: 'science', business: 'commerce',
      science_research: 'science', design: 'arts',
      law_public_service: 'arts', media_communication: 'arts',
      agriculture_environment: 'science', practical_field: 'science',
      not_sure: 'science',
    };

    const enjoy = normalized.enjoy || [];
    const futureWork = normalized.future_work;
    const streamCounts = { science: 0, commerce: 0, arts: 0 };

    if (Array.isArray(enjoy)) {
      enjoy.forEach((e) => {
        const s = enjoyStreamMap[e];
        if (s) streamCounts[s]++;
      });
    }

    if (futureWork) {
      const s = futureWorkStreamMap[futureWork];
      if (s) streamCounts[s] += 2;
    }

    const unionOptions = getClass10InterestOptions('not_decided');
    (normalized.interest || []).forEach((val) => {
      const option = unionOptions.find((o) => o.value === val);
      if (option?.stream && option.stream in streamCounts) {
        streamCounts[option.stream]++;
      }
    });

    const top = Object.entries(streamCounts).sort((a, b) => b[1] - a[1])[0];
    const key = top?.[0] || 'science';
    return { ...(recommendations.class10[key] || recommendations.class10.science), context };
  }
  if (userType === 'class12') {
    const rawStream = Array.isArray(normalized.stream) ? normalized.stream?.[0] : normalized.stream;
    if (rawStream === 'not_sure') {
      return { ...getStreamDiscoveryRecommendation(normalized), context };
    }
    const streamKey = rawStream === 'mpc' ? 'science_pcm' : rawStream === 'bipc' ? 'science_pcb' : rawStream || 'science_pcm';
    const base = recommendations.class12[streamKey] || recommendations.class12.science_pcm;
    const interest = Array.isArray(normalized.interest)
      ? normalized.interest?.[0]
      : normalized.interest || normalized.interest_area?.[0] || normalized.thinking_about;
    const qData = class12StreamData[rawStream];
    const chosen = qData
      ? qData.interestOptions.find((o) => o.value === interest)
      : getAfter12FieldOptions(rawStream).find((o) => o.value === interest);
    const key = chosen?.recKey;
    const interestRec = key && base.interests?.[key];
    return { ...(interestRec || base), context };
  }
  if (userType === 'graduate') {
    const degreeLabel = normalized.currentDegree || '';
    const specialization = normalized.specialization || '';
    const profile = getDegreeProfile(degreeLabel, specialization);
    const selectedInterests = normalized.interests || [];
    const selectedSkills = normalized.skills || [];
    const selectedExperience = normalized.experience || [];
    const selectedCareer = normalized.career?.[0];

    if (!profile) {
      const rec = recommendations.graduate.default;
      return { ...rec, context };
    }

    // Label maps for this specific profile
    const skillLabelMap = {};
    Object.values(profile.skills || {}).flat().forEach((s) => {
      skillLabelMap[s.value] = s.label;
    });
    const interestLabelMap = {};
    profile.interests.forEach((i) => { interestLabelMap[i.value] = i.label; });
    const expLabelMap = {};
    (profile.experiences || []).forEach((e) => { expLabelMap[e.value] = e.label; });

    const normalize = (s) => String(s).toLowerCase().trim();
    const selectedSkillLabels = selectedSkills.map((v) => skillLabelMap[v] || v);
    const selectedSkillSet = new Set(selectedSkillLabels.map(normalize));

    // Tokens from selected interests, used to align careers with what the
    // student actually picked in Q2.
    const interestTokens = selectedInterests.flatMap((v) => {
      const label = interestLabelMap[v] || v;
      return label.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
    });

    function interestAlignment(career) {
      const text = `${career.value} ${career.label}`.toLowerCase();
      return interestTokens.reduce(
        (hits, t) => hits + (text.includes(t) ? 1 : 0),
        0,
      );
    }

    // HEALTHCARE TECHNOLOGY EXCEPTION — technology paths appear for clinical
    // degrees ONLY when the student explicitly picks the "Healthcare
    // Technology" interest. Never part of the default medical flow.
    const healthTechSelected = selectedInterests.includes('healthcare_technology');
    const healthTechPaths = [
      { value: 'digital_health', label: 'Digital Health', requiredLabels: ['Data Interpretation', 'Communication', 'Problem Solving'] },
      { value: 'health_informatics', label: 'Health Informatics', requiredLabels: ['Data Interpretation', 'Evidence-Based Medicine', 'Medical Documentation'] },
      { value: 'medical_ai_analytics', label: 'Medical AI & Analytics', requiredLabels: ['Data Interpretation', 'Clinical Reasoning', 'Literature Review'] },
      { value: 'healthcare_analytics_path', label: 'Healthcare Analytics', requiredLabels: ['Data Interpretation', 'Communication', 'Time Management'] },
    ];

    const candidates = profile.careers.map((c) => ({ extra: false, ...c }));
    if (healthTechSelected) {
      candidates.push(...healthTechPaths.map((p) => ({ extra: true, ...p })));
    }

    const careerRecommendations = candidates.map((career) => {
      const requiredLabels = career.extra
        ? career.requiredLabels
        : (profile.requiredSkills && profile.requiredSkills[career.value]
            ? profile.requiredSkills[career.value].map((v) => skillLabelMap[v] || v)
            : []);

      const strongLabels = requiredLabels.filter((l) => selectedSkillSet.has(normalize(l)));
      const strengthenLabels = requiredLabels.filter((l) => !selectedSkillSet.has(normalize(l)));

      // Combined score: demonstrated skills + interest alignment +
      // stated future direction + practical exposure.
      const skillScore = requiredLabels.length > 0
        ? strongLabels.length / requiredLabels.length
        : 0.5;
      const alignment = interestAlignment(career);
      const goalBonus = selectedCareer && career.value === selectedCareer ? 30 : 0;
      const experienceBonus = Math.min(selectedExperience.length * 2, 6);
      const matchScore = Math.round(Math.max(32, Math.min(
        97,
        25 + skillScore * 55 + Math.min(alignment * 7, 14) + goalBonus + experienceBonus,
      )));

      const degreeContext =
        specialization && specialization !== degreeLabel
          ? `Your ${degreeLabel} in ${specialization}`
          : `Your ${degreeLabel}`;

      const whyItMatches = [
        `${degreeContext} aligns well with this path.`,
        selectedInterests.length > 0
          ? `Your interest in ${selectedInterests.map((i) => interestLabelMap[i] || i).join(', ')} is relevant here.`
          : 'This direction builds directly on your degree foundation.',
        strongLabels.length > 0
          ? `You already have: ${strongLabels.join(', ')}.`
          : 'Building the listed skills will make you a strong candidate.',
      ];
      if (selectedExperience.length > 0) {
        whyItMatches.push(
          `Your experience (${selectedExperience.map((e) => expLabelMap[e] || e).join(', ')}) adds practical credibility.`,
        );
      }

      return {
        title: career.label,
        matchScore,
        isGoalCareer: Boolean(selectedCareer && career.value === selectedCareer),
        whyItMatches,
        strongSkills: strongLabels,
        skillsToStrengthen: strengthenLabels,
        relevantExperience: selectedExperience.map((e) => expLabelMap[e] || e),
      };
    });

    // The stated future direction (Q5) leads the ranking; ties break on score.
    careerRecommendations.sort((a, b) => {
      if (a.isGoalCareer !== b.isGoalCareer) return a.isGoalCareer ? -1 : 1;
      return b.matchScore - a.matchScore;
    });

    // Safety net: never drop an explicitly chosen direction out of the top set.
    let topDirections = careerRecommendations.slice(0, 3);
    if (
      selectedCareer &&
      !topDirections.some((r) => r.isGoalCareer)
    ) {
      const chosen = careerRecommendations.find((r) => r.isGoalCareer);
      if (chosen) topDirections = [chosen, ...topDirections.slice(0, 2)];
    }

    const degreeTitle =
      specialization && specialization !== degreeLabel
        ? `${specialization} (${degreeLabel})`
        : degreeLabel;

    const rec = {
      title: `Your ${degreeTitle} Career Direction`,
      description: `Based on your ${degreeTitle} background, interests in ${selectedInterests.map((i) => interestLabelMap[i] || i).join(', ') || 'your field'}, and the skills you\u2019ve built, here are the best career directions for you.`,
      fitSummary: `Personalized to your ${degreeTitle} background${selectedCareer ? ' and your stated goal' : ''}.`,
      whyFits: [
        { label: 'Your degree', copy: `${degreeTitle} gives you a focused foundation in ${profile.family}.` },
        { label: 'Your interests', copy: selectedInterests.length > 0
          ? `You selected ${selectedInterests.map((i) => interestLabelMap[i] || i).join(', ')} as areas that excite you.`
          : 'Your interests have been factored into these recommendations.' },
        { label: 'Your skills', copy: selectedSkills.length > 0
          ? `You already have ${selectedSkills.length} relevant skill(s) to build on.`
          : 'The recommendations account for where you are in your skill development.' },
      ],
      recommendations: topDirections,
      skillGapAnalysis: topDirections[0] || null,
      alternatives: topDirections.slice(1).map((c) => ({
        title: c.title,
        betterFor: `If ${c.title.toLowerCase()} aligns better with your interests.`,
        tradeoff: `Requires: ${c.skillsToStrengthen.length > 0 ? c.skillsToStrengthen.slice(0, 3).join(', ') : 'continued skill development'}.`,
      })),
      tips: [
        'Focus on building the skills that match your top career direction.',
        'Seek experiences (internships, projects, volunteering) that align with your goals.',
        'Network with professionals in your target field.',
        `Continue developing your ${degreeTitle} foundation while exploring your interests.`,
      ],
    };

    return { ...rec, context };
  }
  return { ...recommendations.parent.default, context };
}