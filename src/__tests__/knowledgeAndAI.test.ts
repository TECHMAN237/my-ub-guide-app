import { describe, it, expect, beforeEach } from 'vitest';
import { searchKnowledge, getDeterministicAnswer } from '../services/knowledgeService';
import { AIService } from '../services/aiService';

describe('Knowledge Retrieval & AI Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should retrieve grounded programs for Computer Science query', () => {
    const result = searchKnowledge('Computer Science');
    expect(result.contextText).toContain('Computer Science');
    expect(result.contextText).toContain('BSc (Bachelor of Science)');
    expect(result.sources.some(s => s.title.includes('Computer Science'))).toBe(true);
  });

  it('should retrieve official school fee records with breakdown for fees query', () => {
    const result = searchKnowledge('how much are school fees for computer science');
    expect(result.contextText).toContain('290,000');
    expect(result.contextText).toContain('Tuition Fee: 250,000');
    expect(result.contextText).toContain('Development Fee: 25,000');
    expect(result.sources.some(s => s.category.includes('Official Fees Document'))).toBe(true);
  });

  it('should retrieve credit policy regulations for credit query', () => {
    const result = searchKnowledge('how many credits can I register');
    expect(result.contextText).toContain('36');
    expect(result.contextText).toContain('CGPA');
    expect(result.contextText).toContain('Statute 4');
  });

  it('should generate source-backed answers in deterministic mode (English)', () => {
    const ans = getDeterministicAnswer('What are the school fees?', null, 'en');
    expect(ans.text).toContain('290,000 FCFA');
    expect(ans.text).toContain('Tuition Fee');
    expect(ans.sources.length).toBeGreaterThan(0);
    expect(ans.suggestedFollowUps.length).toBeGreaterThan(0);
  });

  it('should generate localized answers in French', () => {
    const ans = getDeterministicAnswer('Quels sont les frais de scolarite ?', null, 'fr');
    expect(ans.text).toContain('290 000 FCFA');
    expect(ans.text).toContain('Informatique');
    expect(ans.suggestedFollowUps.length).toBeGreaterThan(0);
  });

  it('should handle simulated failure and throw expected error', async () => {
    const ai = AIService.getInstance();
    ai.setSimulateFailure(true);
    expect(ai.isSimulatingFailure()).toBe(true);

    await expect(
      ai.sendMessage('Hello', [], null, 'en')
    ).rejects.toThrow('Unable to contact the AI service');

    // Restore
    ai.setSimulateFailure(false);
    expect(ai.isSimulatingFailure()).toBe(false);
  });

  it('should return mock-demo mode when forceMockMode is enabled', async () => {
    const ai = AIService.getInstance();
    ai.setForceMockMode(true);
    expect(ai.isForceMockMode()).toBe(true);

    const res = await ai.sendMessage('What programs are offered?', [], null, 'en');
    expect(res.mode).toBe('mock-demo');
    expect(res.text).toContain('Computer Science');
    expect(res.sources.length).toBeGreaterThan(0);

    // Restore
    ai.setForceMockMode(false);
  });
});
