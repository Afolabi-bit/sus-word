"use client";

import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, ArrowRight } from "lucide-react";
import GameShell from "./GameShell";

export default function ResultScreen() {
  const lastEliminated = useGameStore((s) => s.lastEliminated);
  const dispatch = useGameStore((s) => s.dispatch);

  if (!lastEliminated) return null;

  const { name, wasImposter } = lastEliminated;

  return (
    <GameShell phaseKey="result">
      <div className="flex flex-col items-center gap-8 text-center w-full">
        {wasImposter ? (
          /* Imposter was caught — but this branch shouldn't actually render
             because catching the imposter goes straight to gameOver. Keeping
             it here for safety / future use. */
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-civilians-win w-full">
            <ShieldCheck className="w-12 h-12 text-civilians-win-text" />
            <h2 className="text-2xl font-bold text-civilians-win-text">
              Imposter Caught!
            </h2>
            <p className="text-lg text-civilians-win-text">
              <span className="font-bold">{name}</span> was the imposter!
            </p>
          </div>
        ) : (
          /* A civilian was eliminated */
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-imposter-wins w-full">
            <ShieldAlert className="w-12 h-12 text-imposter-wins-text" />
            <h2 className="text-2xl font-bold text-imposter-wins-text">
              Wrong Guess!
            </h2>
            <p className="text-lg text-imposter-wins-text">
              <span className="font-bold">{name}</span> was a civilian.
            </p>
            <p className="text-sm text-imposter-wins-text/80">
              The imposter is still among you…
            </p>
          </div>
        )}

        {/* Continue to next round */}
        <Button
          size="lg"
          onClick={() => dispatch({ type: "NEXT_ROUND" })}
          className="w-full max-w-xs h-14 text-lg font-semibold rounded-xl bg-accent text-accent-text hover:bg-accent/90"
        >
          Next Round
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </GameShell>
  );
}
