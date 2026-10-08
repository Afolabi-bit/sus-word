"use client";

import { useState } from "react";
import { useOnlineStore } from "@/lib/onlineStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Crown,
  Copy,
  Check,
  Play,
  Clock,
  LogOut,
  Loader2,
  Share2,
} from "lucide-react";
import GameShell from "./GameShell";

export default function OnlineLobbyScreen() {
  const roomCode = useOnlineStore((s) => s.roomCode);
  const players = useOnlineStore((s) => s.players);
  const isHost = useOnlineStore((s) => s.isHost);
  const timerDuration = useOnlineStore((s) => s.timerDuration);
  const myPlayerName = useOnlineStore((s) => s.myPlayerName);

  const setTimer = useOnlineStore((s) => s.setTimer);
  const startGame = useOnlineStore((s) => s.startGame);
  const leaveRoom = useOnlineStore((s) => s.leaveRoom);

  const [copied, setCopied] = useState(false);

  const playerCount = players.length;
  const canStart = playerCount >= 4;

  function handleCopy() {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    if (!roomCode || typeof window === "undefined") return;
    const shareData = {
      title: "Join my Oddword game!",
      text: `Join my Oddword room: ${roomCode}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      handleCopy();
    }
  }

  const timerOptions = [
    { label: "120s (2m)", seconds: 120 },
    { label: "3 min", seconds: 180 },
    { label: "5 min (Max)", seconds: 300 },
  ];

  return (
    <GameShell phaseKey="online-lobby" layout="scrollable">
      <div className="flex flex-col items-center gap-5 text-center w-full max-w-md mx-auto py-2">
        {/* Room Code Header Banner */}
        <div className="w-full rounded-3xl bg-surface-raised border border-border-subtle p-5 flex flex-col items-center gap-3 shadow-lg">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Room Code
          </span>
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-text-primary selection:bg-cta/30">
              {roomCode}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Copy room code"
              className="h-11 w-11 rounded-xl border-border-subtle bg-surface-base hover:bg-surface-raised cursor-pointer active:scale-95"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-5 h-5 text-win" />
              ) : (
                <Copy className="w-5 h-5 text-text-secondary" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Share room"
              className="h-11 w-11 rounded-xl border-border-subtle bg-surface-base hover:bg-surface-raised cursor-pointer active:scale-95"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 text-text-secondary" />
            </Button>
          </div>
          <p className="text-xs text-text-secondary">
            Share this code with friends so they can join from their phones.
          </p>
        </div>

        {/* Players Section */}
        <Card className="w-full bg-surface-raised border-border-subtle rounded-3xl shadow-sm">
          <CardContent className="p-5 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cta" />
                <h3 className="font-bold text-sm text-text-primary">
                  Connected Players ({playerCount}/10)
                </h3>
              </div>
              <Badge
                className={`text-xs px-2.5 py-0.5 font-semibold ${
                  canStart
                    ? "bg-win/15 text-win border-win/30"
                    : "bg-surface-base text-text-secondary border-border-subtle"
                }`}
              >
                {canStart ? "Ready to Start" : `Need ${4 - playerCount} More`}
              </Badge>
            </div>

            {/* Player list tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {players.map((p) => {
                const isMe = p.displayName === myPlayerName;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${
                      isMe
                        ? "bg-cta/10 border-cta/30 text-text-primary"
                        : "bg-surface-base border-border-subtle text-text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-win shrink-0 animate-pulse" />
                      <span className="text-sm font-semibold truncate">
                        {p.displayName} {isMe && "(You)"}
                      </span>
                    </div>
                    {p.isHost && (
                      <Badge className="bg-cta/15 text-cta border-cta/20 text-[10px] px-1.5 py-0 flex items-center gap-1 shrink-0">
                        <Crown className="w-3 h-3" /> Host
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Host Configuration Options */}
        {isHost ? (
          <div className="w-full bg-surface-raised border border-border-subtle rounded-3xl p-5 flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-secondary" />
              <span className="text-xs font-bold text-text-primary">
                Discussion Timer Duration
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {timerOptions.map((opt) => (
                <button
                  key={opt.seconds}
                  type="button"
                  onClick={() => setTimer(opt.seconds)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    timerDuration === opt.seconds
                      ? "bg-cta text-cta-fg border-cta shadow-sm"
                      : "bg-surface-base border-border-subtle text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Action Button */}
        <div className="w-full flex flex-col gap-2 pt-1">
          {isHost ? (
            <Button
              size="lg"
              disabled={!canStart}
              onClick={startGame}
              className="w-full h-14 text-base font-bold rounded-2xl bg-cta text-cta-fg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5 fill-current" />
              {canStart ? "Start Game" : `Waiting for Players (${playerCount}/4)`}
            </Button>
          ) : (
            <div className="p-4 rounded-2xl bg-surface-raised/80 border border-border-subtle flex items-center justify-center gap-2.5 text-text-secondary text-sm font-medium">
              <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
              <span>Waiting for the host to start the game...</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={leaveRoom}
            className="text-text-secondary hover:text-destructive text-xs gap-1.5 py-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Leave Room
          </Button>
        </div>
      </div>
    </GameShell>
  );
}
