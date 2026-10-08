"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { SkipForward } from "lucide-react";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";

export default function DiscussionTimer() {
  const timerStartedAt = useGameStore((s) => s.timerStartedAt);
  const timerDuration = useGameStore((s) => s.timerDuration);
  const dispatch = useGameStore((s) => s.dispatch);
  const feedback = useGameFeedback();
  const lastTickRef = useRef<number | null>(null);

  const calculateRemaining = useCallback(() => {
    if (!timerStartedAt) return timerDuration;
    const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
    return Math.max(0, timerDuration - elapsed);
  }, [timerStartedAt, timerDuration]);

  const [remaining, setRemaining] = useState(calculateRemaining);

  const endDiscussion = useCallback(() => {
    dispatch({ type: "END_DISCUSSION" });
  }, [dispatch]);

  useEffect(() => {
    setRemaining(calculateRemaining());

    const interval = setInterval(() => {
      const current = calculateRemaining();
      setRemaining(current);

      // Play tick sound when entering urgent zone (≤ 30s) once per unique second
      if (current <= 30 && current > 0 && current !== lastTickRef.current) {
        lastTickRef.current = current;
        feedback.tick(current <= 15);
      }

      if (current <= 0) {
        clearInterval(interval);
        feedback.timeUp();
        endDiscussion();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [calculateRemaining, endDiscussion, feedback]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = Math.min(1, Math.max(0, remaining / timerDuration));

  // Circular ring geometry
  const radius = 96;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Urgency color cues: Signal countdown shifting to Crimson in final 15s
  const isUrgent = remaining <= 15;

  const ringStroke = isUrgent
    ? "var(--color-imposter)"
    : "var(--color-timer)";

  const timerTextClass = isUrgent
    ? "text-imposter animate-pulse-subtle"
    : "text-timer";

  return (
    <GameShell phaseKey="discussing">
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-sm mx-auto py-2">
        {/* Header Label */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-text-hint">
            Phase 2 · Discussion
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-heading">
            Time left to discuss
          </h2>
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative w-60 h-60 flex items-center justify-center my-1">
          <svg
            className="w-full h-full -rotate-90 transform"
            viewBox="0 0 220 220"
          >
            {/* Background track */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="var(--color-border-subtle)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke={ringStroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition:
                  "stroke-dashoffset 0.5s ease-linear, stroke 0.5s ease",
              }}
            />
          </svg>

          {/* Time digits centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-5xl sm:text-6xl font-extrabold tabular-nums font-mono tracking-tight transition-colors duration-300 ${timerTextClass}`}
            >
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
            <span className="text-xs font-medium text-text-secondary mt-1">
              {isUrgent ? "Hurry up!" : remaining <= 60 ? "Final minute" : "In progress"}
            </span>
          </div>
        </div>

        {/* Clue Guidance */}
        <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
          Give clues about the word. Don&apos;t say it directly. Figure out
          who&apos;s faking it.
        </p>

        {/* Secondary Action: Skip / Vote Now */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            feedback.tap();
            endDiscussion();
          }}
          className="w-full h-12 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-raised cursor-pointer active:scale-[0.96] transition-[transform,background-color,color]"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          <span>Vote Now</span>
        </Button>
      </div>
    </GameShell>
  );
}
