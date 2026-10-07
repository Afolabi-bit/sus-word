"use client";

import { useOnlineStore } from "@/lib/onlineStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Play, ShieldAlert, Sparkles, Users } from "lucide-react";
import GameShell from "./GameShell";

export default function OnlineResultScreen() {
  const isHost = useOnlineStore((s) => s.isHost);
  const lastEliminated = useOnlineStore((s) => s.lastEliminated);
  const activePlayers = useOnlineStore((s) => s.activePlayers);
  const startDiscussion = useOnlineStore((s) => s.startDiscussion);

  const wasImposter = lastEliminated?.wasImposter;
  const victimName = lastEliminated?.displayName || "Player";

  return (
    <GameShell phaseKey="online-result" layout="centered">
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto py-4">
        {/* Status Badge */}
        <Badge
          className={`text-xs px-3 py-1 font-bold ${
            wasImposter
              ? "bg-imposter/20 text-imposter border-imposter/30"
              : "bg-destructive/20 text-destructive border-destructive/30"
          }`}
        >
          {wasImposter ? "Imposter Caught!" : "Innocent Civilian!"}
        </Badge>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-black text-text-primary tracking-tight">
            {victimName} was Eliminated!
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
            {wasImposter ? (
              <span className="text-win font-semibold">
                You caught the imposter!
              </span>
            ) : (
              <span className="text-destructive font-semibold">
                They were a Civilian. The Imposter is still among you!
              </span>
            )}
          </p>
        </div>

        {/* Remaining Players Card */}
        <Card className="w-full bg-surface-raised border-border-subtle rounded-3xl text-left shadow-sm">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cta" /> Active Survivors
              </span>
              <span>{activePlayers.length} remaining</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              The game continues. Keep questioning everyone&apos;s statements and find the real imposter!
            </p>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="w-full pt-2">
          {isHost ? (
            <Button
              size="lg"
              onClick={startDiscussion}
              className="w-full h-14 text-base font-bold rounded-2xl bg-cta text-cta-fg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Next Round Discussion</span>
            </Button>
          ) : (
            <div className="w-full p-4 rounded-2xl bg-surface-raised border border-border-subtle flex items-center justify-center gap-2 text-text-secondary text-xs font-medium">
              <Sparkles className="w-4 h-4 text-cta animate-spin" />
              <span>Waiting for host to start next round...</span>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
}
