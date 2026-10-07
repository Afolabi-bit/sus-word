"use client";

import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowRight, Users } from "lucide-react";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";

/**
 * ResultScreen renders when a vote eliminates a civilian and the game continues.
 * Note: If the imposter is eliminated, the reducer transitions immediately to "gameOver",
 * so this screen only ever handles civilian elimination outcomes.
 */
export default function ResultScreen() {
  const lastEliminated = useGameStore((s) => s.lastEliminated);
  const activePlayers = useGameStore((s) => s.activePlayers);
  const dispatch = useGameStore((s) => s.dispatch);
  const feedback = useGameFeedback();

  if (!lastEliminated) return null;

  const { name } = lastEliminated;

  return (
    <GameShell phaseKey="result">
      <div className="flex flex-col items-center gap-7 text-center w-full max-w-sm mx-auto py-4">
        {/* Civilian Elimination Announcement Card */}
        <div className="flex flex-col items-center gap-4 p-8 rounded-[28px] bg-surface-raised border border-lose/30 w-full shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-lose/15 border border-lose/30 flex items-center justify-center text-lose">
            <ShieldAlert className="w-9 h-9" strokeWidth={2} />
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-heading">
              Not the imposter.
            </h2>
            <p className="text-base text-text-secondary leading-relaxed">
              <strong className="text-text-primary font-semibold">{name}</strong>{" "}
              was a civilian.
            </p>
          </div>

          <div className="pt-2 border-t border-border-subtle w-full flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-lose">
              The imposter is still here.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-text-hint">
              <Users className="w-3.5 h-3.5" />
              <span>{activePlayers.length} players remain</span>
            </div>
          </div>
        </div>

        {/* Continue to Next Round CTA */}
        <Button
          size="lg"
          onClick={() => {
            feedback.tap();
            dispatch({ type: "NEXT_ROUND" });
          }}
          className="w-full h-14 text-base sm:text-lg font-bold rounded-2xl bg-cta text-cta-fg hover:brightness-105 active:scale-[0.96] transition-[transform,filter] shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
        >
          <span>Next Round</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </GameShell>
  );
}
