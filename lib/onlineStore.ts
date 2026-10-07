import { create } from "zustand";
import { buildWsUrl, getApiBaseUrl } from "./config";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

export type OnlinePhase =
  | "lobby"
  | "revealing"
  | "ready"
  | "discussing"
  | "voting"
  | "result"
  | "gameOver";

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface PublicPlayer {
  id: string;
  displayName: string;
  isHost: boolean;
  isActive: boolean;
  isReady: boolean;
}

export interface EliminationRecord {
  playerId: string;
  displayName: string;
  wasImposter: boolean;
  round: number;
}

export interface RevealTurnInfo {
  currentPlayerId: string;
  currentPlayerName: string;
  revealIndex: number;
  totalPlayers: number;
}

export interface GameOverInfo {
  winner: "civilians" | "imposter";
  imposterName: string;
  secretWord: string;
  eliminationLog: EliminationRecord[];
}

export interface OnlineGameState {
  // Connection
  status: ConnectionStatus;
  error: string | null;

  // Session
  roomCode: string | null;
  myPlayerId: string | null;
  myPlayerName: string | null;
  isHost: boolean;

  // Authoritative Room State
  phase: OnlinePhase;
  players: PublicPlayer[];
  activePlayers: string[];
  timerDuration: number;
  timerEndsAt: string | null;

  // Private Role State (zero-leakage)
  myRole: "civilian" | "imposter" | null;
  secretWord: string | null;
  secretCategory: string | null;

  // Round & Progression
  revealTurn: RevealTurnInfo | null;
  eliminationLog: EliminationRecord[];
  lastEliminated: EliminationRecord | null;
  winner: "civilians" | "imposter" | null;
  gameOverInfo: GameOverInfo | null;

  // Actions
  createRoom: (hostName: string) => Promise<{ success: boolean; error?: string }>;
  joinRoom: (roomCode: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  leaveRoom: () => void;
  clearError: () => void;

  // Gameplay Actions (dispatched over WS)
  setTimer: (seconds: number) => void;
  startGame: () => void;
  playerReady: () => void;
  startDiscussion: () => void;
  endDiscussion: () => void;
  eliminatePlayer: (playerId: string) => void;
  playAgain: () => void;
}

// ---------------------------------------------------------------------------
// Singleton WebSocket Manager
// ---------------------------------------------------------------------------

let activeSocket: WebSocket | null = null;
let pingInterval: NodeJS.Timeout | null = null;

function cleanupSocket() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  if (activeSocket) {
    activeSocket.onclose = null;
    activeSocket.onerror = null;
    activeSocket.onmessage = null;
    activeSocket.close();
    activeSocket = null;
  }
}

function sendEnvelope(type: string, payload?: unknown) {
  if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) {
    console.warn("[OnlineWS] Socket not open, cannot send:", type);
    return;
  }

  const envelope = {
    type,
    payload: payload !== undefined ? payload : undefined,
  };

  activeSocket.send(JSON.stringify(envelope));
}

// ---------------------------------------------------------------------------
// Store Implementation
// ---------------------------------------------------------------------------

