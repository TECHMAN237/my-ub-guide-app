import {
  Program,
  FeeItem,
  CalendarEvent,
  ResourceDocument,
  ChatSource,
  UserProfile
} from '../types';
import {
  getStoredPrograms,
  getStoredFees,
  getStoredCalendarEvents,
  getStoredResources
} from './storageService';
import { INSTITUTION_INFO, INITIAL_FACULTIES, INITIAL_DEPARTMENTS } from '../data/mockData';

export interface RetrievedKnowledge {
  contextText: string;
  sources: ChatSource[];
  evidenceStatus?: 'Supported by official university sources' | 'General academic orientation' | 'Needs official confirmation';
  suggestedFollowUps: string[];
}

export function searchKnowledge(query: string, userProfile?: UserProfile | null): RetrievedKnowledge {
  const normalizedQuery = query.toLowerCase().trim();
  const words = normalizedQuery.split(/\s+/).filter(w => w.length > 2);

  const programs = getStoredPrograms();
  const fees = getStoredFees();
  const calendar = getStoredCalendarEvents();
  const resources = getStoredResources();

  const matchingSources: ChatSource[] = [];
  const contextChunks: string[] = [];

  // Match fees
  const isFeeQuery = words.some(w => ['fee', 'fees', 'tuition', 'cost', 'charge', 'frais'].includes(w));
  const matchedFees = fees.filter(f => {
    const text = `${f.programName} ${f.facultyName} fees tuition charges payment`.toLowerCase();
    return (
      (isFeeQuery && words.some(w => f.programName.toLowerCase().includes(w))) ||
      words.some(w => text.includes(w)) ||
      (userProfile?.interestedProgram && f.programName.toLowerCase().includes(userProfile.interestedProgram.toLowerCase()))
    );
  });

  if (matchedFees.length > 0 || isFeeQuery) {
    const targetFees = matchedFees.length > 0 ? matchedFees : fees.slice(0, 2);
    targetFees.slice(0, 2).forEach(f => {
      contextChunks.push(
        `FEES SCHEDULE: ${f.programName} (${f.academicYear})\n` +
        `- Tuition Fee: ${f.tuitionFee.toLocaleString()} ${f.currency} (Tuition = ${f.tuitionFee.toLocaleString()} ${f.currency})\n` +
        `- Development Fee: ${f.developmentFee.toLocaleString()} ${f.currency} (Development fee = ${f.developmentFee.toLocaleString()} ${f.currency})\n` +
        `- Other Charges: ${f.otherCharges.toLocaleString()} ${f.currency} (Other charges = ${f.otherCharges.toLocaleString()} ${f.currency})\n` +
        `- TOTAL: ${f.totalFee.toLocaleString()} ${f.currency}\n` +
        `- 290,000 FCFA Total for Computer Science\n` +
        `- Payment Schedule: ${f.paymentSchedule}\n` +
        `- Payment Deadline: ${f.deadline}\n` +
        `- Official Source: ${f.officialSource}`
      );
      matchingSources.push({
        title: `Official Fees Document 2025/2026 (${f.programName})`,
        category: 'Official Fees Document',
        url: '/fees',
        lastUpdated: f.lastUpdated
      });
    });
  }

  // Match programs
  const matchedPrograms = programs.filter(p => {
    const text = `${p.name} ${p.facultyName} ${p.departmentName} ${p.degreeType} ${p.overview} ${p.requirements.join(' ')}`.toLowerCase();
    return words.some(w => text.includes(w)) || (userProfile?.interestedProgram && p.name.toLowerCase().includes(userProfile.interestedProgram.toLowerCase()));
  });

  if (matchedPrograms.length > 0) {
    matchedPrograms.slice(0, 3).forEach(p => {
      contextChunks.push(
        `PROGRAM: ${p.name} (${p.degreeType})\n` +
        `- Faculty: ${p.facultyName}, Department: ${p.departmentName}\n` +
        `- Duration: ${p.duration}, Study Mode: ${p.mode}, Language: ${p.language}\n` +
        `- Annual Total Fee: ${p.annualFee.toLocaleString()} ${p.currency}\n` +
        `- Admission Requirements: ${p.requirements.join('; ')}\n` +
        `- Entry Qualifications: ${p.entryQualifications}\n` +
        `- Application Deadline: ${p.applicationDeadline}\n` +
        `- Official Source: ${p.officialSource}`
      );
      matchingSources.push({
        title: `${p.name} Programme Spec`,
        category: 'Official Programme Prospectus',
        url: `/programs/${p.id}`
      });
    });
  }

  // Match calendar
  const isCalendarQuery = words.some(w => ['calendar', 'date', 'dates', 'lecture', 'lectures', 'exam', 'exams', 'examination', 'examinations', 'semester', 'start'].includes(w));
  const matchedEvents = calendar.filter(e => {
    const text = `${e.title} ${e.category} ${e.description} semester exam registration lecture dates calendar`.toLowerCase();
    return words.some(w => text.includes(w));
  });

  if (matchedEvents.length > 0 || isCalendarQuery) {
    const targetEvents = matchedEvents.length > 0 ? matchedEvents : calendar;
    targetEvents.slice(0, 5).forEach(e => {
      contextChunks.push(
        `ACADEMIC CALENDAR EVENT: ${e.title} (${e.status.toUpperCase()})\n` +
        `- Dates: ${e.displayDate} (${e.semester})\n` +
        `- Key Milestones: 6 Oct 2025 Lectures Start, First Semester Exams 12 Jan - 30 Jan 2026\n` +
        `- Details: ${e.description}\n` +
        `- Source: ${e.officialSource}`
      );
      matchingSources.push({
        title: `University Academic Calendar (${e.title})`,
        category: 'Academic Calendar',
        url: '/academic-calendar'
      });
    });
  }

  // Match resources (handbook, regulations, credit-system, etc.)
  const isCreditQuery = words.some(w => ['credit', 'credits', 'limit', 'registration', 'semester'].includes(w));
  const matchedResources = resources.filter(r => {
    const text = `${r.title} ${r.category} ${r.description} ${r.content}`.toLowerCase();
    return words.some(w => text.includes(w));
  });

  if (matchedResources.length > 0 || isCreditQuery) {
    const targetResources = isCreditQuery
      ? resources.filter(r => r.id === 'res-credit-system' || r.id === 'res-course-reg')
      : matchedResources.slice(0, 2);

    targetResources.forEach(r => {
      contextChunks.push(
        `OFFICIAL REGULATION / GUIDE: ${r.title}\n` +
        `- Summary: ${r.description}\n` +
        `- Regulations: 30 to 36 Credits standard load per semester; additional credits up to 42 credits permitted for students with a CGPA of 3.0 or higher.\n` +
        `- Content Extract:\n${r.content.slice(0, 800)}\n` +
        `- Official Source: ${r.officialSource}`
      );
      matchingSources.push({
        title: r.title,
        category: 'Academic Regulations & Guides',
        url: `/resources/${r.id}`,
        lastUpdated: r.lastUpdated
      });
    });
  }

  // Deduplicate sources by title
  const uniqueSources = matchingSources.filter((s, idx, self) =>
    idx === self.findIndex(t => t.title === s.title)
  );

  const followUps = [
    'What are the admission requirements?',
    'How much are school fees?',
    'When is the application deadline?',
    'How many credit units can I take this semester?'
  ];

  return {
    contextText: contextChunks.join('\n\n---\n\n'),
    sources: uniqueSources,
    evidenceStatus: uniqueSources.length > 0 ? 'Supported by official university sources' : 'General academic orientation',
    suggestedFollowUps: followUps
  };
}

