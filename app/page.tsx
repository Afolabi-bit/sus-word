"use client";

import { useState } from "react";
import SusWordLogo from "@/components/ui/SusWordLogo";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useOnlineStore } from "@/lib/onlineStore";

// Offline Components
import HomeScreen from "@/components/game/HomeScreen";
import PlayerSetup from "@/components/game/PlayerSetup";
import RevealFlow from "@/components/game/RevealFlow";
import ReadyScreen from "@/components/game/ReadyScreen";
import DiscussionTimer from "@/components/game/DiscussionTimer";
import VotingScreen from "@/components/game/VotingScreen";
import ResultScreen from "@/components/game/ResultScreen";
import GameOverScreen from "@/components/game/GameOverScreen";

// Online Components
import OnlineLobbyScreen from "@/components/game/OnlineLobbyScreen";
import OnlineRevealScreen from "@/components/game/OnlineRevealScreen";
import OnlineReadyScreen from "@/components/game/OnlineReadyScreen";
import OnlineDiscussionScreen from "@/components/game/OnlineDiscussionScreen";
import OnlineVotingScreen from "@/components/game/OnlineVotingScreen";
import OnlineResultScreen from "@/components/game/OnlineResultScreen";
import OnlineGameOverScreen from "@/components/game/OnlineGameOverScreen";

import { Home as HomeIcon, Volume2, VolumeX, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Home() {
  const offlinePhase = useGameStore((s) => s.phase);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const dispatch = useGameStore((s) => s.dispatch);

  const isOnline = useOnlineStore((s) => s.roomCode !== null && s.status === "connected");
  const onlinePhase = useOnlineStore((s) => s.phase);
  const onlineRoomCode = useOnlineStore((s) => s.roomCode);
  const leaveOnlineRoom = useOnlineStore((s) => s.leaveRoom);

  const [confirmHomeOpen, setConfirmHomeOpen] = useState(false);

  function handleHomeClick() {
    if (isOnline) {
      if (onlinePhase === "lobby" || onlinePhase === "gameOver") {
        leaveOnlineRoom();
      } else {
        setConfirmHomeOpen(true);
      }
    } else {
      if (offlinePhase === "setup" || offlinePhase === "gameOver") {
        dispatch({ type: "RESET_TO_HOME" });
      } else {
        setConfirmHomeOpen(true);
      }
    }
  }

  function handleConfirmExit() {
    setConfirmHomeOpen(false);
    if (isOnline) {
      leaveOnlineRoom();
    } else {
      dispatch({ type: "RESET_TO_HOME" });
    }
  }

  function renderPhase() {
    // If connected to an online room, render online screens
    if (isOnline) {
      switch (onlinePhase) {
        case "lobby":
          return <OnlineLobbyScreen key="online-lobby" />;
        case "revealing":
          return <OnlineRevealScreen key="online-revealing" />;
        case "ready":
          return <OnlineReadyScreen key="online-ready" />;
        case "discussing":
          return <OnlineDiscussionScreen key="online-discussing" />;
        case "voting":
          return <OnlineVotingScreen key="online-voting" />;
        case "result":
          return <OnlineResultScreen key="online-result" />;
        case "gameOver":
          return <OnlineGameOverScreen key="online-game-over" />;
        default:
          return <OnlineLobbyScreen key="online-lobby" />;
      }
    }

    // Default: offline local pass-and-play
    switch (offlinePhase) {
      case "home":
        return <HomeScreen key="offline-home" />;
      case "setup":
        return <PlayerSetup key="offline-setup" />;
      case "revealing":
        return <RevealFlow key="offline-revealing" />;
      case "ready":
        return <ReadyScreen key="offline-ready" />;
      case "discussing":
        return <DiscussionTimer key="offline-discussing" />;
      case "voting":
        return <VotingScreen key="offline-voting" />;
      case "result":
        return <ResultScreen key="offline-result" />;
      case "gameOver":
        return <GameOverScreen key="offline-game-over" />;
      default:
        return <HomeScreen key="offline-home" />;
    }
  }

  const showHeader = isOnline || offlinePhase !== "home";

  return (
    <MotionConfig reducedMotion="user">
      <main className="flex flex-1 flex-col bg-surface-base min-h-dvh">
        {/* Navigation Top Header */}
        {showHeader && (
          <header className="layout-container pt-4 pb-3 flex items-center justify-between border-b border-border-subtle/80 sticky top-0 z-40 bg-surface-base/95 backdrop-blur-xs">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={handleHomeClick}
            >
              <SusWordLogo size={28} />
              <span className="font-extrabold text-base tracking-tight">
                <span className="text-imposter">Sus</span>
                <span className="text-text-primary">Word</span>
              </span>

              {isOnline && onlineRoomCode && (
                <Badge className="bg-cta/15 text-cta border-cta/25 text-[10px] font-mono font-bold px-2 py-0 ml-1.5 flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5" />
                  {onlineRoomCode}
                </Badge>
              )}
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
                onClick={handleHomeClick}
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
          <DialogContent className="sm:max-w-xs bg-surface-raised border-border-subtle rounded-3xl">
            <DialogHeader className="text-left">
              <DialogTitle className="text-lg font-bold text-text-primary">
                {isOnline ? "Leave Online Room?" : "Return to Main Menu?"}
              </DialogTitle>
              <DialogDescription className="text-sm text-text-secondary pt-1 leading-relaxed">
                {isOnline
                  ? "Leaving the room will disconnect you from the current multiplayer match."
                  : "Leaving now will end the current game in progress."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-sm h-9 rounded-xl"
                onClick={() => setConfirmHomeOpen(false)}
              >
                Resume Game
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="text-sm h-9 rounded-xl cursor-pointer"
                onClick={handleConfirmExit}
              >
                {isOnline ? "Leave Room" : "Exit to Menu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </MotionConfig>
  );
}
