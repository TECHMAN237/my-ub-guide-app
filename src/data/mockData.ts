import { Faculty, Department, Program, FeeItem, CalendarEvent, ResourceDocument, ChecklistItem, NotificationItem } from '../types';

export const INSTITUTION_INFO = {
  name: 'Cameroon University Institute',
  shortName: 'UniGuide AI / XENA',
  academicYear: '2025/2026',
  currentSemester: 'First Semester',
  description: 'A premier bilingual higher education institution dedicated to academic excellence, innovation, and leadership.',
  address: 'Campus Plateau, P.O. Box 450, Yaoundé / Buea',
  contactEmail: 'admissions@uniguide.edu.cm',
  phone: '+237 222 23 45 67',
  emergencyPhone: '+237 670 00 11 22',
  portalUrl: 'https://portal.uniguide.edu.cm',
};

export const INITIAL_FACULTIES: Faculty[] = [
  {
    id: 'fac-science',
    name: 'Faculty of Science',
    description: 'Pioneering scientific discovery, computational sciences, biotechnology, and mathematics.',
    iconName: 'Atom',
    programsCount: 8,
    departments: ['Computer Science', 'Mathematics', 'Biochemistry', 'Physics'],
    contactEmail: 'science.faculty@uniguide.edu.cm',
    officeLocation: 'Block S, Ground Floor, Main Campus'
  },
  {
    id: 'fac-engineering',
    name: 'Faculty of Engineering',
    description: 'Transforming theoretical principles into real-world technological solutions and infrastructure.',
    iconName: 'Cpu',
    programsCount: 6,
    departments: ['Software Engineering', 'Electrical & Electronic Engineering', 'Civil Engineering'],
    contactEmail: 'engineering@uniguide.edu.cm',
    officeLocation: 'TechnoPole Complex, West Wing'
  },
  {
    id: 'fac-arts',
    name: 'Faculty of Arts',
    description: 'Nurturing bilingual culture, literature, linguistics, history, and communication sciences.',
    iconName: 'BookOpen',
    programsCount: 7,
    departments: ['English & Modern Letters', 'Bilingual Letters', 'History & African Studies'],
    contactEmail: 'arts.letters@uniguide.edu.cm',
    officeLocation: 'Humanities Hall, Level 2'
  },
  {
    id: 'fac-social-mgmt',
    name: 'Faculty of Social and Management Sciences',
    description: 'Equipping future leaders in business administration, economics, finance, and governance.',
    iconName: 'Briefcase',
    programsCount: 5,
    departments: ['Economics', 'Management & Accounting', 'Sociology'],
    contactEmail: 'sms.faculty@uniguide.edu.cm',
    officeLocation: 'Management Tower, 3rd Floor'
  },
  {
    id: 'fac-law',
    name: 'Faculty of Law',
    description: 'Dedicated to legal jurisprudence, human rights, public policy, and corporate legal practice.',
    iconName: 'Scale',
    programsCount: 4,
    departments: ['Public Law', 'Private & Business Law', 'English Common Law'],
    contactEmail: 'law.school@uniguide.edu.cm',
    officeLocation: 'Justice Chambers, East Campus'
  },
  {
    id: 'fac-health',
    name: 'Faculty of Health Sciences',
    description: 'Educating compassionate medical professionals, nurses, and clinical research scientists.',
    iconName: 'HeartPulse',
    programsCount: 6,
    departments: ['Nursing Sciences', 'Medical Laboratory Technology', 'Public Health'],
    contactEmail: 'health.sciences@uniguide.edu.cm',
    officeLocation: 'Clinical Pavilion, Health Campus'
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-cs',
    name: 'Computer Science',
    facultyId: 'fac-science',
    facultyName: 'Faculty of Science',
    overview: 'The Department of Computer Science trains students in software development, data science, artificial intelligence, and network architecture.',
    headOfDepartment: 'Prof. Tanyi Bernard (PhD, Stanford)',
    location: 'Science Block S, Room 204',
    contactEmail: 'cs.dept@uniguide.edu.cm',
    programs: ['Computer Science BSc', 'Data Science & AI MSc']
  },
  {
    id: 'dept-se',
    name: 'Software Engineering',
    facultyId: 'fac-engineering',
    facultyName: 'Faculty of Engineering',
    overview: 'Rigorous engineering of complex distributed software, cloud infrastructure, and cyber-physical systems.',
    headOfDepartment: 'Dr. Marie Ngo (PhD, EPFL)',
    location: 'TechnoPole Block B, Room 112',
    contactEmail: 'software.eng@uniguide.edu.cm',
    programs: ['Software Engineering BEng', 'Software Systems MEng']
  },
  {
    id: 'dept-law',
    name: 'Public & Business Law',
    facultyId: 'fac-law',
    facultyName: 'Faculty of Law',
    overview: 'Comprehensive legal education combining civil law and common law systems applicable across CEMAC and global jurisdictions.',
    headOfDepartment: 'Barrister Dr. Samuel Fon',
    location: 'Justice Chambers, Room 301',
    contactEmail: 'law.dept@uniguide.edu.cm',
    programs: ['Bachelor of Laws (LL.B)', 'Commercial Law Master']
  },
  {
    id: 'dept-mgmt',
    name: 'Management & Accounting',
    facultyId: 'fac-social-mgmt',
    facultyName: 'Faculty of Social and Management Sciences',
    overview: 'Professional business curriculum preparing certified accountants, financial analysts, and corporate managers.',
    headOfDepartment: 'Dr. Clarisse Ewane',
    location: 'Management Tower, Room 405',
    contactEmail: 'mgmt.dept@uniguide.edu.cm',
    programs: ['BSc Accounting & Finance', 'MBA Strategic Management']
  },
  {
    id: 'dept-nursing',
    name: 'Nursing Sciences',
    facultyId: 'fac-health',
    facultyName: 'Faculty of Health Sciences',
    overview: 'State-accredited clinical nursing program integrated with university teaching hospital rotations.',
    headOfDepartment: 'Prof. Helen Besong',
    location: 'Clinical Pavilion, Wing C',
    contactEmail: 'nursing.dept@uniguide.edu.cm',
    programs: ['Bachelor of Nursing Sciences (BNS)', 'MSc Public Health Nursing']
  }
];

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'prog-cs',
    name: 'Computer Science',
    facultyId: 'fac-science',
    facultyName: 'Faculty of Science',
    departmentId: 'dept-cs',
    departmentName: 'Computer Science',
    level: 'undergraduate',
    degreeType: 'BSc (Bachelor of Science)',
    duration: '3 years',
    language: 'English / French',
    mode: 'Regular / Evening',
    overview: 'Computer Science trains students in software development, data science, artificial intelligence, algorithms, and cybersecurity.',
    description: 'The curriculum covers foundation programming, discrete mathematics, computer architecture, databases, systems programming, and modern machine learning. Students complete capstone projects with industrial partners in their final year.',
    requirements: [
      'GCE Advanced Level in at least 2 subjects including Mathematics or Physics, OR Baccalauréat C, D, or TI',
      'At least 4 GCE Ordinary Level passes including English and Mathematics at Grade C or above',
      'Pass mark in the University Entrance Evaluation Test (UEET)',
      'Certified copy of birth certificate and national identity card'
    ],
    entryQualifications: 'GCE A/L (2 papers min) or Bac C/D/TI with Mathematics proficiency',
    annualFee: 290000,
    currency: 'FCFA',
    careerOpportunities: [
      'Full-Stack Software Engineer',
      'Data Analyst & ML Specialist',
      'Cybersecurity & Network Administrator',
      'Systems Architect'
    ],
    applicationDeadline: '30 September 2025',
    officialSource: 'Faculty of Science Academic Prospectus 2025/2026'
  },
  {
    id: 'prog-se',
    name: 'Software Engineering',
    facultyId: 'fac-engineering',
    facultyName: 'Faculty of Engineering',
    departmentId: 'dept-se',
    departmentName: 'Software Engineering',
    level: 'undergraduate',
    degreeType: 'BEng (Bachelor of Engineering)',
    duration: '4 years',
    language: 'English',
    mode: 'Regular',
    overview: 'Engineering-focused degree emphasizing scalable software systems, DevOps, mobile engineering, and project management.',
    description: 'Combines rigorous electrical/computer engineering fundamentals with agile software construction, quality assurance, cloud architecture, and embedded systems.',
    requirements: [
      'GCE Advanced Level in Mathematics and Physics at Grade C or higher, OR Baccalauréat C or E',
      'GCE O/L passes in 5 subjects including Mathematics, English, and Physics',
      'Successful written and oral engineering screening test'
    ],
    entryQualifications: 'GCE A/L Mathematics & Physics or Bac C/E',
    annualFee: 350000,
    currency: 'FCFA',
    careerOpportunities: [
      'Cloud & Infrastructure Engineer',
      'Lead Mobile & Web Developer',
      'DevOps Architect',
      'Embedded Systems Engineer'
    ],
    applicationDeadline: '25 September 2025',
    officialSource: 'Faculty of Engineering Handbook'
  },
  {
    id: 'prog-law',
    name: 'Bachelor of Laws (LL.B)',
    facultyId: 'fac-law',
    facultyName: 'Faculty of Law',
    departmentId: 'dept-law',
    departmentName: 'Public & Business Law',
    level: 'undergraduate',
    degreeType: 'LL.B (Bachelor of Laws)',
    duration: '3 years',
    language: 'English / French',
    mode: 'Regular / Evening',
    overview: 'Bi-jural legal training covering Cameroon penal law, civil obligations, English common law, OHADA commercial law, and international arbitration.',
    description: 'Equips aspiring advocates, legal counsels, and magistrates with critical statutory analysis, moot court training, and human rights advocacy skills.',
    requirements: [
      'GCE Advanced Level in at least 2 Arts or Social Science subjects, OR Baccalauréat A or ABI',
      'GCE O/L passes in English and French languages'
    ],
    entryQualifications: 'GCE A/L (2 papers) or Baccalauréat A4/ABI',
    annualFee: 240000,
    currency: 'FCFA',
    careerOpportunities: [
      'Corporate Legal Counsel',
      'Magistrate / State Prosecutor',
      'Human Rights Advocate',
      'International NGO Legal Officer'
    ],
    applicationDeadline: '30 September 2025',
    officialSource: 'Faculty of Law Bulletin'
  },
  {
    id: 'prog-acct',
    name: 'Accounting & Finance',
    facultyId: 'fac-social-mgmt',
    facultyName: 'Faculty of Social and Management Sciences',
    departmentId: 'dept-mgmt',
    departmentName: 'Management & Accounting',
    level: 'undergraduate',
    degreeType: 'BSc (Bachelor of Science)',
    duration: '3 years',
    language: 'English / French',
    mode: 'Regular / Evening',
    overview: 'Comprehensive preparation for corporate accounting, tax consulting, internal audit, investment banking, and ACCA/CIMA professional tracks.',
    description: 'Focuses on financial reporting under OHADA and IFRS standards, corporate finance, taxation, managerial accounting, and econometric modeling.',
    requirements: [
      'GCE Advanced Level with 2 passes including Economics, Mathematics, or Accounting, OR Baccalauréat G2/G3/SES',
      'Pass mark in O/L Mathematics and English'
    ],
    entryQualifications: 'GCE A/L Economics/Maths or Bac G2/G3',
    annualFee: 250000,
    currency: 'FCFA',
    careerOpportunities: [
      'Certified Public Accountant (CPA)',
      'Financial Analyst & Portfolio Manager',
      'Tax & Compliance Consultant',
      'Internal Auditor'
    ],
    applicationDeadline: '30 September 2025',
    officialSource: 'SMS Faculty Academic Regulations'
  },
  {
    id: 'prog-nursing',
    name: 'Nursing Sciences',
    facultyId: 'fac-health',
    facultyName: 'Faculty of Health Sciences',
    departmentId: 'dept-nursing',
    departmentName: 'Nursing Sciences',
    level: 'undergraduate',
    degreeType: 'BNS (Bachelor of Nursing Sciences)',
    duration: '4 years',
    language: 'English / French',
    mode: 'Regular (Full-time Clinical)',
    overview: 'Clinical nursing and patient care education integrating 1,600+ hours of hospital rotations across surgery, pediatrics, and public health.',
    description: 'Accredited by the Ministry of Higher Education and Ministry of Public Health. Prepares graduates for direct licensing by the National Nursing Council.',
    requirements: [
      'GCE Advanced Level in Biology and Chemistry at Grade C or better, OR Baccalauréat D or C',
      'Pass in Competitive Entrance Exam and Medical Fitness Fitness Screening'
    ],
    entryQualifications: 'GCE A/L Biology & Chemistry or Bac D',
    annualFee: 320000,
    currency: 'FCFA',
    careerOpportunities: [
      'Registered Clinical Nurse',
      'Intensive Care Unit (ICU) Specialist',
      'Community Health Coordinator',
      'Clinical Research Nurse'
    ],
    applicationDeadline: '20 September 2025',
    officialSource: 'Health Sciences Admissions Committee'
  },
  {
    id: 'prog-msc-ai',
    name: 'Data Science & Artificial Intelligence',
    facultyId: 'fac-science',
    facultyName: 'Faculty of Science',
    departmentId: 'dept-cs',
    departmentName: 'Computer Science',
    level: 'postgraduate',
    degreeType: 'MSc (Master of Science)',
    duration: '2 years',
    language: 'English',
    mode: 'Regular / Weekend Hybrid',
    overview: 'Advanced postgraduate research and applied specialization in Deep Learning, Large Language Models, Computer Vision, and Big Data Engineering.',
    description: 'Geared towards computer science and engineering graduates seeking cutting-edge mastery in machine intelligence, neural networks, and scalable AI infrastructure.',
    requirements: [
      'BSc or BEng in Computer Science, Software Engineering, Mathematics, or Electrical Engineering with at least Second Class Honours (GPA >= 3.0/4.0)',
      'Statement of Purpose and 2 academic referee letters'
    ],
    entryQualifications: 'BSc Computer Science or equivalent (min GPA 3.0)',
    annualFee: 450000,
    currency: 'FCFA',
    careerOpportunities: [
      'AI Research Scientist',
      'Senior Machine Learning Engineer',
      'Data Architect',
      'Quantitative Analytics Specialist'
    ],
    applicationDeadline: '15 October 2025',
    officialSource: 'School of Postgraduate Studies Regulations'
  }
];

