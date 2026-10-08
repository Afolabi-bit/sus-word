"use client";

import { useState } from "react";
import { useOnlineStore } from "@/lib/onlineStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Wifi, Plus, LogIn, Loader2, AlertCircle } from "lucide-react";

interface OnlineEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OnlineEntryModal({
  open,
  onOpenChange,
}: OnlineEntryModalProps) {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [hostName, setHostName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const status = useOnlineStore((s) => s.status);
  const serverError = useOnlineStore((s) => s.error);
  const createRoom = useOnlineStore((s) => s.createRoom);
  const joinRoom = useOnlineStore((s) => s.joinRoom);
  const clearError = useOnlineStore((s) => s.clearError);

  const isSubmitting = status === "connecting";

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const name = hostName.trim();
    if (!name) {
      setLocalError("Please enter your name.");
      return;
    }

    const res = await createRoom(name);
    if (res.success) {
      onOpenChange(false);
    } else if (res.error) {
      setLocalError(res.error);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const code = roomCode.trim().toUpperCase();
    const name = joinName.trim();

    if (!code || code.length < 4) {
      setLocalError("Please enter a valid 6-letter room code.");
      return;
    }
    if (!name) {
      setLocalError("Please enter your name.");
      return;
    }

    const res = await joinRoom(code, name);
    if (res.success) {
      onOpenChange(false);
    } else if (res.error) {
      setLocalError(res.error);
    }
  }

  const activeError = localError || serverError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-surface-base border border-border-subtle text-text-primary flex items-center justify-center">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-text-primary">
                Online Multiplayer
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary">
                Play in real-time across separate phones or computers
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-surface-base border border-border-subtle rounded-2xl my-2">
          <button
            type="button"
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === "create"
                ? "bg-cta text-cta-fg shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
            onClick={() => {
              setTab("create");
              setLocalError(null);
              clearError();
            }}
          >
            <Plus className="w-4 h-4" />
            Create Room
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === "join"
                ? "bg-cta text-cta-fg shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
            onClick={() => {
              setTab("join");
              setLocalError(null);
              clearError();
            }}
          >
            <LogIn className="w-4 h-4" />
            Join with Code
          </button>
        </div>

        {/* Error Banner */}
        {activeError && (
          <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 flex items-start gap-2.5 text-xs text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{activeError}</span>
          </div>
        )}

        {/* Create Room Form */}
        {tab === "create" ? (
          <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-1">
            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="host-name"
                className="text-xs font-semibold text-text-secondary"
              >
                Your Nickname
              </label>
              <Input
                id="host-name"
                type="text"
                maxLength={20}
                placeholder="e.g. Detective Holmes"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                autoFocus
                disabled={isSubmitting}
                className="h-12 bg-surface-base border-border-subtle text-text-primary rounded-xl focus:border-cta font-medium"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full h-12 bg-cta text-cta-fg hover:brightness-105 font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2 active:scale-[0.96] transition-[transform,filter] duration-150"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Room...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Room as Host
                </>
              )}
            </Button>
          </form>
        ) : (
          /* Join Room Form */
          <form onSubmit={handleJoin} className="flex flex-col gap-4 mt-1">
            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="room-code"
                className="text-xs font-semibold text-text-secondary"
              >
                6-Letter Room Code
              </label>
              <Input
                id="room-code"
                type="text"
                maxLength={6}
                placeholder="e.g. 82RCJ4"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                autoFocus
                disabled={isSubmitting}
                className="h-12 bg-surface-base border-border-subtle text-text-primary rounded-xl focus:border-cta font-mono font-bold tracking-widest text-center text-lg uppercase"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="join-name"
                className="text-xs font-semibold text-text-secondary"
              >
                Your Nickname
              </label>
              <Input
                id="join-name"
                type="text"
                maxLength={20}
                placeholder="e.g. Watson"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                disabled={isSubmitting}
                className="h-12 bg-surface-base border-border-subtle text-text-primary rounded-xl focus:border-cta font-medium"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full h-12 bg-cta text-cta-fg hover:brightness-105 font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2 active:scale-[0.96] transition-[transform,filter] duration-150"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Joining Room...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Join Room
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
