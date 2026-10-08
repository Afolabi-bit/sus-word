"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import { validatePlayerName, canStartGame } from "@/lib/validation";
import { getPlayerColour } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X, ArrowLeft, Clock, CheckCircle2, Users } from "lucide-react";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";

const TIMER_OPTIONS = [
  { label: "120s (2m)", seconds: 120 },
  { label: "3 min", seconds: 180 },
  { label: "5 min (Max)", seconds: 300 },
];

const PRESET_NAMES = ["Alex", "Jordan", "Sam", "Taylor"];

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

  function handleAddPreset() {
    feedback.tap();
    for (const p of PRESET_NAMES) {
      if (!players.includes(p) && players.length < 10) {
        dispatch({ type: "ADD_PLAYER", name: p });
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  const progressPercent = Math.min(100, (players.length / 4) * 100);

  return (
    <GameShell phaseKey="setup" layout="scrollable">
      <div className="flex flex-col gap-6 w-full max-w-md mx-auto py-2">
        {/* Header */}
        <div className="flex flex-col gap-1.5 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-heading">
            Add Players
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Pass-and-play needs at least 4 players around the table.
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
                className="w-full h-13 pr-10 rounded-2xl border-border-subtle bg-surface-raised text-text-primary placeholder:text-text-hint focus-visible:border-cta text-base"
              />
              {name.length > 0 && (
                <button
                  type="button"
                  onClick={() => setName("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-hint hover:text-text-primary rounded-full transition-colors cursor-pointer"
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
              className="h-13 px-5 rounded-2xl bg-cta text-cta-fg hover:opacity-90 active:scale-[0.96] transition-[transform,opacity] cursor-pointer disabled:opacity-40 shrink-0 font-bold"
              aria-label="Add player"
            >
              <UserPlus className="w-5 h-5" />
            </Button>
          </div>

          {/* Validation error */}
          {error && (
            <p className="text-xs text-lose font-medium text-left pl-1">{error}</p>
          )}
        </div>

        {/* Progress & Roster Status Card */}
        <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-surface-raised border border-border-subtle shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-text-primary">
              <Users className="w-4 h-4 text-text-secondary" />
              <span>Roster ({players.length}/10)</span>
            </div>

            {players.length >= 4 ? (
              <span className="flex items-center gap-1 text-win font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready to play
              </span>
            ) : (
              <span className="text-text-hint font-medium text-xs">
                Need {4 - players.length} more
              </span>
            )}
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-2 rounded-full bg-surface-base border border-border-subtle overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                players.length >= 4 ? "bg-win" : "bg-cta"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Player List */}
        <div className="flex flex-col gap-2">
          {players.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-7 rounded-2xl border border-dashed border-border-subtle bg-surface-raised/40 text-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-surface-base border border-border-subtle flex items-center justify-center text-text-hint">
                <Users className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  No players added yet
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Type a name above or use preset friends to test quickly.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPreset}
                className="mt-1 h-9 rounded-xl border-border-subtle bg-surface-base text-xs font-semibold gap-1.5 cursor-pointer active:scale-[0.96]"
              >
                <Users className="w-3.5 h-3.5 text-text-primary" />
                <span>Quick Add 4 Players</span>
              </Button>
            </div>
          ) : (
            players.map((player) => {
              const avatarColor = getPlayerColour(player);
              const initial = player.trim().charAt(0).toUpperCase();

              return (
                <div
                  key={player}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-surface-raised border border-border-subtle shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {initial}
                    </div>
                    <span className="font-semibold text-text-primary text-sm sm:text-base truncate">
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
        <div className="flex flex-col gap-2.5 text-left p-4 rounded-2xl bg-surface-raised border border-border-subtle shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
            <Clock className="w-3.5 h-3.5 text-text-secondary" />
            <span>Discussion Timer Duration</span>
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
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-[transform,background-color,border-color] duration-150 cursor-pointer active:scale-[0.96] ${
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
            className="w-full h-14 text-base font-bold rounded-2xl bg-cta text-cta-fg hover:opacity-90 active:scale-[0.96] transition-[transform,opacity] disabled:opacity-40 cursor-pointer shadow-lg"
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
            className="w-full h-11 text-xs sm:text-sm text-text-secondary hover:text-text-primary cursor-pointer active:scale-[0.96]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </GameShell>
  );
}
