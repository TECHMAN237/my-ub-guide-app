import { describe, it, expect } from 'vitest';
import { getSystemInstruction, ASSISTANT_IDENTITY, CORE_INSTRUCTION_RULES } from '../lib/ai/assistantInstructions';
import { parseKnowledgeBase, searchKnowledgeBase, UB_AI_STUDENT_COMPANION_KNOWLEDGE_BASE, RAW_KNOWLEDGE_BASE } from '../lib/ai/knowledgeBase';
import { openRouterChatService } from '../services/openRouterChatService';
import { AI_CONFIG, validateModelConfiguration } from '../config/aiConfig';
import { UserProfile } from '../types';

describe('Assistant Instructions & Identity', () => {
  it('exports valid product identity and model requirements', () => {
    expect(ASSISTANT_IDENTITY.name).toBe('UB Compass');
    expect(ASSISTANT_IDENTITY.institution).toBe('University of Buea');
    expect(ASSISTANT_IDENTITY.modelRequirement).toBe(AI_CONFIG.modelId);
    expect(ASSISTANT_IDENTITY.provider).toBe(AI_CONFIG.provider);
  });
});
