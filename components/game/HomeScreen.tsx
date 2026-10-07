"use client";

import { useState } from "react";
import SusWordLogo from "@/components/ui/SusWordLogo";
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
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-imposter/20 blur-xl animate-pulse-subtle pointer-events-none" />
            <SusWordLogo size={80} className="relative drop-shadow-xl shrink-0" />
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-5xl font-extrabold tracking-tight font-germania flex items-center justify-center">
              <span className="text-imposter">Sus</span>
              <span className="text-text-primary">Word</span>
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
              One of you doesn&apos;t know the word. Find them.
            </p>
          </div>
        </div>

        {/* Primary Action Card: Offline Pass & Play */}
        <Card className="w-full relative overflow-hidden rounded-[28px] border-2 border-cta/80 bg-surface-raised shadow-xl transition-[box-shadow,border-color] duration-200">
          <CardContent className="p-5 sm:p-6 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-cta/15 text-cta">
                  <Smartphone className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-text-primary leading-tight">
                    Pass & Play
                  </h2>
                  <span className="text-xs font-semibold text-cta">
                    Offline Party Game
                  </span>
                </div>
              </div>
              <Badge className="bg-cta/15 text-cta border-cta/25 font-semibold text-xs px-2.5 py-0.5">
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
              className="w-full h-14 text-base font-bold rounded-2xl bg-cta text-cta-fg shadow-md hover:brightness-105 active:scale-[0.96] transition-[transform,filter] flex items-center justify-center gap-2 group mt-1 cursor-pointer"
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

        {/* Compact Online Mode Teaser Strip */}
        <button
          type="button"
          onClick={() => setOnlineModalOpen(true)}
          className="w-full rounded-2xl border border-border-subtle bg-surface-raised/40 hover:bg-surface-raised px-4 py-3 flex items-center justify-between text-left transition-[background-color,border-color] duration-150 cursor-pointer group active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-surface-base border border-border-subtle text-text-secondary group-hover:text-text-primary transition-colors">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">
                  Online Multiplayer
                </span>
                <Badge className="bg-surface-base border-border-subtle text-text-secondary text-[11px] font-medium px-1.5 py-0">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-xs text-text-secondary">
                Play on separate phones via room code
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Permanently Visible "How to Play" Section */}
        <div className="w-full rounded-2xl border border-border-subtle bg-surface-raised/60 p-4 sm:p-5 text-left flex flex-col gap-3">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-cta" />
            <span>How to Play</span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cta/20 text-cta font-bold text-xs shrink-0 mt-0.5">
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
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cta/20 text-cta font-bold text-xs shrink-0 mt-0.5">
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
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cta/20 text-cta font-bold text-xs shrink-0 mt-0.5">
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
        <p className="text-xs text-text-hint pt-0.5">SusWord — Offline</p>

        {/* Online Mode Info Modal */}
        <Dialog open={onlineModalOpen} onOpenChange={setOnlineModalOpen}>
          <DialogContent className="sm:max-w-xs bg-surface-raised border-border-subtle">
            <DialogHeader className="text-left">
              <div className="w-10 h-10 rounded-full bg-surface-base border border-border-subtle flex items-center justify-center text-text-secondary mb-2">
                <Wifi className="w-5 h-5" />
              </div>
              <DialogTitle className="text-xl font-bold text-text-primary">
                Online Multiplayer
              </DialogTitle>
              <DialogDescription className="text-sm text-text-secondary leading-relaxed pt-1">
                We are actively building the online version of{" "}
                <strong>SusWord</strong>! Soon you&apos;ll be able to host
                games, join room codes, and play remotely with friends anywhere.
              </DialogDescription>
            </DialogHeader>

            <div className="my-2 p-3.5 rounded-xl bg-surface-base border border-border-subtle text-sm text-text-primary flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold text-text-secondary text-xs">
                <Bell className="w-4 h-4 text-cta" /> Upcoming Features:
              </div>
              <ul className="list-disc list-inside text-text-secondary space-y-1 pl-1 text-xs">
                <li>Private & Public lobby rooms</li>
                <li>Real-time online voting & timers</li>
                <li>Custom word packs & themes</li>
              </ul>
            </div>

            <DialogFooter>
              <Button
                className="w-full bg-cta text-cta-fg hover:brightness-105 font-semibold text-sm h-11 rounded-xl cursor-pointer"
                onClick={() => setOnlineModalOpen(false)}
              >
                Got It
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </GameShell>
  );
}
