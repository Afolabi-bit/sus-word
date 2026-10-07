"use client";

import { useState } from "react";
import { useOnlineStore } from "@/lib/onlineStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vote, CheckCircle2, Crown, Sparkles, UserCheck } from "lucide-react";
import GameShell from "./GameShell";

export default function OnlineVotingScreen() {
  const isHost = useOnlineStore((s) => s.isHost);
  const players = useOnlineStore((s) => s.players);
  const activePlayers = useOnlineStore((s) => s.activePlayers);
  const myPlayerId = useOnlineStore((s) => s.myPlayerId);
  const myPlayerName = useOnlineStore((s) => s.myPlayerName);
  const myVote = useOnlineStore((s) => s.myVote);
  const votedPlayerIds = useOnlineStore((s) => s.votedPlayerIds);
  const castVote = useOnlineStore((s) => s.castVote);
  const eliminatePlayer = useOnlineStore((s) => s.eliminatePlayer);

  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(myVote);

  // Active players eligible for elimination
  const activePlayerList = players.filter((p) =>
    activePlayers.length > 0 ? activePlayers.includes(p.id) : p.isActive
  );

  const hasVoted = Boolean(myVote || (myPlayerId && votedPlayerIds.includes(myPlayerId)));
  const totalVotesCount = votedPlayerIds.length;
  const totalExpectedCount = activePlayerList.length;

  const selectedPlayer = players.find((p) => p.id === (selectedTargetId || myVote));

  function handleConfirmVote() {
    if (!selectedTargetId) return;
    castVote(selectedTargetId);
  }

  return (
    <GameShell phaseKey="online-voting" layout="scrollable">
      <div className="flex flex-col items-center gap-5 text-center w-full max-w-md mx-auto py-2">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-xs px-3 py-1 font-bold">
            <Vote className="w-3.5 h-3.5 mr-1" /> Secret Ballot
          </Badge>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">
            Cast Your Vote
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
            Tap the player you believe is the Imposter. Once everyone votes, ballots will be tallied!
          </p>
        </div>

        {/* Live Progress Bar */}
        <div className="w-full bg-surface-raised border border-border-subtle rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-text-secondary flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cta" /> Ballots Submitted
            </span>
            <span className="text-cta font-bold font-mono">
              {totalVotesCount} / {totalExpectedCount}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-base overflow-hidden">
            <div
              className="h-full bg-cta transition-all duration-300 rounded-full"
              style={{
                width: `${totalExpectedCount > 0 ? (totalVotesCount / totalExpectedCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Voting Grid */}
        <div className="w-full grid grid-cols-1 gap-2.5">
          {activePlayerList.map((p) => {
            const isSelected = (selectedTargetId || myVote) === p.id;
            const isMe = p.id === myPlayerId || p.displayName === myPlayerName;
            const playerHasVoted = votedPlayerIds.includes(p.id);

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedTargetId(p.id)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? "bg-destructive/15 border-destructive shadow-md ring-1 ring-destructive/40"
                    : "bg-surface-raised border-border-subtle hover:border-border-strong hover:bg-surface-raised/90"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
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
                      {isMe && <span className="text-xs text-text-hint font-normal">(You)</span>}
                    </div>
                    <span className="text-[11px] text-text-secondary">
                      Active Suspect
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {playerHasVoted && (
                    <Badge className="bg-win/15 text-win border-win/30 text-[10px] px-2 py-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Voted
                    </Badge>
                  )}
                  {p.isHost && (
                    <Badge className="bg-cta/15 text-cta border-cta/25 text-[10px] px-1.5 py-0 flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Host
                    </Badge>
                  )}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-destructive bg-destructive"
                        : "border-border-subtle bg-surface-base"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Voting Action Button */}
        <div className="w-full flex flex-col gap-2 pt-2">
          <Button
            size="lg"
            disabled={!selectedTargetId}
            onClick={handleConfirmVote}
            className={`w-full h-14 text-base font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              hasVoted
                ? "bg-surface-raised text-win border border-win/40 hover:bg-surface-base"
                : "bg-destructive text-destructive-fg hover:brightness-105 active:scale-[0.98]"
            }`}
          >
            {hasVoted ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-win" />
                <span>
                  Vote Cast for {selectedPlayer?.displayName || "Player"} (Change)
                </span>
              </>
            ) : (
              <>
                <Vote className="w-5 h-5" />
                <span>
                  {selectedPlayer
                    ? `Vote to Eliminate ${selectedPlayer.displayName}`
                    : "Select a Suspect"}
                </span>
              </>
            )}
          </Button>

          {hasVoted && (
            <div className="p-3 rounded-2xl bg-surface-raised/70 border border-border-subtle flex items-center justify-center gap-2 text-text-secondary text-xs font-medium animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-cta animate-spin" />
              <span>
                Ballot registered! Waiting for remaining players ({totalVotesCount}/{totalExpectedCount})...
              </span>
            </div>
          )}

          {/* Host Emergency Force Tally */}
          {isHost && selectedTargetId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => eliminatePlayer(selectedTargetId)}
              className="text-text-hint hover:text-destructive text-xs py-1 cursor-pointer"
            >
              Host: Force Tally / Eliminate Now
            </Button>
          )}
        </div>
      </div>
    </GameShell>
  );
}
