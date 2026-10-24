import { GoogleGenAI } from '@google/genai';
import { getSystemInstruction } from '../src/lib/ai/assistantInstructions';
import { searchKnowledgeBase } from '../src/lib/ai/knowledgeBase';

const GEMMA_MODEL_ID = process.env.GEMMA_MODEL_ID || 'gemma-4-26b-a4b-it';
const AI_PROVIDER = process.env.AI_PROVIDER || 'google-genai';

const getSecretApiKey = (): string | undefined => {
  return process.env.gemma_api_key || process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY;
};

export default async function handler(req: any, res: any) {
  // Support POST requests for chat
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST for /api/chat.' });
    return;
  }

  try {
    // Safely parse JSON body if needed
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
      res.status(400).json({ error: 'A valid non-empty user message is required' });
      return;
    }

    const targetModel = (body.modelId || GEMMA_MODEL_ID).toLowerCase();
    if (!targetModel.includes('gemma')) {
      res.status(400).json({
        error: `Model "${targetModel}" is rejected. Only Google Gemma models are permitted for the university chatbot.`,
        fallbackNeeded: false
      });
      return;
    }

    const currentKey = getSecretApiKey();
    if (!currentKey) {
      res.status(503).json({
        error: `Gemma model (${GEMMA_MODEL_ID}) inference requires the secret environment variable 'gemma_api_key' to be configured in Vercel.`,
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
    const knowledgeResult = retrievedContext
      ? { contextText: retrievedContext, sources: [], evidenceStatus: 'Supported by official university sources' as const }
      : searchKnowledgeBase(message, userProfile);

    // Get centralized instructions
    const baseInstructions = getSystemInstruction({ userProfile, language });

    const fullSystemInstruction = `${baseInstructions}

VERIFIED INSTITUTIONAL KNOWLEDGE EVIDENCE (UNIVERSITY OF BUEA - UB AI STUDENT COMPANION KNOWLEDGE BASE):
${knowledgeResult.contextText || 'No specific section matched. Provide general academic guidance and advise confirming with the faculty office.'}`;

    let fullPrompt = `System: ${fullSystemInstruction}\n\n`;

    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history) {
        const role = turn.sender === 'assistant' ? 'Assistant' : 'User';
        fullPrompt += `${role}: ${turn.text}\n`;
      }
    }

    fullPrompt += `User: ${message}\nAssistant:`;

    const response = await client.models.generateContent({
      model: GEMMA_MODEL_ID,
      contents: fullPrompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1200
      }
    });

    const responseText = response.text || '';

    const followUps = language === 'fr'
      ? ['Quelles sont les conditions d’admission ?', 'Combien coûtent les frais de scolarité ?', 'Quelles sont les dates limites ?']
      : ['What are the admission requirements?', 'How much are the school fees?', 'When is the application deadline?'];

    res.status(200).json({
      text: responseText,
      sources: knowledgeResult.sources || [],
      evidenceStatus: knowledgeResult.evidenceStatus || 'Supported by official university sources',
      modelId: GEMMA_MODEL_ID,
      provider: AI_PROVIDER,
      suggestedFollowUps: followUps
    });
  } catch (error: any) {
    console.error(`Error during Gemma (${GEMMA_MODEL_ID}) Vercel serverless inference:`, error);
    res.status(500).json({
      error: `Gemma inference error (${GEMMA_MODEL_ID}): ${error.message || 'Unknown server error'}`,
      modelId: GEMMA_MODEL_ID,
      fallbackNeeded: false
    });
  }
}
