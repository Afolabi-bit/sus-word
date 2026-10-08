"use client";

import { useState } from "react";
import { useOnlineStore } from "@/lib/onlineStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Check, User, ShieldAlert, AlertCircle } from "lucide-react";
import GameShell from "./GameShell";

export default function OnlineRevealScreen() {
  const myRole = useOnlineStore((s) => s.myRole);
  const secretWord = useOnlineStore((s) => s.secretWord);
  const secretCategory = useOnlineStore((s) => s.secretCategory);
  const revealTurn = useOnlineStore((s) => s.revealTurn);
  const myPlayerId = useOnlineStore((s) => s.myPlayerId);
  const playerReady = useOnlineStore((s) => s.playerReady);

  const [isRevealed, setIsRevealed] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const isMyTurn = revealTurn?.currentPlayerId === myPlayerId;
  const isImposter = myRole === "imposter";

  function handleReady() {
    setHasConfirmed(true);
    playerReady();
  }

  return (
    <GameShell phaseKey="online-reveal" layout="scrollable">
      <div className="flex flex-col items-center gap-5 text-center w-full max-w-md mx-auto py-2">
        {/* Progress header */}
        {revealTurn && (
          <div className="w-full flex items-center justify-between px-2 text-xs font-semibold text-text-secondary">
            <span>
              Player {revealTurn.revealIndex + 1} of {revealTurn.totalPlayers}
            </span>
            <Badge className="bg-surface-raised border-border-subtle text-text-secondary">
              Role Reveal
            </Badge>
          </div>
        )}

        {/* Turn status alert */}
        <div
          className={`w-full p-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors ${
            isMyTurn
              ? "bg-cta/15 border-cta/30 text-cta"
              : "bg-surface-raised border-border-subtle text-text-secondary"
          }`}
        >
          {isMyTurn ? (
            <>
              <Eye className="w-4 h-4 text-cta" />
              <span>It&apos;s your turn! Memorize your secret role.</span>
            </>
          ) : (
            <>
              <User className="w-4 h-4" />
              <span>
                Waiting for <strong>{revealTurn?.currentPlayerName || "player"}</strong> to view their role...
              </span>
            </>
          )}
        </div>

        {/* Secret Card */}
        <Card className="w-full bg-surface-raised border-2 border-border-subtle rounded-3xl overflow-hidden shadow-xl transition-all">
          <CardContent className="p-6 flex flex-col items-center gap-5">
            <span className="text-xs font-semibold text-text-secondary">
              Confidential Assignment
            </span>

            {/* Tap to Peek Toggle */}
            <div
              onClick={() => setIsRevealed(!isRevealed)}
              className="w-full min-h-[170px] rounded-2xl bg-surface-base border border-border-subtle p-6 flex flex-col items-center justify-center gap-3 cursor-pointer select-none active:scale-[0.96] transition-[transform,background-color,border-color] duration-150"
            >
              {isRevealed ? (
                <div className="flex flex-col items-center gap-3 animate-fade-in">
                  <Badge
                    className={`text-xs px-3 py-1 font-bold ${
                      isImposter
                        ? "bg-imposter/20 text-imposter border-imposter/30"
                        : "bg-win/20 text-win border-win/30"
                    }`}
                  >
                    {isImposter ? (
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" /> YOU ARE THE IMPOSTER
                      </span>
                    ) : (
                      "CIVILIAN"
                    )}
                  </Badge>

                  <div className="text-xs text-text-secondary">
                    Category: <strong className="text-text-primary">{secretCategory || "General"}</strong>
                  </div>

                  {isImposter ? (
                    <div className="p-3 rounded-xl bg-imposter/10 border border-imposter/20 text-xs text-imposter font-medium max-w-xs leading-relaxed">
                      You do <strong>NOT</strong> know the word! Listen carefully and fake your way through.
                    </div>
                  ) : (
                    <div className="text-3xl sm:text-4xl font-normal text-text-primary tracking-wide drop-shadow-sm font-germania py-1">
                      {secretWord}
                    </div>
                  )}

                  <span className="text-[11px] text-text-hint flex items-center gap-1 mt-1">
                    <EyeOff className="w-3 h-3" /> Tap to hide
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-secondary">
                  <div className="w-12 h-12 rounded-full bg-surface-raised border border-border-subtle flex items-center justify-center text-text-primary">
                    <Eye className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-text-primary">
                    Tap to Reveal
                  </span>
                  <span className="text-xs text-text-secondary">
                    Make sure nobody is looking at your screen!
                  </span>
                </div>
              )}
            </div>

            {/* Action when it's user's turn */}
            {isMyTurn ? (
              <Button
                size="lg"
                disabled={hasConfirmed}
                onClick={handleReady}
                className="w-full h-13 text-sm font-bold rounded-2xl bg-cta text-cta-fg hover:brightness-105 active:scale-[0.96] transition-[transform,filter] duration-150 cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {hasConfirmed ? "Confirmed! Waiting for Next..." : "I've Got It (Continue)"}
              </Button>
            ) : (
              <div className="text-xs text-text-secondary">
                You can review your role anytime by tapping the card above.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameShell>
  );
}
