"use client";

import { useState } from "react";
import { useOnlineStore } from "@/lib/onlineStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Vote, UserX, Crown, ShieldAlert, AlertTriangle } from "lucide-react";
import GameShell from "./GameShell";

export default function OnlineVotingScreen() {
  const isHost = useOnlineStore((s) => s.isHost);
  const players = useOnlineStore((s) => s.players);
  const activePlayers = useOnlineStore((s) => s.activePlayers);
  const eliminatePlayer = useOnlineStore((s) => s.eliminatePlayer);
  const myPlayerName = useOnlineStore((s) => s.myPlayerName);

  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  // Active players in the room eligible for elimination
  const activePlayerList = players.filter(
    (p) => activePlayers.includes(p.id) || p.isActive
  );

  const selectedPlayer = players.find((p) => p.id === selectedTargetId);

  function handleEliminate() {
    if (!selectedTargetId) return;
    eliminatePlayer(selectedTargetId);
  }

  return (
    <GameShell phaseKey="online-voting" layout="scrollable">
      <div className="flex flex-col items-center gap-5 text-center w-full max-w-md mx-auto py-2">
        <div className="flex flex-col items-center gap-2">
          <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-xs px-3 py-1 font-bold">
            <Vote className="w-3.5 h-3.5 mr-1" /> Elimination Vote
          </Badge>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">
            Who is the Imposter?
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
            {isHost
              ? "Tally the votes from the table, then select the suspect to eliminate."
              : "Point your fingers and cast your vote! The host will record who gets eliminated."}
          </p>
        </div>

        {/* Players Selection Grid */}
        <div className="w-full grid grid-cols-1 gap-2.5">
          {activePlayerList.map((p) => {
            const isSelected = selectedTargetId === p.id;
            const isMe = p.displayName === myPlayerName;

            return (
              <button
                key={p.id}
                type="button"
                disabled={!isHost}
                onClick={() => isHost && setSelectedTargetId(p.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  !isHost
                    ? "bg-surface-raised border-border-subtle cursor-default"
                    : isSelected
                    ? "bg-destructive/15 border-destructive shadow-md cursor-pointer scale-[1.01]"
                    : "bg-surface-raised border-border-subtle hover:border-text-secondary cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? "bg-destructive text-destructive-fg"
                        : "bg-surface-base text-text-secondary"
                    }`}
                  >
                    {p.displayName.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-text-primary">
                      <span>{p.displayName}</span>
                      {isMe && <span className="text-xs text-text-secondary">(You)</span>}
                    </div>
                    <span className="text-[11px] text-text-secondary">
                      Active Player
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {p.isHost && (
                    <Badge className="bg-cta/15 text-cta border-cta/25 text-[10px] px-1.5 py-0 flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Host
                    </Badge>
                  )}
                  {isHost && (
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-destructive bg-destructive"
                          : "border-border-subtle bg-surface-base"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button for Host */}
        {isHost ? (
          <div className="w-full pt-2">
            <Button
              size="lg"
              disabled={!selectedTargetId}
              onClick={handleEliminate}
              className="w-full h-14 text-base font-bold rounded-2xl bg-destructive text-destructive-fg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserX className="w-5 h-5" />
              {selectedPlayer
                ? `Eliminate ${selectedPlayer.displayName}`
                : "Select a Player to Eliminate"}
            </Button>
          </div>
        ) : (
          <div className="w-full p-4 rounded-2xl bg-surface-raised border border-border-subtle flex items-center justify-center gap-2 text-text-secondary text-xs font-medium">
            <AlertTriangle className="w-4 h-4 text-cta" />
            <span>Waiting for the host to submit the elimination...</span>
          </div>
        )}
      </div>
    </GameShell>
  );
}
