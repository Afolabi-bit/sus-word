"use client";

import { useOnlineStore } from "@/lib/onlineStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Sparkles, Users, Vote, Scale } from "lucide-react";
import GameShell from "./GameShell";

export default function OnlineResultScreen() {
  const isHost = useOnlineStore((s) => s.isHost);
  const lastEliminated = useOnlineStore((s) => s.lastEliminated);
  const activePlayers = useOnlineStore((s) => s.activePlayers);
  const votingResults = useOnlineStore((s) => s.votingResults);
  const startDiscussion = useOnlineStore((s) => s.startDiscussion);

  const isTie = votingResults?.isTie && !lastEliminated;
  const wasImposter = lastEliminated?.wasImposter;
  const victimName = lastEliminated?.displayName || "Player";

  return (
    <GameShell phaseKey="online-result" layout="centered">
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto py-4">
        {/* Status Badge */}
        {isTie ? (
          <Badge className="bg-surface-raised text-text-primary border-border-subtle text-xs px-3 py-1 font-bold">
            <Scale className="w-3.5 h-3.5 mr-1" /> Tie Vote
          </Badge>
        ) : (
          <Badge
            className={`text-xs px-3 py-1 font-bold ${
              wasImposter
                ? "bg-imposter/20 text-imposter border-imposter/30"
                : "bg-destructive/20 text-destructive border-destructive/30"
            }`}
          >
            {wasImposter ? "Imposter Caught!" : "Innocent Civilian!"}
          </Badge>
        )}

        <div className="flex flex-col items-center gap-2">
          {isTie ? (
            <>
              <h2 className="text-3xl font-black text-text-primary tracking-tight">
                No One Was Eliminated!
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                The vote resulted in a deadlock. The game continues to another round of discussion!
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Voting Breakdown Card */}
        {votingResults?.votes && Object.keys(votingResults.votes).length > 0 && (
          <Card className="w-full bg-surface-raised border-border-subtle rounded-3xl text-left shadow-sm">
            <CardContent className="p-4 sm:p-5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                <Vote className="w-4 h-4 text-text-secondary" />
                <span>Ballot Breakdown</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {Object.entries(votingResults.votes).map(([voter, target], i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-surface-base border border-border-subtle"
                  >
                    <span className="font-medium text-text-primary">{voter}</span>
                    <span className="text-text-secondary">
                      voted for <strong className="text-text-primary">{target}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Remaining Players Card */}
        <Card className="w-full bg-surface-raised border-border-subtle rounded-3xl text-left shadow-sm">
          <CardContent className="p-4 sm:p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-text-secondary" /> Active Survivors
              </span>
              <span>{activePlayers.length} remaining</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Keep questioning everyone&apos;s statements and find the real imposter!
            </p>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="w-full pt-2">
          {isHost ? (
            <Button
              size="lg"
              onClick={startDiscussion}
              className="w-full h-14 text-base font-bold rounded-2xl bg-cta text-cta-fg shadow-lg hover:brightness-105 active:scale-[0.96] transition-[transform,filter] duration-150 flex items-center justify-center gap-2 cursor-pointer"
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
