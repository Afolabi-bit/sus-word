"use client";

import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GameShell from "./GameShell";

export default function RevealFlow() {
  const players = useGameStore((s) => s.players);
  const revealIndex = useGameStore((s) => s.revealIndex);
  const wordVisible = useGameStore((s) => s.wordVisible);
  const imposter = useGameStore((s) => s.imposter);
  const secretWord = useGameStore((s) => s.secretWord);
  const dispatch = useGameStore((s) => s.dispatch);

  const currentPlayer = players[revealIndex];
  const isImposter = currentPlayer === imposter;

  return (
    <GameShell phaseKey={`reveal-${revealIndex}-${wordVisible}`}>
      <AnimatePresence mode="wait">
        {!wordVisible ? (
          /* ---- Pass-to-player screen ---- */
          <motion.div
            key={`pass-${revealIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 text-center w-full"
          >
            {/* Progress */}
            <p className="text-sm text-text-secondary">
              Player {revealIndex + 1} of {players.length}
            </p>

            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-game-card border border-game-border">
              <EyeOff className="w-8 h-8 text-text-secondary" />
            </div>

            {/* Instruction */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-text-primary">
                Pass the phone to
              </h2>
              <p className="text-3xl font-bold text-accent">{currentPlayer}</p>
            </div>

            <p className="text-sm text-text-secondary max-w-xs">
              Only {currentPlayer} should be looking at the screen. When ready,
              tap the button below to reveal your word.
            </p>

            {/* Reveal button */}
            <Button
              size="lg"
              onClick={() => dispatch({ type: "SHOW_WORD" })}
              className="w-full max-w-xs h-14 text-lg font-semibold rounded-xl bg-accent text-accent-text hover:bg-accent/90"
            >
              <Eye className="w-5 h-5 mr-2" />
              Tap to Reveal
            </Button>
          </motion.div>
        ) : (
          /* ---- Word reveal screen ---- */
          <motion.div
            key={`word-${revealIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-8 text-center w-full"
          >
            {/* Progress */}
            <p className="text-sm text-text-secondary">
              {currentPlayer}&apos;s word
            </p>

            {isImposter ? (
              /* Imposter reveal */
              <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-imposter w-full">
                <p className="text-sm font-semibold uppercase tracking-widest text-imposter-text/70">
                  Your role
                </p>
                <h2 className="text-3xl font-bold text-imposter-text">
                  You are the Imposter!
                </h2>
                <p className="text-sm text-imposter-text/80">
                  You don&apos;t know the secret word. Blend in and don&apos;t
                  get caught!
                </p>
              </div>
            ) : (
              /* Civilian reveal */
              <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-game-card border border-game-border w-full">
                <p className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
                  Your word
                </p>
                <h2 className="text-3xl font-bold text-text-primary">
                  {secretWord}
                </h2>
                <p className="text-sm text-text-secondary">
                  Remember this word. Don&apos;t say it out loud!
                </p>
              </div>
            )}

            {/* Next button */}
            <Button
              size="lg"
              onClick={() => dispatch({ type: "NEXT_REVEAL" })}
              className="w-full max-w-xs h-14 text-lg font-semibold rounded-xl bg-accent text-accent-text hover:bg-accent/90"
            >
              Got it
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-xs text-text-secondary">
              Tap &quot;Got it&quot; and pass the phone to the next player
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}
