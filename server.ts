import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { getSystemInstruction } from './src/lib/ai/assistantInstructions';
import { searchKnowledgeBase } from './src/lib/ai/knowledgeBase';
import {
  DEFAULT_OPENROUTER_MODEL,
  OPENROUTER_TRANSLATION_MODEL,
  chatCompletionWithFallback,
  chatCompletion,
  classifyOpenRouterError,
  getErrorMessage,
  getOpenRouterApiKey,
  isPermittedModel,
  mapOpenRouterStatus,
  resolveOpenRouterModel,
  type ChatCompletionMessage
} from './src/lib/ai/openRouter';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limit to support audio uploads for speech transcription
app.use(express.json({ limit: '15mb' }));

const AI_PROVIDER = 'openrouter';
const CONFIGURED_MODEL = resolveOpenRouterModel();

// GET /api/model-info endpoint - transparently identifies the active model
app.get('/api/model-info', (_req: Request, res: Response) => {
  const apiKey = getOpenRouterApiKey();
  res.json({
    modelId: CONFIGURED_MODEL,
    modelFamily: 'OpenRouter free model',
    provider: AI_PROVIDER,
    speechToTextEnabled: false,
    speechToTextMode: 'browser-web-speech',
    textToSpeechEnabled: true,
    translationEnabled: true,
    languages: ['en', 'fr'],
    apiKeyConfigured: Boolean(apiKey)
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'UB Compass API',
    time: new Date().toISOString(),
    hasApiKey: Boolean(getOpenRouterApiKey()),
    provider: AI_PROVIDER,
    modelId: CONFIGURED_MODEL
  });
});

// POST /api/chat endpoint - powered by OpenRouter
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

    const requestedModel = resolveOpenRouterModel(req.body?.modelId || DEFAULT_OPENROUTER_MODEL);
    console.log(`[${reqId}] [MODEL_TARGET] Primary model requested: ${requestedModel}`);

    // Strict validation: enforce an OpenRouter-style vendor/model id
    if (req.body?.modelId && !isPermittedModel(req.body.modelId)) {
      console.warn(`[${reqId}] [REJECTED_MODEL] Model "${req.body.modelId}" is not a permitted OpenRouter model id.`);
      res.status(400).json({
        reqId,
        error: `Model "${req.body.modelId}" is rejected. Use an OpenRouter model id in the form "vendor/model".`,
        fallbackNeeded: false
      });
      return;
    }

    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
      console.warn(`[${reqId}] [NO_KEY_ERROR] Secret 'OPENROUTER_API_KEY' is not set.`);
      res.status(503).json({
        reqId,
        error: `OpenRouter inference (${requestedModel}) requires the 'OPENROUTER_API_KEY' environment variable.`,
        hasApiKey: false,
        modelId: requestedModel,
        provider: AI_PROVIDER,
        fallbackNeeded: false
      });
      return;
    }

    // Perform server-side knowledge retrieval from UB AI Student Companion Knowledge Base
    console.log(`[${reqId}] [KNOWLEDGE_SEARCH] Searching UB AI Student Companion Knowledge Base`);
    const knowledgeResult = retrievedContext
      ? { contextText: retrievedContext, sources: [], evidenceStatus: 'Supported by official university sources' as const }
      : searchKnowledgeBase(message, userProfile);

    const baseInstructions = getSystemInstruction({ userProfile, language });

    const systemMessage = `${baseInstructions}

VERIFIED INSTITUTIONAL KNOWLEDGE EVIDENCE (UNIVERSITY OF BUEA - UB AI STUDENT COMPANION KNOWLEDGE BASE):
${knowledgeResult.contextText || 'No specific section matched. Provide general academic guidance and advise confirming with the faculty office.'}`;

    const messages: ChatCompletionMessage[] = [{ role: 'system', content: systemMessage }];

    if (Array.isArray(history)) {
      for (const turn of history.slice(-10)) {
        if (!turn || typeof turn.text !== 'string' || !turn.text.trim()) continue;
        messages.push({
          role: turn.sender === 'assistant' ? 'assistant' : 'user',
          content: turn.text
        });
      }
    }

    // Avoid duplicating the current user turn when the client passes the full history.
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'user' || last.content.trim() !== message.trim()) {
      messages.push({ role: 'user', content: message });
    }

    const result = await chatCompletionWithFallback({
      model: requestedModel,
      messages,
      temperature: 0.7,
      maxTokens: 1200
    });

    console.log(`[${reqId}] [INFERENCE_SUCCESS] Content generated using model: ${result.model}`);

    const followUps = language === 'fr'
      ? ['Quelles sont les conditions d’admission ?', 'Combien coûtent les frais de scolarité ?', 'Quelles sont les dates limites ?']
      : ['What are the admission requirements?', 'How much are the school fees?', 'When is the application deadline?'];

    res.json({
      reqId,
      text: result.text,
      sources: knowledgeResult.sources || [],
      evidenceStatus: knowledgeResult.evidenceStatus || 'Supported by official university sources',
      modelId: result.model,
      provider: AI_PROVIDER,
      suggestedFollowUps: followUps
    });
  } catch (error: unknown) {
    const kind = classifyOpenRouterError(error);
    const statusCode = mapOpenRouterStatus((error as any)?.status ?? 500);
    const messages: Record<typeof kind, string> = {
      auth: "Invalid or unauthorized OpenRouter API key. Please check the 'OPENROUTER_API_KEY' environment variable.",
      'insufficient-credits':
        'The OpenRouter account has insufficient credits, so the assistant cannot answer right now. Add credits to the OpenRouter account or use demo mode.',
      'rate-limit': 'OpenRouter rate limit or quota exceeded. Please wait a moment and try again.',
      'not-found': 'The requested model is not available on OpenRouter for this API key.',
      server: `OpenRouter is temporarily unavailable: ${getErrorMessage(error)}`,
      unknown: `AI inference error: ${getErrorMessage(error)}`
    };

    console.error(`[${reqId}] [INFERENCE_FAILURE] Code ${statusCode}: ${messages[kind]}`);
    res.status(statusCode).json({
      reqId,
      error: messages[kind],
      modelId: CONFIGURED_MODEL,
      provider: AI_PROVIDER,
      details: getErrorMessage(error),
      fallbackNeeded: false
    });
  }
});

