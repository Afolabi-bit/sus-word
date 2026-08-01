# Imposter Word Game — Architecture & Codebase Documentation

This document provides a comprehensive description of every directory and file in the **Imposter Word Game** codebase, detailing how each part functions, how the state machine flows, how design tokens operate, and how individual components interact.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Directory Tree](#directory-tree)
3. [Core Application Files (`/app`)](#core-application-files-app)
4. [Domain & Logic (`/lib`)](#domain--logic-lib)
5. [Game Phase Components (`/components/game`)](#game-phase-components-componentsgame)
6. [UI Design System Components (`/components/ui`)](#ui-design-system-components-componentsui)
7. [Configuration & Build Files](#configuration--build-files)

---

## Architecture Overview

The **Imposter Word Game** is a 100% offline, single-device, pass-and-play party game built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Zustand v5**, **Zod**, and **Framer Motion**.

### Key Architectural Design Patterns:
- **Offline Single-Device State**: All state lives in memory within a centralized Zustand store. There are no API endpoints, database calls, or external network requests.
- **Reducer State Machine**: The core game flow is modeled as a pure `gameReducer` function and exposed via a Zustand hook (`useGameStore`). State transitions are strictly controlled via explicit actions (`START_GAME`, `NEXT_REVEAL`, `ELIMINATE_PLAYER`, etc.).
- **Single-Page Phase Router**: The main entry point (`app/page.tsx`) reads the current game phase from the Zustand store and dynamically renders the matching component inside Framer Motion's `AnimatePresence` for smooth transition effects.
- **Design Token System**: Color tokens (for light and dark mode) are declared as CSS custom properties in `globals.css` and bound to Tailwind v4 `@theme inline` utilities and Shadcn UI component variables.
- **React 19 / Zustand 5 Optimization**: Individual property selectors (`useGameStore(s => s.prop)`) are used across components to guarantee stable object snapshots for `useSyncExternalStore` and prevent unnecessary re-renders.

---

## Directory Tree

```
sus-word/
├── app/
│   ├── globals.css           # Global CSS, design tokens, light/dark themes
│   ├── layout.tsx            # Root layout, metadata, theme initialization
│   └── page.tsx              # Phase-router main page component
├── components/
│   ├── game/
│   │   ├── GameShell.tsx       # Framer Motion wrapper layout for game screens
│   │   ├── HomeScreen.tsx      # Title/welcome screen
│   │   ├── PlayerSetup.tsx     # Player name entry form & list management
│   │   ├── RevealFlow.tsx      # Pass-and-play role & secret word reveal flow
│   │   ├── ReadyScreen.tsx     # Pre-discussion prompt screen
│   │   ├── DiscussionTimer.tsx # 5-minute countdown discussion timer
│   │   ├── VotingScreen.tsx    # Active player list & elimination voting
│   │   ├── ResultScreen.tsx    # Round elimination result screen
│   │   └── GameOverScreen.tsx  # Game summary, winner reveal, history & replay
│   └── ui/
│       ├── badge.tsx           # Shadcn Badge primitive
│       ├── button.tsx          # Shadcn Button primitive
│       ├── card.tsx            # Shadcn Card primitive
│       ├── dialog.tsx          # Shadcn Dialog primitive (powered by @base-ui)
│       └── input.tsx           # Shadcn Input primitive
├── lib/
│   ├── store.ts              # Game state machine, reducer, actions & Zustand store
│   ├── utils.ts              # `cn` helper for class name merging (clsx + tailwind-merge)
│   ├── validation.ts         # Zod schemas & validation functions for players
│   └── words.ts              # Offline word repository (categorized, 40+ curated words)
├── public/                   # Static public assets (SVG icons, etc.)
├── components.json           # Shadcn UI CLI configuration
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies & package scripts
├── postcss.config.mjs        # PostCSS configuration for Tailwind v4
└── tsconfig.json             # TypeScript configuration & path aliases (`@/*`)
```

---

## Core Application Files (`/app`)

### 1. [`app/globals.css`](file:///c:/dev/sus-word/app/globals.css)
- **Purpose**: Defines the global styling system, design tokens for light and dark mode, Tailwind CSS v4 `@theme inline` aliases, and Shadcn UI component variable bindings.
- **How it works**:
  - Sets root CSS variables for light theme (`--bg-app: #FFFDF7`, `--bg-card: #FFFFFF`, `--accent: #EF9F27`, `--imposter: #ED93B1`, `--civilians-win: #97C459`, `--imposter-wins: #F09595`, `--timer: #85B7EB`, etc.).
  - Overrides variables in `.dark` mode using darker variants optimized for contrast.
  - Maps `--color-*` variables in Tailwind v4 `@theme inline` block so custom classes like `bg-app`, `bg-game-card`, `bg-imposter`, `bg-timer`, `text-accent-text`, etc. can be used across components.
  - Uses robust system font stacks (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`) for 100% offline reliability.

### 2. [`app/layout.tsx`](file:///c:/dev/sus-word/app/layout.tsx)
- **Purpose**: Root HTML wrapper for the application.
- **How it works**:
  - Configures app metadata (title: "Imposter Word Game", description) and mobile viewports (`userScalable: false`, `themeColor: "#EF9F27"`).
  - Injects a small inline script in `<head>` to detect OS dark mode (`prefers-color-scheme: dark`) and apply the `.dark` class to `<html>` before first paint to prevent layout flashes.
  - Wraps all rendered pages in a full-height body shell (`min-h-full flex flex-col`).

### 3. [`app/page.tsx`](file:///c:/dev/sus-word/app/page.tsx)
- **Purpose**: Main entry point acting as a single-page phase router.
- **How it works**:
  - Listens to `phase` from `useGameStore((s) => s.phase)`.
  - Uses a `switch (phase)` statement to conditionally render the active phase screen:
    - `"home"` → `<HomeScreen />`
    - `"setup"` → `<PlayerSetup />`
    - `"revealing"` → `<RevealFlow />`
    - `"ready"` → `<ReadyScreen />`
    - `"discussing"` → `<DiscussionTimer />`
    - `"voting"` → `<VotingScreen />`
    - `"result"` → `<ResultScreen />`
    - `"gameOver"` → `<GameOverScreen />`
  - Wraps the active screen in Framer Motion's `<AnimatePresence mode="wait">` to perform fade/slide transition animations when phases change.

---

## Domain & Logic (`/lib`)

### 1. [`lib/store.ts`](file:///c:/dev/sus-word/lib/store.ts)
- **Purpose**: Defines the core game state machine, types, actions, pure reducer function, and Zustand store hook.
- **Data Structures**:
  - `Phase`: `"home" | "setup" | "revealing" | "ready" | "discussing" | "voting" | "result" | "gameOver"`
  - `EliminationRecord`: `{ name: string; wasImposter: boolean }`
  - `GameState`: Stores current phase, `players`, `activePlayers` (remaining uneliminated), `imposter` name, `secretWord`, `revealIndex`, `wordVisible` flag, `eliminationHistory`, `lastEliminated` player record, `winner` (`"civilians" | "imposter"`), and `timerSeconds` (default: 300s / 5 mins).
- **State Machine Actions & Reducer Rules**:
  - `ADD_PLAYER` / `REMOVE_PLAYER`: Modifies player list during setup (max 10).
  - `START_GAME`: Validates player count (4–10), randomly assigns an Imposter, selects a random word via `getRandomWord()`, and transitions to `"revealing"`.
  - `SHOW_WORD` / `NEXT_REVEAL`: Manages individual player pass-and-play steps. Once all players have seen their role, transitions phase to `"ready"`.
  - `START_DISCUSSION`: Resets timer to 300 seconds and sets phase to `"discussing"`.
  - `END_DISCUSSION`: Transitions phase to `"voting"`.
  - `ELIMINATE_PLAYER`: Removes chosen player from `activePlayers` and checks win conditions:
    - If eliminated player was the Imposter → `winner = "civilians"`, phase = `"gameOver"`.
    - If active players reduced to 2 (Imposter + 1 Civilian) → `winner = "imposter"`, phase = `"gameOver"`.
    - Otherwise → phase = `"result"` (shows round summary, allowing continuation to next discussion round).
  - `NEXT_ROUND`: Returns from `"result"` to `"discussing"`.
  - `PLAY_AGAIN`: Keeps same player names, picks new Imposter & secret word, resets state to `"revealing"`.
  - `NEW_GAME`: Resets state completely back to `"setup"`.

### 2. [`lib/validation.ts`](file:///c:/dev/sus-word/lib/validation.ts)
- **Purpose**: Zod validation schemas and utility helpers for user inputs and game rules.
- **Functions**:
  - `playerNameSchema`: Zod schema enforcing trimmed string, 1–20 characters.
  - `validatePlayerName(rawName, existingPlayers)`: Validates name length and checks case-insensitive uniqueness against existing players. Returns `{ success: true, name }` or `{ success: false, error }`.
  - `canStartGame(players)`: Ensures the player count is between 4 and 10 players.

### 3. [`lib/words.ts`](file:///c:/dev/sus-word/lib/words.ts)
- **Purpose**: Static offline dictionary containing curated words across universally known categories.
- **Categories**: Animals (Dolphin, Penguin, Elephant...), Food (Pancake, Sushi, Chocolate...), Nature (Lily, Sunflower, Rainbow...), Everyday Objects (Clock, Umbrella, Candle...), Places (Vacation, Lighthouse, Carnival...).
- **Exports**: `getRandomWord()` for picking a flat random word, `getCategories()`, and the `WORD_LIST` array.

### 4. [`lib/utils.ts`](file:///c:/dev/sus-word/lib/utils.ts)
- **Purpose**: Utility helper exporting `cn(...)` which combines `clsx` and `tailwind-merge` to safely merge Tailwind CSS class names without styling conflicts.

---

## Game Phase Components (`/components/game`)

All game phase components use individual Zustand selectors (`useGameStore((s) => s.fieldName)`) to ensure React 19 snapshot stability.

### 1. [`components/game/GameShell.tsx`](file:///c:/dev/sus-word/components/game/GameShell.tsx)
- **Purpose**: Shared outer container wrapper for game screens.
- **How it works**: Uses Framer Motion `<motion.div>` with fade and slide-up animation variants (`opacity: 0, y: 12` to `opacity: 1, y: 0`), enforcing a centered mobile-friendly container (`max-w-md mx-auto px-6 py-10`).

### 2. [`components/game/HomeScreen.tsx`](file:///c:/dev/sus-word/components/game/HomeScreen.tsx)
- **Purpose**: Welcome title screen when app launches.
- **How it works**: Displays the game title, subtitle, icon, and a primary "New Game" button styled with the `bg-accent` token that dispatches `NEW_GAME`.

### 3. [`components/game/PlayerSetup.tsx`](file:///c:/dev/sus-word/components/game/PlayerSetup.tsx)
- **Purpose**: Player entry form.
- **How it works**:
  - Controlled text input bound to local state.
  - Calls `validatePlayerName()` on submit (Enter key or button click) and displays inline errors if validation fails.
  - Renders a list of current players with badges and individual remove (`X`) buttons.
  - "Start Game" button remains disabled until 4–10 valid players are added.

### 4. [`components/game/RevealFlow.tsx`](file:///c:/dev/sus-word/components/game/RevealFlow.tsx)
- **Purpose**: Handles pass-and-play role and word reveal.
- **How it works**:
  - **Sub-state 1 (Cover)**: Shows "Pass the phone to [Player Name]" with an "EyeOff" icon and a "Tap to Reveal" button.
  - **Sub-state 2 (Reveal)**: Displays the secret word for Civilians OR "You are the Imposter!" styled with the `--imposter` theme token for the Imposter.
  - Advances to the next player via "Got it" button dispatching `NEXT_REVEAL`.

### 5. [`components/game/ReadyScreen.tsx`](file:///c:/dev/sus-word/components/game/ReadyScreen.tsx)
- **Purpose**: Displayed after all players have completed their pass-and-play reveal.
- **How it works**: Prompts group to gather around and provides a solid accent "Start Discussion" button that dispatches `START_DISCUSSION`.

### 6. [`components/game/DiscussionTimer.tsx`](file:///c:/dev/sus-word/components/game/DiscussionTimer.tsx)
- **Purpose**: On-screen 5-minute (300s) discussion timer.
- **How it works**:
  - Uses `setInterval` in a `useEffect` hook to tick down `remaining` seconds.
  - Displays formatted time (`MM:SS`) in large monospace font using the `--timer` token and a dynamic visual progress bar (`style={{ width: '${progress * 100}%' }}`).
  - Automatically dispatches `END_DISCUSSION` when time reaches 0, or manually via the "End Discussion Early" outline button.

### 7. [`components/game/VotingScreen.tsx`](file:///c:/dev/sus-word/components/game/VotingScreen.tsx)
- **Purpose**: Elimination voting interface.
- **How it works**:
  - Renders a button list of remaining `activePlayers`.
  - Tapping a player opens a Shadcn `Dialog` modal asking "Eliminate [Player]?" for host confirmation.
  - Confirming dispatches `ELIMINATE_PLAYER`, triggering win condition checks in the store.

### 8. [`components/game/ResultScreen.tsx`](file:///c:/dev/sus-word/components/game/ResultScreen.tsx)
- **Purpose**: Displays the outcome of a round elimination when the game does not immediately end.
- **How it works**:
  - Shows whether the eliminated player was a Civilian (styled with `bg-imposter-wins` token, notifying group that the Imposter is still at large).
  - Tapping "Next Round" dispatches `NEXT_ROUND` to restart the discussion timer.

### 9. [`components/game/GameOverScreen.tsx`](file:///c:/dev/sus-word/components/game/GameOverScreen.tsx)
- **Purpose**: Final screen displayed when a win condition is triggered.
- **How it works**:
  - Dominant banner color reflects the winner (`bg-civilians-win` or `bg-imposter-wins`).
  - Reveals who the Imposter was and what the secret word was.
  - Shows complete chronological `eliminationHistory`.
  - Offers "Play Again" (re-randomizes roles with same players) and "New Game" buttons.

---

## UI Design System Components (`/components/ui`)

These components are Shadcn UI primitives built on top of Tailwind CSS and `@base-ui/react` accessibility primitives:

- **[`components/ui/button.tsx`](file:///c:/dev/sus-word/components/ui/button.tsx)**: Reusable button component supporting `default`, `outline`, `secondary`, `ghost`, and `destructive` variants and sizes (`sm`, `default`, `lg`, `icon`).
- **[`components/ui/badge.tsx`](file:///c:/dev/sus-word/components/ui/badge.tsx)**: Small pill indicator used for player numbers.
- **[`components/ui/card.tsx`](file:///c:/dev/sus-word/components/ui/card.tsx)**: Structured surface card container components (`Card`, `CardHeader`, `CardTitle`, `CardContent`, etc.).
- **[`components/ui/input.tsx`](file:///c:/dev/sus-word/components/ui/input.tsx)**: Styled text input field for player name entry.
- **[`components/ui/dialog.tsx`](file:///c:/dev/sus-word/components/ui/dialog.tsx)**: Accessible modal dialog primitive (Header, Footer, Title, Description, Overlay) powered by `@base-ui/react/dialog`.

---

## Configuration & Build Files

- **[`package.json`](file:///c:/dev/sus-word/package.json)**: Specifies dependencies (`zustand`, `zod`, `framer-motion`, `lucide-react`, `@base-ui/react`, `next`, `react`, `tailwindcss`) and build/dev scripts.
- **[`components.json`](file:///c:/dev/sus-word/components.json)**: Configures Shadcn UI CLI (`style: base-nova`, `tailwind.css: app/globals.css`, aliases for components and utils).
- **[`tsconfig.json`](file:///c:/dev/sus-word/tsconfig.json)**: TypeScript compiler settings, path mappings (`@/* -> ./*`), and Next.js plugin integrations.
- **[`next.config.ts`](file:///c:/dev/sus-word/next.config.ts)**: Next.js configuration object.
- **[`postcss.config.mjs`](file:///c:/dev/sus-word/postcss.config.mjs)**: Configures PostCSS with `@tailwindcss/postcss` for Tailwind CSS v4.
- **[`eslint.config.mjs`](file:///c:/dev/sus-word/eslint.config.mjs)**: ESLint configuration extending Next.js core web vitals and TypeScript rules.
