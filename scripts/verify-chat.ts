import { searchKnowledgeBase } from '../src/lib/ai/knowledgeBase.js';
import { GoogleGenAI } from '@google/genai';

async function runVerification() {
  console.log('=== TESTING GEMINI FLASH MODELS ===\n');

  const key = process.env.gemma_api_key || process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('No API key found in environment');
    return;
  }

  const client = new GoogleGenAI({
    apiKey: key,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  const query = 'How much is the total annual fee for Computer Science at University of Buea?';
  const kbResult = searchKnowledgeBase(query);

  const systemInstruction = `You are My UB Guide, official University of Buea AI Assistant.
VERIFIED INSTITUTIONAL KNOWLEDGE EVIDENCE:
${kbResult.contextText}`;

  const userPrompt = `User: ${query}\nAssistant:`;

  const modelsToTest = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro', 'gemini-3.8-flash'];

  for (const modelId of modelsToTest) {
    console.log(`Testing model ${modelId}...`);
    try {
      const res = await client.models.generateContent({
        model: modelId,
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 300
        }
      });
      console.log(`[SUCCESS ${modelId}]: "${(res.text || '').trim().substring(0, 150)}..."\n`);
      break; // Stop at first succeeding model
    } catch (err: any) {
      console.error(`[FAIL ${modelId}]:`, err.message, '\n');
    }
  }
}

runVerification().catch(console.error);