// POST /api/voice/transcribe endpoint - Speech-to-Text
// OpenRouter does not proxy audio transcription. The client falls back to the
// browser Web Speech API, so this endpoint reports that clearly instead of failing silently.
app.post('/api/voice/transcribe', (req: Request, res: Response) => {
  const { audioBase64 } = req.body || {};

  if (!audioBase64 || typeof audioBase64 !== 'string') {
    res.status(400).json({ error: 'Audio data is required' });
    return;
  }

  res.status(503).json({
    error: 'Server-side audio transcription is not available with the OpenRouter provider. The browser speech recognition fallback will be used instead.',
    provider: AI_PROVIDER,
    fallbackNeeded: true,
    fallbackMode: 'browser-web-speech'
  });
});

// POST /api/voice/synthesize endpoint - Text-to-Speech
app.post('/api/voice/synthesize', (req: Request, res: Response) => {
  const { text } = req.body || {};
  if (!text) {
    res.status(400).json({ error: 'Text is required for speech synthesis' });
    return;
  }

  res.json({
    enabled: true,
    mode: 'browser-speech-synthesis',
    message: 'Browser speech synthesis active'
  });
});

// POST /api/translate endpoint - Translation with term preservation
app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage = 'en', sourceLanguage } = req.body || {};

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for translation' });
      return;
    }

    if (sourceLanguage === targetLanguage) {
      res.json({ translatedText: text, detectedSourceLanguage: sourceLanguage });
      return;
    }

    if (!getOpenRouterApiKey()) {
      res.json({ translatedText: text, detectedSourceLanguage: sourceLanguage || 'auto' });
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

      res.json({
        translatedText: result.text,
        detectedSourceLanguage: sourceLanguage || 'auto'
      });
      return;
    } catch (err: unknown) {
      console.warn('OpenRouter translation warning:', getErrorMessage(err));
    }

    res.json({
      translatedText: text,
      detectedSourceLanguage: sourceLanguage || 'auto'
    });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) || 'Translation error' });
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
    console.log(`UB Compass University Assistant Server running on http://0.0.0.0:${PORT}`);
    console.log(`Active Model: ${CONFIGURED_MODEL} (${AI_PROVIDER})`);
    console.log(`OpenRouter key configured: ${Boolean(getOpenRouterApiKey())}`);
  });
}

startServer();
