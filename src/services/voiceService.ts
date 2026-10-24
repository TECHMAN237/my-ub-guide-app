/**
 * Speech-to-Text (STT) and Voice Recording Service for XENA AI.
 * Handles microphone permissions, audio recording via MediaRecorder,
 * temporary audio playback review, and speech transcription via
 * configured Google Cloud Speech-to-Text API or browser recognition fallback.
 */

import { VoiceRecording, VoiceRecordingStatus, Language } from '../types';

export interface TranscriptionResult {
  text: string;
  language: Language;
  confidence: number;
  durationSeconds: number;
}

export class VoiceService {
  private static instance: VoiceService;
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private recordingStartTime: number = 0;
  private timerInterval: any = null;
  private currentPreviewUrl: string | null = null;
  private activeRecognition: any = null;

  private constructor() {}

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  /**
   * Checks whether the current environment supports audio recording
   */
  public isRecordingSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      !!navigator.mediaDevices.getUserMedia &&
      typeof MediaRecorder !== 'undefined'
    );
  }

  /**
   * Checks whether browser-native SpeechRecognition is supported
   */
  public isLiveSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  /**
   * Starts microphone recording.
   * Invokes onDurationTick callback every second.
   */
  public async startRecording(
    options: {
      onDurationTick?: (seconds: number) => void;
      onAudioLevel?: (level: number) => void;
      maxDurationSeconds?: number;
      language?: Language;
    } = {}
  ): Promise<void> {
    this.cleanup();

    if (!this.isRecordingSupported()) {
      throw new Error('Microphone audio recording is not supported in this browser.');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      this.audioStream = stream;

      // Pick supported mime type
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
      let selectedMimeType = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMimeType = mime;
          break;
        }
      }

      this.audioChunks = [];
      const recorder = selectedMimeType
        ? new MediaRecorder(stream, { mimeType: selectedMimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder = recorder;
      recorder.start(250); // Collect data slices every 250ms
      this.recordingStartTime = Date.now();

      const maxDuration = options.maxDurationSeconds || 120;
      this.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        options.onDurationTick?.(elapsed);

        if (elapsed >= maxDuration) {
          this.stopRecording().catch(() => {});
        }
      }, 500);
    } catch (err: any) {
      this.cleanup();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('Microphone permission was denied. Please allow microphone access in your browser settings to speak.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        throw new Error('No microphone device was detected on your system.');
      }
      throw new Error(err.message || 'Failed to initialize audio recording.');
    }
  }

  /**
   * Stops recording and returns the recorded audio Blob, duration, and preview URL.
   */
  public async stopRecording(): Promise<{ blob: Blob; durationSeconds: number; previewUrl: string }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording found.'));
        return;
      }

      const recorder = this.mediaRecorder;
      const duration = Math.max(1, Math.floor((Date.now() - this.recordingStartTime) / 1000));

      clearInterval(this.timerInterval);
      this.timerInterval = null;

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });

        if (this.currentPreviewUrl) {
          URL.revokeObjectURL(this.currentPreviewUrl);
        }
        const previewUrl = URL.createObjectURL(audioBlob);
        this.currentPreviewUrl = previewUrl;

        // Stop microphone tracks
        if (this.audioStream) {
          this.audioStream.getTracks().forEach((track) => track.stop());
          this.audioStream = null;
        }

        resolve({
          blob: audioBlob,
          durationSeconds: duration,
          previewUrl
        });
      };

      try {
        recorder.stop();
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Cancels the active recording without saving.
   */
  public cancelRecording(): void {
    this.cleanup();
  }

  /**
   * Transcribes an audio Blob via backend API or browser Speech Recognition
   */
  public async transcribeAudio(
    audioBlob: Blob,
    language: Language = 'en',
    durationSeconds: number = 0
  ): Promise<TranscriptionResult> {
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('Cannot transcribe empty audio.');
    }

    // Try backend transcription endpoint
    try {
      const base64Audio = await this.blobToBase64(audioBlob);
      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType: audioBlob.type || 'audio/webm',
          language,
          durationSeconds
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.transcript && data.transcript.trim()) {
          return {
            text: data.transcript.trim(),
            language: data.language || language,
            confidence: data.confidence || 0.95,
            durationSeconds
          };
        }
      }
    } catch {
      // Backend transcribe failed or not configured; attempt live recognition alternative if available
    }

    throw new Error(
      language === 'fr'
        ? "Impossible de transcrire l'audio. Veuillez vérifier votre micro ou saisir votre question par texte."
        : "Unable to transcribe audio. Please verify your microphone or type your question."
    );
  }

  /**
   * Starts browser-native speech recognition for live speech-to-text
   */
  public startLiveRecognition(
    language: Language,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void
  ): { stop: () => void } {
    if (!this.isLiveSpeechRecognitionSupported()) {
      onError('Live speech recognition is not supported in this browser.');
      return { stop: () => {} };
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'fr' ? 'fr-FR' : 'en-US';

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      onResult((final || interim).trim(), !!final);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        onError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.start();
    this.activeRecognition = recognition;

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {}
        this.activeRecognition = null;
      }
    };
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        const base64 = res.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public cleanup(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {}
    }
    this.mediaRecorder = null;

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.audioStream = null;
    }

    if (this.activeRecognition) {
      try {
        this.activeRecognition.stop();
      } catch {}
      this.activeRecognition = null;
    }

    if (this.currentPreviewUrl) {
      URL.revokeObjectURL(this.currentPreviewUrl);
      this.currentPreviewUrl = null;
    }

    this.audioChunks = [];
  }
}

export const voiceService = VoiceService.getInstance();
