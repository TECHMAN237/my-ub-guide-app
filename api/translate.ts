import { GoogleGenAI } from '@google/genai';

const getSecretApiKey = (): string | undefined => {
  return process.env.gemma_api_key || process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY;
};

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

    const currentKey = getSecretApiKey();
    if (currentKey) {
      try {
        const client = new GoogleGenAI({
          apiKey: currentKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        const langTarget = targetLanguage === 'fr' ? 'French' : 'English';
        const prompt = `You are the official translator for University of Buea orientation portal. Translate the following text into ${langTarget}.
RULES:
1. Strictly preserve all official university terms, degree titles (e.g., "BSc Software Engineering", "Master of Science"), course codes, statute references (e.g. "Statute 4.2"), and tuition amounts with currency (e.g., "290,000 FCFA").
2. Output ONLY the translated text with natural grammar and tone, without commentary or quotation marks.

Text to translate:
${text}`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        const translatedText = response.text?.trim();
        if (translatedText) {
          res.status(200).json({
            translatedText,
            detectedSourceLanguage: sourceLanguage || 'auto'
          });
          return;
        }
      } catch (err: any) {
        console.warn('AI translation API warning:', err.message);
      }
    }

    res.status(200).json({
      translatedText: text,
      detectedSourceLanguage: sourceLanguage || 'auto'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Translation error' });
  }
}