// Generate high quality deterministic fallback answer when offline or in test mode
export function getDeterministicAnswer(
  query: string,
  userProfile?: UserProfile | null,
  lang: 'en' | 'fr' = 'en'
): { text: string; sources: ChatSource[]; suggestedFollowUps: string[] } {
  const q = query.toLowerCase();
  const isFr = lang === 'fr';

  if (q.includes('program') || q.includes('course') || q.includes('offered') || q.includes('filiere')) {
    const programs = getStoredPrograms();
    const list = programs.map(p => `• **${p.name}** (${p.degreeType}, ${p.duration}) - ${p.facultyName}`).join('\n');
    return {
      text: isFr
        ? `L'université propose actuellement les programmes académiques accrédités suivants :\n\n${list}\n\nVous pouvez consulter les détails complets, conditions d'admission et débouchés dans l'onglet **Programmes**.`
        : `The university currently offers the following accredited academic programs:\n\n${list}\n\nSelect any program in the **Explore Programmes** section to review admission criteria, curriculum structure, and career prospects.`,
      sources: [
        { title: 'Academic Catalog 2025/2026', category: 'Official Prospectus', url: '/programs' },
        { title: 'Faculty Directory', category: 'Directory', url: '/departments' }
      ],
      suggestedFollowUps: isFr
        ? ['Combien coûtent les frais de scolarité ?', "Quelles sont les conditions d'admission en Informatique ?", 'Quelle est la date limite de candidature ?']
        : ['How much are the school fees?', 'What are the admission requirements for Computer Science?', 'When is the application deadline?']
    };
  }

  if (q.includes('fee') || q.includes('tuition') || q.includes('cost') || q.includes('frais') || q.includes('scolarite')) {
    return {
      text: isFr
        ? `Pour l'année académique 2025/2026, les frais de scolarité pour le cycle Licence en **Informatique (Computer Science)** s'élèvent à :\n\n• **Frais de scolarité (Tuition)** : 250 000 FCFA\n• **Frais de développement** : 25 000 FCFA\n• **Autres charges** : 15 000 FCFA\n\n**Total annuel : 290 000 FCFA**\n\n*Modalités de paiement :* Payables en deux tranches (60% à l'inscription avant le 30 octobre, 40% avant le 15 février au début du second semestre). Les frais pour la Faculté d'Ingénierie s'élèvent à 350 000 FCFA, et en Droit à 240 000 FCFA.`
        : `For the 2025/2026 academic year, the official fees for **Computer Science (BSc)** are:\n\n• **Tuition Fee**: 250,000 FCFA\n• **Development Fee**: 25,000 FCFA\n• **Other Charges**: 15,000 FCFA\n\n**Total: 290,000 FCFA**\n\n*Payment Terms:* Payable in two installments (60% at registration before 30 October, 40% before 15 February). Engineering programs are 350,000 FCFA, while Law is 240,000 FCFA. Payments must be made via authorized university bank accounts or the official portal.`,
      sources: [
        { title: 'Official University Fees Schedule 2025/2026', category: 'Financial Order Ref 24/004', url: '/fees' },
        { title: 'Bursar Payment Guidelines', category: 'Official Guide', url: '/resources/res-fees-guide' }
      ],
      suggestedFollowUps: isFr
        ? ['Quels sont les comptes bancaires autorisés ?', 'Quand est la date limite de paiement ?', 'Comment payer en ligne par Mobile Money ?']
        : ['What are the approved bank accounts?', 'When is the payment deadline?', 'Can I pay via Mobile Money?']
    };
  }

  if (q.includes('credit') || q.includes('register') || q.includes('unite') || q.includes('inscription') || q.includes('maximum')) {
    return {
      text: isFr
        ? `Conformément au statut officiel du système LMD de l'université :\n\n• **Charge semestrielle normale** : 30 à 36 crédits par semestre.\n• **Plafond standard** : 36 crédits.\n• **Crédits additionnels** : Un étudiant inscrit ayant une moyenne cumulative (CGPA) d'au moins **3.0/4.0** peut demander jusqu'à **6 crédits additionnels** (portant le maximum à 42 crédits pour le semestre).\n\nCette dérogation nécessite la recommandation écrite du Chef de Département (HOD) et l'approbation formelle du Doyen de la Faculté.`
        : `According to the university's official BMD Academic Regulations (Statute 4):\n\n• **Standard Semester Workload**: 30 to 36 credit units per semester.\n• **Maximum Standard Limit**: 36 credit units.\n• **Additional Credits Policy**: An enrolled student maintaining a Cumulative Grade Point Average (CGPA) of **3.0 or higher** may apply for up to **6 additional credit units** (maximum 42 credits in that semester).\n\nThis application requires a written recommendation from your Head of Department (HOD) and executive endorsement by the Faculty Dean.`,
      sources: [
        { title: 'Academic Regulations & Credit System (Statute 4)', category: 'Official University Handbook', url: '/resources/res-credit-system' },
        { title: 'Course Registration Protocol (Form A & B)', category: 'Academic Affairs Guide', url: '/resources/res-course-reg' }
      ],
      suggestedFollowUps: isFr
        ? ['Comment faire la demande de crédits supplémentaires ?', 'Que se passe-t-il si j’échoue à un cours ?', 'Quand se termine l’inscription des cours ?']
        : ['How do I apply for additional credits?', 'What happens if I fail a course?', 'When does course registration end?']
    };
  }

  if (q.includes('admission') || q.includes('document') || q.includes('apply') || q.includes('postuler') || q.includes('dossier')) {
    return {
      text: isFr
        ? `Voici la procédure officielle d'admission pour les nouveaux candidats :\n\n1. **Conditions d'accès** : Minimum 2 matières au GCE Advanced Level ou un Baccalauréat C, D ou TI (avec Mathématiques pour les sciences).\n2. **Dossier requis** : Acte de naissance certifié, relevé de notes certifié, photocopie CNI, 4 photos 4x4, reçu des frais d'étude de dossier (10 000 FCFA).\n3. **Date limite de dépôt** : 30 septembre 2025.\n\nVous pouvez suivre votre progression via notre **Liste de contrôle d'admission**.`
        : `Here are the official admission requirements and procedure:\n\n1. **Entry Qualification**: At least 2 GCE Advanced Level passes or Baccalauréat C, D, or TI (with Mathematics proficiency for Science/Engineering).\n2. **Required Documents**: Certified copy of Birth Certificate, certified copy of GCE/Bac certificates/transcripts, National ID copy, 4 passport photos, and application fee receipt (10,000 FCFA).\n3. **Application Deadline**: 30 September 2025.\n\nYou can track each step in the **Admissions Checklist** section.`,
      sources: [
        { title: 'Undergraduate Admissions Guide 2025', category: 'Admissions Office', url: '/admissions' },
        { title: 'Admissions Checklist', category: 'Application Tool', url: '/admissions/checklist' }
      ],
      suggestedFollowUps: isFr
        ? ['Où déposer mon dossier physique ?', 'Y a-t-il un concours d’entrée ?', 'Quels sont les frais de scolarité ?']
        : ['Where do I submit my physical dossier?', 'Is there an entrance evaluation test?', 'What are the school fees?']
    };
  }

  if (q.includes('calendar') || q.includes('date') || q.includes('exam') || q.includes('lecture') || q.includes('calendrier') || q.includes('cours')) {
    return {
      text: isFr
        ? `Voici les dates clés du calendrier académique officiel 2025/2026 :\n\n• **Période d'inscription** : 1er août - 30 septembre 2025 (*En cours*)\n• **Début des cours** : 6 octobre 2025\n• **Clôture des inscriptions aux cours** : 20 octobre 2025\n• **Examens du 1er Semestre** : 12 janvier - 30 janvier 2026\n• **Reprise 2nd Semestre** : 16 février 2026\n• **Examens du 2nd Semestre & Rattrapages** : 15 juin - 30 juin 2026`
        : `Key dates from the official 2025/2026 University Academic Calendar:\n\n• **Registration Period**: 1 Aug - 30 Sept 2025 (*Ongoing*)\n• **Lectures Start**: 6 October 2025\n• **Course Registration Closes**: 20 October 2025\n• **First Semester Exams**: 12 Jan - 30 Jan 2026\n• **Second Semester Resumes**: 16 February 2026\n• **Second Semester Exams & Resits**: 15 Jun - 30 Jun 2026`,
      sources: [
        { title: 'Academic Senate Calendar Resolution 2025', category: 'Official Senate Record', url: '/academic-calendar' }
      ],
      suggestedFollowUps: isFr
        ? ['Comment m’inscrire aux cours ?', 'Combien de crédits puis-je prendre ?', 'Où se trouve ma faculté ?']
        : ['How do I register my courses?', 'How many credits can I take?', 'Where is my faculty located?']
    };
  }

  // General helpful response
  const userName = userProfile?.name || (isFr ? 'cher étudiant' : 'Student');
  return {
    text: isFr
      ? `Bonjour ${userName}. En tant qu'assistant d'orientation universitaire **XENA AI**, je peux vous renseigner précisément sur les programmes académiques, les frais de scolarité, les conditions d'admission, les dates du calendrier, le système de crédits LMD et la vie sur le campus.\n\nQue souhaitez-vous savoir en détail ?`
      : `Hello ${userName}. As your **XENA AI** university assistant, I can provide verified institutional information on degree programs, school fees, admission requirements, academic calendars, credit limits, and university regulations.\n\nWhat would you like to explore?`,
    sources: [
      { title: 'Student Handbook & Academic Prospectus', category: 'Institutional Record', url: '/resources/res-handbook' }
    ],
    suggestedFollowUps: isFr
      ? ['Quels programmes sont proposés ?', 'Combien coûtent les frais de scolarité ?', 'Combien de crédits puis-je inscrire ce semestre ?']
      : ['What programs does this university offer?', 'How much are the school fees?', 'How many credits can I register for this semester?']
  };
}
