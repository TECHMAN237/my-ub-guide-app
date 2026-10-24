import { describe, it, expect } from 'vitest';
import { searchKnowledge } from '../services/knowledgeService';
import { INITIAL_PROGRAMS, INITIAL_FEES, INITIAL_CALENDAR_EVENTS, INITIAL_RESOURCES } from '../data/mockData';

describe('Knowledge Retrieval & RAG Service', () => {
  it('correctly retrieves fees breakdown for Computer Science', () => {
    const result = searchKnowledge('How much are the school fees for Computer Science?');
    
    expect(result.contextText).toContain('Computer Science');
    expect(result.contextText).toContain('290,000 FCFA');
    expect(result.contextText).toContain('Tuition = 250,000 FCFA');
    expect(result.contextText).toContain('Development fee = 25,000 FCFA');
    expect(result.contextText).toContain('Other charges = 15,000 FCFA');
    
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.sources[0].title).toContain('Official Fees Document');
    expect(result.evidenceStatus).toBe('Supported by official university sources');
  });

  it('correctly retrieves credit system limits and additional credit policies', () => {
    const result = searchKnowledge('How many credits can I register for this semester?');

    expect(result.contextText).toContain('30 to 36 Credits');
    expect(result.contextText).toContain('additional credits');
    expect(result.contextText).toContain('42 credits');
    expect(result.contextText).toContain('CGPA of 3.0 or higher');
    expect(result.sources.some(s => s.title.includes('Credit System'))).toBe(true);
  });

  it('correctly retrieves academic calendar deadlines', () => {
    const result = searchKnowledge('When do lectures and examinations start?');

    expect(result.contextText).toContain('6 Oct 2025');
    expect(result.contextText).toContain('First Semester Exams');
    expect(result.sources.some(s => s.title.includes('Calendar'))).toBe(true);
  });

  it('provides relevant follow-up questions for admissions inquiries', () => {
    const result = searchKnowledge('What are the admission requirements for undergraduate programs?');

    expect(result.suggestedFollowUps.length).toBeGreaterThan(0);
    expect(result.contextText).toContain('GCE Advanced Level');
  });
});
