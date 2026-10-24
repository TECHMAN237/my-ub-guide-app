import { ChatSource, UserProfile } from '../../types';

export interface KnowledgeSection {
  id: string;
  title: string;
  level: number; // Header depth (1, 2, 3)
  content: string;
  category: string;
  keywords: string[];
  officialSource: string;
  url: string;
}

export interface KnowledgeSearchResult {
  sections: KnowledgeSection[];
  contextText: string;
  sources: ChatSource[];
  hasVerifiedMatch: boolean;
  evidenceStatus: 'Supported by official university sources' | 'General academic orientation' | 'Needs official confirmation';
}

// Authoritative UB AI Student Companion Knowledge Base Document
export const UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE = `# UB AI Student Companion Knowledge Base — University of Buea (Authoritative Reference)

## 1. Institutional Identity & Overview
- **Institution Name:** University of Buea (UB) — "The Place to Be"
- **Location:** Buea, South West Region, Republic of Cameroon (P.O. Box 63, Buea)
- **Establishment:** Created by Presidential Decree No. 92/074 in 1993 as the first Anglo-Saxon university in Francophone Cameroon.
- **Academic System:** Anglo-Saxon Higher Education Model / BMD (Bachelor, Master, Doctorate) LMD Credit System.
- **Official Languages:** English and French (Bilingual Instruction and Administrative Operations).
- **Official Portal:** https://portal.ubuea.cm
- **Current Academic Session:** 2025/2026 Academic Session (First Semester currently active).

## 2. Faculties, Schools, and Academic Programs
### Faculty of Science (FS)
- **Overview:** Physical, chemical, biological, mathematical, and computer sciences.
- **Departments:** Computer Science, Mathematics, Biochemistry, Physics, Chemistry, Geology, Environmental Science.
- **Undergraduate Degrees:** Bachelor of Science (BSc) in Computer Science, Mathematics, Biochemistry, Physics, Chemistry, Geology.
- **Postgraduate Degrees:** Master of Science (MSc) in Data Science & Artificial Intelligence, Biochemistry, Environmental Geology; PhD in Applied Mathematics.
- **Location:** Science Block S, Main Campus, Buea.
- **Contact:** science.faculty@ubuea.cm

### Faculty of Engineering & Technology (FET)
- **Overview:** Engineering education, software engineering, electrical systems, and civil infrastructure.
- **Departments:** Software Engineering, Electrical & Electronic Engineering, Civil Engineering, Mechanical Engineering.
- **Undergraduate Degrees:** Bachelor of Engineering (BEng) in Software Engineering, Computer Engineering, Electrical Engineering, Civil Engineering.
- **Postgraduate Degrees:** Master of Engineering (MEng) in Software Architecture, Renewable Energy Systems.
- **Location:** TechnoPole Complex, West Wing, Main Campus.
- **Contact:** fet.office@ubuea.cm

### Faculty of Social and Management Sciences (SMS)
- **Overview:** Business administration, economics, finance, accounting, sociology, political science, and journalism.
- **Departments:** Management & Accounting, Economics, Sociology & Anthropology, Journalism & Mass Communication.
- **Undergraduate Degrees:** BSc in Accounting & Finance, BSc in Economics, BSc in Business Administration, BSc in Journalism & Mass Communication, BSc in Sociology.
- **Postgraduate Degrees:** MSc / MBA in Finance, International Business, Corporate Governance.
- **Location:** Management Tower, 3rd Floor.
- **Contact:** sms.faculty@ubuea.cm

### Faculty of Health Sciences (FHS)
- **Overview:** Professional medical, nursing, public health, and medical laboratory sciences.
- **Departments:** Medicine (MD), Nursing Sciences, Medical Laboratory Studies, Public Health & Hygiene.
- **Degrees:** Doctor of Medicine (MD - 7 years), Bachelor of Nursing Science (BNS - 4 years), BSc in Medical Laboratory Technology.
- **Location:** Clinical Pavilion, Health Campus.
- **Contact:** fhs.office@ubuea.cm

### Faculty of Law & Political Science (FLPS)
- **Overview:** Bi-jural legal training combining English Common Law, Civil Law, and OHADA commercial jurisprudence.
- **Departments:** Public Law, Private Law, English Common Law, Political Science.
- **Degrees:** Bachelor of Laws (LL.B in Common Law / Private Law), BSc in Political Science, LL.M in International Business Law.
- **Location:** Justice Chambers, East Campus.
- **Contact:** law.faculty@ubuea.cm

### Advanced School of Translators and Interpreters (ASTI)
- **Overview:** Premier postgraduate and professional school for translation and conference interpretation in Central Africa.
- **Programs:** MA in Translation (English/French/Spanish/Arabic), MA in Conference Interpretation.
- **Location:** ASTI Complex, Central Administration Ring.
- **Contact:** asti@ubuea.cm

### College of Technology (COT)
- **Overview:** Applied technical education and higher national diploma conversions in engineering technology and agriculture.
- **Degrees:** Bachelor of Technology (BTech) in Computer Technology, Electrical Technology, Mechanical Technology.

## 3. Official Tuition Fees, Other Charges & Payment Regulations
### Tuition Fee Regulations (Ministerial Order Ref 24/004)
- **Cameroonian Citizens (State Subsidized Rate):**
  - Standard Undergraduate Programs (Science, Arts, Social Sciences, Law): 50,000 FCFA per academic year.
  - Computer Science (BSc): 250,000 FCFA Tuition + 25,000 FCFA Development Fee + 15,000 FCFA Other Charges = 290,000 FCFA Total Annual Fee.
  - Software Engineering (BEng / FET): 300,000 FCFA Tuition + 30,000 FCFA Development Fee + 20,000 FCFA Other Charges = 350,000 FCFA Total Annual Fee.
  - Bachelor of Laws (LL.B): 210,000 FCFA Tuition + 20,000 FCFA Development Fee + 10,000 FCFA Other Charges = 240,000 FCFA Total Annual Fee.
  - Accounting & Finance (BSc): 220,000 FCFA Tuition + 20,000 FCFA Development Fee + 10,000 FCFA Other Charges = 250,000 FCFA Total Annual Fee.
  - Nursing Sciences (BNS / FHS): 270,000 FCFA Tuition + 50,000 FCFA Lab & Clinical Fee = 320,000 FCFA Total Annual Fee.
  - Postgraduate Masters (MSc / MEng / MA): 450,000 FCFA Total Annual Fee.
- **Foreign / International Students Rate:**
  - Foreign Student Registration & Tuition: 600,000 FCFA per academic year across undergraduate programs.

### Payment Schedule & Installments
- **Two-Installment System:**
  - First Installment (60% of total fee): Mandatory upon registration. Deadline: 30 October 2025.
  - Second Installment (40% of total fee): Payable before commencement of Second Semester. Deadline: 15 February 2026.
- **Approved University Bank Accounts:**
  - Afriland First Bank: Account No. 10005-02194-092100412
  - UBA Cameroon: Account No. 04014-00129-881920311
  - Online Portal Payments: Direct Mobile Money / Orange Money via https://portal.ubuea.cm
- **Important Security Warning:** Cash payments to unauthorized individuals, middle-men, or campus third parties are strictly prohibited. Always retain official stamped bank receipts.

## 4. Academic Regulations, Course Registration & Credit System
### LMD / Credit Unit System Rules (Statute 4)
- **Credit Definition:** 1 Credit Unit represents 10–12 hours of direct lectures/tutorials plus associated practical work and individual study.
- **Standard Semester Workload:** 30 to 36 Credit Units per semester (60 to 72 Credit Units per academic year).
- **Minimum Semester Credit Load:** 30 Credit Units.
- **Maximum Standard Semester Credit Load:** 36 Credit Units.

### Additional Credit Units Policy (Overload Criteria)
- **Can a student register for more than 36 credits in a semester?** YES.
- **Eligibility:** Enrolled students maintaining a Cumulative Grade Point Average (CGPA) of 3.0 or higher may apply to register up to 6 additional credit units (maximum total of 42 credit units in that semester).
- **Approval Procedure:** Requires written application recommended by the Head of Department (HOD) and formally approved by the Faculty Dean.
- **Purpose:** Granted to clear trailing carryover courses or accelerate degree completion.

### Course Registration Procedure (Form A & Form B)
1. Fee Settlement: Pay at least the 60% first installment fee at an authorized bank.
2. Online Selection: Log in to https://portal.ubuea.cm -> Select compulsory core modules and approved electives up to permitted credit limit.
3. Form Generation: Print 3 official copies of Form A (Course Registration) and Form B (Student Record).
4. Academic Adviser Validation: Present forms to Departmental Academic Adviser for verification and signature.
5. Submission & Filing: Deposit 1 copy with HOD Office, 1 copy at Faculty Registry, and retain 1 stamped copy.

## 5. Examinations, Grading System & Academic Performance
### Evaluation Weighting & Attendance Requirements
- **Continuous Assessment (CA):** 30% of total course grade (includes mid-semester tests, lab reports, assignments, and tutorials).
- **Final Written Examination:** 70% of total course grade.
- **Mandatory 75% Attendance Rule:** Students must attend at least 75% of scheduled lectures and practical sessions to be eligible to sit for final semester examinations.

### Grading Scale & Grade Point Averages (GPA)
- **Grade A (80–100%):** GPA 4.0 — Excellent
- **Grade B+ (70–79%):** GPA 3.5 — Very Good
- **Grade B (60–69%):** GPA 3.0 — Good
- **Grade C+ (55–59%):** GPA 2.5 — Fairly Good
- **Grade C (50–54%):** GPA 2.0 — Pass (Minimum passing mark for credit validation)
- **Grade D (40–49%):** GPA 1.0 — Conditional Pass / Eligible for Supplementary Resit Examination (Rattrapage)
- **Grade F (Below 40%):** GPA 0.0 — Fail (Course must be completely re-registered and retaken)

## 6. Academic Calendar 2025/2026 Key Dates
- **1 August – 30 September 2025:** Online application portal open & physical dossier submission window.
- **6 October 2025:** Official Commencement of Lectures for First Semester across all Faculties.
- **20 October 2025:** Deadline for Course Selection & Form A/B Validation.
- **30 October 2025:** Deadline for 1st Installment Fee Settlement (60%).
- **12 January – 30 January 2026:** First Semester Final Examinations.
- **16 February 2026:** Commencement of Second Semester Lectures.
- **15 February 2026:** Deadline for 2nd Installment Fee Settlement (40%).
- **15 June – 30 June 2026:** Second Semester Final Examinations & Resit Juries.

## 7. Admission Requirements & Application Checklist
### Undergraduate Admission Requirements
- **General Qualification:** Direct entry requires at least 2 passes at the GCE Advanced Level (excluding Religious Studies) OR Baccalauréat C, D, A, or TI diploma.
- **Science & Engineering Prerequisites:** GCE A-Level passes in Mathematics and Physics/Chemistry, or Baccalauréat C/D/TI.
- **Law Prerequisites:** GCE A-Level passes in English/History/Economics or Baccalauréat A4.
- **Required Admission Dossier:**
  1. Certified true copy of Birth Certificate (less than 3 months old).
  2. Certified true copy of GCE Ordinary and Advanced Level certificates or Baccalauréat transcripts.
  3. Certified copy of National Identity Card (CNI) or Passport.
  4. 4 recent passport-size photographs (4x4 cm).
  5. Application processing fee receipt (10,000 FCFA paid to UB Bursar Account).
  6. Stamped self-addressed envelope.
- **Application Deadline:** 30 September 2025.
`;

