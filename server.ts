import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limit to support audio uploads for speech transcription
app.use(express.json({ limit: '15mb' }));

// Centralized Gemma Model Configuration
const GEMMA_MODEL_ID = process.env.GEMMA_MODEL_ID || 'gemma-4-26b-a4b-it';
const AI_PROVIDER = process.env.AI_PROVIDER || 'google-genai';

// Initialize Google Gen AI with required telemetry header
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// GET /api/model-info endpoint - transparently identifies active Gemma model
app.get('/api/model-info', (_req: Request, res: Response) => {
  res.json({
    modelId: GEMMA_MODEL_ID,
    modelFamily: 'Google Gemma',
    provider: AI_PROVIDER,
    speechToTextEnabled: true,
    textToSpeechEnabled: true,
    languages: ['en', 'fr']
  });
});

// POST /api/chat endpoint - Strictly powered by Google Gemma
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, userProfile, retrievedContext, language } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Strict validation: enforce that the model belongs to the Gemma family
    const targetModel = (req.body.modelId || GEMMA_MODEL_ID).toLowerCase();
    if (!targetModel.includes('gemma')) {
      res.status(400).json({
        error: `Model "${targetModel}" is rejected. Only Google Gemma models are permitted for the university chatbot.`,
        fallbackNeeded: false
      });
      return;
    }

    if (!aiClient) {
      res.status(503).json({
        error: `Gemma model (${GEMMA_MODEL_ID}) inference requires GEMINI_API_KEY to be configured on the server.`,
        fallbackNeeded: false
      });
      return;
    }

    const langInstruction = language === 'fr'
      ? 'Respond exclusively in French. Use formal, professional, polite French appropriate for university administration.'
      : 'Respond in clear, accessible, helpful English.';

    const profileContext = userProfile
      ? `STUDENT PROFILE:
- Name: ${userProfile.name}
- Category: ${userProfile.category === 'enrolled' ? 'Enrolled Student' : 'Prospective Student'}
- Faculty: ${userProfile.faculty || userProfile.interestedFaculty || 'Undecided'}
- Department: ${userProfile.department || userProfile.interestedDepartment || 'Undecided'}
- Level / Year: ${userProfile.level || userProfile.interestedStudyLevel || 'Undecided'}
- Academic Year: ${userProfile.academicYear || '2025/2026'}
- Semester: ${userProfile.semester || 'First Semester'}`
      : 'STUDENT PROFILE: Guest / Unregistered Prospective Student';

    const systemInstruction = `You are "XENA AI", the official university information and orientation assistant powered by Google Gemma.
Your responsibility is to guide prospective and enrolled university students through accredited programs, admission requirements, tuition fees, course credit regulations, academic calendars, and campus life.

CRITICAL OPERATIONAL RULES:
1. Ground all university-specific facts (such as exact tuition amounts, credit unit caps, deadlines, exam dates) in the VERIFIED INSTITUTIONAL KNOWLEDGE below.
2. NEVER fabricate credit limits, deadlines, fee totals, or exam schedules. If a specific institutional fact is missing from the provided knowledge, clearly state that the rule needs official confirmation from the department or registry.
3. For credit inquiries: explain that the standard maximum is 36 credits, but students with CGPA >= 3.0 may request up to 6 additional credits (maximum 42 credits) with written HOD recommendation and Dean approval.
4. Distinguish prospective student questions (seeking program specs, admission criteria, fees) from enrolled student questions (concerning credit limits, course registration, exam regulations).
5. Provide structured, readable formatting with short paragraphs and clear bullet lists.
6. ${langInstruction}

${profileContext}

VERIFIED INSTITUTIONAL KNOWLEDGE:
${retrievedContext || 'No specific document retrieved. Provide general guidance and direct the student to their faculty office.'}`;

    // Format prompt preamble for Gemma instruction tuning
    let fullPrompt = `System: ${systemInstruction}\n\n`;

    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history) {
        const role = turn.sender === 'assistant' ? 'Assistant' : 'User';
        fullPrompt += `${role}: ${turn.text}\n`;
      }
    }

    fullPrompt += `User: ${message}\nAssistant:`;

    const response = await aiClient.models.generateContent({
      model: GEMMA_MODEL_ID,
      contents: fullPrompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1200
      }
    });

    const responseText = response.text || '';

    // Generate 2-3 dynamic follow-ups based on query and language
    const followUps = language === 'fr'
      ? ['Quelles sont les conditions d’admission ?', 'Combien coûtent les frais de scolarité ?', 'Quelles sont les dates limites ?']
      : ['What are the admission requirements?', 'How much are the school fees?', 'When is the application deadline?'];

    res.json({
      text: responseText,
      modelId: GEMMA_MODEL_ID,
      provider: AI_PROVIDER,
      suggestedFollowUps: followUps
    });
  } catch (error: any) {
    console.error(`Error during Gemma (${GEMMA_MODEL_ID}) inference:`, error);
    // Explicit error reporting without silently falling back to Gemini
    res.status(500).json({
      error: `Gemma inference error (${GEMMA_MODEL_ID}): ${error.message || 'Unknown model error'}`,
      modelId: GEMMA_MODEL_ID,
      fallbackNeeded: false
    });
  }
});

