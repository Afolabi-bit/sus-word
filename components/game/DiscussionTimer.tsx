"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Timer, SkipForward } from "lucide-react";
import GameShell from "./GameShell";

// TODO: make timer duration configurable (currently 5 minutes)

export default function DiscussionTimer() {
  const timerSeconds = useGameStore((s) => s.timerSeconds);
  const dispatch = useGameStore((s) => s.dispatch);

  const [remaining, setRemaining] = useState(timerSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endDiscussion = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    dispatch({ type: "END_DISCUSSION" });
  }, [dispatch]);

  useEffect(() => {
    setRemaining(timerSeconds);

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          // Use setTimeout to avoid dispatching during render
          setTimeout(() => endDiscussion(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerSeconds, endDiscussion]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = remaining / timerSeconds;

  return (
    <GameShell phaseKey="discussing">
      <div className="flex flex-col items-center gap-8 text-center w-full">
        {/* Timer icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-timer">
          <Timer className="w-8 h-8 text-timer-text" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-text-primary">
          Discussion in progress
        </h2>

        {/* Countdown display */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="text-6xl sm:text-7xl md:text-8xl font-extrabold tabular-nums text-timer font-mono tracking-tight">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs h-2 rounded-full bg-game-card border border-game-border overflow-hidden">
            <div
              className="h-full rounded-full bg-timer transition-all duration-1000 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Hint */}
        <p className="text-sm text-text-secondary max-w-xs">
          Talk about the secret word. Ask questions. Try to figure out who
          doesn&apos;t know the word!
        </p>

        {/* End early */}
        <Button
          variant="outline"
          size="lg"
          onClick={endDiscussion}
          className="w-full max-w-xs h-12 rounded-xl border-game-border text-text-secondary hover:text-text-primary"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          End Discussion Early
        </Button>
      </div>
    </GameShell>
  );
}
