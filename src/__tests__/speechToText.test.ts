import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { voiceService } from '../services/voiceService';

describe('Speech-to-Text & Voice Recording Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    voiceService.cleanup();
    vi.restoreAllMocks();
  });

  it('detects recording support correctly based on browser capabilities', () => {
    // Under default jsdom, navigator.mediaDevices is mocked or undefined
    const supported = voiceService.isRecordingSupported();
    expect(typeof supported).toBe('boolean');
  });

  it('rejects recording when media devices are unavailable', async () => {
    vi.stubGlobal('navigator', { mediaDevices: undefined });
    await expect(voiceService.startRecording()).rejects.toThrow(/not supported/);
  });

  it('handles microphone permission denial gracefully', async () => {
    const error = new Error('Permission denied');
    error.name = 'NotAllowedError';

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia: vi.fn().mockRejectedValue(error)
      }
    });
    vi.stubGlobal('MediaRecorder', class {
      static isTypeSupported() { return true; }
    });

    await expect(voiceService.startRecording()).rejects.toThrow(/Microphone permission was denied/);
  });

  it('sends audio to backend transcription endpoint and returns text with confidence', async () => {
    const fakeBlob = new Blob(['dummy audio content'], { type: 'audio/webm' });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        transcript: 'What is the application deadline for engineering?',
        language: 'en',
        confidence: 0.98
      })
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await voiceService.transcribeAudio(fakeBlob, 'en', 5);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.text).toBe('What is the application deadline for engineering?');
    expect(result.language).toBe('en');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('rejects empty audio blobs during transcription', async () => {
    const emptyBlob = new Blob([], { type: 'audio/webm' });
    await expect(voiceService.transcribeAudio(emptyBlob, 'en')).rejects.toThrow(/Cannot transcribe empty audio/);
  });

  it('cleans up stream tracks and resources on cancel', () => {
    const mockTrack = { stop: vi.fn() };
    (voiceService as any).audioStream = {
      getTracks: () => [mockTrack]
    };

    voiceService.cancelRecording();
    expect(mockTrack.stop).toHaveBeenCalled();
    expect((voiceService as any).audioStream).toBeNull();
  });
});
