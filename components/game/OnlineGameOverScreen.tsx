"use client";

import { useOnlineStore } from "@/lib/onlineStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, RotateCcw, Home, Skull, ShieldAlert, Loader2 } from "lucide-react";
import GameShell from "./GameShell";

export default function OnlineGameOverScreen() {
  const isHost = useOnlineStore((s) => s.isHost);
  const winner = useOnlineStore((s) => s.winner);
  const gameOverInfo = useOnlineStore((s) => s.gameOverInfo);
  const playAgain = useOnlineStore((s) => s.playAgain);
  const leaveRoom = useOnlineStore((s) => s.leaveRoom);

  const civiliansWon = winner === "civilians";
  const imposterName = gameOverInfo?.imposterName || "Unknown";
  const secretWord = gameOverInfo?.secretWord || "???";
  const eliminationLog = gameOverInfo?.eliminationLog || [];

  return (
    <GameShell phaseKey="online-game-over" layout="scrollable">
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto py-2">
        {/* Victory Trophy */}
        <div className="relative flex items-center justify-center pt-2">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-2 ${
              civiliansWon
                ? "bg-win/20 text-win border-win/30"
                : "bg-imposter/20 text-imposter border-imposter/30"
            }`}
          >
            {civiliansWon ? (
              <Trophy className="w-10 h-10" />
            ) : (
              <Skull className="w-10 h-10" />
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Badge
            className={`text-xs px-3 py-1 font-bold ${
              civiliansWon
                ? "bg-win/15 text-win border-win/30"
                : "bg-imposter/15 text-imposter border-imposter/30"
            }`}
          >
            {civiliansWon ? "Civilians Win!" : "Imposter Wins!"}
          </Badge>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">
            Game Over
          </h2>
          <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
            {civiliansWon
              ? "The civilians successfully identified and voted out the imposter!"
              : "The imposter blended in and outlasted the civilians!"}
          </p>
        </div>

        {/* Revelation Card */}
        <Card className="w-full bg-surface-raised border-border-subtle rounded-3xl overflow-hidden text-left shadow-lg">
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <span className="text-xs font-semibold text-text-secondary">
                Secret Word
              </span>
              <span className="text-xl font-black text-cta tracking-wide">
                {secretWord}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-imposter" /> The Imposter was
              </span>
              <Badge className="bg-imposter/15 text-imposter border-imposter/25 font-bold text-sm px-2.5 py-0.5">
                {imposterName}
              </Badge>
            </div>

            {/* Elimination History */}
            {eliminationLog.length > 0 && (
              <div className="pt-2 border-t border-border-subtle flex flex-col gap-2">
                <span className="text-xs font-semibold text-text-secondary">
                  Elimination History
                </span>
                <div className="flex flex-col gap-1.5">
                  {eliminationLog.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-surface-base border border-border-subtle"
                    >
                      <span className="text-text-primary font-medium">
                        Round {rec.round}: {rec.displayName}
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          rec.wasImposter ? "text-imposter" : "text-text-secondary"
                        }`}
                      >
                        {rec.wasImposter ? "Imposter" : "Civilian"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Controls */}
        <div className="w-full flex flex-col gap-2 pt-1">
          {isHost ? (
            <Button
              size="lg"
              onClick={playAgain}
              className="w-full h-14 text-base font-bold rounded-2xl bg-cta text-cta-fg shadow-lg hover:brightness-105 active:scale-[0.96] transition-[transform,filter] duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again (Return to Lobby)</span>
            </Button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-surface-raised border border-border-subtle flex items-center justify-center gap-2 text-text-secondary text-xs font-medium">
              <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
              <span>Waiting for the host to start a new match...</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={leaveRoom}
            className="text-text-secondary hover:text-text-primary text-xs gap-1.5 py-2 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Main Menu</span>
          </Button>
        </div>
      </div>
    </GameShell>
  );
}
