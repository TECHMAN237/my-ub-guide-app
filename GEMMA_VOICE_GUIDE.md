# XENA AI — Gemma Model & Voice-First University Orientation Assistant

## Overview
XENA AI is a mobile-first, AI-powered university orientation assistant designed for **Prospective Students** (admission, program discovery, fee structures) and **Enrolled Students** (regulations, credit policies, academic calendar).

This version implements the **Google Gemma Model Architecture** and a **Voice-First Interaction System**.

---

## 1. Google Gemma Model Architecture

### Active Model Identifier
- **Model ID:** `gemma-4-26b-a4b-it` (Gemma 4 26B A4B Instruction-Tuned)
- **Model Family:** Google Gemma
- **Provider:** `google-genai` (Google GenAI SDK `@google/genai`)
- **Telemetry Header:** `User-Agent: aistudio-build`

### Strict Anti-Substitution Policy
- The application does not silently substitute Gemini Flash, Gemini Pro, or any non-Gemma model for the conversational chatbot.
- If the configured Gemma model is inaccessible or credentials are missing, an explicit error is surfaced with configuration guidance.
- Unit tests use an explicit, transparent mock mode (`mode: 'mock-demo'`) that never pretends to be live inference.

### Centralized Zero-Config Architecture
Configured in `src/config/aiConfig.ts` with built-in sensible defaults:
```typescript
export const AI_CONFIG = {
  provider: 'google-genai',
  modelId: 'gemma-4-26b-a4b-it',
  displayName: 'Google Gemma 4 26B A4B IT',
  temperature: 0.7,
  maxOutputTokens: 1200,
  requestTimeoutMs: 25000,
  retryCount: 2
};
```
No manual environment variables are required in Google AI Studio. The system uses the automatically provided `GEMINI_API_KEY` for Gemma inference, auxiliary audio transcription, and multilingual translation.

---

## 2. Voice-First Interaction System

### 2.1 Speech-to-Text (STT) — Speaking to the Assistant
1. **Microphone Access:** Tap the microphone in `ChatComposer` to request browser microphone permissions via `navigator.mediaDevices.getUserMedia`.
2. **Visual Recording Indicator:** Displays an active recording timer (e.g. `00:07 / 02:00`), pulsing red indicator, and animated audio waveform bars.
3. **Controls:**
   - **Stop / Done (`Square`):** Completes recording, stops media tracks, and generates an audio review blob.
   - **Cancel (`X`):** Immediately discards audio and releases microphone hardware.
4. **Transcription:** Audio is sent to `/api/voice/transcribe` via Google Cloud Speech-to-Text / auxiliary audio understanding, with browser Speech Recognition fallback.
5. **Review & Edit Before Sending:** The transcribed text populates the chat input so students can inspect, edit, or append to their question before sending.
6. **Audio Review Player:** Students can listen back to their recorded voice question directly in the composer.

### 2.2 Text-to-Speech (TTS) — Listening to Answers
1. **Speaker Button:** Integrated into every assistant response bubble.
2. **Natural Spoken Cadence:** Markdown headers (`#`, `##`), bullet markers (`-`, `*`), link syntax (`[text](url)`), and bold tags (`**`) are stripped before synthesis so speech sounds natural.
3. **Unified Audio Coordinator:** Global singleton `ttsService` guarantees only one message can play at a time. Starting any audio immediately halts previous audio.
4. **Playback Controls:** Play, Pause, Resume, Stop, and Replay controls.
5. **Bilingual Synthesis:** High quality French (`fr-FR`) and English (`en-US`) voice support.

### 2.3 Translation & Multilingual Support
- Supports English and French across UI, voice input, and responses.
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
All unit tests run completely offline without requiring live Google API credentials.
