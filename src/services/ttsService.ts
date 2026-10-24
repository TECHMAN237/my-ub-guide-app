/**
 * Text-to-Speech (TTS) Service for XENA AI.
 * Converts university orientation guidance into clear spoken voice.
 * Supports English and French, Markdown stripping for natural speech cadence,
 * and unified playback coordination (single active speaker).
 */

export interface TTSPlaybackOptions {
  messageId: string;
  language: 'en' | 'fr';
  speechRate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: string) => void;
  onPause?: () => void;
  onResume?: () => void;
}

export class TTSService {
  private static instance: TTSService;
  private currentUtterance: any = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private activeMessageId: string | null = null;
  private isPaused: boolean = false;
  private currentOptions: TTSPlaybackOptions | null = null;

  private constructor() {}

  public static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  private getSynthesis(): any {
    if (typeof window !== 'undefined' && (window as any).speechSynthesis) {
      return (window as any).speechSynthesis;
    }
    if (typeof speechSynthesis !== 'undefined') {
      return speechSynthesis;
    }
    return null;
  }

  /**
   * Cleans Markdown syntax, table formatting, and source metadata from text
   * so it sounds natural when spoken.
   */
  public cleanTextForSpeech(text: string): string {
    if (!text) return '';

    let cleaned = text
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove Markdown headers (#, ##, ###)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold and italics (**, *, __, _)
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove markdown links [Label](url) -> Label
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Replace bullet points with pauses
      .replace(/^[\*\-\+]\s+/gm, ', ')
      .replace(/^\d+\.\s+/gm, ', ')
      // Clean up multiple punctuation/whitespace
      .replace(/\s+/g, ' ')
      .replace(/,\s*,/g, ',')
      .trim();

    return cleaned;
  }

  /**
   * Reads assistant response aloud.
   * Immediately halts any previous audio playback.
   */
  public async speak(text: string, options: TTSPlaybackOptions): Promise<void> {
    // Stop any existing playback first
    this.stop();

    this.activeMessageId = options.messageId;
    this.currentOptions = options;
    this.isPaused = false;

    const cleanedText = this.cleanTextForSpeech(text);
    if (!cleanedText) {
      options.onEnd?.();
      return;
    }

    // Try Google Cloud TTS backend endpoint first if available
    try {
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanedText,
          language: options.language
        })
      });

      if (response && response.ok) {
        const data = await response.json();
        if (data.audioContent) {
          const audio = new Audio(`data:${data.mimeType || 'audio/mp3'};base64,${data.audioContent}`);
          this.currentAudioElement = audio;

          audio.onplay = () => options.onStart?.();
          audio.onended = () => {
            this.activeMessageId = null;
            options.onEnd?.();
          };
          audio.onerror = () => {
            this.fallbackToBrowserSynthesis(cleanedText, options);
          };

          await audio.play();
          return;
        }
      }
    } catch {
      // Backend TTS not configured or network failed; proceed to browser speech synthesis
    }

    // High fidelity browser speech synthesis fallback
    this.fallbackToBrowserSynthesis(cleanedText, options);
  }

  private fallbackToBrowserSynthesis(text: string, options: TTSPlaybackOptions): void {
    const synth = this.getSynthesis();
    if (!synth) {
      options.onError?.('Speech synthesis is not supported in this browser.');
      this.activeMessageId = null;
      return;
    }

    try {
      synth.cancel?.();

      const UtteranceClass = (typeof window !== 'undefined' && (window as any).SpeechSynthesisUtterance)
        ? (window as any).SpeechSynthesisUtterance
        : class {
            text: string;
            lang: string = 'en';
            rate: number = 1.0;
            voice: any = null;
            onstart: (() => void) | null = null;
            onend: (() => void) | null = null;
            onerror: ((e: any) => void) | null = null;
            constructor(t: string) { this.text = t; }
          };

      const utterance = new UtteranceClass(text);
      utterance.lang = options.language === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = options.speechRate || 1.0;

      // Select voice matching the language if available
      const voices = synth.getVoices ? synth.getVoices() : [];
      if (voices && voices.length > 0) {
        const targetLang = options.language === 'fr' ? 'fr' : 'en';
        const matchingVoice = voices.find(
          (v: any) => v.lang && v.lang.toLowerCase().startsWith(targetLang) && !v.name?.includes('Google') === false
        ) || voices.find((v: any) => v.lang && v.lang.toLowerCase().startsWith(targetLang));

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        this.activeMessageId = null;
        this.currentUtterance = null;
        options.onEnd?.();
      };

      utterance.onerror = (e: any) => {
        if (e && (e.error === 'canceled' || e.error === 'interrupted')) {
          return;
        }
        this.activeMessageId = null;
        this.currentUtterance = null;
        options.onError?.(`Speech synthesis error: ${e?.error || 'playback error'}`);
      };

      this.currentUtterance = utterance;
      synth.speak?.(utterance);
    } catch (err: any) {
      this.activeMessageId = null;
      options.onError?.(err.message || 'Speech synthesis failed');
    }
  }

  public pause(): void {
    const synth = this.getSynthesis();
    if (this.currentAudioElement && !this.currentAudioElement.paused) {
      this.currentAudioElement.pause();
      this.isPaused = true;
      this.currentOptions?.onPause?.();
    } else if (synth && synth.speaking) {
      synth.pause?.();
      this.isPaused = true;
      this.currentOptions?.onPause?.();
    }
  }

  public resume(): void {
    const synth = this.getSynthesis();
    if (this.currentAudioElement && this.currentAudioElement.paused) {
      this.currentAudioElement.play().catch(() => {});
      this.isPaused = false;
      this.currentOptions?.onResume?.();
    } else if (synth && synth.paused) {
      synth.resume?.();
      this.isPaused = false;
      this.currentOptions?.onResume?.();
    }
  }

  public stop(): void {
    const synth = this.getSynthesis();
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }

    if (synth) {
      synth.cancel?.();
    }

    this.currentUtterance = null;
    this.activeMessageId = null;
    this.isPaused = false;
  }

  public getActiveMessageId(): string | null {
    return this.activeMessageId;
  }

  public isCurrentlyPlaying(messageId?: string): boolean {
    if (messageId) {
      return this.activeMessageId === messageId && !this.isPaused;
    }
    return this.activeMessageId !== null && !this.isPaused;
  }

  public isCurrentlyPaused(messageId?: string): boolean {
    if (messageId) {
      return this.activeMessageId === messageId && this.isPaused;
    }
    return this.isPaused;
  }
}

export const ttsService = TTSService.getInstance();
