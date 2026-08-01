# SusWord — Imposter Word Game 🕵️‍♂️💬

<p align="center">
  <strong>Find the imposter among your friends before time runs out!</strong><br />
  A fast-paced, offline-first pass-and-play party game built for mobile & desktop web.
</p>

---

## 🌟 Overview

**SusWord** is a 100% offline, single-device pass-and-play party game designed for 4 to 10 players. One player is secretly assigned as the **Imposter** who does not know the secret word. Everyone else is a **Civilian** who knows the secret word. Players take turns giving subtle clues, discussing, and voting to unmask the faker before time runs out!

Built with modern web standards as an installable **Progressive Web App (PWA)**, SusWord works completely offline without requiring any server infrastructure, account sign-ups, or internet connectivity.

---

## ✨ Features

- 📱 **Pass & Play Mode**: Play on a single shared phone or tablet passed around the group.
- 🌐 **PWA & Offline Ready**: Full Service Worker caching and Web App Manifest — install to iOS / Android Home Screen and play anywhere (airplanes, camping, offline parties).
- 🔒 **Visual Privacy Protection**: Equalized role reveal cards guarantee zero visual color leaks from across the room or over shoulders.
- ⏱️ **Interactive Discussion Timer**: Built-in 5-minute countdown timer with quick controls and progress visualization.
- 🗳️ **Elimination Voting**: Host-managed voting screen with confirmation dialogs and round-by-round elimination summaries.
- 🎨 **Modern Design System**: Dynamic light and dark mode support with tailored color tokens, micro-animations, and glassmorphism UI.
- 📚 **Curated Word Bank**: Diverse, family-friendly word dictionary categorized into Animals, Food, Nature, Everyday Objects, and Places.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **State Management** | [Zustand v5](https://zustand-demo.pmnd.rs/) (Pure Reducer State Machine) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS Custom Properties |
| **UI Primitives** | [Shadcn UI](https://ui.shadcn.com/) / [@base-ui/react](https://base-ui.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Validation** | [Zod](https://zod.dev/) |
| **PWA Capabilities** | Next.js Metadata API Manifest + Custom Service Worker (`sw.js`) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Afolabi-bit/sus-word.git
   cd sus-word
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server with hot-reloading |
| `npm run build` | Compiles the production build, generates static routes, and verifies TypeScript types |
| `npm run start` | Runs the compiled Next.js production server locally |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |
| `node scripts/generate-icons.mjs` | Regenerates PWA icon PNGs (`192x192`, `512x512`, `180x180`) from source SVG |

---

## 🎮 How to Play

1. **Setup**: Enter the names of 4 to 10 players.
2. **Pass & Reveal**: Hand the phone to each player one by one. Tap to reveal your secret role/word in private, then pass to the next player.
   - **Civilians** will see the secret word (e.g., *"Chocolate"*).
   - The **Imposter** will see *"You are the Imposter!"*.
3. **Discuss**: Gather around! Start the 5-minute discussion timer. Players take turns giving subtle one-word or short clues about the secret word.
   - *Civilians* try to signal to other civilians that they know the word without making it obvious to the Imposter.
   - The *Imposter* tries to blend in and guess the word from others' clues!
4. **Vote**: Tap on the player the group suspects is the Imposter.
5. **Outcome**:
   - If the Imposter is eliminated → **Civilians Win!** 🎉
   - If a Civilian is wrongfully eliminated → Proceed to the next round with remaining active players.
   - If active players are reduced to 2 (Imposter + 1 Civilian) → **Imposter Wins!** 🕵️‍♂️

---

## 📱 PWA & Mobile Installation

SusWord is fully optimized for installation on mobile devices:

- **iOS (Safari)**: Tap the **Share** button → Select **"Add to Home Screen"**.
- **Android (Chrome)**: Tap the **Menu (⋮)** → Select **"Install App"** or tap the inline **"Add SusWord to Home screen"** banner.

Once installed, SusWord launches in fullscreen standalone mode and functions 100% offline.

---

## 📁 Project Architecture

```
sus-word/
├── app/
│   ├── favicon.ico
│   ├── globals.css          # Design system tokens, light/dark themes, Tailwind v4
│   ├── icon.svg              # App icon source SVG
│   ├── layout.tsx           # Root HTML layout & PWA metadata
│   ├── manifest.ts          # Web App Manifest route generator
│   └── page.tsx             # Main phase router & top bar navigation
├── components/
│   ├── game/
│   │   ├── DiscussionTimer.tsx # 5-minute countdown discussion timer
│   │   ├── GameOverScreen.tsx  # Game summary & winner reveal
│   │   ├── GameShell.tsx       # Framer Motion wrapper layout
│   │   ├── HomeScreen.tsx      # Main launcher & game mode selection
│   │   ├── PlayerSetup.tsx     # Player entry & validation
│   │   ├── ReadyScreen.tsx     # Pre-discussion prompt screen
│   │   ├── ResultScreen.tsx    # Round elimination result
│   │   ├── RevealFlow.tsx      # Equalized pass-and-play role reveal flow
│   │   └── VotingScreen.tsx    # Player elimination voting modal
│   ├── ui/                 # Reusable Shadcn UI primitives (Button, Card, Badge, Dialog)
│   └── ServiceWorkerRegister.tsx # Client-side Service Worker registration
├── lib/
│   ├── store.ts             # Reducer state machine & Zustand store
│   ├── utils.ts             # Tailwind class merging utility (`cn`)
│   ├── validation.ts        # Zod validation schemas for players
│   └── words.ts             # Offline word repository & categories
├── public/
│   ├── apple-touch-icon.png # iOS home screen icon (180x180)
│   ├── icon-192.png         # Android PWA icon (192x192)
│   ├── icon-512.png         # Android splash screen icon (512x512)
│   └── sw.js                # Offline Service Worker cache implementation
└── scripts/
    └── generate-icons.mjs   # Sharp icon generator script
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
