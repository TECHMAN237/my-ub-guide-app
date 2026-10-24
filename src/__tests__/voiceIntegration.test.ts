import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { voiceService } from '../services/voiceService';
import { gemmaChatService } from '../services/gemmaChatService';
import { ttsService } from '../services/ttsService';
import { UserProfile } from '../types';

describe('End-to-End Voice & Gemma Assistant Integration Flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    voiceService.cleanup();
    ttsService.stop();
    vi.restoreAllMocks();
  });

  it('completes the full spoken question -> transcription -> approval -> Gemma answer -> TTS read aloud for Prospective Student', async () => {
    // 1. Spoken audio input from prospective student
    const fakeAudioBlob = new Blob(['prospective voice question audio'], { type: 'audio/webm' });

    // Mock speech-to-text API response
    const mockTranscribeFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/voice/transcribe')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            transcript: 'What are the annual fees for Computer Science?',
            language: 'en',
            confidence: 0.98
          })
        });
      }
      if (url.includes('/api/chat')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            text: 'For Computer Science, total annual fees are 290,000 FCFA broken into 3 instalments.',
            modelId: 'gemma-4-26b-a4b-it',
            provider: 'google-genai',
            suggestedFollowUps: ['How can I pay in instalments?', 'What are the admission requirements?']
          })
        });
      }
      return Promise.resolve({ ok: false });
    });
    vi.stubGlobal('fetch', mockTranscribeFetch);

    // 2. Transcribe voice question
    const transcript = await voiceService.transcribeAudio(fakeAudioBlob, 'en', 4);
    expect(transcript.text).toBe('What are the annual fees for Computer Science?');

    // 3. User reviews and sends approved question to Gemma with prospective student profile
    const prospectiveProfile: UserProfile = {
      id: 'usr-p1',
      name: 'John Prospect',
      email: 'john@gmail.com',
      category: 'prospective',
      language: 'en',
      interestedStudyLevel: 'undergraduate',
      interestedFaculty: 'Faculty of Science',
      interestedDepartment: 'Computer Science'
    };

    const gemmaResponse = await gemmaChatService.generateUniversityAnswer({
      message: transcript.text,
      userProfile: prospectiveProfile,
      language: 'en'
    });

    // 4. Verify Gemma response and sources
    expect(gemmaResponse.modelId).toBe('gemma-4-26b-a4b-it');
    expect(gemmaResponse.text).toContain('290,000 FCFA');
    expect(gemmaResponse.sources.length).toBeGreaterThan(0);
    expect(gemmaResponse.sources.some(s => s.title.includes('Fees'))).toBe(true);

    // 5. User taps speaker button to read answer aloud via TTS
    const speakMock = vi.fn();
    const synthMock = {
      speak: speakMock,
      cancel: vi.fn(),
      getVoices: () => [],
      speaking: false,
      paused: false
    };
    vi.stubGlobal('speechSynthesis', synthMock);
    if (typeof window !== 'undefined') {
      (window as any).speechSynthesis = synthMock;
    }

    await ttsService.speak(gemmaResponse.text, {
      messageId: 'msg-ans-1',
      language: 'en'
    });

    expect(ttsService.getActiveMessageId()).toBe('msg-ans-1');
  });

  it('completes the full flow for Enrolled Student asking about credit regulations', async () => {
    const fakeAudioBlob = new Blob(['enrolled student audio'], { type: 'audio/webm' });

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/voice/transcribe')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            transcript: 'Can I take more than 36 credits this semester?',
            language: 'en',
            confidence: 0.99
          })
        });
      }
      if (url.includes('/api/chat')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            text: 'Under University Academic Regulations, standard maximum load is 36 credits. You may register for up to 42 credits if your CGPA is 3.0 or higher and approved by the Dean.',
            modelId: 'gemma-4-26b-a4b-it',
            provider: 'google-genai'
          })
        });
      }
      return Promise.resolve({ ok: false });
    });
    vi.stubGlobal('fetch', mockFetch);

    const transcript = await voiceService.transcribeAudio(fakeAudioBlob, 'en', 3);
    expect(transcript.text).toContain('36 credits');

    const enrolledProfile: UserProfile = {
      id: 'usr-e1',
      name: 'Ferdinand Tanyi',
      email: 'ferdinand@uni.edu.cm',
      category: 'enrolled',
      faculty: 'Faculty of Science',
      department: 'Computer Science',
      level: 'Level 300',
      language: 'en'
    };

    const gemmaResponse = await gemmaChatService.generateUniversityAnswer({
      message: transcript.text,
      userProfile: enrolledProfile,
      language: 'en'
    });

    expect(gemmaResponse.text).toContain('42 credits');
    expect(gemmaResponse.text).toContain('Dean');
    expect(gemmaResponse.sources.some(s => s.title.includes('Guide') || s.title.includes('Regulations'))).toBe(true);
  });

  it('allows text fallback when voice transcription fails, without breaking the chat', async () => {
    const fakeBlob = new Blob(['bad audio'], { type: 'audio/webm' });

    // Mock transcribe failure
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Transcription failed')));

    await expect(voiceService.transcribeAudio(fakeBlob, 'en')).rejects.toThrow();

    // User types text manually instead; Gemma still answers normally
    const fallbackAnswer = await gemmaChatService.generateUniversityAnswer({
      message: 'When does the semester end?',
      language: 'en',
      forceMockMode: true
    });

    expect(fallbackAnswer.text).toBeDefined();
    expect(fallbackAnswer.sources.length).toBeGreaterThan(0);
  });
});
