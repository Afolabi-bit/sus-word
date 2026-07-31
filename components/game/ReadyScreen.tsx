"use client";

import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle } from "lucide-react";
import GameShell from "./GameShell";

export default function ReadyScreen() {
  const dispatch = useGameStore((s) => s.dispatch);

  return (
    <GameShell phaseKey="ready">
      <div className="flex flex-col items-center gap-8 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-civilians-win">
          <CheckCircle className="w-8 h-8 text-civilians-win-text" />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-text-primary">
            Everyone&apos;s ready!
          </h2>
          <p className="text-base text-text-secondary max-w-xs">
            All players have seen their word. Gather around and get ready to
            discuss. The imposter is among you…
          </p>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          onClick={() => dispatch({ type: "START_DISCUSSION" })}
          className="w-full max-w-xs h-14 text-lg font-semibold rounded-xl bg-accent text-accent-text hover:bg-accent/90"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Discussion
        </Button>
      </div>
    </GameShell>
  );
}
