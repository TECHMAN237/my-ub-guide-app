# UB Compass — UI/identity redesign

Date: 2026-11-04
Status: proposed — awaiting approval before implementation.

## Intent

The app's content and routing work, but the interface does not. `/home` stacks a dark
chat header, a capped conversation thread, suggested-topic chips, a composer, a four-tile
quick-action grid and a three-card academic dashboard in one column. Each block is styled
at the same visual volume, with uppercase micro-labels, four text sizes below 12px, mixed
corner radii and a shadow on every card. The result reads as assembled rather than designed.

The redesign makes the assistant the one thing on the screen, moves browsing one tap
deeper, and replaces decoration with hierarchy: one large question, one input, one set of
plain links. The target feeling is a calm, competent university office — not a dashboard,
not a startup landing page.

Why now: the student-facing MVP is otherwise finished; this is the pass that makes it
credible to a first-time visitor.

## Goals

- One clear action on arrival: ask a question.
- A first screen a stranger can explain in five seconds.
- Consistent type scale, spacing, corners and surfaces across all 20 routes.
- Every screen keeps its existing data, routes and behaviour.
- Bilingual EN/FR copy still works.
- Accessible: one h1 per screen, 4.5:1 text contrast, visible focus, 44px touch targets.

## Non-goals

- No new features, no new routes, no data-model changes.
- No changes to the AI provider, knowledge base or API contract.
- No auth/backend work beyond copy and presentation.
- No photography or illustration sourcing; the app is text- and UI-led.

## Anti-goals

- A wall of cards, KPI tiles or icon grids on the home screen.
- Gradients, glass, glows, shadows on resting cards.
- Tiny uppercase letter-spaced labels as section headers.
- Serif display type (the current Georgia titles read dated).
- More than one accent hue.
- A name change that loses local recognition.

## Constraints

- React 19 + TypeScript + Vite + Express + Tailwind v4; keep the stack.
- All 20 existing routes and their handlers must still work.
- OpenRouter Gemma integration and `.env` handling untouched.
- `localStorage` keys stay as they are so existing sessions survive the rename.
- One typeface, loaded from the bundle (no runtime webfont dependency).

## Approaches considered

1. **The quiet assistant (chosen).** Home is the wordmark, one question, one input and four
   text links, plus a single next-step line for signed-in students. Everything else is one
   tap deeper. Fastest to understand, least new machinery, keeps the assistant as the
   product's identity.
2. **Journey stages.** Ask "Where are you now?" and show only that stage's next steps.
   Strongest progressive disclosure, but needs new stage state and a content map for every
   stage; deferred as a later enhancement.
3. **Guide-first portal.** A clean university index with the assistant as a helper. Good for
   browsing, but it is essentially today's shape and caused the overwhelm.

Pick: 1, with a single next-step strip borrowed from 2 so the home still feels personal.

## Identity

**Name:** UB Compass.
**Line:** "Find your way through the University of Buea."
**Mark:** a four-point compass needle drawn as a small inline SVG in the accent colour.
No tile, no gradient, no letter in a black square.
**Voice:** plain, direct, helpful. Sentence case. No exclamation marks, no "Welcome back 👋".

### Palette

Chosen for calm and trust: warm paper instead of clinical white, near-black green-tinted ink,
and one deep forest accent. Green reads growth and steadiness and avoids the default edtech
blue. Measured contrast:

| Role | Value | On | Ratio |
|---|---|---|---|
| Ground (warm paper) | `#F7F6F2` | — | — |
| Surface | `#FFFFFF` | — | — |
| Raised | `#EFEDE7` | — | — |
| Ink | `#15211C` | ground | 15.34:1 |
| Muted | `#5E6B64` | ground / white | 5.16 / 5.58:1 |
| Accent (forest) | `#1F5A44` | ground | 7.46:1 |
| On accent | `#FFFFFF` | accent | 8.06:1 |
| Accent soft | `#E6EFE9` | — | — |
| Accent pressed | `#174533` | — | — |
| Negative | `#A33A32` | ground | 6.05:1 |
| Warning | `#8A5A18` | ground | 5.46:1 |

One accent only. Status colours are for status, never decoration.

### Type

One family: **Instrument Sans Variable** (`@fontsource-variable/instrument-sans`, bundled).
Humanist, friendly, legible at small sizes; not Inter.

Five sizes:

- Display `clamp(2.4rem, 6vw, 3.5rem)`, weight 600, tracking -0.03em, leading 1.05
- Title `1.5rem` (24px), weight 600, tracking -0.01em
- Heading `1.125rem` (18px), weight 600
- Body `1rem` (16px), weight 400, leading 1.55
- Small `0.875rem` (14px), weight 400/500

