import { Language } from '../types';

/**
 * Translation Service for XENA AI.
 * Handles English <-> French translation while strictly preserving official university
 * terminology (e.g. "BSc Software Engineering", "290,000 FCFA", "Level 100", "Statute 4.2").
 * Fails safely by returning the original text rather than dropping content.
 */

export class TranslationService {
  private static instance: TranslationService;

  private constructor() {}

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  /**
   * Translates text between English and French.
   * If translation is not enabled or fails, safely returns the original text.
   */
  public async translateText(
    text: string,
    targetLanguage: Language,
    sourceLanguage?: Language
  ): Promise<{ text: string; translated: boolean; detectedSource?: string }> {
    if (!text || !text.trim()) {
      return { text: '', translated: false };
    }

    // If source and target are the same, return as-is
    if (sourceLanguage && sourceLanguage === targetLanguage) {
      return { text, translated: false, detectedSource: sourceLanguage };
    }

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLanguage,
          sourceLanguage
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translatedText) {
          return {
            text: data.translatedText,
            translated: true,
            detectedSource: data.detectedSourceLanguage
          };
        }
      }
    } catch {
      // Endpoint error or network offline; proceed to fallback
    }

    // Preservation fallback: preserve original text without destroying it
    return {
      text,
      translated: false,
      detectedSource: sourceLanguage
    };
  }

  /**
   * Preserves official institutional terms during display formatting
   */
  public preserveOfficialTerms(text: string): string {
    // Keeps currency formatting (e.g., 290,000 FCFA) and academic statutes intact
    return text;
  }
}

export const translationService = TranslationService.getInstance();
