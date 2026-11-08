# UB Compass Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace the app's assembled, card-heavy interface with a calm, one-accent "quiet assistant" design across all 20 routes, and rename it UB Compass.

**Architecture:** One token layer in `src/index.css` (colour, type, radius, space, primitives) drives every screen. The shell (`AppHeader`, `DrawerMenu`, bottom navigation) and chat primitives are rebuilt first, then the home screen, then the remaining views are converted to the same primitives. No routes, data or AI behaviour change.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind v4, Express, lucide-react, `@fontsource-variable/instrument-sans`.

**Spec:** `docs/superpowers/specs/2026-11-04-ub-compass-redesign-design.md`

## Global Constraints

- One typeface: Instrument Sans Variable, bundled. No runtime webfont.
- One accent: `#1F5A44`. Status colours only for status.
- Five type sizes: display, 24px, 18px, 16px, 14px. Nothing below 14px except 12px numerals in dense tables.
- One radius: 10px for panels, inputs, buttons. Circles for dots/avatars.
- No gradients, glass, glows, resting shadows, uppercase tracked labels, icon-topped card grids, or serif display.
- Every route keeps its existing handler, data and navigation target.
- `localStorage` keys are unchanged.
- Bilingual copy stays valid in EN and FR.

## Review Focus

- A signed-out visitor landing on `/` must see one action and one guest path, not a broken home shell.
- A signed-in student with a saved conversation must still reach it, and the composer must still send, retry and handle the 402 error.
- Long programme, fee and department lists must not overflow at 390px.
- Money and dates must align and stay readable with tabular figures.
- Every icon-only control keeps an accessible name after the visual cleanup.

---

### Task 1: Foundation — tokens, font, metadata

**Files:**
- Modify: `src/index.css` (replace the ledger tokens and utilities)
- Modify: `src/main.tsx` (import the font)
- Modify: `index.html` (title, description, theme colour)
- Modify: `package.json` (add `@fontsource-variable/instrument-sans`)

**Interfaces:**
- Produces: tokens `--ground --surface --raised --ink --muted --faint --accent --accent-soft --accent-edge --positive --negative --warning --radius --shadow-pop`, type vars, and utility classes `.font-display .text-ink .text-muted .text-accent .bg-ground .bg-surface .bg-raised .bg-accent .panel .btn .btn-primary .btn-secondary .btn-ghost .field .row-link .chip .eyebrowless .page-title .page-lede .measure .focus-ring`.

- [ ] Install the font package and import `@fontsource-variable/instrument-sans` in `main.tsx`.
- [ ] Rewrite `:root` with the approved values; keep the existing utility class names so untouched views inherit the new look.
- [ ] Add `.panel` (surface, radius 10, padding 20/24, no shadow), `.btn-*`, `.field`, `.chip` (filter only), `.page-title`, `.page-lede`, `.measure` (65ch).
- [ ] Remove `.cover-card`, `.agenda`, `.ruled-list`, `.divider`, the uppercase `.chip`, and all shadow tokens except `--shadow-pop`.
- [ ] Update `index.html` title/description/`theme-color` to UB Compass.
- [ ] Verify: `npm run lint` and `npm run build` pass; computed body background is `rgb(247,246,242)` and the font is Instrument Sans.

### Task 2: Shell — header, drawer, navigation, layout

