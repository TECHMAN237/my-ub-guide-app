export type UserCategory = 'prospective' | 'enrolled';

export type Language = 'en' | 'fr';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: UserCategory;
  language: Language;
  // Prospective fields
  interestedStudyLevel?: 'undergraduate' | 'postgraduate' | 'certificate';
  interestedFaculty?: string;
  interestedDepartment?: string;
  interestedProgram?: string;
  studyMode?: 'regular' | 'evening' | 'online';
  intendedAdmissionYear?: string;
  // Enrolled fields
  institution?: string;
  studentId?: string;
  faculty?: string;
  department?: string;
  level?: 'Level 100' | 'Level 200' | 'Level 300' | 'Level 400' | 'Level 500' | string;
  degreeProgram?: string;
  academicYear?: string;
  semester?: 'First Semester' | 'Second Semester' | string;
  campus?: string;
}

export interface Program {
  id: string;
  name: string;
  facultyId: string;
  facultyName: string;
  departmentId: string;
  departmentName: string;
  level: 'undergraduate' | 'postgraduate';
  degreeType: string; // e.g. BSc (Bachelor of Science), MSc, PhD
  duration: string; // e.g. 3 years, 4 years
  language: string; // e.g. English / French
  mode: string; // Regular / Evening
  overview: string;
  description: string;
  requirements: string[];
  entryQualifications: string;
  annualFee: number;
  currency: string;
  careerOpportunities: string[];
  applicationDeadline: string;
  officialSource: string;
}

export interface Faculty {
  id: string;
  name: string;
  description: string;
  iconName: string;
  programsCount: number;
  departments: string[];
  contactEmail: string;
  officeLocation: string;
}

export interface Department {
  id: string;
  name: string;
  facultyId: string;
  facultyName: string;
  overview: string;
  headOfDepartment: string;
  location: string;
  contactEmail: string;
  programs: string[];
}

export interface FeeItem {
  id: string;
  programId?: string;
  programName: string;
  facultyName: string;
  level: 'undergraduate' | 'postgraduate';
  academicYear: string;
  currency: string;
  tuitionFee: number;
  developmentFee: number;
  otherCharges: number;
  totalFee: number;
  paymentSchedule: string;
  deadline: string;
  officialSource: string;
  lastUpdated: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  category: 'registration' | 'lectures' | 'exams' | 'fees' | 'holiday' | 'general';
  startDate: string;
  endDate?: string;
  displayDate: string;
  semester: 'First Semester' | 'Second Semester' | 'Academic Year';
  academicYear: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  description: string;
  officialSource: string;
}

export interface ResourceDocument {
  id: string;
  title: string;
  category: 'handbook' | 'regulations' | 'registration' | 'credit-system' | 'fees' | 'exams' | 'accommodation' | 'forms' | 'guides';
  description: string;
  content: string;
  fileFormat: string;
  downloadSize?: string;
  lastUpdated: string;
  officialSource: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

export interface ChatSource {
  title: string;
  category: string;
  url?: string;
  lastUpdated?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: ChatSource[];
  suggestedFollowUps?: string[];
  evidenceStatus?: 'Supported by official university sources' | 'General academic orientation' | 'Needs official confirmation';
  isSaved?: boolean;
  // Voice & Model metadata
  isVoiceInput?: boolean;
  modelAttribution?: string;
  audioDurationSeconds?: number;
  transcriptionConfidence?: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'calendar' | 'academic' | 'resource' | 'announcement';
  actionRoute?: string;
}

export interface SavedItem {
  id: string;
  type: 'program' | 'answer' | 'resource' | 'event';
  title: string;
  subtitle?: string;
  data: any;
  savedAt: string;
}

// Voice & Gemma Model Types
export interface GemmaModelConfig {
  provider: 'google-genai' | 'vertex-ai' | 'custom-endpoint';
  modelId: string;
  displayName: string;
  temperature: number;
  maxOutputTokens: number;
  requestTimeoutMs: number;
  retryCount: number;
}

export type VoiceRecordingStatus = 'idle' | 'requesting_permission' | 'recording' | 'transcribing' | 'ready' | 'error';

export interface VoiceRecording {
  id: string;
  audioBlob?: Blob;
  audioUrl?: string;
  mimeType: string;
  durationSeconds: number;
  transcriptionText: string;
  language: Language;
  status: VoiceRecordingStatus;
  confidence?: number;
  error?: string;
  createdAt: string;
}

export interface AudioPlaybackState {
  messageId: string | null;
  isPlaying: boolean;
  isPaused: boolean;
  currentProgress?: number;
  duration?: number;
  language?: Language;
}

export interface VoiceLanguageSettings {
  interfaceLanguage: Language;
  speechInputLanguage: Language;
  responseLanguage: Language;
  autoReadAloud: boolean;
  speechRate: number; // 0.8, 1.0, 1.2
}