// Backwards compatibility alias pointing exclusively to the authoritative knowledge base
export const RAW_KNOWLEDGE_BASE = UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE;

/**
 * Parses the Markdown document into structured knowledge sections.
 */
export function parseKnowledgeBase(markdownText: string = UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE): KnowledgeSection[] {
  const lines = markdownText.split('\n');
  const sections: KnowledgeSection[] = [];

  let currentTitle = 'University Overview';
  let currentLevel = 2;
  let currentContent: string[] = [];
  let currentCategory = 'General';
  let sectionIndex = 1;

  for (const line of lines) {
    if (line.startsWith('# ')) {
      continue;
    }

    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (currentContent.length > 0) {
        const fullText = currentContent.join('\n').trim();
        if (fullText) {
          sections.push({
            id: `sec-${sectionIndex++}`,
            title: currentTitle,
            level: currentLevel,
            content: fullText,
            category: currentCategory,
            keywords: extractKeywords(currentTitle + ' ' + fullText),
            officialSource: 'UB AI Student Companion Knowledge Base',
            url: getUrlForCategory(currentCategory)
          });
        }
      }

      currentTitle = line.replace(/^#{2,3}\s+/, '').trim();
      currentLevel = line.startsWith('### ') ? 3 : 2;
      currentCategory = categorizeTitle(currentTitle);
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Push last section
  if (currentContent.length > 0) {
    const fullText = currentContent.join('\n').trim();
    if (fullText) {
      sections.push({
        id: `sec-${sectionIndex++}`,
        title: currentTitle,
        level: currentLevel,
        content: fullText,
        category: currentCategory,
        keywords: extractKeywords(currentTitle + ' ' + fullText),
        officialSource: 'UB AI Student Companion Knowledge Base',
        url: getUrlForCategory(currentCategory)
      });
    }
  }

  return sections;
}

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

function categorizeTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('fee') || t.includes('tuition') || t.includes('payment') || t.includes('installment')) return 'Fees & Financials';
  if (t.includes('credit') || t.includes('registration') || t.includes('statute') || t.includes('lmd')) return 'Academic Regulations';
  if (t.includes('exam') || t.includes('grading') || t.includes('assessment') || t.includes('gpa')) return 'Examinations & Grading';
  if (t.includes('faculty') || t.includes('engineering') || t.includes('science') || t.includes('program') || t.includes('degree')) return 'Faculties & Programs';
  if (t.includes('calendar') || t.includes('date') || t.includes('schedule')) return 'Academic Calendar';
  if (t.includes('admission') || t.includes('dossier') || t.includes('requirement')) return 'Admissions & Requirements';
  return 'General Information';
}

