"use client";

import { useOnlineStore } from "@/lib/onlineStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Play, Sparkles, CheckCircle2 } from "lucide-react";
import GameShell from "./GameShell";

export default function OnlineReadyScreen() {
  const isHost = useOnlineStore((s) => s.isHost);
  const startDiscussion = useOnlineStore((s) => s.startDiscussion);
  const timerDuration = useOnlineStore((s) => s.timerDuration);

  return (
    <GameShell phaseKey="online-ready" layout="centered">
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto py-4">
        {/* Success Icon */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-win/20 text-win flex items-center justify-center border-2 border-win/30 shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-black text-text-primary tracking-tight">
            All Roles Revealed!
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
            Everyone has seen their role. Prepare to debate and find the imposter.
          </p>
        </div>

        {/* Game Rules Card */}
        <Card className="w-full bg-surface-raised border-border-subtle rounded-3xl text-left shadow-sm">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-text-primary font-bold text-xs">
              <MessageSquare className="w-4 h-4 text-cta" />
              <span>Discussion Rules</span>
            </div>
            <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside">
              <li>Take turns saying <strong>one word or short clue</strong> about the secret word.</li>
              <li>Don&apos;t make it too obvious, or the Imposter will guess it!</li>
              <li>Don&apos;t make it too vague, or you&apos;ll look suspicious.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="w-full flex flex-col gap-2 pt-2">
          {isHost ? (
            <Button
              size="lg"
              onClick={startDiscussion}
              className="w-full h-14 text-base font-bold rounded-2xl bg-cta text-cta-fg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Discussion ({timerDuration}s)
            </Button>
          ) : (
            <div className="p-4 rounded-2xl bg-surface-raised border border-border-subtle flex items-center justify-center gap-2 text-text-secondary text-sm font-medium">
              <Sparkles className="w-4 h-4 text-cta animate-spin" />
              <span>Waiting for the host to start discussion...</span>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
}
