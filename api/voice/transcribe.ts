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
    const { audioBase64, mimeType, language = 'en', durationSeconds = 0 } = req.body || {};

    if (!audioBase64 || typeof audioBase64 !== 'string') {
      res.status(400).json({ error: 'Audio data is required' });
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

        const audioPart = {
          inlineData: {
            data: audioBase64,
            mimeType: mimeType || 'audio/webm'
          }
        };

        const promptText = language === 'fr'
          ? "Transcrivez fidèlement cet enregistrement audio en français. Renvoyez uniquement la transcription exacte mot pour mot, sans guillemets ni commentaires."
          : "Transcribe this audio recording accurately. Output only the verbatim transcript, without quotes or additional comments.";

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [audioPart, promptText]
        });

        const transcript = response.text?.trim() || '';
        if (transcript) {
          res.status(200).json({
            transcript,
            language,
            confidence: 0.96,
            durationSeconds
          });
          return;
        }
      } catch (err: any) {
        console.warn('Audio transcription error:', err.message);
      }
    }

    res.status(503).json({
      error: 'Audio transcription service is currently unavailable. Please review your recording or enter text.',
      fallbackNeeded: true
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Speech transcription failed' });
  }
}
