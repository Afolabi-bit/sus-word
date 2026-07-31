"use client";

import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import GameShell from "./GameShell";

export default function HomeScreen() {
  const dispatch = useGameStore((s) => s.dispatch);

  return (
    <GameShell phaseKey="home">
      <div className="flex flex-col items-center gap-8 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent">
          <Users className="w-10 h-10 text-accent-text" />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Imposter Word Game
          </h1>
          <p className="text-base text-text-secondary max-w-xs">
            Find the imposter among your friends. One word, one faker — can your
            group figure out who&apos;s bluffing?
          </p>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full max-w-xs h-14 text-lg font-semibold rounded-xl bg-accent text-accent-text hover:bg-accent/90"
          onClick={() => dispatch({ type: "NEW_GAME" })}
        >
          New Game
        </Button>

        {/* Info */}
        <p className="text-sm text-text-secondary">4–10 players · 1 device · fully offline</p>
      </div>
    </GameShell>
  );
}