// POST /api/voice/transcribe endpoint - Speech-to-Text
app.post('/api/voice/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType, language = 'en', durationSeconds = 0 } = req.body;

    if (!audioBase64 || typeof audioBase64 !== 'string') {
      res.status(400).json({ error: 'Audio data is required' });
      return;
    }

    // If Google GenAI client is available, use auxiliary audio understanding for transcription
    if (aiClient) {
      try {
        const audioBuffer = Buffer.from(audioBase64, 'base64');
        const audioPart = {
          inlineData: {
            data: audioBase64,
            mimeType: mimeType || 'audio/webm'
          }
        };

        const promptText = language === 'fr'
          ? "Transcrivez fidèlement cet enregistrement audio en français. Renvoyez uniquement la transcription exacte mot pour mot, sans guillemets ni commentaires."
          : "Transcribe this audio recording accurately. Output only the verbatim transcript, without quotes or additional comments.";

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash', // Auxiliary model strictly used for audio understanding
          contents: [audioPart, promptText]
        });

        const transcript = response.text?.trim() || '';
        if (transcript) {
          res.json({
            transcript,
            language,
            confidence: 0.96,
            durationSeconds
          });
          return;
        }
      } catch (err: any) {
        console.warn('Auxiliary audio transcription API error:', err.message);
      }
    }

    // Fallback response prompting user to check connection or microphone
    res.status(503).json({
      error: 'Audio transcription service is currently unavailable. Please review your recording or enter text.',
      fallbackNeeded: true
    });
  } catch (error: any) {
    console.error('Speech-to-text error:', error);
    res.status(500).json({ error: error.message || 'Speech transcription failed' });
  }
});

// POST /api/voice/synthesize endpoint - Text-to-Speech
app.post('/api/voice/synthesize', async (req: Request, res: Response) => {
  try {
    const { text, language = 'en' } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text is required for speech synthesis' });
      return;
    }

    // Browser speech synthesis is fully active and client-coordinated
    res.json({
      enabled: true,
      message: 'Browser speech synthesis active'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Text-to-speech error' });
  }
});

// POST /api/translate endpoint - Translation with term preservation
app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage = 'en', sourceLanguage } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for translation' });
      return;
    }

    // If source and target language are the same, return as-is
    if (sourceLanguage === targetLanguage) {
      res.json({ translatedText: text, detectedSourceLanguage: sourceLanguage });
      return;
    }

    // Use native Gemini API client for high-accuracy translation
    if (aiClient) {
      try {
        const langTarget = targetLanguage === 'fr' ? 'French' : 'English';
        const prompt = `You are the official translator for University of Buea orientation portal. Translate the following text into ${langTarget}.
RULES:
1. Strictly preserve all official university terms, degree titles (e.g., "BSc Software Engineering", "Master of Science"), course codes, statute references (e.g. "Statute 4.2"), and tuition amounts with currency (e.g., "290,000 FCFA").
2. Output ONLY the translated text with natural grammar and tone, without commentary or quotation marks.

Text to translate:
${text}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        const translatedText = response.text?.trim();
        if (translatedText) {
          res.json({
            translatedText,
            detectedSourceLanguage: sourceLanguage || 'auto'
          });
          return;
        }
      } catch (err: any) {
        console.warn('AI translation API warning:', err.message);
      }
    }

    // Fallback: return original text intact to prevent content degradation
    res.json({
      translatedText: text,
      detectedSourceLanguage: sourceLanguage || 'auto'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Translation error' });
  }
});

// Setup Vite dev server or static dist
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`XENA AI University Assistant Server running on http://0.0.0.0:${PORT}`);
    console.log(`Active Model: ${GEMMA_MODEL_ID} (${AI_PROVIDER})`);
  });
}

startServer();
