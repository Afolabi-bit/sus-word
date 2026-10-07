"use client";

import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ChevronRight, UserX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";

export default function RevealFlow() {
  const players = useGameStore((s) => s.players);
  const revealIndex = useGameStore((s) => s.revealIndex);
  const wordVisible = useGameStore((s) => s.wordVisible);
  const imposter = useGameStore((s) => s.imposter);
  const secretWord = useGameStore((s) => s.secretWord);
  const secretCategory = useGameStore((s) => s.secretCategory);
  const dispatch = useGameStore((s) => s.dispatch);
  const feedback = useGameFeedback();

  const currentPlayer = players[revealIndex];
  const isImposter = currentPlayer === imposter;

  function handleReveal() {
    feedback.revealWord();
    dispatch({ type: "SHOW_WORD" });
  }

  function handleNext() {
    feedback.tap();
    dispatch({ type: "NEXT_REVEAL" });
  }

  return (
    <GameShell phaseKey={`reveal-${revealIndex}-${wordVisible}`}>
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto py-2">
        {/* Pagination Dots Progress */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5">
            {players.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-200 ${
                  i === revealIndex
                    ? "w-6 h-2 rounded-full bg-cta"
                    : i < revealIndex
                    ? "w-2 h-2 rounded-full bg-cta/40"
                    : "w-2 h-2 rounded-full bg-border-subtle"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-text-hint">
            Player {revealIndex + 1} of {players.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!wordVisible ? (
            /* ---- Cover / Pass Phone Screen ---- */
            <motion.div
              key={`pass-${revealIndex}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] as const }}
              className="w-full"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={handleReveal}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleReveal();
                  }
                }}
                className="w-full flex flex-col items-center gap-6 p-7 sm:p-8 rounded-[28px] bg-surface-raised border border-border-subtle shadow-xl cursor-pointer active:scale-[0.98] transition-transform group"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-base border border-border-subtle flex items-center justify-center text-text-secondary group-hover:text-cta group-hover:border-cta/40 transition-colors">
                  <EyeOff className="w-8 h-8" strokeWidth={2} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-text-secondary">
                    Pass the phone to
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary font-heading">
                    {currentPlayer}
                  </h2>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                  <strong className="text-text-primary">{currentPlayer}</strong>
                  , look only at your screen.
                </p>

                <div className="w-full pt-2">
                  <Button
                    size="lg"
                    className="w-full h-13 text-base font-bold rounded-2xl bg-cta text-cta-fg pointer-events-none shadow-md flex items-center justify-center gap-2 group-hover:brightness-105"
                  >
                    <Eye className="w-5 h-5" strokeWidth={2} />
                    <span>Tap Anywhere to Reveal</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ---- Word / Role Reveal Screen ---- */
            <motion.div
              key={`word-${revealIndex}`}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] as const }}
              className="w-full flex flex-col items-center gap-6"
            >
              {isImposter ? (
                /* Imposter card: high-tension, distinct pink tint */
                <div className="flex flex-col items-center gap-5 p-7 sm:p-8 rounded-[28px] bg-imposter/15 border-2 border-imposter/40 w-full shadow-xl shadow-imposter/5">
                  <div className="w-14 h-14 rounded-2xl bg-imposter/20 border border-imposter/40 flex items-center justify-center text-imposter">
                    <UserX className="w-8 h-8" strokeWidth={2} />
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-imposter uppercase tracking-wider">
                      Secret Role
                    </span>
                    <motion.h2
                      initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] as const }}
                      className="text-3xl sm:text-4xl font-extrabold text-imposter font-heading"
                    >
                      IMPOSTER
                    </motion.h2>
                  </div>

                  <p className="text-sm text-text-primary leading-relaxed max-w-xs font-medium">
                    You don&apos;t know the word. Listen for clues. Don&apos;t
                    get caught.
                  </p>

                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="w-full h-13 text-base font-bold rounded-2xl bg-imposter text-imposter-fg hover:brightness-105 active:scale-[0.96] transition-[transform,filter] cursor-pointer shadow-md mt-2"
                  >
                    <span>Got It, Blend In</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              ) : (
                /* Civilian card: calm, clean with category hint */
                <div className="flex flex-col items-center gap-5 p-7 sm:p-8 rounded-[28px] bg-surface-raised border border-border-subtle w-full shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-secondary">
                      Your Secret Word
                    </span>
                    {secretCategory && (
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-base border border-border-subtle text-xs font-semibold text-cta">
                        {secretCategory}
                      </span>
                    )}
                  </div>

                  <motion.h2
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] as const }}
                    className="text-4xl sm:text-5xl font-germania font-normal tracking-wide text-text-primary py-2"
                  >
                    {secretWord}
                  </motion.h2>

                  <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                    This is the secret word. Keep it to yourself.
                  </p>

                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="w-full h-13 text-base font-bold rounded-2xl bg-cta text-cta-fg hover:brightness-105 active:scale-[0.96] transition-[transform,filter] cursor-pointer shadow-md mt-2"
                  >
                    <span>Got It, Hide Word</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              )}

              <p className="text-xs text-text-hint">
                Tap the button to hide the screen before passing.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameShell>
  );
}
