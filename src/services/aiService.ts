import { UserProfile, ChatMessage } from '../types';
import { openRouterChatService, UniversityChatResponse } from './openRouterChatService';
import { AI_CONFIG } from '../config/aiConfig';

export type AIResponse = UniversityChatResponse;

export class AIService {
  private static instance: AIService;
  private forceMockMode: boolean = false;
  private simulateFailure: boolean = false;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public setForceMockMode(enabled: boolean): void {
    this.forceMockMode = enabled;
  }

  public isForceMockMode(): boolean {
    return this.forceMockMode;
  }

  public setSimulateFailure(enabled: boolean): void {
    this.simulateFailure = enabled;
  }

  public isSimulatingFailure(): boolean {
    return this.simulateFailure;
  }

  public getModelName(): string {
    return AI_CONFIG.modelId;
  }

  public async sendMessage(
    message: string,
    history: ChatMessage[],
    userProfile: UserProfile | null,
    language: 'en' | 'fr' = 'en'
  ): Promise<AIResponse> {
    if (this.simulateFailure) {
      throw new Error(
        language === 'fr'
          ? "Impossible de contacter le service IA. Erreur de connexion au modèle IA via OpenRouter. Veuillez réessayer ou vérifier la configuration."
          : "Unable to contact the AI service. Connection error to the AI model on OpenRouter. Please verify your connection and try again."
      );
    }

    return openRouterChatService.generateUniversityAnswer({
      message,
      history,
      userProfile,
      language,
      forceMockMode: this.forceMockMode,
      simulateFailure: this.simulateFailure
    });
  }
}

export const aiService = AIService.getInstance();