export const useOnlineStore = create<OnlineGameState>((set, get) => ({
  status: "idle",
  error: null,
  roomCode: null,
  myPlayerId: null,
  myPlayerName: null,
  isHost: false,
  phase: "lobby",
  players: [],
  activePlayers: [],
  timerDuration: 60,
  timerEndsAt: null,
  myRole: null,
  secretWord: null,
  secretCategory: null,
  revealTurn: null,
  eliminationLog: [],
  lastEliminated: null,
  winner: null,
  gameOverInfo: null,

  clearError: () => set({ error: null }),

  leaveRoom: () => {
    cleanupSocket();
    set({
      status: "idle",
      error: null,
      roomCode: null,
      myPlayerId: null,
      myPlayerName: null,
      isHost: false,
      phase: "lobby",
      players: [],
      activePlayers: [],
      timerEndsAt: null,
      myRole: null,
      secretWord: null,
      secretCategory: null,
      revealTurn: null,
      eliminationLog: [],
      lastEliminated: null,
      winner: null,
      gameOverInfo: null,
    });
  },

  createRoom: async (hostName: string) => {
    const trimmed = hostName.trim();
    if (!trimmed) {
      return { success: false, error: "Please enter a valid player name." };
    }

    set({ status: "connecting", error: null, myPlayerName: trimmed });

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName: trimmed }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.error || `Failed to create room (${res.status})`;
        set({ status: "error", error: msg });
        return { success: false, error: msg };
      }

      const data = await res.json();
      const roomCode = data.roomCode;

      // Connect WebSocket as host
      await connectWebSocket(roomCode, trimmed, set, get);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error creating room.";
      set({ status: "error", error: msg });
      return { success: false, error: msg };
    }
  },

  joinRoom: async (roomCode: string, displayName: string) => {
    const code = roomCode.trim().toUpperCase();
    const name = displayName.trim();

    if (!code || code.length < 4) {
      return { success: false, error: "Please enter a valid room code." };
    }
    if (!name) {
      return { success: false, error: "Please enter your name." };
    }

    set({ status: "connecting", error: null, myPlayerName: name, roomCode: code });

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/rooms/${code}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg =
          res.status === 404
            ? "Room not found. Check the code and try again."
            : errorData.error || `Room inspection failed (${res.status})`;
        set({ status: "error", error: msg });
        return { success: false, error: msg };
      }

      const info = await res.json();
      if (!info.joinable && info.phase !== "lobby") {
        const msg = "Game is already in progress.";
        set({ status: "error", error: msg });
        return { success: false, error: msg };
      }

      // Connect WebSocket
      await connectWebSocket(code, name, set, get);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error joining room.";
      set({ status: "error", error: msg });
      return { success: false, error: msg };
    }
  },

  // Game control actions
  setTimer: (seconds: number) => {
    sendEnvelope("SET_TIMER", { seconds });
  },

  startGame: () => {
    sendEnvelope("START_GAME");
  },

  playerReady: () => {
    sendEnvelope("PLAYER_READY");
  },

  startDiscussion: () => {
    sendEnvelope("START_DISCUSSION");
  },

  endDiscussion: () => {
    sendEnvelope("END_DISCUSSION");
  },

  eliminatePlayer: (playerId: string) => {
    sendEnvelope("ELIMINATE_PLAYER", { playerId });
  },

  playAgain: () => {
    sendEnvelope("PLAY_AGAIN");
  },
}));

// ---------------------------------------------------------------------------
// WebSocket Connection & Dispatcher
// ---------------------------------------------------------------------------

function connectWebSocket(
  roomCode: string,
  displayName: string,
  set: (partial: Partial<OnlineGameState> | ((state: OnlineGameState) => Partial<OnlineGameState>)) => void,
  get: () => OnlineGameState
): Promise<void> {
  return new Promise((resolve, reject) => {
    cleanupSocket();

    const wsUrl = buildWsUrl(roomCode, displayName);
    const ws = new WebSocket(wsUrl);
    activeSocket = ws;

    let hasOpened = false;

    ws.onopen = () => {
      hasOpened = true;
      set({ status: "connected", error: null, roomCode });

      // Start keepalive ping every 20s
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          sendEnvelope("PING");
        }
      }, 20000);

      resolve();
    };

    ws.onerror = (evt) => {
      console.error("[OnlineWS] Error event:", evt);
      if (!hasOpened) {
        set({ status: "error", error: "Could not connect to online server." });
        reject(new Error("WebSocket connection failed"));
      }
    };

    ws.onclose = (evt) => {
      console.warn("[OnlineWS] Disconnected:", evt.code, evt.reason);
      cleanupSocket();
      set((state) => ({
        status: state.status === "idle" ? "idle" : "disconnected",
        error: evt.reason || (state.status === "connected" ? "Disconnected from server." : state.error),
      }));
    };

    ws.onmessage = (evt) => {
      try {
        const envelope = JSON.parse(evt.data);
        handleIncomingMessage(envelope, set, get);
      } catch (err) {
        console.error("[OnlineWS] Failed to parse message:", err, evt.data);
      }
    };
  });
}