export const INITIAL_FEES: FeeItem[] = [
  {
    id: 'fee-cs',
    programId: 'prog-cs',
    programName: 'Computer Science',
    facultyName: 'Faculty of Science',
    level: 'undergraduate',
    academicYear: '2025/2026',
    currency: 'FCFA',
    tuitionFee: 250000,
    developmentFee: 25000,
    otherCharges: 15000,
    totalFee: 290000,
    paymentSchedule: 'Two installments: 60% upon registration (before 30 Oct), 40% before start of 2nd semester (before 15 Feb)',
    deadline: 'First installment: 30 October 2025; Second installment: 15 February 2026',
    officialSource: 'Official University Fees Document 2025/2026 - Ministerial Order Ref 24/004',
    lastUpdated: '15 July 2025'
  },
  {
    id: 'fee-se',
    programId: 'prog-se',
    programName: 'Software Engineering',
    facultyName: 'Faculty of Engineering',
    level: 'undergraduate',
    academicYear: '2025/2026',
    currency: 'FCFA',
    tuitionFee: 300000,
    developmentFee: 30000,
    otherCharges: 20000,
    totalFee: 350000,
    paymentSchedule: 'Two installments: 60% before 30 Oct, 40% before 15 Feb',
    deadline: '30 October 2025',
    officialSource: 'Faculty of Engineering Finance Committee',
    lastUpdated: '20 July 2025'
  },
  {
    id: 'fee-law',
    programId: 'prog-law',
    programName: 'Bachelor of Laws (LL.B)',
    facultyName: 'Faculty of Law',
    level: 'undergraduate',
    academicYear: '2025/2026',
    currency: 'FCFA',
    tuitionFee: 210000,
    developmentFee: 20000,
    otherCharges: 10000,
    totalFee: 240000,
    paymentSchedule: '50% at registration, 50% at beginning of semester 2',
    deadline: '30 October 2025',
    officialSource: 'Faculty of Law Circular 2025',
    lastUpdated: '10 July 2025'
  },
  {
    id: 'fee-acct',
    programId: 'prog-acct',
    programName: 'Accounting & Finance',
    facultyName: 'Faculty of Social and Management Sciences',
    level: 'undergraduate',
    academicYear: '2025/2026',
    currency: 'FCFA',
    tuitionFee: 220000,
    developmentFee: 20000,
    otherCharges: 10000,
    totalFee: 250000,
    paymentSchedule: 'Two installments: 60% before 30 Oct, 40% before 15 Feb',
    deadline: '30 October 2025',
    officialSource: 'SMS Faculty Financial Regulations',
    lastUpdated: '15 July 2025'
  },
  {
    id: 'fee-nursing',
    programId: 'prog-nursing',
    programName: 'Nursing Sciences',
    facultyName: 'Faculty of Health Sciences',
    level: 'undergraduate',
    academicYear: '2025/2026',
    currency: 'FCFA',
    tuitionFee: 270000,
    developmentFee: 30000,
    otherCharges: 20000,
    totalFee: 320000,
    paymentSchedule: 'Clinical lab & insurance fee (50,000 FCFA) plus tuition in two installments',
    deadline: '20 October 2025',
    officialSource: 'Health Sciences Dean Office Order',
    lastUpdated: '12 July 2025'
  },
  {
    id: 'fee-msc-ai',
    programId: 'prog-msc-ai',
    programName: 'Data Science & Artificial Intelligence (MSc)',
    facultyName: 'Faculty of Science',
    level: 'postgraduate',
    academicYear: '2025/2026',
    currency: 'FCFA',
    tuitionFee: 380000,
    developmentFee: 40000,
    otherCharges: 30000,
    totalFee: 450000,
    paymentSchedule: '50% upon matriculation, 50% prior to second semester thesis registration',
    deadline: '15 November 2025',
    officialSource: 'Postgraduate School Tuition Scale',
    lastUpdated: '01 August 2025'
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Registration Period',
    category: 'registration',
    startDate: '2025-08-01',
    endDate: '2025-09-30',
    displayDate: '1 Aug - 30 Sept 2025',
    semester: 'First Semester',
    academicYear: '2025/2026',
    status: 'ongoing',
    description: 'Online and on-campus academic registration, file submission, medical checkup, and biometric student card capture.',
    officialSource: 'University Academic Senate Calendar Resolution 2025'
  },
  {
    id: 'cal-2',
    title: 'Lectures Start',
    category: 'lectures',
    startDate: '2025-10-06',
    displayDate: '6 Oct 2025',
    semester: 'First Semester',
    academicYear: '2025/2026',
    status: 'upcoming',
    description: 'Official commencement of lectures and practical laboratory sessions across all faculties.',
    officialSource: 'Office of the Vice-Chancellor'
  },
  {
    id: 'cal-3',
    title: 'Course Registration Ends',
    category: 'registration',
    startDate: '2025-10-20',
    displayDate: '20 Oct 2025',
    semester: 'First Semester',
    academicYear: '2025/2026',
    status: 'upcoming',
    description: 'Strict deadline for online course selection (form submission). Late registration requires written authorization and penalty fee.',
    officialSource: 'Department of Academic Affairs'
  },
  {
    id: 'cal-4',
    title: 'First Semester Exams',
    category: 'exams',
    startDate: '2026-01-12',
    endDate: '2026-01-30',
    displayDate: '12 Jan - 30 Jan 2026',
    semester: 'First Semester',
    academicYear: '2025/2026',
    status: 'upcoming',
    description: 'First Semester examination period. Students must present official exam card and national identity card.',
    officialSource: 'Central Examinations Board'
  },
  {
    id: 'cal-5',
    title: 'Second Semester Start',
    category: 'lectures',
    startDate: '2026-02-16',
    displayDate: '16 Feb 2026',
    semester: 'Second Semester',
    academicYear: '2025/2026',
    status: 'upcoming',
    description: 'Resumption of lectures for the second semester after the mid-year examination break.',
    officialSource: 'Academic Senate Circular'
  },
  {
    id: 'cal-6',
    title: 'Second Semester Exams & Resits',
    category: 'exams',
    startDate: '2026-06-15',
    endDate: '2026-06-30',
    displayDate: '15 Jun - 30 Jun 2026',
    semester: 'Second Semester',
    academicYear: '2025/2026',
    status: 'upcoming',
    description: 'Final semester examinations, evaluation juries, and supplementary resit sessions (Rattrapage).',
    officialSource: 'Central Examinations Board'
  }
];

