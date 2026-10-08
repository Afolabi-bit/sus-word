"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Trophy, Skull, RotateCcw, Plus, UserX } from "lucide-react";
import { motion } from "framer-motion";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";

export default function GameOverScreen() {
  const winner = useGameStore((s) => s.winner);
  const imposter = useGameStore((s) => s.imposter);
  const secretWord = useGameStore((s) => s.secretWord);
  const eliminationHistory = useGameStore((s) => s.eliminationHistory);
  const dispatch = useGameStore((s) => s.dispatch);
  const feedback = useGameFeedback();

  const civiliansWon = winner === "civilians";

  useEffect(() => {
    feedback.gameOver(civiliansWon);
  }, [civiliansWon, feedback]);

  const itemVariants = {
    initial: { opacity: 0, y: 14, filter: "blur(4px)" },
    animate: (delay: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.35, delay, ease: [0.2, 0, 0, 1] as const },
    }),
  };

  return (
    <GameShell phaseKey="gameOver" layout="scrollable">
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto py-2">
        {/* Block 1: Result banner (0ms) */}
        <motion.div
          custom={0}
          variants={itemVariants}
          initial="initial"
          animate="animate"
          className={`flex flex-col items-center gap-4 p-7 sm:p-8 rounded-3xl w-full shadow-2xl ${
            civiliansWon
              ? "bg-gradient-to-b from-win/20 to-win/5 border-2 border-win/40"
              : "bg-gradient-to-b from-imposter/20 to-imposter/5 border-2 border-imposter/40"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              civiliansWon
                ? "bg-win/20 text-win border border-win/40"
                : "bg-imposter/20 text-imposter border border-imposter/40"
            }`}
          >
            {civiliansWon ? (
              <Trophy className="w-8 h-8" strokeWidth={2} />
            ) : (
              <Skull className="w-8 h-8" strokeWidth={2} />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-hint uppercase tracking-wider">
              Game Verdict
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary font-heading tracking-tight">
              {civiliansWon ? "Civilians Triumph" : "The Imposter Escapes"}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {civiliansWon ? "The group correctly identified the odd one out." : "The infiltrator blended in and survived."}
            </p>
          </div>
        </motion.div>

        {/* Block 2: Reveal info (100ms) */}
        <motion.div
          custom={0.1}
          variants={itemVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full"
        >
          {/* Imposter Card */}
          <div className="flex flex-col items-center justify-center gap-1.5 p-5 rounded-2xl bg-imposter/10 border border-imposter/30 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-imposter">
              The Imposter
            </span>
            <span className="text-2xl sm:text-3xl font-black text-imposter font-heading truncate max-w-full px-2">
              {imposter}
            </span>
          </div>

          {/* Secret Word Card */}
          <div className="flex flex-col items-center justify-center gap-1.5 p-5 rounded-2xl bg-surface-raised border border-border-subtle shadow-md">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-hint">
              Secret Word
            </span>
            <span className="text-2xl sm:text-3xl font-black text-text-primary font-heading truncate max-w-full px-2">
              {secretWord}
            </span>
          </div>
        </motion.div>

        {/* Block 3: Elimination timeline history (200ms) */}
        {eliminationHistory.length > 0 && (
          <motion.div
            custom={0.2}
            variants={itemVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-3 w-full text-left p-5 rounded-2xl bg-surface-raised border border-border-subtle shadow-xs"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-text-hint">
              Elimination Timeline
            </span>

            <div className="relative pl-6 ml-2 border-l-2 border-border-subtle flex flex-col gap-3 pt-1">
              {eliminationHistory.map((record, i) => (
                <div key={`${record.name}-${i}`} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[1.85rem] top-1.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      record.wasImposter
                        ? "bg-imposter text-imposter-fg shadow-xs"
                        : "bg-surface-base border border-border-subtle text-text-hint"
                    }`}
                  >
                    {record.wasImposter ? (
                      <Skull className="w-3 h-3" />
                    ) : (
                      <UserX className="w-3 h-3" />
                    )}
                  </div>

                  {/* Record details */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-base border border-border-subtle/80">
                    <div>
                      <span className="text-xs text-text-hint block">
                        Round {i + 1}
                      </span>
                      <span className="font-semibold text-sm text-text-primary">
                        {record.name}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        record.wasImposter
                          ? "bg-imposter/20 text-imposter border border-imposter/30"
                          : "bg-surface-raised text-text-secondary border border-border-subtle"
                      }`}
                    >
                      {record.wasImposter ? "Imposter Caught" : "Civilian"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Block 4: Action button hierarchy (300ms) */}
        <motion.div
          custom={0.3}
          variants={itemVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-2.5 w-full mt-1 pt-2"
        >
          <Button
            size="lg"
            onClick={() => {
              feedback.tap();
              dispatch({ type: "PLAY_AGAIN" });
            }}
            className="w-full h-14 text-base font-bold rounded-2xl bg-cta text-cta-fg hover:opacity-90 active:scale-[0.96] transition-[transform,opacity] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again (Same Players)</span>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              feedback.tap();
              dispatch({ type: "NEW_GAME" });
            }}
            className="w-full h-11 text-xs sm:text-sm text-text-secondary hover:text-text-primary active:scale-[0.96] cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>New Game (Change Players)</span>
          </Button>
        </motion.div>
      </div>
    </GameShell>
  );
}
