import { create } from "zustand";
import { getRandomWord } from "./words";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Phase =
  | "home"
  | "setup"
  | "revealing"
  | "ready"
  | "discussing"
  | "voting"
  | "result"
  | "gameOver";

export interface EliminationRecord {
  name: string;
  wasImposter: boolean;
}

export interface GameState {
  phase: Phase;
  players: string[];
  activePlayers: string[];
  imposter: string | null;
  secretWord: string | null;
  revealIndex: number;
  /** Within the reveal flow: false = "pass to player" screen, true = word is shown */
  wordVisible: boolean;
  eliminationHistory: EliminationRecord[];
  /** The player eliminated in the most recent vote (used by the result screen). */
  lastEliminated: EliminationRecord | null;
  winner: "civilians" | "imposter" | null;
  /** Discussion timer length in seconds. */
  timerSeconds: number;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type GameAction =
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; name: string }
  | { type: "START_GAME" }
  | { type: "SHOW_WORD" }
  | { type: "NEXT_REVEAL" }
  | { type: "START_DISCUSSION" }
  | { type: "END_DISCUSSION" }
  | { type: "ELIMINATE_PLAYER"; name: string }
  | { type: "NEXT_ROUND" }
  | { type: "PLAY_AGAIN" }
  | { type: "NEW_GAME" };

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const TIMER_DURATION = 300; // 5 minutes

const initialState: GameState = {
  phase: "home",
  players: [],
  activePlayers: [],
  imposter: null,
  secretWord: null,
  revealIndex: 0,
  wordVisible: false,
  eliminationHistory: [],
  lastEliminated: null,
  winner: null,
  timerSeconds: TIMER_DURATION,
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // -- Setup ---------------------------------------------------------------
    case "ADD_PLAYER": {
      if (state.phase !== "setup") return state;
      if (state.players.length >= 10) return state;
      return { ...state, players: [...state.players, action.name] };
    }

    case "REMOVE_PLAYER": {
      if (state.phase !== "setup") return state;
      return {
        ...state,
        players: state.players.filter((p) => p !== action.name),
      };
    }

    // -- Start game ----------------------------------------------------------
    case "START_GAME": {
      if (state.phase !== "setup") return state;
      if (state.players.length < 4 || state.players.length > 10) return state;

      const imposterIndex = Math.floor(Math.random() * state.players.length);
      const imposter = state.players[imposterIndex];
      const word = getRandomWord();

      return {
        ...state,
        phase: "revealing",
        activePlayers: [...state.players],
        imposter,
        secretWord: word.word,
        revealIndex: 0,
        wordVisible: false,
        eliminationHistory: [],
        lastEliminated: null,
        winner: null,
        timerSeconds: TIMER_DURATION,
      };
    }

    // -- Reveal flow ---------------------------------------------------------
    case "SHOW_WORD": {
      if (state.phase !== "revealing") return state;
      return { ...state, wordVisible: true };
    }

    case "NEXT_REVEAL": {
      if (state.phase !== "revealing") return state;
      const nextIndex = state.revealIndex + 1;
      if (nextIndex >= state.players.length) {
        return { ...state, phase: "ready", revealIndex: nextIndex, wordVisible: false };
      }
      return { ...state, revealIndex: nextIndex, wordVisible: false };
    }

    // -- Discussion ----------------------------------------------------------
    case "START_DISCUSSION": {
      if (state.phase !== "ready" && state.phase !== "result") return state;
      return { ...state, phase: "discussing", timerSeconds: TIMER_DURATION };
    }

    case "END_DISCUSSION": {
      if (state.phase !== "discussing") return state;
      return { ...state, phase: "voting" };
    }

    // -- Voting / Elimination ------------------------------------------------
    case "ELIMINATE_PLAYER": {
      if (state.phase !== "voting") return state;

      const wasImposter = action.name === state.imposter;
      const record: EliminationRecord = { name: action.name, wasImposter };
      const newActivePlayers = state.activePlayers.filter(
        (p) => p !== action.name
      );
      const newHistory = [...state.eliminationHistory, record];

      // Win condition: imposter was caught
      if (wasImposter) {
        return {
          ...state,
          phase: "gameOver",
          activePlayers: newActivePlayers,
          eliminationHistory: newHistory,
          lastEliminated: record,
          winner: "civilians",
        };
      }

      // Win condition: only imposter + 1 civilian left
      if (newActivePlayers.length <= 2) {
        return {
          ...state,
          phase: "gameOver",
          activePlayers: newActivePlayers,
          eliminationHistory: newHistory,
          lastEliminated: record,
          winner: "imposter",
        };
      }

      // Game continues — show result screen first
      return {
        ...state,
        phase: "result",
        activePlayers: newActivePlayers,
        eliminationHistory: newHistory,
        lastEliminated: record,
      };
    }

    // -- Next round (from result screen) -------------------------------------
    case "NEXT_ROUND": {
      if (state.phase !== "result") return state;
      return { ...state, phase: "discussing", timerSeconds: TIMER_DURATION };
    }

    // -- Play again (same players, new imposter/word) ------------------------
    case "PLAY_AGAIN": {
      if (state.phase !== "gameOver") return state;

      const imposterIndex = Math.floor(Math.random() * state.players.length);
      const imposter = state.players[imposterIndex];
      const word = getRandomWord();

      return {
        ...state,
        phase: "revealing",
        activePlayers: [...state.players],
        imposter,
        secretWord: word.word,
        revealIndex: 0,
        wordVisible: false,
        eliminationHistory: [],
        lastEliminated: null,
        winner: null,
        timerSeconds: TIMER_DURATION,
      };
    }

    // -- New game (full reset) -----------------------------------------------
    case "NEW_GAME": {
      return { ...initialState, phase: "setup" };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Zustand store
// ---------------------------------------------------------------------------

interface GameStore extends GameState {
  dispatch: (action: GameAction) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  dispatch: (action) =>
    set((store) => {
      const { dispatch: _, ...state } = store;
      const nextState = gameReducer(state, action);
      return nextState;
    }),
}));
