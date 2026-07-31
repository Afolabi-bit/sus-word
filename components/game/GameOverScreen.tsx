"use client";

import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Trophy, Skull, RotateCcw, Plus } from "lucide-react";
import GameShell from "./GameShell";

export default function GameOverScreen() {
  const winner = useGameStore((s) => s.winner);
  const imposter = useGameStore((s) => s.imposter);
  const secretWord = useGameStore((s) => s.secretWord);
  const eliminationHistory = useGameStore((s) => s.eliminationHistory);
  const dispatch = useGameStore((s) => s.dispatch);

  const civiliansWon = winner === "civilians";

  return (
    <GameShell phaseKey="gameOver">
      <div className="flex flex-col items-center gap-8 text-center w-full">
        {/* Result banner */}
        <div
          className={`flex flex-col items-center gap-4 p-8 rounded-2xl w-full ${
            civiliansWon
              ? "bg-civilians-win"
              : "bg-imposter-wins"
          }`}
        >
          {civiliansWon ? (
            <Trophy className="w-14 h-14 text-civilians-win-text" />
          ) : (
            <Skull className="w-14 h-14 text-imposter-wins-text" />
          )}
          <h2
            className={`text-3xl font-bold ${
              civiliansWon ? "text-civilians-win-text" : "text-imposter-wins-text"
            }`}
          >
            {civiliansWon ? "Civilians Win!" : "Imposter Wins!"}
          </h2>
          <p
            className={`text-base ${
              civiliansWon
                ? "text-civilians-win-text/80"
                : "text-imposter-wins-text/80"
            }`}
          >
            {civiliansWon
              ? "The group found the imposter!"
              : "The imposter survived undetected!"}
          </p>
        </div>

        {/* Reveal info */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-imposter border border-game-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-imposter-text/60">
              The Imposter
            </p>
            <p className="text-xl font-bold text-imposter-text">{imposter}</p>
          </div>

          <div className="flex flex-col gap-1 p-4 rounded-xl bg-game-card border border-game-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              The Secret Word
            </p>
            <p className="text-xl font-bold text-text-primary">{secretWord}</p>
          </div>
        </div>

        {/* Elimination history */}
        {eliminationHistory.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-widest">
              Elimination History
            </p>
            {eliminationHistory.map((record, i) => (
              <div
                key={`${record.name}-${i}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-game-card border border-game-border"
              >
                <span className="font-medium text-text-primary">
                  {record.name}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    record.wasImposter
                      ? "text-civilians-win"
                      : "text-imposter-wins"
                  }`}
                >
                  {record.wasImposter ? "Imposter" : "Civilian"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <Button
            size="lg"
            onClick={() => dispatch({ type: "PLAY_AGAIN" })}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-accent text-accent-text hover:bg-accent/90"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => dispatch({ type: "NEW_GAME" })}
            className="w-full h-12 rounded-xl border-game-border text-text-secondary hover:text-text-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      </div>
    </GameShell>
  );
}
