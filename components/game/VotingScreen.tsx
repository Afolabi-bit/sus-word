"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import { getPlayerColour } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Vote, ChevronRight, Skull } from "lucide-react";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";

export default function VotingScreen() {
  const activePlayers = useGameStore((s) => s.activePlayers);
  const dispatch = useGameStore((s) => s.dispatch);
  const feedback = useGameFeedback();

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleSelect(name: string) {
    feedback.tap();
    setSelectedPlayer(name);
    setConfirmOpen(true);
  }

  function handleConfirm() {
    if (selectedPlayer) {
      feedback.eliminate();
      dispatch({ type: "ELIMINATE_PLAYER", name: selectedPlayer });
    }
    setConfirmOpen(false);
    setSelectedPlayer(null);
  }

  function handleCancel() {
    feedback.tap();
    setConfirmOpen(false);
    setSelectedPlayer(null);
  }

  return (
    <GameShell phaseKey="voting" layout="scrollable">
      <div className="flex flex-col gap-6 w-full max-w-md mx-auto py-2">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-imposter/15 border border-imposter/30 text-imposter shadow-md">
            <Vote className="w-8 h-8" strokeWidth={2} />
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-heading">
              Time to Vote
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
              Agree on a player, then the host taps their name.
            </p>
          </div>
        </div>

        {/* Player Buttons — single-column avatar rows with pending selection feedback */}
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
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left font-medium transition-[border-color,background-color,transform] duration-150 active:scale-[0.96] shadow-xs cursor-pointer group ${
                  isSelected
                    ? "border-imposter bg-imposter/15 text-imposter shadow-md"
                    : "border-border-subtle bg-surface-raised text-text-primary hover:border-cta/50 hover:bg-surface-raised/80"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-xs shrink-0"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initial}
                  </div>
                  <span className="font-semibold text-base truncate">
                    {player}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-semibold text-text-secondary group-hover:text-cta transition-colors">
                    Vote Out
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-hint group-hover:text-cta group-hover:translate-x-0.5 transition-[transform,color]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <DialogContent className="bg-surface-raised border border-imposter/30 rounded-3xl max-w-sm mx-auto shadow-2xl">
          <DialogHeader className="text-center pt-2">
            <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-imposter/15 text-imposter mb-3 border border-imposter/30">
              <Skull className="w-7 h-7" strokeWidth={2} />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-text-primary font-heading">
              Eliminate {selectedPlayer}?
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-text-secondary leading-relaxed pt-1">
              The group has decided.{" "}
              <strong className="text-text-primary">{selectedPlayer}</strong> is
              leaving the game.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-2 sm:flex-col pt-3">
            <Button
              size="lg"
              onClick={handleConfirm}
              className="w-full h-13 rounded-2xl bg-imposter text-imposter-fg hover:brightness-105 active:scale-[0.96] transition-[transform,filter] font-bold text-base cursor-pointer shadow-md"
            >
              Confirm Elimination
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleCancel}
              className="w-full h-11 rounded-xl text-text-secondary hover:text-text-primary active:scale-[0.96] cursor-pointer text-sm"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GameShell>
  );
}
