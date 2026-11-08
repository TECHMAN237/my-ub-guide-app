# UB Compass — Gemma Model & Voice-First University Orientation Assistant

## Overview
UB Compass is a mobile-first, AI-powered university orientation assistant designed for **Prospective Students** (admission, program discovery, fee structures) and **Enrolled Students** (regulations, credit policies, academic calendar).

This version answers with **Google Gemma models served through OpenRouter** and provides a **voice-first interaction system**.

---

## 1. Gemma Model Architecture (OpenRouter)

### Active Model Identifier
- **Model ID:** `google/gemma-4-31b-it:free` (default, free tier)
- **Fallbacks:** `google/gemma-4-26b-a4b-it:free`
- **Model Family:** Google Gemma
- **Provider:** OpenRouter (`https://openrouter.ai/api/v1/chat/completions`)
- **Translation model:** `google/gemma-4-31b-it:free`

### Strict Anti-Substitution Policy
- The application does not silently substitute Gemini or any non-Gemma model for the conversational chatbot.
- Bare ids without a vendor prefix (`gemma-4-26b-a4b-it`, `gemini-2.5-flash`, …) are rejected by both the client and the API route.
- The default `:free` ids avoid paid-credit requirements; remove the suffix to run on a paid Gemma plan when higher throughput is needed.
- If the configured Gemma model is inaccessible or credentials are missing, an explicit error is surfaced with configuration guidance.
- Unit tests use an explicit, transparent mock mode (`mode: 'mock-demo'`) that never pretends to be live inference.

### Centralized Architecture
Configured in `src/config/aiConfig.ts`; provider calls live in `src/lib/ai/openRouter.ts`, shared by the Express server and the Vercel functions.

```typescript
export const AI_CONFIG = {
  provider: 'openrouter',
  modelId: 'google/gemma-4-31b-it:free',
  displayName: 'Gemma 4 31B (free)',
  temperature: 0.7,
  maxOutputTokens: 1200,
  requestTimeoutMs: 30000,
  retryCount: 2
};
```

Set `OPENROUTER_API_KEY` in `.env` (server only). `OPENROUTER_MODEL` optionally overrides the default model. See `.env.example`.

---

## 2. Voice-First Interaction System

### 2.1 Speech-to-Text (STT) — Speaking to the Assistant
1. **Microphone Access:** Tap the microphone in `ChatComposer` to request browser microphone permissions via `navigator.mediaDevices.getUserMedia`.
2. **Visual Recording Indicator:** Displays an active recording timer (e.g. `00:07 / 02:00`), pulsing red indicator, and animated audio waveform bars.
3. **Controls:**
   - **Stop / Done (`Square`):** Completes recording, stops media tracks, and generates an audio review blob.
   - **Cancel (`X`):** Immediately discards audio and releases microphone hardware.
4. **Transcription:** Audio is sent to `/api/voice/transcribe`. OpenRouter does not expose an audio-transcription endpoint, so the route returns `503` with `fallbackMode: 'browser-web-speech'` and the client uses browser Speech Recognition.
5. **Review & Edit Before Sending:** The transcribed text populates the chat input so students can inspect, edit, or append to their question before sending.
6. **Audio Review Player:** Students can listen back to their recorded voice question directly in the composer.

### 2.2 Text-to-Speech (TTS) — Listening to Answers
1. **Speaker Button:** Integrated into every assistant response bubble.
2. **Natural Spoken Cadence:** Markdown headers (`#`, `##`), bullet markers (`-`, `*`), link syntax (`[text](url)`), and bold tags (`**`) are stripped before synthesis so speech sounds natural.
3. **Unified Audio Coordinator:** Global singleton `ttsService` guarantees only one message can play at a time. Starting any audio immediately halts previous audio.
4. **Playback Controls:** Play, Pause, Resume, Stop, and Replay controls.
5. **Bilingual Synthesis:** High quality French (`fr-FR`) and English (`en-US`) voice support via the browser speech-synthesis engine.

### 2.3 Translation & Multilingual Support
- Supports English and French across UI, voice input, and responses.
- Translation requests are handled server-side through OpenRouter using the configured Gemma model.
- Preserves official university terminology, fee numbers (e.g., `290,000 FCFA`), course codes, and academic statutes during translation.

---

## 3. Running & Testing

### Development
```bash
npm run dev # Starts express server on port 3000 with Vite middleware
```

### Build & Compilation
```bash
npm run build # Compiles Vite frontend
npm run lint  # Checks TypeScript types (tsc --noEmit)
```

### Unit & Integration Tests
```bash
npm run test  # Runs Vitest test suite with mocked providers
```
All unit tests run completely offline without requiring live OpenRouter credentials.