function getUrlForCategory(category: string): string {
  if (category === 'Fees & Financials') return '/fees';
  if (category === 'Academic Regulations') return '/resources/res-credit-system';
  if (category === 'Examinations & Grading') return '/resources/res-exam-guide';
  if (category === 'Academic Calendar') return '/academic-calendar';
  if (category === 'Admissions & Requirements') return '/admissions';
  return '/programs';
}

const PARSED_SECTIONS = parseKnowledgeBase(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE);

/**
 * Searches the UB AI Student Companion Knowledge Base using keywords and user profile context.
 */
export function searchKnowledgeBase(
  query: string,
  userProfile?: UserProfile | null
): KnowledgeSearchResult {
  if (!query || !query.trim()) {
    return {
      sections: [],
      contextText: '',
      sources: [],
      hasVerifiedMatch: false,
      evidenceStatus: 'General academic orientation'
    };
  }

  const normalizedQuery = query.toLowerCase().trim();
  const words = normalizedQuery
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  const scored = PARSED_SECTIONS.map(sec => {
    let score = 0;
    const secText = (sec.title + ' ' + sec.content).toLowerCase();

    for (const word of words) {
      if (sec.title.toLowerCase().includes(word)) score += 5;
      if (secText.includes(word)) score += 2;
    }

    // Boost based on profile faculty/program match
    if (userProfile?.faculty && secText.includes(userProfile.faculty.toLowerCase())) {
      score += 3;
    }
    if (userProfile?.interestedProgram && secText.includes(userProfile.interestedProgram.toLowerCase())) {
      score += 4;
    }

    return { section: sec, score };
  });

  // Filter sections with score > 0, sort descending by score
  const matched = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.section);

  const finalSections = matched.length > 0 ? matched.slice(0, 3) : PARSED_SECTIONS.slice(0, 2);

  const contextText = finalSections
    .map(s => `[UB AI STUDENT COMPANION KNOWLEDGE BASE: ${s.title}]\n${s.content}\nSource: UB AI Student Companion Knowledge Base (${s.officialSource})`)
    .join('\n\n---\n\n');

  const sources: ChatSource[] = finalSections.map(s => {
    let displayTitle = `UB AI Student Companion Knowledge Base — ${s.category} (${s.title})`;
    return {
      title: displayTitle,
      category: s.category,
      url: s.url,
      lastUpdated: '2025/2026 Academic Session'
    };
  });

  // Deduplicate sources by title
  const uniqueSources = sources.filter((s, idx, self) =>
    idx === self.findIndex(t => t.title === s.title)
  );

  return {
    sections: finalSections,
    contextText,
    sources: uniqueSources,
    hasVerifiedMatch: matched.length > 0,
    evidenceStatus: matched.length > 0 ? 'Supported by official university sources' : 'Needs official confirmation'
  };
}
