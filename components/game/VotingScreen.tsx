"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Vote, AlertTriangle } from "lucide-react";
import GameShell from "./GameShell";

// TODO: tie-vote handling is resolved verbally by players — the host picks the final result

export default function VotingScreen() {
  const activePlayers = useGameStore((s) => s.activePlayers);
  const dispatch = useGameStore((s) => s.dispatch);

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleSelect(name: string) {
    setSelectedPlayer(name);
    setConfirmOpen(true);
  }

  function handleConfirm() {
    if (selectedPlayer) {
      dispatch({ type: "ELIMINATE_PLAYER", name: selectedPlayer });
    }
    setConfirmOpen(false);
    setSelectedPlayer(null);
  }

  function handleCancel() {
    setConfirmOpen(false);
    setSelectedPlayer(null);
  }

  return (
    <GameShell phaseKey="voting">
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-imposter-wins">
            <Vote className="w-8 h-8 text-imposter-wins-text" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-text-primary">
              Time to Vote
            </h2>
            <p className="text-sm text-text-secondary">
              Who does the group think is the imposter? The host taps the name
              of the player with the most votes.
            </p>
          </div>
        </div>

        {/* Player buttons */}
        <div className="flex flex-col gap-2">
          {activePlayers.map((player) => (
            <button
              key={player}
              onClick={() => handleSelect(player)}
              className="flex items-center px-5 py-4 rounded-xl bg-game-card border border-game-border text-left font-medium text-text-primary hover:border-accent hover:bg-accent/5 transition-colors active:scale-[0.98]"
            >
              {player}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-game-card border-game-border rounded-2xl max-w-sm mx-auto">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <AlertTriangle className="w-8 h-8 text-imposter-wins" />
            </div>
            <DialogTitle className="text-center text-text-primary">
              Eliminate {selectedPlayer}?
            </DialogTitle>
            <DialogDescription className="text-center text-text-secondary">
              Are you sure? {selectedPlayer} will be removed from the game.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button
              size="lg"
              onClick={handleConfirm}
              className="w-full h-12 rounded-xl bg-imposter-wins text-imposter-wins-text hover:bg-imposter-wins/90 font-semibold"
            >
              Eliminate
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleCancel}
              className="w-full h-12 rounded-xl text-text-secondary"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GameShell>
  );
}
