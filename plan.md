# SusWord — Full Revamp Plan

> **Audit basis**: Applied `frontend-design`, `better-layout`, and `better-ui` skills to every file in the codebase. Findings below drive a phased, opinionated overhaul.

---

## Table of Contents

1. [Audit Summary — What's Wrong Now](#1-audit-summary)
2. [Design Direction](#2-design-direction)
3. [Phase 1 — Color & Token System](#3-phase-1--color--token-system)
4. [Phase 2 — Typography](#4-phase-2--typography)
5. [Phase 3 — Layout & Spacing](#5-phase-3--layout--spacing)
6. [Phase 4 — UI Polish & Motion](#6-phase-4--ui-polish--motion)
7. [Phase 5 — UX Flow & Screen-by-Screen](#7-phase-5--ux-flow--screen-by-screen)
8. [Phase 6 — Architecture](#8-phase-6--architecture)
9. [Phase 7 — Content & Copywriting](#9-phase-7--content--copywriting)
10. [Implementation Order](#10-implementation-order)

---

## 1. Audit Summary

### Color — HIGH findings
| Severity | Finding | Location |
|---|---|---|
| HIGH | PWAInstallPrompt uses raw hex literals (`#241E33`, `#EF9F27`, `slate-300`, `amber-300`) instead of design tokens. The component will not adapt when tokens change. | `components/PWAInstallPrompt.tsx:104,109,117,121` |
| HIGH | `bg-imposter-wins` is used for the Voting screen header icon — a red "danger" colour framing a neutral action. The meaning misfires; voting is not automatically bad. | `components/game/VotingScreen.tsx:49` |
| MEDIUM | Dark mode `--imposter-wins` shifts from a warm salmon (`#F09595`) in light to a flat red (`#E24B4A`) in dark. These are perceptually different hues, not just luminance adjustments. The result colour conveys different emotion per theme. | `app/globals.css:21,61` |
| MEDIUM | `--civilians-win` green (`#97C459`) and `--imposter-wins` red (`#F09595`) are the only outcome colours. Both are fully saturated, but the game has three emotional states: _tension_ (neutral), _defeat_ (bad), _victory_ (good). The timer uses blue (`#85B7EB`) which implies a fourth unclaimed meaning. No neutral/tension token exists. | `app/globals.css:19-23` |
| LOW | `--accent-shadcn` and `--accent` are parallel. The shadcn `accent` variable is used for _hover backgrounds_, not the game's amber CTA accent. Two things named "accent" with different semantics will cause confusion during extension. | `app/globals.css:42` |

### Typography — MEDIUM findings
| Severity | Finding | Location |
|---|---|---|
| MEDIUM | `font-germania` is a display/decorative font applied only to the secret word reveal (`text-4xl font-germania`) and the game-over secret word reveal. It is the single most distinctive typographic moment in the game — but it's doing the same job as the rest of the text (display, no motion, same container). It reads as incidental rather than intentional. | `components/game/RevealFlow.tsx:99`, `GameOverScreen.tsx:66` |
| MEDIUM | Body copy throughout uses `text-xs` (12px) for descriptions across `HomeScreen`, `DiscussionTimer`, `VotingScreen`, and `ResultScreen`. At 12px on a held phone, this is marginal at arm's length. Minimum readable body is 14px. | Multiple components |
| LOW | `tracking-widest uppercase` labels are used for section eyebrows in `RevealFlow`, `GameOverScreen`, and `ResultScreen` (`text-xs font-semibold uppercase tracking-widest`). The frontend-design skill explicitly flags all-caps labels as a generic AI-generated tell. Replace with sentence-case medium-weight text. | `RevealFlow.tsx:83`, `GameOverScreen.tsx:56,63` |
| LOW | Font weights jump from `400` to `700` to `900`. There is no `600` or `500` step in use, even though Lato supports them and was loaded with those weights available. The design would benefit from a `font-semibold` (`600`) bridge step. | `app/layout.tsx:9` |

### Layout — HIGH/MEDIUM findings
| Severity | Finding | Location |
|---|---|---|
| HIGH | `min-h-screen` on the `<main>` element does not work correctly on mobile when the browser's bottom toolbar is visible. The content pane is taller than the visible viewport, causing the primary CTA button to sit below the fold on small phones. Should be `min-h-dvh`. | `app/page.tsx:63` |
| MEDIUM | `GameShell` centres content with `justify-center` unconditionally. On screens with many players (PlayerSetup with 10 players), the list overflows the centred container and the "Start Game" button is pushed off-screen on 320px viewports. | `components/game/GameShell.tsx:31` |
| MEDIUM | The top navigation header and GameShell share the same max-width values but live in different layout contexts, causing subtle left-edge misalignment at wider breakpoints. Both should share a single layout utility class. | `app/page.tsx:66`, `GameShell.tsx:31` |
| MEDIUM | Voting player buttons use `grid-cols-1 sm:grid-cols-2`. On phones in portrait (the primary use case), all players display in a single column. With 10 players this creates a very long, unrelieved list with no visual grouping. | `components/game/VotingScreen.tsx:64` |

### UI Polish — MEDIUM/LOW findings
| Severity | Finding | Location |
|---|---|---|
| MEDIUM | All transition attributes use `transition-colors`, `transition-all`, or implicit `transition`. No component uses explicit `transition-property` naming. Per the better-ui skill, `transition: all` causes performance issues and unexpected transitions. | Multiple components |
| MEDIUM | `active:scale-[0.98]` in VotingScreen player buttons violates the `0.96` press scale rule. | `VotingScreen.tsx:69` |
| MEDIUM | The `pulse-subtle` keyframe animation in `globals.css` (used in HomeScreen) animates `opacity` and `scale` in a loop on every page visit with no `prefers-reduced-motion` guard. | `app/globals.css:172-179` |
| MEDIUM | `GameShell` enters with `y: 12` and exits to `y: -12` on the same Y axis. Enter from below and exit above would convey forward progress through the game phases. | `components/game/GameShell.tsx:13-15` |
| LOW | Shadcn `Card` wrapping in `HomeScreen` introduces two layers of padding that stack with the card's own inner spacing, producing more padding than intended. | `HomeScreen.tsx:56-101` |
| LOW | Icon stroke weight is inconsistent. Large `w-8 h-8` icons inside `w-16 h-16` containers use the same 1.5px Lucide default as small `w-3.5 h-3.5` inline icons. Large icons should use `strokeWidth={2}`. | `VotingScreen.tsx:50`, `DiscussionTimer.tsx:52` |

---

## 2. Design Direction

### Subject & Audience
SusWord is a **party game** played in groups of 4–10, held on a single phone, passed around a table. The experience is live, social, and tension-driven. Players are 16–35. The visual design should feel intimate, sleek, and atmospheric — like a late-night living room or lounge game session.

### Palette Architecture: "Warm Obsidian & Amber Suspense"

The previous iteration suffered from **hue sprawl** (6 conflicting high-chroma hues: Amber, Blue, Violet, Hot Pink, Coral Red, Teal) sitting on cold generic slate. This created visual noise and disjointed screens rather than cohesive suspense.

Per `better-colors` rules:
> *"A system is ramps, not colors... One neutral ramp, one accent ramp and only the status ramps the product actually renders."*

We collapsed the palette into a unified 3-hue system:
1. **Neutrals: Warm Obsidian (Dark) & Bone Linen (Light)**
   - Subtly tinted in the amber family (OKLCH h ≈ 80°-85°, chroma 0.005–0.015) to harmonise with the warm brand energy instead of cold icy charcoal.
2. **Brand Accent: Electric Amber / Warm Gold (h ≈ 73°)**
   - Owns all primary interactive controls, action buttons, and normal discussion timer countdowns.
3. **Danger / Suspicion: Velvet Crimson / Ruby (h ≈ 18°)**
   - Unifies Imposter reveals, player elimination, defeat states, and urgent countdowns (< 15s). Status hue is 55.4° away from accent (> 15° rule satisfied).
4. **Success: Emerald Triumph (h ≈ 163°)**
   - Reserved strictly for civilian victory and positive thresholds (4+ players reached).

### Measured Contrast Table (WCAG 2.1 AA)

| Pair | Foreground | Background | Measured Ratio | WCAG AA Status |
|---|---|---|---|---|
| Dark Body Text | `#F5F2EB` | `#131210` | 16.75:1 | PASS (AA & AAA) |
| Dark Card Text | `#F5F2EB` | `#1C1A17` | 15.53:1 | PASS (AA & AAA) |
| Dark Soft Text | `#A8A296` | `#1C1A17` | 6.84:1 | PASS (AA) |
| Dark Hint Text | `#787166` | `#131210` | 3.88:1 | PASS (≥ 3:1) |
| Light Body Text | `#1C1917` | `#F8F6F2` | 16.20:1 | PASS (AA & AAA) |
| Light Card Text | `#1C1917` | `#FFFFFF` | 17.49:1 | PASS (AA & AAA) |
| Light Soft Text | `#686257` | `#FFFFFF` | 6.05:1 | PASS (AA) |
| Light Hint Text | `#827B6E` | `#FFFFFF` | 4.19:1 | PASS (≥ 3:1) |
| Primary CTA Button | `#181100` | `#F5A623` | 9.26:1 | PASS (AA & AAA) |
| Dark Imposter Text | `#FB7185` | `#1C1A17` | 6.45:1 | PASS (AA) |
| Light Imposter Text | `#BE123C` | `#FFFFFF` | 8.02:1 | PASS (AA & AAA) |
| Dark Imposter Button | `#FFFFFF` | `#BE123C` | 6.29:1 | PASS (AA) |
| Dark Win Text | `#34D399` | `#1C1A17` | 8.21:1 | PASS (AA & AAA) |
| Light Win Text | `#047857` | `#FFFFFF` | 7.68:1 | PASS (AA & AAA) |
| Player Avatars (8) | `#FFFFFF` | All 8 fills | 5.02:1 – 9.57:1 | PASS (AA) |

---

## 3. Phase 1 — Color & Token System (Complete)

**Files**: `app/globals.css`, `lib/utils.ts`, `app/manifest.ts`, `components/game/*`

- [x] Defined warm obsidian & bone linen neutral primitives in Tier 1 (`globals.css`).
- [x] Consolidated status tokens into Amber, Crimson, and Emerald ramps.
- [x] Removed arbitrary blue and violet timer tokens; DiscussionTimer now progresses from Amber countdown to Crimson urgency (< 15s).
- [x] Fixed avatar colors in `lib/utils.ts` so white text passes WCAG AA (> 5.0:1) on all 8 options.
- [x] Removed hardcoded `bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950` buttons across HomeScreen, PlayerSetup, ReadyScreen, ResultScreen, and GameOverScreen, replacing them with semantic `bg-cta text-cta-fg`.
- [x] Corrected player name heading in RevealFlow from `text-cta` to `text-text-primary`.
- [x] Replaced `bg-tension` on VotingScreen header with `bg-imposter/15 text-imposter`.
- [x] Updated web manifest background to `#131210`.

---

## 4. Phase 2 — Typography

**Files**: `app/layout.tsx`, `app/globals.css`

### 4.1 Font swap — replace Lato with a more characterful pairing

Lato is competent but safe. For a social deduction game, lean into personality:

- **Heading font**: `Syne` (geometric, slightly unusual proportions — subtly tense)
- **Body font**: `Inter` (neutral, screen-optimised, universally readable)
- **Display/reveal font**: Keep `Germania One` for the secret word reveal — but make it earn its place with a dramatic entrance animation (see Phase 4)

```typescript
// layout.tsx
const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
// Keep germaniaOne as is
```

### 4.2 Type scale

Define an explicit scale in CSS rather than ad-hoc Tailwind utilities:

```css
/* @theme inline additions */
--text-xs:      0.75rem;   /* 12px — captions only */
--text-sm:      0.875rem;  /* 14px — body minimum */
--text-base:    1rem;      /* 16px — body default */
--text-lg:      1.125rem;  /* 18px — subheadings */
--text-xl:      1.25rem;   /* 20px — section titles */
--text-2xl:     1.5rem;    /* 24px — screen titles */
--text-3xl:     1.875rem;  /* 30px — hero moments */
--text-4xl:     2.25rem;   /* 36px — timer countdown */
--text-display: 4rem;      /* 64px — secret word reveal */
```

### 4.3 Body text size audit

All current `text-xs` description text must become `text-sm`:

| Component | Current | New |
|---|---|---|
| HomeScreen card descriptions | `text-xs` | `text-sm` |
| HomeScreen feature tags | `text-xs` | `text-sm` |
| GameOverScreen eyebrow labels | `text-xs uppercase tracking-widest` | `text-xs font-medium` (sentence case) |
| RevealFlow role label | `text-sm uppercase tracking-widest` | `text-sm font-medium` (sentence case) |

### 4.4 Remove all-caps labels

Replace all `uppercase tracking-widest` eyebrow labels with sentence-case, `font-medium` text. Let hierarchy come from font size and weight, not case.

### 4.5 Line-height

Add `leading-relaxed` (1.625) consistently on all `text-sm` and `text-base` body paragraphs.

---

## 5. Phase 3 — Layout & Spacing

**Files**: `app/page.tsx`, `components/game/GameShell.tsx`, all game screens

### 5.1 Fix `min-h-screen` → `min-h-dvh`

```diff
- <main className="flex flex-1 flex-col bg-app min-h-screen">
+ <main className="flex flex-1 flex-col bg-surface-base min-h-dvh">
```

### 5.2 Shared layout container class

Create a single `.layout-container` utility applied to both `GameShell` and the page header:

```css
/* globals.css */
.layout-container {
  width: 100%;
  max-width: 28rem;       /* 448px — single-phone UX */
  margin-inline: auto;
  padding-inline: 1.25rem; /* 20px — comfortable thumb clearance */
}

@media (min-width: 640px) {
  .layout-container {
    max-width: 32rem;
    padding-inline: 1.5rem;
  }
}
```

### 5.3 GameShell scrollable variant

Add a `layout` prop to `GameShell`:

```typescript
interface GameShellProps {
  children: ReactNode;
  phaseKey?: string;
  layout?: 'centered' | 'scrollable';
}
```

- `'centered'` (default): current behaviour, `justify-center`
- `'scrollable'`: `justify-start`, `overflow-y-auto`, `overscroll-behavior: contain`, with `scroll-padding-block-start` matching header height

Use `'scrollable'` for `PlayerSetup` and `GameOverScreen`.

### 5.4 Spacing rhythm

Adopt a strict rhythm: within-group gap = `8px` or `12px`; between major sections = `24px`; between independent blocks = `32px`. Audit each screen and unify inconsistencies.

### 5.5 Voting screen layout

Replace the grid with single-column, always:
- Player buttons: full-width rows with left-side avatar initial circle + name + right ChevronRight
- No 2-column grid — voting is deliberate, not a scanning task

### 5.6 Header alignment

The page `<header>` must use the same `.layout-container` class as `GameShell` so left edges align exactly.

---

## 6. Phase 4 — UI Polish & Motion

**Files**: `app/globals.css`, `components/game/GameShell.tsx`, all game screens

### 6.1 Fix `prefers-reduced-motion` violations

**`pulse-subtle` keyframe**:

```css
@media (prefers-reduced-motion: no-preference) {
  .animate-pulse-subtle {
    animation: pulse-subtle 3s ease-in-out infinite;
  }
}
@media (prefers-reduced-motion: reduce) {
  .animate-pulse-subtle { opacity: 1; }
}
```

**Framer Motion global guard** (add to `app/page.tsx`):

```tsx
import { MotionConfig } from 'framer-motion';

<MotionConfig reducedMotion="user">
  {/* rest of app */}
</MotionConfig>
```

### 6.2 Fix `GameShell` transition direction

Enter from below, exit upward — conveys forward game progression:

```typescript
const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -16 },
};
const transition = { duration: 0.2, ease: [0.2, 0, 0, 1] };
```

For RevealFlow sub-states (pass → reveal), add blur:

```typescript
initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
animate: { opacity: 1, scale: 1,    filter: 'blur(0px)' },
exit:    { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
```

### 6.3 Fix active/press scale

All tappable elements use `active:scale-[0.96]` with `transition-[transform]` (not `transition-all`):
- `VotingScreen.tsx`: change `active:scale-[0.98]` → `active:scale-[0.96]`
- Add `disabled:active:scale-100` wherever disabled states exist

### 6.4 Transition property specificity

Replace `transition-colors`, `transition-all` with explicit named properties:

```tsx
// Before
className="... transition-colors duration-200"

// After  
className="... transition-[color,background-color,border-color,opacity] duration-150"
```

Use `duration-150` for high-frequency changes (hovers). Use `duration-200` for low-frequency changes (cards, phase transitions).

### 6.5 Secret word reveal — dramatic entrance

The word reveal is the most important moment each round:

```tsx
<motion.h2
  initial={{ opacity: 0, scale: 0.7, filter: 'blur(8px)' }}
  animate={{ opacity: 1, scale: 1,   filter: 'blur(0px)' }}
  transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
  className="text-display font-germania text-text-body"
>
  {secretWord}
</motion.h2>
```

### 6.6 GameOver staggered entrance

The GameOver screen is the emotional peak. Stagger the content blocks:
1. Result banner: 0ms
2. Imposter + word reveals: 100ms
3. Elimination history: 200ms
4. Action buttons: 300ms

Each block: `opacity: 0, y: 12, filter: blur(4px)` → `opacity: 1, y: 0, blur: 0` over 300ms ease-out.

### 6.7 Concentric radius fix

HomeScreen nested cards: outer card uses `rounded-2xl`, inner elements use `rounded-xl` (12px). With `p-5` (20px) padding: outer radius should be `rounded-[28px]` (12 + 16 = 28) or `rounded-3xl`.

### 6.8 Hover state gate

Move all hover utilities behind `@media (hover: hover)` to prevent stuck hover states on touch:

```css
@media (hover: hover) {
  .player-btn:hover { background: oklch(from var(--color-cta) l c h / 0.1); }
}
```

### 6.9 Icon stroke weight consistency

Large icons in containers (`w-8 h-8` inside `w-16 h-16`) → `strokeWidth={2}`.
Small inline icons (`w-3.5 h-3.5`, `w-4 h-4`) → keep Lucide default `1.5px`.

Update: `DiscussionTimer.tsx:52`, `VotingScreen.tsx:50`, `ReadyScreen.tsx:16`, `ResultScreen.tsx:24,35`.

### 6.10 Suppress theme switch transitions

```typescript
// lib/suppressTransitions.ts
export function suppressTransitions(fn: () => void) {
  const el = document.documentElement;
  el.classList.add('no-transitions');
  fn();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.remove('no-transitions'));
  });
}
```

```css
/* globals.css */
.no-transitions * { transition-duration: 0s !important; }
```

### 6.11 Dialog scroll containment

Add `overscroll-behavior: contain` to all `DialogContent` scroll areas to prevent page scroll bleeding through.

---

## 7. Phase 5 — UX Flow & Screen-by-Screen

### 7.1 HomeScreen

**Current issues:**
- "How to Play" is buried below the fold in a toggle
- "Online Rooms — Coming Soon" card takes up half the screen for a disabled feature
- Logo is side-by-side with title; could be more dramatic
- Numbered steps read as template-like (acceptable only because the game actually is sequential)

**Changes:**
- **Hero**: Make the logo full-width, top-centre. Use `Germania One` for "SusWord" at `text-5xl` with imposter-pink on "Sus." Add a subtle animated glow (box-shadow pulse, gated behind reduced-motion).
- **How to Play**: Make it permanently visible as a short 3-step section below the CTA — not collapsible. Short enough to always show; useful for new players.
- **Online Rooms card**: Shrink to a compact single-row teaser strip — icon + "Online play — Coming Soon" text. Saves vertical space.
- **Play Offline button**: Full-width `h-14`, amber gradient (`from-amber-500 to-amber-400`), arrow icon animates rightward on hover.

### 7.2 PlayerSetup

**Current issues:**
- Empty state ("No players added yet") is plain text with no invitation
- Player count is standalone text; could be a progress indicator
- No visual sense of the 4-player minimum threshold

**Changes:**
- **Progress pips**: 10 dots below the player list. Filled = player added. At 4 filled, show a check signal that "Start Game" is now unlocked.
- **Empty state**: Replace with a hint card — "Add at least 4 players to start" with a `UserPlus` icon.
- **Player rows**: Add left-side avatar initial circle (deterministic colour from player name hash).
- **Input**: Height `h-13`, add an `X` clear button inside the field when there's input.
- **Timer selector**: Expose discussion time options (3 min / 5 min / 7 min) — this is a frequently requested feature.

### 7.3 RevealFlow

**Current issues:**
- Pass screen and reveal screen use visually identical containers — no escalation
- Imposter reveal uses the same card style as civilian reveal — no tonal differentiation
- All-caps eyebrow labels (typography audit)

**Changes:**
- **Cover state (pass)**: Full-bleed neutral background. Large EyeOff icon. Player name in `text-3xl` amber. Make the entire screen the tap target — remove isolated button.
- **Civilian reveal**: Clean card, `bg-surface-raised`. Word in `font-germania text-display` with dramatic blur-in entrance. Subtext: "Keep this to yourself."
- **Imposter reveal**: Card with `bg-imposter/15 border-imposter/30` tint. "IMPOSTER" in `font-heading text-3xl text-imposter` with a subtle 2-3 frame glitch keyframe. Subtext: "You don't know the word. Blend in."
- **Progress**: Replace `Player X of Y` text with pagination dot row at top.

### 7.4 ReadyScreen

**Current issues:**
- Very minimal; spends no time building anticipation
- `bg-civilians-win` green icon implies "this is good" before any tension

**Changes:**
- Replace the green check with a neutral user-cluster icon (multiple users converging).
- Atmospheric copy: "The imposter is somewhere in this group. Trust no one."
- Button: amber CTA, full-width.

### 7.5 DiscussionTimer

**Current issues:**
- Progress bar is `h-2` — thin and hard to read at a glance
- No urgency escalation as time runs low
- Skip button has same visual weight as the timer

**Changes:**
- **Circular SVG ring timer**: Replace linear bar with a ring around the time display. Ring colour transitions: blue (full) → amber (30s) → red (10s). Use CSS transitions on `stroke` color.
- **Urgency cues**: At `remaining <= 30`, add pulsing colour shift on timer text. Gate behind reduced-motion.
- **Label**: Change "Discussion in progress" → "Time left to discuss."
- **Skip button**: `variant="ghost"` at `text-sm` — clearly secondary.

### 7.6 VotingScreen

**Current issues:**
- Flat list of plain buttons; high-stakes moment feels underwhelming
- Confirmation dialog triggers immediately with no visible selection state
- "Are you sure? This cannot be undone." framing is punitive/admin-feeling

**Changes:**
- **Player buttons**: Full-width rows with avatar, name in `font-semibold text-base`, right ChevronRight. On pending confirmation, highlight selected row with `border-imposter bg-imposter/10`.
- **No grid**: Always single column.
- **Dialog copy**: Replace "Are you sure? This cannot be undone." → "The group has decided. [PlayerName] is leaving the game." Frames the vote as a group outcome, not admin action.
- **Dialog border**: `border-imposter/30` tint for atmosphere.

### 7.7 ResultScreen

**Current issues:**
- "Wrong Guess!" is punitive; party games should make the team laugh, not feel scolded
- `wasImposter` branch is dead code that never renders

**Changes:**
- Rename "Wrong Guess!" → "Not the imposter." (sentence case, declarative not judgmental).
- Add the eliminated player's name to the first sentence: "[Name] was a civilian."
- Remove dead `wasImposter` branch; add doc comment explaining why it was removed.
- Button: full-width amber CTA.

### 7.8 GameOverScreen

**Current issues:**
- Result banner is a flat solid-colour block — no texture or depth
- Elimination history items are plain rows with no timeline feel
- "Play Again" and "New Game" have too similar visual weights

**Changes:**
- **Result banner**: Gradient version: `bg-gradient-to-b from-win/30 to-win/10 border border-win/30` — softer and more premium.
- **Imposter reveal**: `bg-imposter/15 border-imposter/30` card. Imposter name in `font-heading text-3xl text-imposter`.
- **Secret word**: `font-germania text-3xl` centred — already correct.
- **Elimination history**: Vertical timeline with a connecting line on the left. Dot per row. Imposter rows get a skull icon in hot-pink; civilian rows get a greyed user icon.
- **Action buttons**: Horizontal rule above buttons. "Play Again" = full amber CTA. "New Game" = `variant="ghost"` text link — reduces visual competition.

---

## 8. Phase 6 — Architecture

### 8.1 Clean up duplicate `START_DISCUSSION` guard

```typescript
// store.ts — in START_DISCUSSION case:
// Only allow transition from "ready" — remove "result" branch
case "START_DISCUSSION": {
  if (state.phase !== "ready") return state;
  ...
}
// NEXT_ROUND remains the canonical result → discussing path
```

### 8.2 Resilient timer using `timerStartedAt`

The timer `remaining` in local component state resets on re-render and is lost on app suspend (PWA). Replace:

- Add `timerStartedAt: number | null` to `GameState`
- Set it in `START_DISCUSSION` and `NEXT_ROUND` to `Date.now()`
- Compute `remaining` in the component: `timerSeconds - Math.floor((Date.now() - timerStartedAt) / 1000)`
- This is resilient to React re-renders and PWA background/resume cycles

### 8.3 Word repeat prevention

`getRandomWord()` uses pure `Math.random()` with no replay prevention. Add in-memory set:

```typescript
// lib/words.ts
const RECENT_WORDS = new Set<string>();

export function getRandomWord(): WordEntry {
  const available = WORD_LIST.filter(w => !RECENT_WORDS.has(w.word));
  const pool = available.length > 0 ? available : WORD_LIST;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  RECENT_WORDS.add(pick.word);
  if (RECENT_WORDS.size > Math.floor(WORD_LIST.length / 3)) {
    const oldest = RECENT_WORDS.values().next().value!;
    RECENT_WORDS.delete(oldest);
  }
  return pick;
}
```

### 8.4 Expose word category to civilians (not imposter)

Add `secretCategory: string | null` to `GameState`. Civilians see:

```
Your word: PIZZA
Category: Food
```

The imposter sees no category — they can't even infer the domain from a hint.

### 8.5 Player avatar deterministic colour

Add to `lib/utils.ts`:

```typescript
const AVATAR_COLOURS = [
  '#FF6B9D', '#F5A623', '#00C896', '#60A5FA',
  '#A78BFA', '#34D399', '#FB923C', '#F472B6',
];

export function getPlayerColour(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}
```

Use in `PlayerSetup`, `VotingScreen`, and `GameOverScreen`.

### 8.6 `GameShell` variant API

Add `layout?: 'centered' | 'scrollable'` prop as described in Phase 3.

### 8.7 Remove dead code

- `ResultScreen.tsx`: Remove the `wasImposter` branch (lines 19–31); it cannot render per game logic. Add doc comment.
- `store.ts`: Remove `"result"` as an accepted from-phase in `START_DISCUSSION`.

### 8.8 Configurable timer UI

The timer `TIMER_DURATION = 300` is a compile-time constant. Expose it in `PlayerSetup`:

```
Discussion time: [3 min] [5 min] [7 min]
```

Add `SET_TIMER_SECONDS` action to the store. Default stays 5 minutes.

---

## 9. Phase 7 — Content & Copywriting

Applying the writing principles from the frontend-design skill — direct, active, end-user perspective, no filler:

| Location | Current | New |
|---|---|---|
| HomeScreen tagline | "Find the imposter before time runs out" | "One of you doesn't know the word. Find them." |
| HomeScreen card description | "Play on a single device passed around your group. No internet required!" | "Pass your phone around the table. One player is the imposter — they don't know the secret word." |
| How to Play step 1 | "Everyone sees the secret word except 1 player who gets IMPOSTER" | "Each player gets the secret word. One player gets something else entirely." |
| How to Play step 3 | "Eliminate the imposter to win!" | "Discuss who seems off, then vote them out. Catch the imposter before they outlast you." |
| PlayerSetup subtitle | "Enter the name of each player. You need 4–10 players to start." | "Who's playing? Add at least 4 names." |
| RevealFlow cover | "Only [Name] should be looking at the screen." | "[Name], look only at your screen." |
| RevealFlow civilian | "Remember this word. Don't say it out loud!" | "This is the secret word. Keep it to yourself." |
| RevealFlow imposter | "You don't know the secret word. Blend in and don't get caught!" | "You don't know the word. Listen for clues. Don't get caught." |
| ReadyScreen | "All players have seen their word. Gather around and get ready to discuss." | "Everyone's seen their screen. The imposter is somewhere in this group." |
| DiscussionTimer label | "Discussion in progress" | "Time left to discuss" |
| DiscussionTimer hint | "Talk about the secret word. Ask questions. Try to figure out who doesn't know the word!" | "Give clues about the word. Don't say it directly. Figure out who's faking it." |
| VotingScreen instruction | "The host taps the name of the player with the most votes." | "Agree on a player, then the host taps their name." |
| ResultScreen headline | "Wrong Guess!" | "Not the imposter." |
| ResultScreen subtext | "The imposter is still among you…" | "[Name] was a civilian. The imposter is still here." |
| GameOver civilians win | "The group found the imposter!" | "You found them." |
| GameOver imposter wins | "The imposter survived undetected!" | "The imposter won this one." |
| Footer | "SusWord v1.0 • Offline Edition" | "SusWord — Offline" |

---

## 10. Implementation Order

Phases must be implemented in order — each phase depends on the previous:

```
Phase 1 (Tokens) → Phase 2 (Typography) → Phase 3 (Layout)
                                                  ↓
Phase 7 (Copy) ← Phase 5 (UX/Screens) ← Phase 4 (Motion)
                        ↑
                 Phase 6 (Architecture)
```

### Detailed Task Checklist

**Phase 1 — Tokens (1–2 hours)**
- [x] Rewrite `:root` and `.dark` blocks in `globals.css` with "Night Room" palette
- [x] Rename tokens to semantic names, update `@theme inline` block
- [x] Replace all raw hex literals in `PWAInstallPrompt.tsx` with token utilities
- [x] Fix `--color-lose` dark-mode hue consistency (coral, not flat red)
- [x] Resolve `--accent` vs `--accent-shadcn` naming conflict
- [x] Add `--color-tension` neutral/mid-game token

**Phase 2 — Typography (1–2 hours)**
- [x] Swap `Lato` for `Syne` (heading) + `Inter` (body) in `layout.tsx`
- [x] Update `@theme inline` font variables
- [x] Add explicit type scale CSS variables
- [x] Audit and fix all `text-xs` body text → `text-sm`
- [x] Remove all `uppercase tracking-widest` eyebrow labels → sentence case

**Phase 3 — Layout (1 hour)**
- [x] Fix `min-h-screen` → `min-h-dvh` in `page.tsx`
- [x] Create `.layout-container` utility class in `globals.css`
- [x] Apply `layout-container` to `GameShell` and page header
- [x] Add `layout` prop to `GameShell`; use `scrollable` for `PlayerSetup` and `GameOverScreen`
- [x] Rework `VotingScreen` to single-column with avatar rows

**Phase 4 — Motion (1–2 hours)**
- [x] Add `<MotionConfig reducedMotion="user">` at app root in `page.tsx`
- [x] Gate `pulse-subtle` behind `prefers-reduced-motion`
- [x] Fix `GameShell` transition variants (forward direction + blur)
- [x] Fix `active:scale-[0.98]` → `active:scale-[0.96]` in `VotingScreen`
- [x] Fix `transition-all` → explicit property lists across all components
- [x] Add dramatic blur-in entrance for secret word in `RevealFlow`
- [x] Add staggered GameOver entrance animations
- [x] Fix icon `strokeWidth` on large icons across all screens
- [x] Fix concentric radii on HomeScreen cards
- [x] Add `@media (hover: hover)` guards on hover utilities
- [x] Add theme-switch transition suppression

**Phase 5 — UX/Screens (3–5 hours)**
- [x] HomeScreen: hero redesign, permanent How to Play, compact online teaser
- [x] PlayerSetup: progress pips, avatar initials, improved empty state, timer selector
- [x] RevealFlow: full-bleed pass screen, dramatic civilian/imposter reveals, dot progress
- [x] ReadyScreen: atmospheric copy, neutral icon
- [x] DiscussionTimer: SVG ring timer, urgency colour transitions, updated copy
- [x] VotingScreen: avatar rows, pending selection highlight, updated dialog copy
- [x] ResultScreen: remove dead code, updated copy, full-width CTA
- [x] GameOverScreen: gradient banner, timeline history, action button hierarchy

**Phase 6 — Architecture (1–2 hours)**
- [x] Clean up `START_DISCUSSION` guard (remove `"result"` branch)
- [x] Implement `timerStartedAt` resilient timer pattern in `GameState`
- [x] Add word repeat prevention to `lib/words.ts`
- [x] Expose `secretCategory` in GameState and RevealFlow (civilian only)
- [x] Add `getPlayerColour()` utility to `lib/utils.ts`
- [x] Add `SET_TIMER_SECONDS` action and PlayerSetup timer UI
- [x] Remove dead `ResultScreen` wasImposter branch with doc comment

**Phase 7 — Copy (30 min)**
- [x] Update all copy strings per the table in Phase 7

**Phase 8 — Audio & Haptics (1–2 hours)**
- [x] Synthesize Web Audio procedural micro-sounds (uniform stealth reveal chime for all roles, clicks, clock ticks, alarm, elimination whoosh, fanfare, defeat)
- [x] Implement mobile haptic patterns via `navigator.vibrate` (uniform stealth reveal vibration)
- [x] Add `soundEnabled` and `hapticsEnabled` state & toggles to `lib/store.ts`
- [x] Build reactive `useGameFeedback()` hook in `lib/audio.ts`
- [x] Add global volume toggle to header and sound/vibration pills to HomeScreen
- [x] Wire procedural audio & haptic cues across all game loop screens

---

> **Total estimated effort**: 9–15 hours of focused implementation.
>
> Each phase is independently deployable and ships measurable improvement on its own. Start with Phase 1 — tokens first, or subsequent phase changes land on mismatched semantics.
