"use client";

import { useState } from "react";
import SusWordLogo from "@/components/ui/SusWordLogo";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useGameStore } from "@/lib/store";
import HomeScreen from "@/components/game/HomeScreen";
import PlayerSetup from "@/components/game/PlayerSetup";
import RevealFlow from "@/components/game/RevealFlow";
import ReadyScreen from "@/components/game/ReadyScreen";
import DiscussionTimer from "@/components/game/DiscussionTimer";
import VotingScreen from "@/components/game/VotingScreen";
import ResultScreen from "@/components/game/ResultScreen";
import GameOverScreen from "@/components/game/GameOverScreen";
import { Home as HomeIcon, Volume2, VolumeX } from "lucide-react";
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
  const soundEnabled = useGameStore((s) => s.soundEnabled);
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
    <MotionConfig reducedMotion="user">
      <main className="flex flex-1 flex-col bg-surface-base min-h-dvh">
        {/* Navigation Top Header (shown during non-home phases) */}
        {phase !== "home" && (
          <header className="layout-container pt-4 pb-3 flex items-center justify-between border-b border-border-subtle/80 sticky top-0 z-40 bg-surface-base/95 backdrop-blur-xs">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => handleHomeClick()}
            >
              <SusWordLogo size={28} />
              <span className="font-extrabold text-base tracking-tight">
                <span className="text-imposter">Sus</span><span className="text-text-primary">Word</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
                className="text-text-secondary hover:text-text-primary p-2 h-8 w-8 cursor-pointer active:scale-[0.96]"
                onClick={() => dispatch({ type: "TOGGLE_SOUND" })}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 text-text-hint" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-text-secondary hover:text-text-primary gap-1 px-2.5 h-8 cursor-pointer active:scale-[0.96]"
                onClick={() => handleHomeClick()}
              >
                <HomeIcon className="w-4 h-4" />
                Menu
              </Button>
            </div>
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
              <DialogDescription className="text-sm text-text-secondary pt-1 leading-relaxed">
                Leaving now will end the current game in progress.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-sm h-9 rounded-lg"
                onClick={() => setConfirmHomeOpen(false)}
              >
                Resume Game
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="text-sm h-9 rounded-lg"
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
    </MotionConfig>
  );
}
