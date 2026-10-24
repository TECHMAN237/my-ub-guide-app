import { UserProfile, ChatMessage, ChatSource } from '../types';
import { AI_CONFIG, validateGemmaConfiguration } from '../config/aiConfig';
import { getDeterministicAnswer } from './knowledgeService';
import { searchKnowledgeBase } from '../lib/ai/knowledgeBase';

export interface GemmaChatRequest {
  message: string;
  history?: ChatMessage[];
  userProfile?: UserProfile | null;
  language?: 'en' | 'fr';
  forceMockMode?: boolean;
  simulateFailure?: boolean;
}

export interface GemmaChatResponse {
  text: string;
  sources: ChatSource[];
  suggestedFollowUps: string[];
  evidenceStatus: 'Supported by official university sources' | 'General academic orientation' | 'Needs official confirmation';
  mode: 'live' | 'mock-demo';
  modelId: string;
  provider: string;
}

export class GemmaChatService {
  private static instance: GemmaChatService;

  private constructor() {}

  public static getInstance(): GemmaChatService {
    if (!GemmaChatService.instance) {
      GemmaChatService.instance = new GemmaChatService();
    }
    return GemmaChatService.instance;
  }

  /**
   * Generates a grounded university answer using the configured Google Gemma model.
   * Interacts with the backend Gemma inference endpoint without falling back to Gemini.
   */
  public async generateUniversityAnswer(request: GemmaChatRequest): Promise<GemmaChatResponse> {
    const {
      message,
      history = [],
      userProfile = null,
      language = 'en',
      forceMockMode = false,
      simulateFailure = false
    } = request;

    // Strict model identity validation
    const configCheck = validateGemmaConfiguration(AI_CONFIG.modelId);
    if (!configCheck.isValid) {
      throw new Error(`Configuration Error: ${configCheck.error}`);
    }

    if (simulateFailure) {
      throw new Error(
        language === 'fr'
          ? "Impossible de contacter le service IA. Erreur de connexion au modèle Gemma. Veuillez réessayer ou vérifier la configuration."
          : "Unable to contact the AI service. Connection error to Google Gemma model. Please verify your connection and try again."
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

    // Call server-side Gemma inference endpoint with retries and timeout
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
            history: history.slice(-6).map((h) => ({
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
                ? "Le service de modèle Gemma est indisponible. Veuillez vérifier que 'gemma_api_key' est configuré dans Vercel."
                : "The Gemma model service is unavailable. Please verify that 'gemma_api_key' is configured in Vercel.";
            } else if (response.status === 429) {
              errMsg = language === 'fr'
                ? "Limite de requêtes atteinte pour la clé API Gemma. Veuillez patienter avant de réessayer."
                : "Rate limit reached for the Gemma API key. Please wait a moment and try again.";
            } else if (response.status === 401 || response.status === 403) {
              errMsg = language === 'fr'
                ? "Clé API Gemma invalide ou non autorisée. Veuillez vérifier la variable 'gemma_api_key' dans Vercel."
                : "Invalid or unauthorized Gemma API key. Please check the 'gemma_api_key' variable in Vercel.";
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

        // Validate response format
        if (!data || typeof data.text !== 'string') {
          throw new Error('Malformed output received from Gemma inference endpoint');
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
          lastError = new Error(`Request to Gemma model timed out after ${AI_CONFIG.requestTimeoutMs / 1000} seconds`);
        } else {
          lastError = err;
        }

        if (attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
        }
      }
    }

    // Re-throw the explicit Gemma error without silently falling back to Gemini
    throw lastError || new Error(`Unable to complete Gemma inference for model ${AI_CONFIG.modelId}`);
  }
}

export const gemmaChatService = GemmaChatService.getInstance();