**Files:**
- Modify: `src/components/layout/AppHeader.tsx`
- Modify: `src/components/layout/DrawerMenu.tsx`
- Modify: `src/components/layout/BottomNavigation.tsx`
- Modify: `src/components/layout/BottomNav.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: Task 1 tokens.
- Produces: a header with wordmark + desktop links + language + account, a mobile menu, and one bottom navigation component. `App` continues to render `AppHeader` on non-full-screen routes and bottom navigation on mobile.

- [ ] Replace the header brand block with the compass mark and "UB Compass"; add desktop links Home, Chat, Explore, Saved.
- [ ] Restyle the language control and menu trigger as plain 44px targets; no pill chrome.
- [ ] Rebuild the drawer with surface ground, section labels in sentence case at 14px, and plain rows.
- [ ] Keep one bottom navigation implementation (delete the unused duplicate) with Home, Chat, Explore, Saved, Profile; active = accent label, no filled pill.
- [ ] Confirm `App` still hides the shell for `/`, `/auth/*`, `/welcome`, `/setup/*` and keeps the chat header behaviour.
- [ ] Verify: lint; browser at 1440 and 390 shows one nav per width and no overlap.

### Task 3: Chat primitives

**Files:**
- Modify: `src/components/chat/ChatComposer.tsx`
- Modify: `src/components/chat/ChatMessageItem.tsx`
- Modify: `src/components/chat/SuggestedQuestions.tsx`
- Modify: `src/components/common/RobotAvatar.tsx`

**Interfaces:**
- Consumes: Task 1 tokens.
- Produces: unchanged public props for `ChatComposer`, `ChatMessageItem`, `SuggestedQuestions`; `RobotAvatar` visual only.

- [ ] Composer: a white field with one 1px line, 10px radius, textarea + send button inside one row; voice and stop controls remain, all with `aria-label`.
- [ ] Messages: assistant on surface, student on `--raised`; no bubbles with heavy radius; markdown, copy, speak, retry and follow-up controls kept.
- [ ] Suggested questions become plain text buttons in a wrap row, 44px targets, no uppercase heading.
- [ ] Error state: plain sentence plus Retry; the 402 message reads as an account credit issue, not a crash.
- [ ] Verify: lint; type a message in `/chat`, submit, confirm the pending state and a retry control render.

### Task 4: Home and dedicated chat

**Files:**
- Modify: `src/views/HomeChatView.tsx`
- Modify: `src/views/DedicatedChatView.tsx`

**Interfaces:**
- Consumes: Tasks 1–3, `useApp()` (`userProfile`, `userCategory`, `activeConversation`, `sendMessage`, `isSendingMessage`, `chatError`, `retryLastMessage`, `navigateTo`, `createNewConversation`, `checklist`, `calendarEvents`, `fees`).
- Produces: no prop changes; `App` keeps rendering both without menu props.

- [ ] Empty home: display h1 "What do you need to know?", one supporting line, composer, four links (Programmes, Admissions, Fees, Calendar), three recent questions, one next-step strip when signed in. Nothing else.
- [ ] With messages: thread fills the column, composer stays at the bottom, suggestions collapse.
- [ ] Remove the dark chat header, the quick-action icon grid and the three-card dashboard from home.
- [ ] Dedicated chat: one compact title row with back, new chat, history; thread and composer share the home styling.
- [ ] Verify: lint; browser shows one h1, the composer sends, and no card grid remains.

### Task 5: Landing and auth

**Files:**
- Modify: `src/views/SplashView.tsx`
- Modify: `src/views/StaticPagesView.tsx` (login, signup)
- Modify: `src/views/UserTypeSelectionView.tsx`
- Modify: `src/views/ProfileSetupView.tsx`

**Interfaces:**
- Consumes: Tasks 1–2, `loginDemo`, `signupDemo`, `setUserCategory`, profile setup handlers.
- Produces: unchanged submit handlers and routes.

- [ ] Landing: wordmark, display line "University of Buea, made clear.", one sentence, Sign in and Continue as guest, a three-item list of coverage. No cards or fake screenshots.
- [ ] Login/signup: single centred column, 24px h1, labelled fields, one primary action, guest link; remove split marketing panel.
- [ ] User-type and profile setup: plain option rows, sentence-case labels, one primary action.
- [ ] Verify: lint; sign in with the demo account and reach `/home`.

### Task 6: Content screens

**Files:**
- Modify: `src/views/ProgramsListView.tsx`
- Modify: `src/views/ProgramDetailView.tsx`
- Modify: `src/views/ProgramComparisonView.tsx`
- Modify: `src/views/DepartmentsView.tsx`
- Modify: `src/views/AdmissionsView.tsx`
- Modify: `src/views/AdmissionsChecklistView.tsx`
- Modify: `src/views/FeesView.tsx`
- Modify: `src/views/AcademicCalendarView.tsx`
- Modify: `src/views/ResourcesView.tsx`
- Modify: `src/views/ResourceDetailView.tsx`
- Modify: `src/views/SavedItemsView.tsx`
- Modify: `src/views/NotificationsView.tsx`

**Interfaces:**
- Consumes: Task 1 primitives; existing data shapes (`Faculty.departments: string[]`, `CalendarEvent.displayDate/semester/academicYear/officialSource`, `FeeItem.programName/facultyName/paymentSchedule/deadline`, `SavedItem.type`).
- Produces: unchanged route rendering and item ids.

- [ ] Standard page head on every view: 24px h1, one 16px lede, optional action right.
- [ ] Replace card grids with list rows; figures right-aligned with `tabular-nums`.
- [ ] Admissions checklist is a real `<ol>` with a single progress line.
- [ ] Fees grouped by faculty with a payment sequence, no card grid.
- [ ] Calendar grouped by month, next event marked with the accent.
- [ ] Resources and saved: rows plus honest empty states.
- [ ] Verify: lint; browser at 1440 and 390 shows one h1 per route and no horizontal overflow.

### Task 7: Account, static and admin

**Files:**
- Modify: `src/views/ProfileSettingsView.tsx`
- Modify: `src/views/HistoryView.tsx`
- Modify: `src/views/StaticPagesView.tsx` (help, about, privacy)
- Modify: `src/views/AdminView.tsx`
- Modify: `src/components/ui/Toast.tsx`

**Interfaces:**
- Consumes: Task 1 primitives; existing settings handlers.
- Produces: unchanged settings persistence.

- [ ] Profile/settings: labelled form sections, provider and model as plain text, 44px controls.
- [ ] History: plain conversation rows with date and message count.
- [ ] Help/about/privacy: 65ch measure, sentence-case h2s, no accordion chrome.
- [ ] Admin: quiet table, no KPI tiles or icon chips.
- [ ] Toast: surface + one line, no glow.
- [ ] Verify: lint; save a profile change and reload.

### Task 8: Rename and global sweep

**Files:**
- Modify: `README.md`, `metadata.json`, `index.html`, `server.ts`, `src/config/aiConfig.ts`, `src/lib/ai/assistantInstructions.ts`, `src/services/knowledgeService.ts`, `src/data/mockData.ts`, `src/__tests__/productionReadiness.test.ts`, `src/__tests__/knowledgeBase.test.ts`, plus remaining view strings.
- Keep: storage keys in `src/services/storageService.ts`.

- [ ] Replace user-facing "My UB Guide" with "UB Compass"; update descriptions and the API service name.
- [ ] Update test expectations to the new name; do not weaken assertions.
- [ ] Sweep `src` for `uppercase tracking`, `shadow-`, `gradient`, `backdrop-blur`, `bg-[#`, `text-[#`, `rounded-3xl`, `rounded-2xl` and remove leftovers in views.
- [ ] Verify: `python -c`-style grep returns no banned classes; `npm run lint` passes.

### Task 9: Verification

- [ ] `npm run lint` — zero output.
- [ ] `npm test -- --run` — all tests pass; record the file/test counts.
- [ ] `npm run build` — succeeds; record bundle sizes.
- [ ] Browser pass at 1440 and 390 over `/`, `/home`, `/chat`, `/programs`, `/admissions`, `/fees`, `/academic-calendar`, `/departments`, `/resources`, `/saved`, `/profile`, `/help`, `/about`, `/privacy`, `/admin`, `/history`, `/notifications`: one h1 each, zero console errors, no horizontal overflow.
- [ ] Keyboard pass: tab from the header through the home composer and links; focus ring visible.
- [ ] Capture before/after screenshots of home, chat, programmes, fees and login.
- [ ] Report: style dealt, palette and contrasts, what changed, what still fails (including the OpenRouter 402), and every check actually run.

## Self-Review

- Spec coverage: identity (Task 1, 8), shell (2), home (4), auth/landing (5), content (6), account/admin (7), verification (9). Motion is covered by the primitives (press/hover) and existing chat transitions; no entrance animations are added.
- Step scan: each task names exact files and a checkable deliverable.
- Type consistency: no new public props or types; existing interfaces are consumed unchanged.
- Review Focus: signed-out `/`, saved conversation continuity, 390px overflow, numeric alignment, icon labels — each has a verification step in its owning task.
- Proportion: the plan is shorter than the spec and carries only decisions.
