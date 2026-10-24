import { GoogleGenAI } from '@google/genai';
import { getSystemInstruction } from '../src/lib/ai/assistantInstructions';
import { searchKnowledgeBase } from '../src/lib/ai/knowledgeBase';

const DEFAULT_GEMMA_MODEL = process.env.GEMMA_MODEL_ID || 'gemma-4-26b-a4b-it';
const AI_PROVIDER = process.env.AI_PROVIDER || 'google-genai';

const getSecretApiKey = (): string | undefined => {
  return process.env.gemma_api_key || process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY;
};

export default async function handler(req: any, res: any) {
  const reqId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  console.log(`[${reqId}] [CHAT_START] Request received at /api/chat`);

  // Support POST requests for chat
  if (req.method !== 'POST') {
    console.warn(`[${reqId}] [METHOD_NOT_ALLOWED] Method ${req.method} is not allowed.`);
    res.status(405).json({ reqId, error: 'Method not allowed. Use POST for /api/chat.' });
    return;
  }

  try {
    // Safely parse JSON body if string
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const { message, history, userProfile, retrievedContext, language } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      console.warn(`[${reqId}] [BAD_REQUEST] Missing or empty message parameter.`);
      res.status(400).json({ reqId, error: 'A valid non-empty user message is required' });
      return;
    }

    const requestedModel = (body.modelId || DEFAULT_GEMMA_MODEL).trim();
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

    const client = new GoogleGenAI({
      apiKey: currentKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Server-side knowledge base retrieval
    console.log(`[${reqId}] [KNOWLEDGE_SEARCH] Performing search in UB AI Student Companion Knowledge Base`);
    const knowledgeResult = retrievedContext
      ? { contextText: retrievedContext, sources: [], evidenceStatus: 'Supported by official university sources' as const }
      : searchKnowledgeBase(message, userProfile);

    // Get centralized system instructions
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

    // Candidate model sequence for high availability
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

    const followUps = language === 'fr'
      ? ['Quelles sont les conditions d’admission ?', 'Combien coûtent les frais de scolarité ?', 'Quelles sont les dates limites ?']
      : ['What are the admission requirements?', 'How much are the school fees?', 'When is the application deadline?'];

    res.status(200).json({
      reqId,
      text: responseText,
      sources: knowledgeResult.sources || [],
      evidenceStatus: knowledgeResult.evidenceStatus || 'Supported by official university sources',
      modelId: successfulModel || requestedModel,
      provider: AI_PROVIDER,
      suggestedFollowUps: followUps
    });
  } catch (error: any) {
    console.error(`[${reqId}] [UNHANDLED_EXCEPTION] Stage: Global Handler Catch:`, {
      reqId,
      errorName: error?.name,
      errorMessage: error?.message,
      stack: error?.stack
    });
    res.status(500).json({
      reqId,
      error: `Gemma serverless handler exception: ${error?.message || 'Unknown server error'}`,
      modelId: DEFAULT_GEMMA_MODEL,
      fallbackNeeded: false
    });
  }
}

