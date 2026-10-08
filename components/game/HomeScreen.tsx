"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Users,
  Wifi,
  Smartphone,
  ArrowRight,
  HelpCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";
import OnlineEntryModal from "./OnlineEntryModal";
import HowToPlayModal from "./HowToPlayModal";

export default function HomeScreen() {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const hapticsEnabled = useGameStore((s) => s.hapticsEnabled);
  const dispatch = useGameStore((s) => s.dispatch);
  const feedback = useGameFeedback();
  const [onlineModalOpen, setOnlineModalOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  return (
    <GameShell phaseKey="home" layout="scrollable">
      <div className="flex flex-col items-center gap-7 text-center w-full max-w-md mx-auto py-2">
        {/* Top Utility Controls Dock */}
        <div className="flex items-center justify-between w-full px-1">
          <button
            type="button"
            onClick={() => {
              feedback.tap();
              setHowToPlayOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-full bg-surface-raised/80 border border-border-subtle transition-colors cursor-pointer active:scale-[0.96]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How to Play</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_SOUND" })}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-raised/80 border border-border-subtle text-text-secondary hover:text-text-primary transition-colors cursor-pointer active:scale-[0.96]"
              aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 text-text-hint" />
              )}
            </button>

            <button
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_HAPTICS" })}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-raised/80 border border-border-subtle text-text-secondary hover:text-text-primary transition-colors cursor-pointer active:scale-[0.96]"
              aria-label={hapticsEnabled ? "Disable vibration" : "Enable vibration"}
            >
              <Smartphone
                className={`w-4 h-4 ${
                  hapticsEnabled ? "text-text-primary" : "text-text-hint"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Brand Hero */}
        <div className="flex flex-col items-center gap-2 pt-1 pb-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-heading text-text-primary text-center">
            Oddword
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xs mx-auto font-normal">
            One word. One imposter in plain sight. Can you find the odd one out?
          </p>
        </div>

        {/* Mode Selector Deck */}
        <div className="flex flex-col gap-4 w-full">
          {/* Mode 1: Pass & Play (Offline Party) */}
          <div className="w-full relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-raised p-5 sm:p-6 text-left shadow-xl transition-all flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-surface-base border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
                  <Smartphone className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-text-primary leading-tight font-heading">
                    Pass & Play
                  </h2>
                  <span className="text-xs font-medium text-text-hint">
                    Single Phone · Offline
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-surface-base border border-border-subtle text-text-secondary">
                4–10 Players
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Pass your phone around the table. Everyone uncovers the secret word except the imposter.
            </p>

            <Button
              size="lg"
              className="w-full h-13 text-base font-bold rounded-2xl bg-cta text-cta-fg shadow-lg hover:opacity-90 active:scale-[0.96] transition-[transform,opacity] flex items-center justify-center gap-2 group cursor-pointer"
              onClick={() => {
                feedback.tap();
                dispatch({ type: "NEW_GAME" });
              }}
            >
              <span>Start Pass & Play</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Mode 2: Online Multiplayer */}
          <div className="w-full relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-raised/80 hover:bg-surface-raised p-5 sm:p-6 text-left shadow-lg transition-all flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-surface-base border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
                  <Wifi className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-text-primary leading-tight font-heading">
                    Online Multiplayer
                  </h2>
                  <span className="text-xs font-medium text-text-hint">
                    Private Room · Multi-device
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-win/15 border border-win/30 text-win flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-win animate-pulse" />
                Live
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Everyone plays on their own device. Host a match or join with a 6-letter room code.
            </p>

            <Button
              variant="outline"
              size="lg"
              className="w-full h-13 text-base font-bold rounded-2xl border-border-strong bg-surface-base hover:bg-surface-raised text-text-primary active:scale-[0.96] transition-[transform,background-color] flex items-center justify-center gap-2 group cursor-pointer"
              onClick={() => {
                feedback.tap();
                setOnlineModalOpen(true);
              }}
            >
              <span>Host or Join Room</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-text-hint pt-1">Oddword — The Word Game of Hidden Deception</p>

        {/* Online Mode Entry Dialog */}
        <OnlineEntryModal
          open={onlineModalOpen}
          onOpenChange={setOnlineModalOpen}
        />

        {/* How to Play Drawer */}
        <HowToPlayModal
          open={howToPlayOpen}
          onOpenChange={setHowToPlayOpen}
        />
      </div>
    </GameShell>
  );
}
