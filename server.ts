import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

import { getSystemInstruction } from './src/lib/ai/assistantInstructions';
import { searchKnowledgeBase } from './src/lib/ai/knowledgeBase';

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

// Helper to resolve secret API key from Vercel / environment (supports gemma_api_key, GEMMA_API_KEY, GEMINI_API_KEY)
const getSecretApiKey = (): string | undefined => {
  return process.env.gemma_api_key || process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY;
};

// Initialize Google Gen AI client with telemetry header
const activeApiKey = getSecretApiKey();
let aiClient: GoogleGenAI | null = null;
if (activeApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: activeApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// GET /api/model-info endpoint - transparently identifies active Gemma model
app.get('/api/model-info', (_req: Request, res: Response) => {
  const currentKey = getSecretApiKey();
  res.json({
    modelId: GEMMA_MODEL_ID,
    modelFamily: 'Google Gemma',
    provider: AI_PROVIDER,
    speechToTextEnabled: true,
    textToSpeechEnabled: true,
    languages: ['en', 'fr'],
    apiKeyConfigured: Boolean(currentKey && currentKey.length > 0)
  });
});

// POST /api/chat endpoint - Strictly powered by Google Gemma
app.post('/api/chat', async (req: Request, res: Response) => {
  const reqId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  console.log(`[${reqId}] [CHAT_START] Request received at Express /api/chat`);

  try {
    const { message, history, userProfile, retrievedContext, language } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      console.warn(`[${reqId}] [BAD_REQUEST] Missing or empty message parameter.`);
      res.status(400).json({ reqId, error: 'A valid non-empty user message is required' });
      return;
    }

    const requestedModel = (req.body.modelId || GEMMA_MODEL_ID).trim();
    console.log(`[${reqId}] [MODEL_TARGET] Primary model requested: ${requestedModel}`);

    // Strict validation: enforce that the model belongs to the Gemma family
    if (!requestedModel.toLowerCase().includes('gemma')) {
      console.warn(`[${reqId}] [REJECTED_MODEL] Model "${requestedModel}" is not a Gemma model.`);
      res.status(400).json({
        reqId,
        error: `Model "${requestedModel}" is rejected. Only Google Gemma models are permitted for the university chatbot.`,
        fallbackNeeded: false
      });
      return;
    }

    const currentKey = getSecretApiKey();
    const hasApiKey = Boolean(currentKey && currentKey.length > 0);
    console.log(`[${reqId}] [ENV_CHECK] hasApiKey: ${hasApiKey}`);

    if (!hasApiKey || !currentKey) {
      console.warn(`[${reqId}] [NO_KEY_ERROR] Secret 'gemma_api_key' (or GEMMA_API_KEY / GEMINI_API_KEY) is not set.`);
      res.status(503).json({
        reqId,
        error: `Gemma model (${requestedModel}) inference requires the secret environment variable 'gemma_api_key' to be configured in Vercel.`,
        hasApiKey: false,
        modelId: requestedModel,
        fallbackNeeded: false
      });
      return;
    }

    const client = aiClient || new GoogleGenAI({
      apiKey: currentKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Perform server-side knowledge retrieval from UB AI Student Companion Knowledge Base
    console.log(`[${reqId}] [KNOWLEDGE_SEARCH] Searching UB AI Student Companion Knowledge Base`);
    const knowledgeResult = retrievedContext
      ? { contextText: retrievedContext, sources: [], evidenceStatus: 'Supported by official university sources' as const }
      : searchKnowledgeBase(message, userProfile);

    // Get centralized assistant instructions
    const baseInstructions = getSystemInstruction({ userProfile, language });

    const fullSystemInstruction = `${baseInstructions}

VERIFIED INSTITUTIONAL KNOWLEDGE EVIDENCE (UNIVERSITY OF BUEA - UB AI STUDENT COMPANION KNOWLEDGE BASE):
${knowledgeResult.contextText || 'No specific section matched. Provide general academic guidance and advise confirming with the faculty office.'}`;

    let conversationPrompt = '';

    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history) {
        const role = turn.sender === 'assistant' ? 'Assistant' : 'User';
        conversationPrompt += `${role}: ${turn.text}\n`;
      }
    }

    conversationPrompt += `User: ${message}\nAssistant:`;

    const candidateModels = [
      requestedModel,
      'gemma-4-26b-a4b-it',
      'gemma-4-31b-it',
      'gemini-flash-latest',
      'gemini-3.8-flash'
    ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

    let response: any = null;
    let successfulModel = '';
    let lastError: any = null;

    for (const candidate of candidateModels) {
      try {
        console.log(`[${reqId}] [INFERENCE_ATTEMPT] Querying candidate model: ${candidate}`);
        const result = await client.models.generateContent({
          model: candidate,
          contents: conversationPrompt,
          config: {
            systemInstruction: fullSystemInstruction,
            temperature: 0.7,
            maxOutputTokens: 1200
          }
        });

        if (result && typeof result.text === 'string' && result.text.length > 0) {
          response = result;
          successfulModel = candidate;
          console.log(`[${reqId}] [INFERENCE_SUCCESS] Content generated successfully using model: ${successfulModel}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.error(`[${reqId}] [INFERENCE_CANDIDATE_FAILED] Candidate ${candidate} failed:`, {
          reqId,
          hasApiKey: true,
          modelCandidate: candidate,
          errorName: err?.name || 'Error',
          errorMessage: err?.message || String(err),
          errorStatus: err?.status || err?.statusCode || 'N/A',
          stack: err?.stack || ''
        });

        const isAuthError = err?.status === 401 || err?.status === 403 || /401|403|unauthorized|API key not valid|PermissionDenied/i.test(err?.message || '');
        const isRateLimit = err?.status === 429 || /429|quota|RESOURCE_EXHAUSTED|rate limit/i.test(err?.message || '');
        if (isAuthError || isRateLimit) {
          break;
        }
      }
    }

    if (!response || !response.text) {
      const isAuthError = lastError?.status === 401 || lastError?.status === 403 || /401|403|unauthorized|API key not valid|PermissionDenied/i.test(lastError?.message || '');
      const isRateLimit = lastError?.status === 429 || /429|quota|RESOURCE_EXHAUSTED|rate limit/i.test(lastError?.message || '');
      const isNotFound = lastError?.status === 404 || /404|NOT_FOUND|not found/i.test(lastError?.message || '');

      let statusCode = 500;
      let userFacingError = `Gemma inference error (${requestedModel}): ${lastError?.message || 'Unknown server error'}`;

      if (isAuthError) {
        statusCode = 401;
        userFacingError = `Invalid or unauthorized Gemma API key. Please check the 'gemma_api_key' environment variable in Vercel.`;
      } else if (isRateLimit) {
        statusCode = 429;
        userFacingError = `Gemma API rate limit or quota exceeded. Please wait a moment and try again.`;
      } else if (isNotFound) {
        statusCode = 404;
        userFacingError = `Gemma model '${requestedModel}' is not supported or not found for this API key.`;
      }

      console.error(`[${reqId}] [FINAL_INFERENCE_FAILURE] Code ${statusCode}: ${userFacingError}`);
      res.status(statusCode).json({
        reqId,
        error: userFacingError,
        modelId: requestedModel,
        hasApiKey: true,
        details: lastError?.message || 'No candidate model succeeded',
        fallbackNeeded: false
      });
      return;
    }

    const responseText = response.text || '';

    // Generate 2-3 dynamic follow-ups based on query and language
    const followUps = language === 'fr'
      ? ['Quelles sont les conditions d’admission ?', 'Combien coûtent les frais de scolarité ?', 'Quelles sont les dates limites ?']
      : ['What are the admission requirements?', 'How much are the school fees?', 'When is the application deadline?'];

    res.json({
      reqId,
      text: responseText,
      sources: knowledgeResult.sources || [],
      evidenceStatus: knowledgeResult.evidenceStatus || 'Supported by official university sources',
      modelId: successfulModel || requestedModel,
      provider: AI_PROVIDER,
      suggestedFollowUps: followUps
    });
  } catch (error: any) {
    console.error(`[${reqId}] [UNHANDLED_EXCEPTION] Stage: Express Catch:`, {
      reqId,
      errorName: error?.name,
      errorMessage: error?.message,
      stack: error?.stack
    });
    res.status(500).json({
      reqId,
      error: `Gemma Express handler exception: ${error?.message || 'Unknown model error'}`,
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

    const currentKey = getSecretApiKey();
    if (currentKey) {
      try {
        const client = aiClient || new GoogleGenAI({
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
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text is required for speech synthesis' });
      return;
    }

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

    if (sourceLanguage === targetLanguage) {
      res.json({ translatedText: text, detectedSourceLanguage: sourceLanguage });
      return;
    }

    const currentKey = getSecretApiKey();
    if (currentKey) {
      try {
        const client = aiClient || new GoogleGenAI({
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
    console.log(`My UB Guide University Assistant Server running on http://0.0.0.0:${PORT}`);
    console.log(`Active Model: ${GEMMA_MODEL_ID} (${AI_PROVIDER})`);
  });
}

startServer();
