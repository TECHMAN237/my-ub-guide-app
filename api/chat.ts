import { getSystemInstruction } from '../src/lib/ai/assistantInstructions';
import { searchKnowledgeBase } from '../src/lib/ai/knowledgeBase';
import {
  DEFAULT_OPENROUTER_MODEL,
  chatCompletionWithFallback,
  classifyOpenRouterError,
  getErrorMessage,
  getOpenRouterApiKey,
  isPermittedModel,
  mapOpenRouterStatus,
  resolveOpenRouterModel,
  type ChatCompletionMessage
} from '../src/lib/ai/openRouter';

const AI_PROVIDER = 'openrouter';
const CONFIGURED_MODEL = resolveOpenRouterModel();

export default async function handler(req: any, res: any) {
  const reqId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  console.log(`[${reqId}] [CHAT_START] Request received at /api/chat`);

  // Handle GET / diagnostic probe
  if (req.method === 'GET' || req.query?.diagnostic === 'true') {
    res.status(200).json({
      status: 'ok',
      endpoint: '/api/chat',
      reqId,
      hasApiKey: Boolean(getOpenRouterApiKey()),
      configuredModel: CONFIGURED_MODEL,
      provider: AI_PROVIDER,
      executionStage: 'Diagnostic Handshake Successful'
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ reqId, error: 'Method not allowed. Use POST or GET for /api/chat.' });
    return;
  }

  try {
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
      res.status(400).json({ reqId, error: 'A valid non-empty user message is required' });
      return;
    }

    const requestedModel = resolveOpenRouterModel(body.modelId || DEFAULT_OPENROUTER_MODEL);

    if (body.modelId && !isPermittedModel(body.modelId)) {
      res.status(400).json({
        reqId,
        error: `Model "${body.modelId}" is rejected. Use an OpenRouter model id in the form "vendor/model".`,
        fallbackNeeded: false
      });
      return;
    }

    if (!getOpenRouterApiKey()) {
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

    const knowledgeResult = retrievedContext
      ? { contextText: retrievedContext, sources: [], evidenceStatus: 'Supported by official university sources' as const }
      : searchKnowledgeBase(message, userProfile);

    const systemMessage = `${getSystemInstruction({ userProfile, language })}

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

    const followUps = language === 'fr'
      ? ['Quelles sont les conditions d’admission ?', 'Combien coûtent les frais de scolarité ?', 'Quelles sont les dates limites ?']
      : ['What are the admission requirements?', 'How much are the school fees?', 'When is the application deadline?'];

    res.status(200).json({
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
    const userFacingError =
      kind === 'auth'
        ? "Invalid or unauthorized OpenRouter API key. Please check the 'OPENROUTER_API_KEY' environment variable."
        : kind === 'insufficient-credits'
          ? 'The OpenRouter account has insufficient credits, so the assistant cannot answer right now. Add credits to the OpenRouter account or use demo mode.'
          : kind === 'rate-limit'
            ? 'OpenRouter rate limit or quota exceeded. Please wait a moment and try again.'
            : kind === 'not-found'
              ? 'The requested model is not available on OpenRouter for this API key.'
              : `AI inference error: ${getErrorMessage(error)}`;

    console.error(`[${reqId}] [INFERENCE_FAILURE] Code ${statusCode}: ${userFacingError}`);
    res.status(statusCode).json({
      reqId,
      error: userFacingError,
      modelId: CONFIGURED_MODEL,
      provider: AI_PROVIDER,
      details: getErrorMessage(error),
      fallbackNeeded: false
    });
  }
}
