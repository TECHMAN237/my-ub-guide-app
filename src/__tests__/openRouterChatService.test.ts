import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { openRouterChatService } from '../services/openRouterChatService';
import { AI_CONFIG, validateModelConfiguration } from '../config/aiConfig';
import { UserProfile } from '../types';

describe('OpenRouter Chat Service & Anti-Substitution Policy', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('identifies and selects the configured free OpenRouter model', () => {
    expect(AI_CONFIG.modelId).toContain(':free');
    expect(AI_CONFIG.modelId).toBe('nvidia/nemotron-3-ultra-550b-a55b:free');
    expect(AI_CONFIG.provider).toBe('openrouter');

    const validation = validateModelConfiguration(AI_CONFIG.modelId);
    expect(validation.isValid).toBe(true);
    expect(validation.model).toBe('nvidia/nemotron-3-ultra-550b-a55b:free');
  });

  it('rejects bare model ids that are not OpenRouter-style', () => {
    const geminiCheck = validateModelConfiguration('gemini-2.5-flash');
    expect(geminiCheck.isValid).toBe(false);
    expect(geminiCheck.error).toContain('not a valid OpenRouter id');

    const gptCheck = validateModelConfiguration('gpt-4o');
    expect(gptCheck.isValid).toBe(false);
  });

  it('normalizes live model responses and preserves sources', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'The standard credit load is 30 to 36 credits. You may take up to 42 credits with Dean approval.',
        modelId: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        provider: 'openrouter',
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

    const res = await openRouterChatService.generateUniversityAnswer({
      message: 'What is the credit limit?',
      userProfile: enrolledProfile,
      language: 'en'
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(res.text).toContain('30 to 36 credits');
    expect(res.modelId).toBe('nvidia/nemotron-3-ultra-550b-a55b:free');
    expect(res.mode).toBe('live');
    expect(res.sources.length).toBeGreaterThan(0);
    expect(res.sources.some(s => s.title.includes('Regulations') || s.title.includes('Programme'))).toBe(true);
  });

  it('does NOT switch provider when inference fails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({
        error: 'AI inference server temporarily unavailable'
      })
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(
      openRouterChatService.generateUniversityAnswer({
        message: 'Tell me about computer science fees',
        language: 'en'
      })
    ).rejects.toThrow(/AI inference server temporarily unavailable|HTTP 503/);
  });

  it('supports explicit mock-demo mode for offline unit testing without pretending to be live', async () => {
    const res = await openRouterChatService.generateUniversityAnswer({
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
      openRouterChatService.generateUniversityAnswer({
        message: 'Hello',
        language: 'fr',
        simulateFailure: true
      })
    ).rejects.toThrow(/Erreur de connexion au modèle IA/);
  });
});