export const INITIAL_RESOURCES: ResourceDocument[] = [
  {
    id: 'res-handbook',
    title: 'Student Handbook',
    category: 'handbook',
    description: 'Rules, regulations, campus conduct, disciplinary code, and university life policies.',
    content: `# Student Handbook & General Regulations\n\n## 1. General Principles\nStudents of Cameroon University Institute are expected to maintain the highest standards of integrity, civility, and scholarship.\n\n## 2. Campus Identity & Security\n- The University Student ID card must be worn or carried at all times within campus gates.\n- Loss of ID card must be reported immediately to the Dean of Students Affairs.\n\n## 3. Disciplinary Provisions\n- Examination malpractice leads to immediate suspension and possible expulsion following disciplinary committee hearings.\n- Destruction of university property will incur financial restitution and disciplinary action.`,
    fileFormat: 'PDF Document',
    downloadSize: '2.4 MB',
    lastUpdated: 'August 2025',
    officialSource: 'Office of Dean of Students Affairs'
  },
  {
    id: 'res-fees-guide',
    title: 'School Fees Guide',
    category: 'fees',
    description: 'Step-by-step payment procedures, bank account details, installment plans, and refund policies.',
    content: `# School Fees Payment Procedure\n\n## Official Bank Payment Channels\nAll school fees must be paid strictly through authorized banking partners or the University Online MoMo/Orange Money Portal.\n\n1. **Afriland First Bank**: Account No. 10005-02194-092100412\n2. **UBA Cameroon**: Account No. 04014-00129-881920311\n3. **Online Mobile Portal**: Pay directly through the student portal with automated receipt generation.\n\n## Warning\nNever pay fees in cash to any individual or unofficial intermediary. Always verify that your student registration number is correctly printed on the bank deposit slip.`,
    fileFormat: 'PDF Guide',
    downloadSize: '1.1 MB',
    lastUpdated: 'July 2025',
    officialSource: 'Bursar & Treasury Department'
  },
  {
    id: 'res-course-reg',
    title: 'Course Registration Guide',
    category: 'registration',
    description: 'How to register your courses, validate course forms (Form A/B), and solve portal glitches.',
    content: `# Course Registration Protocol (Form A & B)\n\n## Step 1: Fee Clearance\nEnsure your first installment fee payment is verified on your student portal (usually reflected within 24 hours of payment).\n\n## Step 2: Course Selection\nLog in to portal.uniguide.edu.cm > Academic Services > Course Registration.\nSelect all compulsory core courses for your current level and semester, plus required electives up to the permitted credit limit.\n\n## Step 3: Academic Adviser Verification\nPrint 3 copies of your provisional course form and present them to your Departmental Academic Adviser for signature.\n\n## Step 4: Submission\nDeposit one copy at the Faculty Registry, one with your HOD, and keep one stamped copy for yourself.`,
    fileFormat: 'Interactive PDF',
    downloadSize: '1.8 MB',
    lastUpdated: 'September 2025',
    officialSource: 'Academic Registrar'
  },
  {
    id: 'res-credit-system',
    title: 'Credit System Guide',
    category: 'credit-system',
    description: 'Credit values, semester limits, prerequisites, additional credits criteria, and GPA calculation.',
    content: `# The BMD Credit System & Academic Regulations\n\n## What is an Academic Credit?\n1 Credit Unit corresponds to approximately 10 to 12 hours of lectures/tutorials plus self-directed study and practical assignments.\n\n## Standard Semester Credit Limits\n- **Minimum Load**: 30 Credits per semester (60 Credits per academic year).\n- **Standard Maximum Load**: 36 Credits per semester.\n\n## Additional Credits Policy\nCan an enrolled student register for more than 36 credits?\n- **Yes**, under strict conditions. An enrolled student with a Cumulative Grade Point Average (CGPA) of **3.0 or higher** may apply for up to **6 additional credits** (maximum 42 credits in total for that semester).\n- The application requires written recommendation from the Head of Department (HOD) and final approval from the Dean of Faculty.\n- Additional credits are generally granted to clear trailing carryover courses or accelerate graduation.\n\n## Grading Scale\n- A: 80 - 100% (GPA 4.0)\n- B+: 70 - 79% (GPA 3.5)\n- B: 60 - 69% (GPA 3.0)\n- C+: 55 - 59% (GPA 2.5)\n- C: 50 - 54% (GPA 2.0 - Pass Mark)\n- D: 40 - 49% (GPA 1.0 - Resit eligible)\n- F: Below 40% (Fail - Must retake course)`,
    fileFormat: 'PDF Guide',
    downloadSize: '1.5 MB',
    lastUpdated: 'August 2025',
    officialSource: 'University Academic Regulations Handbook (Statute 4)'
  },
  {
    id: 'res-exam-guide',
    title: 'Examination Guide',
    category: 'exams',
    description: 'Examinations, Continuous Assessment (CA) weightings, grading, resits (rattrapage), and transcripts.',
    content: `# Examination & Assessment Regulations\n\n## Assessment Weights\n- **Continuous Assessment (CA)**: 30% (Tests, laboratory works, attendance, assignments).\n- **Final Examination**: 70% (Closed-book written paper).\n\n## Minimum Attendance Requirement\nStudents must attend at least 75% of scheduled lectures and laboratory sessions to be permitted into the final examination.\n\n## Supplementary Exams (Resits / Rattrapage)\nStudents who score between 40% and 49% in Continuous Assessment + Exam are eligible for the supplementary resit examination in June. Scoring below 40% requires re-registering and retaking the full course in the subsequent academic year.`,
    fileFormat: 'PDF Guide',
    downloadSize: '1.2 MB',
    lastUpdated: 'July 2025',
    officialSource: 'Central Examinations Office'
  },
  {
    id: 'res-housing',
    title: 'Accommodation Guide',
    category: 'accommodation',
    description: 'Hostels, on-campus halls of residence, accredited private student lodges, and rates.',
    content: `# University Accommodation & Housing Services\n\n## On-Campus Residence Halls\n- **Hall of Unity (Female)**: 120 rooms, double occupancy. 150,000 FCFA/year.\n- **Hall of Excellence (Male)**: 140 rooms, double occupancy. 150,000 FCFA/year.\n\n## Booking Window\nApplication opens on 10 August and closes on 15 September each academic year. Priority is given to Level 100 freshers, international students, and students with documented medical conditions.`,
    fileFormat: 'PDF Document',
    downloadSize: '950 KB',
    lastUpdated: 'August 2025',
    officialSource: 'Student Welfare & Housing Directorate'
  }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'chk-1', title: 'Review available programs', description: 'Explore faculties, degrees, and career paths matching your qualifications.', completed: true },
  { id: 'chk-2', title: 'Confirm admission requirements', description: 'Check required subjects (e.g. Mathematics, Physics, Biology) and minimum grades.', completed: true },
  { id: 'chk-3', title: 'Gather required documents', description: 'Certified copies of Birth Certificate, GCE / Bac results, ID card, passport photos.', completed: false },
  { id: 'chk-4', title: 'Check application deadline', description: 'Ensure submission before 30 September 2025 for regular admissions.', completed: false },
  { id: 'chk-5', title: 'Complete application form', description: 'Fill the online admission form with accurate personal and academic data.', completed: false },
  { id: 'chk-6', title: 'Pay application fee', description: 'Pay the non-refundable 10,000 FCFA processing fee via portal or partner bank.', completed: false },
  { id: 'chk-7', title: 'Submit application packet', description: 'Submit digital application and deposit physical dossier at Faculty registry.', completed: false },
  { id: 'chk-8', title: 'Track admission outcome', description: 'Monitor SMS and portal announcements for the official admission list.', completed: false }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Registration Period Ongoing',
    message: 'Academic registration for the 2025/2026 session is actively open until 30 September 2025.',
    date: 'Today',
    read: false,
    type: 'calendar',
    actionRoute: '/academic-calendar'
  },
  {
    id: 'notif-2',
    title: 'Lectures Kickoff on 6 October',
    message: 'All faculties will commence lectures on Monday, 6 October 2025. Please finalize course forms.',
    date: 'Yesterday',
    read: false,
    type: 'academic',
    actionRoute: '/academic-calendar'
  },
  {
    id: 'notif-3',
    title: 'Updated 2025/2026 School Fees Schedule',
    message: 'Official fee breakdown has been published. Verify payment deadlines for your faculty.',
    date: '3 days ago',
    read: true,
    type: 'resource',
    actionRoute: '/fees'
  }
];
