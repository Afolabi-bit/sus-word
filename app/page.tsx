"use client";

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

export default function Home() {
  const phase = useGameStore((s) => s.phase);

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
    <main className="flex flex-1 flex-col bg-app">
      <AnimatePresence mode="wait">{renderPhase()}</AnimatePresence>
    </main>
  );
}
