import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ttsService } from '../services/ttsService';

describe('Text-to-Speech (TTS) Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    ttsService.stop();
  });

  afterEach(() => {
    ttsService.stop();
    vi.restoreAllMocks();
  });

  it('strips markdown headers, bullet symbols, bold tags, and URLs for natural cadence', () => {
    const rawMarkdown = `### Academic Regulations
Here are the key points:
* Standard load: **30-36 credits**.
* Additional allowance: **up to 42 credits** with Dean approval.
For details, see [Official Handbook](/handbook).`;

    const cleaned = ttsService.cleanTextForSpeech(rawMarkdown);

    expect(cleaned).not.toContain('###');
    expect(cleaned).not.toContain('**');
    expect(cleaned).not.toContain('[');
    expect(cleaned).not.toContain('](/handbook)');
    expect(cleaned).toContain('Academic Regulations');
    expect(cleaned).toContain('Standard load: 30-36 credits');
    expect(cleaned).toContain('Official Handbook');
  });

  it('coordinates single active audio playback, halting any prior audio', async () => {
    const speakMock = vi.fn();
    const cancelMock = vi.fn();

    // Stub fetch to skip backend TTS and test browser speech coordinator
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Backend TTS disabled')));

    const mockSynth = {
      speak: speakMock,
      cancel: cancelMock,
      getVoices: () => [],
      speaking: false,
      paused: false
    };

    vi.stubGlobal('speechSynthesis', mockSynth);
    if (typeof window !== 'undefined') {
      (window as any).speechSynthesis = mockSynth;
    }

    const onStart1 = vi.fn();
    const onStart2 = vi.fn();

    // Start speaking message 1
    await ttsService.speak('First message', {
      messageId: 'msg-1',
      language: 'en',
      onStart: onStart1
    });

    expect(ttsService.getActiveMessageId()).toBe('msg-1');

    // Starting message 2 must cancel previous speech
    await ttsService.speak('Second message', {
      messageId: 'msg-2',
      language: 'en',
      onStart: onStart2
    });

    expect(cancelMock).toHaveBeenCalled();
    expect(ttsService.getActiveMessageId()).toBe('msg-2');
  });

  it('handles pause, resume, and stop actions cleanly', () => {
    const pauseMock = vi.fn();
    const resumeMock = vi.fn();
    const cancelMock = vi.fn();

    const mockSynth = {
      speak: vi.fn(),
      pause: pauseMock,
      resume: resumeMock,
      cancel: cancelMock,
      getVoices: () => [],
      speaking: true,
      paused: false
    };

    vi.stubGlobal('speechSynthesis', mockSynth);
    if (typeof window !== 'undefined') {
      (window as any).speechSynthesis = mockSynth;
    }

    (ttsService as any).activeMessageId = 'msg-1';

    ttsService.pause();
    expect(pauseMock).toHaveBeenCalled();
    expect(ttsService.isCurrentlyPaused('msg-1')).toBe(true);

    mockSynth.paused = true;
    ttsService.resume();
    expect(resumeMock).toHaveBeenCalled();

    ttsService.stop();
    expect(cancelMock).toHaveBeenCalled();
    expect(ttsService.getActiveMessageId()).toBeNull();
  });
});
