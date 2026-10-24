import { GemmaModelConfig } from '../types';

/**
 * Centralized AI Model Configuration for XENA AI.
 *
 * ZERO-CONFIG ARCHITECTURE:
 * In Google AI Studio, no manual environment variables are required.
 * - The chatbot runs on Google Gemma (gemma-4-26b-a4b-it) via Google GenAI SDK.
 * - Auxiliary audio transcription & translation use the native GEMINI_API_KEY.
 * - Speech synthesis uses the browser's native Speech Synthesis API (zero external keys).
 * - All voice and translation features are enabled by default.
 */

// Reads Vite env vars on client, or process.env on Node
const getEnvVar = (key: string, defaultValue: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const viteKey = `VITE_${key}`;
    if ((import.meta as any).env[viteKey]) {
      return (import.meta as any).env[viteKey];
    }
    if ((import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  }
  return defaultValue;
};

export const AI_CONFIG: GemmaModelConfig = {
  provider: (getEnvVar('AI_PROVIDER', 'google-genai') as 'google-genai'),
  modelId: getEnvVar('GEMMA_MODEL_ID', 'gemma-4-26b-a4b-it'),
  displayName: 'Google Gemma 4 26B A4B IT',
  temperature: 0.7,
  maxOutputTokens: 1200,
  requestTimeoutMs: 25000,
  retryCount: 2
};

export const VOICE_CONFIG = {
  speechToTextEnabled: getEnvVar('GOOGLE_SPEECH_TO_TEXT_ENABLED', 'true') === 'true',
  textToSpeechEnabled: getEnvVar('GOOGLE_TEXT_TO_SPEECH_ENABLED', 'true') === 'true',
  translationEnabled: getEnvVar('GOOGLE_TRANSLATION_ENABLED', 'true') === 'true',
  maxRecordingDurationSeconds: 120,
  supportedMimeTypes: ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'],
  supportedLanguages: ['en', 'fr'] as const,
  defaultLanguage: 'en' as const
};

export function getAiModelDescription(): string {
  return `Google Gemma (${AI_CONFIG.modelId}) via ${AI_CONFIG.provider}`;
}

/**
 * Validates that the active model configuration strictly complies with the Gemma mandate.
 * Rejects any Gemini or non-Gemma model substitution.
 */
export function validateGemmaConfiguration(modelId: string = AI_CONFIG.modelId): {
  isValid: boolean;
  model: string;
  error?: string;
} {
  const normalized = modelId.toLowerCase();
  if (!normalized.includes('gemma')) {
    return {
      isValid: false,
      model: modelId,
      error: `Model "${modelId}" violates the mandatory Gemma requirement. Only official Google Gemma models (e.g. gemma-4-26b-a4b-it) are permitted for the university assistant.`
    };
  }
  return {
    isValid: true,
    model: modelId
  };
}
