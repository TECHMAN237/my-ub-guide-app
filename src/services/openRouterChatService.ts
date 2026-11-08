import { UserProfile, ChatMessage, ChatSource } from '../types';
import { AI_CONFIG, validateModelConfiguration } from '../config/aiConfig';
import { getDeterministicAnswer } from './knowledgeService';
import { searchKnowledgeBase } from '../lib/ai/knowledgeBase';

export interface UniversityChatRequest {
  message: string;
  history?: ChatMessage[];
  userProfile?: UserProfile | null;
  language?: 'en' | 'fr';
  forceMockMode?: boolean;
  simulateFailure?: boolean;
}

export interface UniversityChatResponse {
  text: string;
  sources: ChatSource[];
  suggestedFollowUps: string[];
  evidenceStatus: 'Supported by official university sources' | 'General academic orientation' | 'Needs official confirmation';
  mode: 'live' | 'mock-demo';
  modelId: string;
  provider: string;
}

export class OpenRouterChatService {
  private static instance: OpenRouterChatService;

  private constructor() {}

  public static getInstance(): OpenRouterChatService {
    if (!OpenRouterChatService.instance) {
      OpenRouterChatService.instance = new OpenRouterChatService();
    }
    return OpenRouterChatService.instance;
  }

  /**
   * Generates a grounded university answer using the configured AI model
   * through the server-side OpenRouter endpoint.
   */
  public async generateUniversityAnswer(request: UniversityChatRequest): Promise<UniversityChatResponse> {
    const {
      message,
      history = [],
      userProfile = null,
      language = 'en',
      forceMockMode = false,
      simulateFailure = false
    } = request;

    // Strict model identity validation
    const configCheck = validateModelConfiguration(AI_CONFIG.modelId);
    if (!configCheck.isValid) {
      throw new Error(`Configuration Error: ${configCheck.error}`);
    }

    if (simulateFailure) {
      throw new Error(
        language === 'fr'
          ? "Impossible de contacter le service IA. Erreur de connexion au modèle IA via OpenRouter. Veuillez réessayer ou vérifier la configuration."
          : "Unable to contact the AI service. Connection error to the AI model on OpenRouter. Please verify your connection and try again."
      );
    }

    // Grounding: Retrieve institutional facts and documents from University of Buea knowledge base
    const retrieved = searchKnowledgeBase(message, userProfile);

    // Explicit test/mock mode for unit tests or offline demonstrations
    if (forceMockMode) {
      const fallback = getDeterministicAnswer(message, userProfile, language);
      return {
        text: fallback.text,
        sources: fallback.sources.length > 0 ? fallback.sources : retrieved.sources,
        suggestedFollowUps: fallback.suggestedFollowUps,
        evidenceStatus: fallback.sources.length > 0
          ? 'Supported by official university sources'
          : 'General academic orientation',
        mode: 'mock-demo',
        modelId: `${AI_CONFIG.modelId} (Mock Demo Mode)`,
        provider: 'local-knowledge-engine'
      };
    }

    // Never send the current turn twice in history.
    const normalizedHistory = history.slice(-6).filter((turn, index, all) => {
      const isLast = index === all.length - 1;
      return !(isLast && turn.sender === 'user' && turn.text.trim() === message.trim());
    });

    let lastError: Error | null = null;
    const maxRetries = AI_CONFIG.retryCount;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.requestTimeoutMs);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
            message,
            modelId: AI_CONFIG.modelId,
            provider: AI_CONFIG.provider,
            history: normalizedHistory.map((h) => ({
              sender: h.sender,
              text: h.text
            })),
            userProfile: userProfile
              ? {
                  name: userProfile.name,
                  category: userProfile.category,
                  language: userProfile.language,
                  interestedFaculty: userProfile.interestedFaculty,
                  interestedDepartment: userProfile.interestedDepartment,
                  interestedProgram: userProfile.interestedProgram,
                  interestedStudyLevel: userProfile.interestedStudyLevel,
                  faculty: userProfile.faculty,
                  department: userProfile.department,
                  level: userProfile.level,
                  academicYear: userProfile.academicYear,
                  semester: userProfile.semester
                }
              : null,
            retrievedContext: retrieved.contextText,
            language
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          let errMsg = errorData.error;

          if (!errMsg) {
            if (response.status === 404) {
              errMsg = language === 'fr'
                ? "L'endpoint de l'assistant IA (/api/chat) est introuvable (404). Si le projet est déployé sur Vercel, déclenchez un nouveau déploiement pour activer la fonction Serverless."
                : "The assistant API route (/api/chat) was not found (HTTP 404). Please ensure Vercel Serverless Functions are deployed.";
            } else if (response.status === 503) {
              errMsg = language === 'fr'
                ? "Le service IA est indisponible. Veuillez vérifier que 'OPENROUTER_API_KEY' est configuré dans Vercel."
                : "The AI service is unavailable. Please verify that 'OPENROUTER_API_KEY' is configured in Vercel.";
            } else if (response.status === 429) {
              errMsg = language === 'fr'
                ? "Limite de requêtes atteinte pour la clé OpenRouter. Veuillez patienter avant de réessayer."
                : "Rate limit reached for the OpenRouter API key. Please wait a moment and try again.";
            } else if (response.status === 402) {
              errMsg = language === 'fr'
                ? "Le compte OpenRouter n'a plus de crédits. Ajoutez des crédits ou utilisez le mode démonstration."
                : "The OpenRouter account has insufficient credits. Add credits or use demo mode.";
            } else if (response.status === 401 || response.status === 403) {
              errMsg = language === 'fr'
                ? "Clé OpenRouter invalide ou non autorisée. Veuillez vérifier la variable 'OPENROUTER_API_KEY' dans Vercel."
                : "Invalid or unauthorized OpenRouter API key. Please check the 'OPENROUTER_API_KEY' variable in Vercel.";
            } else {
              errMsg = `Server responded with HTTP ${response.status}`;
            }
          }

          // Rate limit (429) or transient 503: retry with backoff
          if ((response.status === 429 || response.status === 503) && attempt < maxRetries) {
            await new Promise((res) => setTimeout(res, 1200 * (attempt + 1)));
            continue;
          }

          throw new Error(errMsg);
        }

        const data = await response.json();

        if (!data || typeof data.text !== 'string') {
          throw new Error('Malformed output received from the OpenRouter inference endpoint');
        }

        return {
          text: data.text,
          sources: (data.sources && data.sources.length > 0) ? data.sources : retrieved.sources,
          suggestedFollowUps: data.suggestedFollowUps || (
            language === 'fr'
              ? ['Quelles sont les conditions d’admission ?', 'Combien coûtent les frais de scolarité ?', 'Quels sont les délais d’inscription ?']
              : ['What are the admission requirements?', 'How much are the school fees?', 'When is course registration?']
          ),
          evidenceStatus: retrieved.sources.length > 0
            ? 'Supported by official university sources'
            : 'General academic orientation',
          mode: 'live',
          modelId: data.modelId || AI_CONFIG.modelId,
          provider: data.provider || AI_CONFIG.provider
        };
      } catch (err: any) {
        if (err.name === 'AbortError') {
          lastError = new Error(`Request to the AI model timed out after ${AI_CONFIG.requestTimeoutMs / 1000} seconds`);
        } else {
          lastError = err;
        }

        if (attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error(`Unable to complete AI inference for model ${AI_CONFIG.modelId}`);
  }
}

export const openRouterChatService = OpenRouterChatService.getInstance();
