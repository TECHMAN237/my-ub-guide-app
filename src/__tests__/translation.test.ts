import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { translationService } from '../services/translationService';

describe('Translation Service & Preservation of Official Terminology', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('translates text via backend endpoint when available', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        translatedText: 'Quels sont les frais de scolarité pour le génie logiciel ?',
        detectedSourceLanguage: 'en'
      })
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await translationService.translateText(
      'What are the tuition fees for Software Engineering?',
      'fr',
      'en'
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.text).toContain('génie logiciel');
    expect(result.translated).toBe(true);
  });

  it('preserves the original text without crashing if translation fails', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetch);

    const original = 'Course registration deadline is October 31st.';
    const result = await translationService.translateText(original, 'fr', 'en');

    expect(result.text).toBe(original);
    expect(result.translated).toBe(false);
  });

  it('returns original text immediately when source and target languages match', async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    const text = 'Academic calendar 2025/2026';
    const result = await translationService.translateText(text, 'en', 'en');

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.text).toBe(text);
  });
});
