"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import { getPlayerColour } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Vote, ChevronRight, Skull, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";

export default function VotingScreen() {
  const activePlayers = useGameStore((s) => s.activePlayers);
  const dispatch = useGameStore((s) => s.dispatch);
  const feedback = useGameFeedback();

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  function handleSelect(name: string) {
    feedback.tap();
    if (selectedPlayer === name) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(name);
    }
  }

  function handleConfirm() {
    if (selectedPlayer) {
      feedback.eliminate();
      dispatch({ type: "ELIMINATE_PLAYER", name: selectedPlayer });
      setSelectedPlayer(null);
    }
  }

  function handleCancel() {
    feedback.tap();
    setSelectedPlayer(null);
  }

  return (
    <GameShell phaseKey="voting" layout="scrollable">
      <div className="flex flex-col gap-6 w-full max-w-md mx-auto py-2 pb-24">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-imposter/15 border border-imposter/30 text-imposter shadow-md">
            <Vote className="w-7 h-7" strokeWidth={2} />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-hint uppercase tracking-wider">
              The Ballot
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-heading">
              Cast Your Verdict
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
              Discuss who seems suspicious, then tap their name to eliminate them.
            </p>
          </div>
        </div>

        {/* Player Selection Cards */}
        <div className="flex flex-col gap-2.5 w-full">
          {activePlayers.map((player) => {
            const isSelected = selectedPlayer === player;
            const avatarColor = getPlayerColour(player);
            const initial = player.trim().charAt(0).toUpperCase();

            return (
              <button
                key={player}
                type="button"
                onClick={() => handleSelect(player)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left font-medium transition-all duration-150 active:scale-[0.96] shadow-xs cursor-pointer ${
                  isSelected
                    ? "border-imposter bg-imposter/15 text-imposter shadow-md ring-2 ring-imposter/30"
                    : "border-border-subtle bg-surface-raised text-text-primary hover:border-border-strong hover:bg-surface-raised/80"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-xs shrink-0"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initial}
                  </div>
                  <span className="font-semibold text-base truncate">
                    {player}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-xs font-bold transition-colors ${
                    isSelected ? "text-imposter" : "text-text-secondary"
                  }`}>
                    {isSelected ? "Selected" : "Vote Out"}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isSelected ? "text-imposter rotate-90" : "text-text-hint"
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Verdict Bar */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50 p-4 rounded-3xl bg-surface-raised/95 backdrop-blur-md border border-imposter/40 shadow-2xl flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-imposter" />
                <span className="text-sm font-bold text-text-primary">
                  Eliminate <strong className="text-imposter">{selectedPlayer}</strong>?
                </span>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="p-1 text-text-secondary hover:text-text-primary rounded-full transition cursor-pointer"
                aria-label="Cancel selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-11 px-4 rounded-xl text-text-secondary hover:text-text-primary cursor-pointer active:scale-[0.96] text-xs font-semibold"
              >
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={handleConfirm}
                className="flex-1 h-11 rounded-xl bg-imposter text-imposter-fg hover:opacity-90 active:scale-[0.96] transition-[transform,opacity] font-bold text-xs sm:text-sm cursor-pointer shadow-lg"
              >
                Confirm Elimination
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}
