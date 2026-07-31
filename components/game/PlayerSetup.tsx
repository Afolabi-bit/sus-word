"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import { validatePlayerName, canStartGame } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X, ArrowLeft } from "lucide-react";
import GameShell from "./GameShell";

export default function PlayerSetup() {
  const players = useGameStore((s) => s.players);
  const dispatch = useGameStore((s) => s.dispatch);

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const startCheck = canStartGame(players);

  function handleAdd() {
    const result = validatePlayerName(name, players);
    if (!result.success) {
      setError(result.error);
      return;
    }
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
    <GameShell phaseKey="setup">
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-text-primary">Add Players</h2>
          <p className="text-sm text-text-secondary">
            Enter the name of each player. You need 4–10 players to start.
          </p>
        </div>

        {/* Input row */}
        <div className="flex gap-2">
          <Input
            id="player-name-input"
            placeholder="Player name…"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            maxLength={20}
            className="flex-1 h-12 rounded-lg border-game-border bg-game-card text-text-primary placeholder:text-text-secondary"
          />
          <Button
            size="lg"
            onClick={handleAdd}
            disabled={name.trim().length === 0 || players.length >= 10}
            className="h-12 px-4 rounded-lg bg-accent text-accent-text hover:bg-accent/90"
          >
            <UserPlus className="w-5 h-5" />
          </Button>
        </div>

        {/* Validation error */}
        {error && (
          <p className="text-sm text-imposter-wins font-medium -mt-4">{error}</p>
        )}

        {/* Player list */}
        <div className="flex flex-col gap-2">
          {players.length === 0 && (
            <p className="text-sm text-text-secondary text-center py-6">
              No players added yet
            </p>
          )}
          {players.map((player, i) => (
            <div
              key={player}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-game-card border border-game-border"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="w-7 h-7 flex items-center justify-center rounded-lg border-game-border text-text-secondary text-xs font-semibold"
                >
                  {i + 1}
                </Badge>
                <span className="font-medium text-text-primary">{player}</span>
              </div>
              <button
                onClick={() => dispatch({ type: "REMOVE_PLAYER", name: player })}
                className="p-1.5 rounded-lg text-text-secondary hover:text-imposter-wins hover:bg-imposter-wins/10 transition-colors"
                aria-label={`Remove ${player}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Player count */}
        <p className="text-sm text-text-secondary text-center">
          {players.length} / 10 players
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-2">
          <Button
            size="lg"
            disabled={!startCheck.valid}
            onClick={() => dispatch({ type: "START_GAME" })}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-accent text-accent-text hover:bg-accent/90 disabled:opacity-40"
          >
            Start Game
          </Button>
          {!startCheck.valid && startCheck.error && players.length > 0 && (
            <p className="text-sm text-text-secondary text-center">
              {startCheck.error}
            </p>
          )}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => dispatch({ type: "NEW_GAME" })}
            className="w-full h-12 text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </GameShell>
  );
}
