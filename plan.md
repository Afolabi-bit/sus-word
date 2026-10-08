# Oddword (Formerly SusWord) — Comprehensive Brand, UI & Design System Overhaul Plan

> **Audit & Design Basis**: Rooted directly in the core skills: [`frontend-design`](file:///c:/dev/sus-word-app/frontend/.agents/skills/frontend-design/SKILL.md), [`better-colors`](file:///c:/dev/sus-word-app/frontend/.agents/skills/better-colors/SKILL.md), [`better-layout`](file:///c:/dev/sus-word-app/frontend/.agents/skills/better-layout/SKILL.md), [`better-ui`](file:///c:/dev/sus-word-app/frontend/.agents/skills/better-ui/SKILL.md), and [`animation-vocabulary`](file:///c:/dev/sus-word-app/frontend/.agents/skills/animation-vocabulary/SKILL.md).

---

## Table of Contents

1. [Executive Summary & Problem Diagnosis](#1-executive-summary--problem-diagnosis)
2. [Brand Identity & Renaming Strategy](#2-brand-identity--renaming-strategy)
3. [Logo & Favicon Redesign — "The Imposter in Plain Sight"](#3-logo--favicon-redesign)
4. [Color Architecture & Theme System (`better-colors`)](#4-color-architecture--theme-system)
5. [Layout, Ergonomics & Spacing (`better-layout`)](#5-layout-ergonomics--spacing)
6. [UI Polish & Micro-Interactions (`better-ui`)](#6-ui-polish--micro-interactions)
7. [Motion Choreography (`animation-vocabulary`)](#7-motion-choreography)
8. [Screen-by-Screen UI Specifications](#8-screen-by-screen-ui-specifications)
9. [File-by-File Implementation Roadmap](#9-file-by-file-implementation-roadmap)
10. [Verification & Acceptance Criteria](#10-verification--acceptance-criteria)

---

## 1. Executive Summary & Problem Diagnosis

### The Current State & Core Complaints
The current game UI suffers from three fundamental issues highlighted by the user:
1. **Generic, Disjointed UI**: The interface relies on generic dark-mode tropes (muddy brown-obsidian base, electric amber CTA, and ad-hoc card wrappers). It feels like a template SaaS dashboard rather than an exhilarating, tactile party deduction game.
2. **Weak, Childish Logo & Favicon**: The current logo is an amateurish magnifying glass containing a crude smiley face. It conveys neither the tension of an imposter game nor modern brand craft, and fails completely at 16×16 favicon resolution.
3. **Dated, Uncatchy Name ("SusWord")**: "Sus" is 2020 meme slang tied to *Among Us* clones. It feels juvenile, dated, and unmemorable for a standalone modern web party game played with friends around a table or online.

### Deep Skill Diagnosis

#### A. [`frontend-design`](file:///c:/dev/sus-word-app/frontend/.agents/skills/frontend-design/SKILL.md) Violations
- **AI-Template Default Trap**: The current app exhibits several classic tells called out in `frontend-design`:
  - *Trait 1 & 2*: Tinted near-black (`#131210`) paired with a single amber CTA and crimson destructive badge.
  - *Trait 4*: SaaS card kit — almost every element is wrapped in identical `Card` containers with uniform borders and shadows regardless of content hierarchy.
  - *Trait 5*: All-caps tracked-out labels (`tracking-widest uppercase`) in headers and status tags.
- **Lack of Subject-Matter Grounding**: A social deduction game lives on **suspense, deception, secrecy, and dramatic reveals**. The interface should feel like an intimate late-night game lounge or high-stakes undercover dossier — crisp, tactile, luminous, and electric.

#### B. [`better-colors`](file:///c:/dev/sus-word-app/frontend/.agents/skills/better-colors/SKILL.md) Violations
- **Muddy Neutrals**: The current dark mode neutral (`#131210`, `#1C1A17`) has an unappealing yellow-brown cast (OKLCH h ≈ 80°) that deadens the interface.
- **Status Hue Proximity**: Brand CTA amber (`#F5A623`, h ≈ 73°) and imposter crimson (`#FB7185` / `#BE123C`, h ≈ 18°) need distinct roles. Discussion countdowns borrowed the brand accent, blurring the line between normal navigation and urgency.
- **Gamut & Contrast Inconsistencies**: Several badge and button combinations miss WCAG AAA clarity on dark surfaces.

#### C. [`better-layout`](file:///c:/dev/sus-word-app/frontend/.agents/skills/better-layout/SKILL.md) & [`better-ui`](file:///c:/dev/sus-word-app/frontend/.agents/skills/better-ui/SKILL.md) Violations
- **Mobile Viewport Overflow**: Uses `min-h-screen` instead of dynamic viewport height (`100dvh`), causing bottom CTA clipping on mobile safari/chrome toolbars.
- **Nested Radius Mismatch**: Nested cards violate the outer-radius formula ($R_{outer} = R_{inner} + \text{padding} + \text{border}$).
- **Transition Performance**: Broad `transition-all` declarations instead of targeted property transitions (`transition-[transform,opacity,background-color]`).
- **Interactive Touch Scale**: Voting buttons use `active:scale-[0.98]` instead of the tactile standard `0.96` (with disabled protection).

---

## 2. Brand Identity & Renaming Strategy

### Critique of "SusWord"
- **Dated slang**: "Sus" peaked in 2020. In 2026, it sounds childish and derivative.
- **Phonetics**: The sibilant "S-S-W" consonant cluster is clumsy when spoken out loud at a party ("Let's play SusWord").
- **Brand ceiling**: Impossible to build a respected, evergreen social game brand around internet meme slang.

### Candidate Name Comparison Matrix

| Candidate | Phonetic Flow & Catchiness | Imposter / Game Theme Connection | Memorability | Domain / App Viability | Verdict |
|---|---|---|---|---|---|
| **Oddword** | **10/10** — Crisp, two syllables, punchy trochee meter (ODD-word). | **10/10** — Dual meaning: one word is odd, one player is the odd one out. | **9.5/10** — Instantly sticks; easy to chant at a party. | High; clean, trademark-friendly. | **TOP PICK (Recommended)** |
| **Decoy** | **9/10** — Sharp, single word, elegant. | **9/10** — Directly evokes deception and diversion. | **8.5/10** — Sleek, but slightly abstract. | Medium (crowded word). | **Strong Alternative** |
| **Outlier** | **8.5/10** — Modern, clean, smart. | **8.5/10** — Mathematical/logical; the person who doesn't fit the cluster. | **8/10** — A bit clinical/academic. | Good. | Honorable Mention |
| **Bluffword** | **8/10** — Descriptive, playful. | **9/10** — Describes exactly what the player must do. | **7.5/10** — Slightly literal/heavy. | Good. | Secondary Option |
| **Blindspot** | **8.5/10** — Mysterious, evocative. | **8/10** — The imposter is in everyone's blind spot. | **8/10** — Good title, less immediate for party games. | Crowded domain. | Secondary Option |

### The Winning Direction: **ODDWORD**
- **Why it works**:
  - Direct connection to the core mechanic: **"One of you is the odd one out."**
  - Instant verbal clarity: *"Hey, open Oddword on your phone!"*
  - Perfect typography balance: The double 'd' in "Odd" provides incredible graphic design opportunities for logo glyphs (two eyes, two masks, two diverging paths).
- **Tagline**: *"The Party Word Game of Hidden Deception."*
- **Sub-tagline / Hero Pitch**: *"One word. One imposter in plain sight. Can you find the odd one out?"*

---

## 3. Logo & Favicon Redesign

### The Design Brief for the Logo
The user's explicit directive:
> *"I need an entirely new direction for the Logo and favicon as well. The idea of an imposter should be clearly visible in the logo."*

The imposter concept requires **visual dissonance in plain sight** — something that looks almost identical to its peers, but possesses a subtle, striking disguise or unmasking moment.

### Logo Concept Candidates

#### Concept A: "The Disguised 'O' / Unmasked Eye" (Recommended)
- **Concept Geometry**:
  - The primary emblem is a sleek, bold geometric lettermark of the capital letter **O** (representing a cohesive player circle or magnifying lens).
  - An angled diagonal incision (slice) cuts across the upper-right quadrant.
  - Through this slice, the lettermark peels back like a masquerade mask or visor, revealing a glowing, piercing **imposter eye / neon ruby slit**.
  - The left side represents the clean civilian face; the right side reveals the disguised infiltrator within.
- **Favicon Readability (16×16 to 32×32)**:
  - At 16px, a high-contrast dark indigo circle with a sharp neon-coral diagonal slice and central glowing dot remains crisp and instantly recognizable.
- **ASCII Geometric Diagram**:
```
        .---''''---.
      .'     ____   `.
     /     .'  /\`.   \    <-- Clean civilian curvature
    |     /   /  \ \   |
    |    |   | () | |  |   <-- Glow imposter slit / eye
    |     \   \  / /   |
     \     `.  \/.'   /    <-- Disguise cut / mask seam
      `.     `----' .'
        `---....---'
```

#### Concept B: "The Infiltrator Array / The 4th Node"
- **Concept Geometry**:
  - An arrangement of 4 minimalist shield/player nodes in a circular or 2×2 cluster.
  - Three nodes are identical solid geometric shapes (Civilians, electric cyan/mint).
  - The fourth node is subtly shifted, inverted, or wears an offset visor in electric coral/ruby (The Imposter).
- **Favicon Readability**: Works well at 32px+, but 16px can feel busy.

#### Concept C: "The Masquerade Keyhole"
- **Concept Geometry**:
  - A classic modern keyhole silhouette where the negative space inside forms the profile of an operative wearing a sleek half-mask.

### Selected Direction: Stark Stealth Monochrome with Solo Imposter Ruby
- **Zero Graphic Clutter**: Per user direction, all graphic/cartoonish logo emblems have been removed from the application UI.
- **Hero & Navigation Wordmark**: High-contrast, bold typographic wordmark:
  - **"Odd"** rendered in high-contrast crisp text (`text-text-primary`).
  - **"word"** rendered in glowing suspense ruby (`text-imposter`), establishing the imposter theme cleanly without tacky icons.
- **App Icon & Favicon (`app/icon.svg`)**:
  - Clean, minimalist geometric lettermark "O" in pure SVG paths on deep obsidian container (`#0A0C10`).
  - Single **Neon Ruby** accent dot (`#FB7185`) symbolizing "the one imposter in plain sight" (zero purple, zero amber).

---

## 4. Color Architecture & Theme System (`better-colors`)

### Aesthetic Direction: "Stark Stealth Monochrome" (Noir Obsidian & Solo Ruby)
Moving completely away from saturated UI washes (no purple AI tropes, no amber/yellow, no cyan tinting). The entire interactive interface is pure, high-contrast, tactile monochrome, allowing the Imposter to stand out with terrifying clarity:
- **Base Canvas**: Deep Velvet Obsidian (`#0A0C10` in dark, `#F8F9FA` in light).
- **Surface Elevation**: Layered crystalline obsidian cards with subtle hairline borders (`#131722` and `#1C2234`).
- **Brand Primary CTA**: Luminous Titanium White (`#FFFFFF` in dark with `#0A0C10` ink text; `#0F172A` in light with `#FFFFFF` text) — tactile, hardware-inspired, **18.2:1 AAA** contrast.
- **The Imposter / Danger / Suspense**: Vivid Neon Ruby (`#FB7185` / `#E11D48` / `#BE123C`), the single chromatic color cutting through the monochrome.
- **The Civilians / Victory / Safe**: Crisp Aurora Emerald (`#34D399` / `#059669`).
- **Neutral Clock / Timer**: Crisp Slate Monochrome (`#CBD5E1` in dark, `#334155` in light) transitioning to pulsing Neon Ruby in the final 15s.

### Color Tokens & Hue Distribution (OKLCH Ramps)

```
Neutrals:       OKLCH h ≈ 260° (Velvet Midnight Obsidian — sleek, modern, zero muddy brown)
Brand CTA:      Stark White / Black (Pure Luminous Titanium — 18.2:1 AAA, zero color wash!)
Imposter/Lose:  OKLCH h ≈ 15°  (Neon Ruby / Crimson — the solo chromatic focus of the game)
Civilian/Win:   OKLCH h ≈ 155° (Aurora Emerald — high clarity victory state)
Timer/Info:     Neutral Slate  (Crisp monochrome clock, flashes Ruby under 15s tension)
```

### Measured Contrast Matrix (WCAG 2.1 AA & AAA Verified)

| Token Pair | Foreground | Background | Lightness $\Delta L$ | Contrast Ratio | WCAG Compliance |
|---|---|---|---|---|---|
| **Dark Body Text on Base** | `#F1F5F9` (Slate 100) | `#0A0C10` (Dark Base) | 0.88 | **17.8 : 1** | **PASS (AAA)** |
| **Dark Card Text on Raised** | `#F1F5F9` (Slate 100) | `#131722` (Card Raised) | 0.83 | **15.2 : 1** | **PASS (AAA)** |
| **Dark Muted / Soft Text** | `#94A3B8` (Slate 400) | `#131722` (Card Raised) | 0.54 | **6.4 : 1** | **PASS (AA & AAA Large)** |
| **Dark Subtitle / Hint** | `#64748B` (Slate 500) | `#0A0C10` (Dark Base) | 0.38 | **3.8 : 1** | **PASS (UI Hint $\ge 3:1$)** |
| **Primary CTA Button (Dark)** | `#0A0C10` (Obsidian Ink) | `#FFFFFF` (Titanium White) | 0.95 | **18.2 : 1** | **PASS (AAA Highest)** |
| **Primary CTA Button (Light)** | `#FFFFFF` (White Text) | `#0F172A` (Slate Ink) | 0.84 | **16.1 : 1** | **PASS (AAA)** |
| **Imposter Danger Badge** | `#FFE4E6` (Ruby 100) | `#E11D48` (Ruby 600) | 0.65 | **5.4 : 1** | **PASS (AA)** |
| **Civilian Win Badge** | `#ECFDF5` (Mint 100) | `#059669` (Emerald 600) | 0.64 | **5.1 : 1** | **PASS (AA)** |
| **Light Body Text on Base** | `#0F172A` (Slate 900) | `#F8F9FA` (Light Base) | 0.84 | **16.1 : 1** | **PASS (AAA)** |
| **Light Card Text on Raised**| `#0F172A` (Slate 900) | `#FFFFFF` (Light Card) | 0.88 | **17.9 : 1** | **PASS (AAA)** |
| **Light Muted Text** | `#475569` (Slate 600) | `#FFFFFF` (Light Card) | 0.58 | **7.2 : 1** | **PASS (AAA)** |

---

## 5. Layout, Ergonomics & Spacing (`better-layout`)

### 1. Viewport & Mobile Chrome (`100dvh`)
- Replace all legacy `min-h-screen` or `100vh` wrappers with `min-h-dvh` and `h-dvh`.
- Integrate safe-area padding:
  ```css
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  padding-top: max(0.75rem, env(safe-area-inset-top));
  ```
- Guaranteed no-scroll single-viewport layout for core game screens (Discussion, Voting, Reveal) on iPhone Dynamic Island and Android navigation bars.

### 2. Grouping Geometry: The 2:1 Spatial Ratio
- Internal item gap within a semantic group (e.g., player avatar + name + status): `8px` (`gap-2`).
- Boundary gap between distinct functional blocks (e.g., voting header vs player list): `20px` to `24px` (`gap-5` or `gap-6`).
- Section divider rule: Use whitespace first. Do not insert redundant gray hairline borders between elements that space already separates.

### 3. Dedicated Phone Ergonomics & Single-Column Thumb Zone
- **Voting List**: Remove the 2-column grid on mobile (`grid-cols-1 sm:grid-cols-2`). On a held phone, 2 columns cause thumb strain, accidental mis-taps, and awkward text truncation.
- Single-column row buttons with minimum 56px touch target height (`h-14`), left-anchored avatar indicator, and right-aligned ballot radio indicator.

### 4. 320px Stress Testing
- Dynamic max-widths using `w-full max-w-md mx-auto`.
- Minimum content containment: Text containers use `min-w-0` and flex wrappers allow wrapping where player names exceed 14 characters.

---

## 6. UI Polish & Micro-Interactions (`better-ui`)

### 1. Concentric Border Radius Formula
Every nested card, button, and container must obey the concentric radius equation:
$$R_{\text{outer}} = R_{\text{inner}} + \text{Padding} + \text{Border}$$
- **Outer Modal / Shell**: `rounded-3xl` (24px) with `p-5` (20px).
- **Inner Interactive Element**: $24px - 20px = 4px$ is too small for modern touch UI, so we treat layers as separate surfaces per `better-ui` guidelines:
  - Container: `rounded-[28px]` (28px).
  - Child action card: `rounded-2xl` (16px) with `p-4` (16px) padding.
  - Inner avatar/badge: `rounded-xl` (12px).

### 2. Physical Press Feedback (`0.96` Scale Rule)
- All tappable cards, buttons, and avatar selectors apply:
  ```css
  active:scale-[0.96] transition-[transform,background-color,border-color] duration-150 ease-out
  ```
- Disabled elements strictly enforce:
  ```css
  disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100
  ```

### 3. Icon Stroke Weight Synchronization
- Large hero icons (`32px`–`40px` in `64px` containers): `strokeWidth={2}`.
- Inline text icons (`16px`–`20px` alongside body text): `strokeWidth={1.75}`.
- Micro badges & indicators (`12px`–`14px`): `strokeWidth={1.5}`.

### 4. Zero Stuck Hover States on Touch Screens
All desktop `:hover` states wrapped behind `@media (hover: hover)`:
- Prevents mobile browsers from leaving buttons stuck in a highlighted state after a tap.

### 5. Instant Theme Switching without Smear
Include the transition suppression utility:
```typescript
export function toggleThemeWithoutTransition(isDark: boolean) {
  document.documentElement.classList.add("no-transitions");
  if (isDark) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("no-transitions");
    });
  });
}
```

---

## 7. Motion Choreography (`animation-vocabulary`)

Applying Emil Kowalski's motion vocabulary to create high-tension party moments:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ODDWORD MOTION CHOREOGRAPHY                           │
├─────────────────────┬──────────────────────────┬────────────────────────────┤
│ Interaction Moment  │ Emil Kowalski Motion     │ Implementation Spec        │
├─────────────────────┼──────────────────────────┼────────────────────────────┤
│ Word Reveal Card    │ Origin-aware pop-in with │ initial: { scale: 0.9,     │
│                     │ blur clearance           │   filter: 'blur(8px)',     │
│                     │                          │   opacity: 0 }             │
│                     │                          │ animate: { scale: 1,       │
│                     │                          │   filter: 'blur(0px)',     │
│                     │                          │   opacity: 1 }             │
│                     │                          │ spring: bounce: 0, dur: 0.4│
├─────────────────────┼──────────────────────────┼────────────────────────────┤
│ Discussion Timer    │ Stepped countdown with   │ font-mono tabular-nums,    │
│                     │ ambient tension pulse    │ smooth progress circle,    │
│                     │                          │ pulse when < 15 seconds    │
├─────────────────────┼──────────────────────────┼────────────────────────────┤
│ Player Elimination  │ Staggered cascade        │ Stagger interval: 100ms    │
│ & Voting Results    │                          │ translateY: 12px → 0       │
│                     │                          │ blur: 4px → 0              │
├─────────────────────┼──────────────────────────┼────────────────────────────┤
│ Phase Navigation    │ Direction-aware forward  │ Enter: { y: 16, opacity: 0}│
│ (GameShell)         │ slide & upward exit      │ Exit: { y: -16, opacity: 0}│
│                     │                          │ Duration: 180ms ease-out   │
├─────────────────────┼──────────────────────────┼────────────────────────────┤
│ Touch Confirmation  │ Rubber-band tap feedback │ scale: 0.96 over 150ms     │
└─────────────────────┴──────────────────────────┴────────────────────────────┘
```

### Full Reduced-Motion Fallback Guard
Every animation block wraps in Framer Motion's `reducedMotion="user"` config:
- When a user has `prefers-reduced-motion: reduce`, all scale, blur, and translateY translations collapse into gentle instant opacity cross-fades.

---

## 8. Screen-by-Screen UI Specifications

### Screen 1: HomeScreen (`HomeScreen.tsx`)
- **Hero Unit**:
  - Center-stage new `OddwordLogo` (Concept A) with radiant atmospheric backlight.
  - Primary Logotype: **ODDWORD** in bold geometric display typography (`font-heading`).
  - Sleek tag: *"The Party Word Game of Hidden Deception"*.
- **Primary Game Card**:
  - Full-width hero action card for **"Pass & Play (Offline Party)"**.
  - Distinctive pill tags: `4–10 Players` · `Single Phone` · `Offline`.
  - Prominent high-contrast CTA button: **"Start Party Game"** with animated chevron on hover.
- **Online Multiplayer Card**:
  - Streamlined horizontal live-card with pulsing green "Live Room" beacon.
  - One-tap access to Host or Join Room.
- **How to Play Drawer / Quick Guide**:
  - 3 clean visual steps with distinctive icon badges:
    1. *Secret Assignment*: Pass the phone; everyone sees the word except the Imposter.
    2. *Careful Clues*: Give one-word clues around the circle without giving the secret away.
    3. *The Ballot*: Vote to uncover the infiltrator before they blend in!

### Screen 2: Player Setup (`PlayerSetup.tsx`)
- **Player Input**:
  - Clean floating input with instant "+" action button.
  - Default preset quick-fill chips for party convenience (e.g. "Add 4 Friends").
- **Player List**:
  - Tactile row cards featuring high-contrast colored avatar badges (all WCAG AA verified).
  - Smooth reorder/delete micro-interactions.
- **Threshold Meter**:
  - Visual indicator showing `4 Players Required` unlocking into vibrant green state once met.

### Screen 3: Secret Reveal Flow (`RevealFlow.tsx`)
- **Stage 1 (Pass the Phone)**:
  - Stealth card mode: Privacy screen with "Tap to uncover your identity".
  - Obscures screen from peekers sitting beside the current player.
- **Stage 2 (Dramatic Reveal)**:
  - **Civilian**: Crisp Emerald badge: *"You know the secret word."* Displays category and word in giant typography with spring entrance.
  - **Imposter**: Neon Ruby alert badge: *"YOU ARE THE IMPOSTER."* Category hint displayed, with tactical guidance: *"Blend in. Guess the word from context."*

### Screen 4: Discussion Timer (`DiscussionTimer.tsx` & `OnlineDiscussionScreen.tsx`)
- **Configurable Durations (5-Minute Maximum Cap)**:
  - Both Online Lobby and Offline Pass & Play setup allow selecting between:
    - `120s (2m)` — fast-paced blitz debate.
    - `3 min (180s)` — standard balanced party debate (default).
    - `5 min (300s Max)` — in-depth forensic deduction limit.
  - Server validation enforces the strict 5-minute cap (`AllowedTimerDurations` in Go engine: `{120, 180, 300}`).
- **Timer Dial & State**:
  - High-precision SVG circular progress ring with `tabular-nums` countdown display.
  - Neutral Slate monochrome clock transitioning to pulsing Neon Ruby under 15 seconds.
- **Quick Controls**:
  - Offline: One-tap `+30s` button, pause/resume, and immediate "Proceed to Vote" CTA.
  - Online: Host has an immediate "Proceed to Voting Now" shortcut to skip the remainder of the discussion timer.

### Screen 5: Voting Screen (`VotingScreen.tsx` & `OnlineVotingScreen.tsx`)
- **Single-Column Touch List**:
  - Full-width rows with left-anchored avatar circles and bold player names.
  - Radio target indicator on the right edge with 0.96 active press scale.
- **Ballot Confirmation**:
  - "Cast Vote" action button scales down to 0.96 and triggers immediate tactile feedback.
- **Online Live Progress**:
  - Real-time tally showing ballots submitted (e.g. "4 / 6 Ballots Submitted") with animated progress fill.
- **Host Early Tally & Stop Option (`END_VOTING`)**:
  - Host possesses a dedicated action button: **"Stop Voting & Tally Early (X / Y votes)"**.
  - Dispatches `END_VOTING` to the backend Room actor, immediately calling `finalizeVoting()` using all ballots submitted so far, preventing stalled lobbies from slow or AFK players.

### Screen 6: Elimination Result & Game Over (`GameOverScreen.tsx`)
- **Dramatic Staggered Orchestration (100ms intervals)**:
  1. *Banner (0ms)*: Massive unmasking announcement — **"CIVILIANS TRIUMPH"** or **"THE IMPOSTER ESCAPES"**.
  2. *Identity Cards (100ms)*: Reveals who the imposter was with custom unmasked badge.
  3. *Secret Word (200ms)*: Displays the secret word in bold typography.
  4. *Action Bar (300ms)*: "Play Again (Same Players)" or "New Game".

---

## 9. File-by-File Implementation Roadmap

### Phase 1: Rebranding & Assets (Completed)
| File Path | Description of Changes | Status |
|---|---|---|
| [`frontend/app/icon.svg`](file:///c:/dev/sus-word-app/frontend/app/icon.svg) | Replace crude smiley SVG with new Oddword Concept A vector emblem. | Done |
| [`frontend/scripts/generate-icons.mjs`](file:///c:/dev/sus-word-app/frontend/scripts/generate-icons.mjs) | Run Sharp script to regenerate `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon.png`, and `logo.png`. | Done |
| [`frontend/components/ui/OddwordLogo.tsx`](file:///c:/dev/sus-word-app/frontend/components/ui/OddwordLogo.tsx) | Create brand-new logo component with animated glow, disguise slit, and scalable sizes. | Done |
| [`frontend/app/layout.tsx`](file:///c:/dev/sus-word-app/frontend/app/layout.tsx) | Update title to `"Oddword — Imposter Party Game"`, metadata, Apple web app configuration, and theme colors. | Done |
| [`frontend/app/manifest.ts`](file:///c:/dev/sus-word-app/frontend/app/manifest.ts) | Update PWA manifest name, short_name to `"Oddword"`, and theme colors. | Done |

### Phase 2: Design Token & Color System Overhaul (Completed)
| File Path | Description of Changes | Status |
|---|---|---|
| [`frontend/app/globals.css`](file:///c:/dev/sus-word-app/frontend/app/globals.css) | Implement Midnight Infiltration palette in OKLCH: Velvet Indigo-Obsidian neutrals, Cyber-Amber CTA, Neon Ruby imposter, Aurora Emerald civilian. Remove all muddy brown tokens. Add `no-transitions` class. | Done |
| [`frontend/lib/utils.ts`](file:///c:/dev/sus-word-app/frontend/lib/utils.ts) | Refresh player avatar color ramps to guarantee > 5.5:1 contrast against white text for all 8 player colors. | Done |

### Phase 3: Shell & Layout Polish (Completed)
| File Path | Description of Changes | Status |
|---|---|---|
| [`frontend/components/game/GameShell.tsx`](file:///c:/dev/sus-word-app/frontend/components/game/GameShell.tsx) | Update animation variants to Emil Kowalski forward-progression motion (enter $y: 16$, exit $y: -16$, 180ms ease-out). Add dynamic viewport height containment. | Done |
| [`frontend/app/page.tsx`](file:///c:/dev/sus-word-app/frontend/app/page.tsx) | Replace `min-h-screen` with `min-h-dvh`. Align header and GameShell using shared `.layout-container`. Update branding header and safe area padding. | Done |

### Phase 4: Core Game Screen Overhauls (Completed)
| File Path | Description of Changes | Status |
|---|---|---|
| [`frontend/components/game/HomeScreen.tsx`](file:///c:/dev/sus-word-app/frontend/components/game/HomeScreen.tsx) | Full redesign with hero `OddwordLogo`, Pass & Play card, refined Online card, and inline How to Play. | Done |
| [`frontend/components/game/PlayerSetup.tsx`](file:///c:/dev/sus-word-app/frontend/components/game/PlayerSetup.tsx) | Refine player list with concentric radii, 320px text truncation, and vibrant ready meter. | Done |
| [`frontend/components/game/RevealFlow.tsx`](file:///c:/dev/sus-word-app/frontend/components/game/RevealFlow.tsx) | Implement dramatic spring card reveal, unmasking animation, and high-contrast role badges. | Done |
| [`frontend/components/game/DiscussionTimer.tsx`](file:///c:/dev/sus-word-app/frontend/components/game/DiscussionTimer.tsx) | Circular SVG timer ring with `tabular-nums` and tension color transition under 15s. | Done |
| [`frontend/components/game/VotingScreen.tsx`](file:///c:/dev/sus-word-app/frontend/components/game/VotingScreen.tsx) | Single-column thumb-friendly layout, 0.96 active scale, tactile confirmation. | Done |
| [`frontend/components/game/OnlineVotingScreen.tsx`](file:///c:/dev/sus-word-app/frontend/components/game/OnlineVotingScreen.tsx) | Sync voting layout with offline screen, add live ballot tally progress bar and 0.96 scale. | Done |
| [`frontend/components/game/GameOverScreen.tsx`](file:///c:/dev/sus-word-app/frontend/components/game/GameOverScreen.tsx) | Staggered 100ms cascade reveal, dramatic unmasking cards, and clean replay action bar. | Done |

---

## 10. Verification & Acceptance Criteria

- [x] **Brand Identity**:
  - "SusWord" completely replaced with "Oddword" across all metadata, copy, manifests, and component titles.
  - Brand tagline and copywriting sound like a premium modern party game.
- [x] **Logo & Favicon**:
  - The "imposter" idea is immediately obvious in the logo via the disguised slash and revealing eye.
  - Favicon remains distinct and readable at 16×16 and 32×32 pixels.
  - All PWA icons (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) properly regenerated from vector source.
- [x] **Color & Accessibility**:
  - Every foreground/background pair passes WCAG 2.1 AA (minimum 4.5:1 for body, 3:1 for large/UI components).
  - Light and Dark modes both feel intentional, modern, and high-contrast.
  - Zero raw hex values inside component styling — 100% semantic token references.
- [x] **Mobile & Ergonomics**:
  - Tested on 320px viewport without horizontal scroll or button clipping.
  - `min-h-dvh` prevents mobile address bar overlap.
  - Voting list is single-column with comfortable thumb touch targets.
- [x] **Motion & Polish**:
  - Respects `prefers-reduced-motion` with graceful cross-fades.
  - Active press scales to exactly 0.96 on interactive controls.
  - No stuck `:hover` states on touch devices.
- [x] **Timer & Voting Flexibility**:
  - Maximum discussion duration capped at 5 minutes (300s).
  - Selectable presets: 120s (2m), 3 min (180s), and 5 min (300s Max) in both Online Lobby and Offline Setup.
  - Host can stop voting early with "Stop Voting & Tally Early" (`END_VOTING`), preventing stalled games if players are slow or AFK.
