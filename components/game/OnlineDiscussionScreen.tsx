"use client";

import { useState, useEffect } from "react";
import { useOnlineStore } from "@/lib/onlineStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Vote, Eye, EyeOff, ShieldAlert } from "lucide-react";
import GameShell from "./GameShell";

export default function OnlineDiscussionScreen() {
  const isHost = useOnlineStore((s) => s.isHost);
  const timerEndsAt = useOnlineStore((s) => s.timerEndsAt);
  const timerDuration = useOnlineStore((s) => s.timerDuration);
  const myRole = useOnlineStore((s) => s.myRole);
  const secretWord = useOnlineStore((s) => s.secretWord);
  const secretCategory = useOnlineStore((s) => s.secretCategory);
  const endDiscussion = useOnlineStore((s) => s.endDiscussion);

  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
  const [peekOpen, setPeekOpen] = useState(false);

  useEffect(() => {
    if (!timerEndsAt) {
      setTimeLeft(timerDuration);
      return;
    }

    const interval = setInterval(() => {
      const remainingMs = Date.parse(timerEndsAt) - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      setTimeLeft(remainingSec);
    }, 200);

    return () => clearInterval(interval);
  }, [timerEndsAt, timerDuration]);

  const isUrgent = timeLeft <= 15 && timeLeft > 0;
  const isImposter = myRole === "imposter";

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <GameShell phaseKey="online-discussing" layout="centered">
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto py-2">
        {/* Category Header */}
        <div className="flex items-center gap-2">
          <Badge className="bg-surface-raised border-border-subtle text-text-secondary text-xs px-3 py-1">
            Category: <strong className="text-text-primary ml-1">{secretCategory || "General"}</strong>
          </Badge>
        </div>

        {/* Circular / Large Timer Display */}
        <div className="flex flex-col items-center gap-2 my-2">
          <div
            className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center transition-colors shadow-2xl ${
              isUrgent
                ? "border-destructive bg-destructive/10 text-destructive animate-pulse"
                : "border-cta bg-surface-raised text-text-primary"
            }`}
          >
            <Clock className={`w-6 h-6 mb-1 ${isUrgent ? "text-destructive" : "text-cta"}`} />
            <span className="text-5xl font-black font-mono tracking-tight">
              {formattedTime}
            </span>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-widest mt-0.5">
              {timeLeft === 0 ? "Time's Up!" : "Discussion"}
            </span>
          </div>
        </div>

        <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
          Debate and look for inconsistencies. When time runs out, everyone votes!
        </p>

        {/* Confidential Role Peek Toggle */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => setPeekOpen(!peekOpen)}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary py-2 px-3 rounded-xl bg-surface-raised border border-border-subtle mx-auto transition-colors cursor-pointer active:scale-95"
          >
            {peekOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cta" />}
            <span>{peekOpen ? "Hide My Word" : "Peek My Word"}</span>
          </button>

          {peekOpen && (
            <div className="mt-2 p-3 rounded-2xl bg-surface-base border border-border-subtle text-xs text-center flex flex-col items-center gap-1.5 animate-fade-in shadow-md">
              <span className="text-[11px] font-bold text-text-secondary">
                {isImposter ? "YOUR ROLE" : "SECRET WORD"}
              </span>
              {isImposter ? (
                <span className="text-imposter font-extrabold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> IMPOSTER (Word Unknown)
                </span>
              ) : (
                <span className="text-cta text-base font-black tracking-wide">
                  {secretWord}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Host Early Skip Control */}
        {isHost && (
          <div className="w-full pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={endDiscussion}
              className="w-full h-12 text-sm font-bold rounded-2xl border-border-subtle bg-surface-raised hover:bg-surface-base text-text-primary gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Vote className="w-4 h-4 text-cta" />
              <span>Proceed to Voting Now</span>
            </Button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
