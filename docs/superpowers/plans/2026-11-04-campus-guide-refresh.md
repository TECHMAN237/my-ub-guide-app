# Campus Guide Refresh Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the approved warm editorial campus guide with accessible motion.
**Architecture:** Shared CSS tokens and shell, redesigned welcome/home compositions, existing React state and voice/chat handlers, rendered HyperFrames welcome asset.
**Tech Stack:** React 19, TypeScript, Tailwind 4, Motion, HyperFrames CLI.
**Spec:** `docs/superpowers/specs/2026-11-04-campus-guide-refresh-design.md` (approved in chat).

## Global constraints

Preserve existing uncommitted work, storage, API and business data. No deployment. Use the bundled font, forest accent and warm tonal surfaces. All new controls have EN/FR labels. Reduced motion keeps all content usable.

## Review focus

Guest entry and route shell; narrow mobile header; empty/completed checklist; failed or reduced-motion video; existing conversation/voice/error controls.

## Tasks

1. [x] Shell and shared styles: update `src/index.css`, `src/App.tsx`, `AppHeader.tsx`, `BottomNavigation.tsx`; align header and home on 1100px grid, accessible current-page states and mobile fit. Check TypeScript and browser widths.
2. [x] Home: update `HomeChatView.tsx`, composer styling, and reduced-motion auto-scroll in both chat views. Keep existing props and handlers; show real checklist progress and recent conversations, useful browse destinations, bilingual labels. Check existing tests and browser interactions.
3. [x] Welcome and motion: create `Reveal.tsx`, `CompassJourney.tsx`; update `SplashView.tsx`. Create editable HyperFrames source under `motion/compass-journey/` and rendered video/still under `public/assets/`. Visible content without motion, optional video pauses offscreen and under reduced motion. Validate/render the composition and visually inspect output.
4. [x] Content consistency: update programme filters and rows using shared surfaces, preserving search/filter/save/compare. Check programme and related content routes on mobile.
5. [x] Verify: TypeScript, tests, production build, taste lint/inspection, browser screenshots and interactions at 1440/768/390, reduced motion; request one independent code review, fix material findings, record results.

## Execution notes

Implement inline following the user's approval to proceed. Existing workspace contains extensive prior changes; use a new branch without moving or committing those changes. Keep verification and progress here rather than adding a parallel bookkeeping system.

## Progress

- Planning: complete. Approved direction retained. Native execution chosen to keep dependent visual work together.

- Tasks 1–4: complete. Shell, home, welcome, programmes and shared tokens updated. Existing chat/voice handlers and business data retained.
- Final: fixed chronological calendar selection and recent-question ordering; both regression tests failed before fixes and passed after. Full suite: 58/58 across 14 files; TypeScript and production build pass.
- Browser: nine routes at 1440/768/390, one h1 and no horizontal overflow/broken images; guest, next step, programme search/save/level/comparison, EN/FR and intercepted chat pending/error/retry all pass. Keyboard skip link and reduced-motion fallback pass.
- Production motion: MP4 decodes and advances; manual pause/resume and offscreen/onscreen pause/resume pass; below-fold reveal finishes visible; no runtime exceptions.
- HyperFrames source uses registry stroke-draw primitive. Updated generated CLI pin 0.8.141 → 0.9.10; final check has zero errors and warnings. Render: 720×760, 24fps, 6 seconds, 208,990 bytes, hardware GPU/screenshot capture.
- Taste lint and production inspection: zero FAIL findings. Warm paper palette intentionally retains approved brand. Next-step panel reserves space above its pinned action. Welcome's display title and below-fold sections are deliberate reading-page design; app inspector flags them because the saved direction is app mode. Focus ring and menu shadows, app context labels and pending-chat status are functional.
- No fabricated statistics, campus photos, new business data or provider calls. Existing model/API and microphone transcription were not live-tested; browser chat error tests intercepted requests.
- Work retained in place on codex/campus-guide-refresh, uncommitted alongside preexisting changes. No merge, publish or deployment requested.

- Final screenshot fixes: moved animation pause control inside the visible frame; added explicit search-input inset so the icon does not overlap text. Production build passes after the CSS fixes.
- Build warnings retained: existing Vite native-config `__dirname` warning and 541 KB main JS chunk (161 KB gzip). No runtime dependency was added to the app; Motion was already installed. The generated motion project pins HyperFrames separately.
