# UB Compass: campus guide visual refresh

Date: 2026-11-04
Status: approved in chat; implemented

## Intent

The user dislikes the current UI and requests a more appealing, friendly interface using the taste skill, useful scroll animation, and HyperFrames animation. The current implementation leaves most of the desktop width unused and presents the university's main tasks as text links. Make asking and browsing equally understandable at first glance.

This proposal supersedes the presentation and motion restrictions in the earlier quiet-assistant design. Existing account, AI, storage, voice, language, and navigation behavior stay intact.

## Approaches

1. Cosmetic polish of the narrow assistant: quickest, but retains the sparse composition the user dislikes.
2. Editorial campus guide (recommended implementation choice): use the taste skill's editorial-greeting direction, warm tonal surfaces, a wider aligned grid, an immediately usable assistant, and visible university tasks. Stronger identity without changing the app's data model.
3. Immersive animated campus tour: expressive, but delays the practical student tasks and depends on campus media the repository does not contain.

## Visual direction

Use the dealt editorial-greeting style in `.taste-skill/direction.json`. Keep the bundled Instrument Sans and recognizable forest compass accent. Paper and pale stone surfaces carry most of the composition; forest marks primary actions and selected controls. No invented university statistics, deadlines, testimonials, or photos.

The subject's compass becomes a guide through the actual tasks: discover a programme, prepare an application, and plan university life. A small compass-led route animation supplies the identity the current screen lacks. It is an abstract illustration, not a geographic campus map.

Desktop grid: 1100px = 12 × 77px columns + 11 × 16px gaps. Main assistant spans 8 columns; next step spans 4. Below, common questions and recent activity use balanced columns. Responsive gutters and a single-column reading order on phones. App headings stay compact; only the welcome page gets display-sized type.

## Screen design

- Welcome: concise university headline and supporting sentence; guest action and account action immediately visible; compass journey alongside the copy; a lower section explaining the three real uses of the guide with links to existing routes.
- Home: personal heading where a profile exists, prominent composer, next incomplete checklist task or next calendar milestone from existing state, and a compact four-destination area for Programmes, Admissions, Fees, and Calendar. Common/recent questions remain actionable. Do not create dummy conversations or send questions automatically.
- Shell: a clearer desktop navigation hierarchy with active-state semantics and university context. Keep labelled mobile bottom navigation; ensure header controls fit a 390px viewport. Align shell and content edges.
- Programmes and content views: shared typography, spacing, fields, list rows, and section surfaces carry the new look. Prioritize usability of existing programme search, faculty and level filters, saving, and comparison. Keep long reading pages comfortable rather than stretching prose across the grid.
- Chat: retain working message, voice, error, retry, history, new-conversation and composer behavior; improve surface and spacing consistency with the new shell.

Text sketch, desktop home:

    UB Compass                 Home  Chat  Programmes  Saved       EN  Menu
    Your university, within reach.
    Ask a question, or pick up your next step.
    [ Ask the university assistant ...          ] [ Your next step    ]
    [ Voice                              Send  ] [ Continue          ]
    [ Programmes ] [ Admissions ] [ Fees ] [ Calendar ]
    Common questions                              Recent conversations

## Motion

- Scroll reveal only on below-fold welcome sections and nonessential grouped content: 12–20px travel, 350–500ms, once per group. First-screen headings, composer, and actions are visible immediately. No scroll hijacking or forced horizontal scrolling.
- Existing `motion` dependency handles interface transitions and viewport reveals. Keep keyboard focus stable during route changes. Use transform and opacity to avoid layout shifts.
- HyperFrames produces one short, silent compass journey animation for the welcome screen: the compass moves through programme, application, and study milestones. Route through its motion-graphics workflow. Keep editable composition source and a rendered browser-compatible asset, with explicit dimensions and a still fallback. It must never delay guest entry.
- Respect `prefers-reduced-motion` for scroll, route, chat auto-scroll, and animated media. Pause optional looping media offscreen and provide a labelled pause control if it runs beyond five seconds.

## Scope and constraints

React, TypeScript, Tailwind, Vite and existing state remain the implementation foundation. Preserve storage keys and user data. No backend, provider, account, fee or admissions policy changes. No deployment or external publication. Preserve and extend EN/FR labels for changed controls.

Primary files: `src/index.css`, `src/App.tsx`, shell components, `SplashView.tsx`, `HomeChatView.tsx`, chat presentation, and `ProgramsListView.tsx`. Other views receive shared tokens and targeted spacing fixes if browser checks show inconsistencies. HyperFrames sources live under `motion/compass-journey/`; browser assets under `public/assets/`.

The builder chooses exact copy, responsive breakpoints, radii, motion timing, and illustration details within this direction. A rendering/tooling failure must be reported with its actual error; do not claim a CSS animation was rendered with HyperFrames.

## Verification

- Run TypeScript, existing tests, and production build after implementation.
- Inspect welcome, home, chat, programmes, admissions, fees, calendar, saved, and profile in a real browser; screenshots at desktop, tablet, and 390px mobile.
- Check no horizontal overflow, primary actions visible, one h1 per screen, keyboard focus, readable contrast, and touch targets.
- Exercise guest entry, programme search/filter, save, comparison navigation, chat pending/error/retry, and profile navigation without spending paid AI credits solely for visual QA.
- Check motion enabled and reduced-motion behavior; ensure essential content remains available if animation fails.
- Run the taste lint/inspector and HyperFrames composition checks/render validation where supported; record failures and limitations explicitly.

## Approval

Approve the editorial campus guide direction and this visual/motion scope before product implementation, as required by the local brainstorming skill. This document contains implementation recommendations; the user has not yet approved those specific choices.
