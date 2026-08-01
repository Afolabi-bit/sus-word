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
  Lock,
  ArrowRight,
  ShieldCheck,
  Bell,
  HelpCircle,
  Gamepad2,
} from "lucide-react";
import GameShell from "./GameShell";

export default function HomeScreen() {
  const dispatch = useGameStore((s) => s.dispatch);
  const [onlineModalOpen, setOnlineModalOpen] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <GameShell phaseKey="home">
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto py-2">
        {/* Brand Header & Logo */}
        <div className="flex items-center gap-4">
          <SusWordLogo size={72} className="drop-shadow-lg shrink-0" />

          <div className="flex flex-col items-start gap-1">
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-0">
              <span className="text-imposter">Sus</span>
              <span className="text-text-primary">Word</span>
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Find the imposter before time runs out
            </p>
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="w-full flex flex-col gap-4 mt-2">
          {/* MODE 1: OFFLINE PASS & PLAY — primary, amber-anchored */}
          <Card className="relative overflow-hidden border-2 border-accent/80 bg-game-card shadow-lg hover:shadow-accent/15 transition-all duration-200">
            <CardContent className="p-5 flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-accent/15 text-accent">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-text-primary leading-tight">
                      Pass & Play
                    </h2>
                    <span className="text-xs font-semibold text-accent">
                      Offline Mode
                    </span>
                  </div>
                </div>
                <Badge className="bg-accent/15 text-accent border-accent/25 font-semibold text-xs">
                  Ready
                </Badge>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Play on a single device passed around your group. No internet
                required!
              </p>

              <div className="flex items-center gap-3 text-xs text-text-secondary pt-1 border-t border-game-border">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-text-secondary" /> 4–10
                  Players
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-text-secondary" />{" "}
                  100% Offline
                </span>
              </div>

              <Button
                size="lg"
                className="w-full h-12 text-base font-bold rounded-xl bg-accent text-accent-text hover:bg-accent/90 shadow-md flex items-center justify-center gap-2 group mt-1 cursor-pointer"
                onClick={() => dispatch({ type: "NEW_GAME" })}
              >
                Play Offline
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          {/* MODE 2: ONLINE MULTIPLAYER — secondary/disabled, fully muted */}
          <Card className="relative overflow-hidden border border-game-border bg-game-card/50 opacity-75 transition-all duration-200">
            <div className="absolute top-0 right-0">
              <Badge className="bg-game-card border-game-border text-text-secondary font-semibold text-[10px] tracking-wider uppercase rounded-none rounded-bl-xl px-3 py-1">
                Coming Soon
              </Badge>
            </div>

            <CardContent className="p-5 flex flex-col gap-4 text-left">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-game-card border border-game-border text-text-secondary">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-text-primary/70 leading-tight">
                    Online Rooms
                  </h2>
                  <span className="text-xs font-semibold text-text-secondary">
                    Multiplayer
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Connect with friends remotely over internet. Join custom game
                rooms from your own phone!
              </p>

              <div className="flex items-center gap-3 text-xs text-text-secondary pt-1 border-t border-game-border">
                <span className="flex items-center gap-1">
                  <Gamepad2 className="w-3.5 h-3.5 text-text-secondary" />{" "}
                  Multi-Device
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-text-secondary" /> Room
                  Codes
                </span>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-sm font-semibold rounded-xl border-dashed border-game-border hover:bg-game-card flex items-center justify-center gap-2 text-text-secondary cursor-pointer"
                onClick={() => setOnlineModalOpen(true)}
              >
                <Lock className="w-4 h-4 text-text-secondary" />
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* How to Play accordion / trigger */}
        <div className="w-full pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 mx-auto"
            onClick={() => setShowHowToPlay(!showHowToPlay)}
          >
            <HelpCircle className="w-3.5 h-3.5 text-text-secondary" />
            {showHowToPlay ? "Hide How to Play" : "How to Play SusWord"}
          </Button>

          {showHowToPlay && (
            <div className="mt-3 p-4 rounded-xl bg-game-card border border-game-border text-xs text-left flex flex-col gap-3.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent font-bold shrink-0">
                  1
                </span>
                <div>
                  <p className="font-semibold text-text-primary">
                    Pass & Reveal
                  </p>
                  <p className="text-text-secondary">
                    Everyone sees the secret word except 1 player who gets{" "}
                    <strong>IMPOSTER</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent font-bold shrink-0">
                  2
                </span>
                <div>
                  <p className="font-semibold text-text-primary">
                    Discuss & Clue
                  </p>
                  <p className="text-text-secondary">
                    Take turns giving subtle clues. Civilians prove they know
                    the word without revealing it.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent font-bold shrink-0">
                  3
                </span>
                <div>
                  <p className="font-semibold text-text-primary">
                    Vote & Eliminate
                  </p>
                  <p className="text-text-secondary">
                    Vote out who you think is suspicious. Eliminate the imposter
                    to win!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-[11px] text-text-secondary pt-2">
          SusWord v1.0 • Offline Edition
        </p>

        {/* Online Mode Info Modal */}
        <Dialog open={onlineModalOpen} onOpenChange={setOnlineModalOpen}>
          <DialogContent className="sm:max-w-xs bg-game-card border-game-border">
            <DialogHeader className="text-left">
              <div className="w-10 h-10 rounded-full bg-game-card border border-game-border flex items-center justify-center text-text-secondary mb-2">
                <Wifi className="w-5 h-5" />
              </div>
              <DialogTitle className="text-xl font-bold text-text-primary">
                Online Multiplayer
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary leading-relaxed pt-1">
                We are actively building the online version of{" "}
                <strong>SusWord</strong>! Soon you&apos;ll be able to host
                games, join room codes, and play remotely with friends anywhere.
              </DialogDescription>
            </DialogHeader>

            <div className="my-2 p-3 rounded-lg bg-game-card border border-game-border text-xs text-text-primary flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold text-text-secondary">
                <Bell className="w-4 h-4" /> Upcoming Features:
              </div>
              <ul className="list-disc list-inside text-text-secondary space-y-1 pl-1 text-[11px]">
                <li>Private & Public lobby rooms</li>
                <li>Real-time online voting & timers</li>
                <li>Custom word packs & themes</li>
              </ul>
            </div>

            <DialogFooter>
              <Button
                className="w-full bg-accent text-accent-text hover:bg-accent/90 font-semibold text-xs h-10 rounded-lg"
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
