"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share, X, Smartphone } from "lucide-react";
import { useGameStore } from "@/lib/store";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAInstallPrompt() {
  const phase = useGameStore((s) => s.phase);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [bannerType, setBannerType] = useState<"native" | "ios" | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPlayedOffline, setHasPlayedOffline] = useState(false);

  // Track when user clicks "Play Offline" (game phase transitions away from "home")
  useEffect(() => {
    if (phase !== "home") {
      setHasPlayedOffline(true);
    }
  }, [phase]);

  useEffect(() => {
    // 1. Check if already running in standalone mode (installed app)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    // 2. Check if dismissed in this session
    if (typeof window !== "undefined" && sessionStorage.getItem("susword_pwa_dismissed")) {
      return;
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/i.test(userAgent) && !(window as unknown as { MSStream?: boolean }).MSStream;
    const isStandaloneIOS = (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isIOS && !isStandaloneIOS) {
      setBannerType("ios");
      return;
    }

    // 4. Listen for beforeinstallprompt event on Android / Chromium desktop & mobile
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setBannerType("native");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Show banner only after user clicks "Play Offline" (hasPlayedOffline becomes true)
  useEffect(() => {
    if (hasPlayedOffline && bannerType && !isVisible) {
      if (typeof window !== "undefined" && sessionStorage.getItem("susword_pwa_dismissed")) {
        return;
      }
      setIsVisible(true);
    }
  }, [hasPlayedOffline, bannerType, isVisible]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error("Install prompt error:", err);
    }
  };

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("susword_pwa_dismissed", "true");
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4 bg-[#241E33]/95 backdrop-blur-md border-b border-[#EF9F27]/40 shadow-2xl text-white"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            {/* Left Info Section */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EF9F27]/20 border border-[#EF9F27]/40 flex items-center justify-center shrink-0 text-[#EF9F27]">
                {bannerType === "ios" ? (
                  <Share className="w-5 h-5 text-[#EF9F27]" />
                ) : (
                  <Smartphone className="w-5 h-5 text-[#EF9F27]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-amber-300 truncate">
                  Install SusWord App
                </p>
                {bannerType === "native" && (
                  <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                    Play offline anywhere with single-tap access!
                  </p>
                )}
                {bannerType === "ios" && (
                  <p className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-1 flex-wrap">
                    Tap <Share className="w-3 h-3 inline text-[#EF9F27]" /> then select{" "}
                    <span className="font-semibold text-white">"Add to Home Screen"</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right Action Section */}
            <div className="flex items-center gap-2 shrink-0">
              {bannerType === "native" && (
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#EF9F27] hover:bg-[#d98b1d] text-[#1D1726] font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Install</span>
                </button>
              )}

              <button
                onClick={handleDismiss}
                aria-label="Dismiss install prompt"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

