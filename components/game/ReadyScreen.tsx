"use client";

import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Play, Users } from "lucide-react";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";

export default function ReadyScreen() {
  const dispatch = useGameStore((s) => s.dispatch);
  const feedback = useGameFeedback();

  return (
    <GameShell phaseKey="ready">
      <div className="flex flex-col items-center gap-7 text-center w-full max-w-sm mx-auto py-4">
        {/* Neutral Community Icon */}
        <div className="flex items-center justify-center w-18 h-18 rounded-3xl bg-surface-raised border border-border-subtle text-cta shadow-lg">
          <Users className="w-9 h-9" strokeWidth={2} />
        </div>

        {/* Atmospheric Message */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text-primary font-heading">
            Ready to Discuss
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xs mx-auto">
            Everyone&apos;s seen their screen. The imposter is somewhere in this
            group.
          </p>
        </div>

        {/* Primary CTA */}
        <Button
          size="lg"
          onClick={() => {
            feedback.tap();
            dispatch({ type: "START_DISCUSSION" });
          }}
          className="w-full h-14 text-base sm:text-lg font-bold rounded-2xl bg-cta text-cta-fg hover:brightness-105 active:scale-[0.96] transition-[transform,filter] shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Discussion</span>
        </Button>
      </div>
    </GameShell>
  );
}
