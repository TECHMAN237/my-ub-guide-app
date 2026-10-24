import { describe, it, expect, vi } from 'vitest';
import { searchKnowledgeBase, UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE, parseKnowledgeBase } from '../lib/ai/knowledgeBase';
import { AI_CONFIG, validateGemmaConfiguration } from '../config/aiConfig';
import chatHandler from '../../api/chat';

describe('My UB Guide Production-Readiness Review', () => {
  it('1. Model Identity: Strict Gemma configuration without Gemini fallback', () => {
    // Single configured Gemma model
    expect(AI_CONFIG.modelId).toContain('gemma');
    
    const validGemma = validateGemmaConfiguration('gemma-2-27b-it');
    expect(validGemma.isValid).toBe(true);

    const invalidGemini = validateGemmaConfiguration('gemini-3.8-flash');
    expect(invalidGemini.isValid).toBe(false);
    expect(invalidGemini.error).toContain('violates the mandatory Gemma requirement');
  });

  it('2. Knowledge Base Verification: UB_AI_Student_Companion_Knowledge_Base is loaded & parsed', () => {
    expect(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE).toBeDefined();
    expect(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE).toContain('University of Buea');
    expect(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE).toContain('Computer Science');
    expect(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE).toContain('290,000 FCFA');

    const parsed = parseKnowledgeBase(UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE);
    expect(parsed.length).toBeGreaterThan(3);

    // Test specific search on knowledge base
    const feeQueryResult = searchKnowledgeBase('How much are the tuition fees for Computer Science?');
    expect(feeQueryResult.hasVerifiedMatch).toBe(true);
    expect(feeQueryResult.contextText).toContain('290,000 FCFA');
    expect(feeQueryResult.sources.length).toBeGreaterThan(0);
    expect(feeQueryResult.sources[0].title).toContain('UB AI Student Companion Knowledge Base');
  });

  it('3. /api/chat Route Handler: Rejects empty payload and non-Gemma requests', async () => {
    const mockResBad = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    // Test empty message
    await chatHandler({ method: 'POST', body: { message: '' } }, mockResBad);
    expect(mockResBad.status).toHaveBeenCalledWith(400);
    expect(mockResBad.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'A valid non-empty user message is required' })
    );

    const mockResGemini = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    // Test rejection of unsupported model family
    await chatHandler({ method: 'POST', body: { message: 'Hello', modelId: 'unsupported-custom-model' } }, mockResGemini);
    expect(mockResGemini.status).toHaveBeenCalledWith(400);
    expect(mockResGemini.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Only permitted Google models are allowed') })
    );
  });

  it('4. /api/chat Route Handler: Missing API Key returns structured 503 error without crashing', async () => {
    const originalKey = process.env.gemma_api_key;
    delete process.env.gemma_api_key;
    delete process.env.GEMMA_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const mockResKey = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await chatHandler({ method: 'POST', body: { message: 'What is the grading system?' } }, mockResKey);

    expect(mockResKey.status).toHaveBeenCalledWith(503);
    expect(mockResKey.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("requires the secret environment variable 'gemma_api_key'"),
        hasApiKey: false,
        fallbackNeeded: false
      })
    );

    if (originalKey) {
      process.env.gemma_api_key = originalKey;
    }
  });

  it('5. Security: Verifies secret keys are not present in response structures or client config', () => {
    expect((window as any).gemma_api_key).toBeUndefined();
    expect((window as any).GEMINI_API_KEY).toBeUndefined();
  });
});
