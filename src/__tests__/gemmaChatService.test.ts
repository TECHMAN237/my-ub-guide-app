import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { gemmaChatService } from '../services/gemmaChatService';
import { AI_CONFIG, validateGemmaConfiguration } from '../config/aiConfig';
import { UserProfile } from '../types';

describe('Gemma Chat Service & Anti-Substitution Policy', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('strictly identifies and selects a verified Google Gemma model', () => {
    expect(AI_CONFIG.modelId).toContain('gemma');
    expect(AI_CONFIG.modelId).toBe('gemma-4-26b-a4b-it');
    expect(AI_CONFIG.provider).toBe('google-genai');

    const validation = validateGemmaConfiguration(AI_CONFIG.modelId);
    expect(validation.isValid).toBe(true);
    expect(validation.model).toBe('gemma-4-26b-a4b-it');
  });

  it('rejects Gemini or non-Gemma model substitution', () => {
    const geminiCheck = validateGemmaConfiguration('gemini-2.5-flash');
    expect(geminiCheck.isValid).toBe(false);
    expect(geminiCheck.error).toContain('violates the mandatory Gemma requirement');

    const gptCheck = validateGemmaConfiguration('gpt-4o');
    expect(gptCheck.isValid).toBe(false);
  });

  it('normalizes live Gemma endpoint responses and preserves sources', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'The standard credit load is 30 to 36 credits. You may take up to 42 credits with Dean approval.',
        modelId: 'gemma-4-26b-a4b-it',
        provider: 'google-genai',
        suggestedFollowUps: ['How do I get Dean approval?', 'When is registration?']
      })
    });
    vi.stubGlobal('fetch', mockFetch);

    const enrolledProfile: UserProfile = {
      id: 'usr-1',
      name: 'Alice Enrolled',
      email: 'alice@uni.edu',
      category: 'enrolled',
      faculty: 'Faculty of Science',
      department: 'Computer Science',
      level: 'Level 200',
      language: 'en'
    };

    const res = await gemmaChatService.generateUniversityAnswer({
      message: 'What is the credit limit?',
      userProfile: enrolledProfile,
      language: 'en'
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(res.text).toContain('30 to 36 credits');
    expect(res.modelId).toBe('gemma-4-26b-a4b-it');
    expect(res.mode).toBe('live');
    expect(res.sources.length).toBeGreaterThan(0);
    expect(res.sources.some(s => s.title.includes('Regulations') || s.title.includes('Programme'))).toBe(true);
  });

  it('does NOT silently fall back to Gemini on Gemma model failure', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({
        error: 'Gemma inference server temporarily unavailable'
      })
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(
      gemmaChatService.generateUniversityAnswer({
        message: 'Tell me about computer science fees',
        language: 'en'
      })
    ).rejects.toThrow(/Gemma inference server temporarily unavailable|HTTP 503/);
  });

  it('supports explicit mock-demo mode for offline unit testing without pretending to be live', async () => {
    const res = await gemmaChatService.generateUniversityAnswer({
      message: 'What are the computer science fees?',
      language: 'en',
      forceMockMode: true
    });

    expect(res.mode).toBe('mock-demo');
    expect(res.modelId).toContain('Mock Demo Mode');
    expect(res.text).toContain('290,000 FCFA');
    expect(res.sources.length).toBeGreaterThan(0);
  });

  it('handles simulated failures gracefully with localized error messages', async () => {
    await expect(
      gemmaChatService.generateUniversityAnswer({
        message: 'Hello',
        language: 'fr',
        simulateFailure: true
      })
    ).rejects.toThrow(/Erreur de connexion au modèle Gemma/);
  });
});
