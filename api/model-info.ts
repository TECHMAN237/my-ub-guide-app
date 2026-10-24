const GEMMA_MODEL_ID = process.env.GEMMA_MODEL_ID || 'gemma-4-26b-a4b-it';
const AI_PROVIDER = process.env.AI_PROVIDER || 'google-genai';

const getSecretApiKey = (): string | undefined => {
  return process.env.gemma_api_key || process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY;
};

export default function handler(_req: any, res: any) {
  const currentKey = getSecretApiKey();
  res.status(200).json({
    modelId: GEMMA_MODEL_ID,
    modelFamily: 'Google Gemma',
    provider: AI_PROVIDER,
    speechToTextEnabled: true,
    textToSpeechEnabled: true,
    languages: ['en', 'fr'],
    apiKeyConfigured: Boolean(currentKey && currentKey.length > 0)
  });
}
