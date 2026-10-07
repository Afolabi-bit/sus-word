"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import { validatePlayerName, canStartGame } from "@/lib/validation";
import { getPlayerColour } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X, ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";

const TIMER_OPTIONS = [
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
  { label: "7 min", seconds: 420 },
];

export default function PlayerSetup() {
  const players = useGameStore((s) => s.players);
  const timerDuration = useGameStore((s) => s.timerDuration);
  const dispatch = useGameStore((s) => s.dispatch);
  const feedback = useGameFeedback();

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const startCheck = canStartGame(players);

  function handleAdd() {
    const result = validatePlayerName(name, players);
    if (!result.success) {
      setError(result.error);
      return;
    }
    feedback.tap();
    dispatch({ type: "ADD_PLAYER", name: result.name });
    setName("");
    setError(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <GameShell phaseKey="setup" layout="scrollable">
      <div className="flex flex-col gap-6 w-full max-w-md mx-auto py-2">
        {/* Header */}
        <div className="flex flex-col gap-1.5 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Add Players
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Who&apos;s playing? Add at least 4 names.
          </p>
        </div>

        {/* Input Row */}
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                id="player-name-input"
                placeholder="Enter player name…"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                maxLength={20}
                className="w-full h-13 pr-10 rounded-xl border-border-subtle bg-surface-raised text-text-primary placeholder:text-text-hint focus-visible:border-cta"
              />
              {name.length > 0 && (
                <button
                  type="button"
                  onClick={() => setName("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-hint hover:text-text-primary rounded-full transition-colors"
                  aria-label="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Button
              size="lg"
              onClick={handleAdd}
              disabled={name.trim().length === 0 || players.length >= 10}
              className="h-13 px-4 rounded-xl bg-cta text-cta-fg hover:brightness-105 active:scale-[0.96] transition-[transform,filter] cursor-pointer disabled:opacity-40 shrink-0"
              aria-label="Add player"
            >
              <UserPlus className="w-5 h-5" />
            </Button>
          </div>

          {/* Validation error */}
          {error && (
            <p className="text-sm text-lose font-medium text-left">{error}</p>
          )}
        </div>

        {/* Progress Pips & Threshold */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-surface-raised/50 border border-border-subtle">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-text-secondary">
              Players ({players.length}/10)
            </span>
            {players.length >= 4 ? (
              <span className="flex items-center gap-1 text-win font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready to play
              </span>
            ) : (
              <span className="text-text-hint">
                Need {4 - players.length} more
              </span>
            )}
          </div>

          {/* 10 Pips Indicator */}
          <div className="grid grid-cols-10 gap-1.5 w-full">
            {Array.from({ length: 10 }).map((_, i) => {
              const isFilled = i < players.length;
              const isThreshold = i === 3;
              return (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    isFilled
                      ? "bg-cta"
                      : isThreshold
                      ? "bg-border-strong border border-cta/40"
                      : "bg-surface-base border border-border-subtle"
                  }`}
                  title={`Player ${i + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Player List / Empty State */}
        <div className="flex flex-col gap-2">
          {players.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-border-subtle bg-surface-raised/30 text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-surface-raised border border-border-subtle flex items-center justify-center text-text-hint">
                <UserPlus className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <p className="text-sm font-semibold text-text-primary">
                Add at least 4 players to start
              </p>
              <p className="text-xs text-text-secondary max-w-xs">
                Pass-and-play works best with 4 to 10 friends in the same room.
              </p>
            </div>
          ) : (
            players.map((player, i) => {
              const avatarColor = getPlayerColour(player);
              const initial = player.trim().charAt(0).toUpperCase();

              return (
                <div
                  key={player}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border-subtle"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {initial}
                    </div>
                    <span className="font-semibold text-text-primary text-sm sm:text-base">
                      {player}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      feedback.tap();
                      dispatch({ type: "REMOVE_PLAYER", name: player });
                    }}
                    className="p-1.5 rounded-lg text-text-secondary hover:text-lose hover:bg-lose/10 active:scale-[0.96] transition-[color,background-color,transform] cursor-pointer"
                    aria-label={`Remove ${player}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Discussion Timer Duration Selector */}
        <div className="flex flex-col gap-2 text-left p-3.5 rounded-2xl bg-surface-raised/60 border border-border-subtle">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
            <Clock className="w-3.5 h-3.5 text-cta" />
            <span>Discussion Timer</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {TIMER_OPTIONS.map((opt) => {
              const isSelected = timerDuration === opt.seconds;
              return (
                <button
                  key={opt.seconds}
                  type="button"
                  onClick={() => {
                    feedback.tap();
                    dispatch({
                      type: "SET_TIMER_SECONDS",
                      seconds: opt.seconds,
                    });
                  }}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-[transform,background-color,border-color] duration-150 cursor-pointer active:scale-[0.96] ${
                    isSelected
                      ? "bg-cta text-cta-fg shadow-xs font-bold"
                      : "bg-surface-base border border-border-subtle text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 mt-2">
          <Button
            size="lg"
            disabled={!startCheck.valid}
            onClick={() => {
              feedback.tap();
              dispatch({ type: "START_GAME" });
            }}
            className="w-full h-14 text-base sm:text-lg font-bold rounded-2xl bg-cta text-cta-fg hover:brightness-105 active:scale-[0.96] transition-[transform,filter] disabled:opacity-40 cursor-pointer shadow-md"
          >
            Start Game
          </Button>

          {!startCheck.valid && startCheck.error && players.length > 0 && (
            <p className="text-xs text-text-hint text-center">
              {startCheck.error}
            </p>
          )}

          <Button
            variant="ghost"
            size="lg"
            onClick={() => dispatch({ type: "RESET_TO_HOME" })}
            className="w-full h-12 text-sm text-text-secondary hover:text-text-primary cursor-pointer active:scale-[0.96]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </GameShell>
  );
}
