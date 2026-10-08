"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  Wifi,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Bell,
  ChevronRight,
  HelpCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import GameShell from "./GameShell";
import { useGameFeedback } from "@/lib/audio";
import OnlineEntryModal from "./OnlineEntryModal";

export default function HomeScreen() {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const hapticsEnabled = useGameStore((s) => s.hapticsEnabled);
  const dispatch = useGameStore((s) => s.dispatch);
  const feedback = useGameFeedback();
  const [onlineModalOpen, setOnlineModalOpen] = useState(false);

  return (
    <GameShell phaseKey="home" layout="scrollable">
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto py-2">
        {/* Brand Hero */}
        <div className="flex flex-col items-center gap-2 pt-4 pb-1">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight font-heading flex items-center justify-center">
            <span className="text-text-primary">Odd</span>
            <span className="text-imposter">word</span>
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xs mx-auto">
            One word. One imposter in plain sight. Can you find the odd one out?
          </p>
        </div>

        {/* Primary Action Card: Offline Pass & Play */}
        <Card className="w-full relative overflow-hidden rounded-[28px] border border-border-strong bg-surface-raised shadow-xl transition-[box-shadow,border-color] duration-200">
          <CardContent className="p-5 sm:p-6 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-surface-base border border-border-subtle text-text-primary">
                  <Smartphone className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-text-primary leading-tight">
                    Pass & Play
                  </h2>
                  <span className="text-xs font-semibold text-text-secondary">
                    Offline Party Game
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="bg-surface-base text-text-secondary border-border-subtle font-semibold text-xs px-2.5 py-0.5">
                Ready
              </Badge>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              Pass your phone around the table. One player is the imposter — they
              don&apos;t know the secret word.
            </p>

            <div className="flex items-center gap-4 text-xs font-medium text-text-secondary pt-1 border-t border-border-subtle">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-text-secondary" /> 4–10 Players
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-win" /> 100% Offline
              </span>
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-base font-bold rounded-2xl bg-cta text-cta-fg shadow-lg hover:opacity-90 active:scale-[0.96] transition-[transform,opacity] flex items-center justify-center gap-2 group mt-1 cursor-pointer"
              onClick={() => {
                feedback.tap();
                dispatch({ type: "NEW_GAME" });
              }}
            >
              <span>Play Offline</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Online Multiplayer Mode Card */}
        <button
          type="button"
          onClick={() => {
            feedback.tap();
            setOnlineModalOpen(true);
          }}
          className="w-full rounded-2xl border border-border-subtle hover:border-border-strong bg-surface-raised hover:bg-surface-raised/90 p-4 flex items-center justify-between text-left transition-[transform,background-color,border-color] duration-150 cursor-pointer group active:scale-[0.96] shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-surface-base border border-border-subtle text-text-primary group-hover:scale-105 transition-transform">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-text-primary">
                  Online Multiplayer
                </span>
                <Badge className="bg-win/15 text-win border-win/30 text-[11px] font-semibold px-2 py-0">
                  Live
                </Badge>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Host a room or join with a 6-letter code
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-text-primary group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Permanently Visible "How to Play" Section */}
        <div className="w-full rounded-2xl border border-border-subtle bg-surface-raised/60 p-4 sm:p-5 text-left flex flex-col gap-3">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-text-secondary" />
            <span>How to Play</span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-surface-base border border-border-subtle text-text-secondary font-bold text-xs shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-text-primary text-xs sm:text-sm">
                  Pass & Reveal
                </p>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Each player gets the secret word. One player gets something
                  else entirely.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-surface-base border border-border-subtle text-text-secondary font-bold text-xs shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-text-primary text-xs sm:text-sm">
                  Discuss & Clue
                </p>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Give clues about the word. Don&apos;t say it directly. Figure
                  out who&apos;s faking it.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-surface-base border border-border-subtle text-text-secondary font-bold text-xs shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-semibold text-text-primary text-xs sm:text-sm">
                  Vote & Eliminate
                </p>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Discuss who seems off, then vote them out. Catch the imposter
                  before they outlast you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Audio & Haptic Settings Quick Toggles */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_SOUND" })}
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-full bg-surface-raised border border-border-subtle transition-colors cursor-pointer active:scale-[0.96]"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cta" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-text-hint" />
                <span>Muted</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_HAPTICS" })}
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-full bg-surface-raised border border-border-subtle transition-colors cursor-pointer active:scale-[0.96]"
          >
            <Smartphone
              className={`w-3.5 h-3.5 ${
                hapticsEnabled ? "text-cta" : "text-text-hint"
              }`}
            />
            <span>{hapticsEnabled ? "Vibration On" : "Vibration Off"}</span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-text-hint pt-0.5">Oddword — Party Word Game</p>

        {/* Online Mode Entry Dialog */}
        <OnlineEntryModal
          open={onlineModalOpen}
          onOpenChange={setOnlineModalOpen}
        />
      </div>
    </GameShell>
  );
}
