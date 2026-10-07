/**
 * Web Audio API synthesizer & mobile haptic feedback engine for SusWord.
 *
 * 100% offline, zero external audio assets, zero network latency.
 * Synthesizes procedural micro-sounds using Web Audio oscillators & gain nodes.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// ---------------------------------------------------------------------------
// Haptics (navigator.vibrate)
// ---------------------------------------------------------------------------

export function triggerHaptic(pattern: number | number[]) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Haptics not allowed or unsupported in current context
  }
}

// ---------------------------------------------------------------------------
// Audio Synthesizers
// ---------------------------------------------------------------------------

/**
 * Subtle tactile click for buttons and selections.
 */
export function playTapSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(640, now);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}

/**
/**
 * Pleasant harmonic arpeggio when any player reveals their secret role/word.
 * NOTE: Both civilians and the imposter MUST play the exact same sound & vibration
 * so players sitting together in the room cannot detect roles by ear or phone buzz.
 */
export function playWordRevealSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const now = ctx.currentTime;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + i * 0.06;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.36);
  });
}

export const playCivilianRevealSound = playWordRevealSound;
export const playImposterRevealSound = playWordRevealSound;

/**
 * Soft clock tick for the countdown timer.
 */
export function playTimerTickSound(isUrgent = false) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  const freq = isUrgent ? 1100 : 750;
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.025);

  const vol = isUrgent ? 0.12 : 0.05;
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);
}

/**
 * Double chime when discussion time expires and voting begins.
 */
export function playTimeUpAlarmSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [587.33, 880.0].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + i * 0.12;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.23);
  });
}

/**
 * Deep impact whoosh when a vote eliminates a player.
 */
export function playEliminationSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(260, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.36);
}

/**
 * Celebratory fanfare when civilians win.
 */
export function playCiviliansWinSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + i * 0.08;
    const dur = i === notes.length - 1 ? 0.45 : 0.18;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.14, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + dur + 0.01);
  });
}

/**
 * Sneaky dramatic chord when the imposter wins.
 */
export function playImposterWinsSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [329.63, 311.13, 293.66, 277.18]; // Descending chromatic

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + i * 0.1;
    const dur = i === notes.length - 1 ? 0.5 : 0.2;

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + dur + 0.01);
  });
}

// ---------------------------------------------------------------------------
// Reactive Hook for React components
// ---------------------------------------------------------------------------

import { useGameStore } from "@/lib/store";

export function useGameFeedback() {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const hapticsEnabled = useGameStore((s) => s.hapticsEnabled);

  return {
    soundEnabled,
    hapticsEnabled,
    tap: () => {
      if (soundEnabled) playTapSound();
      if (hapticsEnabled) triggerHaptic(15);
    },
    revealWord: () => {
      if (soundEnabled) playWordRevealSound();
      if (hapticsEnabled) triggerHaptic([30, 50, 40]);
    },
    revealCivilian: () => {
      if (soundEnabled) playWordRevealSound();
      if (hapticsEnabled) triggerHaptic([30, 50, 40]);
    },
    revealImposter: () => {
      if (soundEnabled) playWordRevealSound();
      if (hapticsEnabled) triggerHaptic([30, 50, 40]);
    },
    tick: (urgent: boolean) => {
      if (soundEnabled) playTimerTickSound(urgent);
      if (hapticsEnabled && urgent) triggerHaptic(18);
    },
    timeUp: () => {
      if (soundEnabled) playTimeUpAlarmSound();
      if (hapticsEnabled) triggerHaptic([80, 60, 100]);
    },
    eliminate: () => {
      if (soundEnabled) playEliminationSound();
      if (hapticsEnabled) triggerHaptic([60, 40, 90]);
    },
    gameOver: (civiliansWon: boolean) => {
      if (soundEnabled) {
        if (civiliansWon) playCiviliansWinSound();
        else playImposterWinsSound();
      }
      if (hapticsEnabled) {
        triggerHaptic(civiliansWon ? [60, 40, 60, 40, 120] : [100, 80, 200]);
      }
    },
  };
}
