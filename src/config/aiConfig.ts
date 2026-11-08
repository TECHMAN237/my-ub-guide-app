import { AIModelConfig } from '../types';

/**
 * Centralized AI model configuration for UB Compass.
 *
 * Chat, translation and (where available) audio understanding run on a free
 * OpenRouter model. The API key lives only in the server environment
 * (`OPENROUTER_API_KEY`); nothing secret is exposed to the client.
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

export const DEFAULT_MODEL_ID = 'nvidia/nemotron-3-ultra-550b-a55b:free';

const configuredModel = getEnvVar('OPENROUTER_MODEL', getEnvVar('AI_MODEL_ID', DEFAULT_MODEL_ID));

export const AI_CONFIG: AIModelConfig = {
  provider: 'openrouter',
  // Guard against legacy bare ids that OpenRouter cannot resolve.
  modelId: configuredModel.includes('/') ? configuredModel : DEFAULT_MODEL_ID,
  displayName: 'Nemotron 3 Ultra (free)',
  temperature: 0.7,
  maxOutputTokens: 1200,
  requestTimeoutMs: 30000,
  retryCount: 2
};

export const VOICE_CONFIG = {
  // Server-side transcription is unavailable on OpenRouter; the browser Web
  // Speech API is used instead.
  speechToTextEnabled: getEnvVar('SPEECH_TO_TEXT_ENABLED', 'true') === 'true',
  textToSpeechEnabled: getEnvVar('TEXT_TO_SPEECH_ENABLED', 'true') === 'true',
  translationEnabled: getEnvVar('TRANSLATION_ENABLED', 'true') === 'true',
  maxRecordingDurationSeconds: 120,
  supportedMimeTypes: ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'],
  supportedLanguages: ['en', 'fr'] as const,
  defaultLanguage: 'en' as const
};

export function getAiModelDescription(): string {
  return `OpenRouter model (${AI_CONFIG.modelId})`;
}

/**
 * Validates that the active model id is an OpenRouter `vendor/model` id.
 * Rejects bare ids from the old Google GenAI integration.
 */
export function validateModelConfiguration(modelId: string = AI_CONFIG.modelId): {
  isValid: boolean;
  model: string;
  error?: string;
} {
  const normalized = modelId.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._:-]*$/.test(normalized)) {
    return {
      isValid: false,
      model: modelId,
      error: `Model "${modelId}" is not a valid OpenRouter id. Use "vendor/model", for example "nvidia/nemotron-3-ultra-550b-a55b:free".`
    };
  }
  return {
    isValid: true,
    model: modelId
  };
}
