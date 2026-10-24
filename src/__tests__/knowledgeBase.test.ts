import { describe, it, expect } from 'vitest';
import {
  getSystemInstruction,
  ASSISTANT_IDENTITY,
  CORE_INSTRUCTION_RULES
} from '../lib/ai/assistantInstructions';
import {
  parseKnowledgeBase,
  searchKnowledgeBase,
  UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE,
  RAW_KNOWLEDGE_BASE
} from '../lib/ai/knowledgeBase';
import { gemmaChatService } from '../services/gemmaChatService';
import { AI_CONFIG, validateGemmaConfiguration } from '../config/aiConfig';
import { UserProfile } from '../types';

describe('Assistant Instructions & Identity', () => {
  it('exports valid product identity and Gemma model requirements', () => {
    expect(ASSISTANT_IDENTITY.name).toBe('My UB Guide');
    expect(ASSISTANT_IDENTITY.institution).toBe('University of Buea');
    expect(ASSISTANT_IDENTITY.modelRequirement).toBe('gemma-4-26b-a4b-it');
    expect(ASSISTANT_IDENTITY.provider).toBe('google-genai');
  });

  it('exports core instruction rules with strict anti-fabrication guidelines', () => {
    expect(CORE_INSTRUCTION_RULES.length).toBeGreaterThanOrEqual(8);
    expect(CORE_INSTRUCTION_RULES.some(r => r.includes('gemma-4-26b-a4b-it'))).toBe(true);
    expect(CORE_INSTRUCTION_RULES.some(r => r.includes('NO FABRICATION'))).toBe(true);
    expect(CORE_INSTRUCTION_RULES.some(r => r.includes('CREDIT LIMITS POLICY'))).toBe(true);
  });

  it('builds system instructions for prospective and enrolled students', () => {
    const prospectiveProfile: UserProfile = {
      id: 'p1',
      name: 'Alex Mbarga',
      email: 'alex.mbarga@gmail.com',
      category: 'prospective',
      language: 'en',
      interestedFaculty: 'Faculty of Science',
      interestedProgram: 'Computer Science'
    };

    const enrolledProfile: UserProfile = {
      id: 'e1',
      name: 'Ferdinand Tanyi',
      email: 'ferdinand.tanyi@student.ubuea.cm',
      category: 'enrolled',
      language: 'fr',
      faculty: 'Faculty of Science',
      department: 'Computer Science',
      level: 'Level 100'
    };

    const prospectiveInst = getSystemInstruction({ userProfile: prospectiveProfile, language: 'en' });
    expect(prospectiveInst).toContain('My UB Guide');
    expect(prospectiveInst).toContain('Prospective Student');
    expect(prospectiveInst).toContain('Faculty of Science');

    const enrolledInst = getSystemInstruction({ userProfile: enrolledProfile, language: 'fr' });
    expect(enrolledInst).toContain('Enrolled Student');
    expect(enrolledInst).toContain('Level 100');
    expect(enrolledInst).toContain('francais');
  });
});

describe('UB AI Student Companion Knowledge Base Parsing & Retrieval', () => {
  it('loads and parses UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE Markdown into structured sections', () => {
    expect(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE).toBeDefined();
    expect(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE).toContain('UB AI Student Companion Knowledge Base');
    expect(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE.length).toBeGreaterThan(1000);

    // Verify alias compatibility
    expect(RAW_KNOWLEDGE_BASE).toBe(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE);

    const sections = parseKnowledgeBase(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE);
    expect(sections.length).toBeGreaterThanOrEqual(5);

    const feeSection = sections.find(s => s.category === 'Fees & Financials');
    expect(feeSection).toBeDefined();
    expect(feeSection?.content).toContain('290,000 FCFA');

    const creditSection = sections.find(s => s.category === 'Academic Regulations');
    expect(creditSection).toBeDefined();
    expect(creditSection?.content).toContain('36 Credit Units');
  });

  it('searches UB AI Student Companion Knowledge Base for tuition fee queries', () => {
    const result = searchKnowledgeBase('How much are the school fees for Computer Science?');
    expect(result.sections.length).toBeGreaterThan(0);
    expect(result.contextText).toContain('UB AI STUDENT COMPANION KNOWLEDGE BASE');
    expect(result.contextText).toContain('290,000 FCFA');
    expect(result.sources.some(s => s.title.includes('UB AI Student Companion Knowledge Base'))).toBe(true);
    expect(result.hasVerifiedMatch).toBe(true);
  });

  it('searches relevant sections for credit unit and additional credit inquiries from UB AI Student Companion Knowledge Base', () => {
    const result = searchKnowledgeBase('Can I register 40 credits with a 3.2 CGPA?');
    expect(result.sections.length).toBeGreaterThan(0);
    expect(result.contextText).toContain('3.0 or higher');
    expect(result.contextText).toContain('42 credit units');
    expect(result.sources.some(s => s.title.includes('UB AI Student Companion Knowledge Base'))).toBe(true);
  });

  it('handles empty or unmatched queries gracefully without crashing', () => {
    const emptyResult = searchKnowledgeBase('');
    expect(emptyResult.sections.length).toBe(0);
    expect(emptyResult.hasVerifiedMatch).toBe(false);

    const randomResult = searchKnowledgeBase('xyz123randomnonexistentterm');
    expect(randomResult.hasVerifiedMatch).toBe(false);
    expect(randomResult.evidenceStatus).toBe('Needs official confirmation');
  });

  it('preserves source metadata and URLs for retrieved evidence from UB AI Student Companion Knowledge Base', () => {
    const result = searchKnowledgeBase('exam dates and academic calendar');
    expect(result.sources.length).toBeGreaterThan(0);
    result.sources.forEach(src => {
      expect(src.title).toContain('UB AI Student Companion Knowledge Base');
      expect(src.category).toBeDefined();
      expect(src.url).toBeDefined();
    });
  });
});

describe('Gemma Service Architecture & Model Integrity', () => {
  it('validates active Gemma configuration and rejects Gemini substitution', () => {
    const valid = validateGemmaConfiguration('gemma-4-26b-a4b-it');
    expect(valid.isValid).toBe(true);

    const invalid = validateGemmaConfiguration('gemini-2.5-flash');
    expect(invalid.isValid).toBe(false);
    expect(invalid.error).toContain('violates the mandatory Gemma requirement');
  });

  it('generates grounded answers in mock mode for testing without external API key', async () => {
    const response = await gemmaChatService.generateUniversityAnswer({
      message: 'What are the tuition fees for Computer Science?',
      forceMockMode: true
    });

    expect(response.mode).toBe('mock-demo');
    expect(response.text).toContain('290,000 FCFA');
    expect(response.sources.length).toBeGreaterThan(0);
    expect(response.modelId).toContain(AI_CONFIG.modelId);
  });

  it('surfaces explicit connection errors when simulated failure occurs', async () => {
    await expect(
      gemmaChatService.generateUniversityAnswer({
        message: 'Hello',
        simulateFailure: true
      })
    ).rejects.toThrow('Unable to contact the AI service');
  });
});
