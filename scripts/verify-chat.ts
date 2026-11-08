import 'dotenv/config';
import { searchKnowledgeBase } from '../src/lib/ai/knowledgeBase.js';
import {
  buildModelCandidates,
  chatCompletionWithFallback,
  getErrorMessage,
  resolveOpenRouterModel
} from '../src/lib/ai/openRouter.js';

/**
 * Manual smoke test for the OpenRouter chat pipeline.
 * Run with: npx tsx scripts/verify-chat.ts
 */
async function runVerification() {
  const model = resolveOpenRouterModel();
  console.log(`=== TESTING OPENROUTER GEMMA (${model}) ===\n`);
  console.log('Candidates:', buildModelCandidates().join(', '), '\n');

  const query = 'How much is the total annual fee for Computer Science at University of Buea?';
  const kbResult = searchKnowledgeBase(query);

  const systemMessage = `You are UB Compass, the official University of Buea AI assistant.
VERIFIED INSTITUTIONAL KNOWLEDGE EVIDENCE:
${kbResult.contextText}`;

  try {
    const result = await chatCompletionWithFallback({
      model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: query }
      ]
    });

    console.log(`Model used: ${result.model}`);
    console.log(`Answer:\n${result.text}`);
  } catch (error) {
    console.error(`OpenRouter request failed: ${getErrorMessage(error)}`);
    process.exitCode = 1;
  }
}

runVerification();
