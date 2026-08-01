"use client";

import { useState } from "react";
import SusWordLogo from "@/components/ui/SusWordLogo";
import { AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import HomeScreen from "@/components/game/HomeScreen";
import PlayerSetup from "@/components/game/PlayerSetup";
import RevealFlow from "@/components/game/RevealFlow";
import ReadyScreen from "@/components/game/ReadyScreen";
import DiscussionTimer from "@/components/game/DiscussionTimer";
import VotingScreen from "@/components/game/VotingScreen";
import ResultScreen from "@/components/game/ResultScreen";
import GameOverScreen from "@/components/game/GameOverScreen";
import { Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Home() {
  const phase = useGameStore((s) => s.phase);
  const dispatch = useGameStore((s) => s.dispatch);
  const [confirmHomeOpen, setConfirmHomeOpen] = useState(false);

  function handleHomeClick() {
    if (phase === "setup" || phase === "gameOver") {
      dispatch({ type: "RESET_TO_HOME" });
    } else {
      setConfirmHomeOpen(true);
    }
  }

  function renderPhase() {
    switch (phase) {
      case "home":
        return <HomeScreen />;
      case "setup":
        return <PlayerSetup />;
      case "revealing":
        return <RevealFlow />;
      case "ready":
        return <ReadyScreen />;
      case "discussing":
        return <DiscussionTimer />;
      case "voting":
        return <VotingScreen />;
      case "result":
        return <ResultScreen />;
      case "gameOver":
        return <GameOverScreen />;
      default:
        return <HomeScreen />;
    }
  }

  return (
    <main className="flex flex-1 flex-col bg-app min-h-screen">
      {/* Navigation Top Header (shown during non-home phases) */}
      {phase !== "home" && (
        <header className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between border-b border-game-border/60">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleHomeClick()}
          >
            <SusWordLogo size={28} />
            <span className="font-extrabold text-base tracking-tight">
              <span className="text-imposter">Sus</span><span className="text-text-primary">Word</span>
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-text-secondary hover:text-text-primary gap-1 px-2.5 h-8 cursor-pointer"
            onClick={() => handleHomeClick()}
          >
            <HomeIcon className="w-3.5 h-3.5" />
            Menu
          </Button>
        </header>
      )}

      <AnimatePresence mode="wait">{renderPhase()}</AnimatePresence>

      {/* Leave Game Confirmation Dialog */}
      <Dialog open={confirmHomeOpen} onOpenChange={setConfirmHomeOpen}>
        <DialogContent className="sm:max-w-xs bg-game-card border-game-border">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-bold text-text-primary">
              Return to Main Menu?
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary pt-1">
              Leaving now will end the current game in progress.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 rounded-lg"
              onClick={() => setConfirmHomeOpen(false)}
            >
              Resume Game
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs h-9 rounded-lg"
              onClick={() => {
                setConfirmHomeOpen(false);
                dispatch({ type: "RESET_TO_HOME" });
              }}
            >
              Exit to Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