No uppercase labels. Metadata is small, sentence case, muted. Numerals use
`font-variant-numeric: tabular-nums` wherever figures align.

### Space, edge and surface

- 8px base; screen gutter 20px mobile / 32px desktop; content max 1120px.
- Home column max 720px, centred, generous vertical air.
- Section gap: 32px mobile, 56px desktop. Inside a panel: 16–24px.
- One radius: **10px** for panels, inputs and buttons. Dots and avatars are circles.
- Cards: white or raised surface, no border, no shadow. Separation is a tone step.
- Inputs and tables may use one 1px line because they are controls/data.
- Shadows only for menus and dialogs.

### Components

- **Primary button:** accent fill, white label, 44px min height, radius 10, pressed darkens.
- **Secondary:** raised surface, ink label, no outline.
- **Text link:** accent, underline on hover only.
- **Panel:** surface, radius 10, padding 20/24, optional heading + action row.
- **List row:** 56–64px, title + one muted subline, chevron only when it navigates.
- **Chip:** only for filters, 32px, raised surface; never above a heading as decoration.
- **Header:** wordmark left, three plain links + language + account right on desktop; menu on
  mobile. No bar chrome, no blur.
- **Bottom nav (mobile only):** five items, 12px labels, active = accent label, no pill.

### Motion

Feedback only, 120–180ms, transform/opacity: button press, row hover, menu open, message
arrival. No entrance animations on app screens. All motion drops under
`prefers-reduced-motion`.

## Screens

1. **Landing (`/` unauthenticated, `/welcome`)** — wordmark, display line "University of
   Buea, made clear.", one sentence, two actions (Sign in, Continue as guest), a short
   three-item list of what the assistant covers. No cards, no fake screenshots.
2. **Auth (`/auth/login`, `/auth/signup`)** — single centred column, "Welcome back", email,
   password, primary action, guest link. No marketing half.
3. **Home (`/home`)** — h1 "What do you need to know?", one supporting line, large composer,
   four plain text links, one next-step strip (signed-in only), three recent questions.
   With messages: thread above, composer pinned below, suggestions collapse.
4. **Chat (`/chat`, `/chat/:id`, `/history`)** — same thread language as home, no second
   brand header, clear new-chat and history actions.
5. **Programs / comparison / departments** — h1 + one line, filter chips, list rows with
   title, faculty, duration and one figure; detail pages use definition rows, not cards.
6. **Admissions / checklist** — a real `<ol>` of steps, progress as a single line and bar;
   requirements as a two-column definition list on desktop.
7. **Fees** — grouped fee rows with right-aligned tabular figures, payment schedule as a
   simple sequence, no card grid.
8. **Calendar** — chronological list grouped by month, status in words, one accent mark for
   the next event.
9. **Resources / saved** — list rows, empty states that say what to do next.
10. **Profile / settings** — form sections with labels above fields; provider/model as plain
    text, not a badge cloud.
11. **Help / about / privacy** — readable measure (65ch), h2 sections, no accordion chrome.
12. **Admin / notifications** — app-screen rules: quiet tables, no KPI tiles, no icon chips.

## Implementation order

1. Tokens, fonts, base utilities in `src/index.css`; delete the old ledger language.
2. Shell: `AppHeader`, `DrawerMenu`, `BottomNav`/`BottomNavigation`, `App` layout.
3. Home + dedicated chat + composer/message items.
4. Landing and auth.
5. Programmes, admissions, fees, calendar, resources, saved.
6. Profile, help/about/privacy, admin.
7. Global sweep for banned classes (uppercase tracking, gradients, shadows, tinted icon tiles).
8. Rename strings and metadata; keep storage keys.

## Verification

- `npm run lint` (tsc), `npm test -- --run`, `npm run build` — report actual results.
- Browser pass over all routes at 1440 and 390: one h1 each, zero console errors, no
  horizontal overflow, keyboard focus visible.
- Computed-style checks for contrast on key text and for the single accent.
- Before/after screenshots of home, chat, programmes, fees, auth.
- Design-skill lint/inspect where it can run against the built app; state clearly if it
  cannot drive the authenticated SPA.

## Open items

- Live AI replies still fail with OpenRouter 402 (insufficient credits). The redesign does
  not change that; the error state will be designed to explain it in plain language.
- The rename touches tests and docs that assert "My UB Guide"; update them to the new name
  rather than loosening assertions.