function handleIncomingMessage(
  envelope: { type: string; payload?: unknown },
  set: (partial: Partial<OnlineGameState> | ((state: OnlineGameState) => Partial<OnlineGameState>)) => void,
  get: () => OnlineGameState
) {
  const { type, payload } = envelope;

  switch (type) {
    case "ROOM_STATE": {
      const state = payload as {
        roomCode: string;
        phase: OnlinePhase;
        hostId: string;
        timerDuration: number;
        players: PublicPlayer[];
        activePlayers: string[];
        eliminationLog: EliminationRecord[];
        lastEliminated: EliminationRecord | null;
        winner: "civilians" | "imposter" | null;
      };

      const myName = get().myPlayerName;
      const me = state.players.find((p) => p.displayName === myName);
      const isHost = me ? me.isHost : false;

      set({
        phase: state.phase,
        players: state.players,
        activePlayers: state.activePlayers,
        timerDuration: state.timerDuration,
        eliminationLog: state.eliminationLog || [],
        lastEliminated: state.lastEliminated,
        winner: state.winner,
        myPlayerId: me ? me.id : get().myPlayerId,
        isHost,
      });
      break;
    }

    case "ROLE_ASSIGNED": {
      const roleData = payload as {
        role: "civilian" | "imposter";
        secretWord: string | null;
        secretCategory: string;
      };

      set({
        myRole: roleData.role,
        secretWord: roleData.secretWord,
        secretCategory: roleData.secretCategory,
      });
      break;
    }

    case "REVEAL_TURN": {
      const turn = payload as RevealTurnInfo;
      set({
        phase: "revealing",
        revealTurn: turn,
      });
      break;
    }

    case "DISCUSSION_STARTED": {
      const disc = payload as { endsAt: string; durationSeconds: number };
      set({
        phase: "discussing",
        timerEndsAt: disc.endsAt,
        timerDuration: disc.durationSeconds,
      });
      break;
    }

    case "DISCUSSION_ENDED": {
      set({
        phase: "voting",
        timerEndsAt: null,
      });
      break;
    }

    case "PLAYER_ELIMINATED": {
      const elim = payload as {
        playerId: string;
        displayName: string;
        wasImposter: boolean;
        activePlayers: string[];
        phase: OnlinePhase;
      };

      const newRecord: EliminationRecord = {
        playerId: elim.playerId,
        displayName: elim.displayName,
        wasImposter: elim.wasImposter,
        round: (get().eliminationLog.length || 0) + 1,
      };

      set((prev) => ({
        phase: elim.phase,
        activePlayers: elim.activePlayers,
        lastEliminated: newRecord,
        eliminationLog: [...prev.eliminationLog, newRecord],
      }));
      break;
    }

    case "GAME_OVER": {
      const go = payload as GameOverInfo;
      set({
        phase: "gameOver",
        winner: go.winner,
        gameOverInfo: go,
        eliminationLog: go.eliminationLog || [],
      });
      break;
    }

    case "PLAYER_JOINED": {
      const player = payload as { id: string; displayName: string; isHost: boolean };
      set((prev) => {
        const exists = prev.players.some((p) => p.id === player.id);
        if (exists) return prev;
        const newPlayer: PublicPlayer = {
          id: player.id,
          displayName: player.displayName,
          isHost: player.isHost,
          isActive: true,
          isReady: false,
        };
        const updated = [...prev.players, newPlayer];
        const isHost = player.displayName === prev.myPlayerName ? player.isHost : prev.isHost;
        return {
          players: updated,
          isHost,
          myPlayerId: player.displayName === prev.myPlayerName ? player.id : prev.myPlayerId,
        };
      });
      break;
    }

    case "PLAYER_LEFT": {
      const left = payload as { playerId: string; displayName: string; newHostId?: string };
      set((prev) => {
        const updated = prev.players.filter((p) => p.id !== left.playerId);
        const myId = prev.myPlayerId;
        const isHost = left.newHostId ? myId === left.newHostId : prev.isHost;
        return {
          players: updated,
          isHost,
        };
      });
      break;
    }

    case "ERROR": {
      const err = payload as { code: string; message: string };
      console.warn("[OnlineWS] Error from server:", err.code, err.message);
      set({ error: err.message });
      break;
    }

    case "PONG": {
      // Heartbeat acknowledged
      break;
    }

    default:
      console.log("[OnlineWS] Unhandled message type:", type, payload);
  }
}
