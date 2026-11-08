import {
  getOpenRouterApiKey,
  resolveOpenRouterModel
} from '../src/lib/ai/openRouter';

export default function handler(_req: any, res: any) {
  const apiKey = getOpenRouterApiKey();
  res.status(200).json({
    modelId: resolveOpenRouterModel(),
    modelFamily: 'OpenRouter free model',
    provider: 'openrouter',
    speechToTextEnabled: false,
    speechToTextMode: 'browser-web-speech',
    textToSpeechEnabled: true,
    translationEnabled: true,
    languages: ['en', 'fr'],
    apiKeyConfigured: Boolean(apiKey)
  });
}
