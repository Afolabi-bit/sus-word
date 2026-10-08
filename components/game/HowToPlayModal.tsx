"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, Vote, Trophy, X } from "lucide-react";

interface HowToPlayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HowToPlayModal({ open, onOpenChange }: HowToPlayModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-text-primary">
        <DialogHeader className="text-left pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-hint uppercase tracking-wider">
              Rulebook
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold font-heading text-text-primary pt-1">
            How to Play Oddword
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary leading-relaxed pt-1">
            A high-stakes party game of social deduction for 4–10 players.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-base border border-border-subtle/80">
            <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-center text-text-primary shrink-0 mt-0.5">
              <Eye className="w-5 h-5 text-text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-text-primary">
                1. Secret Assignment
              </span>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Everyone sees the secret word, except one random player: <strong className="text-imposter">The Imposter</strong>.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-base border border-border-subtle/80">
            <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-center text-text-primary shrink-0 mt-0.5">
              <MessageSquare className="w-5 h-5 text-text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-text-primary">
                2. Subtle Clues
              </span>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Go around the circle giving single-word clues. Don’t give it away, and listen closely to find who is faking.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-base border border-border-subtle/80">
            <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-center text-text-primary shrink-0 mt-0.5">
              <Vote className="w-5 h-5 text-text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-text-primary">
                3. The Ballot
              </span>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                When the timer expires, deliberate and vote to eliminate the player who seems out of place.
              </p>
            </div>
          </div>

          {/* Winning conditions */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-win/10 border border-win/20">
            <div className="w-9 h-9 rounded-xl bg-win/20 flex items-center justify-center text-win shrink-0 mt-0.5">
              <Trophy className="w-5 h-5 text-win" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-win">
                Victory Conditions
              </span>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                <strong>Civilians win</strong> if they catch the imposter. <strong>Imposter wins</strong> if they survive to the final two.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            size="lg"
            className="w-full h-12 rounded-xl bg-cta text-cta-fg font-bold text-sm cursor-pointer active:scale-[0.96]"
            onClick={() => onOpenChange(false)}
          >
            Got It, Let&apos;s Play
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
