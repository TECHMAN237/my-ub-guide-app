import {
  OPENROUTER_TRANSLATION_MODEL,
  chatCompletion,
  getErrorMessage,
  getOpenRouterApiKey
} from '../src/lib/ai/openRouter';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { text, targetLanguage = 'en', sourceLanguage } = req.body || {};

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for translation' });
      return;
    }

    if (sourceLanguage === targetLanguage) {
      res.status(200).json({ translatedText: text, detectedSourceLanguage: sourceLanguage });
      return;
    }

    if (!getOpenRouterApiKey()) {
      res.status(200).json({ translatedText: text, detectedSourceLanguage: sourceLanguage || 'auto' });
      return;
    }

    const langTarget = targetLanguage === 'fr' ? 'French' : 'English';
    const prompt = `You are the official translator for the University of Buea orientation portal. Translate the following text into ${langTarget}.
RULES:
1. Strictly preserve all official university terms, degree titles (e.g., "BSc Software Engineering", "Master of Science"), course codes, statute references (e.g. "Statute 4.2"), and tuition amounts with currency (e.g., "290,000 FCFA").
2. Output ONLY the translated text with natural grammar and tone, without commentary or quotation marks.

Text to translate:
${text}`;

    try {
      const result = await chatCompletion({
        model: OPENROUTER_TRANSLATION_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        maxTokens: 1500
      });

      res.status(200).json({
        translatedText: result.text,
        detectedSourceLanguage: sourceLanguage || 'auto'
      });
      return;
    } catch (err: unknown) {
      console.warn('OpenRouter translation warning:', getErrorMessage(err));
    }

    res.status(200).json({
      translatedText: text,
      detectedSourceLanguage: sourceLanguage || 'auto'
    });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) || 'Translation error' });
  }
}
